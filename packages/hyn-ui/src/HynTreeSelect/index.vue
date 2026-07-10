<template>
  <el-select-v2
    v-if="flatten"
    v-model="innerValue"
    class="hyn-tree-select"
    :options="visibleFlatOptions"
    :placeholder="resolvedPlaceholder"
    :loading="resolvedLoading"
    :loading-text="resolvedLoadingText"
    :no-data-text="resolvedNoDataText"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="filterable"
    :multiple="multiple"
    :collapse-tags="multiple && collapseTags"
    :max-collapse-tags="maxCollapseTags"
    :height="dropdownHeight"
    :item-height="optionHeight"
    placement="bottom-start"
    :fallback-placements="treeSelectFallbackPlacements"
    popper-class="hyn-tree-select-popper"
    collapse-tags-tooltip
    :teleported="teleported"
    scrollbar-always-on
    :remote="filterable"
    :debounce="120"
    remote-show-suffix
    :remote-method="handleFlatSearch"
    @change="handleChange"
    @clear="handleClear"
    @visible-change="handleVisibleChange"
    @focus="handleFocus"
  />
  <hyn-virtual-tree-dropdown
    v-else
    v-model="innerValue"
    :data="treeData"
    :node-props="resolvedNodeProps"
    :value-key="resolvedValueKey"
    :placeholder="resolvedPlaceholder"
    :loading="resolvedLoading"
    :no-data-text="resolvedNoDataText"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="filterable"
    :multiple="multiple"
    v-model:linkage="innerLinkage"
    :collapse-tags="collapseTags"
    :max-collapse-tags="maxCollapseTags"
    :teleported="teleported"
    :dropdown-width="dropdownWidth"
    :dropdown-height="dropdownHeight"
    :option-height="optionHeight"
    @change="handleChange"
    @clear="handleClear"
    @visible-change="handleVisibleChange"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
import type { Placement } from '@popperjs/core';
import { computed, useModel, watch } from 'vue';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import type { HynTreeSelectEmits, HynTreeSelectModelValue, HynTreeSelectNodeProps, HynTreeSelectProps } from './types';
import HynVirtualTreeDropdown from './internal/HynVirtualTreeDropdown.vue';
import { normalizeHynTreeSelectModelValue } from './internal/modelValue';
import { useHynTreeSelectOptions } from './useHynTreeSelectOptions';

const props = withDefaults(defineProps<HynTreeSelectProps>(), {
  modelValue: undefined,
  data: () => [],
  props: undefined,
  nodeKey: undefined,
  valueKey: undefined,
  placeholder: undefined,
  loading: false,
  disabled: false,
  clearable: true,
  filterable: true,
  multiple: false,
  linkage: false,
  filterDisabled: false,
  flatten: false,
  collapseTags: true,
  maxCollapseTags: 1,
  teleported: true,
  dropdownWidth: 360,
  dropdownHeight: 274,
  optionHeight: 34
});

const emit = defineEmits<HynTreeSelectEmits>();
const { t } = useHynI18n();
const innerValue = useModel(props, 'modelValue', {
  get: value => normalizeHynTreeSelectModelValue(value, props.multiple),
  set: value => normalizeHynTreeSelectModelValue(value, props.multiple)
});
const linkageModel = useModel(props, 'linkage');
const innerLinkage = computed<boolean>({
  get: () => props.multiple && linkageModel.value === true,
  set: linkage => {
    linkageModel.value = linkage;
  }
});

/** 平铺列表不存在父子层级，联动配置与该模式同时启用时直接报错，避免业务误以为配置已生效。 */
watch(
  () => [props.flatten, linkageModel.value] as const,
  ([flatten, linkage]) => {
    if (flatten && linkage) {
      throw new TypeError('HynTreeSelect linkage cannot be enabled when flatten is true.');
    }
  },
  { immediate: true }
);

const treeSelectFallbackPlacements: Placement[] = ['bottom-start'];

