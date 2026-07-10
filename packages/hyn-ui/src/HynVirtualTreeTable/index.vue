<template>
  <div
    class="hyn-virtual-tree-table data-table"
    :class="{ 'is-horizontal-overflow': hasHorizontalOverflow }"
    :style="tableStyle"
    role="treegrid"
    :aria-busy="loading || busy"
  >
    <div v-if="busy" class="hyn-virtual-tree-table__progress">
      <div class="hyn-virtual-tree-table__progress-track">
        <div class="hyn-virtual-tree-table__progress-bar" :style="progressStyle"></div>
      </div>
      <span v-if="busyText" class="hyn-virtual-tree-table__progress-text">{{ busyText }}</span>
    </div>

    <div ref="scrollElement" class="hyn-virtual-tree-table__scroll" @scroll="handleScroll">
      <div class="hyn-virtual-tree-table__header" role="row" :style="headerStyle">
        <div
          v-for="column in columns"
          :key="column.key"
          class="hyn-virtual-tree-table__header-cell"
          :class="getCellClasses(column)"
          :style="getColumnStyle(column)"
          role="columnheader"
        >
          <template v-if="isTreeSelectionColumn(column)">
            <el-checkbox
              v-if="multiple"
              class="hyn-virtual-tree-table__checkbox hyn-virtual-tree-table__tree-checkbox"
              :model-value="allVisibleRowsSelected"
              :indeterminate="someVisibleRowsSelected"
              :disabled="selectableTreeRows.length === 0"
              :aria-label="t('app.table.selectAll')"
              @change="checked => handleSelectAllChange(Boolean(checked))"
            />
          </template>
          <HynOverflowText
            v-if="isEllipsisColumn(column)"
            :content="column.title"
            mode="ellipsis"
            class="hyn-virtual-tree-table__header-text"
          >
            {{ column.title }}
          </HynOverflowText>
          <span v-else class="hyn-virtual-tree-table__header-text" :class="`is-overflow-${getColumnOverflowMode(column)}`">
            {{ column.title }}
          </span>
        </div>
      </div>

      <div
        v-if="loading && rows.length === 0"
        class="hyn-virtual-tree-table__skeleton"
        :style="{ minWidth: tableMinWidth }"
      >
        <div v-for="rowIndex in skeletonRows" :key="rowIndex" class="hyn-virtual-tree-table__row is-skeleton">
          <div
            v-for="column in columns"
            :key="column.key"
            class="hyn-virtual-tree-table__cell"
            :class="getCellClasses(column)"
            :style="getColumnStyle(column)"
          >
            <span v-if="isTreeSelectionColumn(column)" class="hyn-virtual-tree-table__skeleton-dot" />
            <span class="hyn-virtual-tree-table__skeleton-bar" :style="{ width: getSkeletonWidth(column, rowIndex) }" />
          </div>
        </div>
      </div>

      <div
        v-else-if="rows.length === 0"
        class="hyn-virtual-tree-table__empty"
        :style="{ minWidth: tableMinWidth }"
      >
        {{ resolvedEmptyText }}
      </div>

      <div
        v-else
        class="hyn-virtual-tree-table__body-spacer"
        :style="{ height: totalSize, minWidth: tableMinWidth }"
        role="rowgroup"
      >
        <div
          v-for="virtualRow in virtualRows"
          :key="getVirtualRowKey(virtualRow.index, virtualRow.key)"
          class="hyn-virtual-tree-table__row"
          :class="{
            'is-selected': isTreeRowSelected(rows[virtualRow.index]),
            'is-disabled': isTreeRowDisabled(rows[virtualRow.index])
          }"
          :style="getVirtualRowStyle(virtualRow.start, virtualRow.size)"
          role="row"
        >
          <template v-if="rows[virtualRow.index]">
            <div
              v-for="column in columns"
              :key="column.key"
              class="hyn-virtual-tree-table__cell"
              :class="getCellClasses(column)"
              :style="getColumnStyle(column)"
              role="gridcell"
            >
              <HynTableActionCell
                v-if="column.actions !== undefined"
                :row="rows[virtualRow.index].row"
                :actions="column.actions"
              />
              <div
                v-else-if="column.tree"
                class="hyn-virtual-tree-table__tree-cell"
                :style="getTreeCellStyle(rows[virtualRow.index])"
              >
                <button
                  v-if="rows[virtualRow.index].hasChildren"
                  class="hyn-virtual-tree-table__toggle"
                  :class="{ 'is-expanded': rows[virtualRow.index].expanded, 'is-loading': rows[virtualRow.index].loading }"
                  type="button"
                  :title="getToggleTitle(rows[virtualRow.index])"
                  :aria-expanded="rows[virtualRow.index].expanded"
                  :aria-busy="rows[virtualRow.index].loading"
                  :disabled="rows[virtualRow.index].loading"
                  @click.stop="emitToggleRow(rows[virtualRow.index])"
                >
                  <span class="hyn-virtual-tree-table__caret" aria-hidden="true"></span>
                </button>
                <span v-else class="hyn-virtual-tree-table__toggle-spacer" aria-hidden="true"></span>
                <el-checkbox
                  v-if="isTreeSelectionColumn(column)"
                  class="hyn-virtual-tree-table__checkbox hyn-virtual-tree-table__tree-checkbox"
                  :model-value="isTreeRowSelected(rows[virtualRow.index])"
                  :indeterminate="isTreeRowIndeterminate(rows[virtualRow.index])"
                  :disabled="isTreeRowDisabled(rows[virtualRow.index])"
                  :aria-label="t('app.table.selectRow', { index: virtualRow.index + 1 })"
                  @click.stop
                  @change="checked => handleRowSelectionChange(rows[virtualRow.index], Boolean(checked))"
                />
                <HynOverflowText
                  v-if="isEllipsisColumn(column)"
                  :content="formatCellValue(resolveColumnValue(rows[virtualRow.index].row, column))"
                  mode="ellipsis"
                  tag="div"
                  class="hyn-virtual-tree-table__cell-text"
                >
                  <slot
                    :name="getSlotName(column)"
                    :row="rows[virtualRow.index].row"
                    :tree-row="rows[virtualRow.index]"
                    :value="resolveColumnValue(rows[virtualRow.index].row, column)"
                  >
                    {{ formatCellValue(resolveColumnValue(rows[virtualRow.index].row, column)) }}
                  </slot>
                </HynOverflowText>
                <div
                  v-else
                  class="hyn-virtual-tree-table__cell-text"
                  :class="`is-overflow-${getColumnOverflowMode(column)}`"
                >
                  <slot
                    :name="getSlotName(column)"
                    :row="rows[virtualRow.index].row"
                    :tree-row="rows[virtualRow.index]"
                    :value="resolveColumnValue(rows[virtualRow.index].row, column)"
                  >
                    {{ formatCellValue(resolveColumnValue(rows[virtualRow.index].row, column)) }}
                  </slot>
                </div>
                <span
                  v-if="rows[virtualRow.index].loadError"
                  class="hyn-virtual-tree-table__load-error"
                  :title="rows[virtualRow.index].loadError"
                >
                  {{ t('app.table.loadFailed') }}
                </span>
              </div>
              <div
                v-else
                class="hyn-virtual-tree-table__plain-cell"
              >
                <HynOverflowText
                  v-if="isEllipsisColumn(column)"
                  :content="formatCellValue(resolveColumnValue(rows[virtualRow.index].row, column))"
                  mode="ellipsis"
                  tag="div"
                  class="hyn-virtual-tree-table__cell-text"
                >
                  <slot
                    :name="getSlotName(column)"
                    :row="rows[virtualRow.index].row"
                    :tree-row="rows[virtualRow.index]"
                    :value="resolveColumnValue(rows[virtualRow.index].row, column)"
                  >
                    {{ formatCellValue(resolveColumnValue(rows[virtualRow.index].row, column)) }}
                  </slot>
                </HynOverflowText>
                <div
                  v-else
                  class="hyn-virtual-tree-table__cell-text"
                  :class="`is-overflow-${getColumnOverflowMode(column)}`"
                >
                  <slot
                    :name="getSlotName(column)"
                    :row="rows[virtualRow.index].row"
                    :tree-row="rows[virtualRow.index]"
                    :value="resolveColumnValue(rows[virtualRow.index].row, column)"
                  >
                    {{ formatCellValue(resolveColumnValue(rows[virtualRow.index].row, column)) }}
                  </slot>
                </div>
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
import { useVirtualizer, type VirtualItem } from '@tanstack/vue-virtual';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import HynTableActionCell from '../HynTable/internal/HynTableActionCell.vue';
import HynOverflowText from '../internal/HynOverflowText.vue';
import { useHynTableTooltipProvider } from '../internal/tableTooltip';
import { useHynGlobalConfig } from '../config';
import {
  measureHynTextWidth,
  resolveHynMeasureFont,
  resolveHynTextOverflowMode,
  type HynTextOverflowMode
} from '../shared/overflow';
import type {
  HynVirtualTreeTableColumn,
  HynVirtualTreeTableColumnStyle,
  HynVirtualTreeTableHeight,
  HynVirtualTreeTableKey,
  HynVirtualTreeTableRowDisabled,
  HynVirtualTreeTableRow,
  HynVirtualTreeTableSelectAllChange,
  HynVirtualTreeTableSelectionChange,
  HynVirtualTreeTableSlotScope
} from './types';

