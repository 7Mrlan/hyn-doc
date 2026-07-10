import type { FormInstance as ElFormInstance } from 'element-plus';
import type { DatePickerType, FormItemRule, FormRules, ModelValueType } from 'element-plus';
import type { Component } from 'vue';
import type { UploadExtraData } from '../types';
import type { HynEntityAdapter, HynEntityPageQuery } from '../HynEntityPicker/types';
import type { HynTreeSelectNode, HynTreeSelectNodeProps } from '../HynTreeSelect/types';
import type { HynTextOverflowMode } from '../shared/overflow';

/**
 * HYN 表单模型的最小约束。
 *
 * @remarks
 * 具体业务页应传入更精确的 `Form` 类型，避免在页面层退化成无结构对象。
 */
export type HynFormModel = Record<string, unknown>;

/**
 * HYN 表单字段渲染类型。
 *
 * @remarks
 * 普通新增/编辑表单优先使用这些类型描述字段；复杂业务内容使用 `slot` 作为逃生口。
 */
export type HynFormFieldType =
  | 'input'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'dateRange'
  | 'treeSelect'
  | 'deptSelect'
  | 'remoteSelect'
  | 'iconSelect'
  | 'editor'
  | 'imageUpload'
  | 'fileUpload'
  | 'filePicker'
  | 'cron'
  | 'display'
  | 'slot';

/** HYN 表单字段在两列布局中的跨度。 */
export type HynFormFieldSpan = 1 | 2 | 'full';

/**
 * 字段内容布局模式。
 *
 * @remarks
 * `section` 用于分组或说明性内容，普通输入控件保持默认 `control`。
 */
export type HynFormContentLayout = 'control' | 'inline' | 'section';

/** 字段可见或禁用状态，支持按当前表单模型动态计算。 */
export type HynFormFieldState<TModel extends object> = boolean | ((model: TModel) => boolean);

/** 表单选项值类型，限制为可稳定提交和比较的原始值。 */
export type HynFormOptionValue = string | number | boolean;

/** checkbox 多选项值类型，避免布尔值和多选数组语义冲突。 */
export type HynFormCheckboxValue = string | number;

/** Element Plus 日期组件绑定值类型。 */
export type HynFormDateValue = ModelValueType;

/**
 * HYN 表单选项配置。
 */
export interface HynFormOption<TValue extends HynFormOptionValue = HynFormOptionValue> {
  /** 展示文案。 */
  label: string;
  /** 提交到表单模型的值。 */
  value: TValue;
  /** 是否禁用该选项。 */
  disabled?: boolean;
}

/**
 * HYN 表单选项来源。
 *
 * @remarks
 * 动态函数适合根据当前表单模型做联动；不要在函数中发起异步请求。
 */
export type HynFormOptionSource<TModel extends object, TValue extends HynFormOptionValue = HynFormOptionValue> =
  | HynFormOption<TValue>[]
  | ((model: TModel) => HynFormOption<TValue>[]);

/**
 * HYN 表单字段基础配置。
 */
export interface HynFormBaseField<TModel extends object> {
  /** 字段唯一标识，用于渲染 key 和排查重复字段。 */
  key: string;
  /** 表单项标签。 */
  label: string;
  /** 绑定到表单模型的字段名；展示或 slot 字段可不传。 */
  prop?: Extract<keyof TModel, string>;
  /** 字段渲染类型。 */
  type: HynFormFieldType;
  /** 两列布局中的跨度。 */
  span?: HynFormFieldSpan;
  /** 字段是否展示，可按当前模型动态计算。 */
  visible?: HynFormFieldState<TModel>;
  /** 字段是否禁用，可按当前模型动态计算。 */
  disabled?: HynFormFieldState<TModel>;
  /** 字段内容布局模式。 */
  contentLayout?: HynFormContentLayout;
  /** 标签旁辅助说明，用于解释非显而易见的业务约束。 */
  tooltip?: string;
  /** 是否在视觉上标记必填；真实校验仍以 rules 为准。 */
  required?: boolean;
  /** 字段级 Element Plus 校验规则。 */
  rules?: FormItemRule[];
}

