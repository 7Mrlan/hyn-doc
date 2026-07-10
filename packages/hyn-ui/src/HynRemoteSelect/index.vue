<template>
  <el-select-v2
    v-model="innerValue"
    class="hyn-remote-select"
    :options="selectOptions"
    :multiple="multiple"
    :loading="loading"
    :disabled="disabled"
    :clearable="clearable"
    :collapse-tags="collapseTags"
    :max-collapse-tags="maxCollapseTags"
    collapse-tags-tooltip
    :placeholder="resolvedPlaceholder"
    :height="dropdownHeight"
    :item-height="optionHeight"
    :loading-text="remoteLoadingText"
    :popper-class="selectPopperClass"
    :teleported="teleported"
    scrollbar-always-on
    filterable
    remote
    reserve-keyword
    :remote-method="handleRemoteSearch"
    @end-reached="handleEndReached"
    @change="handleChange"
    @clear="handleClear"
    @visible-change="handleVisibleChange"
  />
</template>

<script setup lang="ts" generic="TRow, TQuery extends HynEntityPageQuery">
import { computed, getCurrentInstance, nextTick, ref, shallowRef, watch, type Ref } from 'vue';
import type { HynPageResult } from '../types';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import type {
  HynEntityAdapter,
  HynEntityKey,
  HynEntityModelValue,
  HynEntityPageQuery,
  HynEntityRemoteOption
} from '../HynEntityPicker/types';
import { useHynEntitySelection } from '../composables/useHynEntitySelection';

const props = withDefaults(
  defineProps<{
    /** 已选实体主键值；单选传单值，多选传数组，组件负责回显已选实体行。 */
    modelValue?: HynEntityModelValue;
    /** 是否允许多选；会影响 modelValue 形态和选择状态合并策略。 */
    multiple?: boolean;
    /** 远程实体适配器，提供分页查询、主键、显示名和禁用规则。 */
    adapter: HynEntityAdapter<TRow, TQuery>;
    /** 远程搜索关键字写入的查询字段名，必须是查询类型里的字符串 key。 */
    searchParam: Extract<keyof TQuery, string>;
    /** 单页加载数量，用于 Select V2 触底分页。 */
    pageSize?: number;
    /** 下拉虚拟列表高度，需和 optionHeight 一起保证滚动分页计算稳定。 */
    dropdownHeight?: number;
    /** 单个选项高度，必须匹配样式高度以避免 Select V2 虚拟滚动偏移。 */
    optionHeight?: number;
    /** 占位文案；未传时使用系统统一选择文案。 */
    placeholder?: string;
    /** 是否禁用选择器，禁用时不触发远程搜索和选择变更。 */
    disabled?: boolean;
    /** 是否允许清空，清空会同步触发 clear 事件和 modelValue 更新。 */
    clearable?: boolean;
    /** 多选时是否折叠标签，避免远程选择器撑高表单行。 */
    collapseTags?: boolean;
    /** 折叠标签保留数量，传给 Element Plus Select V2。 */
    maxCollapseTags?: number;
    /** 是否把下拉层传送到 body；默认留在局部作用域以便滚动恢复能定位实例。 */
    teleported?: boolean;
  }>(),
  {
    modelValue: undefined,
    multiple: false,
    pageSize: 20,
    dropdownHeight: 274,
    optionHeight: 34,
    placeholder: undefined,
    disabled: false,
    clearable: true,
    collapseTags: true,
    maxCollapseTags: 1,
    teleported: false
  }
);

type SelectEndDirection = 'top' | 'bottom' | 'left' | 'right';

const emit = defineEmits<{
  /** 选择变化时同步主键值，保持外部 v-model 与内部已选行缓存一致。 */
  'update:modelValue': [value: HynEntityModelValue];
  /** 选择变化时返回主键值和已解析实体行，供父组件联动展示。 */
  change: [value: HynEntityModelValue, rows: TRow[]];
  /** 用户清空选择时触发，父组件可据此清理关联字段。 */
  clear: [];
}>();

const instanceUid = getCurrentInstance()?.uid ?? 'default';
const selectPopperScopeClass = `hyn-remote-select-popper-${instanceUid}`;
const selectPopperClass = `hyn-remote-select-popper ${selectPopperScopeClass}`;
const { t } = useHynI18n();
const loadedRows = shallowRef<TRow[]>([]);
// Select V2 消费的是 option 数组；实体行保留在 loadedRows/selectedRows 里用于回写完整数据。
const selectOptions = shallowRef<HynEntityRemoteOption[]>([]);
// 首屏或关键词搜索加载态，和触底加载更多分开，避免覆盖列表底部 loading 文案。
const loading = ref(false);
// 触底分页追加状态，只影响下拉 loadingText，不清空已加载候选项。
const loadingMore = ref(false);
// 下拉是否可见决定是否需要恢复虚拟滚动位置。
const dropdownVisible = ref(false);
const keyword = ref('');
// 当前已加载页码，触底加载时按它推导下一页。
const pageNum = ref(0);
// 远程候选总数，用于判断是否还有下一页可追加。
const total = ref(0);
// 请求序号用于丢弃过期搜索响应，避免慢请求覆盖新关键词结果。
let requestToken = 0;

