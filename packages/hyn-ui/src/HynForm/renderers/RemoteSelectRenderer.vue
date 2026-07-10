<template>
  <hyn-remote-select
    v-model="modelValue"
    :adapter="remoteField.adapter"
    :search-param="remoteField.searchParam"
    :page-size="remoteField.pageSize || 20"
    :placeholder="resolvedPlaceholder"
    :multiple="remoteField.multiple"
    :clearable="remoteField.clearable !== false"
    :collapse-tags="remoteField.collapseTags !== false"
    :max-collapse-tags="remoteField.maxCollapseTags || 1"
    :teleported="remoteField.teleported ?? false"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
import type { HynEntityModelValue, HynEntityPageQuery } from '../../HynEntityPicker/types';
import HynRemoteSelect from '../../HynRemoteSelect/index.vue';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import type { HynFormModel, HynFormRemoteSelectField, HynFormRendererProps } from '../types';
import { getFormFieldValue, setFormFieldValue } from '../utils';

const props = defineProps<HynFormRendererProps>();
const { t } = useHynI18n();

type RemoteSelectQuery = HynEntityPageQuery & Record<string, unknown>;

// 将通用 HYN 字段收敛为当前渲染器的字段契约，避免模板读取不属于该控件的配置。
const remoteField = computed(
  () => props.field as HynFormRemoteSelectField<HynFormModel, unknown, RemoteSelectQuery>
);
// 占位文案按字段配置优先，未配置时才使用统一 i18n 默认值。
const resolvedPlaceholder = computed(
  () => remoteField.value.placeholder || t('app.hynForm.selectPlaceholder', { label: remoteField.value.label })
);

// 渲染器和 HYN 表单 model 的 v-model 桥接点，Element Plus 写回必须落到 field.key 对应字段。
const modelValue = computed<HynEntityModelValue>({
  get: () => getFormFieldValue(props.model, props.field) as HynEntityModelValue,
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});
</script>
