<template>
  <el-form
    ref="formRef"
    v-loading="loading"
    :model="model"
    :rules="resolvedRules"
    :label-width="resolvedLabelWidth"
    :label-position="resolvedLabelPosition"
    :validate-on-rule-change="validateOnRuleChange"
    class="hyn-form"
    :class="{ 'is-label-stacked': resolvedLabelPosition === 'top' }"
  >
    <div class="hyn-form__grid" :style="gridStyle">
      <el-form-item
        v-for="field in visibleFields"
        :key="field.key"
        :prop="field.prop"
        :label-width="getFormItemLabelWidth(field)"
        class="hyn-form__item"
        :class="getFieldClass(field)"
      >
        <template #label>
          <span class="hyn-form__label" :class="`is-overflow-${labelOverflowMode}`">
            <el-tooltip v-if="field.tooltip" :content="field.tooltip" placement="top">
              <el-icon class="hyn-form__label-icon"><QuestionFilled /></el-icon>
            </el-tooltip>
            <HynOverflowText :content="field.label" :mode="labelOverflowMode" class="hyn-form__label-text">
              {{ field.label }}
            </HynOverflowText>
          </span>
        </template>

        <div class="hyn-form__content" :class="getContentClass(field)">
          <slot
            v-if="field.type === 'slot'"
            :name="resolveSlotName(field)"
            :field="field"
            :model="model"
            :disabled="isFieldDisabled(field)"
          />
          <hyn-form-field v-else :field="field" :model="formModel" :disabled="isFieldDisabled(field)" />
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance as ElFormInstance } from 'element-plus';
import type { FormItemRule, FormRules } from 'element-plus';
import type { CSSProperties } from 'vue';
import { QuestionFilled } from '@element-plus/icons-vue';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import type { HynFormExpose, HynFormField as FormField, HynFormFieldSpan, HynFormModel } from './types';
import HynFormField from './HynFormField.vue';
import HynOverflowText from '../internal/HynOverflowText.vue';
import { useHynGlobalConfig } from '../config';
import {
  measureHynTextWidth,
  resolveHynMeasureFont,
  resolveHynTextOverflowMode,
  type HynTextOverflowMode
} from '../shared/overflow';
import {
  getHynFormControlMinWidth,
  HYN_FORM_LABEL_BASE_INLINE_PADDING,
  HYN_FORM_LABEL_REQUIRED_MARKER_WIDTH,
  HYN_FORM_LABEL_TOOLTIP_ICON_WIDTH,
  HYN_FORM_REGULAR_CONTROL_MIN_WIDTH,
  resolveHynFormColumnCount,
  resolveHynFormLabelPosition
} from '../shared/formLayout';
import {
  isFormFieldVisible,
  resolveFormFieldSpan,
  resolveFormFieldState,
  resolveFormRuleTrigger
} from './utils';

const props = withDefaults(
  defineProps<{
    /** 表单数据对象，字段渲染器会按 `field.key` 直接读写该对象。 */
    model: object;
    /** HYN 字段配置列表，组件会根据 visible、span、type 决定布局和渲染器。 */
    fields: unknown[];
    /** 外部 Element Plus 校验规则，会和字段级 required/rules 合并后传给表单。 */
    rules?: FormRules;
    /** 标签基准宽度，仅支持像素值；fit 模式会在此基础上按真实文字测量扩展。 */
    labelWidth?: string | number;
    /** 期望列数，实际列数还会受容器宽度和控件最小宽度约束。 */
    columns?: 1 | 2;
    /** 表单加载态，除显示遮罩外还会统一禁用字段控件。 */
    loading?: boolean;
    /** 校验失败时是否滚动到第一个错误字段。 */
    scrollToError?: boolean;
    /** 是否在 rules 引用变化时触发 Element Plus 自动校验，默认关闭以避免配置式表单频繁重校验。 */
    validateOnRuleChange?: boolean;
    /** 标签溢出策略，fit 会启用文字测量并在 KeepAlive 失活时停止观察。 */
    labelOverflowMode?: HynTextOverflowMode;
  }>(),
  {
    rules: undefined,
    labelWidth: '96px',
    columns: 2,
    loading: false,
    scrollToError: true,
    validateOnRuleChange: false
  }
);

