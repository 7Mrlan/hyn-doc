import { computed, ref, shallowRef, type ComputedRef, type Ref, type ShallowRef } from 'vue';
import type { HynVirtualTreeTableKey, HynVirtualTreeTableRow } from '../HynVirtualTreeTable/types';
import { t } from '@7mrlan/hyn-ui/runtime';

/**
 * 虚拟树表索引结构。
 *
 * @remarks
 * 组件只根据索引计算可见行，不在 DOM 中渲染完整树，避免几千节点时卡顿。
 */
export interface VirtualTreeIndex<TRow> {
  /** 根层级行数据。 */
  rootRows: TRow[];
  /** 以字符串化节点 key 索引的行数据。 */
  rowByKey: Map<string, TRow>;
  /** 以字符串化父 key 索引的子行列表。 */
  childrenByParentKey: Map<string, TRow[]>;
}

/**
 * 虚拟树表状态管理配置项。
 */
export interface UseHynVirtualTreeTableOptions<TRow> {
  /** 从业务行读取节点主键；空值会被归一化为空字符串并视为无效节点。 */
  getRowKey: (row: TRow) => HynVirtualTreeTableKey | undefined | null;
  /** 从业务行读取父节点主键；空字符串和 `0` 默认视为根节点。 */
  getParentKey: (row: TRow) => HynVirtualTreeTableKey | undefined | null;
  /** 自定义根节点判断，适合后端父级字段不是 `0` / 空值的场景。 */
  isRoot?: (row: TRow, parentKey: string, rowByKey: Map<string, TRow>) => boolean;
  /** 展开一级时每批发布的节点数，用于避免一次性更新过多可见行。 */
  batchSize: number;
  /** 懒加载配置；不传时按前端已有平铺数据构建完整树。 */
  lazy?: HynVirtualTreeTableLazyOptions<TRow>;
}

/**
 * 虚拟树表懒加载配置。
 */
export interface HynVirtualTreeTableLazyOptions<TRow> {
  /** 判断后端是否声明该节点存在子节点。 */
  hasChildren: (row: TRow) => boolean;
  /** 加载指定节点的直接子节点，必须返回数组且主键不能重复。 */
  loadChildren: (row: TRow) => Promise<TRow[]>;
}

/**
 * 虚拟树表状态管理返回值。
 */
export interface UseHynVirtualTreeTableReturn<TRow> {
  /** 当前展开节点 key 集合。 */
  expandedKeys: ShallowRef<Set<string>>;
  /** 当前正在懒加载的节点 key 集合。 */
  loadingKeys: ShallowRef<Set<string>>;
  /** 懒加载模式下已完成加载的节点 key 集合。 */
  loadedKeys: ShallowRef<Set<string>>;
  /** 节点懒加载错误信息，key 为字符串化节点主键。 */
  loadErrorByKey: ShallowRef<Map<string, string>>;
  /** 是否正在执行“展开一级”的分批任务。 */
  expanding: Ref<boolean>;
  /** 展开一级进度，范围 0 到 1。 */
  expandProgress: Ref<number>;
  /** 展开一级进度文案前缀。 */
  expandProgressLabel: Ref<string>;
  /** 当前数据源构建出的树索引。 */
  treeIndex: ComputedRef<VirtualTreeIndex<TRow>>;
  /** 当前需要渲染的可见行，供虚拟列表消费。 */
  visibleRows: ComputedRef<HynVirtualTreeTableRow<TRow>[]>;
  /** 根层级可展开节点是否都已展开。 */
  rootLevelExpanded: ComputedRef<boolean>;
  /** 展开任务中的按钮或 loading 文案。 */
  expandBusyText: ComputedRef<string>;
  /** 替换树数据，并清理与旧数据不一致的展开和加载状态。 */
  setRows: (rows: TRow[]) => void;
  /** 切换单个节点展开状态，懒加载模式会先请求子节点。 */
  toggleRow: (treeRow: HynVirtualTreeTableRow<TRow>) => Promise<void>;
  /** 分批展开根层级可展开节点。 */
  expandRootLevel: () => Promise<void>;
  /** 收起全部节点并取消待发布的展开任务。 */
  collapseAll: () => void;
  /** 根层级展开/收起按钮的统一动作。 */
  toggleRootLevel: () => Promise<void>;
  /** 取消当前展开一级任务。 */
  cancelPendingExpand: () => void;
}

