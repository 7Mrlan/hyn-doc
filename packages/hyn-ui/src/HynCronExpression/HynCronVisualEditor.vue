<template>
  <el-tabs v-model="activeTabModel" type="border-card" class="quartz-cron-editor">
    <el-tab-pane v-for="tab in cronTabs" :key="tab.key" :name="tab.key">
      <template #label>
        <span class="quartz-cron-editor__tab-label" :class="{ 'is-constrained': isConstrainedTab(tab) }" :title="getTabTitle(tab)">
          <el-icon><Calendar /></el-icon>
          {{ tab.label }}
        </span>
      </template>

      <div v-if="tab.type === 'simple'" class="quartz-cron-editor__panel">
        <el-radio-group v-model="model[tab.key].mode" class="quartz-cron-editor__group" :disabled="disabled">
          <cron-option-row
            :value="tab.primaryMode"
            :title="tab.primaryTitle"
            :active="model[tab.key].mode === tab.primaryMode"
            :disabled="disabled"
            @select="setSimpleMode(tab.key, tab.primaryMode)"
          />

          <cron-option-row
            value="interval"
            :title="t('quartzCron.simple.intervalLabel')"
            :active="model[tab.key].mode === 'interval'"
            :disabled="disabled"
            @select="setSimpleMode(tab.key, 'interval')"
          >
            <cron-number-unit
              :model-value="model[tab.key].intervalStep"
              :label="t('quartzCron.simple.controls.interval')"
              :unit="tab.intervalUnit"
              :min="1"
              :max="tab.max - tab.min + 1"
              :disabled="disabled || model[tab.key].mode !== 'interval'"
              :input-width="tab.numberWidth"
              @update:model-value="value => updateSimpleField(tab.key, 'intervalStep', value)"
            />
            <cron-number-unit
              :model-value="model[tab.key].intervalStart"
              :label="tab.intervalStartLabel"
              :unit="tab.startUnit"
              :min="tab.min"
              :max="tab.max"
              :disabled="disabled || model[tab.key].mode !== 'interval'"
              :input-width="tab.numberWidth"
              @update:model-value="value => updateSimpleField(tab.key, 'intervalStart', value)"
            />
          </cron-option-row>

          <cron-option-row
            value="specific"
            :title="t('quartzCron.simple.specific', { unit: tab.controlName })"
            :active="model[tab.key].mode === 'specific'"
            :disabled="disabled"
            @select="setSimpleMode(tab.key, 'specific')"
          >
            <cron-value-picker
              :model-value="model[tab.key].specificValues"
              :options="tab.options"
              :placeholder="t('quartzCron.picker.placeholder')"
              :ariaLabel="t('quartzCron.simple.specific', { unit: tab.controlName })"
              :disabled="disabled || model[tab.key].mode !== 'specific'"
              :trigger-width="tab.pickerTriggerWidth"
              :popover-width="tab.pickerPopoverWidth"
              :columns="tab.pickerColumns"
              @update:model-value="value => updateSimpleField(tab.key, 'specificValues', value)"
            />
          </cron-option-row>

          <cron-option-row
            value="range"
            :title="t('quartzCron.simple.rangeLabel')"
            :active="model[tab.key].mode === 'range'"
            :disabled="disabled"
            @select="setSimpleMode(tab.key, 'range')"
          >
            <cron-number-unit
              :model-value="model[tab.key].rangeStart"
              :label="t('quartzCron.simple.controls.rangeStart', { unit: tab.controlName })"
              :unit="tab.startUnit"
              :min="tab.min"
              :max="tab.max"
              :disabled="disabled || model[tab.key].mode !== 'range'"
              :input-width="tab.numberWidth"
              @update:model-value="value => updateSimpleField(tab.key, 'rangeStart', value)"
            />
            <cron-number-unit
              :model-value="model[tab.key].rangeEnd"
              :label="t('quartzCron.simple.controls.rangeEnd', { unit: tab.controlName })"
              :unit="tab.startUnit"
              :min="tab.min"
              :max="tab.max"
              :disabled="disabled || model[tab.key].mode !== 'range'"
              :input-width="tab.numberWidth"
              @update:model-value="value => updateSimpleField(tab.key, 'rangeEnd', value)"
            />
          </cron-option-row>
        </el-radio-group>
      </div>

      <div v-else class="quartz-cron-editor__panel">
        <el-radio-group v-model="model.day.mode" class="quartz-cron-editor__group" :disabled="disabled">
          <div class="quartz-cron-editor__section">{{ t('quartzCron.day.dateGroup') }}</div>

          <cron-option-row
            value="every"
            :title="t('quartzCron.day.every')"
            :active="model.day.mode === 'every'"
            :disabled="disabled"
            @select="setDayMode('every')"
          />

          <cron-option-row
            value="lastDay"
            :title="t('quartzCron.day.lastDay')"
            :active="model.day.mode === 'lastDay'"
            :disabled="disabled"
            @select="setDayMode('lastDay')"
          />

          <cron-option-row
            value="lastWorkDay"
            :title="t('quartzCron.day.lastWorkDay')"
            :active="model.day.mode === 'lastWorkDay'"
            :disabled="disabled"
            @select="setDayMode('lastWorkDay')"
          />

          <cron-option-row
            value="dayInterval"
            :title="t('quartzCron.day.dayIntervalLabel')"
            :active="model.day.mode === 'dayInterval'"
            :disabled="disabled"
            @select="setDayMode('dayInterval')"
          >
            <cron-number-unit
              :model-value="model.day.dayIntervalStep"
              :label="t('quartzCron.day.controls.interval')"
              :unit="t('quartzCron.day.units.day')"
              :min="1"
              :max="31"
              :disabled="disabled || model.day.mode !== 'dayInterval'"
              input-width="92px"
              @update:model-value="value => updateDayField('dayIntervalStep', value)"
            />
            <cron-number-unit
              :model-value="model.day.dayIntervalStart"
              :label="t('quartzCron.day.controls.startDay')"
              :unit="t('quartzCron.day.units.dayOfMonth')"
              :min="1"
              :max="31"
              :disabled="disabled || model.day.mode !== 'dayInterval'"
              input-width="92px"
              @update:model-value="value => updateDayField('dayIntervalStart', value)"
            />
          </cron-option-row>

          <cron-option-row
            value="daySpecific"
            :title="t('quartzCron.day.specificDay')"
            :active="model.day.mode === 'daySpecific'"
            :disabled="disabled"
            @select="setDayMode('daySpecific')"
          >
            <cron-value-picker
              :model-value="model.day.specificDays"
              :options="dayOptions"
              :placeholder="t('quartzCron.picker.placeholder')"
              :ariaLabel="t('quartzCron.day.specificDay')"
              :disabled="disabled || model.day.mode !== 'daySpecific'"
              trigger-width="208px"
              :popover-width="340"
              :columns="7"
              @update:model-value="value => updateDayField('specificDays', value)"
            />
          </cron-option-row>

          <cron-option-row
            value="nearestWorkDay"
            :title="t('quartzCron.day.nearestWorkDayLabel')"
            :active="model.day.mode === 'nearestWorkDay'"
            :disabled="disabled"
            @select="setDayMode('nearestWorkDay')"
          >
            <cron-number-unit
              :model-value="model.day.nearestWorkDay"
              :label="t('quartzCron.day.controls.nearestDay')"
              :unit="t('quartzCron.day.units.dayOfMonth')"
              :min="1"
              :max="31"
              :disabled="disabled || model.day.mode !== 'nearestWorkDay'"
              input-width="92px"
              @update:model-value="value => updateDayField('nearestWorkDay', value)"
            />
          </cron-option-row>

          <div class="quartz-cron-editor__section">{{ t('quartzCron.day.weekGroup') }}</div>

          <cron-option-row
            value="weekSpecific"
            :title="t('quartzCron.day.specificWeek')"
            :active="model.day.mode === 'weekSpecific'"
            :disabled="disabled"
            @select="setDayMode('weekSpecific')"
          >
            <cron-value-picker
              :model-value="model.day.specificWeekdays"
              :options="weekPickerOptions"
              :placeholder="t('quartzCron.picker.placeholder')"
              :ariaLabel="t('quartzCron.day.specificWeek')"
              :disabled="disabled || model.day.mode !== 'weekSpecific'"
              trigger-width="208px"
              :popover-width="280"
              :columns="1"
              @update:model-value="value => updateDayField('specificWeekdays', value)"
            />
          </cron-option-row>

          <cron-option-row
            value="weekInterval"
            :title="t('quartzCron.day.weekIntervalLabel')"
            :active="model.day.mode === 'weekInterval'"
            :disabled="disabled"
            @select="setDayMode('weekInterval')"
          >
            <label class="quartz-cron-editor__select-unit">
              <span>{{ t('quartzCron.day.controls.startWeek') }}</span>
              <el-select
                :model-value="model.day.weekIntervalStart"
                :disabled="disabled || model.day.mode !== 'weekInterval'"
                class="quartz-cron-editor__week-select"
                @update:model-value="value => updateDayField('weekIntervalStart', value)"
              >
                <el-option v-for="item in weekOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </label>
            <cron-number-unit
              :model-value="model.day.weekIntervalStep"
              :label="t('quartzCron.day.controls.interval')"
              :unit="t('quartzCron.day.units.weekIndex')"
              :min="1"
              :max="7"
              :disabled="disabled || model.day.mode !== 'weekInterval'"
              input-width="92px"
              @update:model-value="value => updateDayField('weekIntervalStep', value)"
            />
          </cron-option-row>

          <cron-option-row
            value="lastSpecificWeek"
            :title="t('quartzCron.day.lastSpecificWeekLabel')"
            :active="model.day.mode === 'lastSpecificWeek'"
            :disabled="disabled"
            @select="setDayMode('lastSpecificWeek')"
          >
            <label class="quartz-cron-editor__select-unit">
              <span>{{ t('quartzCron.day.controls.weekday') }}</span>
              <el-select
                :model-value="model.day.lastSpecificWeekday"
                :disabled="disabled || model.day.mode !== 'lastSpecificWeek'"
                class="quartz-cron-editor__week-select"
                @update:model-value="value => updateDayField('lastSpecificWeekday', value)"
              >
                <el-option v-for="item in weekOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </label>
          </cron-option-row>

          <cron-option-row
            value="nthWeek"
            :title="t('quartzCron.day.nthWeekLabel')"
            :active="model.day.mode === 'nthWeek'"
            :disabled="disabled"
            @select="setDayMode('nthWeek')"
          >
            <cron-number-unit
              :model-value="model.day.nthWeek"
              :label="t('quartzCron.day.controls.nth')"
              :unit="t('quartzCron.day.units.ordinal')"
              :min="1"
              :max="5"
              :disabled="disabled || model.day.mode !== 'nthWeek'"
              input-width="92px"
              @update:model-value="value => updateDayField('nthWeek', value)"
            />
            <label class="quartz-cron-editor__select-unit">
              <span>{{ t('quartzCron.day.controls.weekday') }}</span>
              <el-select
                :model-value="model.day.nthWeekday"
                :disabled="disabled || model.day.mode !== 'nthWeek'"
                class="quartz-cron-editor__week-select"
                @update:model-value="value => updateDayField('nthWeekday', value)"
              >
                <el-option v-for="item in weekOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </label>
          </cron-option-row>
        </el-radio-group>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { Calendar } from '@element-plus/icons-vue';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import CronNumberUnit from './CronNumberUnit.vue';
