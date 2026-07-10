<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="dialogWidth"
    :top="top"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="closeOnClickModal"
    append-to-body
    :class="dialogClass"
    :data-hyn-dialog-overlay-id="overlayDialogId"
    @update:model-value="value => emit('update:modelValue', value)"
    @close="handleClose"
    @closed="emit('closed')"
  >
    <div class="hyn-dialog__body" :class="bodyClassList">
      <hyn-form
        v-if="isConfigForm"
        ref="formRef"
        :model="formModel"
        :fields="fields"
        :rules="rules"
        :label-width="labelWidth"
        :label-overflow-mode="labelOverflowMode"
        :columns="columns"
        :loading="formLoading"
        :scroll-to-error="scrollToError"
        :validate-on-rule-change="validateOnRuleChange"
      >
        <template v-for="slotName in forwardedSlotNames" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </hyn-form>
      <slot v-else />
    </div>
    <template v-if="showFooter" #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <el-button type="primary" :loading="confirmButtonLoading" @click="handleConfirm">{{ resolvedConfirmText }}</el-button>
          <el-button @click="handleCancel">{{ resolvedCancelText }}</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance as ElFormInstance } from 'element-plus';
import type { FormItemRule } from 'element-plus';
import { getCurrentInstance } from 'vue';
import type {
  HynDialogEmits,
  HynDialogExpose,
  HynDialogField,
  HynDialogModel,
  HynDialogProps
} from './types';
import HynForm from '../HynForm/index.vue';
import type { HynFormExpose, HynFormField, HynFormFieldSpan } from '../HynForm/types';
import { getFormFieldValue, isFormFieldVisible, resolveFormFieldSpan, resolveFormOptions } from '../HynForm/utils';
import {
  measureHynTextWidth,
  parseHynCssSizeToPixels,
  resolveHynTextOverflowMode,
  type HynTextOverflowMode
} from '../shared/overflow';
import {
  getHynFormFieldControlMinWidth,
  HYN_FORM_COLUMN_GAP,
  HYN_FORM_LABEL_BASE_INLINE_PADDING,
  HYN_FORM_LABEL_REQUIRED_MARKER_WIDTH,
  HYN_FORM_LABEL_TOOLTIP_ICON_WIDTH,
  HYN_FORM_REGULAR_CONTROL_MIN_WIDTH
} from '../shared/formLayout';
import { useHynGlobalConfig } from '../config';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import { dispatchHynDialogOverlayClose } from '../shared/dialogOverlay';

const props = withDefaults(defineProps<HynDialogProps>(), {
  width: undefined,
  top: undefined,
  bodyClass: undefined,
  scrollMode: 'auto',
  confirmText: undefined,
  cancelText: undefined,
  confirmLoading: false,
  showFooter: true,
  destroyOnClose: false,
  closeOnClickModal: true,
  model: undefined,
  fields: undefined,
  rules: undefined,
  labelWidth: '92px',
  columns: 2,
  autoWidth: true,
  formLoading: false,
  scrollToError: true,
  validateOnRuleChange: false
});

const emit = defineEmits<HynDialogEmits>();
const slots = useSlots();
const instance = getCurrentInstance();
/** 弹窗实例标识用于在关闭时仅收起自身 DOM 范围内的 teleport 浮层。 */
const overlayDialogId = `hyn-dialog-${instance?.uid ?? 'unknown'}`;
// 配置式表单弹窗通过 HynForm expose 执行校验和重置，slot 弹窗不会依赖该实例。
const formRef = ref<HynFormExpose>();
const { t } = useHynI18n();
const hynConfig = useHynGlobalConfig();
// 未显式传 confirmLoading 时由弹窗托管异步确认过程，避免按钮提前恢复可点击。
const internalConfirmLoading = ref(false);
// 当前视口宽度参与自动弹窗宽度计算，窗口 resize 时只更新这一处基准状态。
const viewportWidth = ref(typeof window === 'undefined' ? 0 : window.innerWidth);
// 配置式弹窗关闭时不需要监听全局 resize；显式标记用于避免打开/关闭循环重复绑定。
let viewportResizeBound = false;
const formMeasureFont = 'normal normal 500 14px Arial, sans-serif';
const defaultConfigDialogWidth = 640;
const defaultSlotDialogWidth = 560;
const dialogViewportGutter = 40;
const dialogMobileViewportGutter = 16;
const dialogBodyHorizontalPadding = 40;
const formControlMeasureFont = 'normal normal 400 14px Arial, sans-serif';

