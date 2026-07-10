<template>
  <div class="hyn-table-action-cell">
    <template v-for="action in visibleActions" :key="action.key">
      <span
        v-if="tableTooltip"
        class="hyn-table-action-cell__trigger"
        @mouseenter="event => showActionTooltip(event, action.label)"
        @mouseleave="event => hideActionTooltip(event)"
        @focusin="event => showActionTooltip(event, action.label)"
        @focusout="event => hideActionTooltip(event)"
      >
        <el-button
          class="hyn-table-action-cell__button"
          link
          :type="action.type ?? 'primary'"
          :icon="action.icon"
          :disabled="isActionDisabled(action)"
          :aria-label="action.label"
          @click.stop="handleActionClick(action)"
        />
      </span>
      <el-tooltip
        v-else
        :content="action.label"
        placement="top"
        effect="dark"
        :show-after="200"
        :hide-after="0"
        :teleported="true"
        :persistent="false"
      >
        <span class="hyn-table-action-cell__trigger">
          <el-button
            class="hyn-table-action-cell__button"
            link
            :type="action.type ?? 'primary'"
            :icon="action.icon"
            :disabled="isActionDisabled(action)"
            :aria-label="action.label"
            @click.stop="handleActionClick(action)"
          />
        </span>
      </el-tooltip>
    </template>
  </div>
</template>

<script setup lang="ts" generic="TRow">
import { computed, inject } from 'vue';
import { checkPermi } from '@7mrlan/hyn-ui/runtime';
import { HYN_TABLE_TOOLTIP_KEY } from '../../internal/tableTooltip';
import type { HynTableAction } from '../types';

const props = defineProps<{
  /** 当前业务行，所有 action 的 visible、disabled 和 onClick 都以它为上下文。 */
  row: TRow;
  /** 行操作定义列表，组件统一处理权限、禁用态和图标按钮视觉协议。 */
  actions: HynTableAction<TRow>[];
  /** 上层已经按登录人权限过滤时跳过重复校验，行级 visible 仍在本组件内执行。 */
  permissionChecked?: boolean;
}>();

const tableTooltip = inject(HYN_TABLE_TOOLTIP_KEY, null);

/** 判断操作按钮是否通过当前登录人的权限校验。 */
const hasActionPermission = (action: HynTableAction<TRow>): boolean => {
  if (props.permissionChecked === true) {
    return true;
  }
  if (!action.permissions || action.permissions.length === 0) {
    return true;
  }
  return checkPermi(action.permissions);
};

/** 过滤权限和行级可见性，业务页只需要描述 action，不再重复写权限指令。 */
const visibleActions = computed(() => {
  return props.actions.filter(action => hasActionPermission(action) && (action.visible?.(props.row) ?? true));
});

function getEventElement(event: MouseEvent | FocusEvent): HTMLElement | null {
  return event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
}

function showActionTooltip(event: MouseEvent | FocusEvent, label: string): void {
  const element = getEventElement(event);
  if (!element) {
    return;
  }
  tableTooltip?.show(element, label, 200);
}

function hideActionTooltip(event: MouseEvent | FocusEvent): void {
  const element = getEventElement(event);
  if (!element) {
    return;
  }
  tableTooltip?.hide(element);
}

/** 计算行级禁用态，支持布尔值和按行判断两种形态。 */
const isActionDisabled = (action: HynTableAction<TRow>): boolean => {
  if (typeof action.disabled === 'function') {
    return action.disabled(props.row);
  }
  return action.disabled === true;
};

/** 统一处理操作点击，禁用态只展示提示，不触发业务回调。 */
const handleActionClick = (action: HynTableAction<TRow>): void => {
  if (isActionDisabled(action)) {
    return;
  }
  tableTooltip?.hide();
  void action.onClick(props.row);
};
</script>

<style lang="scss" scoped>
.hyn-table-action-cell {
  display: inline-flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.hyn-table-action-cell__trigger {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
}

.hyn-table-action-cell__button.el-button {
  width: 28px;
  height: 28px;
  min-height: 28px;
  margin: 0;
  padding: 0;
  border-radius: var(--app-radius-sm);
  transition:
    background-color 0.12s ease,
    box-shadow 0.12s ease,
    color 0.12s ease;
}

.hyn-table-action-cell__button.el-button.is-link {
  --el-button-hover-link-text-color: var(--el-button-text-color);

  color: var(--el-button-text-color);
}

.hyn-table-action-cell__button:hover,
.hyn-table-action-cell__button:focus-visible {
  background: var(--el-color-primary-light-9);
}

.hyn-table-action-cell__button:focus-visible {
  box-shadow: 0 0 0 2px var(--el-color-primary-light-7);
  outline: none;
}

.hyn-table-action-cell__button.el-button--danger:hover,
.hyn-table-action-cell__button.el-button--danger:focus-visible {
  background: var(--el-color-danger-light-9);
}

.hyn-table-action-cell__button.el-button--success:hover,
.hyn-table-action-cell__button.el-button--success:focus-visible {
  background: var(--el-color-success-light-9);
}

.hyn-table-action-cell__button.el-button--warning:hover,
.hyn-table-action-cell__button.el-button--warning:focus-visible {
  background: var(--el-color-warning-light-9);
}

.hyn-table-action-cell__button.el-button--info:hover,
.hyn-table-action-cell__button.el-button--info:focus-visible {
  background: var(--el-color-info-light-9);
}

.hyn-table-action-cell__button.is-disabled,
.hyn-table-action-cell__button.is-disabled:hover {
  background: transparent;
  cursor: not-allowed;
}

.hyn-table-action-cell__button :deep(.el-icon) {
  width: 16px;
  height: 16px;
  font-size: 16px;
}
</style>
