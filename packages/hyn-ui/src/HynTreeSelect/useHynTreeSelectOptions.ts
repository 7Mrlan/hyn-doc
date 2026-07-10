import { computed, ref, shallowRef, watch, type ComputedRef, type Ref } from 'vue';
import type { HynTreeSelectFlatOption, HynTreeSelectNode, HynTreeSelectNodeProps } from './types';
import {
  createHynTreeSearchText,
  normalizeHynTreeSearchKeyword,
  readHynTreeNodeChildren,
  readHynTreeNodeDisabled,
  readHynTreeNodeLabel,
  readHynTreeNodeValue,
  resolveHynTreeChildrenKey
} from './internal/nodeAccess';

type HynTreeSelectFlatBuildTrigger = 'idle' | 'active';

interface HynTreeSelectOptionsSource {
  /** 原始树数据，调用方负责业务接口加载。 */
  data: ComputedRef<HynTreeSelectNode[]>;
  /** 树节点字段映射。 */
  nodeProps: ComputedRef<HynTreeSelectNodeProps>;
  /** 节点值字段名。 */
  valueKey: ComputedRef<string>;
  /** 是否过滤 disabled 节点。 */
  filterDisabled: ComputedRef<boolean>;
  /** 是否启用虚拟平铺模式。 */
  flatten: ComputedRef<boolean>;
}

interface HynTreeSelectOptionsState {
  /** 层级树模式使用的树数据。 */
  treeData: ComputedRef<HynTreeSelectNode[]>;
  /** Select V2 当前可见平铺选项。 */
  visibleFlatOptions: Ref<HynTreeSelectFlatOption[]>;
  /** 平铺索引或本地搜索是否正在分帧处理。 */
  loading: ComputedRef<boolean>;
  /** 更新平铺搜索关键字并触发本地过滤。 */
  setFlatKeyword: (keyword: string) => void;
  /** 确保平铺索引已开始构建，打开下拉时用于立即给出 loading 反馈。 */
  ensureFlatOptionsReady: (trigger: HynTreeSelectFlatBuildTrigger) => void;
}

const FLAT_BUILD_BATCH_SIZE = 400;
const FLAT_BUILD_FRAME_BUDGET = 8;

/**
 * 管理 HynTreeSelect 的层级树数据、虚拟平铺索引和本地搜索。
 *
 * @remarks
 * 该组合式函数不请求业务接口，只消费调用方传入的已加载树数据；大树拍平和搜索会分帧执行，避免表单弹窗首开或输入搜索时长时间阻塞主线程。
 */
