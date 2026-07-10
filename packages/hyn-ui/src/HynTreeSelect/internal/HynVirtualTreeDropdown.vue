<template>
  <el-popover
    v-model:visible="dropdownVisible"
    trigger="click"
    placement="bottom-start"
    :fallback-placements="fallbackPlacements"
    :popper-class="popperClass"
    :width="dropdownWidth"
    :teleported="teleported"
    :disabled="disabled"
    :show-arrow="false"
    @show="handleDropdownShow"
    @hide="handleDropdownHide"
  >
    <div v-loading="loading" class="hyn-tree-select__virtual-panel">
      <div v-if="filterable || multiple" class="hyn-tree-select__virtual-toolbar">
        <el-input
          v-if="filterable"
          v-model="keyword"
          class="hyn-tree-select__virtual-search"
          :placeholder="t('app.hynTreeSelect.searchPlaceholder')"
          :prefix-icon="Search"
          clearable
          @keydown.stop
        />
        <el-tooltip v-if="multiple" :content="linkageDescription" placement="top" :show-after="350">
          <button
            class="hyn-tree-select__linkage-button"
            :class="{ 'is-active': linkage }"
            type="button"
            :aria-label="linkageDescription"
            :aria-pressed="linkage"
            @click="handleLinkageToggle"
          >
            <el-icon><Connection /></el-icon>
            <span>{{ t('app.hynTreeSelect.linkage') }}</span>
            <span class="hyn-tree-select__linkage-indicator" aria-hidden="true">
              <span></span>
            </span>
          </button>
        </el-tooltip>
      </div>
      <div class="hyn-tree-select__virtual-tree-wrap">
        <el-tree-v2
          ref="treeRef"
          class="hyn-tree-select__virtual-tree"
          :data="data"
          :props="nodeProps"
          :height="dropdownHeight"
          :item-size="optionHeight"
          :empty-text="noDataText"
          :check-strictly="!linkage"
          :show-checkbox="multiple"
          :highlight-current="highlightCurrent"
          :current-node-key="currentNodeKey"
          :expand-on-click-node="false"
          :check-on-click-node="multiple"
          :check-on-click-leaf="false"
          :filter-method="filterTreeNode"
          scrollbar-always-on
          @check="handleTreeCheck"
          @node-click="handleTreeNodeClick"
        />
      </div>
    </div>
    <template #reference>
      <div
        ref="triggerRef"
        class="hyn-tree-select hyn-tree-select__virtual-trigger"
        :class="{
          'is-disabled': disabled,
          'is-focused': dropdownVisible,
          'is-empty': selectedTags.length === 0
        }"
        :tabindex="disabled ? -1 : 0"
        role="combobox"
        :aria-expanded="dropdownVisible"
        :aria-disabled="disabled"
        @focus="handleTriggerFocus"
        @keydown.enter.prevent="openDropdown"
        @keydown.space.prevent="openDropdown"
        @keydown.esc.prevent="closeDropdown"
      >
        <span v-if="selectedTags.length === 0" class="hyn-tree-select__virtual-placeholder">
          {{ placeholder }}
        </span>
        <span v-else-if="multiple" class="hyn-tree-select__virtual-tags">
          <el-tag
            v-for="tag in visibleTags"
            :key="String(tag.key)"
            class="hyn-tree-select__virtual-tag"
            size="small"
            :closable="!disabled"
            disable-transitions
            @close.stop="handleRemoveSelectedKey(tag.key)"
          >
            <span class="hyn-tree-select__virtual-tag-text">{{ tag.label }}</span>
          </el-tag>
          <el-tag
            v-if="hiddenTagCount > 0"
            class="hyn-tree-select__virtual-tag is-count"
            size="small"
            disable-transitions
          >
            +{{ hiddenTagCount }}
          </el-tag>
        </span>
        <span v-else class="hyn-tree-select__virtual-single">{{ selectedTags[0]?.label }}</span>
        <button
          v-if="clearable && selectedTags.length > 0 && !disabled"
          class="hyn-tree-select__virtual-clear"
          type="button"
          :aria-label="t('app.common.clear')"
          @click.stop="handleClear"
        >
          <el-icon><CircleClose /></el-icon>
        </button>
        <el-icon class="hyn-tree-select__virtual-arrow" aria-hidden="true"><ArrowDown /></el-icon>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import type { Placement } from '@popperjs/core';