// 只有同时提供 model 和 fields 时才走配置式 HynForm，普通内容弹窗继续渲染默认 slot。
const isConfigForm = computed(() => Boolean(props.model && props.fields?.length));
// fields 对外可选，内部统一成 HYN 字段数组，供宽度测量和 HynForm 渲染共享。
const fields = computed<HynDialogField[]>(() => (props.fields ?? []) as HynDialogField[]);
// model 未传时使用空对象，保证配置式判断之外的宽度计算不会访问 undefined。
const formModel = computed(() => (props.model ?? {}) as HynDialogModel);
// label 溢出策略继承 HYN 全局配置，弹窗宽度计算和 HynForm 渲染必须使用同一策略。
const labelOverflowMode = computed<HynTextOverflowMode>(() =>
  resolveHynTextOverflowMode(props.labelOverflowMode, hynConfig.overflowMode)
);
// 弹窗最终宽度由显式 width、配置式表单测量和视口安全边距共同决定。
const dialogWidth = computed(() => resolveDialogWidth());
const dialogClass = computed(() => ['hyn-dialog', `is-scroll-${props.scrollMode}`]);
const bodyClassList = computed(() => [props.bodyClass, `is-scroll-${props.scrollMode}`]);
// 确认按钮文案在弹窗层统一兜底，业务页只在需要差异文案时传入。
const resolvedConfirmText = computed(() => props.confirmText ?? t('common.confirm'));
// 取消按钮文案在弹窗层统一兜底，避免每个业务弹窗重复读 i18n。
const resolvedCancelText = computed(() => props.cancelText ?? t('common.cancel'));
// 外部 loading 和内部异步托管合并成单一按钮状态，防止两套状态互相覆盖。
const confirmButtonLoading = computed(() => props.confirmLoading || internalConfirmLoading.value);
const forwardedSlotNames = computed(() =>
  Object.keys(slots).filter(slotName => !['default', 'footer'].includes(slotName))
);
const shouldTrackViewportResize = computed(() => props.modelValue && isConfigForm.value && props.autoWidth);

type HynDialogEventKey = 'onConfirm' | 'onSubmit';
type HynDialogEventHandler = (...args: unknown[]) => unknown;

/** 判断确认处理结果是否为异步任务，只有真实等待接口时才托管按钮 loading。 */
function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    (typeof value === 'object' || typeof value === 'function') &&
    value !== null &&
    typeof (value as PromiseLike<unknown>).then === 'function'
  );
}

/** 读取父组件传入的事件处理函数，便于在 HynDialog 内部等待异步确认完成。 */
function getDialogEventHandlers(eventKey: HynDialogEventKey): HynDialogEventHandler[] {
  const handler = instance?.vnode.props?.[eventKey] as HynDialogEventHandler | HynDialogEventHandler[] | undefined;
  if (Array.isArray(handler)) {
    return handler.filter(item => typeof item === 'function');
  }
  if (typeof handler === 'function') {
    return [handler];
  }
  return [];
}