import CronOptionRow from './CronOptionRow.vue';
import CronValuePicker from './CronValuePicker.vue';
import type {
  QuartzCronModel,
  QuartzCronTabKey,
  QuartzDayFieldMode,
  QuartzDayFieldModel,
  QuartzSimpleFieldKey,
  QuartzSimpleFieldModel,
  QuartzSimpleFieldMode
} from './quartzCron';
import { ensureQuartzCalendarTimeSafety, isQuartzCronTabConstrained } from './quartzCron';

/** Quartz Cron 可视化编辑器参数。 */
interface Props {
  /** 外层弹窗维护的完整 Cron 模型，子控件会直接写入当前激活字段。 */
  model: QuartzCronModel;
  /** 当前激活的字段页签，用于在秒、分、时、日、月、年之间切换。 */
  activeTab: QuartzCronTabKey;
  /** 是否禁用编辑，禁用时仍保留当前模型展示。 */
  disabled: boolean;
}

/** Quartz Cron 可视化编辑器向外同步的事件。 */
interface Emits {
  /** 切换页签时同步当前激活的 Cron 字段键。 */
  'update:activeTab': [value: QuartzCronTabKey];
}

interface PickerOption {
  label: string;
  value: number;
}

interface SimpleFieldConfig {
  type: 'simple';
  key: QuartzSimpleFieldKey;
  label: string;
  controlName: string;
  startUnit: string;
  intervalUnit: string;
  primaryMode: QuartzSimpleFieldMode;
  primaryTitle: string;
  intervalStartLabel: string;
  min: number;
  max: number;
  numberWidth: string;
  pickerTriggerWidth: string;
  pickerPopoverWidth: number;
  pickerColumns: number;
  options: PickerOption[];
}

