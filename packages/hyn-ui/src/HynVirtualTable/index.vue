<template>
  <div
    class="hyn-table data-table"
    :class="{ 'is-horizontal-overflow': hasHorizontalOverflow }"
    :style="tableStyle"
    role="grid"
    :aria-busy="loading"
  >
    <div ref="scrollElement" class="hyn-table__scroll" @scroll="handleScroll">
      <div class="hyn-table__header" role="row" :style="headerStyle">
        <div
          v-if="selection"
          class="hyn-table__header-cell hyn-table__selection-cell is-center"
          :style="selectionColumnStyle"
          role="columnheader"
        >
          <el-checkbox
            v-if="multiple"
            class="hyn-table__checkbox"
            :model-value="allVisibleRowsSelected"
            :indeterminate="someVisibleRowsSelected"
            :disabled="selectableRows.length === 0"
            :aria-label="t('app.table.selectAll')"
            @change="checked => handleSelectAllChange(Boolean(checked))"
          />
        </div>
        <div
          v-for="column in columns"
          :key="column.key"
          class="hyn-table__header-cell"
          :class="getCellClasses(column)"
          :style="getColumnStyle(column)"
          role="columnheader"
        >
          <HynOverflowText
            v-if="isEllipsisColumn(column)"
            :content="column.title"
            mode="ellipsis"
            class="hyn-table__header-text"
          >
            {{ column.title }}
          </HynOverflowText>
          <span v-else class="hyn-table__header-text" :class="`is-overflow-${getColumnOverflowMode(column)}`">
            {{ column.title }}
          </span>
        </div>
      </div>

      <div
        v-if="loading && rows.length === 0"
        class="hyn-table__skeleton"
        :style="loadingTableStyle"
      >
        <div v-for="rowIndex in skeletonRows" :key="rowIndex" class="hyn-table__row is-skeleton">
          <div v-if="selection" class="hyn-table__cell hyn-table__selection-cell" :style="selectionColumnStyle">
            <span class="hyn-table__skeleton-dot" />
          </div>
          <div
            v-for="column in columns"
            :key="column.key"
            class="hyn-table__cell"
            :class="getCellClasses(column)"
            :style="getColumnStyle(column)"
          >
            <span class="hyn-table__skeleton-bar" :style="{ width: getSkeletonWidth(column, rowIndex) }" />
          </div>
        </div>
      </div>

      <div v-else-if="rows.length === 0" class="hyn-table__empty" :style="loadingTableStyle">
        {{ resolvedEmptyText }}
      </div>

      <div
        v-else
        class="hyn-table__body-spacer"
        :style="bodySpacerStyle"
        role="rowgroup"
      >
        <div
          v-for="virtualRow in virtualRows"
          :key="getVirtualRowKey(virtualRow.index, virtualRow.key)"
          class="hyn-table__row"
          :class="{
            'is-selected': isRowSelected(rows[virtualRow.index]),
            'is-current': isCurrentRow(rows[virtualRow.index]),
            'is-hovered': isHoveredRow(rows[virtualRow.index]),
            'is-disabled': isRowDisabled(rows[virtualRow.index])
          }"
          :style="getVirtualRowStyle(virtualRow.start, virtualRow.size)"
          role="row"
          @click="handleRowClick(rows[virtualRow.index])"
          @mouseenter="handleRowMouseEnter(rows[virtualRow.index])"
          @mouseleave="handleRowMouseLeave(rows[virtualRow.index])"
        >
          <template v-if="rows[virtualRow.index]">
            <div
              v-if="selection"
              class="hyn-table__cell hyn-table__selection-cell is-center"
              :style="selectionColumnStyle"
              role="gridcell"
              @click.stop
            >
              <el-checkbox
                class="hyn-table__checkbox"
                :model-value="isRowSelected(rows[virtualRow.index])"
                :disabled="isRowDisabled(rows[virtualRow.index])"
                :aria-label="t('app.table.selectRow', { index: virtualRow.index + 1 })"
                @change="checked => handleRowSelectionChange(rows[virtualRow.index], Boolean(checked))"
              />
            </div>
            <div
              v-for="column in columns"
              :key="column.key"
              class="hyn-table__cell"
              :class="getCellClasses(column)"
              :style="getColumnStyle(column)"
              role="gridcell"
            >
              <HynTableActionCell
                v-if="column.actions !== undefined"
                :row="rows[virtualRow.index]"
                :actions="column.actions"
              />
              <HynTableOverflowCell
                v-else-if="isEllipsisColumn(column)"
                :content="formatCellValue(resolveColumnValue(rows[virtualRow.index], column))"
              >
                <slot
                  :name="getSlotName(column)"
                  :row="rows[virtualRow.index]"
                  :row-index="virtualRow.index"
                  :value="resolveColumnValue(rows[virtualRow.index], column)"
                  :column="column"
                >
                  {{ formatCellValue(resolveColumnValue(rows[virtualRow.index], column)) }}
                </slot>
              </HynTableOverflowCell>
              <div
                v-else
                class="hyn-table__cell-text"
                :class="`is-overflow-${getColumnOverflowMode(column)}`"
              >
                <slot
                  :name="getSlotName(column)"
                  :row="rows[virtualRow.index]"
                  :row-index="virtualRow.index"
                  :value="resolveColumnValue(rows[virtualRow.index], column)"
                  :column="column"
                >
                  {{ formatCellValue(resolveColumnValue(rows[virtualRow.index], column)) }}
                </slot>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
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
  </div>
