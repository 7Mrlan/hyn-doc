<template>
  <hyn-tree-select
    v-model="innerValue"
    :data="deptOptions"
    :props="deptTreeProps"
    node-key="id"
    value-key="id"
    :placeholder="resolvedPlaceholder"
    :loading="loading"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="filterable"
    :multiple="multiple"
    v-model:linkage="innerLinkage"
    :filter-disabled="filterDisabled"
    :flatten="flatten"
    :collapse-tags="collapseTags"
    :max-collapse-tags="maxCollapseTags"
    :teleported="teleported"
    :dropdown-width="dropdownWidth"
    @change="handleChange"
    @clear="handleClear"
    @focus="handleFocus"
    @visible-change="handleVisibleChange"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, useModel, watch } from 'vue';
import type { HynDeptTreeNode } from '@7mrlan/hyn-ui/runtime';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import type { HynDeptSelectEmits, HynDeptSelectModelValue, HynDeptSelectProps } from './types';
import HynTreeSelect from '../HynTreeSelect/index.vue';
import { cloneHynDeptTree, requestHynDeptTreeOptions } from './deptTree';

const props = withDefaults(defineProps<HynDeptSelectProps>(), {
  modelValue: undefined,
  multiple: false,
  placeholder: undefined,
  disabled: false,
  clearable: true,
  filterable: true,
  linkage: false,
  filterDisabled: true,
  flatten: false,
  collapseTags: true,
  maxCollapseTags: 1,
  teleported: true,
  dropdownWidth: 360
});

const emit = defineEmits<HynDeptSelectEmits>();
const { t } = useHynI18n();

/** 部门树接口加载态只在懒加载期间置位，用于下拉首次打开和错误重试的视觉反馈。 */
const loading = ref(false);
const loaded = ref(false);
/** 缓存部门树接口结果，避免同一个表单字段每次展开都重复请求大部门树。 */
const deptOptions = shallowRef<HynDeptTreeNode[]>([]);
const deptTreeProps = {
  value: 'id',
  label: 'label',
  children: 'children',
  disabled: 'disabled'
};

const shouldCloneDeptTree = computed(() => !props.flatten);
/** 未配置业务占位文案时继承通用选择提示，保持 HYN 表单字段展示一致。 */
const resolvedPlaceholder = computed(() => props.placeholder ?? t('common.select'));
const innerValue = useModel(props, 'modelValue');
const innerLinkage = useModel(props, 'linkage');

/** 加载部门树数据，接口失败时向上抛出请求错误并保留加载反馈。 */
async function ensureDeptOptionsLoaded(): Promise<void> {
  if (loaded.value || loading.value) {
    return;
  }
  loading.value = true;
  try {
    deptOptions.value = await requestHynDeptTreeOptions({ clone: shouldCloneDeptTree.value });
    loaded.value = true;
  } finally {
    loading.value = false;
  }
}

/** 选择变化时透传 HynTreeSelect 已归一化的值。 */
function handleChange(value: HynDeptSelectModelValue): void {
  emit('change', value);
}

/** 清空时保留 clear 事件语义。 */
function handleClear(): void {
  emit('clear');
}

/** 聚焦时提前加载部门树，避免首次打开下拉时无反馈。 */
function handleFocus(): void {
  void ensureDeptOptionsLoaded();
  emit('focus');
}

/** 首次打开时兜底加载部门树，适配被 keep-alive 或条件渲染延迟挂载的表单。 */
function handleVisibleChange(visible: boolean): void {
  if (visible) {
    void ensureDeptOptionsLoaded();
  }
  emit('visible-change', visible);
}

onMounted(() => {
  void ensureDeptOptionsLoaded();
});

watch(
  () => props.flatten,
  flatten => {
    if (!flatten && loaded.value) {
      deptOptions.value = cloneHynDeptTree(deptOptions.value);
    }
  }
);
</script>
