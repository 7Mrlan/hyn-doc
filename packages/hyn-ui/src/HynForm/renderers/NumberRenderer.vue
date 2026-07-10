<template>
  <el-input-number
    v-model="modelValue"
    controls-position="right"
    :min="numberField.min"
    :max="numberField.max"
    :step="numberField.step"
    :precision="numberField.precision"
    :placeholder="resolvedPlaceholder"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import type { HynFormModel, HynFormNumberField, HynFormRendererProps } from '../types';
import { getFormFieldValue, setFormFieldValue } from '../utils';

const props = defineProps<HynFormRendererProps>();
const { t } = useHynI18n();

// 将通用 HYN 字段收敛为当前渲染器的字段契约，避免模板读取不属于该控件的配置。
const numberField = computed(() => props.field as HynFormNumberField<HynFormModel>);
// 占位文案按字段配置优先，未配置时才使用统一 i18n 默认值。
const resolvedPlaceholder = computed(
  () => numberField.value.placeholder || t('app.hynForm.inputPlaceholder', { label: numberField.value.label })
);

/**
 * 将表单值转换为数字输入框可接收的模型值。
 */
function toNumberValue(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return Number(value);
  }
  return undefined;
}

// 渲染器和 HYN 表单 model 的 v-model 桥接点，Element Plus 写回必须落到 field.key 对应字段。
const modelValue = computed<number | undefined>({
  get: () => toNumberValue(getFormFieldValue(props.model, props.field)),
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});
</script>
