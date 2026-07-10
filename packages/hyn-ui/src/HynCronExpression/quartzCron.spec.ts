import { describe, expect, it } from 'vitest';
import {
  buildQuartzCronExpression,
  ensureQuartzCalendarTimeSafety,
  getDefaultQuartzExpression,
  getQuartzCronSummary,
  isQuartzCronTabConstrained,
  parseQuartzExpressionToModel,
  resolveQuartzCronActiveTab,
  type QuartzCronModel,
  type QuartzCronTabKey
} from './quartzCron';

const testYear = 2026;
const tabOrder: QuartzCronTabKey[] = ['second', 'minute', 'hour', 'day', 'month', 'year'];

/** 解析测试表达式并确保它处于可视化可编辑模式，失败时直接暴露契约问题。 */
function parseEditableModel(expression: string): QuartzCronModel {
  const parseResult = parseQuartzExpressionToModel(expression, testYear);
  expect(parseResult.editable).toBe(true);
  return parseResult.model;
}

/** 模拟用户在日历规则里切换模式后，生成器应执行的时间安全化流程。 */
function buildExpressionAfterDayMode(expression: string, mode: QuartzCronModel['day']['mode']): string {
  const model = parseEditableModel(expression);
  const safeModel = ensureQuartzCalendarTimeSafety({
    ...model,
    day: {
      ...model.day,
      mode
    }
  });
  return buildQuartzCronExpression(safeModel);
}

/** 返回表达式中已限制自身取值范围的页签，确保绿色状态只表达一种语义。 */
function getConstrainedTabs(expression: string): QuartzCronTabKey[] {
  const model = parseEditableModel(expression);
  return tabOrder.filter(tab => isQuartzCronTabConstrained(model, tab));
}

describe('quartzCron', () => {
  it('keeps the project default expression unchanged', () => {
    expect(getDefaultQuartzExpression()).toBe('0 0/5 * * * ?');
  });

  it('shows star based minute intervals on the minute tab', () => {
    const model = parseEditableModel('0 */5 * * * ?');

    expect(buildQuartzCronExpression(model)).toBe('0 0/5 * * * ?');
    expect(resolveQuartzCronActiveTab(model)).toBe('minute');
  });

  it('anchors all-wildcard time fields when selecting every day', () => {
    expect(buildExpressionAfterDayMode('* * * * * ?', 'every')).toBe('0 0 0 * * ?');
  });

  it('anchors all-wildcard time fields when selecting the last weekday', () => {
    expect(buildExpressionAfterDayMode('* * * * * ?', 'lastWorkDay')).toBe('0 0 0 LW * ?');
  });

  it('preserves an explicit fixed time when changing the day rule', () => {
    expect(buildExpressionAfterDayMode('0 30 8 * * ?', 'lastWorkDay')).toBe('0 30 8 LW * ?');
  });

  it('preserves an explicit minute interval when changing the day rule', () => {
    expect(buildExpressionAfterDayMode('0 */5 * * * ?', 'lastWorkDay')).toBe('0 0/5 * LW * ?');
  });

  it('keeps combined second interval descriptions available', () => {
    const summary = getQuartzCronSummary('13/24 * * * * ?');

    expect(summary.valid).toBe(true);
    expect(summary.descriptionZh).toContain('24');
    expect(summary.descriptionZh).toContain('13');
    expect(summary.descriptionEn).toContain('24');
    expect(summary.descriptionEn).toContain('13');
    expect(summary.highFrequency).toBe(true);
  });

  it('treats wildcard time fields as unconstrained while keeping high frequency warnings', () => {
    const summary = getQuartzCronSummary('* * * * * ?');

    expect(getConstrainedTabs('* * * * * ?')).toEqual([]);
    expect(summary.valid).toBe(true);
    expect(summary.highFrequency).toBe(true);
    expect(summary.descriptionEn).toContain('Every second');
  });

  it('marks fixed seconds as constrained without marking wildcard minutes or hours', () => {
    expect(getConstrainedTabs('0 * * * * ?')).toEqual(['second']);
  });

  it('marks fixed seconds and minutes for hourly schedules', () => {
    expect(getConstrainedTabs('0 0 * * * ?')).toEqual(['second', 'minute']);
  });

  it('marks fixed seconds minutes and hours for midnight schedules', () => {
    expect(getConstrainedTabs('0 0 0 * * ?')).toEqual(['second', 'minute', 'hour']);
  });

  it('marks interval minutes while keeping the default active tab on minute', () => {
    const model = parseEditableModel('0 0/5 * * * ?');

    expect(tabOrder.filter(tab => isQuartzCronTabConstrained(model, tab))).toEqual(['second', 'minute']);
    expect(resolveQuartzCronActiveTab(model)).toBe('minute');
  });
});