const defaultVisibleRowCount = 10;
// Provider 留在表格根节点内部，保证 HynEntityPicker 等外部 class 仍落到真实滚动容器上。
const tooltipState = useHynTableTooltipProvider();

const props = withDefaults(
  defineProps<{
    /** 扁平化后的可见树行，展开、深度、加载状态由上层组合式函数维护。 */
    rows: HynVirtualTreeTableRow<TRow>[];
    /** 树表列配置，其中 tree 列承载缩进、展开按钮和可选复选框。 */
    columns: HynVirtualTreeTableColumn<TRow>[];
    /** 首次或刷新加载态；空数据时显示骨架屏。 */
    loading?: boolean;
    /** 后台展开/批量加载态，用于显示顶部细进度条，不清空现有行。 */
    busy?: boolean;
    /** busy 状态下的辅助文案，通常用于说明正在加载子节点。 */
    busyText?: string;
    /** busy 进度，取值 0 到 1，组件会夹紧异常值后渲染。 */
    progress?: number;
    /** 空数据文案；未传时使用系统统一无数据文案。 */
    emptyText?: string;
    /** 表格高度；未传时按 headerHeight 和 visibleRowCount 推导默认高度。 */
    height?: HynVirtualTreeTableHeight;
    /** 默认可见行数，仅在未显式设置 height 时参与高度计算。 */
    visibleRowCount?: number;
    /** 单行固定高度，必须和样式行高一致以保证虚拟滚动定位准确。 */
    rowHeight?: number;
    /** 表头固定高度，参与默认高度和 sticky header 计算。 */
    headerHeight?: number;
    /** 可视窗口外预渲染行数，过大增加 DOM，过小会影响快速滚动稳定性。 */
    overscan?: number;
    /** 每层树深度的缩进像素，必须给展开按钮和选择框预留稳定空间。 */
    treeIndent?: number;
    /** 受控选择主键；选择框渲染在树主列展开按钮右侧，不新增独立选择列。 */
    selectedRowKeys?: HynVirtualTreeTableKey[];
    /** 是否开启树节点选择能力。 */
    selection?: boolean;
    /** 是否允许多选；单选会在选中下一行时自动替换已有主键。 */
    multiple?: boolean;
    /** 文本溢出显示策略；未传时继承 HYN 全局配置。 */
    overflowMode?: HynTextOverflowMode;
    /** 按业务行禁用选择，禁用行不参与表头批量选择。 */
    rowDisabled?: HynVirtualTreeTableRowDisabled<TRow>;
  }>(),
  {
    selectedRowKeys: () => [],
    loading: false,
    busy: false,
    busyText: '',
    progress: 0,
    emptyText: undefined,
    height: undefined,
    visibleRowCount: defaultVisibleRowCount,
    rowHeight: 48,
    headerHeight: 48,
    overscan: 12,
    treeIndent: 22,
    selection: false,
    multiple: true,
    rowDisabled: undefined
  }
);

