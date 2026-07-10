<template>
  <hyn-dialog
    v-model="dialogVisible"
    :title="t('quartzCron.title')"
    width="900px"
    top="5vh"
    :confirm-text="t('quartzCron.actions.confirm')"
    :cancel-text="t('quartzCron.actions.cancel')"
    :close-on-click-modal="false"
    body-class="hyn-cron-dialog__body"
    @confirm="confirmExpression"
    @cancel="closeDialog"
  >
    <div class="hyn-cron-dialog">
      <el-alert
        v-if="showRawModeAlert"
        class="hyn-cron-dialog__alert"
        type="warning"
        :closable="false"
        show-icon
        :title="t('quartzCron.rawModeTitle')"
        :description="rawModeReason || t('quartzCron.rawModeMessage')"
      />

      <section class="hyn-cron-dialog__visual">
        <div class="hyn-cron-dialog__section-title">{{ t('quartzCron.visualTitle') }}</div>
        <hyn-cron-visual-editor
          v-model:active-tab="activeTab"
          class="hyn-cron-dialog__visual-editor"
          :model="cronModel"
          :disabled="!visualEditable"
        />
      </section>

      <section class="hyn-cron-dialog__summary" :class="{ 'is-error': !summary.valid }">
        <div class="hyn-cron-dialog__summary-head">
          <div class="hyn-cron-dialog__section-title">{{ t('quartzCron.summaryTitle') }}</div>
          <div class="hyn-cron-dialog__chip" :class="{ 'is-error': !summary.valid }">
            <span class="hyn-cron-dialog__chip-label">{{ t('quartzCron.generatedExpression') }}</span>
            <code class="hyn-cron-dialog__chip-code">{{ draftExpression || '--' }}</code>
            <el-tooltip :content="t('quartzCron.actions.copy')" placement="top">
              <el-button
                class="hyn-cron-dialog__copy"
                link
                :icon="DocumentCopy"
                :disabled="!summary.valid"
                @click="copyExpression"
              />
            </el-tooltip>
          </div>
        </div>

        <template v-if="summary.valid">
          <div class="hyn-cron-dialog__descriptions">
            <div class="hyn-cron-dialog__description">
              <span>{{ t('quartzCron.summary.zh') }}</span>
              <p :title="summary.descriptionZh">{{ summary.descriptionZh }}</p>
            </div>
            <div class="hyn-cron-dialog__description">
              <span>{{ t('quartzCron.summary.en') }}</span>
              <p :title="summary.descriptionEn">{{ summary.descriptionEn }}</p>
            </div>
          </div>

          <el-alert
            v-if="summary.highFrequency"
            class="hyn-cron-dialog__alert"
            type="warning"
            :closable="false"
            show-icon
            :title="t('quartzCron.highFrequencyWarning')"
          />

          <el-alert
            v-if="!summary.previewSupported"
            class="hyn-cron-dialog__alert"
            type="warning"
            :closable="false"
            show-icon
            :title="summary.previewWarning || t('quartzCron.previewUnavailable')"
          />

          <div class="hyn-cron-dialog__runs" :class="{ 'is-empty': !summary.nextRuns.length }">
            <span class="hyn-cron-dialog__runs-title">{{ t('quartzCron.nextRuns') }}</span>
            <div class="hyn-cron-dialog__run-list">
              <el-tag v-for="runTime in summary.nextRuns" :key="runTime" effect="plain" round disable-transitions>
                {{ runTime }}
              </el-tag>
              <el-tag v-if="!summary.nextRuns.length" effect="plain" round disable-transitions>
                {{ summary.previewWarning || t('quartzCron.previewUnavailable') }}
              </el-tag>
            </div>
          </div>
        </template>
        <p v-else class="hyn-cron-dialog__error">{{ summaryErrorText }}</p>
      </section>
    </div>
  </hyn-dialog>
</template>

<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue';
import HynDialog from '../HynDialog/index.vue';
import { modal } from '@7mrlan/hyn-ui/runtime';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import HynCronVisualEditor from './HynCronVisualEditor.vue';
import type { QuartzCronModel, QuartzCronTabKey } from './quartzCron';
import {
  buildQuartzCronExpression,
  createDefaultQuartzCronModel,
  getDefaultQuartzExpression,
  getQuartzCronSummary,
  normalizeQuartzExpression,
  parseQuartzExpressionToModel,
  resolveQuartzCronActiveTab
} from './quartzCron';

