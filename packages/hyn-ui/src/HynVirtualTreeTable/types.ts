import type { CSSProperties } from 'vue';
import type { HynTableAction } from '../HynTable/types';
import type { HynTextOverflowMode } from '../shared/overflow';

/** 虚拟树表统一行主键类型，用于展开、懒加载和滚动定位。 */
export type HynVirtualTreeTableKey = string | number;

/** 虚拟树表列对齐方式。 */
export type HynVirtualTreeTableAlign = 'left' | 'center' | 'right';

/** 虚拟树表高度配置，支持像素数字或 CSS 高度字符串。 */
export type HynVirtualTreeTableHeight = string | number;

/**
 * HYN 虚拟树表列配置。
 *
 * @remarks
 * 树列必须显式设置 `tree: true`，避免普通列误渲染展开按钮。
 */
export interface HynVirtualTreeTableColumn<TRow> {
  /** 列唯一标识，用于渲染 key 和列缓存。 */
  key: string;
  /** 表头标题。 */
  title: string;
  /** 绑定到行对象的字段名；自定义 slot 或操作列可不传。 */
  field?: Extract<keyof TRow, string>;
  /** 固定列宽，树列建议给出稳定宽度以减少虚拟滚动抖动。 */
  width?: number;
  /** 最小列宽，参与剩余宽度分配。 */
  minWidth?: number;
  /** 单元格内容对齐方式。 */
  align?: HynVirtualTreeTableAlign;
  /** 是否为承载层级缩进和展开按钮的树列。 */
  tree?: boolean;
  /** 固定到右侧的列，通常用于操作列。 */
  sticky?: 'right';
  /** 自定义单元格 slot 名，slot scope 使用 `HynVirtualTreeTableSlotScope`。 */
  slot?: string;
  /**
   * 文本溢出展示策略。
   *
   * @remarks
   * 未声明时继承虚拟树表级 `overflowMode`，表格级未声明时继承 HYN 全局配置；只有显式 `ellipsis` 才省略并展示 tooltip。
   */
  overflowMode?: HynTextOverflowMode;
  /** 操作按钮配置，默认由 HYN 内置 Element Plus Tooltip/Button 渲染。 */
  actions?: HynTableAction<TRow>[];
}

/**
 * 虚拟树表行禁用判断函数。
 *
 * @remarks
 * 只影响树列内选择框和批量选择，不改变展开按钮、滚动或普通单元格渲染。
 */
export type HynVirtualTreeTableRowDisabled<TRow> = (row: TRow) => boolean;

/**
 * 虚拟树表单行选择变化事件载荷。
 */
export interface HynVirtualTreeTableSelectionChange<TRow> {
  /** 本次切换的业务行。 */
  row: TRow;
  /** 本次切换后该行是否处于选中状态。 */
  selected: boolean;
  /** 当前全部已选节点主键。 */
  selectedRowKeys: HynVirtualTreeTableKey[];
}

/**
 * 虚拟树表表头批量选择事件载荷。
 */
export interface HynVirtualTreeTableSelectAllChange<TRow> {
  /** 本次表头选择框是否切换为选中。 */
  selected: boolean;
  /** 当前可见且未禁用的业务行。 */
  rows: TRow[];
  /** 当前全部已选节点主键。 */
  selectedRowKeys: HynVirtualTreeTableKey[];
}

/**
 * 虚拟树表内部可见行模型。
 */
export interface HynVirtualTreeTableRow<TRow> {
  /** 字符串化后的节点 key，保证数字和字符串主键比较稳定。 */
  key: HynVirtualTreeTableKey;
  /** 业务原始行数据。 */
  row: TRow;
  /** 当前节点深度，根节点为 0。 */
  depth: number;
  /** 当前节点是否存在子节点或后端声明可懒加载子节点。 */
  hasChildren: boolean;
  /** 当前节点是否展开。 */
  expanded: boolean;
  /** 当前节点是否正在懒加载子节点。 */
  loading?: boolean;
  /** 当前节点最近一次懒加载失败信息。 */
  loadError?: string;
}

/**
 * 虚拟树表自定义单元格 slot 作用域。
 */
export interface HynVirtualTreeTableSlotScope<TRow> {
  /** 当前行原始数据。 */
  row: TRow;
  /** 当前行的树状态，包含 depth、expanded 和 loading。 */
  treeRow: HynVirtualTreeTableRow<TRow>;
  /** `field` 对应的单元格原始值。 */
  value: unknown;
}

/**
 * 虚拟树表向父组件暴露的方法。
 */
export interface HynVirtualTreeTableExpose {
  /** 重新测量虚拟列表尺寸，父容器尺寸变化后调用。 */
  measure: () => void;
  /** 滚动到指定可见行下标。 */
  scrollToIndex: (index: number) => void;
}

/** 虚拟树表列级样式对象。 */
export type HynVirtualTreeTableColumnStyle = CSSProperties;
