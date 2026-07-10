<template>
  <div class="hyn-doc-page">
    <header class="hyn-doc-hero">
      <div>
        <span class="hyn-doc-kicker">{{ t('hynDocs.home.hero.kicker') }}</span>
        <h1>{{ t('hynDocs.home.hero.title') }}</h1>
        <p>{{ t('hynDocs.home.hero.description') }}</p>
        <div class="hyn-doc-pill-row">
          <span>{{ t('hynDocs.home.hero.pills.localOnly') }}</span>
          <span>{{ t('hynDocs.home.hero.pills.aiCopyable') }}</span>
          <span>{{ t('hynDocs.home.hero.pills.typedExamples') }}</span>
          <span>{{ t('hynDocs.home.hero.pills.visualContract') }}</span>
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
        <span class="hyn-doc-kicker">{{ t('hynDocs.home.componentDocs.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.home.componentDocs.title') }}</h2>
        <p>{{ t('hynDocs.home.componentDocs.description') }}</p>
      </div>
      <div class="hyn-doc-grid">
        <router-link
          v-for="entry in docEntries"
          :key="entry.slug"
          class="hyn-doc-link-card"
          :to="`/component/hyn/${entry.slug}`"
        >
          <span class="hyn-doc-kicker">{{ t(entry.categoryKey) }}</span>
          <strong>{{ t(entry.titleKey) }}</strong>
          <p>{{ t(entry.captionKey) }}</p>
          <div class="hyn-doc-pill-row">
            <span>{{ resolveStatusLabel(entry.status) }}</span>
            <span>{{ entry.slug }}</span>
          </div>
        </router-link>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.home.decisionMatrix.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.home.decisionMatrix.title') }}</h2>
        <p>{{ t('hynDocs.home.decisionMatrix.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.home.decisionMatrix.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.home.decisionMatrix.columns.scene') }}</span>
          <span>{{ t('hynDocs.home.decisionMatrix.columns.component') }}</span>
          <span>{{ t('hynDocs.home.decisionMatrix.columns.reason') }}</span>
        </div>
        <div v-for="item in matrixRows" :key="item.scene" class="hyn-doc-api-table__row" role="row">
          <code>{{ item.scene }}</code>
          <span>{{ item.component }}</span>
          <p>{{ item.reason }}</p>
        </div>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.home.i18nBoundary.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.home.i18nBoundary.title') }}</h2>
        <p>{{ t('hynDocs.home.i18nBoundary.description') }}</p>
      </div>
      <div class="hyn-doc-grid">
        <article v-for="item in i18nBoundaryCards" :key="item.title" class="hyn-doc-card">
          <span class="hyn-doc-kicker">{{ item.kind }}</span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.home.aiCopy.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.home.aiCopy.title') }}</h2>
        <p>{{ t('hynDocs.home.aiCopy.description') }}</p>
      </div>
      <doc-code-block :title="t('hynDocs.home.aiCopy.codeTitle')" :code="t('hynDocs.home.aiCopy.code')" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.home.design.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.home.design.title') }}</h2>
        <p>{{ t('hynDocs.home.design.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-four">
        <article v-for="item in principles" :key="item.title" class="hyn-doc-card">
          <span class="hyn-doc-kicker">{{ item.kind }}</span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.home.localOnly.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.home.localOnly.title') }}</h2>
        <p>{{ t('hynDocs.home.localOnly.description') }}</p>
      </div>
      <div class="hyn-doc-two-column">
        <article class="hyn-doc-card">
          <h2>{{ t('hynDocs.home.localOnly.boundaryTitle') }}</h2>
          <ul class="hyn-doc-check-list">
            <li v-for="item in localOnlyChecks" :key="item">{{ item }}</li>
          </ul>
        </article>
        <doc-code-block :title="t('hynDocs.home.localOnly.grepTitle')" :code="grepExample" />
      </div>
    </section>
  </div>
</template>

<script setup name="HynComponentDocsHome" lang="ts">
import DocCodeBlock from './docs/DocCodeBlock.vue';
import type { HynComponentDocEntry } from './docs/catalog';
import { getSortedHynComponentEntries } from './docs/catalog';
import { useAppI18n } from '@/utils/i18n';

interface HomeMetric {
  label: string;
  value: string;
  note: string;
}

interface DocPrinciple {
  kind: string;
  title: string;
  description: string;
}

interface MatrixRow {
  scene: string;
  component: string;
  reason: string;
}

const { t } = useAppI18n();
const docEntries = getSortedHynComponentEntries();

const metrics = computed<HomeMetric[]>(() => [
  {
    label: t('hynDocs.home.metrics.routeMode.label'),
    value: t('hynDocs.home.metrics.routeMode.value'),
    note: t('hynDocs.home.metrics.routeMode.note')
  },
  {
    label: t('hynDocs.home.metrics.docShape.label'),
    value: t('hynDocs.home.metrics.docShape.value'),
    note: t('hynDocs.home.metrics.docShape.note')
  },
  {
    label: t('hynDocs.home.metrics.designGoal.label'),
    value: t('hynDocs.home.metrics.designGoal.value'),
    note: t('hynDocs.home.metrics.designGoal.note')
  }
]);

const matrixRows = computed<MatrixRow[]>(() => [
  {
    scene: t('hynDocs.home.decisionMatrix.rows.pagedCrud.scene'),
    component: t('hynDocs.home.decisionMatrix.rows.pagedCrud.component'),
    reason: t('hynDocs.home.decisionMatrix.rows.pagedCrud.reason')
  },
  {
    scene: t('hynDocs.home.decisionMatrix.rows.flatLargeData.scene'),
    component: t('hynDocs.home.decisionMatrix.rows.flatLargeData.component'),
    reason: t('hynDocs.home.decisionMatrix.rows.flatLargeData.reason')
  },
  {
    scene: t('hynDocs.home.decisionMatrix.rows.treeTable.scene'),
    component: t('hynDocs.home.decisionMatrix.rows.treeTable.component'),
    reason: t('hynDocs.home.decisionMatrix.rows.treeTable.reason')
  },
  {
    scene: t('hynDocs.home.decisionMatrix.rows.inlineEntity.scene'),
    component: t('hynDocs.home.decisionMatrix.rows.inlineEntity.component'),
    reason: t('hynDocs.home.decisionMatrix.rows.inlineEntity.reason')
  },
  {
    scene: t('hynDocs.home.decisionMatrix.rows.dialogEntity.scene'),
    component: t('hynDocs.home.decisionMatrix.rows.dialogEntity.component'),
    reason: t('hynDocs.home.decisionMatrix.rows.dialogEntity.reason')
  }
]);

const i18nBoundaryCards = computed<DocPrinciple[]>(() => [
  {
    kind: t('hynDocs.home.i18nBoundary.cards.docs.kind'),
    title: t('hynDocs.home.i18nBoundary.cards.docs.title'),
    description: t('hynDocs.home.i18nBoundary.cards.docs.description')
  },
  {
    kind: t('hynDocs.home.i18nBoundary.cards.business.kind'),
    title: t('hynDocs.home.i18nBoundary.cards.business.title'),
    description: t('hynDocs.home.i18nBoundary.cards.business.description')
  },
  {
    kind: t('hynDocs.home.i18nBoundary.cards.audit.kind'),
    title: t('hynDocs.home.i18nBoundary.cards.audit.title'),
    description: t('hynDocs.home.i18nBoundary.cards.audit.description')
  }
]);

const principles = computed<DocPrinciple[]>(() => [
  {
    kind: t('hynDocs.home.design.principles.apiLayers.kind'),
    title: t('hynDocs.home.design.principles.apiLayers.title'),
    description: t('hynDocs.home.design.principles.apiLayers.description')
  },
  {
    kind: t('hynDocs.home.design.principles.scenarioFirst.kind'),
    title: t('hynDocs.home.design.principles.scenarioFirst.title'),
    description: t('hynDocs.home.design.principles.scenarioFirst.description')
  },
  {
    kind: t('hynDocs.home.design.principles.dataModel.kind'),
    title: t('hynDocs.home.design.principles.dataModel.title'),
    description: t('hynDocs.home.design.principles.dataModel.description')
  },
  {
    kind: t('hynDocs.home.design.principles.doDont.kind'),
    title: t('hynDocs.home.design.principles.doDont.title'),
    description: t('hynDocs.home.design.principles.doDont.description')
  }
]);

const localOnlyChecks = computed<string[]>(() => [
  t('hynDocs.home.localOnly.checks.viewPath'),
  t('hynDocs.home.localOnly.checks.routePath'),
  t('hynDocs.home.localOnly.checks.noStaticImport'),
  t('hynDocs.home.localOnly.checks.localMarkdown'),
  t('hynDocs.home.localOnly.checks.i18nBoundary')
]);

const grepExample = `git check-ignore -v HYN_COMPONENT_SYSTEM.md \\
  .codex/skills/frontend-crud-coding/references/hyn-components.md \\
  src/views/component/hyn/index.vue \\
  src/router/modules/hyn-component-docs.local.ts

rg "<el-table|<el-dialog" src/views
rg "dialog-form|dialog-grid-form|permission-dialog-form" src/views
rg ":deep\\(\\.el-form-item|:deep\\(\\.el-input-number|:deep\\(\\.el-table" src/views`;

/** 将文档状态枚举转换成当前语言展示标签。 */
const resolveStatusLabel = (status: HynComponentDocEntry['status']): string => {
  return t(`hynDocs.catalog.status.${status}`);
};
</script>