/**
 * 必须绑定模型字段的 HYN 表单字段基础配置。
 */
export interface HynFormModelField<TModel extends object> extends HynFormBaseField<TModel> {
  /** 绑定到表单模型的字段名。 */
  prop: Extract<keyof TModel, string>;
}

/** 单行输入框字段配置。 */
export interface HynFormInputField<TModel extends object> extends HynFormModelField<TModel> {
  /** 字段类型固定为单行输入。 */
  type: 'input';
  /** 输入框占位提示。 */
  placeholder?: string;
  /** 是否显示清空按钮。 */
  clearable?: boolean;
  /** 最大输入长度。 */
  maxlength?: number;
  /** 是否按密码框显示。 */
  showPassword?: boolean;
  /** 原生 autocomplete 属性。 */
  autocomplete?: string;
  /** 原生 name 属性，登录或密码管理器场景使用。 */
  name?: string;
  /** 是否只读。 */
  readonly?: boolean;
  /** 前缀图标组件或图标名。 */
  prefixIcon?: Component | string;
  /** 后缀图标组件或图标名。 */
  suffixIcon?: Component | string;
}

/** 多行文本字段配置。 */
export interface HynFormTextareaField<TModel extends object> extends HynFormModelField<TModel> {
  /** 字段类型固定为多行文本。 */
  type: 'textarea';
  /** 文本域占位提示。 */
  placeholder?: string;
  /** 默认显示行数。 */
  rows?: number;
  /** 最大输入长度。 */
  maxlength?: number;
  /** 是否展示字数统计。 */
  showWordLimit?: boolean;
}

/** 数字输入字段配置。 */
export interface HynFormNumberField<TModel extends object> extends HynFormModelField<TModel> {
  /** 字段类型固定为数字输入。 */
  type: 'number';
  /** 允许的最小值。 */
  min?: number;
  /** 允许的最大值。 */
  max?: number;
  /** 每次点击增减按钮时变化的数值。 */
  step?: number;
  /** 数字精度。 */
  precision?: number;
  /** 数字输入占位提示。 */
  placeholder?: string;
}

/** 下拉选择字段配置。 */
export interface HynFormSelectField<TModel extends object> extends HynFormModelField<TModel> {
  /** 字段类型固定为下拉选择。 */
  type: 'select';
  /** 选项来源；静态字典或同步联动函数。 */
  options: HynFormOptionSource<TModel>;
  /** 下拉占位提示。 */
  placeholder?: string;
  /** 是否显示清空按钮。 */
  clearable?: boolean;
  /** 是否多选。 */
  multiple?: boolean;
  /** 是否允许本地下拉过滤。 */
  filterable?: boolean;
  /** 多选时是否折叠 tag。 */
  collapseTags?: boolean;
  /** 折叠 tag 时最多显示的 tag 数。 */
  maxCollapseTags?: number;
}

/** 单选字段配置。 */
export interface HynFormRadioField<TModel extends object> extends HynFormModelField<TModel> {
  /** 字段类型固定为单选。 */
  type: 'radio';
  /** 单选项来源。 */
  options: HynFormOptionSource<TModel>;
}

/** 多选 checkbox 字段配置。 */
export interface HynFormCheckboxField<TModel extends object> extends HynFormModelField<TModel> {
  /** 字段类型固定为 checkbox 多选。 */
  type: 'checkbox';
  /** 多选项来源。 */
  options: HynFormOptionSource<TModel, HynFormCheckboxValue>;
}

