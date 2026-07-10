<template>
  <el-table
    v-if="tableRendered"
    v-bind="attrs"
    ref="tableRef"
    v-loading="loading"
    class="hyn-table data-table"
    border
    :data="rows"
    :row-key="getElementRowKey"
    :height="height"
    :max-height="maxHeight"
    :highlight-current-row="currentRowKey !== null"
    :row-class-name="getRowClassName"
    :empty-text="resolvedEmptyText"
    :default-sort="defaultSort"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
    @row-click="row => emit('row-click', row)"
  >
    <el-table-column
      v-if="columnsReady && selectionEnabled"
      type="selection"
      width="55"
      align="center"
      reserve-selection
    />
    <el-table-column
      v-for="column in visibleColumns"
      :key="column.key"
      :label="column.label"
      :prop="column.prop"
      :type="column.elementType"
      :width="column.columnWidth"
      :min-width="column.columnMinWidth"
      :align="column.align ?? 'center'"
      :fixed="column.fixed"
      :sortable="column.sortable"
      :sort-orders="column.sortOrders"
      :show-overflow-tooltip="false"
      :class-name="column.columnClassName"
      :header-class-name="column.columnClassName"
    >
      <template #default="scope">
        <template v-if="isRealTableCellScope(scope)">
          <HynTableActionCell
            v-if="column.actions !== undefined"
            :row="scope.row"
            :actions="column.actions"
            :permission-checked="true"
          />
          <span v-else-if="column.type === 'index'">{{ scope.$index + 1 }}</span>
          <HynTableOverflowCell v-else-if="column.ellipsis" :content="formatCellValue(scope.row, column, scope.$index)">
            <slot
              v-if="column.slot"
              :name="getSlotName(column)"
              :row="scope.row"
              :row-index="scope.$index"
              :value="resolveColumnValue(scope.row, column)"
              :column="column"
            >
              {{ formatCellValue(scope.row, column, scope.$index) }}
            </slot>
            <span v-else>{{ formatCellValue(scope.row, column, scope.$index) }}</span>
          </HynTableOverflowCell>
          <div
            v-else
            class="hyn-table__cell-text"
            :class="`is-overflow-${column.overflowMode}`"
          >
            <slot
              v-if="column.slot"
              :name="getSlotName(column)"
              :row="scope.row"
              :row-index="scope.$index"
              :value="resolveColumnValue(scope.row, column)"
              :column="column"
            >
              {{ formatCellValue(scope.row, column, scope.$index) }}
            </slot>
            <span v-else>{{ formatCellValue(scope.row, column, scope.$index) }}</span>
          </div>
        </template>
      </template>
    </el-table-column>
  </el-table>
  <el-tooltip
    v-if="tooltipState.reference"
    :visible="tooltipState.visible"
    :content="tooltipState.content"
    :virtual-ref="tooltipState.reference"
    virtual-triggering
    effect="dark"
    placement="top"
    popper-class="hyn-table-tooltip-provider"
    :persistent="false"
    :show-after="0"
    :hide-after="0"
    teleported
  />
</template>

<script setup lang="ts" generic="TRow">
import type { TableInstance as ElTableInstance } from 'element-plus';
import { computed, nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, useAttrs, watch } from 'vue';
import { parseTime } from '@7mrlan/hyn-ui/runtime';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import { checkPermi } from '@7mrlan/hyn-ui/runtime';
import HynTableActionCell from './internal/HynTableActionCell.vue';
import HynTableOverflowCell from './internal/HynTableOverflowCell.vue';
import { useHynGlobalConfig } from '../config';
import { useHynTableTooltipProvider } from '../internal/tableTooltip';
import {
  measureHynTextWidth,
  parseHynCssSizeToPixels,
  resolveHynMeasureFont,
  resolveHynTextOverflowMode,
  type HynTextOverflowMode
} from '../shared/overflow';
import type {
  HynTableColumn,
  HynTableAction,
  HynTableKey,
  HynTableResolvedSortOrder,
  HynTableSelectionChange,
  HynTableSlotScope,
  HynTableSortChange,
  HynTableSortOrder,
  HynTableSortState
} from './types';

