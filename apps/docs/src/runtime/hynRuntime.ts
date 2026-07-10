import { ElInput, ElMessage } from 'element-plus';
import type { HynRuntime } from '@7mrlan/hyn-ui/runtime';
import i18n, { docsLocale } from '@/i18n';
import { docsDepartmentTree } from '@/fixtures/departments';

/** 创建独立文档站的 HYN 宿主运行时。 */
export const createDocsHynRuntime = (): HynRuntime => {
  return {
    locale: docsLocale,
    t: (key: string, values?: Record<string, unknown>): string => i18n.global.t(key, values as never),
    formatTime: (value: string | number | Date | undefined): string => {
      if (value === undefined) {
        return '';
      }
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) {
        throw new Error(`Cannot format invalid HYN date value: ${String(value)}`);
      }
      return new Intl.DateTimeFormat(docsLocale.value === 'zh_CN' ? 'zh-CN' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'medium'
      }).format(date);
    },
    hasPermissions: (): boolean => true,
    modal: {
      msgError: (message: string): void => {
        ElMessage.error(message);
      },
      msgSuccess: (message: string): void => {
        ElMessage.success(message);
      }
    },
    loadDeptTree: async () => structuredClone(docsDepartmentTree),
    hostComponents: {
      editor: ElInput,
      fileUpload: ElInput,
      iconSelect: ElInput,
      imageUpload: ElInput
    }
  };
};