interface DayFieldConfig {
  type: 'day';
  key: 'day';
  label: string;
}

interface WeekOption {
  label: string;
  value: number;
}

type CronTabConfig = SimpleFieldConfig | DayFieldConfig;

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useHynI18n();

// Cron 可视化页签通过 computed 桥接 v-model，保证父组件只接收合法页签值。
const activeTabModel = computed<QuartzCronTabKey>({
  get: () => props.activeTab,
  set: value => emit('update:activeTab', value)
});

const cronTabs = computed<CronTabConfig[]>(() => [
  createSimpleTabConfig('second', 0, 59, '92px', '184px', 360, 6, createNumberOptions(0, 59, formatSecondValue)),
  createSimpleTabConfig('minute', 0, 59, '92px', '184px', 360, 6, createNumberOptions(0, 59, formatMinuteValue)),
  createSimpleTabConfig('hour', 0, 23, '92px', '184px', 300, 4, createNumberOptions(0, 23, formatHourValue)),
  { type: 'day', key: 'day', label: t('quartzCron.tabs.day') },
  createSimpleTabConfig('month', 1, 12, '92px', '184px', 300, 4, createNumberOptions(1, 12, formatMonthValue)),
  createSimpleTabConfig('year', 1970, 2099, '108px', '208px', 420, 5, createNumberOptions(1970, 2099, formatYearValue))
]);