/** 开关字段配置。 */
export interface HynFormSwitchField<TModel extends object> extends HynFormModelField<TModel> {
  /** 字段类型固定为开关。 */
  type: 'switch';
  /** 开启时写入模型的值，需与后端状态契约一致。 */
  activeValue?: HynFormOptionValue;
  /** 关闭时写入模型的值，需与后端状态契约一致。 */
  inactiveValue?: HynFormOptionValue;
  /** 开启状态文案。 */
  activeText?: string;
  /** 关闭状态文案。 */
  inactiveText?: string;
}

/** 日期或日期范围字段配置。 */
export interface HynFormDateField<TModel extends object> extends HynFormModelField<TModel> {
  /** 字段类型固定为日期或日期范围。 */
  type: 'date' | 'dateRange';
  /** Element Plus 日期选择器类型，决定按年、月、日期或日期时间等方式展示。 */
  dateType?: DatePickerType;
  /** 提交到模型的日期格式。 */
  valueFormat?: string;
  /** 展示给用户的日期格式。 */
  format?: string;
  /** 单日期占位提示。 */
  placeholder?: string;
  /** 日期范围开始占位提示。 */
  startPlaceholder?: string;
  /** 日期范围结束占位提示。 */
  endPlaceholder?: string;
  /** 日期范围分隔符。 */
  rangeSeparator?: string;
  /** 默认时间，日期范围可传开始和结束时间。 */
  defaultTime?: Date | [Date, Date];
  /** 是否显示清空按钮。 */
  clearable?: boolean;
}

/** 树形多选字段共享的父子联动配置。 */
export interface HynFormTreeLinkageField<TModel extends object> {
  /** 初始父子联动状态；开启时当前已选父节点会按联动规则级联后代。 */
  linkage?: boolean;
  /** 用户切换父子联动模式时同步业务表单中的关联字段。 */
  onLinkageChange?: (linkage: boolean, model: TModel) => void;
}

/** 通用树选择字段配置。 */
export interface HynFormTreeSelectField<TModel extends object>
  extends HynFormModelField<TModel>, HynFormTreeLinkageField<TModel> {
  /** 字段类型固定为树选择。 */
  type: 'treeSelect';
  /** 树节点数据；远程懒加载、权限半选编辑等复杂树场景不要使用普通 treeSelect。 */
  data: HynTreeSelectNode[];
  /** Element Plus tree-select 节点字段映射，例如 label、children 和 disabled。 */
  props?: HynTreeSelectNodeProps;
  /** 树节点唯一键字段名；不传时使用 valueKey 或节点 value 字段。 */
  nodeKey?: string;
  /** 节点值字段名。 */
  valueKey?: string;
  /** 树选择占位提示。 */
  placeholder?: string;
  /** 是否启用多选。 */
  multiple?: boolean;
  /** 是否显示清空按钮。 */
  clearable?: boolean;
  /** 是否允许关键字过滤。 */
  filterable?: boolean;
  /** 是否过滤被标记为 disabled 的树节点。 */
  filterDisabled?: boolean;
  /** 是否将树展示为虚拟平铺列表，适合大树多选和父子独立选择。 */
  flatten?: boolean;
  /** 多选时是否折叠 tag。 */
  collapseTags?: boolean;
  /** 折叠 tag 时最多显示的 tag 数。 */
  maxCollapseTags?: number;
  /** 下拉层是否 teleport 到 body。 */
  teleported?: boolean;
  /** 树形下拉宽度；仅层级树模式使用，平铺模式仍由 Select V2 控制宽度。 */
  dropdownWidth?: number | string;
}

/** 系统部门选择字段配置。 */
export interface HynFormDeptSelectField<TModel extends object>
  extends HynFormModelField<TModel>, HynFormTreeLinkageField<TModel> {
  /** 字段类型固定为部门选择。 */
  type: 'deptSelect';
  /** 部门选择占位提示。 */
  placeholder?: string;
  /** 是否允许多选；多选时字段值应使用部门主键数组。 */
  multiple?: boolean;
  /** 是否显示清空按钮。 */
  clearable?: boolean;
  /** 是否允许输入关键字过滤部门节点。 */
  filterable?: boolean;
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
  /** 树形部门下拉宽度；仅层级树模式使用，平铺模式仍由 Select V2 控制宽度。 */
  dropdownWidth?: number | string;
}