/** Cron 可视化生成器弹窗参数。 */
interface Props {
  /** 弹窗显示状态，由外层 HYN Cron 输入组件通过 v-model 控制。 */
  modelValue: boolean;
  /** 打开弹窗时带入的 Quartz Cron 表达式，空值会使用项目默认表达式。 */
  expression: string;
}

/** Cron 可视化生成器弹窗向外同步的事件。 */
interface Emits {
  /** 弹窗显示状态变化事件。 */
  'update:modelValue': [value: boolean];
  /** 用户确认后的 Quartz Cron 表达式，用于回写表单字段。 */
  confirm: [expression: string];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useHynI18n();

const currentYear = new Date().getFullYear();
// Cron 弹窗当前页签决定原始表达式和可视化编辑器之间的同步方向。
const activeTab = ref<QuartzCronTabKey>('second');
const draftExpression = ref('');
// 可视化编辑器使用结构化 Cron 模型，避免每次交互都直接拼接原始字符串。
const cronModel = ref<QuartzCronModel>(createDefaultQuartzCronModel(currentYear));
// 可视化编辑能力取决于当前表达式是否能解析，非法表达式只能保留原始编辑入口。
const visualEditable = ref(true);
const rawModeReason = ref('');
// 原始表达式同步保护位用于阻断 watch 互相回写造成的循环更新。
let syncingFromRaw = false;
// 可视化编辑同步保护位用于区分用户改动和程序性模型回填。
let syncingFromVisual = false;

// 弹窗可见状态由组件内部托管，关闭后才能安全重置临时编辑状态。
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});
const summary = computed(() => getQuartzCronSummary(draftExpression.value));
const showRawModeAlert = computed(() => Boolean(normalizeQuartzExpression(draftExpression.value)) && !visualEditable.value);
const summaryErrorText = computed(() => summary.value.errorMessage ?? t('quartzCron.invalidExpression'));

watch(
  () => props.modelValue,
  visible => {
    if (visible) {
      resetDialogState(props.expression);
    }
  },
  { immediate: true }
);

watch(draftExpression, expression => {
  if (syncingFromVisual || syncingFromRaw) {
    return;
  }
  syncVisualModelFromExpression(expression);
});

watch(
  cronModel,
  model => {
    if (syncingFromRaw || !visualEditable.value) {
      return;
    }
    const nextExpression = buildQuartzCronExpression(model);
    if (nextExpression !== draftExpression.value) {
      syncingFromVisual = true;
      draftExpression.value = nextExpression;
      nextTick(() => {
        syncingFromVisual = false;
      });
    }
  },
  { deep: true }
);

/** 打开弹窗时同步外部表达式；空值使用项目默认 Cron。 */
function resetDialogState(expression: string): void {
  const normalizedExpression = normalizeQuartzExpression(expression);
  const nextExpression = normalizedExpression || getDefaultQuartzExpression();
  syncingFromRaw = true;
  draftExpression.value = nextExpression;
  applyParseResult(nextExpression);
  nextTick(() => {
    syncingFromRaw = false;
  });
}

/** 表达式变化时尝试回显到可视化模型，复杂表达式保持原值并切换只读提示。 */
function syncVisualModelFromExpression(expression: string): void {
  syncingFromRaw = true;
  applyParseResult(expression);
  nextTick(() => {
    syncingFromRaw = false;
  });
}

/** 应用解析结果，复杂表达式不覆盖用户已有的原始值。 */
function applyParseResult(expression: string): void {
  const parseResult = parseQuartzExpressionToModel(expression, currentYear);
  visualEditable.value = parseResult.editable;
  rawModeReason.value = parseResult.reason ?? '';
  if (parseResult.editable) {
    cronModel.value = parseResult.model;
    activeTab.value = resolveQuartzCronActiveTab(parseResult.model);
  }
}

/** 复制当前有效表达式，失败时显式提示浏览器权限或环境问题。 */
async function copyExpression(): Promise<void> {
  if (!summary.value.valid) {
    return;
  }
  try {
    await navigator.clipboard.writeText(summary.value.expression);
    modal.msgSuccess(t('quartzCron.actions.copied'));
  } catch (error) {
    modal.msgError(`${t('quartzCron.actions.copyFailed')}：${String(error)}`);
  }
}