/** 表单未显式传入占位文案时，统一继承项目通用选择提示，避免业务页重复兜底。 */
const resolvedPlaceholder = computed(() => props.placeholder ?? t('common.select'));
/** 平铺虚拟列表和树形下拉共用的加载文案，只在组件内部派生，不暴露给业务页。 */
const resolvedLoadingText = computed(() => t('app.common.loading'));
/** 归一化 Element Plus 树节点字段协议，保证树形模式和平铺模式读取同一套字段。 */
const resolvedNodeProps = computed<HynTreeSelectNodeProps>(() => ({
  value: props.valueKey ?? props.props?.value ?? props.nodeKey ?? 'value',
  label: props.props?.label ?? 'label',
  children: props.props?.children ?? 'children',
  disabled: props.props?.disabled ?? 'disabled'
}));
/** 选中值和 Tree V2 节点主键统一使用归一化后的 value 字段，避免两套键协议发生漂移。 */
const resolvedValueKey = computed(() => resolvedNodeProps.value.value ?? 'value');
/** 将外部树数据包装成响应式 getter，供平铺索引 composable 按引用变化重建缓存。 */
const sourceData = computed(() => props.data);
const sourceFilterDisabled = computed(() => props.filterDisabled);
const sourceFlatten = computed(() => props.flatten);
const {
  treeData,
  visibleFlatOptions,
  loading: optionsLoading,
  setFlatKeyword,
  ensureFlatOptionsReady
} = useHynTreeSelectOptions({
  data: sourceData,
  nodeProps: resolvedNodeProps,
  valueKey: resolvedValueKey,
  filterDisabled: sourceFilterDisabled,
  flatten: sourceFlatten
});
/** 合并外部业务加载态和平铺索引构建态，保证首次打开大树时下拉有明确反馈。 */
const resolvedLoading = computed(() => props.loading || optionsLoading.value);
/** 无数据文案随加载态切换，避免平铺索引构建期间误显示空结果。 */
const resolvedNoDataText = computed(() => (resolvedLoading.value ? resolvedLoadingText.value : t('app.common.noData')));
/** Select V2 平铺模式的本地搜索入口。 */
function handleFlatSearch(keyword: string): void {
  setFlatKeyword(keyword);
}

/** 选择变化时透传归一化后的值。 */
function handleChange(value: HynTreeSelectModelValue): void {
  emit('change', normalizeHynTreeSelectModelValue(value, props.multiple));
}

/** 清空值由具体选择器通过 v-model 写回，此处只保留 clear 事件语义。 */
function handleClear(): void {
  emit('clear');
}

/** 下拉展开状态透传给上层业务适配器。 */
function handleVisibleChange(visible: boolean): void {
  if (visible && props.flatten) {
    ensureFlatOptionsReady('active');
  }
  emit('visible-change', visible);
}

/** 输入聚焦时通知上层可提前加载远程树数据。 */
function handleFocus(): void {
  if (props.flatten) {
    ensureFlatOptionsReady('active');
  }
  emit('focus');
}
</script>

<style lang="scss" scoped>
.hyn-tree-select {
  width: 100%;
}

.hyn-tree-select :deep(.el-select__wrapper) {
  align-items: center;
  overflow: hidden;
}

.hyn-tree-select :deep(.el-select__selection) {
  align-items: center;
  flex-wrap: nowrap;
  min-height: 24px;
  overflow: hidden;
}

.hyn-tree-select :deep(.el-select__selected-item) {
  align-items: center;
  height: 24px;
  min-width: 0;
}

.hyn-tree-select :deep(.el-select__input-wrapper) {
  align-items: center;
  height: 24px;
}

.hyn-tree-select :deep(.el-select__input) {
  height: 24px;
  line-height: 24px;
}

.hyn-tree-select :deep(.el-select__placeholder) {
  top: 0;
  display: flex;
  align-items: center;
  height: 100%;
  line-height: 1;
  transform: none;
}

.hyn-tree-select :deep(.el-tag) {
  display: inline-flex;
  max-width: 96px;
  align-items: center;
  height: 22px;
  line-height: 22px;
}

.hyn-tree-select :deep(.el-tag__content) {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  line-height: 20px;
}

.hyn-tree-select :deep(.el-select__tags-text) {
  max-width: 62px;
  line-height: 20px;
}

.hyn-tree-select :deep(.el-tag__close) {
  position: static;
  display: inline-flex;
  width: 14px;
  min-width: 14px;
  height: 14px;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  visibility: visible;
}
</style>