</template>

<script setup lang="ts" generic="TRow">
import { computed, nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, watch, type CSSProperties } from 'vue';
import { useVirtualizer } from '@tanstack/vue-virtual';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import HynTableActionCell from '../HynTable/internal/HynTableActionCell.vue';
import HynTableOverflowCell from '../HynTable/internal/HynTableOverflowCell.vue';
import HynOverflowText from '../internal/HynOverflowText.vue';
import { useHynTableTooltipProvider } from '../internal/tableTooltip';
import { useHynGlobalConfig } from '../config';
import { measureHynTextWidth, resolveHynMeasureFont, resolveHynTextOverflowMode, type HynTextOverflowMode } from '../shared/overflow';
import type {
  HynVirtualTableColumn,
  HynVirtualTableColumnStyle,
  HynVirtualTableHeight,
  HynVirtualTableKey,
  HynVirtualTableRowDisabled,
  HynVirtualTableSelectAllChange,
  HynVirtualTableSelectionChange,
  HynVirtualTableSlotScope
} from './types';

const defaultVisibleRowCount = 10;
// Provider 必须建立在原根节点内部，避免破坏外部传入 class/style 的透传契约。
const tooltipState = useHynTableTooltipProvider();

const props = withDefaults(
  defineProps<{
    /** 虚拟表格数据行；组件只渲染可视窗口，不持有分页或查询状态。 */
    rows: TRow[];
    /** 虚拟表列配置，列宽会同时影响横向滚动和 slot scope。 */
    columns: HynVirtualTableColumn<TRow>[];
    /** 行主键解析函数，选择态、当前行和虚拟行 key 都依赖该值稳定。 */
    rowKey: (row: TRow) => HynVirtualTableKey;
    /** 受控选中主键列表，虚拟滚动只根据 key 判断当前可视行是否选中。 */
    selectedRowKeys?: HynVirtualTableKey[];
    /** 当前高亮行主键，传 null 表示不显示当前行样式。 */
    currentRowKey?: HynVirtualTableKey | null;
    /** 加载态；空数据时会显示骨架屏，已有数据时保持列表结构稳定。 */
    loading?: boolean;
    /** 空数据文案；未传时使用系统统一无数据文案。 */
    emptyText?: string;
    /** 表格高度；未传时按 headerHeight 和 visibleRowCount 推导默认高度。 */
    height?: HynVirtualTableHeight;
    /** 默认可见行数，仅在未显式设置 height 时参与高度计算。 */
    visibleRowCount?: number;
    /** 单行固定高度，必须和样式行高一致以保证虚拟滚动定位准确。 */
    rowHeight?: number;
    /** 表头固定高度，参与默认高度和 sticky header 计算。 */
    headerHeight?: number;
    /** 可视窗口外预渲染行数，过大增加 DOM，过小会影响快速滚动稳定性。 */
    overscan?: number;
    /** 是否展示选择列，选择结果由 selectedRowKeys 受控。 */
    selection?: boolean;
    /** 是否允许多选；单选模式下选中新行会替换已有主键。 */
    multiple?: boolean;
    /** 选择列宽度，需与 checkbox 视觉宽度保持一致。 */
    selectionWidth?: number;
    /** 是否让普通列填充容器宽度；关闭后按最小总宽度产生横向滚动。 */
    fit?: boolean;
    /** 文本溢出显示策略；未传时继承 HYN 全局配置。 */
    overflowMode?: HynTextOverflowMode;
    /** 行级禁用规则，禁用行不参与选择和行点击。 */
    rowDisabled?: HynVirtualTableRowDisabled<TRow>;
  }>(),
  {
    selectedRowKeys: () => [],
    currentRowKey: null,
    loading: false,
    emptyText: undefined,
    height: undefined,
    visibleRowCount: defaultVisibleRowCount,
    rowHeight: 48,
    headerHeight: 48,
    overscan: 12,
    selection: false,
    multiple: true,
    selectionWidth: 55,
    fit: true,
    rowDisabled: undefined
  }
);

