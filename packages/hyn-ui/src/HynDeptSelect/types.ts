/**
 * HYN 部门选择组件绑定值。
 *
 * @remarks
 * 单选字段绑定单个部门主键，多选字段绑定部门主键数组；空值由组件按单选或多选模式归一化。
 */
export type HynDeptSelectValue = string | number;

/**
 * HYN 部门选择组件对外绑定模型。
 */
export type HynDeptSelectModelValue = HynDeptSelectValue | HynDeptSelectValue[] | undefined | null;

/**
 * HYN 部门选择组件 props。
 */
export interface HynDeptSelectProps {
  /** 已选择的部门主键；单选为单个值，多选为数组。 */
  modelValue?: HynDeptSelectModelValue;
  /** 是否启用多选，多选时内部展示复选框并写回数组。 */
  multiple?: boolean;
  /** 下拉占位提示；未传时使用系统统一选择文案。 */
  placeholder?: string;
  /** 是否禁用选择器。 */
  disabled?: boolean;
  /** 是否显示清空按钮。 */
  clearable?: boolean;
  /** 是否允许输入关键字过滤部门节点。 */
  filterable?: boolean;
  /** 树形多选的初始父子部门联动状态；开启时已选父部门级联后代，使用 `v-model:linkage` 可同步到调用方。 */
  linkage?: boolean;
  /** 是否过滤后端标记为 disabled 的部门节点。 */
  filterDisabled?: boolean;
  /** 是否将部门树拍平成同级节点，适合多选且父子不联动的表单字段。 */
  flatten?: boolean;
  /** 多选时是否折叠 tag。 */
  collapseTags?: boolean;
  /** 折叠 tag 时最多显示的 tag 数。 */
  maxCollapseTags?: number;
  /** 下拉层是否 teleport 到 body，默认传送以避免撑高配置化弹窗。 */
  teleported?: boolean;
  /** 树形部门下拉宽度；仅层级树模式使用，平铺模式仍跟随 Select V2。 */
  dropdownWidth?: number | string;
}

/**
 * HYN 部门选择组件事件。
 */
export interface HynDeptSelectEmits {
  /** 同步当前选择值。 */
  'update:modelValue': [value: HynDeptSelectModelValue];
  /** 同步父子联动模式，使用 `v-model:linkage` 时由调用方持久化状态。 */
  'update:linkage': [linkage: boolean];
  /** 选择变化时通知调用方。 */
  change: [value: HynDeptSelectModelValue];
  /** 用户清空选择时触发。 */
  clear: [];
  /** 下拉显示状态变化时触发。 */
  'visible-change': [visible: boolean];
  /** 输入聚焦时触发，业务包装层会借此提前加载部门树。 */
  focus: [];
}