/** 远程实体选择字段配置。 */
export interface HynFormRemoteSelectField<
  TModel extends object,
  TRow = unknown,
  TQuery extends HynEntityPageQuery = HynEntityPageQuery
> extends HynFormModelField<TModel> {
  /** 字段类型固定为远程实体选择。 */
  type: 'remoteSelect';
  /** 实体数据适配器，负责分页、回显和字段映射。 */
  adapter: HynEntityAdapter<TRow, TQuery>;
  /** 远程搜索写入查询对象的字段名。 */
  searchParam: string;
  /** 每页加载条数。 */
  pageSize?: number;
  /** 下拉占位提示。 */
  placeholder?: string;
  /** 是否多选。 */
  multiple?: boolean;
  /** 是否显示清空按钮。 */
  clearable?: boolean;
  /** 多选时是否折叠 tag。 */
  collapseTags?: boolean;
  /** 折叠 tag 时最多显示的 tag 数。 */
  maxCollapseTags?: number;
  /** 下拉层是否 teleport 到 body。 */
  teleported?: boolean;
}

/** 图标选择字段配置。 */
export interface HynFormIconSelectField<TModel extends object> extends HynFormModelField<TModel> {
  /** 字段类型固定为图标选择。 */
  type: 'iconSelect';
}

/** 富文本编辑字段配置。 */
export interface HynFormEditorField<TModel extends object> extends HynFormModelField<TModel> {
  /** 字段类型固定为富文本编辑器。 */
  type: 'editor';
  /** 编辑器最小高度。 */
  minHeight?: number;
}

/** 图片上传字段配置。 */
export interface HynFormImageUploadField<TModel extends object> extends HynFormModelField<TModel> {
  /** 字段类型固定为图片上传。 */
  type: 'imageUpload';
  /** 最大上传数量。 */
  limit?: number;
  /** 单文件大小上限，单位 MB。 */
  fileSize?: number;
  /** 允许的文件后缀。 */
  fileType?: string[];
  /** 上传时附加的业务参数。 */
  uploadExtraData?: UploadExtraData;
}

/** 文件上传字段配置。 */
export interface HynFormFileUploadField<TModel extends object> extends HynFormModelField<TModel> {
  /** 字段类型固定为文件上传。 */
  type: 'fileUpload';
  /** 最大上传数量。 */
  limit?: number;
  /** 单文件大小上限，单位 MB。 */
  fileSize?: number;
  /** 允许的文件后缀。 */
  fileType?: string[];
}

/** 仅选择本地文件的字段配置。 */
export interface HynFormFilePickerField<TModel extends object> extends HynFormModelField<TModel> {
  /**
   * 字段类型固定为本地文件选择。
   *
   * @remarks
   * 该字段不调用上传接口，只把浏览器选中的 `File` 写入模型，适合导入类业务在提交时自行构造 `FormData`。
   */
  type: 'filePicker';
  /** 原生文件选择器 accept 属性，例如 `.xls,.xlsx`。 */
  accept?: string;
  /** 允许选择的文件后缀；用于前端二次校验。 */
  fileType?: string[];
  /** 单文件大小上限，单位 MB。 */
  fileSize?: number;
  /** 是否使用拖拽上传样式；仅影响选择体验，不会自动上传。 */
  drag?: boolean;
  /** 选择区域下方提示文案。 */
  tip?: string;
  /** 选择按钮或拖拽区域强调文案。 */
  buttonText?: string;
}

/** Quartz Cron 表达式字段配置。 */
export interface HynFormCronField<TModel extends object> extends HynFormModelField<TModel> {
  /** 字段类型固定为 Cron 表达式。 */
  type: 'cron';
  /** 输入框占位提示。 */
  placeholder?: string;
  /** 打开可视化生成器的按钮文案。 */
  buttonText?: string;
}

