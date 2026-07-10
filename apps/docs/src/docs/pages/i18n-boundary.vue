<template>
  <div class="hyn-doc-page">
    <header class="hyn-doc-hero">
      <div>
        <span class="hyn-doc-kicker">{{ t('hynDocs.i18nBoundary.hero.kicker') }}</span>
        <h1>{{ t('hynDocs.i18nBoundary.hero.title') }}</h1>
        <p>{{ t('hynDocs.i18nBoundary.hero.description') }}</p>
        <div class="hyn-doc-pill-row">
          <span>{{ t('hynDocs.i18nBoundary.hero.pills.fixedUi') }}</span>
          <span>{{ t('hynDocs.i18nBoundary.hero.pills.backendContract') }}</span>
          <span>{{ t('hynDocs.i18nBoundary.hero.pills.audit') }}</span>
        </div>
      </div>
    </header>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.i18nBoundary.ownership.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.i18nBoundary.ownership.title') }}</h2>
        <p>{{ t('hynDocs.i18nBoundary.ownership.description') }}</p>
      </div>
      <div class="hyn-doc-grid">
        <article v-for="item in ownershipCards" :key="item.title" class="hyn-doc-card">
          <span class="hyn-doc-kicker">{{ item.kind }}</span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.i18nBoundary.matrix.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.i18nBoundary.matrix.title') }}</h2>
        <p>{{ t('hynDocs.i18nBoundary.matrix.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.i18nBoundary.matrix.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.i18nBoundary.matrix.columns.scene') }}</span>
          <span>{{ t('hynDocs.i18nBoundary.matrix.columns.frontend') }}</span>
          <span>{{ t('hynDocs.i18nBoundary.matrix.columns.backend') }}</span>
        </div>
        <div v-for="item in matrixRows" :key="item.scene" class="hyn-doc-api-table__row" role="row">
          <code>{{ item.scene }}</code>
          <span>{{ item.frontend }}</span>
          <p>{{ item.backend }}</p>
        </div>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.i18nBoundary.codeExamples.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.i18nBoundary.codeExamples.title') }}</h2>
        <p>{{ t('hynDocs.i18nBoundary.codeExamples.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <doc-code-block
          v-for="item in matrixRows"
          :key="item.codeTitle"
          :title="item.codeTitle"
          :code="item.code"
          height-mode="compact"
        />
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.i18nBoundary.aiChecklist.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.i18nBoundary.aiChecklist.title') }}</h2>
        <p>{{ t('hynDocs.i18nBoundary.aiChecklist.description') }}</p>
      </div>
      <div class="hyn-doc-two-column">
        <article class="hyn-doc-card">
          <h2>{{ t('hynDocs.i18nBoundary.aiChecklist.cardTitle') }}</h2>
          <ul class="hyn-doc-check-list">
            <li v-for="item in checklistItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <doc-code-block :title="t('hynDocs.i18nBoundary.aiChecklist.codeTitle')" :code="t('hynDocs.i18nBoundary.aiChecklist.code')" />
      </div>
    </section>
  </div>
</template>

<script setup name="HynI18nBoundaryDoc" lang="ts">
import DocCodeBlock from '../DocCodeBlock.vue';
import { useAppI18n } from '@/utils/i18n';

interface BoundaryCard {
  kind: string;
  title: string;
  description: string;
}

interface BoundaryMatrixRow {
  scene: string;
  frontend: string;
  backend: string;
  codeTitle: string;
  code: string;
}

const { t } = useAppI18n();

const codeSnippets = {
  button: `const { t } = useAppI18n();

const handleDelete = async (row: DeptVO): Promise<void> => {
  await modal.confirm(t('app.systemDept.deleteConfirm', { name: row.deptName ?? '' }));
  await delDept(row.deptId);
};

// Keep zh_CN/app.ts and en_US/app.ts aligned:
// systemDept.deleteConfirm`,
  department: `const deptTableColumns = computed<HynVirtualTreeTableColumn<DeptVO>[]>(() => [
  {
    key: 'deptName',
    title: t('app.systemDept.field.deptName'),
    field: 'deptName',
    tree: true
  }
]);

const deptTreeProps = { value: 'deptId', label: 'deptName', children: 'children' };`,
  dictionary: `const { sys_normal_disable } = toRefs(useDict('sys_normal_disable'));

const statusOptions = computed(() =>
  sys_normal_disable.value.map(dict => ({
    label: dict.label,
    value: dict.value
  }))
);`,
  backendError: `interface BusinessErrorPayload {
  message?: string;
  messageKey?: string;
}

const resolveBusinessErrorMessage = (error: BusinessErrorPayload): string => {
  if (error.messageKey) {
    return t(error.messageKey);
  }
  if (error.message) {
    return error.message;
  }
  throw new Error('Backend error response is missing message and messageKey');
};`,
  hynDocs: `const ownershipCards = computed(() => [
  {
    title: t('hynDocs.i18nBoundary.ownership.cards.fixedUi.title'),
    description: t('hynDocs.i18nBoundary.ownership.cards.fixedUi.description')
  }
]);

// HYN demos can translate local example copy; real business values still follow API contracts.`
} as const;

const ownershipCards = computed<BoundaryCard[]>(() => [
  {
    kind: t('hynDocs.i18nBoundary.ownership.cards.fixedUi.kind'),
    title: t('hynDocs.i18nBoundary.ownership.cards.fixedUi.title'),
    description: t('hynDocs.i18nBoundary.ownership.cards.fixedUi.description')
  },
  {
    kind: t('hynDocs.i18nBoundary.ownership.cards.businessData.kind'),
    title: t('hynDocs.i18nBoundary.ownership.cards.businessData.title'),
    description: t('hynDocs.i18nBoundary.ownership.cards.businessData.description')
  },
  {
    kind: t('hynDocs.i18nBoundary.ownership.cards.docsDemo.kind'),
    title: t('hynDocs.i18nBoundary.ownership.cards.docsDemo.title'),
    description: t('hynDocs.i18nBoundary.ownership.cards.docsDemo.description')
  }
]);

const matrixRows = computed<BoundaryMatrixRow[]>(() => [
  {
    scene: t('hynDocs.i18nBoundary.matrix.rows.button.scene'),
    frontend: t('hynDocs.i18nBoundary.matrix.rows.button.frontend'),
    backend: t('hynDocs.i18nBoundary.matrix.rows.button.backend'),
    codeTitle: t('hynDocs.i18nBoundary.matrix.rows.button.codeTitle'),
    code: codeSnippets.button
  },
  {
    scene: t('hynDocs.i18nBoundary.matrix.rows.department.scene'),
    frontend: t('hynDocs.i18nBoundary.matrix.rows.department.frontend'),
    backend: t('hynDocs.i18nBoundary.matrix.rows.department.backend'),
    codeTitle: t('hynDocs.i18nBoundary.matrix.rows.department.codeTitle'),
    code: codeSnippets.department
  },
  {
    scene: t('hynDocs.i18nBoundary.matrix.rows.dictionary.scene'),
    frontend: t('hynDocs.i18nBoundary.matrix.rows.dictionary.frontend'),
    backend: t('hynDocs.i18nBoundary.matrix.rows.dictionary.backend'),
    codeTitle: t('hynDocs.i18nBoundary.matrix.rows.dictionary.codeTitle'),
    code: codeSnippets.dictionary
  },
  {
    scene: t('hynDocs.i18nBoundary.matrix.rows.backendError.scene'),
    frontend: t('hynDocs.i18nBoundary.matrix.rows.backendError.frontend'),
    backend: t('hynDocs.i18nBoundary.matrix.rows.backendError.backend'),
    codeTitle: t('hynDocs.i18nBoundary.matrix.rows.backendError.codeTitle'),
    code: codeSnippets.backendError
  },
  {
    scene: t('hynDocs.i18nBoundary.matrix.rows.hynDocs.scene'),
    frontend: t('hynDocs.i18nBoundary.matrix.rows.hynDocs.frontend'),
    backend: t('hynDocs.i18nBoundary.matrix.rows.hynDocs.backend'),
    codeTitle: t('hynDocs.i18nBoundary.matrix.rows.hynDocs.codeTitle'),
    code: codeSnippets.hynDocs
  }
]);

const checklistItems = computed<string[]>(() => [
  t('hynDocs.i18nBoundary.aiChecklist.items.classifyText'),
  t('hynDocs.i18nBoundary.aiChecklist.items.addKeys'),
  t('hynDocs.i18nBoundary.aiChecklist.items.noGuessing'),
  t('hynDocs.i18nBoundary.aiChecklist.items.audit'),
  t('hynDocs.i18nBoundary.aiChecklist.items.handoff')
]);
</script>