import { ArrowDown, CircleClose, Connection, Search } from '@element-plus/icons-vue';
import { computed, nextTick, ref, watch } from 'vue';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import { useHynDialogOverlayClose } from '../../shared/dialogOverlay';
import type { HynTreeSelectModelValue, HynTreeSelectNode, HynTreeSelectNodeProps, HynTreeSelectValue } from '../types';
import { getHynTreeSelectedKeys, normalizeHynTreeSelectModelValue } from './modelValue';
import {
  createHynTreeLabelMap,
  createHynTreeSearchText,
  normalizeHynTreeSearchKeyword,
  readHynTreeNodeDisabled,
  readHynTreeNodeLabel,
  readHynTreeNodeValue
} from './nodeAccess';

interface HynTreeSelectTag {
  /** 用于删除当前 tag 的树节点主键。 */
  key: HynTreeSelectValue;
  /** 触发器中展示的树节点文案。 */
  label: string;
}

interface HynTreeCheckedInfo {
  /** 本次交互完成后的全部勾选节点主键。 */
  checkedKeys: HynTreeSelectValue[];
}

interface HynTreeV2Instance {
  /** Element Plus Tree V2 暴露的勾选回写方法。 */
  setCheckedKeys: (keys: HynTreeSelectValue[]) => void;
  /** Element Plus Tree V2 暴露的真实勾选主键读取方法。 */
  getCheckedKeys: () => HynTreeSelectValue[];
  /** 回写单个节点勾选状态，deep=true 时沿用树组件的父子级联规则。 */
  setChecked: (key: HynTreeSelectValue, checked: boolean, deep: boolean) => void;
  /** Element Plus Tree V2 本地过滤入口。 */
  filter: (keyword: string) => void;
  /** Element Plus Tree V2 当前节点回写方法，用于单选回显。 */
  setCurrentKey: (key: HynTreeSelectValue | undefined) => void;
}

const props = withDefaults(
  defineProps<{
    /** 已选树节点主键；单选为单个值，多选为数组。 */
    modelValue?: HynTreeSelectModelValue;
    /** 已过滤后的层级树数据。 */
    data: HynTreeSelectNode[];
    /** Tree V2 节点字段映射。 */
    nodeProps: HynTreeSelectNodeProps;
    /** 节点值字段名，必须与 Tree V2 props.value 保持一致。 */
    valueKey: string;
    /** 下拉占位提示。 */
    placeholder: string;
    /** 外部数据或内部处理加载态。 */
    loading: boolean;
    /** 空数据提示文案。 */
    noDataText: string;
    /** 是否禁用选择器。 */
    disabled: boolean;
    /** 是否显示清空按钮。 */
    clearable: boolean;
    /** 是否允许关键字过滤。 */
    filterable: boolean;
    /** 是否启用多选。 */
    multiple: boolean;
    /** 是否启用父子联动；开启后 Tree V2 自动关联父子节点。 */
    linkage: boolean;
    /** 多选时是否折叠 tag。 */
    collapseTags: boolean;
    /** 折叠 tag 时最多显示的 tag 数。 */
    maxCollapseTags: number;
    /** 下拉层是否 teleport 到 body。 */
    teleported: boolean;
    /** 树形下拉宽度。 */
    dropdownWidth: number | string;
    /** 下拉虚拟树高度。 */
    dropdownHeight: number;
    /** 虚拟树节点行高。 */
    optionHeight: number;
  }>(),
  {
    modelValue: undefined
  }
);