/**
 * 展开一级时使用的内部节点描述。
 */
interface ExpandableTreeRow<TRow> {
  /** 字符串化后的节点 key。 */
  key: string;
  /** 业务原始行数据。 */
  row: TRow;
}

/** 默认根节点父级取值，覆盖 RuoYi 树形接口常见的空值和 `0` 两种根标记。 */
const defaultRootValues = new Set(['', '0']);

/** 将业务主键归一为虚拟树内部 key；空值统一转为空字符串，后续校验会把它视为无效节点。 */
const toVirtualTreeKey = (value: HynVirtualTreeTableKey | undefined | null): string => {
  return value === undefined || value === null ? '' : String(value);
};

/** 等待一次浏览器绘制后再继续批量展开，让几千节点的展开过程有机会把进度反馈画出来。 */
const waitForNextPaint = (): Promise<void> => {
  return new Promise(resolve => {
    if (typeof requestAnimationFrame !== 'function') {
      setTimeout(resolve, 0);
      return;
    }
    // RAF 后再排一个 macrotask，让 Vue 更新和浏览器绘制都有机会完成，展开进度不会被长循环吞掉。
    requestAnimationFrame(() => {
      setTimeout(resolve, 0);
    });
  });
};

/** 根据平铺数据构建虚拟树索引；后续展开/过滤都只查 Map，不重复扫描完整行集。 */
const buildVirtualTreeIndex = <TRow>(
  rows: TRow[],
  options: UseHynVirtualTreeTableOptions<TRow>
): VirtualTreeIndex<TRow> => {
  const rowByKey = new Map<string, TRow>();
  const childrenByParentKey = new Map<string, TRow[]>();
  const rootRows: TRow[] = [];

  rows.forEach(row => {
    rowByKey.set(toVirtualTreeKey(options.getRowKey(row)), row);
  });

  rows.forEach(row => {
    const parentKey = toVirtualTreeKey(options.getParentKey(row));
    const isRoot = options.isRoot?.(row, parentKey, rowByKey) ?? (defaultRootValues.has(parentKey) || !rowByKey.has(parentKey));
    if (isRoot) {
      rootRows.push(row);
      return;
    }
    const children = childrenByParentKey.get(parentKey) ?? [];
    children.push(row);
    childrenByParentKey.set(parentKey, children);
  });

  return {
    rootRows,
    rowByKey,
    childrenByParentKey
  };
};

const flattenVisibleRows = <TRow>(
  treeIndex: VirtualTreeIndex<TRow>,
  expandedKeys: ReadonlySet<string>,
  loadingKeys: ReadonlySet<string>,
  loadedKeys: ReadonlySet<string>,
  loadErrorByKey: ReadonlyMap<string, string>,
  options: UseHynVirtualTreeTableOptions<TRow>
): HynVirtualTreeTableRow<TRow>[] => {
  const visibleRows: HynVirtualTreeTableRow<TRow>[] = [];
  const appendRows = (rows: TRow[], depth: number): void => {
    rows.forEach(row => {
      const key = toVirtualTreeKey(options.getRowKey(row));
      const children = treeIndex.childrenByParentKey.get(key) ?? [];
      const expanded = expandedKeys.has(key);
      visibleRows.push({
        key,
        row,
        depth,
        hasChildren: getRowHasChildren(row, key, treeIndex, options, loadedKeys),
        expanded,
        loading: loadingKeys.has(key),
        loadError: loadErrorByKey.get(key)
      });
      if (expanded && children.length > 0) {
        appendRows(children, depth + 1);
      }
    });
  };
  appendRows(treeIndex.rootRows, 0);
  return visibleRows;
};