const props = withDefaults(
  defineProps<{
    /** 表格当前页数据行，组件只负责展示和选择态同步，不持有分页状态。 */
    rows: TRow[];
    /** HYN 列配置，决定列宽、slot、formatter、排序和操作列渲染。 */
    columns: HynTableColumn<TRow>[];
    /** 行主键解析函数，Element Plus reserve-selection 和高亮都依赖该 key 稳定。 */
    rowKey: (row: TRow) => HynTableKey;
    /** 追加到最右侧的统一操作列；未传时不生成额外列。 */
    actions?: HynTableColumn<TRow>['actions'];
    /** 受控选中主键列表，用于跨分页或刷新后恢复选择态。 */
    selectedRowKeys?: HynTableKey[];
    /** 当前高亮行主键；传 null 表示关闭 current-row 高亮。 */
    currentRowKey?: HynTableKey | null;
    /** 表格加载态，透传给 Element Plus loading 指令。 */
    loading?: boolean;
    /** 空数据文案；未传时使用系统统一无数据文案。 */
    emptyText?: string;
    /** 固定表格高度，传给 Element Plus Table。 */
    height?: string | number;
    /** 最大表格高度，传给 Element Plus Table。 */
    maxHeight?: string | number;
    /** 默认排序状态，和后端排序查询 hook 保持同一事件协议。 */
    defaultSort?: HynTableSortState;
    /** 旧版选择开关，保留给既有页面；新代码优先使用 selection。 */
    showSelection?: boolean;
    /** 是否展示选择列，选择结果通过 selectedRowKeys 受控回写。 */
    selection?: boolean;
    /** 文本溢出显示策略；未传时继承 HYN 全局配置。 */
    overflowMode?: HynTextOverflowMode;
  }>(),
  {
    actions: undefined,
    selectedRowKeys: () => [],
    currentRowKey: null,
    loading: false,
    emptyText: undefined,
    height: undefined,
    maxHeight: undefined,
    defaultSort: undefined,
    showSelection: false,
    selection: false
  }
);

const emit = defineEmits<{
  /** 选择变化时回写主键列表，父组件负责保存受控状态。 */
  'update:selectedRowKeys': [selectedRowKeys: HynTableKey[]];
  /** 选择变化时同时返回完整行和主键，供批量按钮联动。 */
  'selection-change': [payload: HynTableSelectionChange<TRow>];
  /** 排序变化事件，业务页可直接转成后端排序查询参数。 */
  'sort-change': [payload: HynTableSortChange<TRow>];
  /** 行点击事件，用于详情、高亮或主从表联动。 */
  'row-click': [row: TRow];
}>();

defineSlots<Record<string, (props: HynTableSlotScope<TRow>) => unknown>>();

interface HynElementTableCellScope<TRow> {
  row: TRow;
  $index: number;
}

interface HynElementTableSortChange<TRow> {
  column?: unknown;
  prop: string;
  order: HynTableSortOrder;
  row?: TRow;
}

type HynElementColumnType = 'index' | undefined;

type HynTableResolvedColumn<TRow> = HynTableColumn<TRow> & {
  elementType: HynElementColumnType;
  columnWidth: string | number | undefined;
  columnMinWidth: number | undefined;
  overflowMode: HynTextOverflowMode;
  ellipsis: boolean;
  columnClassName: string;
};

defineOptions({
  inheritAttrs: false
});