const emit = defineEmits<{
  /** 同步当前选择值。 */
  'update:modelValue': [value: HynTreeSelectModelValue];
  /** 同步父子联动模式。 */
  'update:linkage': [linkage: boolean];
  /** 选择变化时通知上层表单。 */
  change: [value: HynTreeSelectModelValue];
  /** 用户清空选择时触发。 */
  clear: [];
  /** 下拉显示状态变化时触发。 */
  'visible-change': [visible: boolean];
  /** 触发器聚焦时触发，业务包装组件可据此提前加载树数据。 */
  focus: [];
}>();

const { t } = useHynI18n();
const fallbackPlacements: Placement[] = ['bottom-start'];
const popperClass = 'hyn-tree-select-popper hyn-tree-select-virtual-popper';
const treeRef = ref<HynTreeV2Instance>();
/** 触发器 DOM 用于识别其所属的 HYN 弹窗，slot 弹窗同样依赖这个真实渲染边界。 */
const triggerRef = ref<HTMLElement>();
/** 选择状态重放序号，用于丢弃快速外部回填时过期的异步刷新。 */
let selectionRefreshToken = 0;
/** Tree V2 下拉由 Popover 承载，显式持有可见状态以同步触发器样式和 visible-change 事件。 */
const dropdownVisible = ref(false);
const keyword = ref('');
/** 联动按钮提示同时说明当前模式和切换后的选择语义。 */
const linkageDescription = computed(() =>
  t(props.linkage ? 'app.hynTreeSelect.linkageEnabledTip' : 'app.hynTreeSelect.linkageDisabledTip')
);

/** 当前表单值归一化后的主键数组，是回显、勾选回放和滚动定位的统一来源。 */
const normalizedSelectedKeys = computed(() => getHynTreeSelectedKeys(props.modelValue, props.multiple));
/** 单选模式的当前节点主键，空值时关闭 Tree V2 高亮避免清空后残留旧节点视觉。 */
const currentNodeKey = computed(() => (props.multiple ? undefined : normalizedSelectedKeys.value[0]));
/** 单选空值时关闭高亮，避免 Tree V2 内部 currentKey 在父节点点击后留下错误视觉状态。 */
const highlightCurrent = computed(() => !props.multiple && currentNodeKey.value !== undefined);
/** 已加载树节点的主键到文案索引，解决虚拟树只渲染可见行时的已选项回显问题。 */
const labelByValue = computed(() => createHynTreeLabelMap(props.data, props.nodeProps, props.valueKey));
/** 触发器展示真实勾选节点；折叠时使用 +N 表达数量，不把子节点伪装成一个父节点。 */
const selectedTags = computed<HynTreeSelectTag[]>(() =>
  normalizedSelectedKeys.value.map(key => ({
    key,
    label: labelByValue.value.get(String(key)) ?? String(key)
  }))
);
/** 多选 tag 展示上限，关闭折叠时尊重调用方配置但仍由触发器 overflow 保护布局。 */
const visibleTagLimit = computed(() => {
  if (!props.multiple || !props.collapseTags) {
    return selectedTags.value.length;
  }
  return Math.max(1, props.maxCollapseTags);
});
/** 当前触发器实际渲染的已选标签集合。 */
const visibleTags = computed(() => selectedTags.value.slice(0, visibleTagLimit.value));
/** 被折叠的真实勾选数量，使用计数 tag 保持表单行高稳定。 */
const hiddenTagCount = computed(() => Math.max(0, selectedTags.value.length - visibleTags.value.length));

/** 写回选择值并同步 change 事件，保持和 Element Plus 选择器事件语义一致。 */
function emitValueChange(value: HynTreeSelectModelValue): void {
  const nextValue = normalizeHynTreeSelectModelValue(value, props.multiple);
  emit('update:modelValue', nextValue);
  emit('change', nextValue);
}

