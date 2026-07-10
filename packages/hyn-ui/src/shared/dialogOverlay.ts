import { onBeforeUnmount, onMounted } from 'vue';

/**
 * HYN 弹窗通知其后代浮层立即收起的浏览器事件名称。
 *
 * @remarks
 * 部分自定义浮层会 teleport 到 `body`，不再随弹窗 DOM 隐藏；关闭事件必须在弹窗离场动画开始前发出，避免浮层短暂遗留在页面上。
 */
export const HYN_DIALOG_OVERLAY_CLOSE_EVENT = 'hyn-dialog-overlay-close';

/** HYN 弹窗关闭浮层事件携带的归属信息。 */
export interface HynDialogOverlayCloseDetail {
  /** 触发关闭的 HYN 弹窗唯一标识。 */
  dialogId: string;
}

/** 返回浮层触发器真实 DOM 的函数，用于在 teleport 场景识别所属 HYN 弹窗。 */
export type HynDialogOverlayElementResolver = () => HTMLElement | undefined;

/**
 * 通知指定 HYN 弹窗内的浮层同步关闭。
 *
 * @remarks
 * 标准 Element Plus 控件优先通过 Escape 收起当前展开面板；HYN 自定义浮层再由专用事件调用其受控可见状态。两者均在弹窗离场动画前执行。
 */
export function dispatchHynDialogOverlayClose(dialogId: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  closeHynDialogNativeOverlays(dialogId);
  window.dispatchEvent(
    new CustomEvent<HynDialogOverlayCloseDetail>(HYN_DIALOG_OVERLAY_CLOSE_EVENT, {
      detail: { dialogId }
    })
  );
}

/**
 * 为 teleport 浮层注册 HYN 弹窗关闭监听。
 *
 * @remarks
 * slot 内容的 Vue 注入链不保证以 `HynDialog` 为祖先，因此按触发器的真实 DOM 归属过滤事件；嵌套弹窗只会关闭自身范围内的浮层。
 */
export function useHynDialogOverlayClose(
  resolveTriggerElement: HynDialogOverlayElementResolver,
  closeOverlay: () => void
): void {
  const handleDialogOverlayClose = (event: Event): void => {
    if (isHynDialogOverlayCloseEventForElement(event, resolveTriggerElement())) {
      closeOverlay();
    }
  };

  onMounted(() => {
    window.addEventListener(HYN_DIALOG_OVERLAY_CLOSE_EVENT, handleDialogOverlayClose);
  });

  onBeforeUnmount(() => {
    window.removeEventListener(HYN_DIALOG_OVERLAY_CLOSE_EVENT, handleDialogOverlayClose);
  });
}

/**
 * 判断关闭事件是否属于指定浮层触发器所在的 HYN 弹窗。
 *
 * @remarks
 * 通过渲染后的 DOM 边界匹配，保证配置化表单和 slot 弹窗都能正确收起 teleport 浮层。
 */
export function isHynDialogOverlayCloseEventForElement(event: Event, element: HTMLElement | undefined): boolean {
  if (event.type !== HYN_DIALOG_OVERLAY_CLOSE_EVENT || !element) {
    return false;
  }
  const detail = (event as CustomEvent<HynDialogOverlayCloseDetail>).detail;
  if (!detail || typeof detail.dialogId !== 'string') {
    return false;
  }
  return element.closest<HTMLElement>('[data-hyn-dialog-overlay-id]')?.dataset.hynDialogOverlayId === detail.dialogId;
}

/**
 * 收起标准 Element Plus 控件当前已展开的下拉面板。
 *
 * @remarks
 * 这些组件的面板通常 teleport 到 `body`，不能依靠弹窗 DOM 卸载。优先向弹窗内的展开触发器派发 Escape，沿用组件自身的状态机和离场动画，不直接篡改 popper DOM。
 */
function closeHynDialogNativeOverlays(dialogId: string): void {
  const dialogElement = document.querySelector<HTMLElement>(`[data-hyn-dialog-overlay-id="\${dialogId}"]`);
  if (!dialogElement) {
    return;
  }

  const triggers = new Set<HTMLElement>();
  const activeElement = document.activeElement;
  if (activeElement instanceof HTMLElement && dialogElement.contains(activeElement)) {
    triggers.add(activeElement);
  }
  dialogElement.querySelectorAll<HTMLElement>('[aria-expanded="true"]').forEach(element => triggers.add(element));
  triggers.forEach(dispatchHynDialogEscapeKey);
}

/** 为已展开控件派发 Escape，触发 Element Plus 的正常关闭逻辑。 */
function dispatchHynDialogEscapeKey(trigger: HTMLElement): void {
  const target = trigger.matches('input, textarea, [tabindex]')
    ? trigger
    : (trigger.querySelector<HTMLElement>('input, textarea, [tabindex]') ?? trigger);
  target.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      bubbles: true,
      cancelable: true
    })
  );
}
