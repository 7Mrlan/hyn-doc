<template>
  <el-config-provider :locale="elementLocale"><router-view /></el-config-provider>
  <aside v-if="resourceLoadFailed" class="hyn-doc-resource-error" role="alert">
    <strong>{{ t('hynDocs.demo.resourceLoadFailed') }}</strong>
    <p>{{ t('hynDocs.demo.reloadHint') }}</p>
    <button type="button" @click="reloadDocument">{{ t('app.common.refresh') }}</button>
  </aside>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCN from 'element-plus/es/locale/lang/zh-cn';
import enUS from 'element-plus/es/locale/lang/en';
import { docsLocale } from '@/i18n';
import { useAppI18n } from '@/utils/i18n';

/** 内置控件的分页、日期和弹窗辅助文案跟随文档语言。 */
const elementLocale = computed(() => docsLocale.value === 'zh_CN' ? zhCN : enUS);
/** 更新后旧页面可能引用已移除的 chunk，刷新必须由用户决定，以免丢失当前草稿。 */
const resourceLoadFailed = ref<boolean>(false);
const { t } = useAppI18n();

/** Vite 的资源加载失败仍向浏览器报告，同时让页面出现可见且可操作的恢复入口。 */
function handleResourceLoadFailure(): void {
  resourceLoadFailed.value = true;
}

/** 仅在用户确认后加载新页面；当前会话内的示例草稿会重置。 */
function reloadDocument(): void {
  window.location.reload();
}

onMounted(() => window.addEventListener('vite:preloadError', handleResourceLoadFailure));
onBeforeUnmount(() => window.removeEventListener('vite:preloadError', handleResourceLoadFailure));
</script>

<style scoped>
.hyn-doc-resource-error {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 10000;
  width: min(440px, calc(100vw - 32px));
  padding: 16px;
  border: 1px solid var(--el-color-danger);
  border-radius: var(--app-radius-base);
  background: var(--app-surface-bg);
  color: var(--app-text-title);
  box-shadow: var(--app-shadow-md);
}
.hyn-doc-resource-error button {
  padding: 6px 12px;
  border: 1px solid var(--app-surface-border);
  border-radius: var(--app-radius-md);
  background: var(--app-surface-muted);
  cursor: pointer;
}
</style>