/** 外部模型或数据源变化时回放勾选状态；用户在树内勾选时相同键集合不会重复写入。 */
async function refreshTreeSelectionState(): Promise<void> {
  const currentToken = (selectionRefreshToken += 1);
  await nextTick();
  if (currentToken !== selectionRefreshToken) {
    return;
  }
  const tree = treeRef.value;
  if (!tree) {
    return;
  }
  if (props.multiple) {
    const selectedKeys = normalizedSelectedKeys.value;
    if (!areTreeKeySetsEqual(tree.getCheckedKeys(), selectedKeys)) {
      tree.setCheckedKeys(selectedKeys);
    }
    return;
  }
  tree.setCurrentKey(currentNodeKey.value);
}

/** 比较两组树节点主键集合，避免业务数组顺序变化触发无意义的状态重放。 */
function areTreeKeySetsEqual(left: HynTreeSelectValue[], right: HynTreeSelectValue[]): boolean {
  if (left.length !== right.length) {
    return false;
  }
  const rightKeys = new Set(right.map(key => String(key)));
  return left.every(key => rightKeys.has(String(key)));
}

/**
 * 切换父子联动模式后按新规则重放当前勾选节点。
 *
 * @remarks
 * 开启联动时已选父节点必须级联后代；关闭联动时重新按独立规则勾选，以清除旧半选缓存。整个过程不修改展开状态。
 */
async function replayTreeSelectionAfterLinkageChange(): Promise<void> {
  const currentToken = (selectionRefreshToken += 1);
  await nextTick();
  if (currentToken !== selectionRefreshToken) {
    return;
  }
  const tree = treeRef.value;
  if (!tree || !props.multiple) {
    return;
  }
  const selectedKeys = normalizedSelectedKeys.value;
  tree.setCheckedKeys([]);
  await nextTick();
  if (currentToken !== selectionRefreshToken) {
    return;
  }
  selectedKeys.forEach(key => {
    tree.setChecked(key, true, props.linkage);
  });
  const checkedKeys = tree.getCheckedKeys();
  if (!areTreeKeySetsEqual(selectedKeys, checkedKeys)) {
    emitValueChange(checkedKeys);
  }
}

/** Tree V2 本地过滤方法，支持按节点标签和主键搜索。 */
function filterTreeNode(searchKeyword: string, data: HynTreeSelectNode): boolean {
  const normalizedKeyword = normalizeHynTreeSearchKeyword(searchKeyword);
  if (!normalizedKeyword) {
    return true;
  }
  const value = readHynTreeNodeValue(data, props.nodeProps, props.valueKey);
  const label = readHynTreeNodeLabel(data, props.nodeProps);
  return createHynTreeSearchText(value, label).includes(normalizedKeyword);
}

/** 打开树形下拉时只同步外部模型，不改变用户的节点展开状态。 */
function handleDropdownShow(): void {
  emit('visible-change', true);
  void refreshTreeSelectionState();
}

/** 关闭树形下拉时清理搜索关键字并同步外层 visible-change 事件。 */
function handleDropdownHide(): void {
  keyword.value = '';
  emit('visible-change', false);
}

/** 聚焦触发器时通知业务包装层可提前加载远程树数据。 */
function handleTriggerFocus(): void {
  emit('focus');
}

/** 打开树形下拉，供键盘触发器调用；鼠标点击由 ElPopover 的 click trigger 统一处理。 */
function openDropdown(): void {
  if (props.disabled) {
    return;
  }
  dropdownVisible.value = true;
}

/** 关闭树形下拉，主要服务键盘 Escape 操作和单选命中后的收起。 */
function closeDropdown(): void {
  dropdownVisible.value = false;
}

/** 切换父子联动模式；按钮只在树形多选下拉中展示。 */
function handleLinkageToggle(): void {
  emit('update:linkage', !props.linkage);
}

/** 多选勾选变化时直接提交 Tree V2 的真实 checkedKeys，不转换父节点、子节点或半选状态。 */
function handleTreeCheck(_data: HynTreeSelectNode, checkedInfo: HynTreeCheckedInfo): void {
  if (props.multiple) {
    emitValueChange(checkedInfo.checkedKeys);
  }
}

