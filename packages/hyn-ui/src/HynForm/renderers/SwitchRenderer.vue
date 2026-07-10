<template>
  <el-switch
    v-model="modelValue"
    :active-value="switchField.activeValue ?? true"
    :inactive-value="switchField.inactiveValue ?? false"
    :active-text="switchField.activeText"
    :inactive-text="switchField.inactiveText"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
import type { HynFormModel, HynFormOptionValue, HynFormRendererProps, HynFormSwitchField } from '../types';
import { getFormFieldValue, setFormFieldValue } from '../utils';

const props = defineProps<HynFormRendererProps>();

// 将通用 HYN 字段收敛为当前渲染器的字段契约，避免模板读取不属于该控件的配置。
const switchField = computed(() => props.field as HynFormSwitchField<HynFormModel>);

// 渲染器和 HYN 表单 model 的 v-model 桥接点，Element Plus 写回必须落到 field.key 对应字段。
const modelValue = computed<HynFormOptionValue | undefined>({
  get: () => getFormFieldValue(props.model, props.field) as HynFormOptionValue | undefined,
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});
</script>
