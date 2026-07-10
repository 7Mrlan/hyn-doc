import { Cron, type CronOptions } from 'croner';
import cronstrue from 'cronstrue';
import zhCnLocaleModule from 'cronstrue/locales/zh_CN.js';
import { t } from '@7mrlan/hyn-ui/runtime';

const DEFAULT_QUARTZ_EXPRESSION = '0 0/5 * * * ?';
const MIN_YEAR = 1970;
const MAX_YEAR = 2099;
const LAST_DAY_OFFSET_PATTERN = /^L-(\d{1,2})$/i;
const QUESTION_MARK_ALLOWED_FIELDS = new Set([3, 5]);
const visibleDayFieldModes = new Set<QuartzDayFieldMode>([
  'every',
  'dayInterval',
  'daySpecific',
  'lastDay',
  'lastWorkDay',
  'nearestWorkDay',
  'weekInterval',
  'weekSpecific',
  'lastSpecificWeek',
  'nthWeek'
]);

const quartzCronOptions: CronOptions = {
  paused: true,
  legacyMode: false
};

const quartzWeekNameToValue: Record<string, number> = {
  SUN: 1,
  MON: 2,
  TUE: 3,
  WED: 4,
  THU: 5,
  FRI: 6,
  SAT: 7
};

interface CronstrueLocaleRegistry {
  locales?: Record<string, unknown>;
}

interface CronstrueRuntimeShape {
  default?: CronstrueLocaleRegistry;
  locales?: Record<string, unknown>;
}

interface CronPreviewResolution {
  expression: string;
  supported: boolean;
  warningMessage?: string;
}

/** Quartz Cron 中可用同一套简单数值规则编辑的字段键。 */
export type QuartzSimpleFieldKey = 'second' | 'minute' | 'hour' | 'month' | 'year';

/** 简单数值字段的可视化编辑模式，对应通配、步进、指定值、范围和年份不指定语义。 */
export type QuartzSimpleFieldMode = 'every' | 'interval' | 'specific' | 'range' | 'notSpecified';

/**
 * Quartz 日/周互斥字段的可视化编辑模式。
 *
 * @remarks
 * 日字段和周字段只能有一侧使用具体规则，另一侧会输出 `?` 占位，避免生成不符合 Quartz 语义的表达式。
 */
export type QuartzDayFieldMode =
  | 'every'
  | 'notSpecified'
  | 'dayInterval'
  | 'daySpecific'
  | 'dayRange'
  | 'lastDay'
  | 'lastWorkDay'
  | 'nearestWorkDay'
  | 'weekInterval'
  | 'weekSpecific'
  | 'weekRange'
  | 'lastSpecificWeek'
  | 'nthWeek';

/** 秒、分、时、月、年字段在可视化编辑器中的统一状态模型。 */
export interface QuartzSimpleFieldModel {
  /** 当前字段采用的生成模式，决定后续数值配置如何转换为 Cron 片段。 */
  mode: QuartzSimpleFieldMode;
  /** 步进模式的起始值，例如分钟字段 `0/5` 中的 `0`。 */
  intervalStart: number;
  /** 步进模式的间隔值，例如分钟字段 `0/5` 中的 `5`。 */
  intervalStep: number;
  /** 指定值模式下选择的数字集合，生成时会去重排序。 */
  specificValues: number[];
  /** 范围模式的起始值，生成时会按字段边界规范化。 */
  rangeStart: number;
  /** 范围模式的结束值，生成时会和起始值一起校正顺序。 */
  rangeEnd: number;
}

/** Quartz 日字段和周字段共用的互斥状态模型。 */
export interface QuartzDayFieldModel {
  /** 当前日/周规则模式，决定输出日字段还是周字段，另一侧使用 `?`。 */
  mode: QuartzDayFieldMode;
  /** 按月中日期步进时的起始日，合法范围为 1-31。 */
  dayIntervalStart: number;
  /** 按月中日期步进时的间隔天数，合法范围为 1-31。 */
  dayIntervalStep: number;
  /** 指定月中日期集合，对应日字段的逗号列表。 */
  specificDays: number[];
  /** 月中日期范围起点，对应日字段 `start-end` 写法。 */
  dayRangeStart: number;
  /** 月中日期范围终点，对应日字段 `start-end` 写法。 */
  dayRangeEnd: number;
  /** 最近工作日模式的月中日期，对应 Quartz `nW` 写法。 */
  nearestWorkDay: number;
  /** 按星期步进时的起始星期，Quartz 编号为 1-7。 */
  weekIntervalStart: number;
  /** 按星期步进时的间隔值，合法范围为 1-7。 */
  weekIntervalStep: number;
  /** 指定星期集合，Quartz 编号为 1-7，1 表示 Sunday。 */
  specificWeekdays: number[];
  /** 星期范围起点，生成周字段 `start-end` 写法。 */
  weekRangeStart: number;
  /** 星期范围终点，生成周字段 `start-end` 写法。 */
  weekRangeEnd: number;
  /** 每月最后一个指定星期几，对应 Quartz `nL` 写法。 */
  lastSpecificWeekday: number;
  /** 每月第 N 个星期几中的星期值，对应 Quartz `weekday#nth` 写法。 */
  nthWeekday: number;
  /** 每月第 N 个星期几中的序号，合法范围为 1-5。 */
  nthWeek: number;
}