/** 只读展示字段配置。 */
export interface HynFormDisplayField<TModel extends object> extends HynFormBaseField<TModel> {
  /** 字段类型固定为只读展示。 */
  type: 'display';
  /** 可选模型字段名，存在时从模型读取展示值。 */
  prop?: Extract<keyof TModel, string>;
  /** 静态展示值。 */
  value?: string | number;
  /** 按当前模型格式化展示值。 */
  formatter?: (model: TModel) => string | number;
}

/** 自定义 slot 字段配置。 */
export interface HynFormSlotField<TModel extends object> extends HynFormBaseField<TModel> {
  /** 字段类型固定为自定义 slot。 */
  type: 'slot';
  /** slot 名；不传时使用字段 key。 */
  slot?: string;
}

/**
 * HYN 表单字段联合类型。
 *
 * @remarks
 * 页面声明字段数组时应使用 `HynFormField<BusinessForm>[]` 或 `HynDialogField<BusinessForm>[]`。
 */
export type HynFormField<TModel extends object = HynFormModel> =
  | HynFormInputField<TModel>
  | HynFormTextareaField<TModel>
  | HynFormNumberField<TModel>
  | HynFormSelectField<TModel>
  | HynFormRadioField<TModel>
  | HynFormCheckboxField<TModel>
  | HynFormSwitchField<TModel>
  | HynFormDateField<TModel>
  | HynFormTreeSelectField<TModel>
  | HynFormDeptSelectField<TModel>
  | HynFormRemoteSelectField<TModel>
  | HynFormIconSelectField<TModel>
  | HynFormEditorField<TModel>
  | HynFormImageUploadField<TModel>
  | HynFormFileUploadField<TModel>
  | HynFormFilePickerField<TModel>
  | HynFormCronField<TModel>
  | HynFormDisplayField<TModel>
  | HynFormSlotField<TModel>;

/**
 * HYN 表单组件 props。
 */
export interface HynFormProps<TModel extends object = HynFormModel> {
  /** 表单模型对象。 */
  model: TModel;
  /** 字段配置列表，按数组顺序渲染。 */
  fields: HynFormField<TModel>[];
  /** Element Plus 表单校验规则。 */
  rules?: FormRules;
  /** 表单 label 宽度。 */
  labelWidth?: string | number;
  /** 表单列数，普通弹窗只支持一列或两列。 */
  columns?: 1 | 2;
  /** 表单加载状态。 */
  loading?: boolean;
  /** 校验失败时是否滚动到第一个错误字段。 */
  scrollToError?: boolean;
  /** 是否在 rules 变化时重新触发表单校验。 */
  validateOnRuleChange?: boolean;
  /** label 文本溢出策略；未传时继承 HYN 全局配置，项目默认 fit 会尽量完整单行显示。 */
  labelOverflowMode?: HynTextOverflowMode;
}

/**
 * HYN 表单向父组件暴露的方法。
 */
export interface HynFormExpose {
  /** 触发表单校验，返回是否通过。 */
  validate: () => Promise<boolean>;
  /** 重置字段到 Element Plus 表单记录的初始值。 */
  resetFields: () => void;
  /** 清空全部字段校验状态。 */
  clearValidate: () => void;
  /** 滚动到指定字段。 */
  scrollToField: (prop: string) => void;
  /** 获取内部 Element Plus Form 实例，仅用于兼容现有页面能力。 */
  getFormRef: () => ElFormInstance | undefined;
}

/**
 * HYN 字段 renderer 内部 props。
 *
 * @remarks
 * 业务页面不得直接 import renderer；公共字段能力必须通过字段配置暴露。
 */
export interface HynFormRendererProps {
  /** 当前字段配置。 */
  field: HynFormField;
  /** 当前表单模型。 */
  model: HynFormModel;
  /** 当前字段最终禁用状态。 */
  disabled: boolean;
}