const { t } = useHynI18n();
const hynConfig = useHynGlobalConfig();
// Element Plus 表单实例是 HYN expose 能力的根，校验、重置和滚动都从这里透出。
const formRef = ref<ElFormInstance>();
// 当前表单容器的真实宽度，来自 ResizeObserver，用来决定两列还是单列布局。
const formWidth = ref(0);
// 每个字段 label 的测量宽度缓存，key 使用字段 key，避免每次布局推导都重新测量文本。
const measuredLabelWidths = ref<Record<string, number>>({});
// props.model 的运行时形态由业务页决定，这里只在 HYN 字段渲染边界收敛成表单模型。
const formModel = computed(() => props.model as HynFormModel);
// props.fields 对外保持 unknown，组件内部统一按 HYN 字段协议解析。
const formFields = computed<FormField[]>(() => props.fields as FormField[]);
// 可见字段是后续校验、label 测量和栅格计算的共同输入，隐藏字段不参与布局推导。
const visibleFields = computed(() => formFields.value.filter(field => isFormFieldVisible(field, formModel.value)));
let resizeObserver: ResizeObserver | undefined;
// 表单可能被 KeepAlive 缓存；失活时不再测量 label，避免隐藏页的 ResizeObserver 继续保留 DOM 引用。
let formActive = false;

type FormInstanceWithElement = ElFormInstance & {
  $el?: HTMLElement;
};

// 调用方传入的 labelWidth 先统一成像素数值，后续测量和布局算法只处理同一单位。
const normalizedLabelWidth = computed(() => normalizeLabelWidth(props.labelWidth));
// label 溢出策略优先使用组件入参，未传时回落到 HYN 全局配置。
const labelOverflowMode = computed(() => resolveHynTextOverflowMode(props.labelOverflowMode, hynConfig.overflowMode));
// 只有 fit 模式需要真实文本测量；ellipsis/wrap 不应额外触发 label 宽度计算。
const shouldMeasureLabelWidth = computed(() => labelOverflowMode.value === 'fit');
// 最终 label 数值宽度是后续布局算法的共同单位，避免字符串 px 和数字混用。
const resolvedLabelWidthValue = computed(() =>
  shouldMeasureLabelWidth.value ? getSharedLabelWidthValue() : normalizedLabelWidth.value
);
// Element Plus form-item 需要 CSS 尺寸字符串，数值计算只在内部状态链中流动。
const resolvedLabelWidth = computed(() => `${resolvedLabelWidthValue.value}px`);
// 普通半宽字段的控件最小宽度决定两列布局是否还能保持可读。
const resolvedControlMinWidth = computed(() =>
  visibleFields.value
    .filter(field => resolveFormFieldSpan(field) === 1)
    .reduce((maxWidth, field) => Math.max(maxWidth, getFieldControlMinWidth(field)), HYN_FORM_REGULAR_CONTROL_MIN_WIDTH)
);
// label 位置由容器宽度、label 宽度和控件最小宽度共同决定，窄容器自动切到 top。
const resolvedLabelPosition = computed<'right' | 'top'>(() => {
  return resolveHynFormLabelPosition({
    formWidth: formWidth.value,
    labelWidth: resolvedLabelWidthValue.value,
    controlMinWidth: resolvedControlMinWidth.value
  });
});
// 实际列数会尊重调用方期望，但窄容器或长 label 会降级到单列避免控件被挤压。
const resolvedColumns = computed<1 | 2>(() => {
  return resolveHynFormColumnCount({
    requestedColumns: props.columns,
    formWidth: formWidth.value,
    labelWidth: resolvedLabelWidthValue.value,
    controlMinWidth: resolvedControlMinWidth.value
  });
});
// 栅格 CSS 变量是模板和样式层的唯一布局入口，避免多个 DOM 节点重复计算列数。
const gridStyle = computed<CSSProperties>(() => ({
  '--hyn-form-columns': String(resolvedColumns.value),
  '--hyn-form-control-min-width': `${HYN_FORM_REGULAR_CONTROL_MIN_WIDTH}px`
}));

// 校验规则按“外部 rules + 字段 required/rules”合并，字段配置始终拥有最后追加权。
const resolvedRules = computed<FormRules>(() => {
  const rules: Record<string, FormItemRule | FormItemRule[]> = {
    ...(props.rules as Record<string, FormItemRule | FormItemRule[]> | undefined)
  };
  formFields.value.forEach(field => {
    if (!field.prop) {
      return;
    }
    const fieldRules: FormItemRule[] = [];
    if (field.required) {
      fieldRules.push({
        required: true,
        message: t('app.hynForm.required', { label: field.label }),
        trigger: resolveFormRuleTrigger(field)
      });
    }
    if (field.rules?.length) {
      fieldRules.push(...field.rules);
    }
    if (fieldRules.length) {
      const existingRules = rules[field.prop];
      rules[field.prop] = existingRules
        ? [...(Array.isArray(existingRules) ? existingRules : [existingRules]), ...fieldRules]
        : fieldRules;
    }
  });
  return rules;
});