// 日期候选项按 Cron 允许范围生成，避免模板里硬编码 1-31 的边界。
const dayOptions = computed<PickerOption[]>(() => createNumberOptions(1, 31, formatDayValue));
// 星期候选项按 Cron 协议生成，保证显示顺序和表达式值保持一致。
const weekOptions = computed<WeekOption[]>(() => [
  { label: t('quartzCron.week.sunday'), value: 1 },
  { label: t('quartzCron.week.monday'), value: 2 },
  { label: t('quartzCron.week.tuesday'), value: 3 },
  { label: t('quartzCron.week.wednesday'), value: 4 },
  { label: t('quartzCron.week.thursday'), value: 5 },
  { label: t('quartzCron.week.friday'), value: 6 },
  { label: t('quartzCron.week.saturday'), value: 7 }
]);
// 星期选择器使用独立 options，保留周字段和日期字段不同的取值语义。
const weekPickerOptions = computed<PickerOption[]>(() => weekOptions.value.map(item => ({ label: item.label, value: item.value })));

/** 返回页签悬停说明，帮助用户识别组合表达式中还有其他字段参与生效。 */
function getTabTitle(tab: CronTabConfig): string {
  return isConstrainedTab(tab) ? `${tab.label} - ${t('quartzCron.tabs.constrained')}` : tab.label;
}

/** 判断页签对应字段是否限制了自身取值范围，绿色仅承载这一种语义。 */
function isConstrainedTab(tab: CronTabConfig): boolean {
  return isQuartzCronTabConstrained(props.model, tab.key);
}

/** 创建普通 Cron 字段配置，集中约束标题、控件宽度和弹层网格规格。 */
function createSimpleTabConfig(
  key: QuartzSimpleFieldKey,
  min: number,
  max: number,
  numberWidth: string,
  pickerTriggerWidth: string,
  pickerPopoverWidth: number,
  pickerColumns: number,
  options: PickerOption[]
): SimpleFieldConfig {
  const controlName = t(`quartzCron.simple.fieldNames.${key}`);
  const primaryMode = key === 'year' ? 'notSpecified' : 'every';
  return {
    type: 'simple',
    key,
    label: t(`quartzCron.tabs.${key}`),
    controlName,
    startUnit: t(`quartzCron.simple.startUnits.${key}`),
    intervalUnit: t(`quartzCron.simple.intervalUnits.${key}`),
    primaryMode,
    primaryTitle: key === 'year' ? t('quartzCron.simple.notSpecifiedYear') : t(`quartzCron.simple.everyTitles.${key}`),
    intervalStartLabel: t('quartzCron.simple.controls.intervalStart', { unit: controlName }),
    min,
    max,
    numberWidth,
    pickerTriggerWidth,
    pickerPopoverWidth,
    pickerColumns,
    options
  };
}