const {
  selectedRows,
  mergeRows,
  setSelectedRows,
  clearSelectedRows
} = useHynEntitySelection<TRow>(
  {
    multiple: computed(() => props.multiple),
    modelValue: computed(() => props.modelValue) as Ref<HynEntityModelValue>,
    adapter: computed(() => props.adapter) as Ref<HynEntityAdapter<TRow, TQuery>>
  },
  payload => {
    emit('update:modelValue', payload.value);
    emit('change', payload.value, payload.rows);
  }
);

// 是否还有下一页候选项，避免触底事件在最后一页反复请求。
const hasMoreOptions = computed(() => loadedRows.value.length < total.value);
// 下拉加载文案区分首次搜索和分页追加，用户能知道当前是刷新还是加载更多。
const remoteLoadingText = computed(() => (loadingMore.value ? t('app.common.loadingMore') : t('app.common.loading')));
// 占位文案由业务传入优先，未传时保持系统统一选择文案。
const resolvedPlaceholder = computed(() => props.placeholder ?? t('common.select'));

const innerValue = computed({
  get: () => props.modelValue,
  set: (value: HynEntityModelValue) => {
    const currentScrollTop = getDropdownScrollTop();
    const valueKeys = normalizeValueKeys(value);
    const rowMap = new Map<string, TRow>();
    [...selectedRows.value, ...loadedRows.value].forEach(row => {
      rowMap.set(String(props.adapter.getKey(row)), row);
    });
    const nextRows = valueKeys.map(key => rowMap.get(key)).filter((row): row is TRow => Boolean(row));
    setSelectedRows(nextRows);
    void restoreDropdownScrollTop(currentScrollTop);
  }
});

/** 将外部值归一化为字符串 key，兼容单选、多选和空值。 */
function normalizeValueKeys(value: HynEntityModelValue): string[] {
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }
  return value === undefined || value === null ? [] : [String(value)];
}

/** 将实体行转换为 el-select-v2 需要的 option 结构。 */
function toOption(row: TRow): HynEntityRemoteOption {
  return {
    value: props.adapter.getKey(row),
    label: props.adapter.getLabel(row),
    disabled: props.adapter.getDisabled?.(row) ?? false
  };
}

/** 构造下拉 options，已加载候选保持原始顺序，仅把未加载的已选项追加到末尾用于回显。 */
function buildSelectOptions(): HynEntityRemoteOption[] {
  const loadedKeys = new Set(loadedRows.value.map(row => String(props.adapter.getKey(row))));
  const options = loadedRows.value.map(row => toOption(row));
  selectedRows.value.forEach(row => {
    if (!loadedKeys.has(String(props.adapter.getKey(row)))) {
      options.push(toOption(row));
    }
  });
  return options;
}

/** 生成 option 签名，避免选中已加载项时重复替换 options 导致虚拟列表回顶。 */
function getOptionsSignature(options: HynEntityRemoteOption[]): string {
  return options.map(option => `${String(option.value)}\u0001${option.label}\u0001${option.disabled ? '1' : '0'}`).join('\u0002');
}

/** 刷新下拉候选项，只有实际内容变化时才替换数组引用。 */
function refreshSelectOptions(): void {
  const nextOptions = buildSelectOptions();
  if (getOptionsSignature(nextOptions) !== getOptionsSignature(selectOptions.value)) {
    selectOptions.value = nextOptions;
  }
}

/** 构造实体远程查询参数，统一设置搜索字段和分页。 */
function createOptionQuery(nextKeyword: string, nextPageNum: number): TQuery {
  const query = props.adapter.createInitialQuery();
  query.pageNum = nextPageNum;
  query.pageSize = props.pageSize;
  (query as Record<string, unknown>)[props.searchParam] = nextKeyword;
  return query;
}

/** 请求指定页的实体候选项。 */
async function requestOptionPage(nextKeyword: string, nextPageNum: number): Promise<HynPageResult<TRow>> {
  return props.adapter.fetchPage(createOptionQuery(nextKeyword, nextPageNum));
}

/** 按 adapter key 合并已加载实体，避免远程回显和分页追加重复。 */
function mergeLoadedRows(currentRows: TRow[], nextRows: TRow[]): TRow[] {
  const rowMap = new Map<string, TRow>();
  [...currentRows, ...nextRows].forEach(row => {
    rowMap.set(String(props.adapter.getKey(row)), row);
  });
  return Array.from(rowMap.values());
}

/** 获取当前实例对应的 Select V2 虚拟滚动容器。 */
function getDropdownScrollElement(): HTMLElement | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const scrollElements = Array.from(document.querySelectorAll<HTMLElement>(`.${selectPopperScopeClass} .el-vl__window`));
  return scrollElements.find(element => element.offsetParent !== null) ?? scrollElements[0];
}