/** 返回 HYN 表单根节点，用于根据实际容器宽度计算字段栅格。 */
function resolveFormElement(): HTMLElement | undefined {
  return (formRef.value as FormInstanceWithElement | undefined)?.$el;
}

/** 将 HYN label 宽度配置归一为像素，组件公共边界只接受稳定的 px 宽度。 */
function normalizeLabelWidth(labelWidth: string | number): number {
  if (typeof labelWidth === 'number') {
    return labelWidth;
  }
  const matchedWidth = labelWidth.trim().match(/^(\d+(?:\.\d+)?)px$/);
  if (!matchedWidth) {
    throw new Error(`HynForm labelWidth only supports pixel values, received: ${labelWidth}`);
  }
  return Number(matchedWidth[1]);
}

/** 根据字段类型推导列布局基线宽度，避免单个 choice 字段把整张表单挤成单列。 */
function getFieldControlMinWidth(field: FormField): number {
  return getHynFormControlMinWidth(field.type);
}

/** 判断字段是否使用共享 label 宽度；整行字段不反向挤压两列字段的控件宽度。 */
function shouldUseSharedLabelWidth(field: FormField): boolean {
  if (props.columns === 1) {
    return true;
  }
  return resolveFormFieldSpan(field) === 1;
}

/** 读取字段当前语言下的真实 label 宽度，至少保持调用方给定的 labelWidth 下限。 */
function getMeasuredFieldLabelWidth(field: FormField): number {
  return Math.max(normalizedLabelWidth.value, measuredLabelWidths.value[field.key] ?? 0);
}

/** 计算普通两列字段共享的 label 宽度，整行长 label 只影响自身行。 */
function getSharedLabelWidthValue(): number {
  const sharedFields = visibleFields.value.filter(field => shouldUseSharedLabelWidth(field));
  const labelFields = sharedFields.length > 0 ? sharedFields : visibleFields.value;
  return labelFields.reduce((maxWidth, field) => Math.max(maxWidth, getMeasuredFieldLabelWidth(field)), normalizedLabelWidth.value);
}

/** 为每个表单项输出最终 label 宽度，保持两列字段舒展，同时让整行长 label 完整显示。 */
function getFormItemLabelWidth(field: FormField): string {
  if (!shouldMeasureLabelWidth.value || shouldUseSharedLabelWidth(field)) {
    return resolvedLabelWidth.value;
  }
  return `${Math.max(resolvedLabelWidthValue.value, getMeasuredFieldLabelWidth(field))}px`;
}

/** 判断字段是否会被 Element Plus 渲染必填星号，外部 rules 和字段 required 都要计入。 */
function isFieldRequired(field: FormField): boolean {
  if (field.required) {
    return true;
  }
  if (!field.prop) {
    return false;
  }
  const fieldRules = resolvedRules.value[field.prop];
  if (Array.isArray(fieldRules)) {
    return fieldRules.some(rule => rule.required === true);
  }
  return fieldRules?.required === true;
}

/** 计算 label 文案之外的必填星号、帮助图标和安全间距，避免附加元素把 label 推到控件上。 */
function getFieldLabelExtraWidth(field: FormField): number {
  return (
    HYN_FORM_LABEL_BASE_INLINE_PADDING +
    (isFieldRequired(field) ? HYN_FORM_LABEL_REQUIRED_MARKER_WIDTH : 0) +
    (field.tooltip ? HYN_FORM_LABEL_TOOLTIP_ICON_WIDTH : 0)
  );
}

/** 使用真实字体测量当前语言 label 文案宽度，避免英文长标签在固定宽度内折行。 */
function measureVisibleLabelWidth(): void {
  // 缓存页失活后读取 label DOM 没有用户可见收益，还会让 ResizeObserver 闭包继续碰隐藏节点。
  if (!formActive) {
    return;
  }
  const formElement = resolveFormElement();
  if (!formElement) {
    return;
  }
  if (!shouldMeasureLabelWidth.value) {
    measuredLabelWidths.value = {};
    return;
  }
  const font = resolveHynMeasureFont(formElement, '500');
  measuredLabelWidths.value = visibleFields.value.reduce<Record<string, number>>((widths, field) => {
    widths[field.key] = Math.ceil(measureHynTextWidth(field.label, font) + getFieldLabelExtraWidth(field));
    return widths;
  }, {});
}

