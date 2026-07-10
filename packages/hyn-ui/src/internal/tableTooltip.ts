import { onBeforeUnmount, provide, reactive, type InjectionKey } from 'vue';

/** 表格级共享 tooltip 控制器，供单元格文本和操作按钮复用同一个 Element Plus 弹层实例。 */
export interface HynTableTooltipController {
  /** 在指定真实 DOM 上展示表格共享 tooltip；调用方仍负责判断内容是否值得展示。 */
  show: (reference: HTMLElement, content: string, showDelay: number) => void;
  /** 隐藏当前共享 tooltip；传入 reference 时只关闭同一触发源，避免相邻单元格 hover 互相抢状态。 */
  hide: (reference?: HTMLElement) => void;
}

/** Element Plus virtual-triggering 只需要稳定的触发源、内容和显隐状态。 */
export type HynTableTooltipState = {
  /** 当前共享 tooltip 是否可见；延迟展示期间 reference 会先建立但 visible 仍为 false。 */
  visible: boolean;
  /** 当前触发源对应的展示文本；隐藏时清空，避免旧内容被下一个触发源短暂复用。 */
  content: string;
  /** Element Plus virtual-ref 需要的真实 DOM 节点，必须来自当前 hover/focus 的触发源。 */
  reference: HTMLElement | null;
};

/** 表格级 tooltip provider 返回给宿主表格的状态和清理入口。 */
export type HynTableTooltipProviderState = HynTableTooltipState & {
  /** 宿主表格失活或卸载时主动释放当前触发源，避免 tooltip 持有已移除的单元格 DOM。 */
  hide: HynTableTooltipController['hide'];
};

/** HYN 表格内部注入键；非表格场景没有 provider 时组件会自动回退到本地 tooltip。 */
export const HYN_TABLE_TOOLTIP_KEY: InjectionKey<HynTableTooltipController> = Symbol('HynTableTooltip');

/** 为一张 HYN 表格提供单例 tooltip，避免每个单元格或按钮都创建 ElTooltip 实例。 */
export function useHynTableTooltipProvider(): HynTableTooltipProviderState {
  const tooltipState = reactive<HynTableTooltipState>({
    visible: false,
    content: '',
    reference: null
  });

  let showTimer: ReturnType<typeof setTimeout> | null = null;

  function clearShowTimer(): void {
    if (showTimer === null) {
      return;
    }
    clearTimeout(showTimer);
    showTimer = null;
  }

  function hide(reference?: HTMLElement): void {
    if (reference && tooltipState.reference !== reference) {
      return;
    }
    clearShowTimer();
    tooltipState.visible = false;
    tooltipState.content = '';
    tooltipState.reference = null;
  }

  function show(reference: HTMLElement, content: string, showDelay: number): void {
    clearShowTimer();
    if (!content) {
      hide(reference);
      return;
    }

    tooltipState.reference = reference;
    tooltipState.content = content;
    if (showDelay <= 0) {
      tooltipState.visible = true;
      return;
    }

    tooltipState.visible = false;
    showTimer = setTimeout(() => {
      if (tooltipState.reference !== reference) {
        return;
      }
      tooltipState.visible = true;
      showTimer = null;
    }, showDelay);
  }

  provide<HynTableTooltipController>(HYN_TABLE_TOOLTIP_KEY, {
    show,
    hide
  });

  onBeforeUnmount(() => {
    hide();
  });

  return Object.assign(tooltipState, { hide });
}