/** 执行确认类事件；当调用方返回 Promise 时，确定按钮保持 loading 直到 Promise 结束。 */
async function runConfirmEvent(eventKey: HynDialogEventKey, fallback: () => void, args: unknown[]): Promise<void> {
  const handlers = getDialogEventHandlers(eventKey);
  if (handlers.length === 0) {
    fallback();
    return;
  }

  const results = handlers.map(handler => handler(...args));
  const pendingResults = results.filter(isPromiseLike);
  if (pendingResults.length === 0) {
    return;
  }

  internalConfirmLoading.value = true;
  try {
    await Promise.all(pendingResults);
  } finally {
    internalConfirmLoading.value = false;
  }
}

/** 记录当前视口宽度，弹窗打开和窗口缩放时重新计算配置化表单的可用空间。 */
function updateViewportWidth(): void {
  viewportWidth.value = typeof window === 'undefined' ? 0 : window.innerWidth;
}

/** 只在弹窗打开且需要自动宽度时绑定 resize，避免列表页里的隐藏弹窗常驻全局 listener。 */
function bindViewportResize(): void {
  if (viewportResizeBound || typeof window === 'undefined') {
    return;
  }
  window.addEventListener('resize', updateViewportWidth);
  viewportResizeBound = true;
}

/** 与 bindViewportResize 成对释放；关闭弹窗后宽度会在下次打开时重新读取。 */
function unbindViewportResize(): void {
  if (!viewportResizeBound || typeof window === 'undefined') {
    return;
  }
  window.removeEventListener('resize', updateViewportWidth);
  viewportResizeBound = false;
}

/** 把 HynDialog 的宽度配置转成像素，autoWidth 下宽度是目标下限而不是硬上限。 */
function parseDialogWidth(width: string | undefined): number | undefined {
  if (width === undefined) {
    return undefined;
  }
  const parsedWidth = parseHynCssSizeToPixels(width, viewportWidth.value);
  if (parsedWidth === undefined) {
    throw new Error(`HynDialog autoWidth only supports numeric, px, or percent width values, received: ${width}`);
  }
  return parsedWidth;
}

/** 解析 label 配置宽度，和 HynForm 保持相同的公共边界。 */
function parseDialogLabelWidth(labelWidth: string | number): number {
  if (typeof labelWidth === 'number') {
    return labelWidth;
  }
  const matchedWidth = labelWidth.trim().match(/^(\d+(?:\.\d+)?)px$/);
  if (!matchedWidth) {
    throw new Error(`HynDialog labelWidth only supports pixel values, received: ${labelWidth}`);
  }
  return Number(matchedWidth[1]);
}

/** 根据当前语言字段 label 计算单个字段需要的 label 宽度。 */
function getMeasuredDialogFieldLabelWidth(field: HynFormField): number {
  const baseWidth = parseDialogLabelWidth(props.labelWidth);
  if (labelOverflowMode.value !== 'fit') {
    return baseWidth;
  }
  return Math.ceil(Math.max(baseWidth, measureHynTextWidth(field.label, formMeasureFont) + getFieldLabelExtraWidth(field)));
}

/** 计算普通两列字段共享的 label 宽度，整行长 label 不反向挤压双列字段。 */
function getMeasuredDialogSharedLabelWidth(visibleFields: HynFormField[]): number {
  const columnFields = props.columns === 2 ? visibleFields.filter(field => getDialogFieldSpan(field) === 1) : visibleFields;
  const labelFields = columnFields.length > 0 ? columnFields : visibleFields;
  return labelFields.reduce(
    (maxWidth, field) => Math.max(maxWidth, getMeasuredDialogFieldLabelWidth(field)),
    parseDialogLabelWidth(props.labelWidth)
  );
}

/** 整行字段使用自己的 label 宽度，但不小于双列字段共享宽度，避免短 label 行突然左移。 */
function getMeasuredDialogItemLabelWidth(field: HynFormField, sharedLabelWidth: number): number {
  if (props.columns === 1 || getDialogFieldSpan(field) === 1) {
    return sharedLabelWidth;
  }
  return Math.max(sharedLabelWidth, getMeasuredDialogFieldLabelWidth(field));
}

