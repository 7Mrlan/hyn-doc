/**
 * HYN 表格弹窗外壳 props。
 *
 * @remarks
 * 只负责“筛选 + 表格 + 分页 + footer”弹窗布局，业务查询、分页和选择状态由调用方维护。
 */
export interface HynTableDialogProps {
  /** 弹窗显隐绑定值。 */
  modelValue: boolean;
  /** 弹窗标题。 */
  title: string;
  /** 弹窗宽度，透传给 Element Plus Dialog。 */
  width?: string;
  /** 表格或查询区域加载状态。 */
  loading?: boolean;
  /** 当前查询结果总数，用于 summary 和分页 slot。 */
  total?: number;
  /** 当前已选记录数，用于 summary 和批量按钮状态。 */
  selectedCount?: number;
  /** 是否展示底部确认/取消区域。 */
  showFooter?: boolean;
  /** 确认按钮文案。 */
  confirmText?: string;
  /** 取消按钮文案。 */
  cancelText?: string;
  /** 确认按钮 loading，提交或批量操作中使用。 */
  confirmLoading?: boolean;
  /** 是否禁用确认按钮。 */
  confirmDisabled?: boolean;
}

/**
 * HYN 表格弹窗事件协议。
 */
export interface HynTableDialogEmits {
  /** 同步弹窗显隐。 */
  (event: 'update:modelValue', value: boolean): void;
  /** 点击确认按钮。 */
  (event: 'confirm'): void;
  /** 点击取消按钮。 */
  (event: 'cancel'): void;
  /** 弹窗开始关闭。 */
  (event: 'close'): void;
  /** 弹窗关闭动画结束。 */
  (event: 'closed'): void;
}

/**
 * HYN 表格弹窗 slot 共享状态。
 */
export interface HynTableDialogSlotState {
  /** 当前查询结果总数。 */
  total: number;
  /** 当前已选记录数。 */
  selectedCount: number;
  /** 当前弹窗内表格或查询是否加载中。 */
  loading: boolean;
}
