<template>
  <div class="hyn-cron-expression" @mouseenter="preloadCronDialog" @focusin="preloadCronDialog">
    <el-input
      v-model="expressionModel"
      class="hyn-cron-expression__input"
      :placeholder="resolvedPlaceholder"
      clearable
      :disabled="disabled"
      @blur="normalizeExpression"
    >
      <template #append>
        <el-button :disabled="disabled" @click="openDialog">{{ resolvedButtonText }}</el-button>
      </template>
    </el-input>

    <hyn-cron-expression-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :expression="expressionModel"
      @confirm="confirmExpression"
    />
  </div>
</template>

<script setup lang="ts">
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';

type CronDialogModule = typeof import('./HynCronExpressionDialog.vue');

let cronDialogModulePromise: Promise<CronDialogModule> | undefined;

/** 复用同一个动态导入 Promise，避免 hover、focus、点击重复拉取 Cron 生成器 chunk。 */
function loadCronDialogModule(): Promise<CronDialogModule> {
  if (!cronDialogModulePromise) {
    cronDialogModulePromise = import('./HynCronExpressionDialog.vue');
  }
  return cronDialogModulePromise;
}

const HynCronExpressionDialog = defineAsyncComponent(loadCronDialogModule);

/** HYN Cron 表达式输入组件的公共参数。 */
interface Props {
  /** 当前表单绑定的 Quartz Cron 表达式文本。 */
  modelValue: string;
  /** 是否禁用输入框和可视化生成器入口。 */
  disabled?: boolean;
  /** 输入框占位文案，不传时使用项目内置 i18n 文案。 */
  placeholder?: string;
  /** 生成器按钮文案，不传时使用项目内置 i18n 文案。 */
  buttonText?: string;
}

/** HYN Cron 表达式输入组件对外同步的事件。 */
interface Emits {
  /** 输入框或生成器确认后输出的 Quartz Cron 表达式。 */
  'update:modelValue': [value: string];
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  placeholder: undefined,
  buttonText: undefined
});
const emit = defineEmits<Emits>();
const { t } = useHynI18n();
// 弹窗可见状态由组件内部托管，关闭后才能安全重置临时编辑状态。
const dialogVisible = ref(false);

// 外部 Cron 字符串的 v-model 桥接点，组件内部变更统一从这里向外同步。
const expressionModel = computed<string>({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
});

// 占位文案优先使用调用方配置，未配置时才回落到组件统一文案。
const resolvedPlaceholder = computed(() => props.placeholder ?? t('quartzCron.placeholder'));
// 按钮文案优先使用调用方配置，避免公共 Cron 组件绑定具体业务语气。
const resolvedButtonText = computed(() => props.buttonText ?? t('quartzCron.actions.generate'));

/** 打开可视化生成器，Cron 解析库随弹窗懒加载。 */
function openDialog(): void {
  preloadCronDialog();
  dialogVisible.value = true;
}

/** 用户产生打开意图时预加载生成器，减少点击后的空白等待。 */
function preloadCronDialog(): void {
  void loadCronDialogModule();
}

/** 字段挂载后在浏览器空闲期预加载，避免表单首屏和 Cron 点击体验相互拖累。 */
function scheduleIdlePreload(): void {
  if (typeof window === 'undefined') {
    return;
  }
  const browserWindow = globalThis as typeof globalThis & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  };
  const preload = (): void => {
    preloadCronDialog();
  };
  if (browserWindow.requestIdleCallback) {
    browserWindow.requestIdleCallback(preload, { timeout: 2500 });
    return;
  }
  globalThis.setTimeout(preload, 800);
}

/** 失焦时仅规范首尾空白，避免表单内出现不可见字符。 */
function normalizeExpression(): void {
  expressionModel.value = expressionModel.value.trim().replace(/\s+/g, ' ');
}

/** 确认后把生成器输出回写到表单字段。 */
function confirmExpression(expression: string): void {
  expressionModel.value = expression;
}

onMounted(() => {
  scheduleIdlePreload();
});
</script>

<style lang="scss" scoped>
.hyn-cron-expression {
  width: 100%;
  min-width: 0;
}

.hyn-cron-expression__input {
  width: 100%;
}
</style>