/** 根据字段类型推导控件最小宽度，避免长 label 把输入框挤成不可用宽度。 */
function getFieldControlMinWidth(field: HynFormField): number {
  return getHynFormFieldControlMinWidth({
    fieldType: field.type,
    optionLabels: getFieldDisplayLabels(field),
    measureFont: formControlMeasureFont
  });
}

/** 读取 choice 字段当前选项文本，使弹窗自然宽度按当前语言真实内容计算。 */
function getFieldDisplayLabels(field: HynFormField): string[] {
  if (field.type !== 'radio' && field.type !== 'checkbox' && field.type !== 'select') {
    return [];
  }
  const options = resolveFormOptions(field.options, formModel.value);
  if (field.type === 'radio' || field.type === 'checkbox') {
    return options.map(option => option.label);
  }

  const labels = new Set<string>();
  options.forEach(option => labels.add(option.label));
  if (field.placeholder) {
    labels.add(field.placeholder);
  }
  getSelectedOptionLabels(field, options).forEach(label => labels.add(label));
  return Array.from(labels).filter(label => label.length > 0);
}

/** 从当前表单值反查 select 展示文案；选项尚未加载时使用原值文本参与宽度估算。 */
function getSelectedOptionLabels(
  field: Extract<HynFormField, { type: 'select' }>,
  options: ReturnType<typeof resolveFormOptions>
): string[] {
  const value = getFormFieldValue(formModel.value, field);
  const values = Array.isArray(value) ? value : [value];
  return values
    .filter(item => item !== undefined && item !== null && item !== '')
    .map(item => {
      const matchedOption = options.find(option => option.value === item);
      return matchedOption?.label ?? String(item);
    });
}

/** 判断字段是否会由表单规则渲染必填星号。 */
function isFieldRequired(field: HynFormField): boolean {
  if (field.required) {
    return true;
  }
  if (!field.prop) {
    return false;
  }
  const fieldRules = props.rules?.[field.prop] as FormItemRule | FormItemRule[] | undefined;
  if (Array.isArray(fieldRules)) {
    return fieldRules.some(rule => rule.required === true);
  }
  return fieldRules?.required === true;
}

/** 计算 label 文案之外的必填星号、帮助图标和安全间距，保持弹窗宽度估算与 HynForm 实际排版一致。 */
function getFieldLabelExtraWidth(field: HynFormField): number {
  return (
    HYN_FORM_LABEL_BASE_INLINE_PADDING +
    (isFieldRequired(field) ? HYN_FORM_LABEL_REQUIRED_MARKER_WIDTH : 0) +
    (field.tooltip ? HYN_FORM_LABEL_TOOLTIP_ICON_WIDTH : 0)
  );
}

/** 归一化字段跨列规则，用于估算两列和整行字段分别需要的宽度。 */
function getDialogFieldSpan(field: HynFormField): HynFormFieldSpan {
  return resolveFormFieldSpan(field);
}

/** 计算配置化表单在当前语言下的自然宽度。 */
function getConfigFormDialogWidth(): number {
  const visibleFields = fields.value.filter(field => isFormFieldVisible(field, formModel.value));
  if (visibleFields.length === 0) {
    return defaultConfigDialogWidth;
  }
  const columnCount = props.columns;
  const labelWidth = getMeasuredDialogSharedLabelWidth(visibleFields);
  const columnControlWidth = visibleFields
    .filter(field => getDialogFieldSpan(field) === 1)
    .reduce((maxWidth, field) => Math.max(maxWidth, getFieldControlMinWidth(field)), HYN_FORM_REGULAR_CONTROL_MIN_WIDTH);
  const allControlWidth = visibleFields.reduce(
    (maxWidth, field) => Math.max(maxWidth, getFieldControlMinWidth(field)),
    HYN_FORM_REGULAR_CONTROL_MIN_WIDTH
  );
  const fullFieldWidth = visibleFields
    .filter(field => getDialogFieldSpan(field) !== 1)
    .reduce(
      (maxWidth, field) => Math.max(maxWidth, getMeasuredDialogItemLabelWidth(field, labelWidth) + getFieldControlMinWidth(field)),
      labelWidth + HYN_FORM_REGULAR_CONTROL_MIN_WIDTH
    );
  const columnLayoutWidth =
    columnCount === 2
      ? labelWidth * 2 + columnControlWidth * 2 + HYN_FORM_COLUMN_GAP
      : labelWidth + allControlWidth;
  return Math.ceil(Math.max(columnLayoutWidth, fullFieldWidth) + dialogBodyHorizontalPadding);
}

