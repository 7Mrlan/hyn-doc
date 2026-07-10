<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    :width="dialogWidth"
    :top="dialogTop"
    append-to-body
    class="hyn-entity-picker-dialog"
    @update:model-value="value => emit('update:visible', value)"
    @closed="handleClosed"
  >
    <div class="p-2 hyn-entity-picker">
      <el-card shadow="hover" class="search-panel selector-card hyn-entity-picker__search-card">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
          <el-form-item v-for="field in searchFields" :key="field.key" :label="field.label" :prop="field.key">
            <el-input
              :model-value="getQueryFieldValue(field.key)"
              :placeholder="field.placeholder"
              clearable
              @update:model-value="value => setQueryFieldValue(field.key, value)"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">{{ t('app.common.search') }}</el-button>
            <el-button icon="Refresh" @click="resetQuery">{{ t('app.common.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card shadow="hover" class="table-panel selector-card hyn-entity-picker__table-card">
        <template v-if="showSelectedTags" #header>
          <div class="toolbar-shell selector-header">
            <div class="table-heading">
              <h3>{{ title }}</h3>
              <p>{{ t('app.table.totalSelected', { total, selected: selectedRows.length }) }}</p>
            </div>
            <div v-if="selectedRows.length" class="selector-tags">
              <el-tag v-for="row in selectedRows" :key="adapter.getKey(row)" closable @close="removeSelectedKey(adapter.getKey(row))">
                {{ adapter.getLabel(row) }}
              </el-tag>
            </div>
          </div>
        </template>

        <hyn-virtual-table
          class="selector-table"
          :rows="rows"
          :columns="columns"
          :row-key="adapter.getKey"
          height="100%"
          :selected-row-keys="selectedRowKeys"
          :loading="loading || resolving"
          :multiple="multiple"
          :row-disabled="isRowDisabled"
          selection
          :empty-text="resolvedEmptyText"
          @selection-change="handleSelectionChange"
          @select-all-change="handleSelectAllChange"
        >
          <template v-for="slotName in columnSlotNames" :key="slotName" #[slotName]="slotScope">
            <slot :name="slotName" v-bind="slotScope" />
          </template>
        </hyn-virtual-table>

        <pagination
          v-if="total > 0"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          :total="total"
          :auto-scroll="false"
          @pagination="loadRows"
        />
      </el-card>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :disabled="selectedRows.length === 0" @click="handleConfirm">
          {{ t('common.confirm') }}
        </el-button>
        <el-button @click="handleCancel">{{ t('common.cancel') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" generic="TRow, TQuery extends HynEntityPageQuery">
import type { FormInstance as ElFormInstance } from 'element-plus';
import { computed, reactive, ref, shallowRef, watch, type Ref } from 'vue';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import HynVirtualTable from '../HynVirtualTable/index.vue';
import type { HynVirtualTableKey, HynVirtualTableSelectAllChange, HynVirtualTableSelectionChange } from '../HynVirtualTable/types';
import type {
  HynEntityAdapter,
  HynEntityModelValue,
  HynEntityPageQuery,
  HynEntityPickerColumn,
  HynEntitySearchField
} from './types';
import { useHynEntitySelection } from '../composables/useHynEntitySelection';

const props = withDefaults(
  defineProps<{
    /** 已选实体主键值；单选传单值，多选传数组，空值由选择状态组合式统一归一化。 */
    modelValue?: HynEntityModelValue;
    /** 弹窗显隐状态，由父组件通过 `v-model:visible` 控制，关闭后组件会清理本次查询结果。 */
    visible: boolean;
    /** 弹窗标题，同时用于已选标签区域的标题，调用方应传入当前实体的业务名称。 */
    title: string;
    /** 是否允许多选；切换该值会影响 modelValue 的形态和确认事件返回值。 */
    multiple?: boolean;
    /** 实体适配器，负责远程分页、主键、显示名和禁用状态，组件不猜测业务字段。 */
    adapter: HynEntityAdapter<TRow, TQuery>;
    /** 表格列配置，slot 列会透传给调用方自定义实体字段展示。 */
    columns: HynEntityPickerColumn<TRow>[];
    /** 顶部搜索字段，key 必须存在于查询对象中，组件只写入文本型筛选值。 */
    searchFields: HynEntitySearchField<TQuery>[];
    /** 弹窗内分页大小，会覆盖 adapter 初始查询里的 pageSize。 */
    pageSize?: number;
    /** 空数据文案；未传时使用系统统一的无数据文案。 */
    emptyText?: string;
    /** Element Plus Dialog 宽度，默认限制在视口内避免小屏溢出。 */
    dialogWidth?: string;
    /** Element Plus Dialog 顶部偏移，用于控制大表格弹窗的首屏可见高度。 */
    dialogTop?: string;
    /** 是否在表格头部展示已选标签；大量已选项场景可关闭以减少头部高度。 */
    showSelectedTags?: boolean;
  }>(),
  {
    modelValue: undefined,
    multiple: true,
    pageSize: 10,
    emptyText: undefined,
    dialogWidth: 'min(800px, calc(100vw - 32px))',
    dialogTop: '15vh',
    showSelectedTags: false
  }
);

const emit = defineEmits<{
  /** 选择状态变化时同步主键值，保持 `v-model` 和内部回显缓存一致。 */
  'update:modelValue': [value: HynEntityModelValue];
  /** 弹窗打开或关闭时通知父组件，取消和确认都会主动关闭弹窗。 */
  'update:visible': [value: boolean];
  /** 点击确认时返回完整实体行和主键值，供父组件提交或回填展示字段。 */
  confirm: [rows: TRow[], value: HynEntityModelValue];
  /** 点击取消时触发，组件不会清空父级已选值。 */
  cancel: [];
  /** 任意选择变化时触发，返回值和已解析行供外部联动。 */
  change: [value: HynEntityModelValue, rows: TRow[]];
}>();

// 查询表单实例只用于重置动态搜索字段，不参与父级选择值提交。
const queryFormRef = ref<ElFormInstance>();
const { t } = useHynI18n();
const rows = shallowRef<TRow[]>([]);
// 弹窗分页加载状态和回显解析状态分离，避免远程回显阻塞普通翻页交互。
const loading = ref(false);
// 远程分页总数来自 adapter，分页组件和已选汇总共用这一份结果。
const total = ref(0);
// 查询对象由 adapter 初始化，组件只追加 pageNum/pageSize 和动态搜索字段。
const queryParams = reactive<TQuery>(props.adapter.createInitialQuery());

const {
  resolving,
  selectedRows,
  normalizedSelectedKeys,
  mergeRows,
  setRowSelected,
  removeSelectedKey,
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

// 虚拟表只需要主键数组，完整实体行由 useHynEntitySelection 维护。
const selectedRowKeys = computed<HynVirtualTableKey[]>(() => normalizedSelectedKeys.value);
// 只为配置了 slot 的列创建透传插槽，避免模板为普通列注册无意义 slot。
const columnSlotNames = computed(() => props.columns.map(column => column.slot).filter((slot): slot is string => Boolean(slot)));
// 空数据文案在选择器内统一兜底，调用方可按业务覆盖。
const resolvedEmptyText = computed(() => props.emptyText ?? t('app.common.noData'));

/** 合并初始查询条件，保证分页参数和默认 pageSize 一致。 */
function resetQueryParams(): void {
  const initialQuery = props.adapter.createInitialQuery();
  Object.keys(queryParams).forEach(key => {
    delete (queryParams as Record<string, unknown>)[key];
  });
  Object.assign(queryParams, initialQuery, {
    pageNum: 1,
    pageSize: props.pageSize
  });
}

/** 远程加载实体分页，并把当前页数据并入回显缓存。 */
async function loadRows(): Promise<void> {
  loading.value = true;
  try {
    const page = await props.adapter.fetchPage({ ...queryParams } as TQuery);
    rows.value = page.rows ?? [];
    total.value = page.total ?? 0;
    mergeRows(rows.value);
  } finally {
    loading.value = false;
  }
}

/** 搜索按钮操作。 */
function handleQuery(): void {
  queryParams.pageNum = 1;
  void loadRows();
}

/** 读取动态搜索字段值，规避模板直接索引泛型 query 的类型限制。 */
function getQueryFieldValue(key: string): string {
  return String((queryParams as Record<string, unknown>)[key] ?? '');
}

/** 写入动态搜索字段值，搜索字段只承载文本查询条件。 */
function setQueryFieldValue(key: string, value: string | number): void {
  (queryParams as Record<string, unknown>)[key] = value;
}

/** 重置查询条件并刷新列表。 */
function resetQuery(): void {
  queryFormRef.value?.resetFields();
  resetQueryParams();
  void loadRows();
}

/** 单行选择变化。 */
function handleSelectionChange(payload: HynVirtualTableSelectionChange<TRow>): void {
  setRowSelected(payload.row, payload.selected);
}

/** 当前页全选变化。 */
function handleSelectAllChange(payload: HynVirtualTableSelectAllChange<TRow>): void {
  payload.rows.forEach(row => setRowSelected(row, payload.selected));
}

/** 透传实体适配器的禁用规则，保持远程下拉和弹窗选择语义一致。 */
function isRowDisabled(row: TRow): boolean {
  return props.adapter.getDisabled?.(row) ?? false;
}

/** 取消选择弹窗。 */
function handleCancel(): void {
  emit('cancel');
  emit('update:visible', false);
}

/** 确认选择并返回完整实体行。 */
function handleConfirm(): void {
  emit('confirm', selectedRows.value, props.modelValue);
  emit('update:visible', false);
}

/** 弹窗完全关闭后清理本次查询状态，避免旧条件污染下一次打开。 */
function handleClosed(): void {
  rows.value = [];
  total.value = 0;
}

watch(
  () => props.visible,
  visible => {
    if (visible) {
      resetQueryParams();
      void loadRows();
    }
  }
);
</script>

<style lang="scss" scoped>
@use '../shared/selector-dialog' as selectorDialog;

@include selectorDialog.shell-gap('.hyn-entity-picker');
@include selectorDialog.card-shell;
@include selectorDialog.selector-header-tags(992px);
@include selectorDialog.dialog-body-padding('hyn-entity-picker-dialog');
@include selectorDialog.selector-table;

:global(.el-overlay .el-overlay-dialog .hyn-entity-picker-dialog) {
  display: flex;
  max-height: calc(100vh - 40px);
  flex-direction: column;
}

:global(.el-overlay .el-overlay-dialog .hyn-entity-picker-dialog .el-dialog__body) {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden !important;
}

:global(.el-overlay .el-overlay-dialog .hyn-entity-picker-dialog .el-dialog__footer) {
  flex: 0 0 auto;
}

.hyn-entity-picker {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: min(720px, calc(100vh - 154px));
  min-height: 0;
  background: var(--app-surface-bg);
  overflow: hidden;
}

.hyn-entity-picker__search-card {
  flex: 0 0 auto;
  height: auto;
}

.hyn-entity-picker__table-card {
  display: flex;
  flex: 1 1 auto;
  height: auto;
  min-height: 270px;
}

.hyn-entity-picker__table-card :deep(.el-card__body) {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
}

.hyn-entity-picker__table-card :deep(.selector-table) {
  flex: 1 1 auto;
  min-height: 0;
}

.hyn-entity-picker__table-card :deep(.pagination-container) {
  flex: 0 0 auto;
  margin-bottom: 0;
  padding-bottom: 0;
}

@media (max-height: 720px) {
  .hyn-entity-picker {
    height: calc(100vh - 132px);
  }

  .hyn-entity-picker__table-card {
    min-height: 250px;
  }
}
</style>
