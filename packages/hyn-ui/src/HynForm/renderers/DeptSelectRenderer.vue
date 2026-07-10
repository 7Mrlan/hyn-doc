<template>
  <hyn-dept-select
    v-model="modelValue"
    :placeholder="resolvedPlaceholder"
    :multiple="deptField.multiple"
    :clearable="deptField.clearable !== false"
    :filterable="deptField.filterable !== false"
    v-model:linkage="linkageModel"
    :filter-disabled="deptField.filterDisabled !== false"
    :flatten="deptField.flatten === true"
    :collapse-tags="deptField.collapseTags !== false"
    :max-collapse-tags="deptField.maxCollapseTags || 1"
    :teleported="deptField.teleported ?? true"
    :dropdown-width="deptField.dropdownWidth ?? 360"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import type { HynDeptSelectModelValue } from '../../HynDeptSelect/types';
import type { HynFormDeptSelectField, HynFormModel, HynFormRendererProps } from '../types';
import HynDeptSelect from '../../HynDeptSelect/index.vue';
import { getFormFieldValue, setFormFieldValue } from '../utils';
import { useTreeSelectLinkage } from './useTreeSelectLinkage';

const props = defineProps<HynFormRendererProps>();
const { t } = useHynI18n();

// 将通用 HYN 字段收敛为部门选择字段契约，避免页面级配置关注组件内部数据来源。
const deptField = computed(() => props.field as HynFormDeptSelectField<HynFormModel>);
const linkageModel = useTreeSelectLinkage(deptField, props.model);
// 占位文案按字段配置优先，未配置时才使用统一 i18n 默认值。
const resolvedPlaceholder = computed(
  () => deptField.value.placeholder || t('app.hynForm.selectPlaceholder', { label: deptField.value.label })
);

// 渲染器和 HYN 表单 model 的 v-model 桥接点，部门选择组件负责单选/多选值形态归一化。
const modelValue = computed<HynDeptSelectModelValue>({
  get: () => getFormFieldValue(props.model, props.field) as HynDeptSelectModelValue,
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});
</script>
