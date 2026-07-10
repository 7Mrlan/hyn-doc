<template>
  <hyn-tree-select
    v-model="modelValue"
    :data="treeField.data"
    :props="treeField.props"
    :node-key="treeField.nodeKey"
    :value-key="treeField.valueKey"
    :placeholder="resolvedPlaceholder"
    v-model:linkage="linkageModel"
    :multiple="treeField.multiple"
    :clearable="treeField.clearable !== false"
    :filterable="treeField.filterable !== false"
    :filter-disabled="treeField.filterDisabled === true"
    :flatten="treeField.flatten === true"
    :collapse-tags="treeField.collapseTags !== false"
    :max-collapse-tags="treeField.maxCollapseTags || 1"
    :teleported="treeField.teleported ?? true"
    :dropdown-width="treeField.dropdownWidth ?? 360"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import type { HynTreeSelectModelValue } from '../../HynTreeSelect/types';
import type { HynFormModel, HynFormRendererProps, HynFormTreeSelectField } from '../types';
import HynTreeSelect from '../../HynTreeSelect/index.vue';
import { getFormFieldValue, setFormFieldValue } from '../utils';
import { useTreeSelectLinkage } from './useTreeSelectLinkage';

const props = defineProps<HynFormRendererProps>();
const { t } = useHynI18n();

// 将通用 HYN 字段收敛为当前渲染器的字段契约，避免模板读取不属于该控件的配置。
const treeField = computed(() => props.field as HynFormTreeSelectField<HynFormModel>);
const linkageModel = useTreeSelectLinkage(treeField, props.model);
// 占位文案按字段配置优先，未配置时才使用统一 i18n 默认值。
const resolvedPlaceholder = computed(
  () => treeField.value.placeholder || t('app.hynForm.selectPlaceholder', { label: treeField.value.label })
);

// 渲染器和 HYN 表单 model 的 v-model 桥接点，Element Plus 写回必须落到 field.key 对应字段。
const modelValue = computed<HynTreeSelectModelValue>({
  get: () => getFormFieldValue(props.model, props.field) as HynTreeSelectModelValue,
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});
</script>
