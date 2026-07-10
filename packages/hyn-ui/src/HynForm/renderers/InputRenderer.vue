<template>
  <el-input
    v-model="modelValue"
    :type="inputType"
    :placeholder="resolvedPlaceholder"
    :clearable="inputField.type === 'input' ? inputField.clearable !== false : false"
    :maxlength="inputField.maxlength"
    :show-password="inputField.type === 'input' ? inputField.showPassword : false"
    :autocomplete="inputField.type === 'input' ? inputField.autocomplete : undefined"
    :name="inputField.type === 'input' ? inputField.name : undefined"
    :readonly="inputField.type === 'input' ? inputField.readonly : false"
    :rows="inputField.type === 'textarea' ? inputField.rows || 3 : undefined"
    :show-word-limit="inputField.type === 'textarea' ? inputField.showWordLimit : false"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import type { HynFormInputField, HynFormModel, HynFormRendererProps, HynFormTextareaField } from '../types';
import { getFormFieldValue, setFormFieldValue } from '../utils';

const props = defineProps<HynFormRendererProps>();
const { t } = useHynI18n();

// 将通用 HYN 字段收敛为当前渲染器的字段契约，避免模板读取不属于该控件的配置。
const inputField = computed(
  () => props.field as HynFormInputField<HynFormModel> | HynFormTextareaField<HynFormModel>
);

const inputType = computed(() => (inputField.value.type === 'textarea' ? 'textarea' : 'text'));
// 占位文案按字段配置优先，未配置时才使用统一 i18n 默认值。
const resolvedPlaceholder = computed(
  () => inputField.value.placeholder || t('app.hynForm.inputPlaceholder', { label: inputField.value.label })
);

/**
 * 将未知模型值收窄为 Element Plus Input 可接收的值。
 */
function toInputValue(value: unknown): string | number | undefined {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  if (value === undefined || value === null) {
    return undefined;
  }
  return String(value);
}

// 渲染器和 HYN 表单 model 的 v-model 桥接点，Element Plus 写回必须落到 field.key 对应字段。
const modelValue = computed<string | number | undefined>({
  get: () => toInputValue(getFormFieldValue(props.model, props.field)),
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});
</script>
