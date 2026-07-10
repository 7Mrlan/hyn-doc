<template>
  <el-popover
    placement="bottom-start"
    trigger="click"
    :width="popoverWidth"
    :disabled="disabled"
    popper-class="cron-value-picker-popper"
  >
    <template #reference>
      <el-button
        class="cron-value-picker__trigger"
        :class="{ 'is-empty': !selectedOptions.length }"
        :style="triggerStyle"
        :disabled="disabled"
        :aria-label="ariaLabel"
      >
        <el-tooltip :content="selectedFullText" :disabled="!selectedOptions.length" placement="top">
          <span class="cron-value-picker__summary">{{ selectedSummary }}</span>
        </el-tooltip>
        <el-icon class="cron-value-picker__arrow"><ArrowDown /></el-icon>
      </el-button>
    </template>

    <div class="cron-value-picker__panel" :style="panelStyle">
      <div class="cron-value-picker__grid" :style="gridStyle" role="listbox" :aria-label="ariaLabel">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          class="cron-value-picker__chip"
          :class="{ 'is-selected': isSelected(option.value) }"
          :aria-pressed="isSelected(option.value)"
          @click="toggleValue(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
      <div class="cron-value-picker__footer">
        <span>{{ selectedSummary }}</span>
        <el-button link size="small" :icon="Close" :disabled="!selectedOptions.length" @click="clearValues">
          {{ t('quartzCron.picker.clear') }}
        </el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ArrowDown, Close } from '@element-plus/icons-vue';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';

/** Cron 多值选择器的候选项。 */
export interface CronValuePickerOption {
  /** 展示给用户的本地化标签，例如 `05 分` 或 `星期一`。 */
  label: string;
  /** 写入 Cron 模型的数字值，保持 Quartz 字段的原始编号。 */
  value: number;
}

/** Cron 多值选择器的组件参数。 */
interface Props {
  /** 当前选中的数字集合，输出时会按 options 顺序重新排列。 */
  modelValue: number[];
  /** 可选择的数字候选项，顺序同时决定表达式输出顺序。 */
  options: CronValuePickerOption[];
  /** 未选择任何值时展示的占位文案。 */
  placeholder: string;
  /** 弹出选择区的可访问名称，说明当前选择器对应的 Cron 字段。 */
  ariaLabel: string;
  /** 是否禁用选择，通常由外层规则模式是否激活决定。 */
  disabled: boolean;
  /** 触发按钮宽度，避免不同字段切换时布局跳动。 */
  triggerWidth: string;
  /** 弹层宽度，按候选项数量和列数预先约束。 */
  popoverWidth: number;
  /** 候选项网格列数，用于秒、分、星期等不同密度的面板。 */
  columns: number;
}

/** Cron 多值选择器向父级同步的事件。 */
interface Emits {
  /** 选择变化后的数字集合，已经按候选项顺序排序。 */
  'update:modelValue': [value: number[]];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useHynI18n();

// Cron 下拉触发器宽度由配置推导，保证按钮和面板使用同一布局基准。
const triggerStyle = computed<Record<string, string>>(() => ({
  width: props.triggerWidth
}));
// Cron 下拉面板尺寸集中在 computed 中输出，避免模板和样式层重复拼接宽高。
const panelStyle = computed<Record<string, string>>(() => ({
  '--cron-picker-columns': String(props.columns)
}));
// Cron 候选网格列数由取值范围推导，保持键盘扫描和视觉分组一致。
const gridStyle = computed<Record<string, string>>(() => ({
  gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`
}));
// 选中值集合用于常数时间判断候选项状态，避免每个格子重复遍历数组。
const selectedValueSet = computed<Set<number>>(() => new Set(props.modelValue));
// 选中项按原候选顺序回显，避免多选结果因为用户点击顺序影响摘要稳定性。
const selectedOptions = computed<CronValuePickerOption[]>(() => props.options.filter(option => selectedValueSet.value.has(option.value)));
// 折叠摘要只展示少量选中项，长表达式通过完整文本 tooltip 承载。
const selectedSummary = computed<string>(() => {
  if (!selectedOptions.value.length) {
    return props.placeholder;
  }
  if (selectedOptions.value.length === 1) {
    return selectedOptions.value[0].label;
  }
  return t('quartzCron.picker.selectedCount', { count: selectedOptions.value.length });
});
// 完整选中描述只供 tooltip 使用，避免把大段 Cron 文案直接撑开触发器。
const selectedFullText = computed<string>(() => selectedOptions.value.map(option => option.label).join('、'));

/** 判断当前候选值是否已选择，用于按钮状态和辅助技术语义。 */
function isSelected(value: number): boolean {
  return selectedValueSet.value.has(value);
}

/** 切换单个候选值，并按照 options 原始顺序输出，保证 Cron 生成结果稳定。 */
function toggleValue(value: number): void {
  const nextValueSet = new Set(props.modelValue);
  if (nextValueSet.has(value)) {
    nextValueSet.delete(value);
  } else {
    nextValueSet.add(value);
  }
  emitOrderedValues(Array.from(nextValueSet));
}

/** 清空当前选择，生成层会按字段边界回退为通配语义。 */
function clearValues(): void {
  emit('update:modelValue', []);
}

/** 根据候选项顺序重新排序选中值，避免点击顺序影响表达式输出。 */
function emitOrderedValues(values: number[]): void {
  const valueSet = new Set(values);
  const orderedValues = props.options.filter(option => valueSet.has(option.value)).map(option => option.value);
  emit('update:modelValue', orderedValues);
}
</script>

<style lang="scss" scoped>
.cron-value-picker__trigger {
  display: inline-flex;
  height: var(--app-control-height);
  min-width: 0;
  justify-content: space-between;
  padding: 0 10px;
  border-color: var(--el-border-color);
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
}

.cron-value-picker__trigger.is-empty {
  color: var(--el-text-color-placeholder);
}

.cron-value-picker__summary {
  min-width: 0;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cron-value-picker__arrow {
  flex: none;
  margin-left: 8px;
  color: var(--el-text-color-secondary);
}

.cron-value-picker__panel {
  display: grid;
  min-width: 0;
  gap: 10px;
}

.cron-value-picker__grid {
  display: grid;
  max-height: 260px;
  min-width: 0;
  gap: 6px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 2px;
}

.cron-value-picker__chip {
  min-width: 0;
  height: 30px;
  border: 1px solid #d9e2dd;
  border-radius: 6px;
  background: #fbfdfc;
  color: var(--el-text-color-regular);
  cursor: pointer;
  font-size: 12px;
  line-height: 28px;
  text-align: center;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease;
}

.cron-value-picker__chip:hover {
  border-color: #b8d3c6;
  background: #f4fbf7;
}

.cron-value-picker__chip.is-selected {
  border-color: #2f7d67;
  background: #eaf7f1;
  color: #216653;
  font-weight: 700;
}

.cron-value-picker__footer {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 8px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
</style>

<style lang="scss">
.cron-value-picker-popper {
  max-width: calc(100vw - 32px);
}
</style>