// 表格级 tooltip 会让模板成为多根节点，attrs 必须显式落到 el-table 才不破坏公共组件透传契约。
const attrs = useAttrs();
const tooltipState = useHynTableTooltipProvider();
// 底层 Element Plus 表格实例，负责选择同步、排序和 doLayout 校准。
const tableRef = ref<ElTableInstance>();
// KeepAlive 失活时只释放表格 DOM 和监听器，页面数据、查询条件和选中状态仍由父页缓存保留。
const tableRendered = ref(true);
// Element Plus 动态列需要等内部 hiddenColumns 容器挂载后再渲染，否则列注册会丢失。
const columnsReady = ref(false);
// 表格容器真实宽度用于百分比列宽换算和文本测量。
const tableWidth = ref(0);
const bodyMeasureFont = ref('normal normal 400 14px Arial, sans-serif');
// 表头字体和正文不同，表头宽度测量必须单独缓存。
const headerMeasureFont = ref('normal normal 500 14px Arial, sans-serif');
const { t } = useHynI18n();
const hynConfig = useHynGlobalConfig();
// 观察表格容器尺寸变化，KeepAlive 失活和卸载时必须释放。
let resizeObserver: ResizeObserver | null = null;
// requestAnimationFrame 队列 id，用于取消隐藏缓存页中的 doLayout。
let layoutFrameId: number | null = null;
// 无 RAF 环境的兜底队列 id，生命周期上和 layoutFrameId 同步清理。
let layoutTimeoutId: ReturnType<typeof setTimeout> | null = null;
// 高频页签来回切换时不立即销毁表格 DOM；真正闲置的缓存页才释放重表格节点和监听器。
let inactiveDomReleaseTimeoutId: ReturnType<typeof setTimeout> | null = null;
// KeepAlive 切页只触发 deactivated，不会卸载组件；该标记用于阻断隐藏缓存页里的 observer 回调和排队 layout。
let tableActive = false;
const actionButtonSize = 28;
const actionButtonGap = 8;
const actionColumnPadding = 32;
const actionColumnMinWidth = 96;
const appendedActionColumnKey = '__hyn_actions';
const dateColumnWidth = 180;
const indexColumnWidth = 64;
const textColumnMinWidth = 120;
const tableCellHorizontalPadding = 24;
const tableCellSafetyWidth = 12;
const sortableHeaderExtraWidth = 28;
const inactiveDomReleaseDelayMs = 2500;
// 选中主键按字符串比较，兼容后端数字和字符串主键混用。
const selectedKeySet = computed(() => new Set(props.selectedRowKeys.map(key => String(key))));
// 兼容旧 showSelection 和新 selection 两个开关，模板只消费统一结果。
const selectionEnabled = computed(() => props.showSelection || props.selection);
// 空数据文案在表格层兜底，避免每个业务页重复读取 i18n。
const resolvedEmptyText = computed(() => props.emptyText ?? t('app.common.noData'));
// 文本溢出策略优先用表格入参，未传时继承 HYN 全局配置。
const tableOverflowMode = computed<HynTextOverflowMode>(() => resolveHynTextOverflowMode(props.overflowMode, hynConfig.overflowMode));
// 业务 actions 会被追加成固定操作列，调用方无需在 columns 里重复声明。
const displayColumns = computed(() => {
  if (!props.actions || props.actions.length === 0) {
    return props.columns;
  }
  return [
    ...props.columns,
    {
      key: appendedActionColumnKey,
      label: t('app.common.action'),
      align: 'center',
      fixed: 'right',
      overflowMode: 'fit',
      actions: props.actions
    } satisfies HynTableColumn<TRow>
  ];
});
// 列容器准备好之前不渲染业务列；准备好之后把模板期重复计算收敛到一次 computed。
const visibleColumns = computed<HynTableResolvedColumn<TRow>[]>(() => {
  if (!columnsReady.value) {
    return [];
  }
  return displayColumns.value.map(column => resolveTableColumn(column));
});

watch(
  () => [props.rows, props.selectedRowKeys] as const,
  () => {
    syncSelection();
  },
  { flush: 'post', deep: false }
);

watch(
  () => [props.rows, props.columns, props.height, props.maxHeight, tableOverflowMode.value] as const,
  () => {
    scheduleTableLayout();
  },
  { flush: 'post', deep: false }
);

onMounted(() => {
  tableActive = true;
  tableRendered.value = true;
  observeTableResize();
  enableColumnsAfterTableMounted();
});