const emit = defineEmits<{
  /** 选择变化时回写主键列表，父组件持有最终受控状态。 */
  'update:selectedRowKeys': [selectedRowKeys: HynVirtualTableKey[]];
  /** 单行选择变化事件，返回本次行、选中态和完整主键列表。 */
  'selection-change': [payload: HynVirtualTableSelectionChange<TRow>];
  /** 当前可视页批量选择事件，只影响未禁用的可见行。 */
  'select-all-change': [payload: HynVirtualTableSelectAllChange<TRow>];
  /** 行点击事件，禁用行不会触发。 */
  'row-click': [row: TRow];
}>();

defineSlots<Record<string, (props: HynVirtualTableSlotScope<TRow>) => unknown>>();

const defaultColumnWidth = 160;
const actionButtonSize = 28;
const actionButtonGap = 8;
const actionColumnPadding = 32;
const actionColumnMinWidth = 96;
const tableCellHorizontalPadding = 24;
const tableCellSafetyWidth = 12;
const minimumVisibleRowCount = 1;
const skeletonRows = [0, 1, 2, 3, 4, 5, 6, 7];
// 虚拟滚动容器实例，TanStack Virtualizer 和横向溢出检测都依赖它。
const scrollElement = ref<HTMLDivElement | null>(null);
const { t } = useHynI18n();
const hynConfig = useHynGlobalConfig();
// 是否出现横向滚动，只有溢出时右侧 sticky 列才启用固定表现。
const hasHorizontalOverflow = ref(false);
const hoveredRowKey = ref<string | null>(null);
// 表头字体单独缓存，用于语言切换或容器变化后的列宽测量。
const headerMeasureFont = ref('normal normal 500 14px Arial, sans-serif');
// 滚动容器尺寸观察器，KeepAlive 失活和卸载时必须断开。
let scrollResizeObserver: ResizeObserver | null = null;
// 虚拟表失活后仍保留组件实例；active guard 用来阻止隐藏缓存页继续测量滚动容器和表头字体。
let tableActive = false;
// 选中主键按字符串比较，兼容接口返回数字和字符串两种形态。
const selectedKeySet = computed(() => new Set(props.selectedRowKeys.map(key => String(key))));
// 空数据文案在虚拟表层兜底，业务页只在需要差异文案时覆盖。
const resolvedEmptyText = computed(() => props.emptyText ?? t('app.common.noData'));
// 文本溢出策略优先使用组件入参，未传时继承 HYN 全局配置。
const tableOverflowMode = computed<HynTextOverflowMode>(() => resolveHynTextOverflowMode(props.overflowMode, hynConfig.overflowMode));
const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>(
  computed(() => ({
    count: props.rows.length,
    getScrollElement: () => scrollElement.value,
    estimateSize: () => props.rowHeight,
    overscan: props.overscan
  }))
);

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems());
// 虚拟列表总高度决定 body spacer 高度，不能用可见行高度替代。
const totalSize = computed(() => `${rowVirtualizer.value.getTotalSize()}px`);
// 未显式设置 height 时，按表头和默认可见行数推导稳定高度。
const defaultTableHeight = computed(() => `${props.headerHeight + normalizeVisibleRowCount(props.visibleRowCount) * props.rowHeight}px`);
// 固定表格总宽度用于横向滚动和最小宽度计算。
const fixedTableWidth = computed(() => {
  const columnWidth = props.columns.reduce((total, column) => total + getColumnBaseWidth(column), 0);
  return columnWidth + (props.selection ? props.selectionWidth : 0);
});
// 表格最小宽度是横向溢出判断和骨架屏宽度的共同基准。
const tableMinWidth = computed(() => `${fixedTableWidth.value}px`);
// 选择列使用固定 flex 宽度，避免虚拟行和表头宽度漂移。
const selectionColumnStyle = computed<CSSProperties>(() => ({
  width: `${props.selectionWidth}px`,
  minWidth: `${props.selectionWidth}px`,
  flex: `0 0 ${props.selectionWidth}px`
}));
// loading/empty 区域复用表格宽度协议，防止空态宽度与真实表格不一致。
const loadingTableStyle = computed<CSSProperties>(() => ({
  minWidth: tableMinWidth.value,
  width: props.fit ? '100%' : tableMinWidth.value
}));
// body spacer 承载虚拟总高度和横向宽度，真实行通过绝对定位落在其中。
const bodySpacerStyle = computed<CSSProperties>(() => ({
  height: totalSize.value,
  minWidth: tableMinWidth.value,
  width: props.fit ? '100%' : tableMinWidth.value
}));
// 只有一个可填充列时让它吸收剩余空间，多列时按最小宽度均衡伸缩。
const flexFillColumnCount = computed(() => {
  return props.columns.filter(column => column.width === undefined && getActionButtonCount(column) === undefined && column.sticky !== 'right').length;
});
// 表头和 body 使用同一最小宽度协议，保证列边界在横向滚动下对齐。
const headerStyle = computed<CSSProperties>(() => ({
  minWidth: tableMinWidth.value,
  width: props.fit ? '100%' : tableMinWidth.value,
  height: `${props.headerHeight}px`
}));
// 根节点样式只暴露表头高度和默认高度两个 CSS 变量，样式层不重复计算尺寸。
const tableStyle = computed<CSSProperties>(() => {
  const style = {
    '--hyn-table-header-height': `${props.headerHeight}px`,
    '--hyn-table-default-height': defaultTableHeight.value
  } as CSSProperties;

  if (props.height !== undefined) {
    style.height = normalizeCssSize(props.height);
  }

  return style;
});
// 可选择行排除禁用行，表头全选不会改变被业务规则禁用的记录。
const selectableRows = computed(() => props.rows.filter(row => !isRowDisabled(row)));
// 可选择行主键集合用于表头全选/半选判断。
const selectableRowKeys = computed(() => selectableRows.value.map(row => String(props.rowKey(row))));
// 当前可见且可选行全部选中时，表头复选框才进入选中态。
const allVisibleRowsSelected = computed(
  () => selectableRowKeys.value.length > 0 && selectableRowKeys.value.every(key => selectedKeySet.value.has(key))
);
// 当前可见行存在部分选择时展示半选态，不影响外部 selectedRowKeys。
const someVisibleRowsSelected = computed(
  () => selectableRowKeys.value.some(key => selectedKeySet.value.has(key)) && !allVisibleRowsSelected.value
);

