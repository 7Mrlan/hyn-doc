<template>
  <component :is="rendererComponent" v-bind="rendererProps" />
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import ChoiceRenderer from './renderers/ChoiceRenderer.vue';
import CronRenderer from './renderers/CronRenderer.vue';
import DateRenderer from './renderers/DateRenderer.vue';
import DeptSelectRenderer from './renderers/DeptSelectRenderer.vue';
import DisplayRenderer from './renderers/DisplayRenderer.vue';
import InputRenderer from './renderers/InputRenderer.vue';
import NumberRenderer from './renderers/NumberRenderer.vue';
import SelectRenderer from './renderers/SelectRenderer.vue';
import SwitchRenderer from './renderers/SwitchRenderer.vue';
import type { HynFormField, HynFormModel, HynFormRendererProps } from './types';

const EditorRenderer = defineAsyncComponent(() => import('./renderers/EditorRenderer.vue'));
const FilePickerRenderer = defineAsyncComponent(() => import('./renderers/FilePickerRenderer.vue'));
const FileUploadRenderer = defineAsyncComponent(() => import('./renderers/FileUploadRenderer.vue'));
const IconSelectRenderer = defineAsyncComponent(() => import('./renderers/IconSelectRenderer.vue'));
const ImageUploadRenderer = defineAsyncComponent(() => import('./renderers/ImageUploadRenderer.vue'));
const RemoteSelectRenderer = defineAsyncComponent(() => import('./renderers/RemoteSelectRenderer.vue'));
const TreeSelectRenderer = defineAsyncComponent(() => import('./renderers/TreeSelectRenderer.vue'));

const props = defineProps<{
  /** 单个 HYN 字段配置，决定渲染器类型、校验、显隐和禁用规则。 */
  field: HynFormField;
  /** 当前表单数据对象，渲染器会按字段 key 读写该对象。 */
  model: HynFormModel;
  /** 父级表单统一禁用状态，会与字段自身禁用规则合并。 */
  disabled: boolean;
}>();

const rendererMap: Record<HynFormField['type'], Component> = {
  input: InputRenderer,
  textarea: InputRenderer,
  number: NumberRenderer,
  select: SelectRenderer,
  radio: ChoiceRenderer,
  checkbox: ChoiceRenderer,
  switch: SwitchRenderer,
  date: DateRenderer,
  dateRange: DateRenderer,
  treeSelect: TreeSelectRenderer,
  deptSelect: DeptSelectRenderer,
  remoteSelect: RemoteSelectRenderer,
  iconSelect: IconSelectRenderer,
  editor: EditorRenderer,
  imageUpload: ImageUploadRenderer,
  fileUpload: FileUploadRenderer,
  filePicker: FilePickerRenderer,
  cron: CronRenderer,
  display: DisplayRenderer,
  slot: DisplayRenderer
};

const rendererComponent = computed(() => rendererMap[props.field.type]);
const rendererProps = computed<HynFormRendererProps>(() => ({
  field: props.field,
  model: props.model,
  disabled: props.disabled
}));
</script>