onActivated(() => {
  tableActive = true;
  cancelInactiveDomRelease();
  tableRendered.value = true;
  columnsReady.value = false;
  void nextTick(() => {
    observeTableResize();
    enableColumnsAfterTableMounted();
  });
});

onDeactivated(() => {
  tableActive = false;
  tooltipState.hide();
  disconnectTableResize();
  cancelScheduledTableLayout();
  scheduleInactiveDomRelease();
});

onBeforeUnmount(() => {
  tableActive = false;
  cancelInactiveDomRelease();
  tooltipState.hide();
  disconnectTableResize();
  cancelScheduledTableLayout();
});

/** 取消缓存页 DOM 延迟释放；用户快速切回页面时保留原表格，避免频繁销毁重建影响交互峰值。 */
function cancelInactiveDomRelease(): void {
  if (inactiveDomReleaseTimeoutId === null) {
    return;
  }
  clearTimeout(inactiveDomReleaseTimeoutId);
  inactiveDomReleaseTimeoutId = null;
}

/** KeepAlive 失活不等于关闭页签；延迟释放只针对真正闲置的缓存页，保留快速切回体验。 */
function scheduleInactiveDomRelease(): void {
  cancelInactiveDomRelease();
  inactiveDomReleaseTimeoutId = setTimeout(() => {
    inactiveDomReleaseTimeoutId = null;
    if (tableActive) {
      return;
    }
    tableRendered.value = false;
    columnsReady.value = false;
  }, inactiveDomReleaseDelayMs);
}

/** 释放表格尺寸观察器，避免缓存页被切走后仍通过 ResizeObserver 持有旧 DOM。 */
function disconnectTableResize(): void {
  resizeObserver?.disconnect();
  resizeObserver = null;
}

/** 读取 Element Plus 表格根元素，用于监听容器尺寸变化。 */
function getTableElement(): HTMLElement | null {
  const element = tableRef.value?.$el;
  return element instanceof HTMLElement ? element : null;
}

/** 监听表格容器尺寸变化；每次重新绑定前先释放旧 observer，防止 activated 重入时重复观察同一 DOM。 */
function observeTableResize(): void {
  // activated 可能被多次触发，先断开旧 observer 才能保证 ResizeObserver 回调不会累积。
  disconnectTableResize();
  const element = getTableElement();
  if (!element || typeof ResizeObserver === 'undefined') {
    return;
  }
  refreshTableMeasureContext();
  resizeObserver = new ResizeObserver(() => {
    // ResizeObserver 回调可能在 deactivated 之后才交付；这里兜住隐藏缓存页的迟到回调。
    if (!tableActive) {
      return;
    }
    refreshTableMeasureContext();
    scheduleTableLayout();
  });
  resizeObserver.observe(element);
}

/** 刷新表格宽度和字体，当前语言或父容器变化时列宽按真实像素重算。 */
function refreshTableMeasureContext(): void {
  const element = getTableElement();
  if (!element) {
    return;
  }
  tableWidth.value = element.getBoundingClientRect().width;
  bodyMeasureFont.value = resolveHynMeasureFont(element, undefined);
  headerMeasureFont.value = resolveHynMeasureFont(element, '500');
}

/** 等 Element Plus 表格 hiddenColumns 容器挂载完成后再渲染列，避免动态列过早注册失败。 */
function enableColumnsAfterTableMounted(): void {
  void nextTick(() => {
    if (!tableActive || !tableRendered.value) {
      return;
    }
    refreshTableMeasureContext();
    columnsReady.value = true;
    void nextTick(() => {
      if (!tableActive || !tableRendered.value) {
        return;
      }
      syncSelection();
      scheduleTableLayout();
    });
  });
}

/** 取消已排队的布局计算，避免组件卸载后仍触发表格 doLayout。 */
function cancelScheduledTableLayout(): void {
  if (layoutFrameId !== null && typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(layoutFrameId);
    layoutFrameId = null;
  }
  if (layoutTimeoutId !== null) {
    clearTimeout(layoutTimeoutId);
    layoutTimeoutId = null;
  }
}

