<template>
  <div class="hyn-doc-page">
    <header class="hyn-doc-hero">
      <div>
        <span class="hyn-doc-kicker">{{ t('hynDocs.globalConfig.hero.kicker') }}</span>
        <h1>{{ t('hynDocs.globalConfig.hero.title') }}</h1>
        <p>{{ t('hynDocs.globalConfig.hero.description') }}</p>
        <div class="hyn-doc-pill-row">
          <span>{{ t('hynDocs.globalConfig.hero.pills.singleEntry') }}</span>
          <span>{{ t('hynDocs.globalConfig.hero.pills.localOverride') }}</span>
          <span>{{ t('hynDocs.globalConfig.hero.pills.docsRequired') }}</span>
        </div>
      </div>
    </header>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.globalConfig.reference.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.globalConfig.reference.title') }}</h2>
        <p>{{ t('hynDocs.globalConfig.reference.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.globalConfig.reference.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.globalConfig.reference.columns.name') }}</span>
          <span>{{ t('hynDocs.globalConfig.reference.columns.defaultValue') }}</span>
          <span>{{ t('hynDocs.globalConfig.reference.columns.description') }}</span>
        </div>
        <div v-for="item in configRows" :key="item.name" class="hyn-doc-api-table__row" role="row">
          <code>{{ item.name }}</code>
          <code>{{ item.defaultValue }}</code>
          <p>{{ item.description }}</p>
        </div>
      </div>
      <doc-code-block :title="t('hynDocs.globalConfig.reference.codeTitle')" :code="configEntryCode" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.globalConfig.modes.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.globalConfig.modes.title') }}</h2>
        <p>{{ t('hynDocs.globalConfig.modes.description') }}</p>
      </div>
      <div class="hyn-doc-grid">
        <article v-for="item in modeCards" :key="item.title" class="hyn-doc-card">
          <span class="hyn-doc-kicker">{{ item.kind }}</span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </article>
      </div>
      <doc-code-block :title="t('hynDocs.globalConfig.modes.codeTitle')" :code="modeProtocolCode" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.globalConfig.priority.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.globalConfig.priority.title') }}</h2>
        <p>{{ t('hynDocs.globalConfig.priority.description') }}</p>
      </div>
      <div class="hyn-doc-two-column">
        <article class="hyn-doc-card">
          <h2>{{ t('hynDocs.globalConfig.priority.cardTitle') }}</h2>
          <ul class="hyn-doc-check-list">
            <li v-for="item in priorityChecks" :key="item">{{ item }}</li>
          </ul>
        </article>
        <doc-code-block :title="t('hynDocs.globalConfig.priority.codeTitle')" :code="codeSnippets.localOverride" />
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.globalConfig.maintenance.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.globalConfig.maintenance.title') }}</h2>
        <p>{{ t('hynDocs.globalConfig.maintenance.description') }}</p>
      </div>
      <article class="hyn-doc-card">
        <h2>{{ t('hynDocs.globalConfig.maintenance.cardTitle') }}</h2>
        <ul class="hyn-doc-check-list">
          <li v-for="item in maintenanceChecks" :key="item">{{ item }}</li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script setup name="HynGlobalConfigDoc" lang="ts">
import DocCodeBlock from '../DocCodeBlock.vue';
import { useAppI18n } from '@/utils/i18n';

interface ConfigRow {
  name: string;
  defaultValue: string;
  description: string;
}

interface ModeCard {
  kind: string;
  title: string;
  description: string;
}

const { t, tm } = useAppI18n();

const codeSnippets = {
  localOverride: `<hyn-table overflow-mode="ellipsis" />
<hyn-form label-overflow-mode="wrap" />
<hyn-dialog label-overflow-mode="fit" :auto-width="true" />

const columns: HynTableColumn<UserRow>[] = [
  {
    prop: 'operation',
    label: t('app.user.operation'),
    overflowMode: 'ellipsis'
  }
];`
} as const;

const configEntryCode = computed(() => getRawDocMessage('hynDocs.globalConfig.reference.code'));
const modeProtocolCode = computed(() => getRawDocMessage('hynDocs.globalConfig.modes.code'));

/** 代码块读取原始文案，避免 Vue I18n 把 TypeScript 对象字面量解析成插值模板。 */
function getRawDocMessage(key: string): string {
  const value = tm(key);
  if (typeof value !== 'string') {
    throw new Error(`HYN docs message must be a string. key=${key}`);
  }
  return value;
}

const configRows = computed<ConfigRow[]>(() => [
  {
    name: 'HynTextOverflowMode',
    defaultValue: "'fit' | 'ellipsis' | 'wrap'",
    description: t('hynDocs.globalConfig.reference.rows.typeSource')
  },
  {
    name: 'hynGlobalConfig.overflowMode',
    defaultValue: "'fit'",
    description: t('hynDocs.globalConfig.reference.rows.overflowMode')
  },
  {
    name: 'overflowMode',
    defaultValue: t('hynDocs.globalConfig.reference.rows.localDefault'),
    description: t('hynDocs.globalConfig.reference.rows.overflowModeOverride')
  },
  {
    name: 'labelOverflowMode',
    defaultValue: t('hynDocs.globalConfig.reference.rows.localDefault'),
    description: t('hynDocs.globalConfig.reference.rows.labelOverflowMode')
  },
  {
    name: 'autoWidth',
    defaultValue: 'true',
    description: t('hynDocs.globalConfig.reference.rows.autoWidth')
  },
  {
    name: t('hynDocs.globalConfig.reference.rows.supportedName'),
    defaultValue: t('hynDocs.globalConfig.reference.rows.supportedDefault'),
    description: t('hynDocs.globalConfig.reference.rows.supportedComponents')
  },
  {
    name: t('hynDocs.globalConfig.reference.rows.priorityName'),
    defaultValue: t('hynDocs.globalConfig.reference.rows.required'),
    description: t('hynDocs.globalConfig.reference.rows.priorityRule')
  }
]);

const modeCards = computed<ModeCard[]>(() => [
  {
    kind: 'fit',
    title: t('hynDocs.globalConfig.modes.cards.fit.title'),
    description: t('hynDocs.globalConfig.modes.cards.fit.description')
  },
  {
    kind: 'ellipsis',
    title: t('hynDocs.globalConfig.modes.cards.ellipsis.title'),
    description: t('hynDocs.globalConfig.modes.cards.ellipsis.description')
  },
  {
    kind: 'wrap',
    title: t('hynDocs.globalConfig.modes.cards.wrap.title'),
    description: t('hynDocs.globalConfig.modes.cards.wrap.description')
  }
]);

const priorityChecks = computed<string[]>(() => [
  t('hynDocs.globalConfig.priority.checks.explicit'),
  t('hynDocs.globalConfig.priority.checks.global'),
  t('hynDocs.globalConfig.priority.checks.default'),
  t('hynDocs.globalConfig.priority.checks.virtualTable')
]);

const maintenanceChecks = computed<string[]>(() => [
  t('hynDocs.globalConfig.maintenance.checks.configFile'),
  t('hynDocs.globalConfig.maintenance.checks.publicTypes'),
  t('hynDocs.globalConfig.maintenance.checks.docsPage'),
  t('hynDocs.globalConfig.maintenance.checks.overview'),
  t('hynDocs.globalConfig.maintenance.checks.references')
]);
</script>
