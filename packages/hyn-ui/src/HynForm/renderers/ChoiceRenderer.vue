<template>
  <el-radio-group v-if="field.type === 'radio'" v-model="modelValue" :disabled="disabled">
    <el-radio v-for="option in options" :key="String(option.value)" :value="option.value" :disabled="option.disabled">
      {{ option.label }}
    </el-radio>
  </el-radio-group>
  <el-checkbox-group v-else v-model="checkboxValue" :disabled="disabled">
    <el-checkbox
      v-for="option in options"
      :key="String(option.value)"
      :value="option.value"
      :disabled="option.disabled"
    >
      {{ option.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script setup lang="ts">
import type {
  HynFormCheckboxField,
  HynFormCheckboxValue,
  HynFormModel,
  HynFormOptionValue,
  HynFormRadioField,
  HynFormRendererProps
} from '../types';
import { getFormFieldValue, resolveFormOptions, setFormFieldValue } from '../utils';

const props = defineProps<HynFormRendererProps>();

// 将通用 HYN 字段收敛为当前渲染器的字段契约，避免模板读取不属于该控件的配置。
const choiceField = computed(
  () => props.field as HynFormRadioField<HynFormModel> | HynFormCheckboxField<HynFormModel>
);
// 选项在这里归一化为模板可消费形态，静态配置和动态计算都不直接散落到控件上。
const options = computed(() => resolveFormOptions(choiceField.value.options, props.model));

// 渲染器和 HYN 表单 model 的 v-model 桥接点，Element Plus 写回必须落到 field.key 对应字段。
const modelValue = computed<HynFormOptionValue | undefined>({
  get: () => getFormFieldValue(props.model, props.field) as HynFormOptionValue | undefined,
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});

const checkboxValue = computed<HynFormCheckboxValue[]>({
  get: () => {
    const value = getFormFieldValue(props.model, props.field);
    return Array.isArray(value)
      ? (value.filter(item => typeof item === 'string' || typeof item === 'number') as HynFormCheckboxValue[])
      : [];
  },
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});
</script>