/** 延后一帧触发布局计算；缓存页失活后会丢弃队列，避免隐藏页面继续触发 Element Plus doLayout。 */
function scheduleTableLayout(): void {
  cancelScheduledTableLayout();
  // 失活页没有可见宽度，继续排 doLayout 只会制造隐藏 DOM 测量和无效 retained path。
  if (!tableActive) {
    return;
  }
  const runLayout = (): void => {
    layoutFrameId = null;
    layoutTimeoutId = null;
    if (!tableActive) {
      return;
    }
    void nextTick(() => {
      // nextTick 前后都可能发生路由切换，最终执行 doLayout 前必须再确认表格仍处于激活状态。
      if (!tableActive) {
        return;
      }
      tableRef.value?.doLayout();
    });
  };
  if (typeof requestAnimationFrame !== 'function') {
    layoutTimeoutId = setTimeout(runLayout, 0);
    return;
  }
  layoutFrameId = requestAnimationFrame(runLayout);
}

/** 根据外部选中主键同步 Element Plus 表格选择态，并在同步后校准列宽。 */
function syncSelection(): void {
  const table = tableRef.value;
  if (!table || !selectionEnabled.value || !columnsReady.value) {
    return;
  }
  props.rows.forEach(row => {
    table.toggleRowSelection(row, selectedKeySet.value.has(String(props.rowKey(row))));
  });
  scheduleTableLayout();
}

/** 将 HYN 对外支持的数字或字符串主键转换为 Element Plus Table 需要的稳定字符串主键。 */
function getElementRowKey(row: TRow): string {
  return String(props.rowKey(row));
}

/** 过滤 Element Plus 注册列时传入的虚拟 scope，避免业务 slot 内开关等组件误触发副作用。 */
function isRealTableCellScope(scope: HynElementTableCellScope<TRow>): boolean {
  return scope.$index >= 0 && scope.row !== null && scope.row !== undefined;
}

/** 解析列对应的 Element Plus 原生列类型。 */
function getElementColumnType(column: HynTableColumn<TRow>): 'index' | undefined {
  if (column.type === 'index') {
    return 'index';
  }
  return undefined;
}

/** 权限是登录人维度的稳定条件，提前过滤可避免每行每个 action 重复调用权限判断。 */
function getPermittedActions(actions: HynTableAction<TRow>[]): HynTableAction<TRow>[] {
  return actions.filter(action => !action.permissions || action.permissions.length === 0 || checkPermi(action.permissions));
}

/** 预解析列宽、溢出协议和样式类，减少渲染期为每个单元格重复创建字符串和计算宽度。 */
function resolveTableColumn(column: HynTableColumn<TRow>): HynTableResolvedColumn<TRow> {
  const permittedActions = column.actions === undefined ? undefined : getPermittedActions(column.actions);
  const resolvedColumn = permittedActions === undefined ? column : { ...column, actions: permittedActions };
  const overflowMode = getColumnOverflowMode(resolvedColumn);

  return {
    ...resolvedColumn,
    elementType: getElementColumnType(resolvedColumn),
    columnWidth: getColumnWidth(resolvedColumn),
    columnMinWidth: getColumnMinWidth(resolvedColumn),
    overflowMode,
    ellipsis: isEllipsisColumn(resolvedColumn),
    columnClassName: getColumnClassName(resolvedColumn)
  };
}

/** 计算操作列宽度，避免业务页重复手写按钮宽度。 */
function getActionColumnWidth(actionButtonCount: number): number {
  const normalizedCount = Math.max(1, actionButtonCount);
  return Math.max(
    actionColumnMinWidth,
    normalizedCount * actionButtonSize + (normalizedCount - 1) * actionButtonGap + actionColumnPadding
  );
}

/** 读取列配置中的固定或最小尺寸，并把百分比按当前表格宽度换算。 */
function getConfiguredColumnWidth(column: HynTableColumn<TRow>): number | undefined {
  const width = parseHynCssSizeToPixels(column.width, tableWidth.value);
  const minWidth = parseHynCssSizeToPixels(column.minWidth, tableWidth.value);
  if (width === undefined) {
    return minWidth;
  }
  if (minWidth === undefined) {
    return width;
  }
  return Math.max(width, minWidth);
}