/** 创建闭区间数字选项，展示标签由调用方提供，值保持 Cron 原始数字。 */
function createNumberOptions(min: number, max: number, formatLabel: (value: number) => string): PickerOption[] {
  return Array.from({ length: max - min + 1 }, (_, index) => {
    const value = min + index;
    return {
      label: formatLabel(value),
      value
    };
  });
}

/** 秒选项按两位数字展示，便于和 Cron 字段位置对齐。 */
function formatSecondValue(value: number): string {
  return `${String(value).padStart(2, '0')} ${t('quartzCron.units.secondShort')}`;
}

/** 分钟选项按两位数字展示，避免和小时点位混淆。 */
function formatMinuteValue(value: number): string {
  return `${String(value).padStart(2, '0')} ${t('quartzCron.units.minuteShort')}`;
}

/** 小时使用点位语义，避免用户把字段误解成持续时长。 */
function formatHourValue(value: number): string {
  return `${String(value).padStart(2, '0')} ${t('quartzCron.units.hourPoint')}`;
}

/** 日期选项保留“日”单位，和星期规则区分开。 */
function formatDayValue(value: number): string {
  return t('quartzCron.day.dayLabel', { day: value });
}

/** 月份选项展示自然月份，不展示 Cron 内部英文别名。 */
function formatMonthValue(value: number): string {
  return t('quartzCron.month.monthLabel', { month: value });
}

/** 年份选项展示完整年份，避免和日期数字混淆。 */
function formatYearValue(value: number): string {
  return t('quartzCron.year.yearLabel', { year: value });
}

/** 普通字段行点击时显式写入模式，输入控件不再包进 radio label。 */
function setSimpleMode(key: QuartzSimpleFieldKey, mode: QuartzSimpleFieldMode): void {
  props.model[key].mode = mode;
  ensureSpecificValuesWhenModeSelected(key, mode);
  if (key === 'month' || key === 'year') {
    applyCalendarTimeSafety();
  }
}

/** 普通字段参数变化时集中写回；月和年属于日历规则，需要同步时间安全基线。 */
function updateSimpleField<TKey extends keyof QuartzSimpleFieldModel>(
  fieldKey: QuartzSimpleFieldKey,
  valueKey: TKey,
  value: QuartzSimpleFieldModel[TKey]
): void {
  props.model[fieldKey][valueKey] = value;
  normalizeEmptySimpleSelection(fieldKey, valueKey);
  if (fieldKey === 'month' || fieldKey === 'year') {
    applyCalendarTimeSafety();
  }
}

/** 天字段行点击时显式写入模式，保持日规则和星期规则互斥。 */
function setDayMode(mode: QuartzDayFieldMode): void {
  props.model.day.mode = mode;
  ensureDayValuesWhenModeSelected(mode);
  applyCalendarTimeSafety();
}

/** 日/周参数变化后同步安全规则，避免复杂行只改参数时留下每秒触发。 */
function updateDayField<TKey extends keyof QuartzDayFieldModel>(key: TKey, value: QuartzDayFieldModel[TKey]): void {
  props.model.day[key] = value;
  normalizeEmptyDaySelection(key);
  applyCalendarTimeSafety();
}

/** 指定值被清空时回到中性模式，避免 UI 显示指定状态但表达式已经退成通配符。 */
function normalizeEmptySimpleSelection<TKey extends keyof QuartzSimpleFieldModel>(fieldKey: QuartzSimpleFieldKey, valueKey: TKey): void {
  if (valueKey !== 'specificValues' || props.model[fieldKey].specificValues.length > 0) {
    return;
  }
  props.model[fieldKey].mode = getNeutralSimpleMode(fieldKey);
}

/** 重新选择指定模式时补齐合法默认值，避免出现空指定值生成通配语义。 */
function ensureSpecificValuesWhenModeSelected(fieldKey: QuartzSimpleFieldKey, mode: QuartzSimpleFieldMode): void {
  if (mode !== 'specific' || props.model[fieldKey].specificValues.length > 0) {
    return;
  }
  props.model[fieldKey].specificValues = [getDefaultSpecificValue(fieldKey)];
}

