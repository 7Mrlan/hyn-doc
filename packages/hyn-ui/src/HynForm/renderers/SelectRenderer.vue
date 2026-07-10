<template>
  <el-select
    v-model="modelValue"
    :placeholder="resolvedPlaceholder"
    :clearable="selectField.clearable !== false"
    :multiple="selectField.multiple"
    :filterable="selectField.filterable"
    :collapse-tags="selectField.collapseTags !== false"
    :max-collapse-tags="selectField.maxCollapseTags || 1"
    collapse-tags-tooltip
    :disabled="disabled"
  >
    <el-option
      v-for="option in options"
      :key="String(option.value)"
      :label="option.label"
      :value="option.value"
      :disabled="option.disabled"
    />
  </el-select>
</template>

<script setup lang="ts">
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import type { HynFormModel, HynFormOptionValue, HynFormRendererProps, HynFormSelectField } from '../types';
import { getFormFieldValue, resolveFormOptions, setFormFieldValue } from '../utils';

const props = defineProps<HynFormRendererProps>();
const { t } = useHynI18n();

// 将通用 HYN 字段收敛为当前渲染器的字段契约，避免模板读取不属于该控件的配置。
const selectField = computed(() => props.field as HynFormSelectField<HynFormModel>);
// 选项在这里归一化为模板可消费形态，静态配置和动态计算都不直接散落到控件上。
const options = computed(() => resolveFormOptions(selectField.value.options, props.model));
// 占位文案按字段配置优先，未配置时才使用统一 i18n 默认值。
const resolvedPlaceholder = computed(
  () => selectField.value.placeholder || t('app.hynForm.selectPlaceholder', { label: selectField.value.label })
);

// 渲染器和 HYN 表单 model 的 v-model 桥接点，Element Plus 写回必须落到 field.key 对应字段。
const modelValue = computed<HynFormOptionValue | HynFormOptionValue[] | undefined>({
  get: () => getFormFieldValue(props.model, props.field) as HynFormOptionValue | HynFormOptionValue[] | undefined,
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});
</script>
