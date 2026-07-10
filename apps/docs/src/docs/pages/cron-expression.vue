<template>
  <div class="hyn-doc-page">
    <header class="hyn-doc-hero">
      <div>
        <span class="hyn-doc-kicker">{{ t('hynDocs.cronExpression.hero.kicker') }}</span>
        <h1>{{ t('hynDocs.cronExpression.hero.title') }}</h1>
        <p>{{ t('hynDocs.cronExpression.hero.description') }}</p>
        <div class="hyn-doc-pill-row">
          <span>{{ t('hynDocs.cronExpression.hero.pills.formField') }}</span>
          <span>{{ t('hynDocs.cronExpression.hero.pills.lazyDialog') }}</span>
          <span>{{ t('hynDocs.cronExpression.hero.pills.visualBuilder') }}</span>
          <span>{{ t('hynDocs.cronExpression.hero.pills.summaryChip') }}</span>
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
        <span class="hyn-doc-kicker">{{ t('hynDocs.cronExpression.live.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.cronExpression.live.title') }}</h2>
        <p>{{ t('hynDocs.cronExpression.live.description') }}</p>
      </div>
      <div class="hyn-doc-demo-frame">
        <hyn-form :model="demoForm" :fields="demoFields" label-width="120px" :columns="2" />
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.cronExpression.aiCopy.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.cronExpression.aiCopy.title') }}</h2>
        <p>{{ t('hynDocs.cronExpression.aiCopy.description') }}</p>
      </div>
      <doc-code-block :title="t('hynDocs.cronExpression.aiCopy.codeTitle')" :code="t('hynDocs.cronExpression.aiCopy.code')" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.cronExpression.reference.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.cronExpression.reference.title') }}</h2>
        <p>{{ t('hynDocs.cronExpression.reference.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.cronExpression.reference.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.cronExpression.reference.columns.field') }}</span>
          <span>{{ t('hynDocs.cronExpression.reference.columns.type') }}</span>
          <span>{{ t('hynDocs.cronExpression.reference.columns.description') }}</span>
        </div>
        <div v-for="item in fieldRows" :key="item.name" class="hyn-doc-api-table__row" role="row">
          <code>{{ item.name }}</code>
          <span>{{ item.type }}</span>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.cronExpression.internals.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.cronExpression.internals.title') }}</h2>
        <p>{{ t('hynDocs.cronExpression.internals.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <article v-for="part in componentParts" :key="part.name" class="hyn-doc-card">
          <span class="hyn-doc-kicker">{{ part.layer }}</span>
          <h2>{{ part.name }}</h2>
          <p>{{ part.description }}</p>
          <ul class="hyn-doc-check-list">
            <li v-for="point in part.points" :key="point">{{ point }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.cronExpression.coreCode.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.cronExpression.coreCode.title') }}</h2>
        <p>{{ t('hynDocs.cronExpression.coreCode.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <doc-code-block :title="t('hynDocs.cronExpression.coreCode.fieldTypeTitle')" :code="t('hynDocs.cronExpression.coreCode.fieldTypeCode')" language="typescript" />
        <doc-code-block :title="t('hynDocs.cronExpression.coreCode.lazyDialogTitle')" :code="t('hynDocs.cronExpression.coreCode.lazyDialogCode')" language="typescript" />
      </div>
      <doc-code-block :title="t('hynDocs.cronExpression.coreCode.rowProtocolTitle')" :code="t('hynDocs.cronExpression.coreCode.rowProtocolCode')" language="vue" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.cronExpression.boundary.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.cronExpression.boundary.title') }}</h2>
        <p>{{ t('hynDocs.cronExpression.boundary.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-mint">{{ t('hynDocs.cronExpression.boundary.doTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in boundaryDoItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-danger">{{ t('hynDocs.cronExpression.boundary.dontTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in boundaryDontItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.cronExpression.docsRule.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.cronExpression.docsRule.title') }}</h2>
        <p>{{ t('hynDocs.cronExpression.docsRule.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-mint">{{ t('hynDocs.cronExpression.docsRule.requiredTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in docsRequiredItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-danger">{{ t('hynDocs.cronExpression.docsRule.forbiddenTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in docsForbiddenItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup name="HynCronExpressionDoc" lang="ts">
import type { HynFormField } from '@7mrlan/hyn-ui/types';
import { useAppI18n } from '@/utils/i18n';
import DocCodeBlock from '../DocCodeBlock.vue';

interface DemoForm {
  jobName: string;
  cronExpression: string;
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

interface ComponentPart {
  layer: string;
  name: string;
  description: string;
  points: string[];
}

const { t, locale } = useAppI18n();
const demoForm = ref<DemoForm>(createDemoForm());

const demoFields = computed<HynFormField<DemoForm>[]>(() => [
  { key: 'jobName', label: t('hynDocs.cronExpression.live.fields.jobName'), prop: 'jobName', type: 'input' },
  {
    key: 'cronExpression',
    label: t('hynDocs.cronExpression.live.fields.cronExpression'),
    prop: 'cronExpression',
    type: 'cron',
    span: 'full',
    contentLayout: 'inline'
  }
]);

const metrics = computed<DocMetric[]>(() => [
  {
    label: t('hynDocs.cronExpression.metrics.form.label'),
    value: t('hynDocs.cronExpression.metrics.form.value'),
    note: t('hynDocs.cronExpression.metrics.form.note')
  },
  {
    label: t('hynDocs.cronExpression.metrics.bundle.label'),
    value: t('hynDocs.cronExpression.metrics.bundle.value'),
    note: t('hynDocs.cronExpression.metrics.bundle.note')
  },
  {
    label: t('hynDocs.cronExpression.metrics.scroll.label'),
    value: t('hynDocs.cronExpression.metrics.scroll.value'),
    note: t('hynDocs.cronExpression.metrics.scroll.note')
  }
]);

const fieldRows = computed<DocApiRow[]>(() => [
  { name: 'key', type: 'string', description: t('hynDocs.cronExpression.reference.rows.key') },
  { name: 'label', type: 'string', description: t('hynDocs.cronExpression.reference.rows.label') },
  { name: 'prop', type: 'keyof TModel', description: t('hynDocs.cronExpression.reference.rows.prop') },
  { name: 'type', type: "'cron'", description: t('hynDocs.cronExpression.reference.rows.type') },
  { name: 'span', type: "1 | 2 | 'full'", description: t('hynDocs.cronExpression.reference.rows.span') },
  { name: 'contentLayout', type: "'control' | 'inline' | 'section'", description: t('hynDocs.cronExpression.reference.rows.contentLayout') },
  { name: 'placeholder', type: 'string | undefined', description: t('hynDocs.cronExpression.reference.rows.placeholder') },
  { name: 'buttonText', type: 'string | undefined', description: t('hynDocs.cronExpression.reference.rows.buttonText') },
  { name: 'rules', type: 'FormItemRule[]', description: t('hynDocs.cronExpression.reference.rows.rules') },
  { name: 'disabled', type: 'boolean | (model) => boolean', description: t('hynDocs.cronExpression.reference.rows.disabled') }
]);

const componentParts = computed<ComponentPart[]>(() => [
  createComponentPart('publicField', ['model', 'asyncDialog', 'preload']),
  createComponentPart('dialogShell', ['hynDialog', 'rawMode', 'copyChip']),
  createComponentPart('visualBuilder', ['sharedRows', 'dayTabs', 'modelOnly']),
  createComponentPart('rowProtocol', ['grid', 'active', 'mobile']),
  createComponentPart('parameterControl', ['shortLabels', 'validRange', 'controlWidth']),
  createComponentPart('pureLogic', ['publicImport', 'advancedMode', 'splitChunk'])
]);

const boundaryDoItems = computed<string[]>(() => [
  t('hynDocs.cronExpression.boundary.doItems.formCron'),
  t('hynDocs.cronExpression.boundary.doItems.rowProtocol'),
  t('hynDocs.cronExpression.boundary.doItems.shortLabels'),
  t('hynDocs.cronExpression.boundary.doItems.summaryValidation'),
  t('hynDocs.cronExpression.boundary.doItems.rawMode')
]);

const boundaryDontItems = computed<string[]>(() => [
  t('hynDocs.cronExpression.boundary.dontItems.businessSlot'),
  t('hynDocs.cronExpression.boundary.dontItems.hynFormRows'),
  t('hynDocs.cronExpression.boundary.dontItems.longSelect'),
  t('hynDocs.cronExpression.boundary.dontItems.extraScroll')
]);

const docsRequiredItems = computed<string[]>(() => [
  t('hynDocs.cronExpression.docsRule.requiredItems.boundary'),
  t('hynDocs.cronExpression.docsRule.requiredItems.api'),
  t('hynDocs.cronExpression.docsRule.requiredItems.internals'),
  t('hynDocs.cronExpression.docsRule.requiredItems.copyableCode'),
  t('hynDocs.cronExpression.docsRule.requiredItems.acceptance')
]);

const docsForbiddenItems = computed<string[]>(() => [
  t('hynDocs.cronExpression.docsRule.forbiddenItems.demoOnly'),
  t('hynDocs.cronExpression.docsRule.forbiddenItems.sourceOnly'),
  t('hynDocs.cronExpression.docsRule.forbiddenItems.privateBoundary'),
  t('hynDocs.cronExpression.docsRule.forbiddenItems.catalog'),
  t('hynDocs.cronExpression.docsRule.forbiddenItems.oldPatterns')
]);

watch(
  () => locale.value,
  () => {
    demoForm.value.jobName = t('hynDocs.cronExpression.live.demoJobName');
  }
);

/** 创建当前语言下的 Cron 文档示例表单。 */
function createDemoForm(): DemoForm {
  return {
    jobName: t('hynDocs.cronExpression.live.demoJobName'),
    cronExpression: '0 0/5 * * * ?'
  };
}

/** 按语言包 key 创建内部组件职责卡片。 */
function createComponentPart(partKey: string, pointKeys: string[]): ComponentPart {
  return {
    layer: t(`hynDocs.cronExpression.internals.parts.${partKey}.layer`),
    name: t(`hynDocs.cronExpression.internals.parts.${partKey}.name`),
    description: t(`hynDocs.cronExpression.internals.parts.${partKey}.description`),
    points: pointKeys.map(pointKey => t(`hynDocs.cronExpression.internals.parts.${partKey}.points.${pointKey}`))
  };
}
</script>