/** 判断节点是否应该表现为可展开，懒加载成功但无子节点时会转为叶子节点。 */
const getRowHasChildren = <TRow>(
  row: TRow,
  key: string,
  treeIndex: VirtualTreeIndex<TRow>,
  options: UseHynVirtualTreeTableOptions<TRow>,
  loadedKeys: ReadonlySet<string>
): boolean => {
  if ((treeIndex.childrenByParentKey.get(key)?.length ?? 0) > 0) {
    return true;
  }
  if (!options.lazy || loadedKeys.has(key)) {
    return false;
  }
  return options.lazy.hasChildren(row);
};

/** 收集当前根层级中可展开的节点，用于“展开一级”按钮的分帧处理。 */
const getExpandableRootRows = <TRow>(
  treeIndex: VirtualTreeIndex<TRow>,
  options: UseHynVirtualTreeTableOptions<TRow>,
  loadedKeys: ReadonlySet<string>
): ExpandableTreeRow<TRow>[] => {
  return treeIndex.rootRows
    .map(row => ({
      key: toVirtualTreeKey(options.getRowKey(row)),
      row
    }))
    .filter(item => getRowHasChildren(item.row, item.key, treeIndex, options, loadedKeys));
};

/** 数据刷新后过滤已经不存在或已经变成叶子的展开 key。 */
const filterExpandedKeys = <TRow>(
  expandedKeys: ReadonlySet<string>,
  treeIndex: VirtualTreeIndex<TRow>,
  options: UseHynVirtualTreeTableOptions<TRow>,
  loadedKeys: ReadonlySet<string>
): Set<string> => {
  const nextKeys = new Set<string>();
  expandedKeys.forEach(key => {
    const row = treeIndex.rowByKey.get(key);
    if (row && getRowHasChildren(row, key, treeIndex, options, loadedKeys)) {
      nextKeys.add(key);
    }
  });
  return nextKeys;
};

/** 以不可变方式给 shallowRef Set 添加 key，确保 Vue 能感知状态变化。 */
const addSetKey = (target: ShallowRef<Set<string>>, key: string): void => {
  const nextKeys = new Set<string>(target.value);
  nextKeys.add(key);
  target.value = nextKeys;
};

/** 以不可变方式从 shallowRef Set 移除 key，避免原地修改导致视图不更新。 */
const deleteSetKey = (target: ShallowRef<Set<string>>, key: string): void => {
  const nextKeys = new Set<string>(target.value);
  nextKeys.delete(key);
  target.value = nextKeys;
};

/** 记录节点懒加载错误，表格行会展示轻量错误状态。 */
const setLoadError = (target: ShallowRef<Map<string, string>>, key: string, message: string): void => {
  const nextErrors = new Map<string, string>(target.value);
  nextErrors.set(key, message);
  target.value = nextErrors;
};

/** 重新发起懒加载前清理旧错误，避免成功后仍显示失败状态。 */
const clearLoadError = (target: ShallowRef<Map<string, string>>, key: string): void => {
  const nextErrors = new Map<string, string>(target.value);
  nextErrors.delete(key);
  target.value = nextErrors;
};

/** 生成包含节点 key 的错误文案，便于从客户现场日志定位问题节点。 */
const createLazyLoadErrorMessage = (key: string, error: unknown): string => {
  if (error instanceof Error && error.message) {
    return `加载子节点失败，节点 key=${key}，原因：${error.message}`;
  }
  return `加载子节点失败，节点 key=${key}，原因：${String(error)}`;
};