watch(
  () => [props.rows.length, props.rowHeight, props.headerHeight, props.visibleRowCount, props.height, tableMinWidth.value],
  () => {
    rowVirtualizer.value.measure();
    scheduleScrollStateUpdate();
  },
  { flush: 'post' }
);

/** 将数字尺寸转换为 px 字符串，字符串尺寸保持调用方传入的 CSS 表达式。 */
const normalizeCssSize = (value: HynVirtualTableHeight): string => {
  return typeof value === 'number' ? `${value}px` : value;
};

/** 归一化默认可见行数，避免 0 或负数让虚拟表失去可视窗口。 */
const normalizeVisibleRowCount = (visibleRowCount: number): number => {
  if (!Number.isFinite(visibleRowCount)) {
    return defaultVisibleRowCount;
  }
  return Math.max(minimumVisibleRowCount, Math.floor(visibleRowCount));
};

/** 根据操作按钮数量计算操作列宽度，保持按钮完整展示且不过度占宽。 */
function getActionColumnWidth(actionButtonCount: number): number {
  const normalizedCount = Math.max(1, actionButtonCount);
  return Math.max(
    actionColumnMinWidth,
    normalizedCount * actionButtonSize + (normalizedCount - 1) * actionButtonGap + actionColumnPadding
  );
}

/** 读取操作列按钮数量，操作列宽度由当前 actions 配置推导。 */
function getActionButtonCount(column: HynVirtualTableColumn<TRow>): number | undefined {
  return column.actions?.length;
}