/** 可视化编辑器维护的完整 Quartz Cron 状态。 */
export interface QuartzCronModel {
  /** 秒字段模型，生成表达式第 1 段。 */
  second: QuartzSimpleFieldModel;
  /** 分钟字段模型，生成表达式第 2 段。 */
  minute: QuartzSimpleFieldModel;
  /** 小时字段模型，生成表达式第 3 段。 */
  hour: QuartzSimpleFieldModel;
  /** 日/周互斥模型，生成表达式第 4 段和第 6 段。 */
  day: QuartzDayFieldModel;
  /** 月字段模型，生成表达式第 5 段。 */
  month: QuartzSimpleFieldModel;
  /** 年字段模型，生成可选第 7 段；不指定时输出 6 段表达式。 */
  year: QuartzSimpleFieldModel;
}

/** 将原始 Quartz 表达式回显到可视化编辑器后的解析结果。 */
export interface QuartzCronParseResult {
  /** 是否能由可视化面板双向编辑；复杂合法写法会保持原始输入模式。 */
  editable: boolean;
  /** 可视化面板可使用的模型；不可编辑时也提供回退模型保证界面稳定。 */
  model: QuartzCronModel;
  /** 规范化后的原始表达式，空输入会回退到项目默认表达式。 */
  expression: string;
  /** 不可编辑或回退到原始模式时展示给用户的原因。 */
  reason?: string;
}

/** Cron 可视化编辑器可切换的字段页签键。 */
export type QuartzCronTabKey = QuartzSimpleFieldKey | 'day';

/** Cron 表达式校验、说明和执行预览的展示摘要。 */
export interface QuartzCronSummary {
  /** 经过空白规范化后的表达式。 */
  expression: string;
  /** 表达式是否通过 Quartz 结构和第三方库校验。 */
  valid: boolean;
  /** 当前界面默认展示的说明文本，默认使用中文说明。 */
  description: string;
  /** cronstrue 生成的中文说明。 */
  descriptionZh: string;
  /** cronstrue 生成的英文说明，便于 AI 或跨语言同事核对。 */
  descriptionEn: string;
  /** 最近执行时间预览，按浏览器本地时区格式化。 */
  nextRuns: string[];
  /** 是否属于高级模式，用于提示用户只能在原始输入框维护。 */
  advanced: boolean;
  /** 前端是否能计算最近执行时间；部分 Quartz 扩展只做合法性校验。 */
  previewSupported: boolean;
  /** 最近预览间隔是否不超过 1 分钟，用于提示用户确认高频任务压力。 */
  highFrequency: boolean;
  /** 预览不可用但表达式有效时的提示信息。 */
  previewWarning?: string;
  /** 表达式无效时面向页面展示的错误信息。 */
  errorMessage?: string;
}

registerZhCnLocale();

/** 返回任务表单默认使用的 Quartz Cron 表达式。 */
export function getDefaultQuartzExpression(): string {
  return DEFAULT_QUARTZ_EXPRESSION;
}

/** 返回可视化生成器默认模型，年份默认值按打开弹窗时的年份初始化。 */
export function createDefaultQuartzCronModel(year: number): QuartzCronModel {
  return {
    second: {
      ...createSimpleFieldModel('specific', 0, 59),
      specificValues: [0]
    },
    minute: {
      ...createSimpleFieldModel('interval', 0, 59),
      intervalStart: 0,
      intervalStep: 5
    },
    hour: createSimpleFieldModel('every', 0, 23),
    day: createDefaultDayFieldModel(),
    month: createSimpleFieldModel('every', 1, 12),
    year: createYearFieldModel('notSpecified', year)
  };
}

/** 统一清理 Quartz Cron 表达式中的多余空白，避免保存时带入不可见格式差异。 */
export function normalizeQuartzExpression(expression: string): string {
  return expression.trim().replace(/\s+/g, ' ');
}

/** 将可视化模型转换成 Quartz Cron 表达式，始终输出 6 段或 7 段标准文本。 */
export function buildQuartzCronExpression(model: QuartzCronModel): string {
  const dayParts = buildDayFieldExpression(model.day);
  const yearExpression = buildSimpleFieldExpression(model.year, MIN_YEAR, MAX_YEAR);
  const parts = [
    buildSimpleFieldExpression(model.second, 0, 59),
    buildSimpleFieldExpression(model.minute, 0, 59),
    buildSimpleFieldExpression(model.hour, 0, 23),
    dayParts.dayOfMonth,
    buildSimpleFieldExpression(model.month, 1, 12),
    dayParts.dayOfWeek
  ];

  if (yearExpression) {
    parts.push(yearExpression);
  }
  return parts.join(' ');
}

/**
 * 日历规则变更后收敛危险的全通配时间字段。
 *
 * @remarks
 * Quartz 的秒、分、时字段会和日历字段叠加生效；当三者都是 `*` 时，用户再选择“每天”或“最后一个工作日”
 * 会得到每秒执行的任务。该函数只处理这种没有明确时间意图的状态，已有固定时间或间隔规则会原样保留。
 */
