import zhCNComponents from '@7mrlan/hyn-ui/locales/zh_CN';
import enUSComponents from '@7mrlan/hyn-ui/locales/en_US';
import { ref, watch } from 'vue';
import { createI18n } from 'vue-i18n';
import enUSApp from '@/locales.app.en-US';
import enUSHynDocs from '@/locales.en-US';
import zhCNApp from '@/locales.app.zh-CN';
import zhCNHynDocs from '@/locales.zh-CN';

export type DocsLocale = 'zh_CN' | 'en_US';

const browserLanguage = navigator.language.toLowerCase();
export const docsLocale = ref<DocsLocale>(browserLanguage.startsWith('zh') ? 'zh_CN' : 'en_US');

const i18n = createI18n({
  legacy: false,
  locale: docsLocale.value,
  fallbackLocale: 'en_US',
  warnHtmlMessage: false,
  messages: {
    zh_CN: { ...zhCNComponents, app: { ...zhCNApp, ...zhCNComponents.app }, hynDocs: zhCNHynDocs },
    en_US: { ...enUSComponents, app: { ...enUSApp, ...enUSComponents.app }, hynDocs: enUSHynDocs }
  }
});

/** 文档、组件运行时和辅助技术使用同一语言，初次加载与切换时同步 HTML lang。 */
watch(docsLocale, locale => {
  i18n.global.locale.value = locale;
  document.documentElement.lang = locale === 'zh_CN' ? 'zh-CN' : 'en-US';
}, { immediate: true });

export default i18n;
