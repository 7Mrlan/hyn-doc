import { ref } from 'vue';
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
    zh_CN: { ...zhCNApp, hynDocs: zhCNHynDocs },
    en_US: { ...enUSApp, hynDocs: enUSHynDocs }
  }
});

export default i18n;
