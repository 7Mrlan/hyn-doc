<template>
  <div class="hyn-doc-page">
    <header class="hyn-doc-hero">
      <div>
        <span class="hyn-doc-kicker">{{ t('hynDocs.treeSelect.hero.kicker') }}</span>
        <h1>{{ t('hynDocs.treeSelect.hero.title') }}</h1>
        <p>{{ t('hynDocs.treeSelect.hero.description') }}</p>
        <div class="hyn-doc-pill-row">
          <span>{{ t('hynDocs.treeSelect.hero.pills.treeMode') }}</span>
          <span>{{ t('hynDocs.treeSelect.hero.pills.flatMode') }}</span>
          <span>{{ t('hynDocs.treeSelect.hero.pills.localSearch') }}</span>
          <span>{{ t('hynDocs.treeSelect.hero.pills.formField') }}</span>
        </div>
      </div>
    </header>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.treeSelect.live.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.treeSelect.live.title') }}</h2>
        <p>{{ t('hynDocs.treeSelect.live.description') }}</p>
      </div>
      <div class="hyn-doc-demo-frame">
        <hyn-form :model="demoForm" :fields="demoFields" label-width="112px" :columns="2" />
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.treeSelect.aiCopy.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.treeSelect.aiCopy.title') }}</h2>
        <p>{{ t('hynDocs.treeSelect.aiCopy.description') }}</p>
      </div>
      <doc-code-block :title="t('hynDocs.treeSelect.aiCopy.codeTitle')" :code="t('hynDocs.treeSelect.aiCopy.code')" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.treeSelect.reference.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.treeSelect.reference.title') }}</h2>
        <p>{{ t('hynDocs.treeSelect.reference.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.treeSelect.reference.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.treeSelect.reference.columns.field') }}</span>
          <span>{{ t('hynDocs.treeSelect.reference.columns.type') }}</span>
          <span>{{ t('hynDocs.treeSelect.reference.columns.description') }}</span>
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
        <span class="hyn-doc-kicker">{{ t('hynDocs.treeSelect.rules.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.treeSelect.rules.title') }}</h2>
        <p>{{ t('hynDocs.treeSelect.rules.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-mint">{{ t('hynDocs.treeSelect.rules.doTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in ruleDoItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-danger">{{ t('hynDocs.treeSelect.rules.dontTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in ruleDontItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.treeSelect.acceptance.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.treeSelect.acceptance.title') }}</h2>
        <p>{{ t('hynDocs.treeSelect.acceptance.description') }}</p>
      </div>
      <article class="hyn-doc-card">
        <ul class="hyn-doc-check-list">
          <li v-for="item in acceptanceItems" :key="item">{{ item }}</li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script setup name="HynTreeSelectDoc" lang="ts">
import type { HynFormField, HynTreeSelectNode } from '@7mrlan/hyn-ui/types';
import { useAppI18n } from '@/utils/i18n';
import DocCodeBlock from '../DocCodeBlock.vue';

interface DemoForm {
  parentId?: string | number;
  nodeIds: Array<string | number>;
  linkedNodeIds: Array<string | number>;
  flatNodeIds: Array<string | number>;
}

interface DocApiRow {
  name: string;
  type: string;
  description: string;
}

const { t } = useAppI18n();
const demoForm = ref<DemoForm>({ parentId: undefined, nodeIds: [], linkedNodeIds: [], flatNodeIds: [] });

const demoTreeData = computed<HynTreeSelectNode[]>(() => [
  {
    id: 1,
    label: t('hynDocs.treeSelect.live.nodes.root'),
    children: [
      { id: 11, label: t('hynDocs.treeSelect.live.nodes.childA') },
      { id: 12, label: t('hynDocs.treeSelect.live.nodes.childB') }
    ]
  },
  {
    id: 2,
    label: t('hynDocs.treeSelect.live.nodes.group'),
    children: [{ id: 21, label: t('hynDocs.treeSelect.live.nodes.childC') }]
  }
]);

const demoFields = computed<HynFormField<DemoForm>[]>(() => [
  {
    key: 'parentId',
    label: t('hynDocs.treeSelect.live.fields.parentId'),
    prop: 'parentId',
    type: 'treeSelect',
    data: demoTreeData.value,
    props: { value: 'id', label: 'label', children: 'children' },
    valueKey: 'id',
    linkage: false,
    placeholder: t('hynDocs.treeSelect.live.placeholders.parentId')
  },
  {
    key: 'nodeIds',
    label: t('hynDocs.treeSelect.live.fields.nodeIds'),
    prop: 'nodeIds',
    type: 'treeSelect',
    data: demoTreeData.value,
    props: { value: 'id', label: 'label', children: 'children' },
    valueKey: 'id',
    multiple: true,
    linkage: false,
    dropdownWidth: 420,
    placeholder: t('hynDocs.treeSelect.live.placeholders.nodeIds')
  },
  {
    key: 'linkedNodeIds',
    label: t('hynDocs.treeSelect.live.fields.linkedNodeIds'),
    prop: 'linkedNodeIds',
    type: 'treeSelect',
    data: demoTreeData.value,
    props: { value: 'id', label: 'label', children: 'children' },
    valueKey: 'id',
    multiple: true,
    linkage: true,
    dropdownWidth: 420,
    placeholder: t('hynDocs.treeSelect.live.placeholders.linkedNodeIds')
  },
  {
    key: 'flatNodeIds',
    label: t('hynDocs.treeSelect.live.fields.flatNodeIds'),
    prop: 'flatNodeIds',
    type: 'treeSelect',
    data: demoTreeData.value,
    props: { value: 'id', label: 'label', children: 'children' },
    valueKey: 'id',
    multiple: true,
    linkage: false,
    flatten: true,
    placeholder: t('hynDocs.treeSelect.live.placeholders.flatNodeIds')
  }
]);

const apiRows = computed<DocApiRow[]>(() => [
  { name: 'data', type: 'object[]', description: t('hynDocs.treeSelect.reference.rows.data') },
  { name: 'props', type: 'HynTreeSelectNodeProps', description: t('hynDocs.treeSelect.reference.rows.props') },
  { name: 'multiple', type: 'boolean', description: t('hynDocs.treeSelect.reference.rows.multiple') },
  { name: 'linkage', type: 'boolean', description: t('hynDocs.treeSelect.reference.rows.linkage') },
  {
    name: 'onLinkageChange',
    type: '(linkage, model) => void',
    description: t('hynDocs.treeSelect.reference.rows.onLinkageChange')
  },
  { name: 'flatten', type: 'boolean', description: t('hynDocs.treeSelect.reference.rows.flatten') },
  { name: 'filterable', type: 'boolean', description: t('hynDocs.treeSelect.reference.rows.filterable') },
  { name: 'filterDisabled', type: 'boolean', description: t('hynDocs.treeSelect.reference.rows.filterDisabled') },
  { name: 'dropdownWidth', type: 'number | string', description: t('hynDocs.treeSelect.reference.rows.dropdownWidth') },
  { name: 'loading', type: 'boolean', description: t('hynDocs.treeSelect.reference.rows.loading') }
]);

const ruleDoItems = computed<string[]>(() => [
  t('hynDocs.treeSelect.rules.doItems.genericTree'),
  t('hynDocs.treeSelect.rules.doItems.flatten'),
  t('hynDocs.treeSelect.rules.doItems.deptWrapper')
]);

const ruleDontItems = computed<string[]>(() => [
  t('hynDocs.treeSelect.rules.dontItems.remoteEntity'),
  t('hynDocs.treeSelect.rules.dontItems.backendFetch'),
  t('hynDocs.treeSelect.rules.dontItems.permissionEditor')
]);

const acceptanceItems = computed<string[]>(() => [
  t('hynDocs.treeSelect.acceptance.items.tree'),
  t('hynDocs.treeSelect.acceptance.items.flat'),
  t('hynDocs.treeSelect.acceptance.items.loading'),
  t('hynDocs.treeSelect.acceptance.items.types')
]);
</script>
