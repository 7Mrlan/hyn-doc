<template>
  <component :is="IconSelect" v-model="modelValue" />
</template>

<script setup lang="ts">
import { getHynHostComponent } from '@7mrlan/hyn-ui/runtime';
import type { HynFormModel, HynFormRendererProps } from '../types';
import { getFormFieldValue, setFormFieldValue } from '../utils';

const props = defineProps<HynFormRendererProps>();
const IconSelect = getHynHostComponent('iconSelect');

// 渲染器和 HYN 表单 model 的 v-model 桥接点，Element Plus 写回必须落到 field.key 对应字段。
const modelValue = computed<string>({
  get: () => String(getFormFieldValue(props.model, props.field) ?? ''),
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});
</script>
