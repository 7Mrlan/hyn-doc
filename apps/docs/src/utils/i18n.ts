import type { Ref } from 'vue';
import i18n, { docsLocale } from '@/i18n';

/** 文档站路由元数据使用的稳定 i18n key。 */
export type RouteI18nKey = string;

/** 文档站本地 i18n 组合式入口。 */
export const useAppI18n = (): { t: (key: string, values?: Record<string, string | number>) => string; tm: (key: string) => unknown; locale: Ref<string> } => {
  const t = (key: string, values?: Record<string, string | number>): string => i18n.global.t(key, values);
  const tm = (key: string): unknown => i18n.global.tm(key);
  return { t, tm, locale: docsLocale };
};

/** 文档站全局翻译函数。 */
export const t = (key: string, values?: Record<string, string | number>): string => i18n.global.t(key, values);
