import type { Component, CSSProperties } from 'vue';
import type { HynTextOverflowMode } from '../shared/overflow';

/**
 * HYN 表格统一行主键类型。
 *
 * @remarks
 * 业务主键允许数字或字符串，组件内部会在选择和比较时按稳定 key 处理。
 */
export type HynTableKey = string | number;

/**
 * HYN 表格列对齐方式，保持与 Element Plus table 的 align 语义一致。
 */
export type HynTableAlign = 'left' | 'center' | 'right';

/**
 * HYN 表格内置列类型。
 *
 * @remarks
 * `actions` 列由组件统一渲染按钮和权限控制，普通业务页不应再手写操作列布局。
 */
export type HynTableColumnType = 'selection' | 'index' | 'text' | 'date' | 'actions';

/**
 * 操作按钮视觉类型，透传到 Element Plus 按钮的 type 协议。
 */
export type HynTableActionType = 'primary' | 'success' | 'warning' | 'danger' | 'info';

/**
 * 后端排序事件使用的排序方向。
 */
export type HynTableSortOrder = 'ascending' | 'descending' | null;

/**
 * 手动触发表格排序时必须传入非空排序方向。
 */
export type HynTableResolvedSortOrder = Exclude<HynTableSortOrder, null>;

/**
 * 列排序模式，`custom` 表示由页面把排序条件提交给后端。
 */
export type HynTableSortable = boolean | 'custom';

/**
 * HYN 表格操作列按钮配置。
 */
export interface HynTableAction<TRow> {
  /** 操作唯一标识，用于渲染 key 和排查重复按钮。 */
  key: string;
  /** 按钮文案，展示在按钮或 tooltip 中。 */
  label: string;
  /** Element Plus 图标组件或全局图标名。 */
  icon: Component | string;
  /** 按钮视觉类型，不传时使用普通文本按钮语义。 */
  type?: HynTableActionType;
  /** RuoYi 权限标识；全部通过时才展示按钮。 */
  permissions?: string[];
  /** 按行控制按钮是否展示，适合状态机或行级业务约束。 */
  visible?: (row: TRow) => boolean;
  /** 按行控制按钮是否禁用，禁用时仍保留布局位置。 */
  disabled?: boolean | ((row: TRow) => boolean);
  /** 点击后的业务处理函数，组件不吞掉异步错误。 */
  onClick: (row: TRow) => void | Promise<void>;
}

/**
 * 列 formatter 的上下文。
 */
export interface HynTableFormatterContext<TRow> {
  /** 当前行原始数据。 */
  row: TRow;
  /** 当前行在本页数据中的下标。 */
  rowIndex: number;
  /** `prop` 对应的单元格原始值；无 `prop` 时为 undefined。 */
  value: unknown;
}

/**
 * 单元格展示值格式化函数。
 *
 * @remarks
 * 只负责展示文本，复杂交互内容应使用 `slot`，避免 formatter 承载副作用。
 */
export type HynTableFormatter<TRow> = (context: HynTableFormatterContext<TRow>) => string | number | null | undefined;

/**
 * HYN 普通表格列配置。
 */
export interface HynTableColumn<TRow> {
  /** 列唯一标识，用于渲染 key、列显隐和本地配置缓存。 */
  key: string;
  /** 表头标题。 */
  label: string;
  /** 绑定到行对象的字段名；自定义 slot 或操作列可不传。 */
  prop?: Extract<keyof TRow, string>;
  /** 内置列类型，不传时按普通文本列处理。 */
  type?: HynTableColumnType;
  /** 固定列宽，语义对应 Element Plus table-column width。 */
  width?: string | number;
  /** 最小列宽，语义对应 Element Plus table-column min-width。 */
  minWidth?: string | number;
  /** 单元格内容对齐方式。 */
  align?: HynTableAlign;
  /** 固定列位置，操作列常用 `right`。 */
  fixed?: boolean | 'left' | 'right';
  /** 自定义单元格 slot 名，slot scope 使用 `HynTableSlotScope`。 */
  slot?: string;
  /**
   * 文本溢出展示策略。
   *
   * @remarks
   * 未声明时继承表格级 `overflowMode`；只有 `ellipsis` 会省略并在真实溢出时展示 tooltip。
   */
  overflowMode?: HynTextOverflowMode;
  /**
   * 旧版文本溢出 tooltip 开关。
   *
   * @deprecated 新代码使用 `overflowMode`；保留该字段是为了让既有页面在迁移窗口内保持类型和行为一致。
   */
  tooltip?: boolean;
  /** 日期列展示格式，配合内置 `date` 类型使用。 */
  dateFormat?: string;
  /** 排序模式；后端排序使用 `custom`。 */
  sortable?: HynTableSortable;
  /** 可切换的排序方向列表，透传给 Element Plus。 */
  sortOrders?: HynTableSortOrder[];
  /** 文本列展示格式化函数，不应产生副作用。 */
  formatter?: HynTableFormatter<TRow>;
  /** 操作列按钮列表，仅在 `type: 'actions'` 时生效。 */
  actions?: HynTableAction<TRow>[];
}

/**
 * HYN 表格选择变更事件载荷。
 */
export interface HynTableSelectionChange<TRow> {
  /** 当前已选中的完整行数据。 */
  selectedRows: TRow[];
  /** 当前已选中的行主键，用于批量按钮和跨组件状态。 */
  selectedRowKeys: HynTableKey[];
}

/**
 * HYN 表格自定义单元格 slot 作用域。
 */
export interface HynTableSlotScope<TRow> {
  /** 当前行原始数据。 */
  row: TRow;
  /** 当前行在本页数据中的下标。 */
  rowIndex: number;
  /** `prop` 对应的单元格原始值。 */
  value: unknown;
  /** 当前列配置，便于复用通用 slot。 */
  column: HynTableColumn<TRow>;
}

/**
 * HYN 表格当前排序状态。
 */
export interface HynTableSortState {
  /** 参与排序的行字段名。 */
  prop: string;
  /** 当前排序方向；清空排序时为 null。 */
  order: HynTableSortOrder;
}

/**
 * HYN 表格排序变更事件载荷。
 */
export interface HynTableSortChange<TRow> extends HynTableSortState {
  /** Element Plus 原始列对象，保留给少数兼容场景。 */
  column?: unknown;
  /** 预留行上下文，当前普通表头排序通常为空。 */
  row?: TRow;
}

/**
 * HYN 表格向父组件暴露的方法。
 */
export interface HynTableExpose {
  /** 清空 Element Plus 内部选择状态。 */
  clearSelection: () => void;
  /** 切换单行选中状态，适合外部回显选择。 */
  toggleRowSelection: (row: unknown, selected?: boolean) => void;
  /** 触发表格排序，常用于恢复缓存中的排序条件。 */
  sort: (prop: string, order: HynTableResolvedSortOrder) => void;
}

/**
 * HYN 表格列级样式对象。
 */
export type HynTableColumnStyle = CSSProperties;