/** 监听表单容器宽度变化；重新激活时先断开旧 observer，保证同一表单只存在一个尺寸观察者。 */
function observeFormResize(): void {
  // onMounted 和 onActivated 都会进入这里，先释放旧 observer 可以避免重复观察同一表单根节点。
  disconnectFormResize();
  const formElement = resolveFormElement();
  if (!formElement) {
    return;
  }
  formWidth.value = formElement.getBoundingClientRect().width;
  measureVisibleLabelWidth();
  resizeObserver = new ResizeObserver(entries => {
    // ResizeObserver 可能在 deactivated 后交付最后一次回调，失活页必须直接丢弃这次测量。
    if (!formActive) {
      return;
    }
    const entry = entries[0];
    if (!entry) {
      return;
    }
    formWidth.value = entry.contentRect.width;
    measureVisibleLabelWidth();
  });
  resizeObserver.observe(formElement);
}

/** 根据字段配置输出栅格占位类名。 */
function getFieldClass(field: FormField): Record<string, boolean> {
  const span: HynFormFieldSpan = resolveFormFieldSpan(field);
  return {
    'is-full': span === 'full',
    'is-span-2': span === 2
  };
}

/** 解析字段内容布局，让 slot 和内置控件共享同一套对齐协议。 */
function getContentClass(field: FormField): string {
  return `is-${field.contentLayout ?? 'control'}`;
}

/** 解析字段禁用状态，表单 loading 时统一禁用提交型控件。 */
function isFieldDisabled(field: FormField): boolean {
  return props.loading || resolveFormFieldState(field.disabled, formModel.value);
}

/** 解析自定义字段插槽名，未显式配置时回落到字段 key。 */
function resolveSlotName(field: FormField): string {
  if (field.type === 'slot' && field.slot) {
    return field.slot;
  }
  return field.key;
}

/** 从 Element Plus 校验错误对象中提取第一个字段名。 */
function getFirstInvalidProp(errorFields: unknown): string | undefined {
  if (!errorFields || typeof errorFields !== 'object') {
    return undefined;
  }
  const keys = Object.keys(errorFields);
  return keys[0];
}

/** 校验 HYN 表单，失败时按配置滚动到第一个错误字段。 */
async function validate(): Promise<boolean> {
  try {
    await formRef.value?.validate();
    return true;
  } catch (errorFields) {
    const firstInvalidProp = getFirstInvalidProp(errorFields);
    if (props.scrollToError && firstInvalidProp) {
      formRef.value?.scrollToField(firstInvalidProp);
    }
    return false;
  }
}

/** 重置 Element Plus 表单字段。 */
function resetFields(): void {
  formRef.value?.resetFields();
}

/** 清理 Element Plus 表单校验状态。 */
function clearValidate(): void {
  formRef.value?.clearValidate();
}

/** 滚动到指定表单字段。 */
function scrollToField(prop: string): void {
  formRef.value?.scrollToField(prop);
}

/** 返回底层表单实例，供少数复杂业务兼容访问。 */
function getFormRef(): ElFormInstance | undefined {
  return formRef.value;
}

defineExpose<HynFormExpose>({
  validate,
  resetFields,
  clearValidate,
  scrollToField,
  getFormRef
});

onMounted(() => {
  formActive = true;
  observeFormResize();
});

onActivated(() => {
  formActive = true;
  observeFormResize();
});

onDeactivated(() => {
  formActive = false;
  disconnectFormResize();
});

watch(
  () => [visibleFields.value.map(field => field.label).join('\n'), labelOverflowMode.value] as const,
  () => {
    nextTick(() => {
      measureVisibleLabelWidth();
    });
  }
);

onBeforeUnmount(() => {
  formActive = false;
  disconnectFormResize();
});

/** 释放 ResizeObserver 观察目标；deactivated 与 unmount 都走这里，覆盖缓存切页和真实卸载两种路径。 */
function disconnectFormResize(): void {
  resizeObserver?.disconnect();
  resizeObserver = undefined;
}
</script>
