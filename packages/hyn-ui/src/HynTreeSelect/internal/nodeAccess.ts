import type { HynTreeSelectNode, HynTreeSelectNodeProps, HynTreeSelectValue } from '../types';

/** 读取树节点动态字段，节点原始类型由业务 VO 决定，HYN 只按字段映射访问。 */
export function readHynTreeNodeField(node: HynTreeSelectNode, key: string): unknown {
  return (node as Record<string, unknown>)[key];
}

/** 按字段映射读取树节点主键，非 string/number 会显式抛错以暴露错误配置。 */
export function readHynTreeNodeValue(
  node: HynTreeSelectNode,
  nodeProps: HynTreeSelectNodeProps,
  valueKey: string
): HynTreeSelectValue {
  const value = readHynTreeNodeField(node, valueKey || nodeProps.value || 'value');
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  throw new TypeError(`HynTreeSelect node value must be string or number, actual=${String(value)}`);
}

/** 按字段映射读取树节点展示文案，空或异常文案返回空字符串交给调用方处理。 */
export function readHynTreeNodeLabel(node: HynTreeSelectNode, nodeProps: HynTreeSelectNodeProps): string {
  const label = readHynTreeNodeField(node, nodeProps.label ?? 'label');
  return typeof label === 'string' || typeof label === 'number' ? String(label) : '';
}

/** 按字段映射读取禁用状态，只有严格等于 true 时才视为禁用节点。 */
export function readHynTreeNodeDisabled(node: HynTreeSelectNode, nodeProps: HynTreeSelectNodeProps): boolean {
  return readHynTreeNodeField(node, nodeProps.disabled ?? 'disabled') === true;
}

/** 获取子节点字段名，保证所有树遍历使用同一个 children 协议。 */
export function resolveHynTreeChildrenKey(nodeProps: HynTreeSelectNodeProps): string {
  return nodeProps.children ?? 'children';
}

/** 按字段映射读取子节点，非数组值按空集合处理。 */
export function readHynTreeNodeChildren(
  node: HynTreeSelectNode,
  nodeProps: HynTreeSelectNodeProps
): HynTreeSelectNode[] {
  const children = readHynTreeNodeField(node, resolveHynTreeChildrenKey(nodeProps));
  return Array.isArray(children) ? (children as HynTreeSelectNode[]) : [];
}

/** 生成本地搜索文本，默认同时支持按 label 和 value 命中。 */
export function createHynTreeSearchText(value: HynTreeSelectValue, label: string): string {
  return `${label}\u0001${String(value)}`.toLowerCase();
}

/** 归一化本地搜索关键字，平铺和树形模式共用同一套命中规则。 */
export function normalizeHynTreeSearchKeyword(keyword: string): string {
  return keyword.trim().toLowerCase();
}

/** 构建节点值到展示文案的索引，虚拟树只渲染可见行时仍可稳定回显已选标签。 */
export function createHynTreeLabelMap(
  nodes: HynTreeSelectNode[],
  nodeProps: HynTreeSelectNodeProps,
  valueKey: string
): Map<string, string> {
  const labelMap = new Map<string, string>();
  const stack = nodes.toReversed();
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) {
      continue;
    }
    labelMap.set(String(readHynTreeNodeValue(node, nodeProps, valueKey)), readHynTreeNodeLabel(node, nodeProps));
    readHynTreeNodeChildren(node, nodeProps)
      .toReversed()
      .forEach(child => {
        stack.push(child);
      });
  }
  return labelMap;
}
