<template>
  <div class="hyn-doc-page">
    <header class="hyn-doc-hero">
      <div>
        <span class="hyn-doc-kicker">{{ t('hynDocs.entityPicker.hero.kicker') }}</span>
        <h1>{{ t('hynDocs.entityPicker.hero.title') }}</h1>
        <p>{{ t('hynDocs.entityPicker.hero.description') }}</p>
        <div class="hyn-doc-pill-row">
          <span>{{ t('hynDocs.entityPicker.hero.pills.remoteSearch') }}</span>
          <span>{{ t('hynDocs.entityPicker.hero.pills.virtualDropdown') }}</span>
          <span>{{ t('hynDocs.entityPicker.hero.pills.crossPage') }}</span>
          <span>{{ t('hynDocs.entityPicker.hero.pills.benchmark') }}</span>
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
          <span class="hyn-doc-kicker">{{ t('hynDocs.entityPicker.benchmark.kicker') }}</span>
          <h2 data-doc-heading>{{ t('hynDocs.entityPicker.benchmark.title') }}</h2>
          <p>{{ t('hynDocs.entityPicker.benchmark.description') }}</p>
        </div>
        <el-radio-group v-model="benchmarkSize" @change="handleSizeChange">
          <el-radio-button :value="100">100</el-radio-button>
          <el-radio-button :value="1000">1000</el-radio-button>
          <el-radio-button :value="5000">5000</el-radio-button>
        </el-radio-group>
      </div>

      <div class="hyn-doc-comparison-grid">
        <article class="hyn-doc-card hyn-doc-comparison-card">
          <h2>{{ t('hynDocs.entityPicker.benchmark.legacyTitle') }}</h2>
          <p>{{ t('hynDocs.entityPicker.benchmark.legacyDescription') }}</p>
          <el-select
            v-model="legacyValue"
            class="hyn-doc-comparison-control"
            :disabled="!legacySelectEnabled"
            multiple
            filterable
            collapse-tags
            :placeholder="legacySelectPlaceholder"
            @visible-change="(visible: boolean) => handleSelectVisibleChange('legacy', visible)"
          >
            <el-option
              v-for="item in legacyOptionRows"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </article>
        <article class="hyn-doc-card hyn-doc-comparison-card">
          <h2>{{ t('hynDocs.entityPicker.benchmark.remoteTitle') }}</h2>
          <p>{{ t('hynDocs.entityPicker.benchmark.remoteDescription') }}</p>
          <hyn-remote-select
            :key="benchmarkSize"
            v-model="remoteValue"
            class="hyn-doc-comparison-control"
            :adapter="benchmarkAdapter"
            search-param="name"
            multiple
            :placeholder="t('hynDocs.entityPicker.benchmark.remotePlaceholder')"
            @change="handleRemoteChange"
          />
        </article>
      </div>

      <div class="hyn-doc-grid">
        <article v-for="item in benchmarkMetrics" :key="item.label" class="hyn-doc-card">
          <span class="hyn-doc-kicker">{{ item.label }}</span>
          <h2>{{ item.value }}</h2>
          <p>{{ item.note }}</p>
        </article>
      </div>

      <el-button plain type="primary" @click="measureBenchmark">{{ t('hynDocs.entityPicker.benchmark.refreshButton') }}</el-button>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.entityPicker.pickerSample.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.entityPicker.pickerSample.title') }}</h2>
        <p>{{ t('hynDocs.entityPicker.pickerSample.description') }}</p>
      </div>
      <el-button type="primary" plain @click="pickerVisible = true">{{ t('hynDocs.entityPicker.pickerSample.openButton') }}</el-button>
      <p class="hyn-doc-muted">{{ t('hynDocs.entityPicker.pickerSample.selectedRows', { count: selectedPickerCount }) }}</p>
      <hyn-entity-picker
        v-model="pickerValue"
        v-model:visible="pickerVisible"
        :title="t('hynDocs.entityPicker.pickerSample.dialogTitle')"
        :adapter="benchmarkAdapter"
        :columns="pickerColumns"
        :search-fields="pickerSearchFields"
        @confirm="handlePickerConfirm"
      />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.entityPicker.aiCopy.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.entityPicker.aiCopy.title') }}</h2>
        <p>{{ t('hynDocs.entityPicker.aiCopy.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <doc-code-block :title="t('hynDocs.entityPicker.aiCopy.remoteSelectTitle')" :code="t('hynDocs.entityPicker.aiCopy.remoteSelectCode')" />
        <doc-code-block :title="t('hynDocs.entityPicker.aiCopy.entityPickerTitle')" :code="t('hynDocs.entityPicker.aiCopy.entityPickerCode')" />
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.entityPicker.remoteSelectApi.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.entityPicker.remoteSelectApi.title') }}</h2>
        <p>{{ t('hynDocs.entityPicker.remoteSelectApi.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.entityPicker.remoteSelectApi.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.entityPicker.apiColumns.field') }}</span>
          <span>{{ t('hynDocs.entityPicker.apiColumns.type') }}</span>
          <span>{{ t('hynDocs.entityPicker.apiColumns.description') }}</span>
        </div>
        <div v-for="item in remoteSelectRows" :key="item.name" class="hyn-doc-api-table__row" role="row">
          <code>{{ item.name }}</code>
          <span>{{ item.type }}</span>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.entityPicker.entityPickerApi.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.entityPicker.entityPickerApi.title') }}</h2>
        <p>{{ t('hynDocs.entityPicker.entityPickerApi.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.entityPicker.entityPickerApi.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.entityPicker.apiColumns.field') }}</span>
          <span>{{ t('hynDocs.entityPicker.apiColumns.type') }}</span>
          <span>{{ t('hynDocs.entityPicker.apiColumns.description') }}</span>
        </div>
        <div v-for="item in entityPickerRows" :key="item.name" class="hyn-doc-api-table__row" role="row">
          <code>{{ item.name }}</code>
          <span>{{ item.type }}</span>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.entityPicker.adapterContract.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.entityPicker.adapterContract.title') }}</h2>
        <p>{{ t('hynDocs.entityPicker.adapterContract.description') }}</p>
      </div>
      <doc-code-block :title="t('hynDocs.entityPicker.adapterContract.codeTitle')" :code="t('hynDocs.entityPicker.adapterContract.code')" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.entityPicker.visual.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.entityPicker.visual.title') }}</h2>
        <p>{{ t('hynDocs.entityPicker.visual.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.entityPicker.visual.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.entityPicker.visual.columns.object') }}</span>
          <span>{{ t('hynDocs.entityPicker.visual.columns.rule') }}</span>
          <span>{{ t('hynDocs.entityPicker.visual.columns.description') }}</span>
        </div>
        <div v-for="item in visualRows" :key="item.name" class="hyn-doc-api-table__row" role="row">
          <code>{{ item.name }}</code>
          <span>{{ item.type }}</span>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.entityPicker.reference.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.entityPicker.reference.title') }}</h2>
        <p>{{ t('hynDocs.entityPicker.reference.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.entityPicker.reference.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.entityPicker.reference.columns.object') }}</span>
          <span>{{ t('hynDocs.entityPicker.reference.columns.type') }}</span>
          <span>{{ t('hynDocs.entityPicker.reference.columns.description') }}</span>
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
        <span class="hyn-doc-kicker">{{ t('hynDocs.entityPicker.rules.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.entityPicker.rules.title') }}</h2>
        <p>{{ t('hynDocs.entityPicker.rules.description') }}</p>
      </div>
      <div class="hyn-doc-two-column">
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-mint">{{ t('hynDocs.entityPicker.rules.doTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in ruleDoItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-danger">{{ t('hynDocs.entityPicker.rules.dontTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in ruleDontItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup name="HynEntityPickerDoc" lang="ts">
import type {
  HynEntityAdapter,
  HynEntityKey,
  HynEntityPageQuery,
  HynEntityPickerColumn,
  HynEntitySearchField
} from '@7mrlan/hyn-ui/types';
import { useAppI18n } from '@/utils/i18n';
import DocCodeBlock from '../DocCodeBlock.vue';

type DemoEntityStatus = '0' | '1';

interface DemoEntityRow {
  id: number;
  name: string;
  code: string;
  status: DemoEntityStatus;
  statusLabel: string;
}

interface DemoEntityQuery extends HynEntityPageQuery {
  name?: string;
  code?: string;
}

interface DocMetric {
  label: string;
  value: string;
  note: string;
}

interface ApiRow {
  name: string;
  type: string;
  description: string;
}

const { t } = useAppI18n();

const benchmarkSize = ref(1000);
const legacyValue = ref<number[]>([]);
const remoteValue = ref<HynEntityKey[]>([]);
const pickerValue = ref<HynEntityKey[]>([]);
const pickerVisible = ref(false);
const selectedPickerRows = ref<DemoEntityRow[]>([]);
const legacyOpenStart = ref(0);
const legacyOptionDomCount = ref(0);
const virtualOptionDomCount = ref(0);
const legacyOpenCost = ref(0);
const legacyRenderLimit = 1000;

const benchmarkRows = computed<DemoEntityRow[]>(() => createBenchmarkRows(benchmarkSize.value));
const selectedPickerCount = computed(() => selectedPickerRows.value.length);

const metrics = computed<DocMetric[]>(() => [
  {
    label: t('hynDocs.entityPicker.metrics.target.label'),
    value: t('hynDocs.entityPicker.metrics.target.value'),
    note: t('hynDocs.entityPicker.metrics.target.note')
  },
  {
    label: t('hynDocs.entityPicker.metrics.validation.label'),
    value: t('hynDocs.entityPicker.metrics.validation.value'),
    note: t('hynDocs.entityPicker.metrics.validation.note')
  },
  {
    label: t('hynDocs.entityPicker.metrics.boundary.label'),
    value: t('hynDocs.entityPicker.metrics.boundary.value'),
    note: t('hynDocs.entityPicker.metrics.boundary.note')
  }
]);

const pickerColumns = computed<HynEntityPickerColumn<DemoEntityRow>[]>(() => [
  { key: 'name', title: t('hynDocs.entityPicker.fields.name'), field: 'name', minWidth: 180 },
  { key: 'code', title: t('hynDocs.entityPicker.fields.code'), field: 'code', minWidth: 160 },
  { key: 'status', title: t('hynDocs.entityPicker.fields.status'), field: 'statusLabel', width: 120, align: 'center' }
]);

const pickerSearchFields = computed<HynEntitySearchField<DemoEntityQuery>[]>(() => [
  { key: 'name', label: t('hynDocs.entityPicker.fields.name'), placeholder: t('hynDocs.entityPicker.placeholders.name') },
  { key: 'code', label: t('hynDocs.entityPicker.fields.code'), placeholder: t('hynDocs.entityPicker.placeholders.code') }
]);

const benchmarkAdapter: HynEntityAdapter<DemoEntityRow, DemoEntityQuery> = {
  async fetchPage(query) {
    const keyword = String(query.name ?? '').trim();
    const code = String(query.code ?? '').trim();
    const filteredRows = benchmarkRows.value.filter(row => {
      const nameMatched = keyword ? row.name.includes(keyword) : true;
      const codeMatched = code ? row.code.includes(code) : true;
      return nameMatched && codeMatched;
    });
    const pageNum = Number(query.pageNum ?? 1);
    const pageSize = Number(query.pageSize ?? 20);
    return {
      total: filteredRows.length,
      rows: filteredRows.slice((pageNum - 1) * pageSize, pageNum * pageSize)
    };
  },
  async fetchByKeys(keys) {
    const keySet = new Set(keys.map(key => String(key)));
    return benchmarkRows.value.filter(row => keySet.has(String(row.id)));
  },
  getKey: row => row.id,
  getLabel: row => row.name,
  getDisabled: row => row.status === '1',
  createInitialQuery: () => ({
    pageNum: 1,
    pageSize: 10,
    name: '',
    code: ''
  })
};

const legacySelectEnabled = computed(() => benchmarkRows.value.length <= legacyRenderLimit);
const legacyOptionRows = computed<DemoEntityRow[]>(() => (legacySelectEnabled.value ? benchmarkRows.value : []));
const legacySelectPlaceholder = computed(() =>
  legacySelectEnabled.value
    ? t('hynDocs.entityPicker.benchmark.legacyPlaceholder')
    : t('hynDocs.entityPicker.benchmark.legacySkippedPlaceholder', { limit: legacyRenderLimit })
);

const benchmarkMetrics = computed<DocMetric[]>(() => [
  {
    label: t('hynDocs.entityPicker.benchmark.metrics.total.label'),
    value: `${benchmarkRows.value.length}`,
    note: t('hynDocs.entityPicker.benchmark.metrics.total.note')
  },
  {
    label: t('hynDocs.entityPicker.benchmark.metrics.legacyDom.label'),
    value: legacySelectEnabled.value ? `${legacyOptionDomCount.value}` : t('hynDocs.entityPicker.benchmark.metrics.skippedValue'),
    note: legacySelectEnabled.value
      ? t('hynDocs.entityPicker.benchmark.metrics.legacyDom.note')
      : t('hynDocs.entityPicker.benchmark.metrics.legacyDom.skippedNote', { limit: legacyRenderLimit })
  },
  {
    label: t('hynDocs.entityPicker.benchmark.metrics.virtualDom.label'),
    value: `${virtualOptionDomCount.value}`,
    note: t('hynDocs.entityPicker.benchmark.metrics.virtualDom.note')
  },
  {
    label: t('hynDocs.entityPicker.benchmark.metrics.legacyCost.label'),
    value: legacySelectEnabled.value ? `${legacyOpenCost.value.toFixed(1)}ms` : t('hynDocs.entityPicker.benchmark.metrics.skippedValue'),
    note: legacySelectEnabled.value
      ? t('hynDocs.entityPicker.benchmark.metrics.legacyCost.note')
      : t('hynDocs.entityPicker.benchmark.metrics.legacyCost.skippedNote')
  }
]);

const remoteSelectRows = computed<ApiRow[]>(() => [
  { name: 'modelValue / v-model', type: 'HynEntityModelValue', description: t('hynDocs.entityPicker.remoteSelectApi.rows.modelValue') },
  { name: 'adapter', type: 'HynEntityAdapter<TRow, TQuery>', description: t('hynDocs.entityPicker.remoteSelectApi.rows.adapter') },
  { name: 'searchParam', type: 'Extract<keyof TQuery, string>', description: t('hynDocs.entityPicker.remoteSelectApi.rows.searchParam') },
  { name: 'pageSize', type: 'number', description: t('hynDocs.entityPicker.remoteSelectApi.rows.pageSize') },
  { name: 'multiple', type: 'boolean', description: t('hynDocs.entityPicker.remoteSelectApi.rows.multiple') },
  { name: 'placeholder', type: 'string', description: t('hynDocs.entityPicker.remoteSelectApi.rows.placeholder') },
  { name: 'disabled', type: 'boolean', description: t('hynDocs.entityPicker.remoteSelectApi.rows.disabled') },
  { name: 'clearable', type: 'boolean', description: t('hynDocs.entityPicker.remoteSelectApi.rows.clearable') },
  { name: 'collapseTags', type: 'boolean', description: t('hynDocs.entityPicker.remoteSelectApi.rows.collapseTags') },
  { name: 'maxCollapseTags', type: 'number', description: t('hynDocs.entityPicker.remoteSelectApi.rows.maxCollapseTags') },
  { name: 'dropdownHeight', type: 'number', description: t('hynDocs.entityPicker.remoteSelectApi.rows.dropdownHeight') },
  { name: 'optionHeight', type: 'number', description: t('hynDocs.entityPicker.remoteSelectApi.rows.optionHeight') },
  { name: 'teleported', type: 'boolean', description: t('hynDocs.entityPicker.remoteSelectApi.rows.teleported') },
  { name: 'change', type: '(value, rows) => void', description: t('hynDocs.entityPicker.remoteSelectApi.rows.change') },
  { name: 'clear', type: '() => void', description: t('hynDocs.entityPicker.remoteSelectApi.rows.clear') }
]);

const entityPickerRows = computed<ApiRow[]>(() => [
  { name: 'modelValue / v-model', type: 'HynEntityModelValue', description: t('hynDocs.entityPicker.entityPickerApi.rows.modelValue') },
  { name: 'visible / v-model:visible', type: 'boolean', description: t('hynDocs.entityPicker.entityPickerApi.rows.visible') },
  { name: 'title', type: 'string', description: t('hynDocs.entityPicker.entityPickerApi.rows.title') },
  { name: 'adapter', type: 'HynEntityAdapter<TRow, TQuery>', description: t('hynDocs.entityPicker.entityPickerApi.rows.adapter') },
  { name: 'columns', type: 'HynEntityPickerColumn<TRow>[]', description: t('hynDocs.entityPicker.entityPickerApi.rows.columns') },
  { name: 'searchFields', type: 'HynEntitySearchField<TQuery>[]', description: t('hynDocs.entityPicker.entityPickerApi.rows.searchFields') },
  { name: 'multiple', type: 'boolean', description: t('hynDocs.entityPicker.entityPickerApi.rows.multiple') },
  { name: 'pageSize', type: 'number', description: t('hynDocs.entityPicker.entityPickerApi.rows.pageSize') },
  { name: 'emptyText', type: 'string', description: t('hynDocs.entityPicker.entityPickerApi.rows.emptyText') },
  { name: 'dialogWidth', type: 'string', description: t('hynDocs.entityPicker.entityPickerApi.rows.dialogWidth') },
  { name: 'dialogTop', type: 'string', description: t('hynDocs.entityPicker.entityPickerApi.rows.dialogTop') },
  { name: 'showSelectedTags', type: 'boolean', description: t('hynDocs.entityPicker.entityPickerApi.rows.showSelectedTags') },
  { name: 'confirm', type: '(rows, value) => void', description: t('hynDocs.entityPicker.entityPickerApi.rows.confirm') },
  { name: 'change', type: '(value, rows) => void', description: t('hynDocs.entityPicker.entityPickerApi.rows.change') },
  { name: 'cancel', type: '() => void', description: t('hynDocs.entityPicker.entityPickerApi.rows.cancel') }
]);

const apiRows = computed<ApiRow[]>(() => [
  { name: 'adapter', type: 'HynEntityAdapter', description: t('hynDocs.entityPicker.reference.rows.adapter') },
  { name: 'HynRemoteSelect', type: 'Component', description: t('hynDocs.entityPicker.reference.rows.remoteSelect') },
  { name: 'HynEntityPicker', type: 'Component', description: t('hynDocs.entityPicker.reference.rows.entityPicker') },
  { name: 'searchFields', type: 'HynEntitySearchField[]', description: t('hynDocs.entityPicker.reference.rows.searchFields') }
]);

const visualRows = computed<ApiRow[]>(() => [
  { name: 'selector-dialog', type: t('hynDocs.entityPicker.visual.rows.selectorDialog.type'), description: t('hynDocs.entityPicker.visual.rows.selectorDialog.description') },
  { name: 'dialogWidth', type: t('hynDocs.entityPicker.visual.rows.dialogWidth.type'), description: t('hynDocs.entityPicker.visual.rows.dialogWidth.description') },
  { name: 'showSelectedTags', type: t('hynDocs.entityPicker.visual.rows.showSelectedTags.type'), description: t('hynDocs.entityPicker.visual.rows.showSelectedTags.description') }
]);

const ruleDoItems = computed(() => [
  t('hynDocs.entityPicker.rules.doItems.adapter'),
  t('hynDocs.entityPicker.rules.doItems.fetchByKeys'),
  t('hynDocs.entityPicker.rules.doItems.crossPage'),
  t('hynDocs.entityPicker.rules.doItems.remoteField')
]);

const ruleDontItems = computed(() => [
  t('hynDocs.entityPicker.rules.dontItems.fullSelect'),
  t('hynDocs.entityPicker.rules.dontItems.omitFetchByKeys'),
  t('hynDocs.entityPicker.rules.dontItems.smallEnum'),
  t('hynDocs.entityPicker.rules.dontItems.styleOverride'),
  t('hynDocs.entityPicker.rules.dontItems.guessBusinessLabels')
]);

/** 生成指定数量的基准实体行，文档示例行名随当前语言切换。 */
function createBenchmarkRows(size: number): DemoEntityRow[] {
  return Array.from({ length: size }, (_, index) => {
    const status: DemoEntityStatus = index % 9 === 0 ? '1' : '0';
    return {
      id: index + 1,
      name: t('hynDocs.entityPicker.benchmark.demoName', { index: index + 1 }),
      code: `DEMO_${String(index + 1).padStart(5, '0')}`,
      status,
      statusLabel: t(status === '0' ? 'hynDocs.entityPicker.status.enabled' : 'hynDocs.entityPicker.status.disabled')
    };
  });
}

/** 切换基准数据量并重置选择状态。 */
function handleSizeChange(): void {
  legacyValue.value = [];
  remoteValue.value = [];
  pickerValue.value = [];
  selectedPickerRows.value = [];
  legacyOptionDomCount.value = 0;
  virtualOptionDomCount.value = 0;
  legacyOpenCost.value = 0;
  void nextTick(measureBenchmark);
}

/** 统计当前可见弹层中的选项 DOM 数量。 */
function measureBenchmark(): void {
  legacyOptionDomCount.value = document.querySelectorAll('.el-select-dropdown__item').length;
  virtualOptionDomCount.value = document.querySelectorAll('.el-select-v2__item').length;
}

/** 记录普通下拉打开后的近似耗时。 */
function handleSelectVisibleChange(kind: string, visible: boolean): void {
  if (kind !== 'legacy') {
    return;
  }
  if (visible) {
    legacyOpenStart.value = performance.now();
    requestAnimationFrame(() => {
      legacyOpenCost.value = performance.now() - legacyOpenStart.value;
      measureBenchmark();
    });
  }
}

/** 文档示例只保留选择事件闭环。 */
function handleRemoteChange(): void {
  void nextTick(measureBenchmark);
}

/** 弹窗确认后展示选择数量。 */
function handlePickerConfirm(rows: DemoEntityRow[]): void {
  selectedPickerRows.value = rows;
}

onMounted(() => {
  handleSizeChange();
});
</script>
