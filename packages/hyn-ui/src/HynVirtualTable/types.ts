import type { CSSProperties } from 'vue';
import type { HynTableAction } from '../HynTable/types';
import type { HynTextOverflowMode } from '../shared/overflow';

/** 虚拟表格统一行主键类型，用于滚动、选择和缓存比较。 */
export type HynVirtualTableKey = string | number;

/** 虚拟表格列对齐方式。 */
export type HynVirtualTableAlign = 'left' | 'center' | 'right';

/** 虚拟表格高度配置，支持像素数字或 CSS 高度字符串。 */
export type HynVirtualTableHeight = string | number;

/**
 * HYN 平铺虚拟表格列配置。
 *
 * @remarks
 * 虚拟表需要稳定列宽来减少滚动抖动，业务页应优先配置 `width` 或 `minWidth`。
 */
export interface HynVirtualTableColumn<TRow> {
  /** 列唯一标识，用于渲染 key 和列缓存。 */
  key: string;
  /** 表头标题。 */
  title: string;
  /** 绑定到行对象的字段名；自定义 slot 或操作列可不传。 */
  field?: Extract<keyof TRow, string>;
  /** 固定列宽，效果接近 el-table-column width。 */
  width?: number;
  /** 最小列宽，fit 模式下会参与剩余宽度分配，效果接近 el-table-column min-width。 */
  minWidth?: number;
  /** 单元格内容对齐方式。 */
  align?: HynVirtualTableAlign;
  /** 固定到右侧的列，通常用于操作列。 */
  sticky?: 'right';
  /** 自定义单元格 slot 名，slot scope 使用 `HynVirtualTableSlotScope`。 */
  slot?: string;
  /**
   * 文本溢出展示策略。
   *
   * @remarks
   * 未声明时继承虚拟表级 `overflowMode`，表格级未声明时继承 HYN 全局配置；只有显式 `ellipsis` 才省略并展示 tooltip。
   */
  overflowMode?: HynTextOverflowMode;
  /** 操作按钮配置，默认由 HYN 内置 Element Plus Tooltip/Button 渲染。 */
  actions?: HynTableAction<TRow>[];
}

/**
 * 行禁用判断函数，用于选择列或批量操作保护不可操作数据。
 */
export type HynVirtualTableRowDisabled<TRow> = (row: TRow) => boolean;

/**
 * 虚拟表单行选择变化事件载荷。
 */
export interface HynVirtualTableSelectionChange<TRow> {
  /** 本次切换的行。 */
  row: TRow;
  /** 本次切换后该行是否选中。 */
  selected: boolean;
  /** 当前所有已选主键。 */
  selectedRowKeys: HynVirtualTableKey[];
}

/**
 * 虚拟表全选变化事件载荷。
 */
export interface HynVirtualTableSelectAllChange<TRow> {
  /** 本次全选按钮是否变为选中。 */
  selected: boolean;
  /** 当前视口或当前数据源中参与全选的行。 */
  rows: TRow[];
  /** 当前所有已选主键。 */
  selectedRowKeys: HynVirtualTableKey[];
}

/**
 * 虚拟表自定义单元格 slot 作用域。
 */
export interface HynVirtualTableSlotScope<TRow> {
  /** 当前行原始数据。 */
  row: TRow;
  /** 当前行在数据源中的下标。 */
  rowIndex: number;
  /** `field` 对应的单元格原始值。 */
  value: unknown;
  /** 当前列配置。 */
  column: HynVirtualTableColumn<TRow>;
}

/**
 * 虚拟表向父组件暴露的方法。
 */
export interface HynVirtualTableExpose {
  /** 重新测量虚拟列表尺寸，父容器尺寸变化后调用。 */
  measure: () => void;
  /** 滚动到指定数据下标。 */
  scrollToIndex: (index: number) => void;
}

/** 虚拟表列级样式对象。 */
export type HynVirtualTableColumnStyle = CSSProperties;