/** 读取当前视口允许的弹窗最大宽度，保持桌面和移动端与全局 HYN 弹窗 CSS 一致。 */
function getDialogViewportLimit(): number {
  const width = viewportWidth.value;
  if (width <= 0) {
    return defaultConfigDialogWidth;
  }
  const gutter = width <= 640 ? dialogMobileViewportGutter : dialogViewportGutter;
  return Math.max(320, width - gutter);
}

/** 解析最终传给 Element Plus Dialog 的宽度。 */
function resolveDialogWidth(): string {
  if (!isConfigForm.value || !props.autoWidth) {
    return props.width ?? (isConfigForm.value ? `${defaultConfigDialogWidth}px` : `${defaultSlotDialogWidth}px`);
  }
  if (!props.modelValue) {
    return props.width ?? `${defaultConfigDialogWidth}px`;
  }
  const requestedWidth = parseDialogWidth(props.width) ?? defaultConfigDialogWidth;
  const naturalWidth = getConfigFormDialogWidth();
  return `${Math.min(Math.max(requestedWidth, naturalWidth), getDialogViewportLimit())}px`;
}

/** 触发确认动作，配置化表单先校验再提交，普通 slot 弹窗保持原 confirm 行为。 */
async function handleConfirm(): Promise<void> {
  if (!isConfigForm.value) {
    await runConfirmEvent('onConfirm', () => emit('confirm'), []);
    return;
  }
  const valid = await validate();
  if (valid) {
    await runConfirmEvent('onSubmit', () => emit('submit', formModel.value), [formModel.value]);
  }
}

/** 取消按钮统一关闭弹窗并通知调用方。 */
function handleCancel(): void {
  emit('cancel');
  emit('update:modelValue', false);
}

/** 透出关闭事件，保持调用方清理表单或路由参数的能力。 */
function handleClose(): void {
  emit('close');
}

/** 校验内部配置化表单。 */
async function validate(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? true;
}

/** 重置内部配置化表单字段。 */
function resetFields(): void {
  formRef.value?.resetFields();
}

/** 清理内部配置化表单校验状态。 */
function clearValidate(): void {
  formRef.value?.clearValidate();
}

/** 滚动到内部配置化表单的指定字段。 */
function scrollToField(prop: string): void {
  formRef.value?.scrollToField(prop);
}

/** 返回底层 Element Plus Form 实例。 */
function getFormRef(): ElFormInstance | undefined {
  return formRef.value?.getFormRef();
}

onBeforeUnmount(() => {
  unbindViewportResize();
});

/**
 * 弹窗开始关闭时先收起自定义 teleport 浮层，避免弹窗内容保留或离场动画期间出现脱离弹窗的残留面板。
 */
watch(
  () => props.modelValue,
  visible => {
    if (!visible) {
      dispatchHynDialogOverlayClose(overlayDialogId);
    }
  },
  { flush: 'sync' }
);

watch(
  shouldTrackViewportResize,
  isTracking => {
    if (!isTracking) {
      unbindViewportResize();
      return;
    }
    updateViewportWidth();
    bindViewportResize();
    void nextTick(() => {
      updateViewportWidth();
    });
  },
  { immediate: true, flush: 'post' }
);

defineExpose<HynDialogExpose>({
  validate,
  resetFields,
  clearValidate,
  scrollToField,
  getFormRef
});
</script>