export function ensureQuartzCalendarTimeSafety(model: QuartzCronModel): QuartzCronModel {
  if (hasExplicitQuartzTimeRule(model)) {
    return model;
  }
  return {
    ...cloneQuartzCronModel(model),
    second: createSpecificSimpleFieldModel(0, 0, 59),
    minute: createSpecificSimpleFieldModel(0, 0, 59),
    hour: createSpecificSimpleFieldModel(0, 0, 23)
  };
}

/** 尝试把原始 Quartz 表达式回显为可视化模型；复杂或不支持的写法会保留原始表达式模式。 */
export function parseQuartzExpressionToModel(expression: string, year: number): QuartzCronParseResult {
  const normalizedExpression = normalizeQuartzExpression(expression);
  const fallbackModel = createDefaultQuartzCronModel(year);
  if (!normalizedExpression) {
    return {
      editable: true,
      model: fallbackModel,
      expression: getDefaultQuartzExpression()
    };
  }

  const parts = splitQuartzExpression(normalizedExpression);
  if (!parts) {
    return createRawParseResult(normalizedExpression, fallbackModel, t('quartzCron.validation.fieldCount'));
  }

  const questionMarkError = getQuestionMarkFieldError(parts);
  const dayWeekError = getQuartzDayWeekError(parts);
  if (questionMarkError || dayWeekError) {
    return createRawParseResult(normalizedExpression, fallbackModel, questionMarkError ?? dayWeekError);
  }

  const second = parseSimpleFieldExpression(parts[0], 0, 59);
  const minute = parseSimpleFieldExpression(parts[1], 0, 59);
  const hour = parseSimpleFieldExpression(parts[2], 0, 23);
  const day = parseDayFieldExpression(parts[3], parts[5]);
  const month = parseSimpleFieldExpression(parts[4], 1, 12);
  const yearField = parseYearFieldExpression(parts[6] ?? '', year);

  if (!second || !minute || !hour || !day || !month || !yearField) {
    return createRawParseResult(normalizedExpression, fallbackModel, t('quartzCron.validation.unsupportedVisualSyntax'));
  }

  const parsedModel = {
    second,
    minute,
    hour,
    day,
    month,
    year: yearField
  };

  if (!visibleDayFieldModes.has(day.mode)) {
    return createRawParseResult(
      normalizedExpression,
      parsedModel,
      t('quartzCron.validation.advancedDayWeek')
    );
  }

  return {
    editable: true,
    expression: normalizedExpression,
    model: parsedModel
  };
}

/** 判断表达式是否可以安全交给可视化面板双向编辑。 */
export function isSafelyEditableQuartzExpression(expression: string): boolean {
  return parseQuartzExpressionToModel(expression, new Date().getFullYear()).editable;
}

/** 根据解析后的模型推导最值得展示的页签，避免打开弹窗时停留在无业务差异的秒字段。 */
export function resolveQuartzCronActiveTab(model: QuartzCronModel): QuartzCronTabKey {
  if (hasSinglePointTime(model) && model.day.mode !== 'every') {
    return 'day';
  }
  if (hasSinglePointTime(model) && model.month.mode !== 'every') {
    return 'month';
  }
  if (hasSinglePointTime(model) && model.year.mode !== 'notSpecified') {
    return 'year';
  }
  if (!isFixedSpecificField(model.second, 0)) {
    return 'second';
  }
  if (!isFixedSpecificField(model.minute, 0)) {
    return 'minute';
  }
  if (!isFixedSpecificField(model.hour, 0)) {
    return 'hour';
  }
  if (model.day.mode !== 'every') {
    return 'day';
  }
  if (model.month.mode !== 'every') {
    return 'month';
  }
  if (model.year.mode !== 'notSpecified') {
    return 'year';
  }
  return 'day';
}

/** 判断指定页签字段是否限制了自身取值范围，用于可视化页签的绿色状态。 */
export function isQuartzCronTabConstrained(model: QuartzCronModel, tabKey: QuartzCronTabKey): boolean {
  if (tabKey === 'second') {
    return isSimpleFieldConstrained(model.second, 'every');
  }
  if (tabKey === 'minute') {
    return isSimpleFieldConstrained(model.minute, 'every');
  }
  if (tabKey === 'hour') {
    return isSimpleFieldConstrained(model.hour, 'every');
  }
  if (tabKey === 'day') {
    return isDayFieldConstrained(model.day);
  }
  if (tabKey === 'month') {
    return isSimpleFieldConstrained(model.month, 'every');
  }
  return isSimpleFieldConstrained(model.year, 'notSpecified');
}

