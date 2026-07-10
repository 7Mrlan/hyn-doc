import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { HynTextOverflowMode } from './shared/overflow';

/** HYN 全局组件配置，集中维护跨 HYN 公共组件共享的默认展示协议。 */
export interface HynGlobalConfig {
  /** 文本超出组件可用范围时的默认处理方式，局部组件 prop 或列配置优先级更高。 */
  overflowMode: HynTextOverflowMode;
}

const hynGlobalConfigKey: InjectionKey<HynGlobalConfig> = Symbol('HynGlobalConfig');

/** HYN 全局默认配置；需要全系统调整溢出策略时优先修改这里。 */
export const hynGlobalConfig: HynGlobalConfig = {
  // 三态协议 fit | ellipsis | wrap，默认 fit 让文本自适应容器宽度，避免出现滚动条或换行。
  overflowMode: 'fit'
};

/** 在应用根节点提供 HYN 全局配置，供所有 HYN 公共组件继承默认协议。 */
export function provideHynGlobalConfig(config: HynGlobalConfig): void {
  provide(hynGlobalConfigKey, config);
}

/** 读取 HYN 全局配置；未挂载 provider 的独立测试场景使用内置默认配置。 */
export function useHynGlobalConfig(): HynGlobalConfig {
  return inject(hynGlobalConfigKey, hynGlobalConfig);
}
