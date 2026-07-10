import type {
  HynFormField,
  HynFormFieldSpan,
  HynFormModel,
  HynFormOption,
  HynFormOptionSource
} from './types';

const fullSpanFieldTypes = new Set<HynFormField['type']>([
  'textarea',
  'editor',
  'imageUpload',
  'fileUpload',
  'filePicker',
  'cron'
]);

/** 解析字段的布尔状态，兼容静态值和依赖表单模型的动态函数。 */
export function resolveFormFieldState(
  state: boolean | ((model: HynFormModel) => boolean) | undefined,
  model: HynFormModel
): boolean {
  if (typeof state === 'function') {
    return state(model);
  }
  return Boolean(state);
}

/** 判断字段是否应该渲染，默认可见。 */
export function isFormFieldVisible(field: HynFormField, model: HynFormModel): boolean {
  if (field.visible === undefined) {
    return true;
  }
  return resolveFormFieldState(field.visible, model);
}

/** 解析字段栅格跨度，长内容字段默认整行展示。 */
export function resolveFormFieldSpan(field: HynFormField): HynFormFieldSpan {
  if (field.span) {
    return field.span;
  }
  return fullSpanFieldTypes.has(field.type) ? 'full' : 1;
}

/** 按字段 prop 从模型中读取值，display 字段允许无 prop。 */
export function getFormFieldValue(model: HynFormModel, field: HynFormField): unknown {
  if (!field.prop) {
    return undefined;
  }
  return model[field.prop];
}

/** 按字段 prop 写回模型值；无 prop 的展示字段不写入。 */
export function setFormFieldValue(model: HynFormModel, field: HynFormField, value: unknown): void {
  if (!field.prop) {
    return;
  }
  model[field.prop] = value;
}

/** 解析静态或动态选项，供 select、radio、checkbox 等字段统一使用。 */
export function resolveFormOptions(
  source: HynFormOptionSource<HynFormModel>,
  model: HynFormModel
): HynFormOption[] {
  return typeof source === 'function' ? source(model) : source;
}

/** 根据控件类型推导默认校验触发时机。 */
export function resolveFormRuleTrigger(field: HynFormField): 'blur' | 'change' {
  return ['input', 'textarea', 'cron'].includes(field.type) ? 'blur' : 'change';
}
