<template>
  <component :is="FileUpload"
    v-model="modelValue"
    :limit="fileField.limit || 1"
    :file-size="fileField.fileSize || 5"
    :file-type="fileField.fileType"
  />
</template>

<script setup lang="ts">
import { getHynHostComponent } from '@7mrlan/hyn-ui/runtime';
import type { HynFormFileUploadField, HynFormModel, HynFormRendererProps } from '../types';
import { getFormFieldValue, setFormFieldValue } from '../utils';

const props = defineProps<HynFormRendererProps>();
const FileUpload = getHynHostComponent('fileUpload');

// 将通用 HYN 字段收敛为当前渲染器的字段契约，避免模板读取不属于该控件的配置。
const fileField = computed(() => props.field as HynFormFileUploadField<HynFormModel>);

// 渲染器和 HYN 表单 model 的 v-model 桥接点，Element Plus 写回必须落到 field.key 对应字段。
const modelValue = computed<unknown>({
  get: () => getFormFieldValue(props.model, props.field),
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});
</script>
