<template>
  <div ref="codeBlockRef" class="hyn-doc-code" :class="`is-${resolvedHeightMode}`">
    <div class="hyn-doc-code__bar">
      <span class="hyn-doc-code__title">{{ title }}</span>
      <span class="hyn-doc-code__meta">
        <span class="hyn-doc-code__language">{{ resolvedLanguage }}</span>
        <button type="button" class="hyn-doc-code__copy" @click="copyCode">{{ copyText }}</button>
      </span>
    </div>
    <div class="hyn-doc-code__body">
      <HighlightCode v-if="isVisible" :language="resolvedLanguage" :code="code" />
      <pre v-else aria-hidden="true"><code>{{ code }}</code></pre>
    </div>
    <p v-if="copyFailed" role="alert">{{ t('hynDocs.demo.copyFailed') }}</p>
  </div>
</template>

<script setup name="HynDocCodeBlock" lang="ts">
import HighlightJs from '@highlightjs/vue-plugin';
import { useAppI18n } from '@/utils/i18n';
import 'highlight.js/lib/common';
import 'highlight.js/styles/atom-one-dark.css';

/** HYN 文档页代码块组件参数。 */
interface Props {
  /** 代码块标题，通常说明示例场景或文件类型。 */
  title: string;
  /** 需要展示和复制的原始代码文本。 */
  code: string;
  /** highlight.js 语言标识，不传时默认按 TypeScript 高亮。 */
  language?: string;
  /** 代码块高度模式，用于在长文档中控制示例占用空间。 */
  heightMode?: 'compact' | 'normal' | 'expanded';
}

const props = defineProps<Props>();
const { t } = useAppI18n();
/** 成功和失败分别保留可见状态，权限或非安全环境不能表现成无反馈的按钮。 */
const copied = ref<boolean>(false);
/** 失败提示留在对应代码块内，用户可以保留代码后处理浏览器权限。 */
const copyFailed = ref<boolean>(false);
/** 复制成功提示和默认按钮名称跟随当前文档语言。 */
const copyText = computed<string>(() => t(copied.value ? 'hynDocs.demo.copied' : 'hynDocs.demo.copy'));
const HighlightCode = HighlightJs.component;
const codeBlockRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let observer: IntersectionObserver | undefined;
let copyResetTimer: number | undefined;

const resolvedLanguage = computed(() => props.language ?? 'typescript');
const resolvedHeightMode = computed(() => props.heightMode ?? 'normal');

/**
 * 代码块进入视口前先渲染轻量文本，避免大型文档页一次性执行全部高亮。
 */
const startLazyHighlight = (): void => {
  if (typeof IntersectionObserver === 'undefined') {
    isVisible.value = true;
    return;
  }

  observer = new IntersectionObserver(
    entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        isVisible.value = true;
        observer?.disconnect();
        observer = undefined;
      }
    },
    { rootMargin: '240px 0px' }
  );

  if (codeBlockRef.value) {
    observer.observe(codeBlockRef.value);
  }
};

/**
 * 复制原始代码；浏览器拒绝写入时显示错误并保留异常，不尝试隐式降级复制。
 */
const copyCode = async (): Promise<void> => {
  copyFailed.value = false;
  try {
    if (!navigator.clipboard) { throw new Error('Clipboard API requires HTTPS or localhost.'); }
    await navigator.clipboard.writeText(props.code);
  } catch (error: unknown) {
    copyFailed.value = true;
    throw error;
  }
  copied.value = true;
  if (copyResetTimer) {
    window.clearTimeout(copyResetTimer);
  }
  copyResetTimer = window.setTimeout(() => {
    copied.value = false;
  }, 1200);
};

onMounted(() => {
  startLazyHighlight();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  if (copyResetTimer) {
    window.clearTimeout(copyResetTimer);
  }
});
</script>