/** 按本地时区格式化最近执行时间，展示给用户核对调度预期。 */
export function formatQuartzRunTime(date: Date): string {
  const year = date.getFullYear();
  const month = padDatePart(date.getMonth() + 1);
  const day = padDatePart(date.getDate());
  const hour = padDatePart(date.getHours());
  const minute = padDatePart(date.getMinutes());
  const second = padDatePart(date.getSeconds());
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

/** 生成 Quartz Cron 的校验结果、中英文说明和最近执行时间预览。 */
export function getQuartzCronSummary(expression: string): QuartzCronSummary {
  const normalizedExpression = normalizeQuartzExpression(expression);
  if (!normalizedExpression) {
    return createInvalidSummary(normalizedExpression, t('quartzCron.validation.required'), false);
  }

  const parts = splitQuartzExpression(normalizedExpression);
  if (!parts) {
    return createInvalidSummary(normalizedExpression, t('quartzCron.validation.fieldCount'), false);
  }

  const questionMarkError = getQuestionMarkFieldError(parts);
  const dayWeekError = getQuartzDayWeekError(parts);
  if (questionMarkError || dayWeekError) {
    return createInvalidSummary(normalizedExpression, questionMarkError ?? dayWeekError ?? t('quartzCron.validation.invalid'), true);
  }

  try {
    const previewResolution = resolveCronPreviewExpression(parts);
    const cron = new Cron(previewResolution.expression, quartzCronOptions);
    const descriptionZh = describeQuartzCron(normalizedExpression, 'zh_CN');
    const descriptionEn = describeQuartzCron(normalizedExpression, 'en');
    const nextRunDates = previewResolution.supported ? cron.nextRuns(5) : [];
    const nextRuns = nextRunDates.map(formatQuartzRunTime);

    return {
      expression: normalizedExpression,
      valid: true,
      description: descriptionZh,
      descriptionZh,
      descriptionEn,
      nextRuns,
      advanced: !isSafelyEditableQuartzExpression(normalizedExpression) || !previewResolution.supported,
      previewSupported: previewResolution.supported,
      highFrequency: hasHighFrequencyPreview(nextRunDates),
      previewWarning: previewResolution.warningMessage
    };
  } catch (error) {
    return createInvalidSummary(
      normalizedExpression,
      getCronErrorMessage(error),
      !isSafelyEditableQuartzExpression(normalizedExpression)
    );
  }
}

/** 显式注册中文 locale，避免 Vite 下 UMD side-effect 注册到错误实例。 */
function registerZhCnLocale(): void {
  const localeRegistry = resolveCronstrueLocaleRegistry();
  localeRegistry.zh_CN = new zhCnLocaleModule.zh_CN();
}

/** 解析 cronstrue 在不同模块格式下实际使用的 locale registry。 */
function resolveCronstrueLocaleRegistry(): Record<string, unknown> {
  const runtime = cronstrue as unknown as CronstrueRuntimeShape;
  if (runtime.locales) {
    return runtime.locales;
  }
  if (runtime.default?.locales) {
    return runtime.default.locales;
  }
  throw new Error('cronstrue locale registry 不存在，无法注册中文 Cron 说明');
}

/** 创建普通字段模型，调用方用返回值补齐具体默认值。 */
function createSimpleFieldModel(mode: QuartzSimpleFieldMode, min: number, max: number): QuartzSimpleFieldModel {
  return {
    mode,
    intervalStart: min,
    intervalStep: 1,
    specificValues: [min],
    rangeStart: min,
    rangeEnd: max
  };
}

/** 创建固定单值字段模型，避免日历规则回退时生成秒级通配任务。 */
function createSpecificSimpleFieldModel(value: number, min: number, max: number): QuartzSimpleFieldModel {
  return {
    ...createSimpleFieldModel('specific', min, max),
    specificValues: [normalizeInteger(value, min, max)]
  };
}

/** 判断秒、分、时是否已经有明确规则；只有三者全通配才需要自动收敛。 */
function hasExplicitQuartzTimeRule(model: QuartzCronModel): boolean {
  return model.second.mode !== 'every' || model.minute.mode !== 'every' || model.hour.mode !== 'every';
}

/** 判断秒、分、时是否都是固定单值，用于把日历规则作为打开弹窗后的主焦点。 */
function hasSinglePointTime(model: QuartzCronModel): boolean {
  return (
    model.second.mode === 'specific' &&
    model.second.specificValues.length === 1 &&
    model.minute.mode === 'specific' &&
    model.minute.specificValues.length === 1 &&
    model.hour.mode === 'specific' &&
    model.hour.specificValues.length === 1
  );
}

/** 判断普通字段是否限制了自身取值范围，`*` 和不指定年份都属于未限制。 */
function isSimpleFieldConstrained(field: QuartzSimpleFieldModel, neutralMode: QuartzSimpleFieldMode): boolean {
  if (field.mode === neutralMode) {
    return false;
  }
  if (field.mode === 'specific') {
    return field.specificValues.length > 0;
  }
  return true;
}

/** 判断日/周字段是否限制了日期取值范围，每天和不指定都属于未限制。 */
function isDayFieldConstrained(field: QuartzDayFieldModel): boolean {
  if (field.mode === 'every' || field.mode === 'notSpecified') {
    return false;
  }
  if (field.mode === 'daySpecific') {
    return field.specificDays.length > 0;
  }
  if (field.mode === 'weekSpecific') {
    return field.specificWeekdays.length > 0;
  }
  return true;
}

/** 判断字段是否是指定的固定单值，这类字段通常只是 Cron 时间锚点。 */
function isFixedSpecificField(field: QuartzSimpleFieldModel, value: number): boolean {
  return field.mode === 'specific' && field.specificValues.length === 1 && field.specificValues[0] === value;
}

/** 克隆完整模型，保证导出的安全化函数不改写调用方传入对象。 */
function cloneQuartzCronModel(model: QuartzCronModel): QuartzCronModel {
  return {
    second: cloneSimpleFieldModel(model.second),
    minute: cloneSimpleFieldModel(model.minute),
    hour: cloneSimpleFieldModel(model.hour),
    day: cloneDayFieldModel(model.day),
    month: cloneSimpleFieldModel(model.month),
    year: cloneSimpleFieldModel(model.year)
  };
}

/** 克隆普通字段模型，避免数组字段被返回模型共享。 */
function cloneSimpleFieldModel(field: QuartzSimpleFieldModel): QuartzSimpleFieldModel {
  return {
    ...field,
    specificValues: [...field.specificValues]
  };
}

/** 克隆日/周字段模型，避免多选数组在安全化后共享引用。 */
function cloneDayFieldModel(field: QuartzDayFieldModel): QuartzDayFieldModel {
  return {
    ...field,
    specificDays: [...field.specificDays],
    specificWeekdays: [...field.specificWeekdays]
  };
}

/** 创建年份字段模型，年份默认范围围绕当前年份展示。 */
function createYearFieldModel(mode: QuartzSimpleFieldMode, year: number): QuartzSimpleFieldModel {
  const normalizedYear = normalizeInteger(year, MIN_YEAR, MAX_YEAR);
  return {
    mode,
    intervalStart: normalizedYear,
    intervalStep: 1,
    specificValues: [normalizedYear],
    rangeStart: normalizedYear,
    rangeEnd: normalizeInteger(normalizedYear + 10, MIN_YEAR, MAX_YEAR)
  };
}

/** 创建日/周字段默认模型，默认语义为每天执行且周字段不指定。 */
function createDefaultDayFieldModel(): QuartzDayFieldModel {
  return {
    mode: 'every',
    dayIntervalStart: 1,
    dayIntervalStep: 1,
    specificDays: [1],
    dayRangeStart: 1,
    dayRangeEnd: 31,
    nearestWorkDay: 1,
    weekIntervalStart: 1,
    weekIntervalStep: 1,
    specificWeekdays: [1],
    weekRangeStart: 1,
    weekRangeEnd: 7,
    lastSpecificWeekday: 1,
    nthWeekday: 1,
    nthWeek: 1
  };
}

/** 拆分表达式字段，只接受 Quartz 常用的 6 段或 7 段格式。 */
function splitQuartzExpression(expression: string): string[] | undefined {
  const parts = normalizeQuartzExpression(expression).split(' ');
  return parts.length === 6 || parts.length === 7 ? parts : undefined;
}

/** 校验问号只出现在日和周字段，避免 Croner 宽松解析吞掉错误。 */
function getQuestionMarkFieldError(parts: string[]): string | undefined {
  const invalidIndex = parts.findIndex((part, index) => part.includes('?') && !QUESTION_MARK_ALLOWED_FIELDS.has(index));
  if (invalidIndex >= 0) {
    return t('quartzCron.validation.questionMarkAllowed');
  }
  return undefined;
}

/** 校验 Quartz 日和周字段必须且只能有一个使用问号占位。 */
function getQuartzDayWeekError(parts: string[]): string | undefined {
  const dayIsNone = parts[3] === '?';
  const weekIsNone = parts[5] === '?';
  if (dayIsNone === weekIsNone) {
    return t('quartzCron.validation.dayWeekQuestionMark');
  }
  return undefined;
}

/** 将普通数值字段模型转换为单个 Cron 字段。 */
function buildSimpleFieldExpression(field: QuartzSimpleFieldModel, min: number, max: number): string {
  if (field.mode === 'notSpecified') {
    return '';
  }
  if (field.mode === 'every') {
    return '*';
  }
  if (field.mode === 'interval') {
    const start = normalizeInteger(field.intervalStart, min, max);
    const step = normalizeInteger(field.intervalStep, 1, max - min + 1);
    return `${start}/${step}`;
  }
  if (field.mode === 'range') {
    const range = normalizeRange(field.rangeStart, field.rangeEnd, min, max);
    return `${range.start}-${range.end}`;
  }
  const values = normalizeNumberList(field.specificValues, min, max);
  return values.length ? values.join(',') : '*';
}

/** 将日/周组合模型转换为互斥的日字段和周字段。 */
function buildDayFieldExpression(field: QuartzDayFieldModel): { dayOfMonth: string; dayOfWeek: string } {
  if (field.mode === 'notSpecified') {
    return { dayOfMonth: '?', dayOfWeek: '*' };
  }
  if (field.mode === 'dayInterval') {
    return {
      dayOfMonth: `${normalizeInteger(field.dayIntervalStart, 1, 31)}/${normalizeInteger(field.dayIntervalStep, 1, 31)}`,
      dayOfWeek: '?'
    };
  }
  if (field.mode === 'daySpecific') {
    const values = normalizeNumberList(field.specificDays, 1, 31);
    return { dayOfMonth: values.length ? values.join(',') : '*', dayOfWeek: '?' };
  }
  if (field.mode === 'dayRange') {
    const range = normalizeRange(field.dayRangeStart, field.dayRangeEnd, 1, 31);
    return { dayOfMonth: `${range.start}-${range.end}`, dayOfWeek: '?' };
  }
  if (field.mode === 'lastDay') {
    return { dayOfMonth: 'L', dayOfWeek: '?' };
  }
  if (field.mode === 'lastWorkDay') {
    return { dayOfMonth: 'LW', dayOfWeek: '?' };
  }
  if (field.mode === 'nearestWorkDay') {
    return { dayOfMonth: `${normalizeInteger(field.nearestWorkDay, 1, 31)}W`, dayOfWeek: '?' };
  }
  if (field.mode === 'weekInterval') {
    return {
      dayOfMonth: '?',
      dayOfWeek: `${normalizeInteger(field.weekIntervalStart, 1, 7)}/${normalizeInteger(field.weekIntervalStep, 1, 7)}`
    };
  }
  if (field.mode === 'weekSpecific') {
    const values = normalizeNumberList(field.specificWeekdays, 1, 7);
    return { dayOfMonth: '?', dayOfWeek: values.length ? values.join(',') : '*' };
  }
  if (field.mode === 'weekRange') {
    const range = normalizeRange(field.weekRangeStart, field.weekRangeEnd, 1, 7);
    return { dayOfMonth: '?', dayOfWeek: `${range.start}-${range.end}` };
  }
  if (field.mode === 'lastSpecificWeek') {
    return { dayOfMonth: '?', dayOfWeek: `${normalizeInteger(field.lastSpecificWeekday, 1, 7)}L` };
  }
  if (field.mode === 'nthWeek') {
    return {
      dayOfMonth: '?',
      dayOfWeek: `${normalizeInteger(field.nthWeekday, 1, 7)}#${normalizeInteger(field.nthWeek, 1, 5)}`
    };
  }
  return { dayOfMonth: '*', dayOfWeek: '?' };
}

/** 解析普通数值字段，无法无损回显时返回 undefined。 */
function parseSimpleFieldExpression(expression: string, min: number, max: number): QuartzSimpleFieldModel | undefined {
  const normalizedExpression = expression.toUpperCase();
  if (normalizedExpression === '*') {
    return createSimpleFieldModel('every', min, max);
  }

  const interval = parseStepFieldExpression(normalizedExpression, min, max, 1, max - min + 1);
  if (interval) {
    return {
      ...createSimpleFieldModel('interval', min, max),
      intervalStart: interval.first,
      intervalStep: interval.second
    };
  }

  const range = parseNumericPair(normalizedExpression, '-', min, max, min, max);
  if (range) {
    return {
      ...createSimpleFieldModel('range', min, max),
      rangeStart: range.first,
      rangeEnd: range.second
    };
  }

  const values = parseNumberList(normalizedExpression, min, max);
  if (values) {
    return {
      ...createSimpleFieldModel('specific', min, max),
      specificValues: values
    };
  }

  return undefined;
}

/** 解析年份字段，空年份保留为 6 段 Cron 的不指定年份状态。 */
function parseYearFieldExpression(expression: string, year: number): QuartzSimpleFieldModel | undefined {
  if (!expression || expression === '*') {
    return createYearFieldModel('notSpecified', year);
  }
  return parseSimpleFieldExpression(expression, MIN_YEAR, MAX_YEAR);
}

/** 解析日和周互斥字段，支持常用 Quartz 高级写法。 */
function parseDayFieldExpression(dayExpression: string, weekExpression: string): QuartzDayFieldModel | undefined {
  const day = dayExpression.toUpperCase();
  const week = weekExpression.toUpperCase();
  if (day === '*' && week === '?') {
    return createDefaultDayFieldModel();
  }
  if (day === '?' && week === '*') {
    return {
      ...createDefaultDayFieldModel(),
      mode: 'notSpecified'
    };
  }
  if (week === '?') {
    return parseDayOfMonthField(day);
  }
  if (day === '?') {
    return parseDayOfWeekField(week);
  }
  return undefined;
}

/** 解析日字段的可视化支持模式。 */
function parseDayOfMonthField(dayExpression: string): QuartzDayFieldModel | undefined {
  if (dayExpression === 'L') {
    return { ...createDefaultDayFieldModel(), mode: 'lastDay' };
  }
  if (dayExpression === 'LW') {
    return { ...createDefaultDayFieldModel(), mode: 'lastWorkDay' };
  }

  const nearestWorkDay = parseTrailingNumber(dayExpression, 'W', 1, 31);
  if (nearestWorkDay !== undefined) {
    return {
      ...createDefaultDayFieldModel(),
      mode: 'nearestWorkDay',
      nearestWorkDay
    };
  }

  const interval = parseStepFieldExpression(dayExpression, 1, 31, 1, 31);
  if (interval) {
    return {
      ...createDefaultDayFieldModel(),
      mode: 'dayInterval',
      dayIntervalStart: interval.first,
      dayIntervalStep: interval.second
    };
  }

  const range = parseNumericPair(dayExpression, '-', 1, 31, 1, 31);
  if (range) {
    return {
      ...createDefaultDayFieldModel(),
      mode: 'dayRange',
      dayRangeStart: range.first,
      dayRangeEnd: range.second
    };
  }

  const values = parseNumberList(dayExpression, 1, 31);
  if (values) {
    return {
      ...createDefaultDayFieldModel(),
      mode: 'daySpecific',
      specificDays: values
    };
  }

  return undefined;
}

/** 解析周字段的可视化支持模式，并按 Quartz 星期编号回显。 */
function parseDayOfWeekField(weekExpression: string): QuartzDayFieldModel | undefined {
  const lastSpecificWeekday = parseTrailingWeekday(weekExpression, 'L');
  if (lastSpecificWeekday !== undefined) {
    return {
      ...createDefaultDayFieldModel(),
      mode: 'lastSpecificWeek',
      lastSpecificWeekday
    };
  }

  const nthWeek = parseNthWeekday(weekExpression);
  if (nthWeek) {
    return {
      ...createDefaultDayFieldModel(),
      mode: 'nthWeek',
      nthWeekday: nthWeek.weekday,
      nthWeek: nthWeek.nth
    };
  }

  const interval = parseWeekStepFieldExpression(weekExpression, 1, 7);
  if (interval) {
    return {
      ...createDefaultDayFieldModel(),
      mode: 'weekInterval',
      weekIntervalStart: interval.first,
      weekIntervalStep: interval.second
    };
  }

  const range = parseWeekPair(weekExpression, '-', 1, 7);
  if (range) {
    return {
      ...createDefaultDayFieldModel(),
      mode: 'weekRange',
      weekRangeStart: range.first,
      weekRangeEnd: range.second
    };
  }

  const values = parseWeekList(weekExpression);
  if (values) {
    return {
      ...createDefaultDayFieldModel(),
      mode: 'weekSpecific',
      specificWeekdays: values
    };
  }

  return undefined;
}

/** 为无法回显的表达式创建原始表达式模式结果。 */
function createRawParseResult(expression: string, model: QuartzCronModel, reason: string | undefined): QuartzCronParseResult {
  return {
    editable: false,
    model,
    expression,
    reason
  };
}

/** 为无效表达式创建统一摘要结果。 */
function createInvalidSummary(expression: string, errorMessage: string, advanced: boolean): QuartzCronSummary {
  return {
    expression,
    valid: false,
    description: '',
    descriptionZh: '',
    descriptionEn: '',
    nextRuns: [],
    advanced,
    previewSupported: false,
    highFrequency: false,
    errorMessage
  };
}

/** 根据最近执行时间判断是否属于用户需要额外确认的高频任务。 */
function hasHighFrequencyPreview(nextRuns: Date[]): boolean {
  if (nextRuns.length < 2) {
    return false;
  }
  return nextRuns.slice(1).some((runTime, index) => runTime.getTime() - nextRuns[index].getTime() <= 60_000);
}

/** 解析 Croner 可预览表达式；L-N 只做合法性校验，不伪造最近执行时间。 */
function resolveCronPreviewExpression(parts: string[]): CronPreviewResolution {
  const lastDayOffsetMatch = parts[3].match(LAST_DAY_OFFSET_PATTERN);
  if (!lastDayOffsetMatch) {
    return {
      expression: parts.join(' '),
      supported: true
    };
  }

  const offset = Number(lastDayOffsetMatch[1]);
  if (!Number.isInteger(offset) || offset < 1 || offset > 31) {
    throw new Error(t('quartzCron.validation.lastDayOffsetRange'));
  }

  const previewParts = [...parts];
  previewParts[3] = 'L';
  return {
    expression: previewParts.join(' '),
    supported: false,
    warningMessage: t('quartzCron.validation.lastDayOffsetPreviewUnsupported')
  };
}

/** 使用 cronstrue 生成中文或英文说明，星期编号固定为 Quartz 规范。 */
function describeQuartzCron(expression: string, locale: 'zh_CN' | 'en'): string {
  return cronstrue.toString(expression, {
    locale,
    use24HourTimeFormat: true,
    dayOfWeekStartIndexZero: false
  });
}

/** 解析步进字段，支持 `N/M` 和星号起点步进写法。 */
function parseStepFieldExpression(
  expression: string,
  firstMin: number,
  firstMax: number,
  secondMin: number,
  secondMax: number
): { first: number; second: number } | undefined {
  const pair = expression.split('/');
  if (pair.length !== 2) {
    return undefined;
  }
  const first = pair[0] === '*' ? firstMin : parseInteger(pair[0], firstMin, firstMax);
  const second = parseInteger(pair[1], secondMin, secondMax);
  if (first === undefined || second === undefined) {
    return undefined;
  }
  return { first, second };
}

/** 解析星期步进字段，支持 `MON/2`、`2/2` 和星号起点步进写法。 */
function parseWeekStepFieldExpression(
  expression: string,
  secondMin: number,
  secondMax: number
): { first: number; second: number } | undefined {
  const pair = expression.split('/');
  if (pair.length !== 2) {
    return undefined;
  }
  const first = pair[0] === '*' ? 1 : parseWeekValue(pair[0]);
  const second = parseInteger(pair[1], secondMin, secondMax) ?? parseWeekValue(pair[1]);
  if (first === undefined || second === undefined) {
    return undefined;
  }
  return { first, second };
}

/** 解析用固定分隔符连接的两个数值。 */
function parseNumericPair(
  expression: string,
  separator: '/' | '-',
  firstMin: number,
  firstMax: number,
  secondMin: number,
  secondMax: number
): { first: number; second: number } | undefined {
  const pair = expression.split(separator);
  if (pair.length !== 2) {
    return undefined;
  }
  const first = parseInteger(pair[0], firstMin, firstMax);
  const second = parseInteger(pair[1], secondMin, secondMax);
  if (first === undefined || second === undefined) {
    return undefined;
  }
  return { first, second };
}

/** 解析用固定分隔符连接的两个 Quartz 星期值。 */
function parseWeekPair(
  expression: string,
  separator: '/' | '-',
  secondMin: number,
  secondMax: number
): { first: number; second: number } | undefined {
  const pair = expression.split(separator);
  if (pair.length !== 2) {
    return undefined;
  }
  const first = parseWeekValue(pair[0]);
  const second = parseInteger(pair[1], secondMin, secondMax) ?? parseWeekValue(pair[1]);
  if (first === undefined || second === undefined) {
    return undefined;
  }
  return { first, second };
}

/** 解析逗号分隔的数字列表，并去重排序。 */
function parseNumberList(expression: string, min: number, max: number): number[] | undefined {
  const values = expression.split(',').map(item => parseInteger(item, min, max));
  if (values.some(item => item === undefined)) {
    return undefined;
  }
  return normalizeNumberList(values as number[], min, max);
}

/** 解析逗号分隔的 Quartz 星期列表，并去重排序。 */
function parseWeekList(expression: string): number[] | undefined {
  const values = expression.split(',').map(parseWeekValue);
  if (values.some(item => item === undefined)) {
    return undefined;
  }
  return normalizeNumberList(values as number[], 1, 7);
}

/** 解析以固定字符结尾的日字段数字。 */
function parseTrailingNumber(expression: string, suffix: string, min: number, max: number): number | undefined {
  if (!expression.endsWith(suffix)) {
    return undefined;
  }
  return parseInteger(expression.slice(0, -suffix.length), min, max);
}

/** 解析以固定字符结尾的 Quartz 星期值。 */
function parseTrailingWeekday(expression: string, suffix: string): number | undefined {
  if (!expression.endsWith(suffix)) {
    return undefined;
  }
  return parseWeekValue(expression.slice(0, -suffix.length));
}

/** 解析周字段的第 N 个星期几写法。 */
function parseNthWeekday(expression: string): { weekday: number; nth: number } | undefined {
  const pair = expression.split('#');
  if (pair.length !== 2) {
    return undefined;
  }
  const weekday = parseWeekValue(pair[0]);
  const nth = parseInteger(pair[1], 1, 5);
  if (weekday === undefined || nth === undefined) {
    return undefined;
  }
  return { weekday, nth };
}

/** 解析 Quartz 星期值，支持数字和 SUN/MON 等英文别名。 */
function parseWeekValue(value: string): number | undefined {
  const normalizedValue = value.toUpperCase();
  if (normalizedValue in quartzWeekNameToValue) {
    return quartzWeekNameToValue[normalizedValue];
  }
  return parseInteger(normalizedValue, 1, 7);
}

/** 解析整数并校验范围。 */
function parseInteger(value: string, min: number, max: number): number | undefined {
  if (!/^\d+$/.test(value)) {
    return undefined;
  }
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue >= min && parsedValue <= max ? parsedValue : undefined;
}

/** 规范化单个整数，避免控件空值导致生成非法表达式。 */
function normalizeInteger(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

/** 规范化范围两端，确保起止顺序和边界合法。 */
function normalizeRange(start: number, end: number, min: number, max: number): { start: number; end: number } {
  const normalizedStart = normalizeInteger(start, min, max);
  const normalizedEnd = normalizeInteger(end, min, max);
  return {
    start: Math.min(normalizedStart, normalizedEnd),
    end: Math.max(normalizedStart, normalizedEnd)
  };
}

/** 规范化多选数字，过滤越界值并保持输出稳定。 */
function normalizeNumberList(values: number[], min: number, max: number): number[] {
  return Array.from(new Set(values.map(value => normalizeInteger(value, min, max)))).toSorted((first, second) => first - second);
}

/** 将第三方解析错误转换成页面可读的中文提示。 */
function getCronErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return t('quartzCron.validation.parseFailed', { message: error.message });
  }
  if (typeof error === 'string' && error) {
    return t('quartzCron.validation.parseFailed', { message: error });
  }
  return t('quartzCron.validation.parseFailedGeneric');
}

/** 补齐日期数字前导零，保持预览时间宽度稳定。 */
function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}
