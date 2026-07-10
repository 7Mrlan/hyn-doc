<template>
  <div class="hyn-doc-page">
    <header class="hyn-doc-hero">
      <div>
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTable.hero.kicker') }}</span>
        <h1>{{ t('hynDocs.virtualTable.hero.title') }}</h1>
        <p>{{ t('hynDocs.virtualTable.hero.description') }}</p>
        <div class="hyn-doc-pill-row">
          <span>{{ t('hynDocs.virtualTable.hero.pills.virtualScroll') }}</span>
          <span>{{ t('hynDocs.virtualTable.hero.pills.flatLargeData') }}</span>
          <span>{{ t('hynDocs.virtualTable.hero.pills.crossPageSelection') }}</span>
          <span>{{ t('hynDocs.virtualTable.hero.pills.visualProtocol') }}</span>
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
      <div class="hyn-doc-section__heading is-row">
        <div>
          <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTable.live.kicker') }}</span>
          <h2 data-doc-heading>{{ t('hynDocs.virtualTable.live.title') }}</h2>
          <p>{{ t('hynDocs.virtualTable.live.description') }}</p>
        </div>
        <el-segmented v-model="demoSize" :options="demoSizeOptions" @change="handleDemoSizeChange" />
      </div>
      <div class="hyn-doc-demo-frame is-virtual-table-demo">
        <hyn-virtual-table
          v-model:selected-row-keys="selectedRowKeys"
          :rows="tableRows"
          :columns="tableColumns"
          :row-key="getDemoRowKey"
          selection
          :empty-text="t('hynDocs.virtualTable.live.emptyText')"
          @selection-change="handleSelectionChange"
          @select-all-change="handleSelectAllChange"
        >
          <template #status="{ row }">
            <span class="hyn-doc-status" :class="row.status === 'normal' ? 'is-success' : 'is-muted'">{{ row.statusLabel }}</span>
          </template>
        </hyn-virtual-table>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTable.howTo.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.virtualTable.howTo.title') }}</h2>
        <p>{{ t('hynDocs.virtualTable.howTo.description') }}</p>
      </div>
      <div class="hyn-doc-two-column">
        <article class="hyn-doc-card">
          <h2>{{ t('hynDocs.virtualTable.howTo.boundaryTitle') }}</h2>
          <p>{{ t('hynDocs.virtualTable.howTo.boundaryDescription') }}</p>
        </article>
        <doc-code-block :title="t('hynDocs.virtualTable.howTo.codeTitle')" :code="t('hynDocs.virtualTable.howTo.code')" language="vue" />
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTable.aiCopy.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.virtualTable.aiCopy.title') }}</h2>
        <p>{{ t('hynDocs.virtualTable.aiCopy.description') }}</p>
      </div>
      <doc-code-block :title="t('hynDocs.virtualTable.aiCopy.codeTitle')" :code="t('hynDocs.virtualTable.aiCopy.code')" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTable.recipes.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.virtualTable.recipes.title') }}</h2>
        <p>{{ t('hynDocs.virtualTable.recipes.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <article v-for="recipe in virtualRecipes" :key="recipe.title" class="hyn-doc-card">
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
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTable.reference.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.virtualTable.reference.title') }}</h2>
        <p>{{ t('hynDocs.virtualTable.reference.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.virtualTable.reference.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.virtualTable.reference.columns.field') }}</span>
          <span>{{ t('hynDocs.virtualTable.reference.columns.type') }}</span>
          <span>{{ t('hynDocs.virtualTable.reference.columns.description') }}</span>
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
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTable.rules.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.virtualTable.rules.title') }}</h2>
        <p>{{ t('hynDocs.virtualTable.rules.description') }}</p>
      </div>
      <div class="hyn-doc-two-column">
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-mint">{{ t('hynDocs.virtualTable.rules.doTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in doItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-danger">{{ t('hynDocs.virtualTable.rules.dontTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in dontItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup name="HynVirtualTableDoc" lang="ts">
import type {
  HynVirtualTableColumn,
  HynVirtualTableKey,
  HynVirtualTableSelectAllChange,
  HynVirtualTableSelectionChange
} from '@7mrlan/hyn-ui/types';
import { Delete, Edit } from '@element-plus/icons-vue';
import { useAppI18n } from '@/utils/i18n';
import DocCodeBlock from '../DocCodeBlock.vue';

type DemoVirtualStatus = 'normal' | 'disabled';

interface DemoVirtualRow {
  id: number;
  userName: string;
  roleName: string;
  status: DemoVirtualStatus;
  statusLabel: string;
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

interface VirtualRecipe {
  kind: string;
  focus: string;
  tagClass: string;
  title: string;
  description: string;
  code: string;
}

const { t } = useAppI18n();
const demoSizeOptions = [100, 1000, 5000];
const demoSize = ref(1000);
const selectedRowKeys = ref<HynVirtualTableKey[]>([]);

const metrics = computed<DocMetric[]>(() => [
  {
    label: t('hynDocs.virtualTable.metrics.rendering.label'),
    value: t('hynDocs.virtualTable.metrics.rendering.value'),
    note: t('hynDocs.virtualTable.metrics.rendering.note')
  },
  {
    label: t('hynDocs.virtualTable.metrics.rowHeight.label'),
    value: t('hynDocs.virtualTable.metrics.rowHeight.value'),
    note: t('hynDocs.virtualTable.metrics.rowHeight.note')
  },
  {
    label: t('hynDocs.virtualTable.metrics.useCase.label'),
    value: t('hynDocs.virtualTable.metrics.useCase.value'),
    note: t('hynDocs.virtualTable.metrics.useCase.note')
  }
]);

const tableRows = computed<DemoVirtualRow[]>(() => createDemoRows(Number(demoSize.value)));

const tableColumns = computed<HynVirtualTableColumn<DemoVirtualRow>[]>(() => [
  { key: 'id', title: t('hynDocs.virtualTable.live.columns.id'), field: 'id', width: 90, align: 'center' },
  { key: 'userName', title: t('hynDocs.virtualTable.live.columns.userName'), field: 'userName', minWidth: 180 },
  { key: 'roleName', title: t('hynDocs.virtualTable.live.columns.roleName'), field: 'roleName', minWidth: 180 },
  { key: 'status', title: t('hynDocs.virtualTable.live.columns.status'), field: 'statusLabel', width: 100, align: 'center', slot: 'status' },
  { key: 'remark', title: t('hynDocs.virtualTable.live.columns.remark'), field: 'remark', minWidth: 280 },
  {
    key: 'action',
    title: t('hynDocs.virtualTable.live.columns.action'),
    align: 'center',
    sticky: 'right',
    actions: [
      { key: 'edit', label: t('hynDocs.virtualTable.live.actions.edit'), icon: Edit, permissions: ['system:user:edit'], onClick: row => handleDemoAction(row) },
      { key: 'delete', label: t('hynDocs.virtualTable.live.actions.delete'), icon: Delete, type: 'danger', permissions: ['system:user:remove'], onClick: row => handleDemoAction(row) }
    ]
  }
]);

const tableApiRows = computed<DocApiRow[]>(() => [
  { name: 'rows', type: 'TRow[]', description: t('hynDocs.virtualTable.reference.rows.rows') },
  { name: 'columns', type: 'HynVirtualTableColumn<TRow>[]', description: t('hynDocs.virtualTable.reference.rows.columns') },
  { name: 'rowKey', type: '(row) => string | number', description: t('hynDocs.virtualTable.reference.rows.rowKey') },
  { name: 'visibleRowCount', type: 'number', description: t('hynDocs.virtualTable.reference.rows.visibleRowCount') },
  { name: 'height', type: 'string | number', description: t('hynDocs.virtualTable.reference.rows.height') },
  { name: 'rowHeight', type: 'number', description: t('hynDocs.virtualTable.reference.rows.rowHeight') },
  { name: 'overscan', type: 'number', description: t('hynDocs.virtualTable.reference.rows.overscan') },
  { name: 'selection / multiple', type: 'boolean', description: t('hynDocs.virtualTable.reference.rows.selection') },
  { name: 'fit', type: 'boolean', description: t('hynDocs.virtualTable.reference.rows.fit') },
  { name: 'columns[].actions', type: 'HynTableAction<TRow>[]', description: t('hynDocs.virtualTable.reference.rows.actions') }
]);

const virtualRecipes = computed<VirtualRecipe[]>(() => [
  {
    kind: t('hynDocs.virtualTable.recipes.items.rowKey.kind'),
    focus: t('hynDocs.virtualTable.recipes.items.rowKey.focus'),
    tagClass: 'is-mint',
    title: t('hynDocs.virtualTable.recipes.items.rowKey.title'),
    description: t('hynDocs.virtualTable.recipes.items.rowKey.description'),
    code: t('hynDocs.virtualTable.recipes.items.rowKey.code')
  },
  {
    kind: t('hynDocs.virtualTable.recipes.items.height.kind'),
    focus: t('hynDocs.virtualTable.recipes.items.height.focus'),
    tagClass: 'is-mint',
    title: t('hynDocs.virtualTable.recipes.items.height.title'),
    description: t('hynDocs.virtualTable.recipes.items.height.description'),
    code: t('hynDocs.virtualTable.recipes.items.height.code')
  },
  {
    kind: t('hynDocs.virtualTable.recipes.items.selection.kind'),
    focus: t('hynDocs.virtualTable.recipes.items.selection.focus'),
    tagClass: '',
    title: t('hynDocs.virtualTable.recipes.items.selection.title'),
    description: t('hynDocs.virtualTable.recipes.items.selection.description'),
    code: t('hynDocs.virtualTable.recipes.items.selection.code')
  },
  {
    kind: t('hynDocs.virtualTable.recipes.items.actions.kind'),
    focus: t('hynDocs.virtualTable.recipes.items.actions.focus'),
    tagClass: 'is-amber',
    title: t('hynDocs.virtualTable.recipes.items.actions.title'),
    description: t('hynDocs.virtualTable.recipes.items.actions.description'),
    code: t('hynDocs.virtualTable.recipes.items.actions.code')
  }
]);

const doItems = computed<string[]>(() => [
  t('hynDocs.virtualTable.rules.doItems.largeLists'),
  t('hynDocs.virtualTable.rules.doItems.rowKey'),
  t('hynDocs.virtualTable.rules.doItems.widths'),
  t('hynDocs.virtualTable.rules.doItems.measure')
]);

const dontItems = computed<string[]>(() => [
  t('hynDocs.virtualTable.rules.dontItems.pagedCrud'),
  t('hynDocs.virtualTable.rules.dontItems.nativeTableFeatures'),
  t('hynDocs.virtualTable.rules.dontItems.dynamicHeight'),
  t('hynDocs.virtualTable.rules.dontItems.customActionStyles')
]);

const getDemoRowKey = (row: DemoVirtualRow): HynVirtualTableKey => {
  return row.id;
};

/** 生成当前语言下的文档演示行，避免语言切换后保留旧语言 demo 文案。 */
function createDemoRows(size: number): DemoVirtualRow[] {
  return Array.from({ length: size }, (_, index): DemoVirtualRow => {
    const rowIndex = index + 1;
    const status = index % 9 === 0 ? 'disabled' : 'normal';
    return {
      id: rowIndex,
      userName: t('hynDocs.virtualTable.live.demoRow.userName', { index: rowIndex }),
      roleName: t(index % 3 === 0 ? 'hynDocs.virtualTable.live.demoRow.adminRole' : 'hynDocs.virtualTable.live.demoRow.userRole'),
      status,
      statusLabel: t(status === 'normal' ? 'hynDocs.virtualTable.live.demoRow.normal' : 'hynDocs.virtualTable.live.demoRow.disabled'),
      remark: t('hynDocs.virtualTable.live.demoRow.remark', { index: rowIndex })
    };
  });
}

/** 切换示例数据量后重置选择，保证演示状态稳定可复现。 */
function handleDemoSizeChange(): void {
  selectedRowKeys.value = [];
}

/** 文档示例只保留选择事件闭环，真实业务页可在这里同步按钮状态。 */
function handleSelectionChange(_payload: HynVirtualTableSelectionChange<DemoVirtualRow>): void {}

/** 文档示例只保留全选事件闭环，真实业务页可在这里同步跨页选择状态。 */
function handleSelectAllChange(_payload: HynVirtualTableSelectAllChange<DemoVirtualRow>): void {}

/** 文档示例操作不触发接口，只验证 action cell 的视觉和点击闭环。 */
function handleDemoAction(_row: DemoVirtualRow): void {}
</script>