/** 根据当前语言表头计算列最小宽度，避免英文标题在有空间时被省略。 */
function getHeaderContentWidth(column: HynTableColumn<TRow>): number {
  const sortWidth = column.sortable ? sortableHeaderExtraWidth : 0;
  return measureHynTextWidth(column.label, headerMeasureFont.value) + tableCellHorizontalPadding + tableCellSafetyWidth + sortWidth;
}

/** 根据当前页文本内容计算列最小宽度，默认策略不让普通文本无提示截断。 */
function getBodyContentWidth(column: HynTableColumn<TRow>): number {
  if (column.slot || column.actions !== undefined || column.type === 'index') {
    return 0;
  }
  return props.rows.reduce((maxWidth, row, rowIndex) => {
    const content = formatCellValue(row, column, rowIndex);
    return Math.max(maxWidth, measureHynTextWidth(content, bodyMeasureFont.value) + tableCellHorizontalPadding + tableCellSafetyWidth);
  }, 0);
}

/** 固定列只用于索引和操作区，普通业务列通过 min-width 参与剩余空间分配。 */
function getColumnWidth(column: HynTableColumn<TRow>): string | number | undefined {
  if (column.actions !== undefined) {
    return getActionColumnWidth(column.actions.length);
  }
  if (column.type === 'index') {
    return Math.max(indexColumnWidth, getConfiguredColumnWidth(column) ?? 0, getHeaderContentWidth(column));
  }
  return undefined;
}

/** 计算列最小宽度，综合调用方期望宽度、表头和当前页文本宽度。 */
function getColumnMinWidth(column: HynTableColumn<TRow>): number | undefined {
  if (column.actions !== undefined || column.type === 'actions') {
    return getActionColumnWidth(column.actions?.length ?? 1);
  }
  if (column.type === 'index') {
    return Math.max(indexColumnWidth, getConfiguredColumnWidth(column) ?? 0, getHeaderContentWidth(column));
  }
  const defaultWidth = column.type === 'date' ? dateColumnWidth : textColumnMinWidth;
  return Math.ceil(
    Math.max(defaultWidth, getConfiguredColumnWidth(column) ?? 0, getHeaderContentWidth(column), getBodyContentWidth(column))
  );
}

/** 解析列的文本溢出策略，操作列和索引列不参与文本省略协议。 */
function getColumnOverflowMode(column: HynTableColumn<TRow>): HynTextOverflowMode {
  if (column.actions !== undefined || column.type === 'index') {
    return 'fit';
  }
  if (column.tooltip === true) {
    return 'ellipsis';
  }
  if (column.tooltip === false) {
    return 'fit';
  }
  return resolveHynTextOverflowMode(column.overflowMode, tableOverflowMode.value);
}

function isEllipsisColumn(column: HynTableColumn<TRow>): boolean {
  if (column.actions !== undefined || column.type === 'index') {
    return false;
  }
  return getColumnOverflowMode(column) === 'ellipsis';
}

/** 操作列复用固定按钮样式，文本列输出 overflowMode class 供 Element Plus cell 样式覆盖。 */
function getColumnClassName(column: HynTableColumn<TRow>): string {
  const classes = [`is-overflow-${getColumnOverflowMode(column)}`];
  if (column.actions !== undefined || column.type === 'actions') {
    classes.push('small-padding', 'fixed-width');
  }
  return classes.join(' ');
}

function getSlotName(column: HynTableColumn<TRow>): string {
  return column.slot ?? column.key;
}

function resolveColumnValue(row: TRow, column: HynTableColumn<TRow>): unknown {
  if (!column.prop || row === null || typeof row !== 'object') {
    return '';
  }
  return (row as Record<string, unknown>)[column.prop];
}