/** 日/周多选清空后回到每天，保证选中行、页签颜色和最终表达式一致。 */
function normalizeEmptyDaySelection<TKey extends keyof QuartzDayFieldModel>(key: TKey): void {
  const dayField = props.model.day;
  if (key === 'specificDays' && dayField.mode === 'daySpecific' && dayField.specificDays.length === 0) {
    dayField.mode = 'every';
    return;
  }
  if (key === 'specificWeekdays' && dayField.mode === 'weekSpecific' && dayField.specificWeekdays.length === 0) {
    dayField.mode = 'every';
  }
}

/** 重新进入日/周指定模式时补齐一个合法默认值，避免空数组继续生成通配字段。 */
function ensureDayValuesWhenModeSelected(mode: QuartzDayFieldMode): void {
  if (mode === 'daySpecific' && props.model.day.specificDays.length === 0) {
    props.model.day.specificDays = [1];
    return;
  }
  if (mode === 'weekSpecific' && props.model.day.specificWeekdays.length === 0) {
    props.model.day.specificWeekdays = [1];
  }
}

/** 返回普通字段清空指定值后的中性模式。 */
function getNeutralSimpleMode(fieldKey: QuartzSimpleFieldKey): QuartzSimpleFieldMode {
  return fieldKey === 'year' ? 'notSpecified' : 'every';
}

/** 返回重新选择指定模式时的默认值，优先沿用字段已有边界。 */
function getDefaultSpecificValue(fieldKey: QuartzSimpleFieldKey): number {
  const field = props.model[fieldKey];
  if (fieldKey === 'year') {
    return field.rangeStart;
  }
  return fieldKey === 'month' ? 1 : 0;
}

/** 将安全化后的模型写回当前可视化状态，保持 props.model 引用不变。 */
function applyCalendarTimeSafety(): void {
  const nextModel = ensureQuartzCalendarTimeSafety(props.model);
  if (nextModel === props.model) {
    return;
  }
  props.model.second = nextModel.second;
  props.model.minute = nextModel.minute;
  props.model.hour = nextModel.hour;
  props.model.day = nextModel.day;
  props.model.month = nextModel.month;
  props.model.year = nextModel.year;
}
</script>

<style lang="scss" scoped>
.quartz-cron-editor {
  max-width: 100%;
  width: 100%;
  min-width: 0;

  :deep(.el-tabs__content) {
    min-width: 0;
    padding: 10px 12px 12px;
    overflow-x: hidden;
  }
}

.quartz-cron-editor__tab-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition:
    color 0.16s ease;
}

.quartz-cron-editor__tab-label.is-constrained {
  color: #24745f;
  font-weight: 600;
}

.quartz-cron-editor :deep(.el-tabs__item.is-active) .quartz-cron-editor__tab-label.is-constrained,
.quartz-cron-editor :deep(.el-tabs__item:hover) .quartz-cron-editor__tab-label.is-constrained {
  color: #1f7a62;
}

.quartz-cron-editor__panel {
  max-width: 100%;
  min-height: 0;
  min-width: 0;
}

.quartz-cron-editor__group {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}

.quartz-cron-editor__section {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  margin: 3px 0 1px;
  color: #2f6b5a;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
}

.quartz-cron-editor__section::before {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #2f7d67;
  content: "";
}

.quartz-cron-editor__select-unit {
  display: inline-grid;
  grid-template-columns: max-content max-content;
  min-width: 0;
  align-items: center;
  gap: 6px;
  color: var(--el-text-color-regular);
  font-size: 13px;
  font-weight: 600;
}

.quartz-cron-editor__week-select {
  width: 156px;
  max-width: 100%;
}

.quartz-cron-editor__week-select :deep(.el-select__wrapper) {
  min-height: var(--app-control-height);
  align-items: center;
}

.quartz-cron-editor__week-select :deep(.el-select__selection) {
  min-width: 0;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
}

.quartz-cron-editor__week-select :deep(.el-select__selected-item) {
  min-width: 0;
}

@media (max-width: 640px) {
  .quartz-cron-editor {
    :deep(.el-tabs__content) {
      padding: 8px;
    }
  }

  .quartz-cron-editor__week-select {
    width: min(180px, 100%);
  }
}
</style>
