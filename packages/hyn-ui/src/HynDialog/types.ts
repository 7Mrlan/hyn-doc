import type { FormRules } from 'element-plus';
import type { HynEntityPageQuery } from '../HynEntityPicker/types';
import type { HynTextOverflowMode } from '../shared/overflow';
import type {
  HynFormBaseField,
  HynFormCheckboxField,
  HynFormCheckboxValue,
  HynFormCronField,
  HynFormDateField,
  HynFormDateValue,
  HynFormDeptSelectField,
  HynFormDisplayField,
  HynFormEditorField,
  HynFormExpose,
  HynFormField,
  HynFormFieldSpan,
  HynFormFieldState,
  HynFormFieldType,
  HynFormFilePickerField,
  HynFormFileUploadField,
  HynFormIconSelectField,
  HynFormImageUploadField,
  HynFormInputField,
  HynFormModel,
  HynFormModelField,
  HynFormNumberField,
  HynFormOption,
  HynFormOptionSource,
  HynFormOptionValue,
  HynFormRadioField,
  HynFormRemoteSelectField,
  HynFormSelectField,
  HynFormSlotField,
  HynFormSwitchField,
  HynFormTextareaField,
  HynFormTreeSelectField
} from '../HynForm/types';

/** HynDialog 表单模型类型，直接复用 HynForm 的模型协议。 */
export type HynDialogModel = HynFormModel;
/** HynDialog 字段类型集合，直接复用 HynForm 的字段类型协议。 */
export type HynDialogFieldType = HynFormFieldType;
/** HynDialog 字段栅格跨度，直接复用 HynForm 的布局协议。 */
export type HynDialogFieldSpan = HynFormFieldSpan;
/** HynDialog 字段状态，支持固定布尔值或按模型动态计算。 */
export type HynDialogFieldState<TModel extends object> = HynFormFieldState<TModel>;
/** HynDialog 选项值类型，限制为表单控件可稳定序列化的原始值。 */
export type HynDialogOptionValue = HynFormOptionValue;
/** HynDialog checkbox 选项值类型。 */
export type HynDialogCheckboxValue = HynFormCheckboxValue;
/** HynDialog 日期字段绑定值类型。 */
export type HynDialogDateValue = HynFormDateValue;
/** HynDialog 通用选项配置。 */
export type HynDialogOption<TValue extends HynDialogOptionValue = HynDialogOptionValue> = HynFormOption<TValue>;
/** HynDialog 选项来源，支持静态数组或按当前表单模型动态生成。 */
export type HynDialogOptionSource<TModel extends object, TValue extends HynDialogOptionValue = HynDialogOptionValue> =
  HynFormOptionSource<TModel, TValue>;
/** HynDialog 字段基础配置。 */
export type HynDialogBaseField<TModel extends object> = HynFormBaseField<TModel>;
/** HynDialog 绑定模型字段的基础配置。 */
export type HynDialogModelField<TModel extends object> = HynFormModelField<TModel>;
/** HynDialog 输入框字段配置。 */
export type HynDialogInputField<TModel extends object> = HynFormInputField<TModel>;
/** HynDialog 多行文本字段配置。 */
export type HynDialogTextareaField<TModel extends object> = HynFormTextareaField<TModel>;
/** HynDialog 数字输入字段配置。 */
export type HynDialogNumberField<TModel extends object> = HynFormNumberField<TModel>;
/** HynDialog 下拉选择字段配置。 */
export type HynDialogSelectField<TModel extends object> = HynFormSelectField<TModel>;
/** HynDialog 单选字段配置。 */
export type HynDialogRadioField<TModel extends object> = HynFormRadioField<TModel>;
/** HynDialog 多选字段配置。 */
export type HynDialogCheckboxField<TModel extends object> = HynFormCheckboxField<TModel>;
/** HynDialog Quartz Cron 字段配置。 */
export type HynDialogCronField<TModel extends object> = HynFormCronField<TModel>;
/** HynDialog 开关字段配置。 */
export type HynDialogSwitchField<TModel extends object> = HynFormSwitchField<TModel>;
/** HynDialog 日期或日期范围字段配置。 */
export type HynDialogDateField<TModel extends object> = HynFormDateField<TModel>;
/** HynDialog 通用树选择字段配置。 */
export type HynDialogTreeSelectField<TModel extends object> = HynFormTreeSelectField<TModel>;
/** HynDialog 系统部门选择字段配置。 */
export type HynDialogDeptSelectField<TModel extends object> = HynFormDeptSelectField<TModel>;
/** HynDialog 远程实体选择字段配置。 */
export type HynDialogRemoteSelectField<
  TModel extends object,
  TRow = unknown,
  TQuery extends HynEntityPageQuery = HynEntityPageQuery