/** 同步滚动容器溢出状态，只有横向溢出时才启用右侧固定列表现。 */
const updateScrollState = (): void => {
  // 虚拟表隐藏后滚动容器尺寸不再可信，继续同步会把失活页的布局状态写回响应式数据。
  if (!tableActive) {
    return;
  }
  const element = scrollElement.value;
  if (!element) {
    hasHorizontalOverflow.value = false;
    return;
  }
  hasHorizontalOverflow.value = element.scrollWidth - element.clientWidth > 1;
};

/** 等 DOM 尺寸稳定后再测量滚动状态，避免数据刷新时读到旧宽度。 */
const scheduleScrollStateUpdate = (): void => {
  void nextTick(() => {
    // 数据刷新和路由切换可能穿插发生，异步测量前必须重新确认页面仍处于激活状态。
    if (!tableActive) {
      return;
    }
    updateScrollState();
  });
};

const handleScroll = (): void => {
  updateScrollState();
};

/** 刷新虚拟表表头字体，确保不同语言切换后按真实文本宽度计算列宽。 */
function refreshMeasureContext(): void {
  if (!tableActive) {
    return;
  }
  const element = scrollElement.value;
  if (!element) {
    return;
  }
  headerMeasureFont.value = resolveHynMeasureFont(element, '500');
}

/** 根据当前语言表头文本计算列最小内容宽度，避免固定行高虚拟表出现无提示省略。 */
function getHeaderContentWidth(column: HynVirtualTableColumn<TRow>): number {
  return measureHynTextWidth(column.title, headerMeasureFont.value) + tableCellHorizontalPadding + tableCellSafetyWidth;
}

function getColumnBaseWidth(column: HynVirtualTableColumn<TRow>): number {
  const actionButtonCount = getActionButtonCount(column);
  const headerWidth = getHeaderContentWidth(column);
  if (actionButtonCount !== undefined) {
    return Math.ceil(Math.max(getActionColumnWidth(actionButtonCount), column.minWidth ?? 0, headerWidth));
  }
  if (column.width !== undefined) {
    return Math.ceil(Math.max(column.width, column.minWidth ?? 0, headerWidth));
  }
  if (column.minWidth !== undefined) {
    return Math.ceil(Math.max(column.minWidth, headerWidth));
  }
  return Math.ceil(Math.max(defaultColumnWidth, headerWidth));
}

const getColumnStyle = (column: HynVirtualTableColumn<TRow>): HynVirtualTableColumnStyle => {
  const baseWidth = getColumnBaseWidth(column);
  const actionButtonCount = getActionButtonCount(column);
  const canFill = props.fit && column.width === undefined && actionButtonCount === undefined && column.sticky !== 'right';
  const style: HynVirtualTableColumnStyle = {
    minWidth: `${baseWidth}px`,
    textAlign: column.align ?? 'left'
  };
  if (column.width !== undefined || actionButtonCount !== undefined || column.sticky === 'right') {
    style.width = `${baseWidth}px`;
    style.flex = `0 0 ${baseWidth}px`;
    return style;
  }
  if (canFill && flexFillColumnCount.value === 1) {
    style.flex = `1 0 ${baseWidth}px`;
    return style;
  }
  style.flex = `1 1 ${baseWidth}px`;
  return style;
};

const getCellClasses = (column: HynVirtualTableColumn<TRow>): Array<string | Record<string, boolean>> => {
  return [
    `is-${column.align ?? 'left'}`,
    `is-overflow-${getColumnOverflowMode(column)}`,
    {
      'is-sticky-right': column.sticky === 'right',
      'is-action': getActionButtonCount(column) !== undefined
    }
  ];
};

/** 解析当前列的溢出策略，操作列始终完整显示。 */
function getColumnOverflowMode(column: HynVirtualTableColumn<TRow>): HynTextOverflowMode {
  if (getActionButtonCount(column) !== undefined) {
    return 'fit';
  }
  return resolveHynTextOverflowMode(column.overflowMode, tableOverflowMode.value);
}

function isEllipsisColumn(column: HynVirtualTableColumn<TRow>): boolean {
  return getColumnOverflowMode(column) === 'ellipsis';
}

const getSlotName = (column: HynVirtualTableColumn<TRow>): string => {
  return column.slot ?? column.key;
};

const resolveColumnValue = (row: TRow, column: HynVirtualTableColumn<TRow>): unknown => {
  if (!column.field || row === null || typeof row !== 'object') {
    return '';
  }
  return (row as Record<string, unknown>)[column.field];
};

const formatCellValue = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
};

