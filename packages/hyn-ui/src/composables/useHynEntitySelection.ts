import { computed, shallowRef, ref, watch, type Ref } from 'vue';
import type { HynEntityAdapter, HynEntityKey, HynEntityModelValue } from '../HynEntityPicker/types';

/**
 * 实体选择共享状态配置。
 */
interface UseHynEntitySelectionOptions<TRow> {
  /** 当前是否多选。 */
  multiple: Ref<boolean>;
  /** 外部 v-model 绑定值。 */
  modelValue: Ref<HynEntityModelValue>;
  /** 当前实体数据适配器。 */
  adapter: Ref<HynEntityAdapter<TRow>>;
}

/**
 * 实体选择变更载荷。
 */
interface HynEntitySelectionChange<TRow> {
  /** 对外发出的单选或多选 key。 */
  value: HynEntityModelValue;
  /** 对外发出的完整实体行，用于页面同步展示。 */
  rows: TRow[];
}

/** 将外部 modelValue 归一化为字符串 key，便于跨数字/字符串主键稳定比较。 */
const normalizeModelKeys = (value: HynEntityModelValue): string[] => {
  // 对外 v-model 允许单值、多值和空值；内部统一成字符串 key 才能稳定跨页缓存选中行。
  if (value === undefined || value === null || value === '') {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter(item => item !== undefined && item !== null && item !== '').map(item => String(item));
  }
  return [String(value)];
};

/** 根据选中 key 和缓存行生成符合单选/多选语义的外部值。 */
const buildModelValue = <TRow>(
  selectedKeys: string[],
  selectedRows: Map<string, TRow>,
  multiple: boolean,
  adapter: HynEntityAdapter<TRow>
): HynEntityModelValue => {
  const resolvedKeys = selectedKeys.map(key => selectedRows.get(key)).filter((row): row is TRow => Boolean(row)).map(row => adapter.getKey(row));
  if (multiple) {
    return resolvedKeys;
  }
  return resolvedKeys[0];
};

/** 按主键去重实体行，避免远程候选与已选缓存合并时重复写入。 */
const dedupeRowsByKey = <TRow>(rows: TRow[], adapter: HynEntityAdapter<TRow>): TRow[] => {
  const rowMap = new Map<string, TRow>();
  rows.forEach(row => {
    rowMap.set(String(adapter.getKey(row)), row);
  });
  return Array.from(rowMap.values());
};

/**
 * 实体选择共享状态：负责远程回显、跨页缓存、单选/多选输出。
 *
 * @remarks
 * HynRemoteSelect 和 HynEntityPicker 共用该逻辑，避免两个组件在回显和跨页选择上出现不同语义。
 */
export function useHynEntitySelection<TRow>(
  options: UseHynEntitySelectionOptions<TRow>,
  onChange: (payload: HynEntitySelectionChange<TRow>) => void
) {
  const selectedRowsByKey = shallowRef<Map<string, TRow>>(new Map());
  const selectedKeys = ref<string[]>([]);
  const resolving = ref(false);
  const normalizedSelectedKeys = computed(() => normalizeModelKeys(options.modelValue.value));
  const selectedRows = computed<TRow[]>(() =>
    selectedKeys.value.map(key => selectedRowsByKey.value.get(key)).filter((row): row is TRow => Boolean(row))
  );

  /** 合并当前页或详情接口返回的实体，保证跨页选中项不会丢失展示。 */
  const mergeRows = (rows: TRow[]): void => {
    const nextRows = new Map(selectedRowsByKey.value);
    rows.forEach(row => {
      nextRows.set(String(options.adapter.value.getKey(row)), row);
    });
    selectedRowsByKey.value = nextRows;
  };

  /** 按当前 modelValue 远程补齐回显实体。 */
  const resolveSelectedRows = async (): Promise<void> => {
    const missingKeys = selectedKeys.value.filter(key => !selectedRowsByKey.value.has(key));
    if (!missingKeys.length) {
      return;
    }
    resolving.value = true;
    try {
      const rows = await options.adapter.value.fetchByKeys(missingKeys);
      mergeRows(rows);
    } finally {
      resolving.value = false;
    }
  };

  /** 更新一行选中状态，并按当前模式发出统一变更。 */
  const setRowSelected = (row: TRow, selected: boolean): void => {
    const rowKey = String(options.adapter.value.getKey(row));
    const nextRows = new Map(selectedRowsByKey.value);
    nextRows.set(rowKey, row);
    selectedRowsByKey.value = nextRows;

    const nextKeys = options.multiple.value
      ? selected
        ? Array.from(new Set([...selectedKeys.value, rowKey]))
        : selectedKeys.value.filter(key => key !== rowKey)
      : selected
        ? [rowKey]
        : [];
    selectedKeys.value = nextKeys;
    const value = buildModelValue(nextKeys, nextRows, options.multiple.value, options.adapter.value);
    onChange({ value, rows: nextKeys.map(key => nextRows.get(key)).filter((item): item is TRow => Boolean(item)) });
  };

  /** 覆盖当前选中行，常用于弹窗确认或远程下拉直接变更。 */
  const setSelectedRows = (rows: TRow[]): void => {
    const uniqueRows = dedupeRowsByKey(rows, options.adapter.value);
    const nextRows = new Map(selectedRowsByKey.value);
    uniqueRows.forEach(row => nextRows.set(String(options.adapter.value.getKey(row)), row));
    selectedRowsByKey.value = nextRows;
    const nextKeys = uniqueRows.map(row => String(options.adapter.value.getKey(row)));
    selectedKeys.value = nextKeys;
    const value = buildModelValue(nextKeys, nextRows, options.multiple.value, options.adapter.value);
    onChange({ value, rows: uniqueRows });
  };

  /** 移除单个已选实体，保持标签关闭和表格选择状态一致。 */
  const removeSelectedKey = (key: HynEntityKey): void => {
    const nextKeys = selectedKeys.value.filter(item => item !== String(key));
    selectedKeys.value = nextKeys;
    const value = buildModelValue(nextKeys, selectedRowsByKey.value, options.multiple.value, options.adapter.value);
    onChange({
      value,
      rows: nextKeys.map(item => selectedRowsByKey.value.get(item)).filter((row): row is TRow => Boolean(row))
    });
  };

  /** 清空当前选择。 */
  const clearSelectedRows = (): void => {
    selectedKeys.value = [];
    onChange({ value: options.multiple.value ? [] : undefined, rows: [] });
  };

  /** 判断指定行是否已经被选中。 */
  const isSelected = (row: TRow): boolean => {
    return selectedKeys.value.includes(String(options.adapter.value.getKey(row)));
  };

  watch(
    () => [options.modelValue.value, options.adapter.value],
    () => {
      selectedKeys.value = normalizedSelectedKeys.value;
      void resolveSelectedRows();
    },
    { immediate: true }
  );

  return {
    resolving,
    selectedRows,
    normalizedSelectedKeys,
    mergeRows,
    resolveSelectedRows,
    setRowSelected,
    setSelectedRows,
    removeSelectedKey,
    clearSelectedRows,
    isSelected
  };
}