/** 读取下拉真实滚动像素，用于分页追加后恢复位置。 */
function getDropdownScrollTop(): number | undefined {
  return getDropdownScrollElement()?.scrollTop;
}

/** 等待 Element Plus 内部 resetScrollTop 完成。 */
async function waitForDropdownReset(): Promise<void> {
  await nextTick();
  await nextTick();
  if (typeof requestAnimationFrame !== 'function') {
    return;
  }
  await new Promise<void>(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

/** 分页追加或选择变化后写回滚动像素，避免 Select V2 回到第一条。 */
async function restoreDropdownScrollTop(scrollTop: number | undefined): Promise<void> {
  if (scrollTop === undefined || !dropdownVisible.value) {
    return;
  }
  await waitForDropdownReset();
  const scrollElement = getDropdownScrollElement();
  if (scrollElement && dropdownVisible.value) {
    scrollElement.scrollTop = Math.max(0, scrollTop);
  }
}

/** 根据关键字远程加载第一页候选项，并合并已选项回显缓存。 */
async function loadFirstPage(nextKeyword: string): Promise<void> {
  const currentToken = requestToken + 1;
  requestToken = currentToken;
  loading.value = true;
  keyword.value = nextKeyword;
  pageNum.value = 1;
  try {
    const page = await requestOptionPage(nextKeyword, 1);
    if (requestToken !== currentToken) {
      return;
    }
    loadedRows.value = page.rows ?? [];
    total.value = page.total ?? loadedRows.value.length;
    refreshSelectOptions();
    mergeRows(loadedRows.value);
  } finally {
    if (requestToken === currentToken) {
      loading.value = false;
    }
  }
}

/** 下拉滚动到底部时追加下一页，避免只能看到 20 条候选项。 */
async function loadNextPage(): Promise<void> {
  if (loading.value || loadingMore.value || !hasMoreOptions.value) {
    return;
  }
  const currentScrollTop = getDropdownScrollTop();
  const currentToken = requestToken;
  const currentKeyword = keyword.value;
  const nextPageNum = pageNum.value + 1;
  loadingMore.value = true;
  try {
    const page = await requestOptionPage(currentKeyword, nextPageNum);
    if (requestToken !== currentToken || keyword.value !== currentKeyword) {
      return;
    }
    const nextRows = page.rows ?? [];
    loadedRows.value = mergeLoadedRows(loadedRows.value, nextRows);
    total.value = page.total ?? loadedRows.value.length;
    pageNum.value = nextPageNum;
    refreshSelectOptions();
    mergeRows(nextRows);
    await restoreDropdownScrollTop(currentScrollTop);
  } finally {
    loadingMore.value = false;
  }
}

/** Element Plus 远程搜索入口。 */
function handleRemoteSearch(value: string): void {
  if (value === keyword.value && loadedRows.value.length > 0) {
    return;
  }
  void loadFirstPage(value);
}

/** Select V2 虚拟列表触底事件，只在向下到底时追加远程分页。 */
function handleEndReached(direction: SelectEndDirection): void {
  if (direction === 'bottom') {
    void loadNextPage();
  }
}

/** 下拉首次打开时加载默认第一页，避免空面板。 */
function handleVisibleChange(visible: boolean): void {
  dropdownVisible.value = visible;
  if (visible && loadedRows.value.length === 0) {
    void loadFirstPage(keyword.value);
  }
}

/** change 由 computed setter 统一处理，这里保留事件闭环。 */
function handleChange(): void {}

/** 清空选择并通知调用方。 */
function handleClear(): void {
  clearSelectedRows();
  emit('clear');
}

watch(selectedRows, refreshSelectOptions);
</script>

<style lang="scss" scoped>
.hyn-remote-select {
  width: 100%;
}

.hyn-remote-select :deep(.el-select__wrapper) {
  align-items: center;
  overflow: hidden;
}

.hyn-remote-select :deep(.el-select__selection) {
  align-items: center;
  flex-wrap: nowrap;
  min-height: 24px;
  overflow: hidden;
}

.hyn-remote-select :deep(.el-select__selected-item) {
  align-items: center;
  height: 24px;
  min-width: 0;
}

.hyn-remote-select :deep(.el-select__input-wrapper) {
  align-items: center;
  height: 24px;
}

.hyn-remote-select :deep(.el-select__input) {
  height: 24px;
  line-height: 24px;
}

.hyn-remote-select :deep(.el-select__placeholder) {
  top: 0;
  display: flex;
  align-items: center;
  height: 100%;
  line-height: 1;
  transform: none;
}

.hyn-remote-select :deep(.el-tag) {
  display: inline-flex;
  max-width: 96px;
  align-items: center;
  height: 22px;
  line-height: 22px;
}

.hyn-remote-select :deep(.el-tag__content) {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  line-height: 20px;
}

.hyn-remote-select :deep(.el-select__tags-text) {
  max-width: 62px;
  line-height: 20px;
}

.hyn-remote-select :deep(.el-tag__close) {
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
