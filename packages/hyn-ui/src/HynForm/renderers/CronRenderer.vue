<template>
  <hyn-cron-expression
    v-model="modelValue"
    :disabled="disabled"
    :placeholder="cronField.placeholder"
    :button-text="cronField.buttonText"
  />
</template>

<script setup lang="ts">
import HynCronExpression from '../../HynCronExpression/index.vue';
import type { HynFormCronField, HynFormModel, HynFormRendererProps } from '../types';
import { getFormFieldValue, setFormFieldValue } from '../utils';

const props = defineProps<HynFormRendererProps>();

// 将通用 HYN 字段收敛为当前渲染器的字段契约，避免模板读取不属于该控件的配置。
const cronField = computed(() => props.field as HynFormCronField<HynFormModel>);

/** 将表单模型值收敛为 Cron 输入组件需要的字符串。 */
function toCronExpression(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

// 渲染器和 HYN 表单 model 的 v-model 桥接点，Element Plus 写回必须落到 field.key 对应字段。
const modelValue = computed<string>({
  get: () => toCronExpression(getFormFieldValue(props.model, props.field)),
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});
</script>
