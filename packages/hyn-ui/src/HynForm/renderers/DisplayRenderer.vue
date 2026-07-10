<template>
  <el-input :model-value="displayValue" disabled />
</template>

<script setup lang="ts">
import type { HynFormDisplayField, HynFormModel, HynFormRendererProps } from '../types';
import { getFormFieldValue } from '../utils';

const props = defineProps<HynFormRendererProps>();

// 将通用 HYN 字段收敛为当前渲染器的字段契约，避免模板读取不属于该控件的配置。
const displayField = computed(() => props.field as HynFormDisplayField<HynFormModel>);

// 展示型字段只格式化当前 model 快照，不向表单模型写回任何值。
const displayValue = computed(() => {
  if (displayField.value.formatter) {
    return String(displayField.value.formatter(props.model));
  }
  if (displayField.value.value !== undefined) {
    return String(displayField.value.value);
  }
  return String(getFormFieldValue(props.model, props.field) ?? '');
});
</script>