const getVirtualRowKey = (index: number, fallbackKey: unknown): HynVirtualTableKey => {
  const row = props.rows[index];
  if (row !== undefined) {
    return props.rowKey(row);
  }
  return typeof fallbackKey === 'number' || typeof fallbackKey === 'string' ? fallbackKey : String(fallbackKey);
};

const getVirtualRowStyle = (start: number, size: number): CSSProperties => {
  return {
    top: `${start}px`,
    height: `${size}px`,
    transform: 'none'
  };
};

const getSkeletonWidth = (column: HynVirtualTableColumn<TRow>, rowIndex: number): string => {
  if (column.width !== undefined && column.width <= 120) {
    return '48%';
  }
  return rowIndex % 3 === 0 ? '58%' : '72%';
};

const isRowSelected = (row: TRow | undefined): boolean => {
  if (!row) {
    return false;
  }
  return selectedKeySet.value.has(String(props.rowKey(row)));
};

/** 判断行是否禁用，禁用行会跳过全选并阻止手动选择。 */
const isRowDisabled = (row: TRow | undefined): boolean => {
  if (!row || props.rowDisabled === undefined) {
    return false;
  }
  return props.rowDisabled(row);
};

/** 鼠标悬停行使用显式状态兜底，避免虚拟行 transform 或外部样式导致 :hover 失效。 */
const isHoveredRow = (row: TRow | undefined): boolean => {
  if (!row || hoveredRowKey.value === null) {
    return false;
  }
  return String(props.rowKey(row)) === hoveredRowKey.value;
};

/** 判断当前业务上下文行，用于列表页点击行后的高亮展示。 */
const isCurrentRow = (row: TRow | undefined): boolean => {
  if (!row || props.currentRowKey === null || props.currentRowKey === undefined) {
    return false;
  }
  return String(props.rowKey(row)) === String(props.currentRowKey);
};

const emitSelectedKeys = (keys: HynVirtualTableKey[]): void => {
  emit('update:selectedRowKeys', keys);
};

const handleRowSelectionChange = (row: TRow, checked: boolean): void => {
  if (isRowDisabled(row)) {
    return;
  }
  const rowKey = props.rowKey(row);
  const nextKeys = props.multiple ? [...props.selectedRowKeys] : [];
  const existingIndex = nextKeys.findIndex(key => String(key) === String(rowKey));
  if (checked && existingIndex === -1) {
    nextKeys.push(rowKey);
  }
  if (!checked && existingIndex !== -1) {
    nextKeys.splice(existingIndex, 1);
  }
  emitSelectedKeys(nextKeys);
  emit('selection-change', {
    row,
    selected: checked,
    selectedRowKeys: nextKeys
  });
};

const handleSelectAllChange = (checked: boolean): void => {
  const currentKeys = [...props.selectedRowKeys];
  const nextKeys = checked
    ? [
        ...currentKeys,
        ...selectableRows.value
          .map(row => props.rowKey(row))
          .filter(key => !currentKeys.some(currentKey => String(currentKey) === String(key)))
      ]
    : currentKeys.filter(key => !selectableRowKeys.value.includes(String(key)));
  emitSelectedKeys(nextKeys);
  emit('select-all-change', {
    selected: checked,
    rows: props.rows,
    selectedRowKeys: nextKeys
  });
};

const handleRowClick = (row: TRow | undefined): void => {
  if (!row || isRowDisabled(row)) {
    return;
  }
  emit('row-click', row);
};

const measure = (): void => {
  rowVirtualizer.value.measure();
};

const scrollToIndex = (index: number): void => {
  rowVirtualizer.value.scrollToIndex(index, { align: 'start' });
};

const handleRowMouseEnter = (row: TRow | undefined): void => {
  if (!row || isRowDisabled(row)) {
    hoveredRowKey.value = null;
    return;
  }
  hoveredRowKey.value = String(props.rowKey(row));
};

const handleRowMouseLeave = (row: TRow | undefined): void => {
  if (!row || hoveredRowKey.value !== String(props.rowKey(row))) {
    return;
  }
  hoveredRowKey.value = null;
};

/** 断开滚动容器观察器，避免缓存页隐藏后 ResizeObserver 继续持有虚拟表 DOM。 */
function disconnectScrollResizeObserver(): void {
  scrollResizeObserver?.disconnect();
  scrollResizeObserver = null;
}

