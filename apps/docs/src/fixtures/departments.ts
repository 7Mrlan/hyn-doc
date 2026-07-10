import type { HynDeptTreeNode } from '@7mrlan/hyn-ui/runtime';

/** 文档示例专用部门树，禁止替换为任何业务接口返回值。 */
export const docsDepartmentTree: HynDeptTreeNode[] = [
  {
    id: 100,
    label: '研发中心',
    parentId: 0,
    children: [
      { id: 101, label: '平台组', parentId: 100, children: [] },
      { id: 102, label: '前端组', parentId: 100, children: [] }
    ]
  },
  {
    id: 200,
    label: '产品中心',
    parentId: 0,
    disabled: true,
    children: [{ id: 201, label: '设计组', parentId: 200, children: [] }]
  }
];

