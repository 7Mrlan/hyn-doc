<template>
  <div class="hyn-doc-page">
    <header class="hyn-doc-hero">
      <div>
        <span class="hyn-doc-kicker">{{ t('hynDocs.form.hero.kicker') }}</span>
        <h1>{{ t('hynDocs.form.hero.title') }}</h1>
        <p>{{ t('hynDocs.form.hero.description') }}</p>
        <div class="hyn-doc-pill-row">
          <span>{{ t('hynDocs.form.hero.pills.schema') }}</span>
          <span>{{ t('hynDocs.form.hero.pills.label') }}</span>
          <span>{{ t('hynDocs.form.hero.pills.alignment') }}</span>
          <span>{{ t('hynDocs.form.hero.pills.expose') }}</span>
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
        <span class="hyn-doc-kicker">{{ t('hynDocs.form.live.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.form.live.title') }}</h2>
        <p>{{ t('hynDocs.form.live.description') }}</p>
      </div>
      <div class="hyn-doc-demo-frame">
        <hyn-form ref="demoFormRef" :model="demoForm" :fields="demoFields" :rules="demoRules" label-width="96px" :columns="2">
          <template #owner="{ disabled }">
            <el-select v-model="demoForm.owner" filterable clearable :placeholder="t('hynDocs.form.live.ownerPlaceholder')" :disabled="disabled">
              <el-option :label="t('hynDocs.form.live.ownerOptions.platform')" value="platform" />
              <el-option :label="t('hynDocs.form.live.ownerOptions.business')" value="business" />
            </el-select>
          </template>
        </hyn-form>
        <div class="hyn-form-doc-actions">
          <el-button type="primary" plain @click="validateDemoForm">{{ t('hynDocs.form.live.validate') }}</el-button>
          <el-button @click="resetDemoForm">{{ t('hynDocs.form.live.reset') }}</el-button>
          <span class="hyn-doc-status" :class="validationPassed ? 'is-success' : 'is-muted'">{{ validationMessage }}</span>
        </div>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.form.aiCopy.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.form.aiCopy.title') }}</h2>
        <p>{{ t('hynDocs.form.aiCopy.description') }}</p>
      </div>
      <doc-code-block :title="t('hynDocs.form.aiCopy.codeTitle')" :code="t('hynDocs.form.aiCopy.code')" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.form.reference.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.form.reference.title') }}</h2>
        <p>{{ t('hynDocs.form.reference.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.form.reference.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.form.reference.columns.field') }}</span>
          <span>{{ t('hynDocs.form.reference.columns.type') }}</span>
          <span>{{ t('hynDocs.form.reference.columns.description') }}</span>
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
        <span class="hyn-doc-kicker">{{ t('hynDocs.form.boundary.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.form.boundary.title') }}</h2>
        <p>{{ t('hynDocs.form.boundary.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-mint">{{ t('hynDocs.form.boundary.doTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in boundaryDoItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-danger">{{ t('hynDocs.form.boundary.dontTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in boundaryDontItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.form.complexEditor.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.form.complexEditor.title') }}</h2>
        <p>{{ t('hynDocs.form.complexEditor.description') }}</p>
      </div>
      <doc-code-block :title="t('hynDocs.form.complexEditor.codeTitle')" :code="t('hynDocs.form.complexEditor.code')" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.form.acceptance.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.form.acceptance.title') }}</h2>
        <p>{{ t('hynDocs.form.acceptance.description') }}</p>
      </div>
      <div class="hyn-doc-two-column">
        <article class="hyn-doc-card">
          <h2>{{ t('hynDocs.form.acceptance.visualTitle') }}</h2>
          <ul class="hyn-doc-check-list">
            <li v-for="item in acceptanceItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <doc-code-block :title="t('hynDocs.form.acceptance.codeTitle')" :code="t('hynDocs.form.acceptance.code')" />
      </div>
    </section>
  </div>
</template>

<script setup name="HynFormDoc" lang="ts">
import type { FormRules } from 'element-plus';
import type { HynFormExpose, HynFormField } from '@7mrlan/hyn-ui/types';
import { useAppI18n } from '@/utils/i18n';
import DocCodeBlock from '../DocCodeBlock.vue';

type ValidationState = 'idle' | 'passed' | 'failed';

interface DemoForm {
  appName: string;
  appCode: string;
  priority: number;
  status: 'enabled' | 'disabled';
  tags: string[];
  owner: string;
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

const { t } = useAppI18n();
const demoFormRef = ref<HynFormExpose>();
const demoForm = ref<DemoForm>(createInitialDemoForm());
const validationState = ref<ValidationState>('idle');

const validationPassed = computed<boolean>(() => validationState.value === 'passed');
const validationMessage = computed<string>(() => t(`hynDocs.form.live.validation.${validationState.value}`));

const demoRules = computed<FormRules<DemoForm>>(() => ({
  appName: [{ required: true, message: t('hynDocs.form.live.rules.appName'), trigger: 'blur' }],
  appCode: [{ required: true, message: t('hynDocs.form.live.rules.appCode'), trigger: 'blur' }]
}));

const demoFields = computed<HynFormField<DemoForm>[]>(() => [
  {
    key: 'appName',
    label: t('hynDocs.form.live.fields.appName'),
    prop: 'appName',
    type: 'input',
    placeholder: t('hynDocs.form.live.placeholders.appName'),
    required: true
  },
  {
    key: 'appCode',
    label: t('hynDocs.form.live.fields.appCode'),
    prop: 'appCode',
    type: 'input',
    placeholder: t('hynDocs.form.live.placeholders.appCode'),
    tooltip: t('hynDocs.form.live.tooltips.appCode')
  },
  { key: 'priority', label: t('hynDocs.form.live.fields.priority'), prop: 'priority', type: 'number', min: 0, step: 1 },
  {
    key: 'status',
    label: t('hynDocs.form.live.fields.status'),
    prop: 'status',
    type: 'radio',
    options: [
      { label: t('hynDocs.form.live.status.enabled'), value: 'enabled' },
      { label: t('hynDocs.form.live.status.disabled'), value: 'disabled' }
    ]
  },
  {
    key: 'tags',
    label: t('hynDocs.form.live.fields.tags'),
    prop: 'tags',
    type: 'select',
    multiple: true,
    options: [
      { label: t('hynDocs.form.live.tags.core'), value: 'core' },
      { label: t('hynDocs.form.live.tags.external'), value: 'external' },
      { label: t('hynDocs.form.live.tags.frequent'), value: 'frequent' }
    ]
  },
  { key: 'owner', label: t('hynDocs.form.live.fields.owner'), prop: 'owner', type: 'slot', slot: 'owner' },
  { key: 'remark', label: t('hynDocs.form.live.fields.remark'), prop: 'remark', type: 'textarea', span: 'full', rows: 3 }
]);

const metrics = computed<DocMetric[]>(() => [
  {
    label: t('hynDocs.form.metrics.scope.label'),
    value: t('hynDocs.form.metrics.scope.value'),
    note: t('hynDocs.form.metrics.scope.note')
  },
  {
    label: t('hynDocs.form.metrics.dialog.label'),
    value: t('hynDocs.form.metrics.dialog.value'),
    note: t('hynDocs.form.metrics.dialog.note')
  },
  {
    label: t('hynDocs.form.metrics.guard.label'),
    value: t('hynDocs.form.metrics.guard.value'),
    note: t('hynDocs.form.metrics.guard.note')
  }
]);

const apiRows = computed<DocApiRow[]>(() => [
  { name: 'model', type: 'object', description: t('hynDocs.form.reference.rows.model') },
  { name: 'fields', type: 'HynFormField<TModel>[]', description: t('hynDocs.form.reference.rows.fields') },
  { name: 'rules', type: 'FormRules', description: t('hynDocs.form.reference.rows.rules') },
  { name: 'labelWidth', type: 'string | number', description: t('hynDocs.form.reference.rows.labelWidth') },
  { name: 'columns', type: '1 | 2', description: t('hynDocs.form.reference.rows.columns') },
  { name: 'loading', type: 'boolean', description: t('hynDocs.form.reference.rows.loading') },
  { name: 'validate()', type: 'Promise<boolean>', description: t('hynDocs.form.reference.rows.validate') },
  { name: 'getFormRef()', type: 'ElFormInstance | undefined', description: t('hynDocs.form.reference.rows.getFormRef') }
]);

const boundaryDoItems = computed<string[]>(() => [
  t('hynDocs.form.boundary.doItems.dialogFields'),
  t('hynDocs.form.boundary.doItems.inlineForm'),
  t('hynDocs.form.boundary.doItems.singleColumn'),
  t('hynDocs.form.boundary.doItems.complexSlot'),
  t('hynDocs.form.boundary.doItems.specialEditor')
]);

const boundaryDontItems = computed<string[]>(() => [
  t('hynDocs.form.boundary.dontItems.extraClasses'),
  t('hynDocs.form.boundary.dontItems.deepOverrides'),
  t('hynDocs.form.boundary.dontItems.radioLayout'),
  t('hynDocs.form.boundary.dontItems.dialogCss')
]);

const acceptanceItems = computed<string[]>(() => [
  t('hynDocs.form.acceptance.items.labelCenter'),
  t('hynDocs.form.acceptance.items.selectTag'),
  t('hynDocs.form.acceptance.items.inputNumber'),
  t('hynDocs.form.acceptance.items.responsive')
]);

/** 创建文档示例表单的初始值，避免重置时复用同一个对象引用。 */
function createInitialDemoForm(): DemoForm {
  return {
    appName: '',
    appCode: '',
    priority: 1,
    status: 'enabled',
    tags: ['core'],
    owner: '',
    remark: ''
  };
}

/** 触发表单校验并在文档页展示结果。 */
async function validateDemoForm(): Promise<void> {
  const valid = (await demoFormRef.value?.validate()) ?? false;
  validationState.value = valid ? 'passed' : 'failed';
}

/** 重置文档示例表单，清理校验状态。 */
function resetDemoForm(): void {
  demoForm.value = createInitialDemoForm();
  validationState.value = 'idle';
  nextTick(() => {
    demoFormRef.value?.clearValidate();
  });
}
</script>

<style lang="scss" scoped>
.hyn-form-doc-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
</style>
