<template>
  <div class="hyn-doc-page">
    <header class="hyn-doc-hero">
      <div>
        <span class="hyn-doc-kicker">{{ t('hynDocs.tableDialog.hero.kicker') }}</span>
        <h1>{{ t('hynDocs.tableDialog.hero.title') }}</h1>
        <p>{{ t('hynDocs.tableDialog.hero.description') }}</p>
        <div class="hyn-doc-pill-row">
          <span>{{ t('hynDocs.tableDialog.hero.pills.filters') }}</span>
          <span>{{ t('hynDocs.tableDialog.hero.pills.actions') }}</span>
          <span>{{ t('hynDocs.tableDialog.hero.pills.table') }}</span>
          <span>{{ t('hynDocs.tableDialog.hero.pills.pagination') }}</span>
        </div>
      </div>
      <div class="hyn-doc-grid">
        <article v-for="metric in metrics" :key="metric.label" class="hyn-doc-card">
          <span class="hyn-doc-kicker">{{ metric.label }}</span>
          <h2>{{ metric.value }}</h2>
          <p>{{ metric.note }}</p>
        </article>
      </div>
    </header>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.tableDialog.live.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.tableDialog.live.title') }}</h2>
        <p>{{ t('hynDocs.tableDialog.live.description') }}</p>
      </div>
      <el-button type="primary" plain @click="dialogVisible = true">{{ t('hynDocs.tableDialog.live.openButton') }}</el-button>

      <hyn-table-dialog
        v-model="dialogVisible"
        :title="t('hynDocs.tableDialog.live.dialogTitle')"
        :total="filteredRows.length"
        :selected-count="selectedRowKeys.length"
      >
        <template #filters>
          <el-form @submit.prevent="searchRows" :model="queryParams" :inline="true" class="query-form">
            <el-form-item :label="t('hynDocs.tableDialog.live.jobName')" prop="jobName">
              <el-input v-model="queryParams.jobName" :placeholder="t('hynDocs.tableDialog.live.jobNamePlaceholder')" clearable />
            </el-form-item>
            <el-form-item :label="t('hynDocs.tableDialog.live.status')" prop="status">
              <el-select v-model="queryParams.status" :placeholder="t('hynDocs.tableDialog.live.statusPlaceholder')" clearable>
                <el-option :label="t('hynDocs.tableDialog.live.success')" value="success" />
                <el-option :label="t('hynDocs.tableDialog.live.failure')" value="failure" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="searchRows">{{ t('hynDocs.tableDialog.live.search') }}</el-button>
              <el-button :icon="Refresh" @click="resetQuery">{{ t('hynDocs.tableDialog.live.reset') }}</el-button>
            </el-form-item>
          </el-form>
        </template>

        <template #actions>
          <el-button type="danger" plain :icon="Delete" @click="deleteSelected" :disabled="selectedRowKeys.length === 0">{{ t('hynDocs.tableDialog.live.delete') }}</el-button>
          <el-button type="warning" plain :icon="Download" @click="exportRows">{{ t('hynDocs.tableDialog.live.export') }}</el-button>
        </template>

        <template #table>
          <hyn-table
            v-model:selected-row-keys="selectedRowKeys"
            :rows="pagedDemoRows"
            :columns="tableColumns"
            :row-key="getDemoRowKey"
            selection
            :empty-text="t('hynDocs.tableDialog.live.emptyText')"
          >
            <template #status="{ row }">
              <span class="hyn-doc-status" :class="row.status === 'success' ? 'is-success' : 'is-muted'">
                {{ resolveStatusLabel(row.status) }}
              </span>
            </template>
          </hyn-table>
        </template>

        <template #pagination>
          <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :total="filteredRows.length" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @change="handlePageChange" />
        </template>
      </hyn-table-dialog>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.tableDialog.aiCopy.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.tableDialog.aiCopy.title') }}</h2>
        <p>{{ t('hynDocs.tableDialog.aiCopy.description') }}</p>
      </div>
      <doc-code-block :title="t('hynDocs.tableDialog.aiCopy.codeTitle')" :code="t('hynDocs.tableDialog.aiCopy.code')" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.tableDialog.reference.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.tableDialog.reference.title') }}</h2>
        <p>{{ t('hynDocs.tableDialog.reference.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.tableDialog.reference.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.tableDialog.reference.columns.field') }}</span>
          <span>{{ t('hynDocs.tableDialog.reference.columns.type') }}</span>
          <span>{{ t('hynDocs.tableDialog.reference.columns.description') }}</span>
        </div>
        <div v-for="item in apiRows" :key="item.name" class="hyn-doc-api-table__row" role="row">
          <code>{{ item.name }}</code>
          <span>{{ item.type }}</span>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.tableDialog.rules.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.tableDialog.rules.title') }}</h2>
        <p>{{ t('hynDocs.tableDialog.rules.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-mint">{{ t('hynDocs.tableDialog.rules.doTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in doItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-danger">{{ t('hynDocs.tableDialog.rules.dontTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in dontItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>
    <hyn-dialog v-model="detailVisible" :title="t('hynDocs.demo.detail')" :show-footer="false">
      <el-descriptions v-if="detailRow" :column="1" border>
        <el-descriptions-item :label="t('hynDocs.tableDialog.live.columns.id')">{{ detailRow.id }}</el-descriptions-item>
        <el-descriptions-item :label="t('hynDocs.tableDialog.live.columns.jobName')">{{ t(`hynDocs.tableDialog.live.demoJob.${detailRow.jobNameKey}`) }}</el-descriptions-item>
        <el-descriptions-item :label="t('hynDocs.tableDialog.live.columns.invokeTarget')">{{ detailRow.invokeTarget }}</el-descriptions-item>
        <el-descriptions-item :label="t('hynDocs.tableDialog.live.columns.status')">{{ resolveStatusLabel(detailRow.status) }}</el-descriptions-item>
      </el-descriptions>
    </hyn-dialog>
    <p class="hyn-doc-muted">{{ t('hynDocs.demo.session') }}</p>
  </div>
</template>

<script setup name="HynTableDialogDoc" lang="ts">
import { View, Search, Refresh, Delete, Download } from '@element-plus/icons-vue';
import type { HynTableColumn, HynTableKey } from '@7mrlan/hyn-ui/types';
import { useAppI18n } from '@/utils/i18n';
import DocCodeBlock from '../DocCodeBlock.vue';
import { useDemoRows } from '../useDemoRows';
import { downloadDemoJson } from '../download';

type DemoLogStatus = 'success' | 'failure';

interface DemoLogRow {
  id: number;
  jobNameKey: 'systemDefault' | 'dataSync';
  invokeTarget: string;
  status: DemoLogStatus;
  createTime: string;
}

interface DemoQuery {
  jobName: string;
  status: string;
}

interface DocMetric {
  label: string;
  value: string;
  note: string;
}

interface DocApiRow {
  name: string;
  type: string;
  description: string;
}

const { t } = useAppI18n();
const dialogVisible = ref(false);
const selectedRowKeys = ref<HynTableKey[]>([]);
const pageNum = ref(1);
const pageSize = ref(10);
const queryParams = reactive<DemoQuery>({
  jobName: '',
  status: ''
});

const metrics = computed<DocMetric[]>(() => [
  {
    label: t('hynDocs.tableDialog.metrics.defaultWidth.label'),
    value: t('hynDocs.tableDialog.metrics.defaultWidth.value'),
    note: t('hynDocs.tableDialog.metrics.defaultWidth.note')
  },
  {
    label: t('hynDocs.tableDialog.metrics.layout.label'),
    value: t('hynDocs.tableDialog.metrics.layout.value'),
    note: t('hynDocs.tableDialog.metrics.layout.note')
  },
  {
    label: t('hynDocs.tableDialog.metrics.useCase.label'),
    value: t('hynDocs.tableDialog.metrics.useCase.value'),
    note: t('hynDocs.tableDialog.metrics.useCase.note')
  }
]);

/** 日志数据只在浏览器生成，避免文档站接入真实审计信息。 */
const initialRows = computed<DemoLogRow[]>(() => Array.from({ length: 36 }, (_, index): DemoLogRow => ({
  id: index + 1,
  jobNameKey: index % 2 === 0 ? 'systemDefault' : 'dataSync',
  invokeTarget: index % 2 === 0 ? 'ryTask.RyNoParams' : 'syncTask.execute',
  status: index % 7 === 0 ? 'failure' : 'success',
  createTime: `2026-06-23 10:${String(index).padStart(2, '0')}:00`
})));

/** 日志示例同样以稳定编号维护会话内的批量删除结果。 */
const { rows: demoRows, deleteRows } = useDemoRows<DemoLogRow>(initialRows);
const appliedQuery = ref<DemoQuery>({ jobName: '', status: '' });
const detailRow = ref<DemoLogRow>();
const detailVisible = ref<boolean>(false);
/** 仅应用已提交的查询条件，输入草稿不会提前改变结果。 */
const filteredRows = computed<DemoLogRow[]>(() => demoRows.value.filter(row =>
  t(`hynDocs.tableDialog.live.demoJob.${row.jobNameKey}`).toLowerCase().includes(appliedQuery.value.jobName.toLowerCase())
  && (!appliedQuery.value.status || row.status === appliedQuery.value.status)
));

/** 先筛选再分页，保证总数与当前页使用同一数据集合。 */
const pagedDemoRows = computed<DemoLogRow[]>(() => {
  const startIndex = (pageNum.value - 1) * pageSize.value;
  return filteredRows.value.slice(startIndex, startIndex + pageSize.value);
});

const tableColumns = computed<HynTableColumn<DemoLogRow>[]>(() => [
  { key: 'id', label: t('hynDocs.tableDialog.live.columns.id'), prop: 'id', width: 100 },
  {
    key: 'jobName',
    label: t('hynDocs.tableDialog.live.columns.jobName'),
    minWidth: 160,
    formatter: ({ row }) => t(`hynDocs.tableDialog.live.demoJob.${row.jobNameKey}`)
  },
  { key: 'invokeTarget', label: t('hynDocs.tableDialog.live.columns.invokeTarget'), prop: 'invokeTarget', minWidth: 240 },
  { key: 'status', label: t('hynDocs.tableDialog.live.columns.status'), prop: 'status', width: 110, slot: 'status' },
  { key: 'createTime', label: t('hynDocs.tableDialog.live.columns.createTime'), prop: 'createTime', width: 180 },
  {
    key: 'action',
    label: t('hynDocs.tableDialog.live.columns.action'),
    align: 'center',
    fixed: 'right',
    actions: [{ key: 'view', label: t('hynDocs.tableDialog.live.columns.detail'), icon: View, onClick: handleView }]
  }
]);

const apiRows = computed<DocApiRow[]>(() => [
  { name: 'v-model', type: 'boolean', description: t('hynDocs.tableDialog.reference.rows.model') },
  { name: 'title', type: 'string', description: t('hynDocs.tableDialog.reference.rows.title') },
  { name: 'width', type: 'string', description: t('hynDocs.tableDialog.reference.rows.width') },
  { name: 'loading', type: 'boolean', description: t('hynDocs.tableDialog.reference.rows.loading') },
  { name: 'total / selectedCount', type: 'number', description: t('hynDocs.tableDialog.reference.rows.totals') },
  { name: 'showFooter', type: 'boolean', description: t('hynDocs.tableDialog.reference.rows.showFooter') },
  { name: '#filters', type: 'slot', description: t('hynDocs.tableDialog.reference.rows.filters') },
  { name: '#summary', type: 'slot props', description: t('hynDocs.tableDialog.reference.rows.summary') },
  { name: '#actions', type: 'slot props', description: t('hynDocs.tableDialog.reference.rows.actions') },
  { name: '#table', type: 'slot', description: t('hynDocs.tableDialog.reference.rows.table') },
  { name: '#pagination', type: 'slot', description: t('hynDocs.tableDialog.reference.rows.pagination') },
  { name: '#footer', type: 'slot props', description: t('hynDocs.tableDialog.reference.rows.footer') }
]);

const doItems = computed<string[]>(() => [
  t('hynDocs.tableDialog.rules.doItems.listDialogs'),
  t('hynDocs.tableDialog.rules.doItems.queryForm'),
  t('hynDocs.tableDialog.rules.doItems.tableSlot'),
  t('hynDocs.tableDialog.rules.doItems.selectedKeys')
]);

const dontItems = computed<string[]>(() => [
  t('hynDocs.tableDialog.rules.dontItems.nestedDialog'),
  t('hynDocs.tableDialog.rules.dontItems.toolbarActions'),
  t('hynDocs.tableDialog.rules.dontItems.overrideStyles'),
  t('hynDocs.tableDialog.rules.dontItems.formMigration')
]);

const getDemoRowKey = (row: DemoLogRow): HynTableKey => row.id;

/** 将状态枚举转换成当前语言展示文本。 */
function resolveStatusLabel(status: DemoLogStatus): string {
  return t(status === 'success' ? 'hynDocs.tableDialog.live.success' : 'hynDocs.tableDialog.live.failure');
}

/** 分页变化后清理当前示例选择，避免跨页演示时旧选择造成误解。 */
function handlePageChange(): void {
  selectedRowKeys.value = [];
}

/** 详情展示本次点击的实际记录，避免仅有可点击外观的空操作。 */
function handleView(row: DemoLogRow): void {
  detailRow.value = { ...row };
  detailVisible.value = true;
}

/** 查询按钮提交筛选快照，并回到结果第一页。 */
function searchRows(): void {
  appliedQuery.value = { ...queryParams };
  pageNum.value = 1;
  selectedRowKeys.value = [];
}

/** 重置同步清理输入和已应用条件。 */
function resetQuery(): void {
  queryParams.jobName = '';
  queryParams.status = '';
  searchRows();
}

/** 批量删除后修正末页页码，避免删除最后一页时显示假空表。 */
async function deleteSelected(): Promise<void> {
  if (await deleteRows(selectedRowKeys.value.map(Number))) {
    selectedRowKeys.value = [];
    pageNum.value = Math.min(pageNum.value, Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)));
  }
}

/** 导出当前筛选结果，验证工具栏操作而不依赖后端下载接口。 */
function exportRows(): void {
  downloadDemoJson('hyn-log-demo.json', filteredRows.value);
}
</script>
