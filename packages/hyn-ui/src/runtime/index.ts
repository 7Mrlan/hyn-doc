import type { Component, Ref } from 'vue';
import { hasInjectionContext, inject, provide } from 'vue';

export interface HynDeptTreeNode {
  id: string | number;
  label: string;
  parentId?: string | number;
  disabled?: boolean;
  children?: HynDeptTreeNode[];
}

export interface HynModalService {
  msgError: (message: string) => void;
  msgSuccess: (message: string) => void;
}

export interface HynHostComponents {
  editor: Component;
  fileUpload: Component;
  iconSelect: Component;
  imageUpload: Component;
}

export interface HynRuntime {
  locale: Ref<string>;
  t: (key: string, values?: Record<string, unknown>) => string;
  formatTime: (value: string | number | Date | undefined, pattern?: string) => string;
  hasPermissions: (permissions: string[]) => boolean;
  modal: HynModalService;
  loadDeptTree: () => Promise<HynDeptTreeNode[]>;
  hostComponents: HynHostComponents;
}

const hynRuntimeKey = Symbol('hyn-runtime');
let configuredHynRuntime: HynRuntime | undefined;

export const configureHynRuntime = (runtime: HynRuntime): void => {
  configuredHynRuntime = runtime;
};

export const provideHynRuntime = (runtime: HynRuntime): void => {
  provide(hynRuntimeKey, runtime);
};

/** 组件优先使用所属宿主的注入；事件回调和纯解析入口读取已配置的运行时，不能在无注入上下文时调用 inject。 */
export const useHynRuntime = (): HynRuntime => {
  const injectedRuntime = hasInjectionContext() ? inject<HynRuntime | undefined>(hynRuntimeKey, undefined) : undefined;
  const runtime = injectedRuntime ?? configuredHynRuntime;
  if (!runtime) {
    throw new Error('HYN runtime is not configured. Call configureHynRuntime before mounting HYN components.');
  }
  return runtime;
};

export const useHynI18n = (): Pick<HynRuntime, 'locale' | 't'> => {
  const runtime = useHynRuntime();
  return { locale: runtime.locale, t: runtime.t };
};

export const t = (key: string, values?: Record<string, unknown>): string => useHynRuntime().t(key, values);
export const parseTime = (value: string | number | Date | undefined, pattern?: string): string => useHynRuntime().formatTime(value, pattern);
export const checkPermi = (permissions: string[]): boolean => useHynRuntime().hasPermissions(permissions);
export const modal: HynModalService = {
  msgError: (message: string): void => useHynRuntime().modal.msgError(message),
  msgSuccess: (message: string): void => useHynRuntime().modal.msgSuccess(message)
};
export const loadHynDeptTree = (): Promise<HynDeptTreeNode[]> => useHynRuntime().loadDeptTree();
/** 从宿主获取富文本、文件等业务控件，避免组件包绑定原业务项目的具体实现。 */
export const getHynHostComponent = (name: keyof HynHostComponents): Component => useHynRuntime().hostComponents[name];
