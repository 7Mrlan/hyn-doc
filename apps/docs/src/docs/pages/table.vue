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
        <hyn-table
          v-model:selected-row-keys="selectedRowKeys"
          :rows="tableRows"
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
  </div>
</template>

<script setup name="HynTableDoc" lang="ts">
import type { HynTableColumn, HynTableKey, HynTableSelectionChange } from '@7mrlan/hyn-ui/types';
import { Delete, Edit } from '@element-plus/icons-vue';
import { useAppI18n } from '@/utils/i18n';
import DocCodeBlock from '../DocCodeBlock.vue';

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

const tableRows = computed<DemoTableRow[]>(() => [
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
      { key: 'edit', label: t('hynDocs.table.live.actions.edit'), icon: Edit, permissions: ['system:post:edit'], onClick: row => handleDemoAction(row) },
      {
        key: 'delete',
        label: t('hynDocs.table.live.actions.delete'),
        icon: Delete,
        type: 'danger',
        disabled: row => row.status === 'disabled',
        permissions: ['system:post:remove'],
        onClick: row => handleDemoAction(row)
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

/** 文档示例只保留点击闭环，真实业务页在 onClick 中调用弹窗或接口。 */
function handleDemoAction(_row: DemoTableRow): void {}
</script>