/** 删除 tag 时调用树实例取消勾选，父子联动模式沿用 Tree V2 的级联取消规则。 */
function handleRemoveSelectedKey(selectedKey: HynTreeSelectValue): void {
  if (!props.multiple || props.disabled) {
    return;
  }
  const tree = treeRef.value;
  if (!tree) {
    emitValueChange(normalizedSelectedKeys.value.filter(key => String(key) !== String(selectedKey)));
    return;
  }
  tree.setChecked(selectedKey, false, props.linkage);
  emitValueChange(tree.getCheckedKeys());
}

/** 单选节点点击时写回当前节点；多选仅通过复选框修改选择状态。 */
function handleTreeNodeClick(data: HynTreeSelectNode): void {
  if (props.multiple || readHynTreeNodeDisabled(data, props.nodeProps)) {
    return;
  }
  emitValueChange(readHynTreeNodeValue(data, props.nodeProps, props.valueKey));
  closeDropdown();
}

/** 清空当前选择并清理 Tree V2 内部勾选或高亮状态。 */
function handleClear(): void {
  emitValueChange(props.multiple ? [] : undefined);
  treeRef.value?.setCheckedKeys([]);
  treeRef.value?.setCurrentKey(undefined);
  closeDropdown();
  emit('clear');
}

useHynDialogOverlayClose(() => triggerRef.value, closeDropdown);

watch(
  () => props.linkage,
  () => {
    void replayTreeSelectionAfterLinkageChange();
  },
  { flush: 'post' }
);

watch(
  () => [props.modelValue, props.data, props.multiple] as const,
  () => {
    void refreshTreeSelectionState();
  },
  { flush: 'post' }
);

watch(
  keyword,
  value => {
    treeRef.value?.filter(value);
  },
  { flush: 'post' }
);
</script>

<style lang="scss" scoped>
.hyn-tree-select {
  width: 100%;
}

:global(.hyn-tree-select-virtual-popper.el-popover.el-popper) {
  max-width: calc(100vw - 24px);
  padding: 0;
  border-radius: var(--app-radius-base);
  overflow: hidden;
}

.hyn-tree-select__virtual-panel {
  min-height: 120px;
  background: var(--app-surface-bg);
}

.hyn-tree-select__virtual-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid var(--app-surface-border);
  background: var(--app-surface-muted);
}

.hyn-tree-select__virtual-search {
  min-width: 0;
  flex: 1 1 auto;
}

.hyn-tree-select__linkage-button {
  display: inline-flex;
  min-height: var(--app-control-height);
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  padding: 0 9px;
  border: 1px solid var(--app-surface-border);
  border-radius: var(--app-radius-md);
  background: var(--app-surface-bg);
  color: var(--app-text-muted);
  font: inherit;
  font-size: var(--app-font-size-sm);
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 160ms ease-out,
    border-color 160ms ease-out,
    background-color 160ms ease-out,
    box-shadow 160ms ease-out,
    transform 100ms ease-out;
}

.hyn-tree-select__linkage-button:hover {
  border-color: var(--app-accent-border);
  color: var(--app-text-title);
}

.hyn-tree-select__linkage-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--app-accent-border);
}

.hyn-tree-select__linkage-button:active {
  transform: scale(0.98);
}

.hyn-tree-select__linkage-button.is-active {
  border-color: var(--app-accent-border);
  background: var(--app-accent-soft);
  color: var(--app-accent-strong);
}

.hyn-tree-select__linkage-indicator {
  position: relative;
  display: inline-flex;
  width: 24px;
  height: 14px;
  align-items: center;
  padding: 2px;
  border-radius: var(--app-radius-pill);
  background: var(--el-border-color);
  box-sizing: border-box;
  transition: background-color 160ms ease-out;
}

