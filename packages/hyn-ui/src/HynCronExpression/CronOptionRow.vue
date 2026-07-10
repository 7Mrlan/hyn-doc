<template>
  <div
    class="cron-option-row"
    :class="{ 'is-active': active, 'is-disabled': disabled }"
    @click="selectRow"
  >
    <div class="cron-option-row__radio">
      <el-radio :value="value" :disabled="disabled" :aria-label="title" />
    </div>
    <div class="cron-option-row__copy">
      <span class="cron-option-row__title">{{ title }}</span>
    </div>
    <div class="cron-option-row__params">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
/** Cron 可视化面板中单个规则模式行的参数。 */
interface Props {
  /** 规则模式值，会原样回传给父级用于写入当前字段的 mode。 */
  value: string;
  /** 规则标题，作为 radio 的可访问名称和行内主文案。 */
  title: string;
  /** 当前规则是否被选中，用于高亮行和同步 radio 状态。 */
  active: boolean;
  /** 是否禁止选择该规则，通常继承外层 Cron 编辑器禁用态。 */
  disabled: boolean;
}

/** Cron 规则行向父级同步的事件。 */
interface Emits {
  /** 用户点击整行后选择的规则模式值。 */
  select: [value: string];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

/** 点击整行时只切换当前模式，参数控件本身仍保留独立交互语义。 */
function selectRow(): void {
  if (props.disabled) {
    return;
  }
  emit('select', props.value);
}
</script>

<style lang="scss" scoped>
.cron-option-row {
  position: relative;
  display: grid;
  grid-template-columns: 24px minmax(104px, 128px) minmax(0, 1fr);
  min-width: 0;
  min-height: 42px;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border: 1px solid transparent;
  border-left: 3px solid transparent;
  border-radius: 6px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease;
}

.cron-option-row:hover {
  border-color: #d8e4de;
  background: #fbfdfb;
}

.cron-option-row.is-active {
  border-color: #c9ddd4;
  border-left-color: #2f7d67;
  background: #f3faf6;
}

.cron-option-row.is-disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.cron-option-row__radio {
  display: flex;
  width: 24px;
  align-items: center;
  justify-content: center;
}

.cron-option-row__radio :deep(.el-radio) {
  height: 24px;
  margin-right: 0;
}

.cron-option-row__radio :deep(.el-radio__label) {
  display: none;
}

.cron-option-row__copy {
  display: flex;
  min-width: 0;
  align-items: center;
}

.cron-option-row__title {
  min-width: 0;
  color: var(--el-text-color-primary);
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
  overflow-wrap: break-word;
}

.cron-option-row__params {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 10px;
}

@media (max-width: 640px) {
  .cron-option-row {
    grid-template-columns: 24px minmax(0, 1fr);
    align-items: start;
  }

  .cron-option-row__radio {
    padding-top: 3px;
  }

  .cron-option-row__params {
    grid-column: 2;
  }
}
</style>
