import type { HynTreeSelectModelValue, HynTreeSelectValue } from '../types';

/**
 * 根据单选或多选模式归一化 HynTreeSelect 绑定值。
 *
 * @remarks
 * 多选始终向外提交数组，单选始终提交单个主键或 undefined，避免表单模型因交互路径变化而出现两种值形态。
 */
export function normalizeHynTreeSelectModelValue(
  value: HynTreeSelectModelValue,
  multiple: boolean
): HynTreeSelectModelValue {
  if (multiple) {
    if (Array.isArray(value)) {
      return value;
    }
    return value === undefined || value === null || value === '' ? [] : [value];
  }
  if (Array.isArray(value)) {
    return value[0];
  }
  return value === null ? undefined : value;
}

/** 将树选择绑定值转换为主键数组，供虚拟树回显、勾选和定位共用。 */
export function getHynTreeSelectedKeys(value: HynTreeSelectModelValue, multiple: boolean): HynTreeSelectValue[] {
  const normalizedValue = normalizeHynTreeSelectModelValue(value, multiple);
  if (Array.isArray(normalizedValue)) {
    return normalizedValue;
  }
  return normalizedValue === undefined ? [] : [normalizedValue];
}