/** 校验通过后把表达式交回调用方。 */
function confirmExpression(): void {
  const currentSummary = summary.value;
  if (!currentSummary.valid) {
    modal.msgError(currentSummary.errorMessage ?? t('quartzCron.invalidExpression'));
    return;
  }
  emit('confirm', currentSummary.expression);
  emit('update:modelValue', false);
}

/** 关闭弹窗时不回写未确认的草稿。 */
function closeDialog(): void {
  emit('update:modelValue', false);
}
</script>

<style lang="scss" scoped>
.hyn-cron-dialog {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 12px;
}

.hyn-cron-dialog__alert {
  margin: 0;
}

.hyn-cron-dialog__visual,
.hyn-cron-dialog__summary {
  min-width: 0;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--app-radius-base);
  background: var(--el-bg-color);
}

.hyn-cron-dialog__section-title {
  min-width: 0;
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.hyn-cron-dialog__visual {
  overflow: hidden;
}

.hyn-cron-dialog__visual > .hyn-cron-dialog__section-title {
  padding: 12px 14px 0;
}

.hyn-cron-dialog__visual-editor {
  width: calc(100% - 24px);
  margin: 10px 12px 12px;
}

.hyn-cron-dialog__summary {
  display: grid;
  gap: 10px;
  min-height: 206px;
  padding: 12px 14px;
  color: var(--el-text-color-regular);
  overflow: hidden;
}

.hyn-cron-dialog__summary.is-error {
  border-color: var(--el-color-danger-light-5);
  background: var(--el-color-danger-light-9);
}

.hyn-cron-dialog__summary-head {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.hyn-cron-dialog__chip {
  display: inline-flex;
  max-width: 100%;
  min-width: 0;
  align-items: center;
  gap: 8px;
  padding: 5px 7px 5px 6px;
  border: 1px solid #bdd4ca;
  border-radius: 999px;
  background: linear-gradient(180deg, #ffffff, #f4faf7);
  color: #18352c;
  box-shadow:
    0 1px 2px rgba(22, 78, 61, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.hyn-cron-dialog__chip.is-error {
  border-color: var(--el-color-danger-light-5);
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.hyn-cron-dialog__chip-label {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 5px;
  padding: 2px 7px;
  border-radius: 999px;
  background: #e8f5ef;
  color: #276653;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
}

.hyn-cron-dialog__chip-label::before {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #2f7d67;
  content: "";
}

.hyn-cron-dialog__chip-code {
  min-width: 0;
  overflow: hidden;
  color: inherit;
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hyn-cron-dialog__copy {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  color: #276653;
}

.hyn-cron-dialog__copy:hover {
  background: rgba(47, 125, 103, 0.12);
  color: #1f5647;
}

.hyn-cron-dialog__descriptions {
  display: grid;
  min-width: 0;
  align-content: start;
  gap: 7px;
}

.hyn-cron-dialog__description {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  gap: 9px;
  font-size: 13px;
  line-height: 1.55;
}

.hyn-cron-dialog__description span,
.hyn-cron-dialog__runs-title {
  color: var(--el-text-color-secondary);
  font-weight: 600;
}

.hyn-cron-dialog__description span {
  flex: none;
  padding: 1px 7px;
  border-radius: 999px;
  background: rgba(31, 86, 71, 0.06);
  box-shadow: inset 0 0 0 1px rgba(31, 86, 71, 0.08);
  color: #6f7b75;
  font-size: 12px;
  line-height: 18px;
}

.hyn-cron-dialog__description p,
.hyn-cron-dialog__error {
  min-width: 0;
  margin: 0;
}

.hyn-cron-dialog__description p {
  overflow-wrap: anywhere;
}

.hyn-cron-dialog__error {
  overflow-wrap: anywhere;
}

.hyn-cron-dialog__runs {
  display: grid;
  min-width: 0;
  min-height: 58px;
  align-content: start;
  gap: 8px;
}

.hyn-cron-dialog__run-list {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  min-height: 26px;
  min-width: 0;
  gap: 6px;
}

.hyn-cron-dialog__run-list :deep(.el-tag) {
  height: 26px;
  width: 100%;
  max-width: 100%;
  justify-content: center;
  border-color: #d8e4de;
  background: #fbfdfc;
  color: #2f3f38;
  font-family: Consolas, Monaco, "Courier New", monospace;
}

.hyn-cron-dialog__run-list :deep(.el-tag__content) {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .hyn-cron-dialog__summary {
    min-height: 292px;
  }

  .hyn-cron-dialog__description {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .hyn-cron-dialog__run-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