/** 校验后端懒加载返回的子节点，避免重复 key 或空 key 污染树索引。 */
const validateLazyChildren = <TRow>(
  children: TRow[],
  parentKey: string,
  sourceRows: TRow[],
  options: UseHynVirtualTreeTableOptions<TRow>
): void => {
  const existingKeys = new Set<string>();
  sourceRows.forEach(row => {
    existingKeys.add(toVirtualTreeKey(options.getRowKey(row)));
  });

  const loadedKeys = new Set<string>();
  children.forEach(row => {
    const key = toVirtualTreeKey(options.getRowKey(row));
    if (!key) {
      throw new Error(`HynVirtualTreeTable 懒加载返回了空节点 key，父节点 key=${parentKey}`);
    }
    if (existingKeys.has(key) || loadedKeys.has(key)) {
      throw new Error(`HynVirtualTreeTable 懒加载返回了重复节点 key=${key}，父节点 key=${parentKey}`);
    }
    loadedKeys.add(key);
  });
};

/**
 * 高数据量树表专用状态管理：只计算可见行，配合 HynVirtualTreeTable 做视口虚拟渲染。
 */
export function useHynVirtualTreeTable<TRow>(
  sourceRows: Ref<TRow[]>,
  options: UseHynVirtualTreeTableOptions<TRow>
): UseHynVirtualTreeTableReturn<TRow> {
  const expandedKeys = shallowRef<Set<string>>(new Set<string>());
  const loadingKeys = shallowRef<Set<string>>(new Set<string>());
  const loadedKeys = shallowRef<Set<string>>(new Set<string>());
  const loadErrorByKey = shallowRef<Map<string, string>>(new Map<string, string>());
  const expanding = ref(false);
  const expandProgress = ref(0);
  const expandProgressLabel = ref('');
  const lazyTaskByKey = new Map<string, Promise<void>>();
  let expandTaskId = 0;
  let rowsVersion = 0;

  const treeIndex = computed<VirtualTreeIndex<TRow>>(() => buildVirtualTreeIndex(sourceRows.value, options));
  const visibleRows = computed<HynVirtualTreeTableRow<TRow>[]>(() =>
    flattenVisibleRows(treeIndex.value, expandedKeys.value, loadingKeys.value, loadedKeys.value, loadErrorByKey.value, options)
  );
  const rootLevelExpanded = computed(() => {
    const rootRows = getExpandableRootRows(treeIndex.value, options, loadedKeys.value);
    return rootRows.length > 0 && rootRows.every(item => expandedKeys.value.has(item.key));
  });
  const expandBusyText = computed(() => {
    if (!expanding.value) {
      return '';
    }
    return `${expandProgressLabel.value} ${Math.round(expandProgress.value * 100)}%`;
  });

  const setRows = (rows: TRow[]): void => {
    const nextIndex = buildVirtualTreeIndex(rows, options);
    rowsVersion++;
    sourceRows.value = rows;
    loadingKeys.value = new Set<string>();
    loadErrorByKey.value = new Map<string, string>();
    lazyTaskByKey.clear();
    if (options.lazy) {
      loadedKeys.value = new Set<string>();
      expandedKeys.value = new Set<string>();
      return;
    }
    expandedKeys.value = filterExpandedKeys(expandedKeys.value, nextIndex, options, loadedKeys.value);
  };

  const cancelPendingExpand = (): void => {
    expandTaskId++;
    expanding.value = false;
    expandProgress.value = 0;
    expandProgressLabel.value = '';
  };

  /** 执行单个节点的懒加载，并把有效子节点追加到当前数据源。 */
  const runLazyLoadChildren = async (row: TRow, key: string): Promise<void> => {
    if (!options.lazy || loadedKeys.value.has(key) || (treeIndex.value.childrenByParentKey.get(key)?.length ?? 0) > 0) {
      return;
    }
    if (!options.lazy.hasChildren(row)) {
      return;
    }
    const requestRowsVersion = rowsVersion;
    addSetKey(loadingKeys, key);
    clearLoadError(loadErrorByKey, key);
    try {
      const children = await options.lazy.loadChildren(row);
      if (!Array.isArray(children)) {
        throw new TypeError(`HynVirtualTreeTable 懒加载必须返回数组，节点 key=${key}`);
      }
      if (requestRowsVersion !== rowsVersion) {
        return;
      }
      validateLazyChildren(children, key, sourceRows.value, options);
      sourceRows.value = [...sourceRows.value, ...children];
      addSetKey(loadedKeys, key);
    } catch (error) {
      setLoadError(loadErrorByKey, key, createLazyLoadErrorMessage(key, error));
      throw error;
    } finally {
      deleteSetKey(loadingKeys, key);
    }
  };

  /** 复用同一节点正在进行的加载任务，避免快速连点触发重复接口。 */
  const loadChildrenForRow = (row: TRow, key: string): Promise<void> => {
    const runningTask = lazyTaskByKey.get(key);
    if (runningTask) {
      return runningTask;
    }
    const task = runLazyLoadChildren(row, key).finally(() => {
      lazyTaskByKey.delete(key);
    });
    lazyTaskByKey.set(key, task);
    return task;
  };

  /** 切换节点展开状态；懒加载模式会先加载子节点再展开。 */
  const toggleRow = async (treeRow: HynVirtualTreeTableRow<TRow>): Promise<void> => {
    const key = toVirtualTreeKey(options.getRowKey(treeRow.row));
    if (treeRow.expanded) {
      const nextKeys = new Set<string>(expandedKeys.value);
      nextKeys.delete(key);
      expandedKeys.value = nextKeys;
      return;
    }
    await loadChildrenForRow(treeRow.row, key);
    if (!getRowHasChildren(treeRow.row, key, treeIndex.value, options, loadedKeys.value)) {
      return;
    }
    const nextKeys = new Set<string>(expandedKeys.value);
    nextKeys.add(key);
    expandedKeys.value = nextKeys;
  };

  const publishExpandBatch = async (
    taskId: number,
    nextKeys: Set<string>,
    targetKeys: string[],
    endIndex: number
  ): Promise<boolean> => {
    if (taskId !== expandTaskId) {
      return false;
    }
    expandedKeys.value = new Set(nextKeys);
    expandProgress.value = targetKeys.length === 0 ? 1 : endIndex / targetKeys.length;
    await waitForNextPaint();
    return taskId === expandTaskId;
  };

  const expandRootLevel = async (): Promise<void> => {
    const rootRows = getExpandableRootRows(treeIndex.value, options, loadedKeys.value);
    const nextKeys = new Set<string>(expandedKeys.value);
    const taskId = ++expandTaskId;
    expanding.value = true;
    expandProgress.value = 0;
    expandProgressLabel.value = t('app.table.expandingRootLevel');
    try {
      if (rootRows.length === 0) {
        expandProgress.value = 1;
        return;
      }
      for (let index = 0; index < rootRows.length; index += options.batchSize) {
        const currentRows = rootRows.slice(index, index + options.batchSize);
        await Promise.all(
          currentRows.map(async item => {
            await loadChildrenForRow(item.row, item.key);
          })
        );
        currentRows.forEach(item => {
          if (getRowHasChildren(item.row, item.key, treeIndex.value, options, loadedKeys.value)) {
            nextKeys.add(item.key);
          }
        });
        const endIndex = Math.min(index + options.batchSize, rootRows.length);
        const active = await publishExpandBatch(taskId, nextKeys, rootRows.map(item => item.key), endIndex);
        if (!active) {
          return;
        }
      }
    } finally {
      if (taskId === expandTaskId) {
        expanding.value = false;
        expandProgress.value = 0;
        expandProgressLabel.value = '';
      }
    }
  };

  const collapseAll = (): void => {
    cancelPendingExpand();
    expandedKeys.value = new Set<string>();
  };

  const toggleRootLevel = async (): Promise<void> => {
    if (expanding.value) {
      return;
    }
    if (rootLevelExpanded.value) {
      collapseAll();
      return;
    }
    await expandRootLevel();
  };

  return {
    expandedKeys,
    loadingKeys,
    loadedKeys,
    loadErrorByKey,
    expanding,
    expandProgress,
    expandProgressLabel,
    treeIndex,
    visibleRows,
    rootLevelExpanded,
    expandBusyText,
    setRows,
    toggleRow,
    expandRootLevel,
    collapseAll,
    toggleRootLevel,
    cancelPendingExpand
  };
}