/** 重新激活时只绑定一个 observer；重复进入页面时先释放旧绑定，避免滚动状态回调成倍增长。 */
function observeScrollResize(): void {
  // onMounted/onActivated 共用入口，先断开旧 observer 才能保证滚动容器只有一个尺寸监听者。
  disconnectScrollResizeObserver();
  refreshMeasureContext();
  scheduleScrollStateUpdate();
  if (typeof ResizeObserver === 'undefined' || !scrollElement.value) {
    return;
  }
  scrollResizeObserver = new ResizeObserver(() => {
    // 浏览器可能延迟交付 ResizeObserver 回调，失活后的回调不能再读取表头字体或滚动宽度。
    if (!tableActive) {
      return;
    }
    refreshMeasureContext();
    updateScrollState();
  });
  scrollResizeObserver.observe(scrollElement.value);
}

onMounted(() => {
  tableActive = true;
  observeScrollResize();
});

onActivated(() => {
  tableActive = true;
  observeScrollResize();
});

onDeactivated(() => {
  tableActive = false;
  disconnectScrollResizeObserver();
});

onBeforeUnmount(() => {
  tableActive = false;
  disconnectScrollResizeObserver();
});

defineExpose({
  measure,
  scrollToIndex
});
</script>

<style lang="scss" scoped>
.hyn-table {
  --hyn-table-current-row-bg: var(--el-table-current-row-bg-color, var(--el-color-primary-light-9));
  --hyn-table-row-hover-bg: var(--el-table-row-hover-bg-color, #eff6ff);
  --hyn-table-scrollbar-size: 10px;
  --hyn-table-scrollbar-thumb: transparent;
  --hyn-table-scrollbar-thumb-hover: var(--el-scrollbar-bg-color, rgb(144 147 153 / 0.34));

  position: relative;
  display: flex;
  width: 100%;
  min-width: 0;
  height: var(--hyn-table-default-height);
  min-height: min(220px, var(--hyn-table-default-height));
  flex-direction: column;
  border: 1px solid var(--app-surface-border);
  border-radius: var(--app-radius-base);
  background: var(--el-bg-color);
  color: var(--el-text-color-regular);
  overflow: hidden;
}

.hyn-table__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  background: linear-gradient(
    180deg,
    var(--tableHeaderBg) 0 var(--hyn-table-header-height),
    var(--el-bg-color) var(--hyn-table-header-height)
  );
  scrollbar-width: thin;
  scrollbar-color: var(--hyn-table-scrollbar-thumb) transparent;
}

.hyn-table:hover .hyn-table__scroll {
  scrollbar-color: var(--hyn-table-scrollbar-thumb-hover) transparent;
}

.hyn-table__scroll::-webkit-scrollbar {
  width: var(--hyn-table-scrollbar-size);
  height: var(--hyn-table-scrollbar-size);
}

.hyn-table__scroll::-webkit-scrollbar-thumb {
  min-height: 42px;
  border: 3px solid transparent;
  border-radius: 999px;
  background-color: var(--hyn-table-scrollbar-thumb);
  background-clip: content-box;
}

.hyn-table:hover .hyn-table__scroll::-webkit-scrollbar-thumb {
  background-color: var(--hyn-table-scrollbar-thumb-hover);
}

.hyn-table__scroll::-webkit-scrollbar-track {
  background: transparent;
}

.hyn-table__header {
  position: sticky;
  top: 0;
  z-index: 6;
  display: flex;
  background: var(--tableHeaderBg);
  color: var(--tableHeaderTextColor);
  font-size: var(--app-font-size-base);
  font-weight: 500;
  border-bottom: 1px solid var(--app-surface-border);
  box-sizing: border-box;
}

.hyn-table__header-cell,
.hyn-table__cell {
  display: flex;
  align-items: center;
  min-width: 0;
  height: var(--app-table-row-height);
  padding: 7px 12px;
  font-size: var(--app-font-size-base);
  line-height: var(--app-line-height-base);
  box-sizing: border-box;
}

.hyn-table__header-cell.is-center,
.hyn-table__cell.is-center,
.hyn-table__selection-cell {
  justify-content: center;
}

.hyn-table__header-cell.is-right,
.hyn-table__cell.is-right {
  justify-content: flex-end;
}

.hyn-table__header-cell.is-sticky-right,
.hyn-table__cell.is-sticky-right {
  position: sticky;
  right: 0;
  z-index: 4;
  background: inherit;
}

