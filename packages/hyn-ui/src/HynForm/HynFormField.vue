<template>
  <component :is="rendererComponent" v-bind="rendererProps" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import type { AsyncComponentLoader, Component } from 'vue';
import HynFormFieldLoading from './internal/HynFormFieldLoading.vue';
import HynFormFieldLoadError from './internal/HynFormFieldLoadError.vue';
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

/** 所有可选字段共享加载与失败反馈，资源更新后不能静默退化成空白字段。 */
function createAsyncRenderer(loader: AsyncComponentLoader<Component>): Component {
  return defineAsyncComponent({ loader, loadingComponent: HynFormFieldLoading, errorComponent: HynFormFieldLoadError, delay: 0 });
}

/** 富文本宿主适配只在字段使用时加载，降低普通表单首屏开销。 */
const EditorRenderer = createAsyncRenderer(() => import('./renderers/EditorRenderer.vue'));
/** 本地文件选择包含上传控件依赖，需要独立的加载与失败反馈。 */
const FilePickerRenderer = createAsyncRenderer(() => import('./renderers/FilePickerRenderer.vue'));
/** 附件上传能力由宿主注入，未使用该字段的表单无需加载适配器。 */
const FileUploadRenderer = createAsyncRenderer(() => import('./renderers/FileUploadRenderer.vue'));
/** 图标宿主适配延迟到字段实际出现时加载。 */
const IconSelectRenderer = createAsyncRenderer(() => import('./renderers/IconSelectRenderer.vue'));
/** 图片附件适配与基础输入字段隔离，保留按需加载边界。 */
const ImageUploadRenderer = createAsyncRenderer(() => import('./renderers/ImageUploadRenderer.vue'));
/** 远程选择器仅在使用该字段时引入分页和回显依赖。 */
const RemoteSelectRenderer = createAsyncRenderer(() => import('./renderers/RemoteSelectRenderer.vue'));
/** 大树选择器按需加载，加载失败仍在原字段位置报告。 */
const TreeSelectRenderer = createAsyncRenderer(() => import('./renderers/TreeSelectRenderer.vue'));

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