export function useHynTreeSelectOptions(source: HynTreeSelectOptionsSource): HynTreeSelectOptionsState {
  const flatKeyword = ref('');
  const flatOptions = shallowRef<HynTreeSelectFlatOption[]>([]);
  const visibleFlatOptions = shallowRef<HynTreeSelectFlatOption[]>([]);
  const flatBuildLoading = ref(false);
  const flatFilterLoading = ref(false);
  let flatBuildVersion = 0;
  let completedFlatBuildVersion = 0;
  let scheduledFlatBuildVersion = 0;
  let flatBuildToken = 0;
  let flatFilterToken = 0;

  const treeData = computed<HynTreeSelectNode[]>(() =>
    source.filterDisabled.value ? filterDisabledTreeNodes(source.data.value, source.nodeProps.value) : source.data.value
  );
  const loading = computed(() => flatBuildLoading.value || flatFilterLoading.value);

  /** 标记平铺索引需要重建，避免非 flatten 模式提前消耗大树拍平成本。 */
  function markFlatOptionsDirty(): void {
    flatBuildVersion += 1;
    flatBuildToken += 1;
    flatFilterToken += 1;
    flatBuildLoading.value = false;
    flatFilterLoading.value = false;
    flatOptions.value = [];
    visibleFlatOptions.value = [];
    if (!source.flatten.value || source.data.value.length === 0) {
      return;
    }
    scheduleFlatOptionsBuild('idle');
  }

  /** 按需启动 Select V2 平铺索引构建，重复触发时复用同一轮任务。 */
  function scheduleFlatOptionsBuild(trigger: HynTreeSelectFlatBuildTrigger): void {
    if (!source.flatten.value || source.data.value.length === 0) {
      refreshVisibleFlatOptions();
      return;
    }
    if (completedFlatBuildVersion === flatBuildVersion) {
      refreshVisibleFlatOptions();
      return;
    }
    if (flatBuildLoading.value && scheduledFlatBuildVersion === flatBuildVersion) {
      return;
    }
    flatBuildToken += 1;
    scheduledFlatBuildVersion = flatBuildVersion;
    flatBuildLoading.value = true;
    const currentToken = flatBuildToken;
    const currentVersion = flatBuildVersion;
    void runFlatOptionsBuild(currentToken, currentVersion, trigger);
  }

  /** 分帧构建平铺 options，保护弹窗首开和输入搜索时的主线程响应。 */
  async function runFlatOptionsBuild(
    token: number,
    version: number,
    trigger: HynTreeSelectFlatBuildTrigger
  ): Promise<void> {
    try {
      if (trigger === 'idle') {
        await waitForNextFrame();
      }
      const options = await flattenTreeNodes(
        source.data.value,
        source.nodeProps.value,
        source.valueKey.value,
        source.filterDisabled.value,
        token
      );
      if (token !== flatBuildToken || version !== flatBuildVersion) {
        return;
      }
      flatOptions.value = options;
      completedFlatBuildVersion = version;
      refreshVisibleFlatOptions();
    } finally {
      if (token === flatBuildToken) {
        flatBuildLoading.value = false;
      }
    }
  }

  /** 将树节点转换为 Select V2 可消费的平铺 options。 */
  async function flattenTreeNodes(
    nodes: HynTreeSelectNode[],
    nodeProps: HynTreeSelectNodeProps,
    valueKey: string,
    filterDisabled: boolean,
    token: number
  ): Promise<HynTreeSelectFlatOption[]> {
    const result: HynTreeSelectFlatOption[] = [];
    const stack = nodes.toReversed();
    while (stack.length > 0) {
      const frameStart = getNow();
      let batchCount = 0;
      while (
        stack.length > 0 &&
        batchCount < FLAT_BUILD_BATCH_SIZE &&
        getNow() - frameStart < FLAT_BUILD_FRAME_BUDGET
      ) {
        if (token !== flatBuildToken) {
          return result;
        }
        const node = stack.pop();
        if (!node) {
          continue;
        }
        const disabled = readHynTreeNodeDisabled(node, nodeProps);
        if (!filterDisabled || !disabled) {
          const value = readHynTreeNodeValue(node, nodeProps, valueKey);
          const label = readHynTreeNodeLabel(node, nodeProps);
          result.push({
            value,
            label,
            disabled,
            searchText: createHynTreeSearchText(value, label)
          });
        }
        const children = readHynTreeNodeChildren(node, nodeProps);
        for (let index = children.length - 1; index >= 0; index -= 1) {
          stack.push(children[index]);
        }
        batchCount += 1;
      }
      if (stack.length > 0) {
        await waitForNextFrame();
      }
    }
    return result;
  }

  /** Select V2 平铺模式的本地搜索入口。 */
  function setFlatKeyword(keyword: string): void {
    flatKeyword.value = keyword;
    if (completedFlatBuildVersion !== flatBuildVersion) {
      scheduleFlatOptionsBuild('active');
      return;
    }
    refreshVisibleFlatOptions();
  }

  /** 刷新当前关键字对应的可见平铺 options。 */
  function refreshVisibleFlatOptions(): void {
    const normalizedKeyword = normalizeHynTreeSearchKeyword(flatKeyword.value);
    flatFilterToken += 1;
    if (!normalizedKeyword) {
      flatFilterLoading.value = false;
      visibleFlatOptions.value = flatOptions.value;
      return;
    }
    const currentToken = flatFilterToken;
    flatFilterLoading.value = true;
    void runFlatOptionsFilter(normalizedKeyword, flatOptions.value, currentToken);
  }

  /** 分帧执行平铺 options 本地搜索，避免大列表输入时长时间阻塞主线程。 */
  async function runFlatOptionsFilter(
    normalizedKeyword: string,
    options: HynTreeSelectFlatOption[],
    token: number
  ): Promise<void> {
    const result: HynTreeSelectFlatOption[] = [];
    try {
      let index = 0;
      while (index < options.length) {
        const frameStart = getNow();
        let batchCount = 0;
        while (
          index < options.length &&
          batchCount < FLAT_BUILD_BATCH_SIZE &&
          getNow() - frameStart < FLAT_BUILD_FRAME_BUDGET
        ) {
          if (token !== flatFilterToken) {
            return;
          }
          const option = options[index];
          if (option.searchText.includes(normalizedKeyword)) {
            result.push(option);
          }
          index += 1;
          batchCount += 1;
        }
        if (index < options.length) {
          await waitForNextFrame();
        }
      }
      if (token === flatFilterToken) {
        visibleFlatOptions.value = result;
      }
    } finally {
      if (token === flatFilterToken) {
        flatFilterLoading.value = false;
      }
    }
  }

  watch([source.data, source.nodeProps, source.valueKey, source.filterDisabled, source.flatten], markFlatOptionsDirty, {
    immediate: true
  });

  return {
    treeData,
    visibleFlatOptions,
    loading,
    setFlatKeyword,
    ensureFlatOptionsReady: scheduleFlatOptionsBuild
  };
}

/** 过滤禁用节点并返回新的树引用，避免污染调用方传入的数据。 */
function filterDisabledTreeNodes(nodes: HynTreeSelectNode[], nodeProps: HynTreeSelectNodeProps): HynTreeSelectNode[] {
  const result: HynTreeSelectNode[] = [];
  nodes.forEach(node => {
    if (readHynTreeNodeDisabled(node, nodeProps)) {
      return;
    }
    result.push({
      ...node,
      [resolveHynTreeChildrenKey(nodeProps)]: filterDisabledTreeNodes(
        readHynTreeNodeChildren(node, nodeProps),
        nodeProps
      )
    });
  });
  return result;
}

/** 读取当前高精度时间，浏览器能力不足时退回 Date。 */
function getNow(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now();
}

/** 等待下一帧，让大树拍平过程把渲染机会还给浏览器。 */
async function waitForNextFrame(): Promise<void> {
  await new Promise<void>(resolve => {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => resolve());
      return;
    }
    globalThis.setTimeout(() => resolve(), 0);
  });
}