/** 将单元格值格式化为可展示文本，日期列统一套项目既有 parseTime。 */
function formatCellValue(row: TRow, column: HynTableColumn<TRow>, rowIndex: number): string {
  const value = resolveColumnValue(row, column);
  if (column.formatter) {
    const formatted = column.formatter({ row, rowIndex, value });
    return formatted === undefined || formatted === null ? '' : String(formatted);
  }
  if (column.type === 'date') {
    return parseTime(value as string | number | Date | undefined, column.dateFormat) ?? '';
  }
  return value === undefined || value === null ? '' : String(value);
}

/** 标记当前业务行，视觉跟 Element Plus current-row token 保持一致。 */
function getRowClassName({ row }: { row: TRow }): string {
  if (props.currentRowKey === null || props.currentRowKey === undefined) {
    return '';
  }
  return String(props.rowKey(row)) === String(props.currentRowKey) ? 'current-row' : '';
}

/** 将 Element Plus 选择数组转换成稳定主键和完整行，供列表页批量按钮复用。 */
function handleSelectionChange(selectedRows: TRow[]): void {
  const selectedRowKeys = selectedRows.map(row => props.rowKey(row));
  emit('update:selectedRowKeys', selectedRowKeys);
  emit('selection-change', {
    selectedRows,
    selectedRowKeys
  });
}

/** 将 Element Plus 排序事件透出，业务页仍可沿用后端排序查询 hook。 */
function handleSortChange(payload: HynElementTableSortChange<TRow>): void {
  emit('sort-change', {
    column: payload.column,
    prop: payload.prop,
    order: payload.order,
    row: payload.row
  });
}

defineExpose({
  clearSelection: () => tableRef.value?.clearSelection(),
  toggleRowSelection: (row: unknown, selected?: boolean) => tableRef.value?.toggleRowSelection(row, selected),
  sort: (prop: string, order: HynTableResolvedSortOrder) => tableRef.value?.sort(prop, order)
});
</script>

<style lang="scss" scoped>
.hyn-table {
  width: 100%;
}

.hyn-table :deep(.hyn-table-action-cell) {
  min-height: 28px;
}

.hyn-table__cell-text {
  display: block;
  width: 100%;
  min-width: 0;
  line-height: inherit;
}

.hyn-table__cell-text.is-overflow-fit {
  overflow: visible;
  text-overflow: clip;
  white-space: nowrap;
  word-break: keep-all;
}

.hyn-table__cell-text.is-overflow-wrap {
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
  overflow-wrap: anywhere;
}

.hyn-table :deep(.el-table__cell.is-overflow-fit > .cell),
.hyn-table :deep(.el-table__cell.is-overflow-wrap > .cell) {
  overflow: visible;
  text-overflow: clip;
}

.hyn-table :deep(.el-table__cell.is-overflow-fit > .cell) {
  white-space: nowrap;
  word-break: keep-all;
}

.hyn-table :deep(.el-table__cell.is-overflow-wrap > .cell) {
  white-space: normal;
  overflow-wrap: anywhere;
}

.hyn-table :deep(.el-table__cell.is-overflow-ellipsis > .cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hyn-table :deep(.el-table__cell.el-table-fixed-column--left),
.hyn-table :deep(.el-table__cell.el-table-fixed-column--right) {
  background: var(--el-table-tr-bg-color, var(--el-bg-color));
}

.hyn-table :deep(.el-table__body tr:hover > .el-table__cell.el-table-fixed-column--left),
.hyn-table :deep(.el-table__body tr:hover > .el-table__cell.el-table-fixed-column--right) {
  background: var(--el-table-row-hover-bg-color);
}

.hyn-table :deep(.el-table__body tr.current-row > .el-table__cell.el-table-fixed-column--left),
.hyn-table :deep(.el-table__body tr.current-row > .el-table__cell.el-table-fixed-column--right) {
  background: var(--el-table-current-row-bg-color, var(--el-color-primary-light-9));
}

.hyn-table :deep(.el-table__header .el-table__cell.el-table-fixed-column--left),
.hyn-table :deep(.el-table__header .el-table__cell.el-table-fixed-column--right) {
  background: var(--el-table-header-bg-color);
}
</style>
