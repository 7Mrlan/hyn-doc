<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    append-to-body
    class="hyn-table-dialog"
    @update:model-value="value => emit('update:modelValue', value)"
    @close="emit('close')"
    @closed="emit('closed')"
  >
    <div v-loading="loading" class="hyn-table-dialog__shell">
      <section v-if="slots.filters" class="hyn-table-dialog__filters">
        <slot name="filters" />
      </section>

      <section v-if="hasToolbar" class="hyn-table-dialog__toolbar">
        <div v-if="hasSummary" class="hyn-table-dialog__summary">
          <slot name="summary" v-bind="slotState">
            <span>{{ t('app.table.totalSelected', { total: normalizedTotal, selected: normalizedSelectedCount }) }}</span>
          </slot>
        </div>
        <div v-if="slots.actions" class="hyn-table-dialog__actions">
          <slot name="actions" v-bind="slotState" />
        </div>
      </section>

      <section class="hyn-table-dialog__table">
        <slot name="table" />
      </section>

      <section v-if="slots.pagination" class="hyn-table-dialog__pagination">
        <slot name="pagination" />
      </section>
    </div>

    <template v-if="showFooter" #footer>
      <slot name="footer" v-bind="slotState">
        <div class="dialog-footer">
          <el-button type="primary" :loading="confirmLoading" :disabled="confirmDisabled" @click="emit('confirm')">
            {{ resolvedConfirmText }}
          </el-button>
          <el-button @click="handleCancel">{{ resolvedCancelText }}</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { HynTableDialogEmits, HynTableDialogProps, HynTableDialogSlotState } from './types';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';

const props = withDefaults(defineProps<HynTableDialogProps>(), {
  width: 'min(1120px, calc(100vw - 32px))',
  loading: false,
  showFooter: false,
  confirmText: undefined,
  cancelText: undefined,
  confirmLoading: false,
  confirmDisabled: false
});

const emit = defineEmits<HynTableDialogEmits>();
const slots = useSlots();
const { t } = useHynI18n();

defineSlots<{
  filters?: () => unknown;
  summary?: (state: HynTableDialogSlotState) => unknown;
  actions?: (state: HynTableDialogSlotState) => unknown;
  table?: () => unknown;
  pagination?: () => unknown;
  footer?: (state: HynTableDialogSlotState) => unknown;
}>();

// 总数允许调用方不传，统一转成 0 后供默认汇总和 slotState 使用。
const normalizedTotal = computed(() => props.total ?? 0);
// 已选数量允许调用方不传，统一转成 0 后供 summary slot 使用。
const normalizedSelectedCount = computed(() => props.selectedCount ?? 0);
const hasSummary = computed(() => Boolean(slots.summary) || props.total !== undefined || props.selectedCount !== undefined);
const hasToolbar = computed(() => hasSummary.value || Boolean(slots.actions));
// 确认文案在表格弹窗层兜底，业务页只传差异化动作文案。
const resolvedConfirmText = computed(() => props.confirmText ?? t('common.confirm'));
// 取消文案在表格弹窗层兜底，保持 HYN 弹窗体验一致。
const resolvedCancelText = computed(() => props.cancelText ?? t('common.cancel'));
// slotState 是 toolbar/footer slot 的稳定上下文，避免多个 slot 重复读 props 并各自处理空值。
const slotState = computed<HynTableDialogSlotState>(() => ({
  total: normalizedTotal.value,
  selectedCount: normalizedSelectedCount.value,
  loading: props.loading
}));

/** 取消按钮统一关闭弹窗并通知调用方，避免业务页重复写关闭样板代码。 */
function handleCancel(): void {
  emit('cancel');
  emit('update:modelValue', false);
}
</script>
