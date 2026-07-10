import { loadHynDeptTree } from '@7mrlan/hyn-ui/runtime';
import type { HynDeptTreeNode } from '@7mrlan/hyn-ui/runtime';

export interface HynDeptTreeRequestOptions {
  clone: boolean;
}

export async function requestHynDeptTreeOptions(options: HynDeptTreeRequestOptions): Promise<HynDeptTreeNode[]> {
  const deptTree = await loadHynDeptTree();
  return options.clone ? cloneHynDeptTree(deptTree) : deptTree;
}

export function cloneHynDeptTree(deptList: HynDeptTreeNode[]): HynDeptTreeNode[] {
  return deptList.map(dept => ({
    ...dept,
    children: dept.children?.length ? cloneHynDeptTree(dept.children) : []
  }));
}