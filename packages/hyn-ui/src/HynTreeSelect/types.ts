/**
 * HYN 树选择组件绑定值。
 *
 * @remarks
 * 单选字段绑定单个树节点主键，多选字段绑定树节点主键数组。
 */
export type HynTreeSelectValue = string | number;

/**
 * HYN 树选择组件对外绑定模型。
 */
export type HynTreeSelectModelValue = HynTreeSelectValue | HynTreeSelectValue[] | undefined | null;

/**
 * HYN 树节点原始数据。
 *
 * @remarks
 * 业务树字段名通过 `props` 映射读取，组件不要求调用方提前转成固定字段名。
 */
export type HynTreeSelectNode = object;

/**
 * HYN 树节点字段映射。
 */
export interface HynTreeSelectNodeProps {
  /** 节点值字段名，默认 value。 */
  value?: string;
  /** 节点显示字段名，默认 label。 */
  label?: string;
  /** 子节点字段名，默认 children。 */
  children?: string;
  /** 禁用状态字段名，默认 disabled。 */
  disabled?: string;
}

/**
 * HYN 树选择平铺选项。
 */
export interface HynTreeSelectFlatOption {
  /** 展示文案。 */
  label: string;
  /** 节点主键。 */
  value: HynTreeSelectValue;
  /** 是否禁用。 */
  disabled: boolean;
  /** 预处理后的本地搜索文本。 */
  searchText: string;
}

/**
 * HYN 树选择组件 props。
 */
export interface HynTreeSelectProps {
  /** 已选树节点主键；单选为单个值，多选为数组。 */
  modelValue?: HynTreeSelectModelValue;
  /** 树节点数据。 */
  data?: HynTreeSelectNode[];
  /** Element Plus tree-select 节点字段映射。 */
  props?: HynTreeSelectNodeProps;
  /** 树节点唯一键字段名；不传时使用 valueKey 或节点 value 字段。 */
  nodeKey?: string;
  /** 节点值字段名。 */
  valueKey?: string;
  /** 下拉占位提示。 */
  placeholder?: string;
  /** 外部加载态。 */
  loading?: boolean;
  /** 是否禁用选择器。 */
  disabled?: boolean;
  /** 是否显示清空按钮。 */
  clearable?: boolean;
  /** 是否允许关键字过滤。 */
  filterable?: boolean;
  /** 是否启用多选。 */
  multiple?: boolean;
  /** 树形多选的初始父子联动状态；开启时已选父节点级联后代，使用 `v-model:linkage` 可同步到调用方。 */
  linkage?: boolean;
  /** 是否过滤被标记为 disabled 的节点。 */
  filterDisabled?: boolean;
  /** 是否把树展示为 Select V2 虚拟平铺列表。 */
  flatten?: boolean;
  /** 多选时是否折叠 tag。 */
  collapseTags?: boolean;
  /** 折叠 tag 时最多显示的 tag 数。 */
  maxCollapseTags?: number;
  /** 下拉层是否 teleport 到 body。 */
  teleported?: boolean;
  /** 树形下拉宽度；仅层级树模式使用，平铺 Select V2 仍跟随控件宽度。 */
  dropdownWidth?: number | string;
  /** 下拉虚拟列表高度。 */
  dropdownHeight?: number;
  /** 平铺选项行高。 */
  optionHeight?: number;
}

/**
 * HYN 树选择组件事件。
 */
export interface HynTreeSelectEmits {
  /** 同步当前选择值。 */
  'update:modelValue': [value: HynTreeSelectModelValue];
  /** 同步父子联动模式，使用 `v-model:linkage` 时由调用方持久化状态。 */
  'update:linkage': [linkage: boolean];
  /** 选择变化时通知调用方。 */
  change: [value: HynTreeSelectModelValue];
  /** 用户清空选择时触发。 */
  clear: [];
  /** 下拉显示状态变化时触发。 */
  'visible-change': [visible: boolean];
  /** 输入聚焦时触发。 */
  focus: [];
}