.hyn-table:not(.is-horizontal-overflow) .hyn-table__header-cell.is-sticky-right,
.hyn-table:not(.is-horizontal-overflow) .hyn-table__cell.is-sticky-right {
  position: static;
  z-index: auto;
}

.hyn-table__header-cell.is-sticky-right {
  z-index: 8;
  background: var(--tableHeaderBg);
}

.hyn-table__header-cell.is-action,
.hyn-table__cell.is-action {
  padding-inline: 8px;
}

.hyn-table__row {
  position: absolute;
  left: 0;
  display: flex;
  width: 100%;
  min-width: 100%;
  border-bottom: 1px solid var(--app-surface-border);
  background: var(--el-bg-color);
  transition: background-color 0.12s ease;
}

.hyn-table__row.is-current {
  background-color: var(--hyn-table-current-row-bg);
}

.hyn-table__row.is-current .hyn-table__cell {
  background-color: var(--hyn-table-current-row-bg) !important;
}

.hyn-table__row.is-current .hyn-table__cell.is-sticky-right {
  background-color: var(--hyn-table-current-row-bg) !important;
}

.hyn-table__row.is-selected {
  background-color: var(--hyn-table-current-row-bg);
}

.hyn-table__row.is-selected .hyn-table__cell {
  background-color: var(--hyn-table-current-row-bg) !important;
}

.hyn-table__row.is-selected .hyn-table__cell.is-sticky-right {
  background-color: var(--hyn-table-current-row-bg) !important;
}

.hyn-table__row:hover,
.hyn-table__row.is-hovered {
  background-color: var(--hyn-table-row-hover-bg);
}

.hyn-table__row:hover .hyn-table__cell,
.hyn-table__row.is-hovered .hyn-table__cell {
  background-color: var(--hyn-table-row-hover-bg) !important;
}

.hyn-table__row:hover .hyn-table__cell.is-sticky-right,
.hyn-table__row.is-hovered .hyn-table__cell.is-sticky-right {
  background-color: var(--hyn-table-row-hover-bg) !important;
}

.hyn-table__row.is-disabled {
  color: var(--el-text-color-disabled);
  cursor: not-allowed;
}

.hyn-table__row.is-disabled:hover,
.hyn-table__row.is-disabled:hover .hyn-table__cell {
  background-color: var(--el-bg-color) !important;
}

.hyn-table__body-spacer {
  position: relative;
  width: 100%;
}

.hyn-table__header-text {
  width: 100%;
  min-width: 0;
}

.hyn-table__cell-text {
  display: block;
  width: 100%;
  min-width: 0;
}

.hyn-table__header-text.is-overflow-fit,
.hyn-table__cell-text.is-overflow-fit {
  overflow: visible;
  text-overflow: clip;
  white-space: nowrap;
}

.hyn-table__header-text.is-overflow-wrap,
.hyn-table__cell-text.is-overflow-wrap {
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
  overflow-wrap: anywhere;
}

.hyn-table__header-text.is-overflow-ellipsis,
.hyn-table__cell-text.is-overflow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hyn-table__cell.is-action .hyn-table__cell-text {
  display: flex;
  width: 100%;
  justify-content: center;
  overflow: visible;
}

.hyn-table__checkbox {
  height: var(--app-control-height);
  min-height: var(--app-control-height);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hyn-table__checkbox :deep(.el-checkbox__label) {
  display: none;
}

.hyn-table__empty {
  display: flex;
  height: 100%;
  min-height: 180px;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
  font-size: var(--app-font-size-base);
}

.hyn-table__skeleton {
  display: flex;
  flex-direction: column;
}

.hyn-table__row.is-skeleton {
  position: static;
  transform: none;
}

.hyn-table__skeleton-dot,
.hyn-table__skeleton-bar {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 999px;
  background: var(--app-surface-muted);
}

.hyn-table__skeleton-dot::after,
.hyn-table__skeleton-bar::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(90deg, transparent 0%, var(--el-fill-color-light) 46%, transparent 92%);
  transform: translate3d(-100%, 0, 0);
  animation: hyn-table-skeleton 1.1s linear infinite;
}

.hyn-table__skeleton-dot {
  width: 16px;
  height: 16px;
}

.hyn-table__skeleton-bar {
  height: 14px;
}

@keyframes hyn-table-skeleton {
  to {
    transform: translate3d(100%, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hyn-table__skeleton-dot::after,
  .hyn-table__skeleton-bar::after {
    animation: none;
    display: none;
  }
}
</style>