const emit = defineEmits<{
  /** 选择变化时回写主键列表，父组件持有最终受控状态。 */
  'update:selectedRowKeys': [selectedRowKeys: HynVirtualTreeTableKey[]];
  /** 单行选择变化事件，返回业务行和完整主键列表。 */
  'selection-change': [payload: HynVirtualTreeTableSelectionChange<TRow>];
  /** 批量选择当前可见未禁用节点，不会影响未加载或隐藏节点。 */
  'select-all-change': [payload: HynVirtualTreeTableSelectAllChange<TRow>];
  /** 点击展开按钮时触发，加载与展开状态由父级组合式函数维护。 */
  'toggle-row': [treeRow: HynVirtualTreeTableRow<TRow>];
}>();

defineSlots<Record<string, (props: HynVirtualTreeTableSlotScope<TRow>) => unknown>>();

const defaultColumnWidth = 160;
const actionButtonSize = 28;
const actionButtonGap = 8;
const actionColumnPadding = 32;
const actionColumnMinWidth = 96;
const tableCellHorizontalPadding = 24;
const tableCellSafetyWidth = 12;
const treeColumnAccessoryWidth = 28;
const minimumVisibleRowCount = 1;
const skeletonRows = [0, 1, 2, 3, 4, 5, 6, 7];
// 虚拟树表滚动容器，虚拟行计算、横向溢出判断和 ResizeObserver 都依赖它。
const scrollElement = ref<HTMLDivElement | null>(null);
const { t } = useHynI18n();
const hynConfig = useHynGlobalConfig();
// 是否出现横向滚动，只有溢出时右侧 sticky 列才启用固定表现。
const hasHorizontalOverflow = ref(false);
// 表头字体单独缓存，用于语言切换或容器变化后的列宽测量。
const headerMeasureFont = ref('normal normal 500 14px Arial, sans-serif');
// 滚动容器尺寸观察器，KeepAlive 失活和卸载时必须断开。
let scrollResizeObserver: ResizeObserver | null = null;
// 树表在 KeepAlive 中切走时不会卸载；该标记避免隐藏缓存页继续测量列宽、滚动条和固定列状态。
let tableActive = false;
// 选中主键按字符串比较，兼容接口返回数字和字符串两种形态。
const selectedKeySet = computed(() => new Set(props.selectedRowKeys.map(key => String(key))));
// 空数据文案在树表层兜底，业务页只在需要差异文案时覆盖。
const resolvedEmptyText = computed(() => props.emptyText ?? t('app.common.noData'));
// 文本溢出策略优先使用组件入参，未传时继承 HYN 全局配置。
const tableOverflowMode = computed<HynTextOverflowMode>(() => resolveHynTextOverflowMode(props.overflowMode, hynConfig.overflowMode));
const indeterminateKeySet = computed(() => {
  const keys = new Set<string>();
  const ancestorStack: HynVirtualTreeTableRow<TRow>[] = [];
  props.rows.forEach(treeRow => {
    while (ancestorStack.length > 0 && ancestorStack[ancestorStack.length - 1].depth >= treeRow.depth) {
      ancestorStack.pop();
    }
    if (selectedKeySet.value.has(String(treeRow.key))) {
      ancestorStack.forEach(ancestor => {
        const key = String(ancestor.key);
        if (!selectedKeySet.value.has(key)) {
          keys.add(key);
        }
      });
    }
    ancestorStack.push(treeRow);
  });
  return keys;
});

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
// 树表最小宽度来自全部列宽汇总，是横向滚动和骨架屏宽度的共同基准。
const tableMinWidth = computed(() => `${props.columns.reduce((total, column) => total + getColumnBaseWidth(column), 0)}px`);
// 表头和 body 使用同一最小宽度协议，保证列边界在横向滚动下对齐。
const headerStyle = computed<CSSProperties>(() => ({
  minWidth: tableMinWidth.value,
  width: '100%',
  height: `${props.headerHeight}px`
}));
// 根节点样式只暴露表头高度和默认高度两个 CSS 变量，样式层不重复计算尺寸。
const tableStyle = computed<CSSProperties>(() => {
  const style = {
    '--hyn-virtual-tree-table-header-height': `${props.headerHeight}px`,
    '--hyn-virtual-tree-table-default-height': defaultTableHeight.value
  } as CSSProperties;

  if (props.height !== undefined) {
    style.height = normalizeCssSize(props.height);
  }

  return style;
});
// busy 进度条只接受 0 到 1 的比例，异常值在这里夹紧后再写入 transform。
const progressStyle = computed<CSSProperties>(() => ({
  transform: `scaleX(${Math.min(Math.max(props.progress, 0), 1)})`
}));
// 可选择树行排除禁用行，表头全选不会改变被业务规则禁用的记录。
const selectableTreeRows = computed(() => props.rows.filter(treeRow => !isTreeRowDisabled(treeRow)));
// 可选择树行主键集合用于表头全选/半选判断。
const selectableRowKeys = computed(() => selectableTreeRows.value.map(treeRow => String(treeRow.key)));
// 当前可见且可选树行全部选中时，表头复选框才进入选中态。
const allVisibleRowsSelected = computed(
  () => selectableRowKeys.value.length > 0 && selectableRowKeys.value.every(key => selectedKeySet.value.has(key))
);
// 当前可见树行存在部分选择时展示半选态，不影响外部 selectedRowKeys。
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
const normalizeCssSize = (value: HynVirtualTreeTableHeight): string => {
  return typeof value === 'number' ? `${value}px` : value;
};