.hyn-tree-select__linkage-indicator > span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--app-surface-bg);
  box-shadow: var(--app-shadow-sm);
  transition: transform 160ms ease-out;
}

.hyn-tree-select__linkage-button.is-active .hyn-tree-select__linkage-indicator {
  background: var(--app-accent-strong);
}

.hyn-tree-select__linkage-button.is-active .hyn-tree-select__linkage-indicator > span {
  transform: translateX(10px);
}

.hyn-tree-select__virtual-tree-wrap {
  padding: 4px 4px 6px;
}

.hyn-tree-select__virtual-tree {
  width: 100%;
}

.hyn-tree-select__virtual-tree :deep(.el-tree-node__content) {
  margin: 1px 0;
  border-radius: var(--app-radius-md);
  transition:
    color 160ms ease-out,
    background-color 160ms ease-out;
}

.hyn-tree-select__virtual-trigger {
  position: relative;
  display: flex;
  min-height: var(--app-control-height);
  align-items: center;
  gap: 6px;
  padding: 1px 34px 1px 11px;
  border: 0;
  border-radius: var(--el-border-radius-base);
  outline: none;
  background: var(--el-fill-color-blank);
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
  box-sizing: border-box;
  cursor: pointer;
  transition:
    background-color 160ms ease-out,
    box-shadow 160ms ease-out;
}

.hyn-tree-select__virtual-trigger:hover:not(.is-disabled) {
  box-shadow: 0 0 0 1px var(--el-border-color-hover, var(--app-accent-strong)) inset;
}

.hyn-tree-select__virtual-trigger.is-focused {
  box-shadow: 0 0 0 1px var(--app-accent-strong) inset;
}

.hyn-tree-select__virtual-trigger:focus-visible {
  box-shadow:
    0 0 0 1px var(--app-accent-strong) inset,
    0 0 0 2px var(--app-accent-border);
}

.hyn-tree-select__virtual-trigger.is-disabled {
  background: var(--el-disabled-bg-color);
  color: var(--el-disabled-text-color);
  cursor: not-allowed;
}

.hyn-tree-select__virtual-placeholder,
.hyn-tree-select__virtual-single {
  min-width: 0;
  overflow: hidden;
  line-height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hyn-tree-select__virtual-placeholder {
  color: var(--el-text-color-placeholder);
}

.hyn-tree-select__virtual-single {
  color: var(--el-text-color-regular);
}

.hyn-tree-select__virtual-tags {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 4px;
  overflow: hidden;
}

.hyn-tree-select__virtual-tag {
  max-width: 112px;
}

.hyn-tree-select__virtual-tag.is-count {
  flex: 0 0 auto;
}

.hyn-tree-select__virtual-tag-text {
  display: inline-block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hyn-tree-select__virtual-clear,
.hyn-tree-select__virtual-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.hyn-tree-select__virtual-clear {
  right: 27px;
  display: inline-flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--el-text-color-placeholder);
  cursor: pointer;
  transition: color 160ms ease-out;
}

.hyn-tree-select__virtual-clear:hover {
  color: var(--el-text-color-secondary);
}

.hyn-tree-select__virtual-clear:focus-visible {
  outline: 2px solid var(--app-accent-border);
  outline-offset: 1px;
}

.hyn-tree-select__virtual-arrow {
  right: 11px;
  color: var(--el-text-color-placeholder);
  font-size: 14px;
  transition: transform 160ms ease-out;
}

.hyn-tree-select__virtual-trigger.is-focused .hyn-tree-select__virtual-arrow {
  transform: translateY(-50%) rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .hyn-tree-select__linkage-button,
  .hyn-tree-select__linkage-indicator,
  .hyn-tree-select__linkage-indicator > span,
  .hyn-tree-select__virtual-trigger,
  .hyn-tree-select__virtual-arrow {
    transition-duration: 0.01ms;
  }

  .hyn-tree-select__linkage-button:active {
    transform: none;
  }
}
</style>
