<template>
  <div class="hyn-doc-page">
    <header class="hyn-doc-hero">
      <div>
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTreeTable.hero.kicker') }}</span>
        <h1>{{ t('hynDocs.virtualTreeTable.hero.title') }}</h1>
        <p>{{ t('hynDocs.virtualTreeTable.hero.description') }}</p>
        <div class="hyn-doc-pill-row">
          <span>{{ t('hynDocs.virtualTreeTable.hero.pills.virtualScroll') }}</span>
          <span>{{ t('hynDocs.virtualTreeTable.hero.pills.treeIndex') }}</span>
          <span>{{ t('hynDocs.virtualTreeTable.hero.pills.lazyLoading') }}</span>
          <span>{{ t('hynDocs.virtualTreeTable.hero.pills.innerScroll') }}</span>
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
          <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTreeTable.live.kicker') }}</span>
          <h2 data-doc-heading>{{ t('hynDocs.virtualTreeTable.live.title') }}</h2>
          <p>{{ t('hynDocs.virtualTreeTable.live.description') }}</p>
          <p class="hyn-doc-muted">{{ t('hynDocs.virtualTreeTable.live.selectedCount', { count: selectedTreeRowCount }) }}</p>
        </div>
        <el-button type="primary" plain :loading="expanding" @click="handleToggleTreeRows">{{ expandToggleText }}</el-button>
      </div>
      <div class="hyn-doc-demo-frame is-virtual-table-demo">
        <hyn-virtual-tree-table
          v-model:selected-row-keys="selectedTreeRowKeys"
          :rows="visibleRows"
          :columns="treeColumns"
          :busy="expanding"
          :busy-text="expandBusyText"
          :progress="expandProgress"
          :row-disabled="isDemoTreeRowDisabled"
          selection
          :empty-text="t('hynDocs.virtualTreeTable.live.emptyText')"
          @selection-change="handleTreeSelectionChange"
          @toggle-row="toggleRow"
        >
          <template #status="{ row }">
            <span class="hyn-doc-status" :class="row.status === 'enabled' ? 'is-success' : 'is-muted'">{{ row.statusLabel }}</span>
          </template>
        </hyn-virtual-tree-table>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTreeTable.howTo.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.virtualTreeTable.howTo.title') }}</h2>
        <p>{{ t('hynDocs.virtualTreeTable.howTo.description') }}</p>
      </div>
      <div class="hyn-doc-two-column">
        <article class="hyn-doc-card">
          <h2>{{ t('hynDocs.virtualTreeTable.howTo.templateTitle') }}</h2>
          <p>{{ t('hynDocs.virtualTreeTable.howTo.templateDescription') }}</p>
        </article>
        <doc-code-block :title="t('hynDocs.virtualTreeTable.howTo.templateCodeTitle')" :code="treeTemplateExample" language="vue" />
      </div>
      <div class="hyn-doc-two-column">
        <article class="hyn-doc-card">
          <h2>{{ t('hynDocs.virtualTreeTable.howTo.hookTitle') }}</h2>
          <p>{{ t('hynDocs.virtualTreeTable.howTo.hookDescription') }}</p>
        </article>
        <doc-code-block :title="t('hynDocs.virtualTreeTable.howTo.hookCodeTitle')" :code="treeHookExample" language="typescript" />
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTreeTable.aiCopy.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.virtualTreeTable.aiCopy.title') }}</h2>
        <p>{{ t('hynDocs.virtualTreeTable.aiCopy.description') }}</p>
      </div>
      <doc-code-block :title="t('hynDocs.virtualTreeTable.aiCopy.codeTitle')" :code="aiTreeExample" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTreeTable.reference.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.virtualTreeTable.reference.title') }}</h2>
        <p>{{ t('hynDocs.virtualTreeTable.reference.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.virtualTreeTable.reference.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.virtualTreeTable.reference.columns.field') }}</span>
          <span>{{ t('hynDocs.virtualTreeTable.reference.columns.type') }}</span>
          <span>{{ t('hynDocs.virtualTreeTable.reference.columns.description') }}</span>
        </div>
        <div v-for="item in treeApiRows" :key="item.name" class="hyn-doc-api-table__row" role="row">
          <code>{{ item.name }}</code>
          <span>{{ item.type }}</span>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTreeTable.visual.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.virtualTreeTable.visual.title') }}</h2>
        <p>{{ t('hynDocs.virtualTreeTable.visual.description') }}</p>
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
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTreeTable.lazy.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.virtualTreeTable.lazy.title') }}</h2>
        <p>{{ t('hynDocs.virtualTreeTable.lazy.description') }}</p>
      </div>
      <div class="hyn-doc-two-column">
        <article class="hyn-doc-card">
          <h2>{{ t('hynDocs.virtualTreeTable.lazy.conditionsTitle') }}</h2>
          <p>{{ t('hynDocs.virtualTreeTable.lazy.conditionsDescription') }}</p>
          <div class="hyn-doc-pill-row">
            <span>hasChildren</span>
            <span>childCount</span>
            <span>leaf === false</span>
            <span>isParent</span>
          </div>
        </article>
        <doc-code-block :title="t('hynDocs.virtualTreeTable.lazy.codeTitle')" :code="lazyExample" language="typescript" />
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.virtualTreeTable.lazy.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.virtualTreeTable.reference.columns.field') }}</span>
          <span>{{ t('hynDocs.virtualTreeTable.reference.columns.type') }}</span>
          <span>{{ t('hynDocs.virtualTreeTable.reference.columns.description') }}</span>
        </div>
        <div v-for="item in lazyApiRows" :key="item.name" class="hyn-doc-api-table__row" role="row">
          <code>{{ item.name }}</code>
          <span>{{ item.type }}</span>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTreeTable.backend.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.virtualTreeTable.backend.title') }}</h2>
        <p>{{ t('hynDocs.virtualTreeTable.backend.description') }}</p>
      </div>
      <div class="hyn-doc-two-column is-even">
        <article>
          <h3>{{ t('hynDocs.virtualTreeTable.backend.fullTitle') }}</h3>
          <p class="hyn-doc-muted">{{ t('hynDocs.virtualTreeTable.backend.fullDescription') }}</p>
          <doc-code-block :title="t('hynDocs.virtualTreeTable.backend.fullCodeTitle')" :code="fullBackendExample" language="json" />
        </article>
        <article>
          <h3>{{ t('hynDocs.virtualTreeTable.backend.lazyTitle') }}</h3>
          <p class="hyn-doc-muted">{{ t('hynDocs.virtualTreeTable.backend.lazyDescription') }}</p>
          <doc-code-block :title="t('hynDocs.virtualTreeTable.backend.lazyCodeTitle')" :code="lazyBackendExample" language="json" />
        </article>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.virtualTreeTable.rules.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.virtualTreeTable.rules.title') }}</h2>
        <p>{{ t('hynDocs.virtualTreeTable.rules.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-mint">{{ t('hynDocs.virtualTreeTable.rules.doTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in ruleDoItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-danger">{{ t('hynDocs.virtualTreeTable.rules.dontTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in ruleDontItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup name="HynVirtualTreeTableDoc" lang="ts">
import type {
  HynVirtualTreeTableColumn,
  HynVirtualTreeTableKey,
  HynVirtualTreeTableSelectionChange
} from '@7mrlan/hyn-ui/types';
import { useHynVirtualTreeTable } from '@7mrlan/hyn-ui/composables/useHynVirtualTreeTable';
import { Delete, Edit, Plus } from '@element-plus/icons-vue';
import { useAppI18n } from '@/utils/i18n';
import DocCodeBlock from '../DocCodeBlock.vue';

type DemoTreeStatus = 'enabled' | 'disabled';

interface DemoTreeRow {
  id: number;
  parentId: number;
  name: string;
  owner: string;
  status: DemoTreeStatus;
  statusLabel: string;
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

interface DocVisualRule {
  kind: string;
  title: string;
  description: string;
}

const { t, locale } = useAppI18n();

const treeRows = ref<DemoTreeRow[]>(createDemoTreeRows());
const selectedTreeRowKeys = ref<HynVirtualTreeTableKey[]>([]);
const selectedTreeRowCount = computed(() => selectedTreeRowKeys.value.length);

const metrics = computed<DocMetric[]>(() => [
  {
    label: t('hynDocs.virtualTreeTable.metrics.realDom.label'),
    value: t('hynDocs.virtualTreeTable.metrics.realDom.value'),
    note: t('hynDocs.virtualTreeTable.metrics.realDom.note')
  },
  {
    label: t('hynDocs.virtualTreeTable.metrics.expansionState.label'),
    value: t('hynDocs.virtualTreeTable.metrics.expansionState.value'),
    note: t('hynDocs.virtualTreeTable.metrics.expansionState.note')
  },
  {
    label: t('hynDocs.virtualTreeTable.metrics.dataMode.label'),
    value: t('hynDocs.virtualTreeTable.metrics.dataMode.value'),
    note: t('hynDocs.virtualTreeTable.metrics.dataMode.note')
  }
]);

const treeColumns = computed<HynVirtualTreeTableColumn<DemoTreeRow>[]>(() => [
  { key: 'name', title: t('hynDocs.virtualTreeTable.live.columns.name'), field: 'name', minWidth: 260, tree: true },
  { key: 'owner', title: t('hynDocs.virtualTreeTable.live.columns.owner'), field: 'owner', width: 160, align: 'center' },
  { key: 'status', title: t('app.common.status'), field: 'statusLabel', width: 120, align: 'center', slot: 'status' },
  {
    key: 'action',
    title: t('app.common.action'),
    align: 'center',
    sticky: 'right',
    actions: [
      { key: 'edit', label: t('app.common.edit'), icon: Edit, permissions: ['system:dept:edit'], onClick: row => handleDemoAction(row) },
      { key: 'add', label: t('app.common.add'), icon: Plus, permissions: ['system:dept:add'], onClick: row => handleDemoAction(row) },
      {
        key: 'delete',
        label: t('app.common.delete'),
        icon: Delete,
        type: 'danger',
        permissions: ['system:dept:remove'],
        onClick: row => handleDemoAction(row)
      }
    ]
  }
]);

const {
  expanding,
  expandProgress,
  visibleRows,
  rootLevelExpanded,
  expandBusyText,
  setRows,
  toggleRow,
  toggleRootLevel
} = useHynVirtualTreeTable<DemoTreeRow>(treeRows, {
  getRowKey: row => row.id,
  getParentKey: row => row.parentId,
  batchSize: 16
});

const treeApiRows = computed<DocApiRow[]>(() => [
  { name: 'rows', type: 'HynVirtualTreeTableRow[]', description: t('hynDocs.virtualTreeTable.reference.rows.rows') },
  { name: 'columns', type: 'HynVirtualTreeTableColumn[]', description: t('hynDocs.virtualTreeTable.reference.rows.columns') },
  { name: 'columns[].actions', type: 'HynTableAction[]', description: t('hynDocs.virtualTreeTable.reference.rows.actions') },
  { name: 'columns[].width/minWidth', type: 'number', description: t('hynDocs.virtualTreeTable.reference.rows.width') },
  { name: 'loading', type: 'boolean', description: t('hynDocs.virtualTreeTable.reference.rows.loading') },
  { name: 'busy', type: 'boolean', description: t('hynDocs.virtualTreeTable.reference.rows.busy') },
  { name: 'busyText', type: 'string', description: t('hynDocs.virtualTreeTable.reference.rows.busyText') },
  { name: 'progress', type: 'number', description: t('hynDocs.virtualTreeTable.reference.rows.progress') },
  { name: 'visibleRowCount', type: 'number', description: t('hynDocs.virtualTreeTable.reference.rows.visibleRowCount') },
  { name: 'height', type: 'string | number', description: t('hynDocs.virtualTreeTable.reference.rows.height') },
  { name: 'rowHeight', type: 'number', description: t('hynDocs.virtualTreeTable.reference.rows.rowHeight') },
  { name: 'overscan', type: 'number', description: t('hynDocs.virtualTreeTable.reference.rows.overscan') },
  { name: 'selectedRowKeys', type: 'string[] | number[]', description: t('hynDocs.virtualTreeTable.reference.rows.selectedRowKeys') },
  { name: 'selection / multiple', type: 'boolean', description: t('hynDocs.virtualTreeTable.reference.rows.selection') },
  { name: 'rowDisabled', type: '(row) => boolean', description: t('hynDocs.virtualTreeTable.reference.rows.rowDisabled') },
  { name: 'selection-change', type: 'event', description: t('hynDocs.virtualTreeTable.reference.rows.selectionChange') },
  { name: 'select-all-change', type: 'event', description: t('hynDocs.virtualTreeTable.reference.rows.selectAllChange') },
  { name: 'toggle-row', type: 'event', description: t('hynDocs.virtualTreeTable.reference.rows.toggleRow') }
]);

const lazyApiRows = computed<DocApiRow[]>(() => [
  { name: 'lazy', type: 'object | undefined', description: t('hynDocs.virtualTreeTable.lazy.rows.lazy') },
  { name: 'lazy.hasChildren', type: '(row) => boolean', description: t('hynDocs.virtualTreeTable.lazy.rows.hasChildren') },
  { name: 'lazy.loadChildren', type: '(row) => Promise<TRow[]>', description: t('hynDocs.virtualTreeTable.lazy.rows.loadChildren') },
  { name: 'loadedKeys', type: 'Set<string>', description: t('hynDocs.virtualTreeTable.lazy.rows.loadedKeys') },
  { name: 'loadingKeys', type: 'Set<string>', description: t('hynDocs.virtualTreeTable.lazy.rows.loadingKeys') },
  { name: 'loadErrorByKey', type: 'Map<string, string>', description: t('hynDocs.virtualTreeTable.lazy.rows.loadErrorByKey') }
]);

const visualRules = computed<DocVisualRule[]>(() => [
  createVisualRule('rows'),
  createVisualRule('actions'),
  createVisualRule('selection'),
  createVisualRule('fixed'),
  createVisualRule('tooltip')
]);

const ruleDoItems = computed(() => [
  t('hynDocs.virtualTreeTable.rules.doItems.hook'),
  t('hynDocs.virtualTreeTable.rules.doItems.treeColumn'),
  t('hynDocs.virtualTreeTable.rules.doItems.selectionKeys'),
  t('hynDocs.virtualTreeTable.rules.doItems.lazyState'),
  t('hynDocs.virtualTreeTable.rules.doItems.actions')
]);

const ruleDontItems = computed(() => [
  t('hynDocs.virtualTreeTable.rules.dontItems.rawTreeTable'),
  t('hynDocs.virtualTreeTable.rules.dontItems.indexKey'),
  t('hynDocs.virtualTreeTable.rules.dontItems.selectionColumn'),
  t('hynDocs.virtualTreeTable.rules.dontItems.expandThousands'),
  t('hynDocs.virtualTreeTable.rules.dontItems.swallowLazyError'),
  t('hynDocs.virtualTreeTable.rules.dontItems.guessBackendNames')
]);

const expandToggleText = computed(() =>
  rootLevelExpanded.value ? t('hynDocs.virtualTreeTable.live.collapseAll') : t('hynDocs.virtualTreeTable.live.expandRootLevel')
);

const treeTemplateExample = `<hyn-virtual-tree-table
  v-model:selected-row-keys="selectedDeptKeys"
  :rows="visibleDeptRows"
  :columns="deptTableColumns"
  :loading="loading && deptList.length === 0"
  :busy="expanding"
  :busy-text="expandBusyText"
  :progress="expandProgress"
  :visible-row-count="10"
  selection
  :multiple="false"
  :empty-text="t('app.common.noData')"
  @toggle-row="handleToggleDeptRow"
>
  <template #status="{ row }">
    <dict-tag :options="sys_normal_disable" :value="row.status" />
  </template>
</hyn-virtual-tree-table>

const deptTableColumns = computed<HynVirtualTreeTableColumn<DeptVO>[]>(() => [
  { key: 'deptName', title: t('app.systemDept.field.deptName'), field: 'deptName', minWidth: 280, tree: true },
  { key: 'status', title: t('app.common.status'), field: 'status', width: 100, align: 'center', slot: 'status' },
  {
    key: 'action',
    title: t('app.common.action'),
    align: 'center',
    sticky: 'right',
    actions: deptActions.value
  }
]);

const selectedDeptKeys = ref<HynVirtualTreeTableKey[]>([]);`;

const treeHookExample = `const deptList = ref<DeptVO[]>([]);

const {
  expanding,
  expandProgress,
  visibleRows: visibleDeptRows,
  rootLevelExpanded,
  expandBusyText,
  setRows: setDeptRows,
  toggleRow: handleToggleDeptRow,
  toggleRootLevel: handleToggleRootLevel,
  cancelPendingExpand
} = useHynVirtualTreeTable<DeptVO>(deptList, {
  getRowKey: row => row.deptId,
  getParentKey: row => row.parentId,
  batchSize: 64
});`;

const lazyExample = `const {
  visibleRows: visibleDeptRows,
  toggleRow: handleToggleDeptRow
} = useHynVirtualTreeTable<DeptVO>(deptList, {
  getRowKey: row => row.deptId,
  getParentKey: row => row.parentId,
  batchSize: 32,
  lazy: {
    hasChildren: row => row.hasChildren === true,
    loadChildren: async row => {
      const res = await listDeptChildren(row.deptId);
      return res.data;
    }
  }
});`;

const aiTreeExample = `<hyn-virtual-tree-table
  v-model:selected-row-keys="selectedDeptKeys"
  :rows="visibleDeptRows"
  :columns="deptTableColumns"
  :loading="loading && deptList.length === 0"
  :busy="expanding"
  :busy-text="expandBusyText"
  :progress="expandProgress"
  :visible-row-count="10"
  selection
  :multiple="false"
  :empty-text="t('app.common.noData')"
  @toggle-row="handleToggleDeptRow"
>
  <template #status="{ row }">
    <dict-tag :options="sys_normal_disable" :value="row.status" />
  </template>
</hyn-virtual-tree-table>

const {
  expanding,
  expandProgress,
  visibleRows: visibleDeptRows,
  rootLevelExpanded,
  expandBusyText,
  setRows: setDeptRows,
  toggleRow: handleToggleDeptRow,
  toggleRootLevel: handleToggleRootLevel,
  cancelPendingExpand
} = useHynVirtualTreeTable<DeptVO>(deptList, {
  getRowKey: row => row.deptId,
  getParentKey: row => row.parentId,
  batchSize: 64
});

const deptTableColumns = computed<HynVirtualTreeTableColumn<DeptVO>[]>(() => [
  { key: 'deptName', title: t('app.systemDept.field.deptName'), field: 'deptName', minWidth: 280, tree: true },
  { key: 'orderNum', title: t('app.systemDept.field.orderNum'), field: 'orderNum', width: 100, align: 'center' },
  { key: 'status', title: t('app.common.status'), field: 'status', width: 100, align: 'center', slot: 'status' },
  { key: 'action', title: t('app.common.action'), sticky: 'right', align: 'center', actions: deptActions.value }
]);

const selectedDeptKeys = ref<HynVirtualTreeTableKey[]>([]);`;

const fullBackendExample = `[
  {
    "deptId": 100,
    "parentId": 0,
    "deptNameKey": "department.root",
    "orderNum": 1,
    "status": "0"
  },
  {
    "deptId": 101,
    "parentId": 100,
    "deptNameKey": "department.rd",
    "orderNum": 1,
    "status": "0"
  }
]`;

const lazyBackendExample = `[
  {
    "deptId": 101,
    "parentId": 100,
    "deptNameKey": "department.rd",
    "hasChildren": true
  },
  {
    "deptId": 102,
    "parentId": 100,
    "deptNameKey": "department.delivery",
    "hasChildren": false
  }
]`;

watch(locale, () => {
  setRows(createDemoTreeRows());
});

function createVisualRule(key: string): DocVisualRule {
  return {
    kind: t(`hynDocs.virtualTreeTable.visual.items.${key}.kind`),
    title: t(`hynDocs.virtualTreeTable.visual.items.${key}.title`),
    description: t(`hynDocs.virtualTreeTable.visual.items.${key}.description`)
  };
}

/** 生成本地文档示例树；真实部门/组织名称只能由后端 key 或 localized 字段驱动。 */
function createDemoTreeRows(): DemoTreeRow[] {
  return [
    createDemoTreeRow(1, 0, 'root', 'platform', 'enabled'),
    createDemoTreeRow(11, 1, 'rdCenter', 'frontend', 'enabled'),
    createDemoTreeRow(12, 1, 'deliveryCenter', 'delivery', 'enabled'),
    createDemoTreeRow(111, 11, 'componentPlatform', 'experience', 'enabled'),
    createDemoTreeRow(112, 11, 'performanceGovernance', 'architecture', 'enabled'),
    createDemoTreeRow(2, 0, 'regionalOrg', 'operations', 'enabled'),
    createDemoTreeRow(21, 2, 'eastChina', 'regionOne', 'enabled'),
    createDemoTreeRow(22, 2, 'archive', 'data', 'disabled')
  ];
}

/** 按稳定示例 key 生成单行树节点，避免在代码里保留可见中文实体名。 */
function createDemoTreeRow(id: number, parentId: number, nameKey: string, ownerKey: string, status: DemoTreeStatus): DemoTreeRow {
  return {
    id,
    parentId,
    name: t(`hynDocs.virtualTreeTable.live.rows.${nameKey}.name`),
    owner: t(`hynDocs.virtualTreeTable.live.owners.${ownerKey}`),
    status,
    statusLabel: t(status === 'enabled' ? 'hynDocs.virtualTreeTable.live.status.enabled' : 'hynDocs.virtualTreeTable.live.status.disabled')
  };
}

function handleToggleTreeRows(): void {
  void toggleRootLevel();
}

/** 文档示例中停用节点不可选，验证选择框禁用态和表头批量选择边界。 */
function isDemoTreeRowDisabled(row: DemoTreeRow): boolean {
  return row.status === 'disabled';
}

/** 文档示例保留事件闭环，业务页可在这里同步按钮禁用态或统计信息。 */
function handleTreeSelectionChange(payload: HynVirtualTreeTableSelectionChange<DemoTreeRow>): void {
  void payload;
}

/** 文档演示操作只保留点击闭环，真实业务页在 onClick 中调用弹窗或接口。 */
function handleDemoAction(_row: DemoTreeRow): void {}
</script>