/** 归一化默认可见行数，避免 0 或负数让虚拟树表失去可视窗口。 */
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
function getActionButtonCount(column: HynVirtualTreeTableColumn<TRow>): number | undefined {
  return column.actions?.length;
}

/** 同步滚动容器溢出状态，只有横向溢出时才启用右侧固定列表现。 */
const updateScrollState = (): void => {
  // 树表失活后滚动容器宽度可能为旧值，继续写入会污染重新激活后的固定列判断。
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

/** 等 DOM 尺寸稳定后再测量滚动状态，避免展开树节点时读到旧宽度。 */
const scheduleScrollStateUpdate = (): void => {
  void nextTick(() => {
    // 树节点展开和路由切换都可能排队到同一轮更新，异步测量前必须确认页面仍激活。
    if (!tableActive) {
      return;
    }
    updateScrollState();
  });
};

const handleScroll = (): void => {
  updateScrollState();
};

/** 刷新虚拟树表表头字体，确保语言切换后表头宽度按真实文本计算。 */
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

/** 计算表头最小内容宽度，树列额外预留展开控件和选择框占位。 */
function getHeaderContentWidth(column: HynVirtualTreeTableColumn<TRow>): number {
  const treeAccessoryWidth = column.tree ? treeColumnAccessoryWidth : 0;
  const selectionAccessoryWidth = isTreeSelectionColumn(column) ? treeColumnAccessoryWidth : 0;
  return (
    measureHynTextWidth(column.title, headerMeasureFont.value) +
    tableCellHorizontalPadding +
    tableCellSafetyWidth +
    treeAccessoryWidth +
    selectionAccessoryWidth
  );
}

function getColumnBaseWidth(column: HynVirtualTreeTableColumn<TRow>): number {
  const actionButtonCount = getActionButtonCount(column);
  const headerWidth = getHeaderContentWidth(column);
  if (actionButtonCount !== undefined) {
    return Math.ceil(Math.max(getActionColumnWidth(actionButtonCount), column.minWidth ?? 0, headerWidth));
  }
  return Math.ceil(Math.max(defaultColumnWidth, column.width ?? 0, column.minWidth ?? 0, headerWidth));
}

const getColumnStyle = (column: HynVirtualTreeTableColumn<TRow>): HynVirtualTreeTableColumnStyle => {
  const baseWidth = getColumnBaseWidth(column);
  const actionButtonCount = getActionButtonCount(column);
  const style: HynVirtualTreeTableColumnStyle = {
    minWidth: `${baseWidth}px`,
    textAlign: column.align ?? 'left'
  };
  if (column.width !== undefined || actionButtonCount !== undefined || column.sticky === 'right') {
    style.width = `${baseWidth}px`;
    style.flex = `0 0 ${baseWidth}px`;
    return style;
  }
  style.flex = `1 1 ${baseWidth}px`;
  return style;
};

const getCellClasses = (column: HynVirtualTreeTableColumn<TRow>): Array<string | Record<string, boolean>> => {
  return [
    `is-${column.align ?? 'left'}`,
    `is-overflow-${getColumnOverflowMode(column)}`,
    {
      'is-tree-column': column.tree === true,
      'is-sticky-right': column.sticky === 'right',
      'is-action': getActionButtonCount(column) !== undefined
    }
  ];
};

/** 解析当前列的文本溢出策略，操作列固定完整展示。 */
function getColumnOverflowMode(column: HynVirtualTreeTableColumn<TRow>): HynTextOverflowMode {
  if (getActionButtonCount(column) !== undefined) {
    return 'fit';
  }
  return resolveHynTextOverflowMode(column.overflowMode, tableOverflowMode.value);
}

function isEllipsisColumn(column: HynVirtualTreeTableColumn<TRow>): boolean {
  return getColumnOverflowMode(column) === 'ellipsis';
}

/** 判断当前列是否承载选择框；树表选择必须跟随树主列缩进和展开控件。 */
function isTreeSelectionColumn(column: HynVirtualTreeTableColumn<TRow>): boolean {
  return props.selection && column.tree === true;
}

const getSlotName = (column: HynVirtualTreeTableColumn<TRow>): string => {
  return column.slot ?? column.key;
};

const resolveColumnValue = (row: TRow, column: HynVirtualTreeTableColumn<TRow>): unknown => {
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

const getTreeCellStyle = (treeRow: HynVirtualTreeTableRow<TRow>): CSSProperties => {
  return {
    paddingInlineStart: `${treeRow.depth * props.treeIndent}px`
  };
};

/** 加载中的节点不重复触发展开，避免业务层重复请求。 */
const emitToggleRow = (treeRow: HynVirtualTreeTableRow<TRow>): void => {
  if (treeRow.loading) {
    return;
  }
  emit('toggle-row', treeRow);
};

/** 根据节点状态生成展开按钮标题，错误信息通过 title 暴露完整上下文。 */
const getToggleTitle = (treeRow: HynVirtualTreeTableRow<TRow>): string => {
  if (treeRow.loading) {
    return t('app.table.loadingChildren');
  }
  if (treeRow.loadError) {
    return treeRow.loadError;
  }
  return treeRow.expanded ? t('app.table.collapseRow') : t('app.table.expandRow');
};

const getVirtualRowKey = (index: number, fallbackKey: unknown): HynVirtualTreeTableKey => {
  const rowKey = props.rows[index]?.key;
  if (rowKey !== undefined) {
    return rowKey;
  }
  return typeof fallbackKey === 'number' || typeof fallbackKey === 'string' ? fallbackKey : String(fallbackKey);
};

const getVirtualRowStyle = (start: number, size: number): CSSProperties => {
  return {
    height: `${size}px`,
    transform: `translateY(${start}px)`
  };
};

const getSkeletonWidth = (column: HynVirtualTreeTableColumn<TRow>, rowIndex: number): string => {
  if (column.tree) {
    return rowIndex % 2 === 0 ? '68%' : '52%';
  }
  if (column.width !== undefined && column.width <= 120) {
    return '48%';
  }
  return rowIndex % 3 === 0 ? '58%' : '72%';
};

const isTreeRowSelected = (treeRow: HynVirtualTreeTableRow<TRow> | undefined): boolean => {
  if (!treeRow) {
    return false;
  }
  return selectedKeySet.value.has(String(treeRow.key));
};

/** 判断可见祖先节点是否需要展示半选态，半选态不写入 selectedRowKeys。 */
const isTreeRowIndeterminate = (treeRow: HynVirtualTreeTableRow<TRow> | undefined): boolean => {
  if (!treeRow) {
    return false;
  }
  return indeterminateKeySet.value.has(String(treeRow.key));
};

/** 判断业务行是否禁用，禁用行会跳过表头批量选择并阻止手动选择。 */
const isTreeRowDisabled = (treeRow: HynVirtualTreeTableRow<TRow> | undefined): boolean => {
  if (!treeRow || props.rowDisabled === undefined) {
    return false;
  }
  return props.rowDisabled(treeRow.row);
};

/** 统一向父组件回写受控选择主键，组件内部不持有业务选择状态。 */
const emitSelectedKeys = (keys: HynVirtualTreeTableKey[]): void => {
  emit('update:selectedRowKeys', keys);
};

/** 切换单个树节点选择状态，单选模式下只保留本次选中的节点。 */
const handleRowSelectionChange = (treeRow: HynVirtualTreeTableRow<TRow>, checked: boolean): void => {
  if (isTreeRowDisabled(treeRow)) {
    return;
  }
  const rowKey = treeRow.key;
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
    row: treeRow.row,
    selected: checked,
    selectedRowKeys: nextKeys
  });
};

