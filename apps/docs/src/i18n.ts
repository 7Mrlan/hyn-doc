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

/** 文档与组件运行时共享语言状态，切换后同步刷新文案。 */
watch(docsLocale, locale => { i18n.global.locale.value = locale; });

export default i18n;
