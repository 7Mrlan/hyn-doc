<template>
  <div class="hyn-doc-page">
    <header class="hyn-doc-hero">
      <div>
        <span class="hyn-doc-kicker">{{ t('hynDocs.dialog.hero.kicker') }}</span>
        <h1>{{ t('hynDocs.dialog.hero.title') }}</h1>
        <p>{{ t('hynDocs.dialog.hero.description') }}</p>
        <div class="hyn-doc-pill-row">
          <span>{{ t('hynDocs.dialog.hero.pills.schema') }}</span>
          <span>{{ t('hynDocs.dialog.hero.pills.renderers') }}</span>
          <span>{{ t('hynDocs.dialog.hero.pills.validate') }}</span>
          <span>{{ t('hynDocs.dialog.hero.pills.slot') }}</span>
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
        <span class="hyn-doc-kicker">{{ t('hynDocs.dialog.live.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.dialog.live.title') }}</h2>
        <p>{{ t('hynDocs.dialog.live.description') }}</p>
      </div>
      <el-button type="primary" plain @click="openDemoDialog">{{ t('hynDocs.dialog.live.openButton') }}</el-button>
      <hyn-dialog
        ref="demoDialogRef"
        v-model="dialogVisible"
        :title="t('hynDocs.dialog.live.dialogTitle')"
        width="640px"
        :model="demoForm"
        :fields="demoFields"
        :rules="demoRules"
        label-width="92px"
        :form-loading="confirmLoading"
        :confirm-loading="confirmLoading"
        @submit="handleSubmit"
        @cancel="handleCancel"
        @closed="resetDemoForm"
      />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.dialog.aiCopy.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.dialog.aiCopy.title') }}</h2>
        <p>{{ t('hynDocs.dialog.aiCopy.description') }}</p>
      </div>
      <doc-code-block :title="t('hynDocs.dialog.aiCopy.codeTitle')" :code="t('hynDocs.dialog.aiCopy.code')" />
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.dialog.recipes.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.dialog.recipes.title') }}</h2>
        <p>{{ t('hynDocs.dialog.recipes.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <article v-for="recipe in fieldRecipes" :key="recipe.type" class="hyn-doc-card">
          <div class="hyn-doc-tag-row">
            <span class="hyn-doc-tag">{{ recipe.type }}</span>
            <span class="hyn-doc-tag" :class="recipe.tagClass">{{ recipe.span }}</span>
          </div>
          <h2>{{ recipe.title }}</h2>
          <p>{{ recipe.description }}</p>
          <doc-code-block :title="recipe.codeTitle" :code="recipe.code" />
        </article>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.dialog.reference.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.dialog.reference.title') }}</h2>
        <p>{{ t('hynDocs.dialog.reference.description') }}</p>
      </div>
      <div class="hyn-doc-api-table" role="table" :aria-label="t('hynDocs.dialog.reference.aria')">
        <div class="hyn-doc-api-table__row is-head" role="row">
          <span>{{ t('hynDocs.dialog.reference.columns.field') }}</span>
          <span>{{ t('hynDocs.dialog.reference.columns.type') }}</span>
          <span>{{ t('hynDocs.dialog.reference.columns.description') }}</span>
        </div>
        <div v-for="item in dialogApiRows" :key="item.name" class="hyn-doc-api-table__row" role="row">
          <code>{{ item.name }}</code>
          <span>{{ item.type }}</span>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.dialog.boundary.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.dialog.boundary.title') }}</h2>
        <p>{{ t('hynDocs.dialog.boundary.description') }}</p>
      </div>
      <div class="hyn-doc-grid is-two">
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-mint">{{ t('hynDocs.dialog.boundary.doTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in boundaryDoItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <article class="hyn-doc-card">
          <span class="hyn-doc-tag is-danger">{{ t('hynDocs.dialog.boundary.dontTag') }}</span>
          <ul class="hyn-doc-check-list">
            <li v-for="item in boundaryDontItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="hyn-doc-section">
      <div class="hyn-doc-section__heading">
        <span class="hyn-doc-kicker">{{ t('hynDocs.dialog.acceptance.kicker') }}</span>
        <h2 data-doc-heading>{{ t('hynDocs.dialog.acceptance.title') }}</h2>
        <p>{{ t('hynDocs.dialog.acceptance.description') }}</p>
      </div>
      <div class="hyn-doc-two-column">
        <article class="hyn-doc-card">
          <h2>{{ t('hynDocs.dialog.acceptance.manualTitle') }}</h2>
          <ul class="hyn-doc-check-list">
            <li v-for="item in acceptanceItems" :key="item">{{ item }}</li>
          </ul>
        </article>
        <doc-code-block :title="t('hynDocs.dialog.acceptance.codeTitle')" :code="t('hynDocs.dialog.acceptance.code')" />
      </div>
    </section>
  </div>
</template>

<script setup name="HynDialogDoc" lang="ts">
import type { FormRules } from 'element-plus';
import type { HynDialogExpose, HynDialogField } from '@7mrlan/hyn-ui/types';
import modal from '@/plugins/modal';
import { useAppI18n } from '@/utils/i18n';
import DocCodeBlock from '../DocCodeBlock.vue';

interface DemoDialogForm {
  postName: string;
  postCode: string;
  postSort: number;
  status: '0' | '1';
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

interface FieldRecipe {
  type: string;
  title: string;
  span: string;
  tagClass: string;
  codeTitle: string;
  description: string;
  code: string;
}

const { t } = useAppI18n();
const dialogVisible = ref(false);
const confirmLoading = ref(false);
const demoDialogRef = ref<HynDialogExpose>();
const demoForm = ref<DemoDialogForm>(createInitialDemoForm());

const demoRules = computed<FormRules<DemoDialogForm>>(() => ({
  postName: [{ required: true, message: t('app.systemPost.rule.postName'), trigger: 'blur' }],
  postCode: [{ required: true, message: t('app.systemPost.rule.postCode'), trigger: 'blur' }],
  postSort: [{ required: true, message: t('app.systemPost.rule.postSort'), trigger: 'blur' }]
}));

const metrics = computed<DocMetric[]>(() => [
  createMetric('defaultMode'),
  createMetric('submitFlow'),
  createMetric('escapeHatch')
]);

const demoFields = computed<HynDialogField<DemoDialogForm>[]>(() => [
  {
    key: 'postName',
    label: t('app.systemPost.field.postName'),
    prop: 'postName',
    type: 'input',
    placeholder: t('app.systemPost.placeholder.postName'),
    maxlength: 30
  },
  {
    key: 'postCode',
    label: t('app.systemPost.field.postCode'),
    prop: 'postCode',
    type: 'input',
    placeholder: t('app.systemPost.placeholder.postCode'),
    tooltip: t('hynDocs.dialog.live.postCodeTooltip')
  },
  { key: 'postSort', label: t('app.systemPost.field.postSort'), prop: 'postSort', type: 'number', min: 0, step: 1 },
  {
    key: 'status',
    label: t('app.systemPost.field.status'),
    prop: 'status',
    type: 'radio',
    options: [
      { label: t('hynDocs.dialog.live.status.enabled'), value: '0' },
      { label: t('hynDocs.dialog.live.status.disabled'), value: '1' }
    ]
  },
  {
    key: 'remark',
    label: t('app.systemPost.field.remark'),
    prop: 'remark',
    type: 'textarea',
    rows: 4,
    placeholder: t('app.systemPost.placeholder.remark')
  }
]);

const dialogApiRows = computed<DocApiRow[]>(() => [
  { name: 'v-model', type: 'boolean', description: t('hynDocs.dialog.reference.rows.modelValue') },
  { name: 'title', type: 'string', description: t('hynDocs.dialog.reference.rows.title') },
  { name: 'width / top', type: 'string', description: t('hynDocs.dialog.reference.rows.widthTop') },
  { name: 'confirmText / cancelText', type: 'string', description: t('hynDocs.dialog.reference.rows.buttonText') },
  { name: 'confirmLoading', type: 'boolean', description: t('hynDocs.dialog.reference.rows.confirmLoading') },
  { name: 'showFooter', type: 'boolean', description: t('hynDocs.dialog.reference.rows.showFooter') },
  { name: 'model', type: 'TModel', description: t('hynDocs.dialog.reference.rows.model') },
  { name: 'fields', type: 'HynDialogField<TModel>[]', description: t('hynDocs.dialog.reference.rows.fields') },
  { name: 'rules', type: 'FormRules<TModel>', description: t('hynDocs.dialog.reference.rows.rules') },
  { name: 'columns', type: '1 | 2', description: t('hynDocs.dialog.reference.rows.columns') },
  { name: 'labelWidth', type: 'string | number', description: t('hynDocs.dialog.reference.rows.labelWidth') },
  { name: '@submit', type: '(model) => void', description: t('hynDocs.dialog.reference.rows.submit') },
  { name: '@confirm', type: '() => void', description: t('hynDocs.dialog.reference.rows.confirm') },
  { name: 'expose', type: 'validate/resetFields/clearValidate/scrollToField/getFormRef', description: t('hynDocs.dialog.reference.rows.expose') }
]);

const fieldRecipes = computed<FieldRecipe[]>(() => [
  createFieldRecipe('input', ''),
  createFieldRecipe('textarea', 'is-mint'),
  createFieldRecipe('number', ''),
  createFieldRecipe('select', ''),
  createFieldRecipe('radio', ''),
  createFieldRecipe('checkbox', 'is-mint'),
  createFieldRecipe('switch', ''),
  createFieldRecipe('date', ''),
  createFieldRecipe('dateRange', 'is-mint'),
  createFieldRecipe('treeSelect', 'is-mint'),
  createFieldRecipe('remoteSelect', 'is-mint'),
  createFieldRecipe('iconSelect', ''),
  createFieldRecipe('editor', 'is-mint'),
  createFieldRecipe('imageUpload', 'is-mint'),
  createFieldRecipe('fileUpload', 'is-mint'),
  createFieldRecipe('filePicker', 'is-mint'),
  createFieldRecipe('display', 'is-amber'),
  createFieldRecipe('slot', 'is-amber')
]);

const boundaryDoItems = computed<string[]>(() => [
  t('hynDocs.dialog.boundary.doItems.modelFields'),
  t('hynDocs.dialog.boundary.doItems.tooltip'),
  t('hynDocs.dialog.boundary.doItems.filePicker'),
  t('hynDocs.dialog.boundary.doItems.slotContent'),
  t('hynDocs.dialog.boundary.doItems.childComponent')
]);

const boundaryDontItems = computed<string[]>(() => [
  t('hynDocs.dialog.boundary.dontItems.rawGrid'),
  t('hynDocs.dialog.boundary.dontItems.extraClasses'),
  t('hynDocs.dialog.boundary.dontItems.deepOverrides'),
  t('hynDocs.dialog.boundary.dontItems.permissionTree')
]);

const acceptanceItems = computed<string[]>(() => [
  t('hynDocs.dialog.acceptance.items.numberBorder'),
  t('hynDocs.dialog.acceptance.items.columns'),
  t('hynDocs.dialog.acceptance.items.fullFields'),
  t('hynDocs.dialog.acceptance.items.bodyScroll'),
  t('hynDocs.dialog.acceptance.items.loading')
]);

/** 创建文档示例弹窗的初始表单，避免重置时复用旧对象引用。 */
function createInitialDemoForm(): DemoDialogForm {
  return {
    postName: '',
    postCode: '',
    postSort: 0,
    status: '0',
    remark: ''
  };
}

/** 按语言包 key 创建顶部指标卡片。 */
function createMetric(metricKey: string): DocMetric {
  return {
    label: t(`hynDocs.dialog.metrics.${metricKey}.label`),
    value: t(`hynDocs.dialog.metrics.${metricKey}.value`),
    note: t(`hynDocs.dialog.metrics.${metricKey}.note`)
  };
}

/** 按语言包 key 创建字段配置 recipe。 */
function createFieldRecipe(recipeKey: string, tagClass: string): FieldRecipe {
  return {
    type: t(`hynDocs.dialog.recipes.items.${recipeKey}.type`),
    title: t(`hynDocs.dialog.recipes.items.${recipeKey}.title`),
    span: t(`hynDocs.dialog.recipes.items.${recipeKey}.span`),
    tagClass,
    codeTitle: t('hynDocs.dialog.recipes.codeTitle', { type: t(`hynDocs.dialog.recipes.items.${recipeKey}.type`) }),
    description: t(`hynDocs.dialog.recipes.items.${recipeKey}.description`),
    code: t(`hynDocs.dialog.recipes.items.${recipeKey}.code`)
  };
}

/** 打开文档示例弹窗并重置 loading，避免多次演示时残留提交状态。 */
function openDemoDialog(): void {
  confirmLoading.value = false;
  dialogVisible.value = true;
}

/** 文档示例模拟提交闭环，真实页面应在这里调用新增或修改接口。 */
async function handleSubmit(): Promise<void> {
  confirmLoading.value = true;
  await new Promise<void>(resolve => {
    window.setTimeout(resolve, 360);
  });
  confirmLoading.value = false;
  dialogVisible.value = false;
  modal.msgSuccess(t('hynDocs.dialog.live.submitSuccess'));
}

/** 取消时只关闭弹窗，表单重置统一放到 closed，保持过渡动画稳定。 */
function handleCancel(): void {
  dialogVisible.value = false;
}

/** 弹窗完全关闭后重置示例表单，避免下次打开看到上次输入。 */
function resetDemoForm(): void {
  demoForm.value = createInitialDemoForm();
  demoDialogRef.value?.clearValidate();
}
</script>