/** 批量切换当前可见且未禁用节点，避免隐藏节点或禁用节点被误改。 */
const handleSelectAllChange = (checked: boolean): void => {
  const currentKeys = [...props.selectedRowKeys];
  const nextKeys = checked
    ? [
        ...currentKeys,
        ...selectableTreeRows.value
          .map(treeRow => treeRow.key)
          .filter(key => !currentKeys.some(currentKey => String(currentKey) === String(key)))
      ]
    : currentKeys.filter(key => !selectableRowKeys.value.includes(String(key)));
  emitSelectedKeys(nextKeys);
  emit('select-all-change', {
    selected: checked,
    rows: selectableTreeRows.value.map(treeRow => treeRow.row),
    selectedRowKeys: nextKeys
  });
};

const measure = (): void => {
  rowVirtualizer.value.measure();
};

const scrollToIndex = (index: number): void => {
  rowVirtualizer.value.scrollToIndex(index, { align: 'start' });
};

/** 断开滚动容器观察器，避免失活树表继续被 ResizeObserver 和回调闭包保留。 */
function disconnectScrollResizeObserver(): void {
  scrollResizeObserver?.disconnect();
  scrollResizeObserver = null;
}

/** 激活时重建唯一 observer，覆盖侧栏宽度变化、树节点展开后的滚动状态重新测量。 */
function observeScrollResize(): void {
  // mounted 和 activated 都会调用这里，先释放旧 observer 可避免同一滚动容器被重复观察。
  disconnectScrollResizeObserver();
  refreshMeasureContext();
  scheduleScrollStateUpdate();
  if (typeof ResizeObserver === 'undefined' || !scrollElement.value) {
    return;
  }
  scrollResizeObserver = new ResizeObserver(() => {
    // ResizeObserver 最后一帧回调可能晚于 deactivated，失活树表不能再读取隐藏 DOM。
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
.hyn-virtual-tree-table {
  --hyn-virtual-tree-table-current-row-bg: var(--el-table-current-row-bg-color, var(--el-color-primary-light-9));
  --hyn-virtual-tree-table-row-hover-bg: var(--el-table-row-hover-bg-color, var(--el-fill-color-light));
  --hyn-virtual-tree-table-scrollbar-size: 10px;
  --hyn-virtual-tree-table-scrollbar-thumb: transparent;
  --hyn-virtual-tree-table-scrollbar-thumb-hover: var(--el-scrollbar-bg-color, rgb(144 147 153 / 0.34));

  position: relative;
  display: flex;
  width: 100%;
  min-width: 0;
  height: var(--hyn-virtual-tree-table-default-height);
  min-height: min(220px, var(--hyn-virtual-tree-table-default-height));
  flex-direction: column;
  border: 1px solid var(--app-surface-border);
  border-radius: var(--app-radius-base);
  background: var(--el-bg-color);
  color: var(--app-text-title);
  overflow: hidden;
}

.hyn-virtual-tree-table__progress {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 12;
  height: 2px;
  pointer-events: none;
}

.hyn-virtual-tree-table__progress-track {
  height: 2px;
  background: transparent;
  overflow: hidden;
}

.hyn-virtual-tree-table__progress-bar {
  width: 100%;
  height: 100%;
  transform-origin: left center;
  background: var(--el-color-primary);
  transition: transform 0.16s ease;
}

.hyn-virtual-tree-table__progress-text {
  position: absolute;
  top: 8px;
  right: 12px;
  padding: 3px 8px;
  border-radius: var(--app-radius-base);
  background: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-light);
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.hyn-virtual-tree-table__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  background: linear-gradient(
    180deg,
    var(--tableHeaderBg) 0 var(--hyn-virtual-tree-table-header-height),
    var(--el-bg-color) var(--hyn-virtual-tree-table-header-height)
  );
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: var(--hyn-virtual-tree-table-scrollbar-thumb) transparent;
}

.hyn-virtual-tree-table:hover .hyn-virtual-tree-table__scroll {
  scrollbar-color: var(--hyn-virtual-tree-table-scrollbar-thumb-hover) transparent;
}

.hyn-virtual-tree-table__scroll::-webkit-scrollbar {
  width: var(--hyn-virtual-tree-table-scrollbar-size);
  height: var(--hyn-virtual-tree-table-scrollbar-size);
}

.hyn-virtual-tree-table__scroll::-webkit-scrollbar-thumb {
  min-height: 42px;
  border: 3px solid transparent;
  border-radius: 999px;
  background-color: var(--hyn-virtual-tree-table-scrollbar-thumb);
  background-clip: content-box;
}

.hyn-virtual-tree-table:hover .hyn-virtual-tree-table__scroll::-webkit-scrollbar-thumb {
  background-color: var(--hyn-virtual-tree-table-scrollbar-thumb-hover);
}

.hyn-virtual-tree-table__scroll::-webkit-scrollbar-track {
  background: transparent;
}

.hyn-virtual-tree-table__header {
  position: sticky;
  top: 0;
  z-index: 6;
  display: flex;
  background: var(--tableHeaderBg);
  color: var(--tableHeaderTextColor);
  font-size: var(--app-font-size-base);
  font-weight: 500;
  border-bottom: 1px solid var(--app-surface-border);
}

.hyn-virtual-tree-table__header-cell,
.hyn-virtual-tree-table__cell {
  display: flex;
  align-items: center;
  min-width: 0;
  height: var(--app-table-row-height);
  padding: 7px 12px;
  font-size: var(--app-font-size-base);
  line-height: var(--app-line-height-base);
  box-sizing: border-box;
}

.hyn-virtual-tree-table__header-cell.is-center,
.hyn-virtual-tree-table__cell.is-center {
  justify-content: center;
}

.hyn-virtual-tree-table__header-cell.is-right,
.hyn-virtual-tree-table__cell.is-right {
  justify-content: flex-end;
}

.hyn-virtual-tree-table__header-cell.is-sticky-right,
.hyn-virtual-tree-table__cell.is-sticky-right {
  position: sticky;
  right: 0;
  z-index: 4;
  background: inherit;
}

.hyn-virtual-tree-table:not(.is-horizontal-overflow) .hyn-virtual-tree-table__header-cell.is-sticky-right,
.hyn-virtual-tree-table:not(.is-horizontal-overflow) .hyn-virtual-tree-table__cell.is-sticky-right {
  position: static;
  z-index: auto;
}

.hyn-virtual-tree-table__header-cell.is-sticky-right {
  z-index: 8;
  background: var(--tableHeaderBg);
}

.hyn-virtual-tree-table__header-cell.is-action,
.hyn-virtual-tree-table__cell.is-action {
  padding-inline: 8px;
}

.hyn-virtual-tree-table__row {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  min-width: 100%;
  border-bottom: 1px solid var(--app-surface-border);
  background: var(--el-bg-color);
  transition: background-color 0.12s ease;
  will-change: transform;
}

.hyn-virtual-tree-table__row:hover {
  background: var(--hyn-virtual-tree-table-row-hover-bg);
}

.hyn-virtual-tree-table__row.is-selected {
  background-color: var(--hyn-virtual-tree-table-current-row-bg);
}

.hyn-virtual-tree-table__row.is-selected .hyn-virtual-tree-table__cell {
  background-color: var(--hyn-virtual-tree-table-current-row-bg) !important;
}

.hyn-virtual-tree-table__row.is-selected .hyn-virtual-tree-table__cell.is-sticky-right {
  background-color: var(--hyn-virtual-tree-table-current-row-bg) !important;
}

.hyn-virtual-tree-table__row:hover .hyn-virtual-tree-table__cell.is-sticky-right {
  background: var(--hyn-virtual-tree-table-row-hover-bg);
}

.hyn-virtual-tree-table__row.is-disabled {
  color: var(--el-text-color-disabled);
  cursor: not-allowed;
}

.hyn-virtual-tree-table__row.is-disabled:hover,
.hyn-virtual-tree-table__row.is-disabled:hover .hyn-virtual-tree-table__cell {
  background-color: var(--el-bg-color) !important;
}

.hyn-virtual-tree-table__body-spacer {
  position: relative;
  width: 100%;
}

.hyn-virtual-tree-table__tree-cell {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: 4px;
}

.hyn-virtual-tree-table__plain-cell {
  width: 100%;
  min-width: 0;
}

.hyn-virtual-tree-table__toggle,
.hyn-virtual-tree-table__toggle-spacer {
  width: 20px;
  min-width: 20px;
  height: 24px;
}

.hyn-virtual-tree-table__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: var(--app-radius-sm);
  background: transparent;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  transition:
    color 0.12s ease,
    background-color 0.12s ease;
}

.hyn-virtual-tree-table__toggle:disabled {
  cursor: progress;
  opacity: 0.84;
}

.hyn-virtual-tree-table__toggle:hover {
  background: var(--app-accent-subtle);
  color: var(--el-color-primary);
}

.hyn-virtual-tree-table__caret {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 6px solid currentcolor;
  transform-origin: center;
  transition: transform 0.16s ease;
}

.hyn-virtual-tree-table__toggle.is-expanded .hyn-virtual-tree-table__caret {
  transform: rotate(90deg);
}

.hyn-virtual-tree-table__toggle.is-loading .hyn-virtual-tree-table__caret {
  width: 12px;
  height: 12px;
  border: 2px solid var(--el-color-primary-light-5);
  border-top-color: var(--el-color-primary);
  border-radius: 50%;
  animation: hyn-virtual-tree-table-spin 0.72s linear infinite;
}

.hyn-virtual-tree-table__header-text {
  width: 100%;
  min-width: 0;
}

.hyn-virtual-tree-table__cell-text {
  display: block;
  width: 100%;
  min-width: 0;
}

.hyn-virtual-tree-table__header-text.is-overflow-fit,
.hyn-virtual-tree-table__cell-text.is-overflow-fit {
  overflow: visible;
  text-overflow: clip;
  white-space: nowrap;
}

.hyn-virtual-tree-table__header-text.is-overflow-wrap,
.hyn-virtual-tree-table__cell-text.is-overflow-wrap {
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
  overflow-wrap: anywhere;
}

.hyn-virtual-tree-table__header-text.is-overflow-ellipsis,
.hyn-virtual-tree-table__cell-text.is-overflow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hyn-virtual-tree-table__cell.is-action .hyn-virtual-tree-table__cell-text {
  display: flex;
  width: 100%;
  justify-content: center;
  overflow: visible;
}

.hyn-virtual-tree-table__checkbox {
  display: inline-flex;
  height: var(--app-control-height);
  min-height: var(--app-control-height);
  align-items: center;
  justify-content: center;
}

.hyn-virtual-tree-table__checkbox :deep(.el-checkbox__label) {
  display: none;
}

.hyn-virtual-tree-table__tree-checkbox {
  flex: 0 0 20px;
}

.hyn-virtual-tree-table__load-error {
  margin-left: 8px;
  color: var(--el-color-danger);
  font-size: 12px;
  white-space: nowrap;
}

.hyn-virtual-tree-table__empty {
  display: flex;
  height: 100%;
  min-height: 180px;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
  font-size: var(--app-font-size-base);
}

.hyn-virtual-tree-table__skeleton {
  display: flex;
  flex-direction: column;
}

.hyn-virtual-tree-table__row.is-skeleton {
  position: static;
  transform: none;
}

.hyn-virtual-tree-table__skeleton-dot,
.hyn-virtual-tree-table__skeleton-bar {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 999px;
  background: var(--app-surface-muted);
}

.hyn-virtual-tree-table__skeleton-dot::after,
.hyn-virtual-tree-table__skeleton-bar::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(90deg, transparent 0%, var(--el-fill-color-light) 46%, transparent 92%);
  transform: translate3d(-100%, 0, 0);
  animation: hyn-virtual-tree-table-skeleton 1.1s linear infinite;
}

.hyn-virtual-tree-table__skeleton-dot {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
}

.hyn-virtual-tree-table__skeleton-bar {
  height: 14px;
}

@keyframes hyn-virtual-tree-table-skeleton {
  to {
    transform: translate3d(100%, 0, 0);
  }
}

@keyframes hyn-virtual-tree-table-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hyn-virtual-tree-table__toggle.is-loading .hyn-virtual-tree-table__caret {
    animation: none;
  }

  .hyn-virtual-tree-table__skeleton-dot::after,
  .hyn-virtual-tree-table__skeleton-bar::after {
    animation: none;
    display: none;
  }
}
</style>
