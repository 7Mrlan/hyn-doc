<template>
  <div class="hyn-doc-page">
    <header class="hyn-doc-hero">
      <div>
        <span class="hyn-doc-kicker">{{ t('hynDocs.table.hero.kicker') }}</span>
        <h1>{{ t('hynDocs.table.hero.title') }}</h1>
        <p>{{ t('hynDocs.table.hero.description') }}</p>
        <div class="hyn-doc-pill-row">
          <span>{{ t('hynDocs.table.hero.pills.crud') }}</span>
          <span>{{ t('hynDocs.table.hero.pills.overflow') }}</span>
          <span>{{ t('hynDocs.table.hero.pills.actions') }}</span>
          <span>{{ t('hynDocs.table.hero.pills.kernel') }}</span>
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
        <span class="hyn-doc-kicker">{{ t('hynDocs.table.live.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.table.live.title') }}</h2>
        <p>{{ t('hynDocs.table.live.description') }}</p>
      </div>
      <div class="hyn-doc-demo-frame">
        <div class="hyn-doc-demo-toolbar">
          <el-button type="primary" :icon="Upload" @click="importVisible = true">{{ t('app.common.import') }}</el-button>
          <el-button :icon="Download" @click="downloadTemplate">{{ t('hynDocs.demo.template') }}</el-button>
        </div>
        <hyn-table
          v-model:selected-row-keys="selectedRowKeys"
          :rows="pagedTableRows"
          :columns="tableColumns"
          :row-key="getDemoRowKey"
          selection
          :empty-text="t('hynDocs.table.live.emptyText')"
          @selection-change="handleSelectionChange"
        >
          <template #status="{ row }">
            <span class="hyn-doc-status" :class="row.status === 'enabled' ? 'is-success' : 'is-muted'">
              {{ resolveStatusLabel(row.status) }}
            </span>
          </template>
        </hyn-table>
        <el-pagination v-if="tableRows.length > demoPageSize" v-model:current-page="demoPage" :page-size="demoPageSize" :total="tableRows.length" layout="total, prev, pager, next" />
        <p class="hyn-doc-muted">{{ t('hynDocs.table.live.selectedRows', { count: selectedRowCount }) }}</p>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.table.howTo.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.table.howTo.title') }}</h2>
        <p>{{ t('hynDocs.table.howTo.description') }}</p>
      </div>
      <div class="hyn-doc-two-column">
        <article class="hyn-doc-card">
          <h2>{{ t('hynDocs.table.howTo.boundaryTitle') }}</h2>
          <p>{{ t('hynDocs.table.howTo.boundaryDescription') }}</p>
        </article>
        <doc-code-block :title="t('hynDocs.table.howTo.codeTitle')" :code="t('hynDocs.table.howTo.code')" language="vue" />
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.table.aiCopy.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.table.aiCopy.title') }}</h2>
        <p>{{ t('hynDocs.table.aiCopy.description') }}</p>
      </div>
      <doc-code-block :title="t('hynDocs.table.aiCopy.codeTitle')" :code="t('hynDocs.table.aiCopy.code')" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.table.recipes.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.table.recipes.title') }}</h2>
        <p>{{ t('hynDocs.table.recipes.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <article v-for="recipe in tableRecipes" :key="recipe.title" class="hyn-doc-card">
          <div class="hyn-doc-tag-row">
            <span class="hyn-doc-tag">{{ recipe.kind }}</span>
            <span class="hyn-doc-tag" :class="recipe.tagClass">{{ recipe.focus }}</span>
          </div>
          <h2>{{ recipe.title }}</h2>
          <p>{{ recipe.description }}</p>
          <doc-code-block :title="recipe.title" :code="recipe.code" />
        </article>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.table.reference.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.table.reference.title') }}</h2>
        <p>{{ t('hynDocs.table.reference.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.table.reference.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.table.reference.columns.field') }}</span>
          <span>{{ t('hynDocs.table.reference.columns.type') }}</span>
          <span>{{ t('hynDocs.table.reference.columns.description') }}</span>
        </div>
        <div v-for="item in tableApiRows" :key="item.name" class="hyn-doc-api-table__row" role="row">
          <code>{{ item.name }}</code>
          <span>{{ item.type }}</span>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.table.visual.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.table.visual.title') }}</h2>
        <p>{{ t('hynDocs.table.visual.description') }}</p>
      </div>
      <div class="hyn-doc-grid">
        <article v-for="item in visualRules" :key="item.title" class="hyn-doc-card">
          <span class="hyn-doc-kicker">{{ item.kind }}</span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.table.rules.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.table.rules.title') }}</h2>
        <p>{{ t('hynDocs.table.rules.description') }}</p>
      </div>
      <div class="hyn-doc-two-column">
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-mint">{{ t('hynDocs.table.rules.doTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in ruleDoItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-danger">{{ t('hynDocs.table.rules.dontTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in ruleDontItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <hyn-dialog v-model="importVisible" :title="t('hynDocs.demo.importTitle')" :model="importModel" :fields="importFields" :columns="1" @submit="importRows" @cancel="importVisible = false" @closed="resetImport">
      <template #importNote><p>{{ t('hynDocs.demo.importTip') }}</p><p v-if="importError" role="alert">{{ importError }}</p></template>
    </hyn-dialog>
    <p class="hyn-doc-muted">{{ t('hynDocs.demo.session') }}</p>
    <hyn-dialog v-if="editModel" v-model="editVisible" :title="t('app.common.edit')" :model="editModel" :fields="editFields" @submit="saveEdit" @cancel="editVisible = false" />
  </div>
</template>

<script setup name="HynTableDoc" lang="ts">
import type { HynTableColumn, HynTableKey, HynTableSelectionChange } from '@7mrlan/hyn-ui/types';
import { Delete, Edit, Upload, Download } from '@element-plus/icons-vue';
import { useAppI18n } from '@/utils/i18n';
import DocCodeBlock from '../DocCodeBlock.vue';
import { useDemoRows } from '../useDemoRows';
import { downloadDemoJson } from '../download';
import modal from '@/plugins/modal';
import type { HynDialogField } from '@7mrlan/hyn-ui/types';

type DemoStatus = 'enabled' | 'disabled';

interface DemoTableRow {
  id: number;
  name: string;
  code: string;
  status: DemoStatus;
  createTime: string;
  remark: string;
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

interface VisualRule {
  kind: string;
  title: string;
  description: string;
}

interface TableRecipe {
  kind: string;
  focus: string;
  tagClass: string;
  title: string;
  description: string;
  code: string;
}

const { t } = useAppI18n();
const selectedRowKeys = ref<HynTableKey[]>([]);
const selectedRowCount = ref(0);

const metrics = computed<DocMetric[]>(() => [
  createMetric('defaultEntry'),
  createMetric('overflow'),
  createMetric('actions')
]);

/** 根据当前语言生成未修改的岗位 fixture，编辑结果由独立会话状态合并。 */
const initialTableRows = computed<DemoTableRow[]>(() => [
  {
    id: 1,
    name: t('hynDocs.table.live.rows.standard.name'),
    code: 'POST_ADMIN',
    status: 'enabled',
    createTime: '2026-06-22 09:30:00',
    remark: t('hynDocs.table.live.rows.standard.remark')
  },
  {
    id: 2,
    name: t('hynDocs.table.live.rows.notice.name'),
    code: 'NOTICE_EDITOR',
    status: 'enabled',
    createTime: '2026-06-20 18:45:12',
    remark: t('hynDocs.table.live.rows.notice.remark')
  },
  {
    id: 3,
    name: t('hynDocs.table.live.rows.archive.name'),
    code: 'ARCHIVE_VIEWER',
    status: 'disabled',
    createTime: '2026-05-11 12:00:00',
    remark: t('hynDocs.table.live.rows.archive.remark')
  }
]);

/** 本地记录、编辑草稿和删除确认共享相同的示例数据生命周期。 */
const { rows: tableRows, editModel, editVisible, openEdit, saveEdit, deleteRows, upsertRows } = useDemoRows<DemoTableRow>(initialTableRows);
/** 普通表格只渲染当前页，避免合法的大文件导入绕过 HynTable 的分页使用边界。 */
const demoPage = ref<number>(1);
/** 示例固定页容量，导入上限不等于一次创建的 DOM 行数。 */
const demoPageSize: number = 10;
/** 仅把当前页传入普通表格，完整会话数据仍用于导入合并和总数统计。 */
const pagedTableRows = computed<DemoTableRow[]>(() => tableRows.value.slice((demoPage.value - 1) * demoPageSize, demoPage.value * demoPageSize));

const tableColumns = computed<HynTableColumn<DemoTableRow>[]>(() => [
  { key: 'id', label: t('hynDocs.table.live.fields.id'), prop: 'id', width: 90 },
  { key: 'name', label: t('hynDocs.table.live.fields.name'), prop: 'name', minWidth: 160 },
  { key: 'code', label: t('hynDocs.table.live.fields.code'), prop: 'code', minWidth: 150 },
  { key: 'status', label: t('hynDocs.table.live.fields.status'), prop: 'status', width: 100, slot: 'status' },
  { key: 'createTime', label: t('hynDocs.table.live.fields.createTime'), prop: 'createTime', type: 'date' },
  { key: 'remark', label: t('hynDocs.table.live.fields.remark'), prop: 'remark', minWidth: 240 },
  {
    key: 'action',
    label: t('hynDocs.table.live.fields.action'),
    align: 'center',
    fixed: 'right',
    actions: [
      { key: 'edit', label: t('hynDocs.table.live.actions.edit'), icon: Edit, permissions: ['system:post:edit'], onClick: openEdit },
      {
        key: 'delete',
        label: t('hynDocs.table.live.actions.delete'),
        icon: Delete,
        type: 'danger',
        disabled: row => row.status === 'disabled',
        permissions: ['system:post:remove'],
        onClick: removeRow
      }
    ]
  }
]);

const tableApiRows = computed<DocApiRow[]>(() => [
  { name: 'rows', type: 'TRow[]', description: t('hynDocs.table.reference.rows.rows') },
  { name: 'columns', type: 'HynTableColumn<TRow>[]', description: t('hynDocs.table.reference.rows.columns') },
  { name: 'rowKey', type: '(row) => string | number', description: t('hynDocs.table.reference.rows.rowKey') },
  { name: 'selectedRowKeys', type: 'string[] | number[]', description: t('hynDocs.table.reference.rows.selectedRowKeys') },
  { name: 'showSelection / selection', type: 'boolean', description: t('hynDocs.table.reference.rows.selection') },
  { name: 'currentRowKey', type: 'string | number | null', description: t('hynDocs.table.reference.rows.currentRowKey') },
  { name: 'height', type: 'string | number', description: t('hynDocs.table.reference.rows.height') },
  { name: 'maxHeight', type: 'string | number', description: t('hynDocs.table.reference.rows.maxHeight') },
  { name: 'defaultSort', type: "{ prop: string; order: 'ascending' | 'descending' | null }", description: t('hynDocs.table.reference.rows.defaultSort') },
  { name: 'columns[].type', type: "'text' | 'date' | 'index' | 'actions'", description: t('hynDocs.table.reference.rows.columnType') },
  { name: 'columns[].sortable', type: "boolean | 'custom'", description: t('hynDocs.table.reference.rows.sortable') },
  { name: 'columns[].sortOrders', type: 'HynTableSortOrder[]', description: t('hynDocs.table.reference.rows.sortOrders') },
  { name: 'columns[].overflowMode', type: "'fit' | 'ellipsis' | 'wrap'", description: t('hynDocs.table.reference.rows.overflowMode') },
  { name: 'actions', type: 'HynTableAction<TRow>[]', description: t('hynDocs.table.reference.rows.actions') }
]);

const visualRules = computed<VisualRule[]>(() => [
  createVisualRule('row'),
  createVisualRule('overflow'),
  createVisualRule('actions'),
  createVisualRule('fixed'),
  createVisualRule('empty'),
  createVisualRule('slot')
]);

const tableRecipes = computed<TableRecipe[]>(() => [
  createRecipe('text', 'is-mint'),
  createRecipe('date', 'is-mint'),
  createRecipe('slot', ''),
  createRecipe('actions', 'is-amber'),
  createRecipe('sort', ''),
  createRecipe('selection', 'is-mint'),
  createRecipe('fixed', ''),
  createRecipe('height', '')
]);

const ruleDoItems = computed<string[]>(() => [
  t('hynDocs.table.rules.doItems.overflow'),
  t('hynDocs.table.rules.doItems.date'),
  t('hynDocs.table.rules.doItems.actions'),
  t('hynDocs.table.rules.doItems.slot')
]);

const ruleDontItems = computed<string[]>(() => [
  t('hynDocs.table.rules.dontItems.rawTable'),
  t('hynDocs.table.rules.dontItems.deepStyles'),
  t('hynDocs.table.rules.dontItems.largeLogs'),
  t('hynDocs.table.rules.dontItems.slotVisual')
]);

const getDemoRowKey = (row: DemoTableRow): HynTableKey => {
  return row.id;
};

/** 返回示例状态的当前语言展示文案。 */
function resolveStatusLabel(status: DemoStatus): string {
  return t(`hynDocs.table.live.status.${status}`);
}

/** 按语言包 key 创建顶部指标卡片。 */
function createMetric(metricKey: string): DocMetric {
  return {
    label: t(`hynDocs.table.metrics.${metricKey}.label`),
    value: t(`hynDocs.table.metrics.${metricKey}.value`),
    note: t(`hynDocs.table.metrics.${metricKey}.note`)
  };
}

/** 按语言包 key 创建视觉契约卡片。 */
function createVisualRule(ruleKey: string): VisualRule {
  return {
    kind: t(`hynDocs.table.visual.items.${ruleKey}.kind`),
    title: t(`hynDocs.table.visual.items.${ruleKey}.title`),
    description: t(`hynDocs.table.visual.items.${ruleKey}.description`)
  };
}

/** 按语言包 key 创建列配置 recipe。 */
function createRecipe(recipeKey: string, tagClass: string): TableRecipe {
  return {
    kind: t(`hynDocs.table.recipes.items.${recipeKey}.kind`),
    focus: t(`hynDocs.table.recipes.items.${recipeKey}.focus`),
    tagClass,
    title: t(`hynDocs.table.recipes.items.${recipeKey}.title`),
    description: t(`hynDocs.table.recipes.items.${recipeKey}.description`),
    code: t(`hynDocs.table.recipes.items.${recipeKey}.code`)
  };
}

/** 同步文档示例选择数量，验证 v-model:selected-row-keys 与 selection-change 闭环。 */
function handleSelectionChange(payload: HynTableSelectionChange<DemoTableRow>): void {
  selectedRowCount.value = payload.selectedRowKeys.length;
}

/** 编辑字段只覆盖当前行的可变业务内容，编号和树归属保持稳定。 */
const editFields = computed<HynDialogField<DemoTableRow>[]>(() => [
  { key: 'name', prop: 'name', label: t('hynDocs.table.live.fields.name'), type: 'input', required: true },
  { key: 'code', prop: 'code', label: t('hynDocs.table.live.fields.code'), type: 'input', required: true },
  { key: 'remark', prop: 'remark', label: t('hynDocs.table.live.fields.remark'), type: 'textarea' }
]);

/** 文件只保留在浏览器内，提交后才校验并合并到本页示例数据。 */
const importVisible = ref<boolean>(false);
const importModel = reactive<{ file?: File }>({ file: undefined });
const importError = ref<string>('');
/** 弹窗关闭即作废进行中的读取，避免取消后异步结果仍写入示例表格。 */
let importReadVersion: number = 0;

watch(importVisible, visible => {
  if (!visible) { importReadVersion += 1; }
}, { flush: 'sync' });
const importFields = computed<HynDialogField<{ file?: File }>[]>(() => [
  { key: 'note', type: 'slot', slot: 'importNote', label: '' },
  { key: 'file', prop: 'file', type: 'filePicker', label: t('hynDocs.demo.file'), fileType: ['json'], fileSize: 1, drag: true, required: true }
]);

/** 模板直接采用当前 fixture 的完整字段契约，下载不需要服务器。 */
function downloadTemplate(): void {
  downloadDemoJson('hyn-table-template.json', initialTableRows.value);
}

/** 模板采用无时区的本地日期格式；拒绝日期溢出和 Date.parse 的宽松归一化。 */
function isValidImportDateTime(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) { return false; }
  const date = new Date(`${value.replace(' ', 'T')}Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 19).replace('T', ' ') === value;
}

/** 严格校验完整文件后再写入；数组或对象不能借助字符串转换冒充状态枚举。 */
function parseImportedRows(text: string): DemoTableRow[] {
  const value: unknown = JSON.parse(text);
  if (!Array.isArray(value) || value.length === 0 || value.length > 5000) {
    throw new TypeError(t('hynDocs.demo.invalidFile'));
  }
  const ids = new Set<number>();
  return value.map((item: unknown): DemoTableRow => {
    if (!item || typeof item !== 'object') {
      throw new TypeError(t('hynDocs.demo.invalidFile'));
    }
    const row = item as Record<string, unknown>;
    if (typeof row.id !== 'number' || !Number.isSafeInteger(row.id) || row.id <= 0 || ids.has(row.id)
      || typeof row.name !== 'string' || !row.name.trim() || typeof row.code !== 'string' || !row.code.trim()
      || (row.status !== 'enabled' && row.status !== 'disabled') || typeof row.createTime !== 'string'
      || !isValidImportDateTime(row.createTime) || typeof row.remark !== 'string') {
      throw new TypeError(t('hynDocs.demo.invalidFile'));
    }
    ids.add(row.id);
    return { id: row.id, name: row.name, code: row.code, status: row.status, createTime: row.createTime, remark: row.remark };
  });
}

/** 文件读写错误继续上抛；格式错误留在弹窗内，保证用户能修正后重新导入。 */
async function importRows(): Promise<void> {
  if (!importModel.file) {
    importError.value = t('hynDocs.demo.chooseFile');
    return;
  }
  const file: File = importModel.file;
  const version: number = ++importReadVersion;
  let text: string;
  try {
    text = await file.text();
  } catch (error: unknown) {
    if (version === importReadVersion && importVisible.value) {
      importError.value = t('hynDocs.demo.fileReadFailed', { name: file.name });
    }
    throw error;
  }
  if (version !== importReadVersion || !importVisible.value) { return; }
  try {
    const incoming = parseImportedRows(text);
    upsertRows(incoming);
    demoPage.value = Math.floor(tableRows.value.findIndex(row => row.id === incoming[0].id) / demoPageSize) + 1;
    importVisible.value = false;
    modal.msgSuccess(t('hynDocs.demo.imported', { count: incoming.length }));
  } catch (error: unknown) {
    if (!(error instanceof SyntaxError || error instanceof TypeError)) { throw error; }
    importError.value = t('hynDocs.demo.invalidFile');
  }
}

/** 删除成功才同步勾选集合，取消确认保留原选择。 */
async function removeRow(row: DemoTableRow): Promise<void> {
  if (await deleteRows([row.id])) {
    selectedRowKeys.value = selectedRowKeys.value.filter(key => key !== row.id);
    selectedRowCount.value = selectedRowKeys.value.length;
    demoPage.value = Math.min(demoPage.value, Math.max(1, Math.ceil(tableRows.value.length / demoPageSize)));
  }
}

/** 关闭后释放 File 引用，避免下一次误用上次的文件或错误。 */
function resetImport(): void {
  importModel.file = undefined;
  importError.value = '';
}
</script>
