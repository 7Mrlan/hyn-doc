<template>
  <div class="hyn-doc-page">
    <header class="hyn-doc-hero">
      <div>
        <span class="hyn-doc-kicker">{{ t('hynDocs.deptSelect.hero.kicker') }}</span>
        <h1>{{ t('hynDocs.deptSelect.hero.title') }}</h1>
        <p>{{ t('hynDocs.deptSelect.hero.description') }}</p>
        <div class="hyn-doc-pill-row">
          <span>{{ t('hynDocs.deptSelect.hero.pills.formField') }}</span>
          <span>{{ t('hynDocs.deptSelect.hero.pills.singleMulti') }}</span>
          <span>{{ t('hynDocs.deptSelect.hero.pills.disabledFilter') }}</span>
          <span>{{ t('hynDocs.deptSelect.hero.pills.typedConfig') }}</span>
        </div>
      </div>
    </header>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.deptSelect.live.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.deptSelect.live.title') }}</h2>
        <p>{{ t('hynDocs.deptSelect.live.description') }}</p>
      </div>
      <div class="hyn-doc-demo-frame">
        <hyn-form :model="demoForm" :fields="demoFields" label-width="112px" :columns="2" />
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.deptSelect.aiCopy.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.deptSelect.aiCopy.title') }}</h2>
        <p>{{ t('hynDocs.deptSelect.aiCopy.description') }}</p>
      </div>
      <doc-code-block :title="t('hynDocs.deptSelect.aiCopy.codeTitle')" :code="t('hynDocs.deptSelect.aiCopy.code')" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.deptSelect.reference.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.deptSelect.reference.title') }}</h2>
        <p>{{ t('hynDocs.deptSelect.reference.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.deptSelect.reference.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.deptSelect.reference.columns.field') }}</span>
          <span>{{ t('hynDocs.deptSelect.reference.columns.type') }}</span>
          <span>{{ t('hynDocs.deptSelect.reference.columns.description') }}</span>
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
        <span class="hyn-doc-kicker">{{ t('hynDocs.deptSelect.rules.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.deptSelect.rules.title') }}</h2>
        <p>{{ t('hynDocs.deptSelect.rules.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-mint">{{ t('hynDocs.deptSelect.rules.doTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in ruleDoItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-danger">{{ t('hynDocs.deptSelect.rules.dontTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in ruleDontItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.deptSelect.acceptance.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.deptSelect.acceptance.title') }}</h2>
        <p>{{ t('hynDocs.deptSelect.acceptance.description') }}</p>
      </div>
      <article class="hyn-doc-card">
        <ul class="hyn-doc-check-list">
          <li v-for="item in acceptanceItems" :key="item">{{ item }}</li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script setup name="HynDeptSelectDoc" lang="ts">
import type { HynFormField } from '@7mrlan/hyn-ui/types';
import { useAppI18n } from '@/utils/i18n';
import DocCodeBlock from '../DocCodeBlock.vue';

interface DemoForm {
  deptId?: string | number;
  deptIds: Array<string | number>;
  flatDeptIds: Array<string | number>;
}

interface DocApiRow {
  name: string;
  type: string;
  description: string;
}

const { t } = useAppI18n();
const demoForm = ref<DemoForm>({ deptId: undefined, deptIds: [], flatDeptIds: [] });

const demoFields = computed<HynFormField<DemoForm>[]>(() => [
  {
    key: 'deptId',
    label: t('hynDocs.deptSelect.live.fields.deptId'),
    prop: 'deptId',
    type: 'deptSelect',
    placeholder: t('hynDocs.deptSelect.live.placeholders.deptId')
  },
  {
    key: 'deptIds',
    label: t('hynDocs.deptSelect.live.fields.deptIds'),
    prop: 'deptIds',
    type: 'deptSelect',
    multiple: true,
    linkage: true,
    dropdownWidth: 420,
    placeholder: t('hynDocs.deptSelect.live.placeholders.deptIds')
  },
  {
    key: 'flatDeptIds',
    label: t('hynDocs.deptSelect.live.fields.flatDeptIds'),
    prop: 'flatDeptIds',
    type: 'deptSelect',
    multiple: true,
    flatten: true,
    placeholder: t('hynDocs.deptSelect.live.placeholders.flatDeptIds')
  }
]);

const apiRows = computed<DocApiRow[]>(() => [
  { name: 'type', type: "'deptSelect'", description: t('hynDocs.deptSelect.reference.rows.type') },
  { name: 'multiple', type: 'boolean', description: t('hynDocs.deptSelect.reference.rows.multiple') },
  { name: 'flatten', type: 'boolean', description: t('hynDocs.deptSelect.reference.rows.flatten') },
  { name: 'filterDisabled', type: 'boolean', description: t('hynDocs.deptSelect.reference.rows.filterDisabled') },
  { name: 'linkage', type: 'boolean', description: t('hynDocs.deptSelect.reference.rows.linkage') },
  {
    name: 'onLinkageChange',
    type: '(linkage, model) => void',
    description: t('hynDocs.deptSelect.reference.rows.onLinkageChange')
  },
  { name: 'filterable', type: 'boolean', description: t('hynDocs.deptSelect.reference.rows.filterable') },
  { name: 'clearable', type: 'boolean', description: t('hynDocs.deptSelect.reference.rows.clearable') },
  { name: 'collapseTags', type: 'boolean', description: t('hynDocs.deptSelect.reference.rows.collapseTags') },
  { name: 'maxCollapseTags', type: 'number', description: t('hynDocs.deptSelect.reference.rows.maxCollapseTags') },
  { name: 'dropdownWidth', type: 'number | string', description: t('hynDocs.deptSelect.reference.rows.dropdownWidth') },
  { name: 'teleported', type: 'boolean', description: t('hynDocs.deptSelect.reference.rows.teleported') }
]);

const ruleDoItems = computed<string[]>(() => [
  t('hynDocs.deptSelect.rules.doItems.fieldType'),
  t('hynDocs.deptSelect.rules.doItems.multiple'),
  t('hynDocs.deptSelect.rules.doItems.disabled')
]);

const ruleDontItems = computed<string[]>(() => [
  t('hynDocs.deptSelect.rules.dontItems.pageTree'),
  t('hynDocs.deptSelect.rules.dontItems.componentProps'),
  t('hynDocs.deptSelect.rules.dontItems.guessLabels')
]);

const acceptanceItems = computed<string[]>(() => [
  t('hynDocs.deptSelect.acceptance.items.single'),
  t('hynDocs.deptSelect.acceptance.items.multiple'),
  t('hynDocs.deptSelect.acceptance.items.flatten'),
  t('hynDocs.deptSelect.acceptance.items.disabled'),
  t('hynDocs.deptSelect.acceptance.items.i18n')
]);
</script>
