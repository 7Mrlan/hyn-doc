<template>
  <label class="cron-number-unit">
    <span class="cron-number-unit__label">{{ label }}</span>
    <el-input-number
      :model-value="modelValue"
      :min="min"
      :max="max"
      :style="inputStyle"
      controls-position="right"
      :disabled="disabled"
      @update:model-value="updateValue"
    />
    <span class="cron-number-unit__unit">{{ unit }}</span>
  </label>
</template>

<script setup lang="ts">
/** Cron 可视化面板中带单位的数字输入控件参数。 */
interface Props {
  /** 当前数字值，对应某个 Cron 字段的起点、间隔或范围端点。 */
  modelValue: number;
  /** 控件左侧展示的业务标签，用于区分起始值、间隔值等含义。 */
  label: string;
  /** 控件右侧展示的单位文案，例如秒、分、天或第几周。 */
  unit: string;
  /** 当前 Cron 字段允许的最小值，清空输入时也会回退到该值。 */
  min: number;
  /** 当前 Cron 字段允许的最大值，交由 Element Plus 输入框限制。 */
  max: number;
  /** 是否禁用输入，通常由当前 Cron 模式是否激活决定。 */
  disabled: boolean;
  /** 数字框固定宽度，保证不同 Cron 参数行排版稳定。 */
  inputWidth: string;
}

/** Cron 数字控件向父级同步的事件。 */
interface Emits {
  /** 输入变化后的有效数字值；空值会先回退到当前字段下限。 */
  'update:modelValue': [value: number];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 数值输入宽度由上下限位数推导，避免 Cron 小控件在不同表达式长度下跳动。
const inputStyle = computed<Record<string, string>>(() => ({
  width: props.inputWidth
}));

/** 数字框清空时回到合法下限，避免生成 undefined Cron 字段。 */
function updateValue(value: number | undefined): void {
  const nextValue = typeof value === 'number' && Number.isFinite(value) ? value : props.min;
  emit('update:modelValue', nextValue);
}
</script>

<style lang="scss" scoped>
.cron-number-unit {
  display: inline-grid;
  grid-template-columns: max-content max-content max-content;
  min-width: 0;
  align-items: center;
  gap: 6px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 1;
}

.cron-number-unit__label {
  color: var(--el-text-color-regular);
  font-weight: 600;
  white-space: nowrap;
}

.cron-number-unit__unit {
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.cron-number-unit :deep(.el-input-number) {
  flex: none;
}

.cron-number-unit :deep(.el-input-number.is-controls-right .el-input__wrapper) {
  padding-left: 10px;
  padding-right: 31px;
}

.cron-number-unit :deep(.el-input-number.is-controls-right .el-input-number__decrease),
.cron-number-unit :deep(.el-input-number.is-controls-right .el-input-number__increase) {
  width: 30px;
}

@media (max-width: 640px) {
  .cron-number-unit {
    grid-template-columns: 68px max-content max-content;
  }
}
</style>