> = HynFormRemoteSelectField<TModel, TRow, TQuery>;
/** HynDialog 图标选择字段配置。 */
export type HynDialogIconSelectField<TModel extends object> = HynFormIconSelectField<TModel>;
/** HynDialog 富文本字段配置。 */
export type HynDialogEditorField<TModel extends object> = HynFormEditorField<TModel>;
/** HynDialog 图片上传字段配置。 */
export type HynDialogImageUploadField<TModel extends object> = HynFormImageUploadField<TModel>;
/** HynDialog 文件上传字段配置。 */
export type HynDialogFileUploadField<TModel extends object> = HynFormFileUploadField<TModel>;
/** HynDialog 本地文件选择字段配置，适合导入业务提交前暂存 `File`。 */
export type HynDialogFilePickerField<TModel extends object> = HynFormFilePickerField<TModel>;
/** HynDialog 只读展示字段配置。 */
export type HynDialogDisplayField<TModel extends object> = HynFormDisplayField<TModel>;
/** HynDialog 自定义 slot 字段配置。 */
export type HynDialogSlotField<TModel extends object> = HynFormSlotField<TModel>;
/** HynDialog 字段联合类型，普通新增/编辑弹窗优先使用它描述表单。 */
export type HynDialogField<TModel extends object = HynDialogModel> = HynFormField<TModel>;

/**
 * HYN 普通弹窗 props。
 *
 * @remarks
 * `model + fields` 表示配置化表单弹窗；纯 slot 弹窗继续使用 `confirm` 事件。
 */
export interface HynDialogProps {
  /** 弹窗显隐绑定值。 */
  modelValue: boolean;
  /** 弹窗标题。 */
  title: string;
  /**
   * 弹窗宽度，透传给 Element Plus Dialog。
   *
   * @defaultValue 配置化表单弹窗为 `640px`，纯 slot 弹窗为 `560px`。
   */
  width?: string;
  /** 弹窗顶部距离，透传给 Element Plus Dialog。 */
  top?: string;
  /** 弹窗内容区附加 class，用于专属复杂内容，不用于覆盖 HYN 壳样式。 */
  bodyClass?: string;
  /** 内容区滚动模式；普通表单使用 auto。 */
  scrollMode?: 'auto' | 'none';
  /** 确认按钮文案。 */
  confirmText?: string;
  /** 取消按钮文案。 */
  cancelText?: string;
  /** 确认按钮 loading。 */
  confirmLoading?: boolean;
  /** 是否展示底部按钮区。 */
  showFooter?: boolean;
  /** 关闭后是否销毁内容。 */
  destroyOnClose?: boolean;
  /** 是否允许点击遮罩关闭。 */
  closeOnClickModal?: boolean;
  /** 配置化表单模型；存在时内部组合 HynForm。 */
  model?: object;
  /** 配置化表单字段；存在时内部组合 HynForm。 */
  fields?: unknown[];
  /** Element Plus 表单校验规则。 */
  rules?: FormRules;
  /**
   * 表单 label 宽度。
   *
   * @defaultValue `92px`
   */
  labelWidth?: string | number;
  /** 表单列数，普通弹窗只支持一列或两列。 */
  columns?: 1 | 2;
  /** 配置化表单弹窗是否按当前语言 label 和控件宽度自动放宽。 */
  autoWidth?: boolean;
  /** 内部 HynForm label 文本溢出策略；未传时继承 HYN 全局配置，项目默认 fit 会尽量完整单行显示。 */
  labelOverflowMode?: HynTextOverflowMode;
  /** 表单区域 loading。 */
  formLoading?: boolean;
  /** 校验失败时是否滚动到第一个错误字段。 */
  scrollToError?: boolean;
  /** 是否在 rules 变化时重新触发表单校验。 */
  validateOnRuleChange?: boolean;
}

/**
 * HYN 普通弹窗事件协议。
 */
export interface HynDialogEmits {
  /** 同步弹窗显隐。 */
  'update:modelValue': [value: boolean];
  /** 纯 slot 弹窗点击确认时触发。 */
  confirm: [];
  /** 配置化表单校验通过后触发。 */
  submit: [model: object];
  /** 点击取消按钮。 */
  cancel: [];
  /** 弹窗开始关闭。 */
  close: [];
  /** 弹窗关闭动画结束。 */
  closed: [];
}

/** HynDialog 对父组件暴露的表单方法。 */
export interface HynDialogExpose extends HynFormExpose {}
