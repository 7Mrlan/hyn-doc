<template>
  <el-date-picker
    v-model="modelValue"
    :type="datePickerType"
    :value-format="dateField.valueFormat"
    :format="dateField.format"
    :placeholder="resolvedPlaceholder"
    :start-placeholder="resolvedStartPlaceholder"
    :end-placeholder="resolvedEndPlaceholder"
    :range-separator="dateField.rangeSeparator || '-'"
    :default-time="dateField.defaultTime"
    :clearable="dateField.clearable !== false"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
import type { DatePickerType } from 'element-plus';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import type { HynFormDateField, HynFormDateValue, HynFormModel, HynFormRendererProps } from '../types';
import { getFormFieldValue, setFormFieldValue } from '../utils';

const props = defineProps<HynFormRendererProps>();
const { t } = useHynI18n();

// 将通用 HYN 字段收敛为当前渲染器的字段契约，避免模板读取不属于该控件的配置。
const dateField = computed(() => props.field as HynFormDateField<HynFormModel>);
const datePickerType = computed<DatePickerType>(
  () => dateField.value.dateType || (dateField.value.type === 'dateRange' ? 'daterange' : 'date')
);
// 占位文案按字段配置优先，未配置时才使用统一 i18n 默认值。
const resolvedPlaceholder = computed(
  () => dateField.value.placeholder || t('app.hynForm.selectPlaceholder', { label: dateField.value.label })
);
// 占位文案按字段配置优先，未配置时才使用统一 i18n 默认值。
const resolvedStartPlaceholder = computed(() => dateField.value.startPlaceholder || t('app.common.startDate'));
// 占位文案按字段配置优先，未配置时才使用统一 i18n 默认值。
const resolvedEndPlaceholder = computed(() => dateField.value.endPlaceholder || t('app.common.endDate'));

// 渲染器和 HYN 表单 model 的 v-model 桥接点，Element Plus 写回必须落到 field.key 对应字段。
const modelValue = computed<HynFormDateValue | undefined>({
  get: () => getFormFieldValue(props.model, props.field) as HynFormDateValue | undefined,
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});
</script>
