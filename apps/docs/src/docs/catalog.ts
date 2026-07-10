import type { RouteI18nKey } from '@/utils/i18n';

/** HYN 组件文档导航和本地路由共用的目录项。 */
export interface HynComponentDocEntry {
  /** 文档页面 slug，必须与 `docs/pages/*.vue` 文件名保持一致。 */
  slug: string;
  /** 文档类型；guide 会进入左侧导航，但不作为组件条目展示在首页组件卡片中。 */
  kind?: 'component' | 'guide';
  /** 文档导航和路由 meta 使用的组件标识 key。 */
  titleKey: RouteI18nKey;
  /** 文档卡片上的一句话说明 key。 */
  captionKey: string;
  /** 文档分组名称 key，用于导航列表归类。 */
  categoryKey: string;
  /** 展示顺序，数值越小越靠前。 */
  order: number;
  /** 文档成熟度状态，preview/planned 不应被当成稳定组件契约。 */
  status: 'stable' | 'preview' | 'planned';
}

/** HYN 组件文档目录，新增公共 HYN 组件时需要同步维护。 */
export const hynComponentDocEntries: HynComponentDocEntry[] = [
  {
    slug: 'global-config',
    kind: 'guide',
    titleKey: 'hynDocs.catalog.title.globalConfig',
    captionKey: 'hynDocs.catalog.caption.globalConfig',
    categoryKey: 'hynDocs.catalog.category.guide',
    order: 3,
    status: 'stable'
  },
  {
    slug: 'i18n-boundary',
    kind: 'guide',
    titleKey: 'hynDocs.catalog.title.i18nBoundary',
    captionKey: 'hynDocs.catalog.caption.i18nBoundary',
    categoryKey: 'hynDocs.catalog.category.guide',
    order: 5,
    status: 'stable'
  },
  {
    slug: 'table',
    kind: 'component',
    titleKey: 'hynDocs.catalog.title.table',
    captionKey: 'hynDocs.catalog.caption.table',
    categoryKey: 'hynDocs.catalog.category.dataDisplay',
    order: 10,
    status: 'stable'
  },
  {
    slug: 'form',
    kind: 'component',
    titleKey: 'hynDocs.catalog.title.form',
    captionKey: 'hynDocs.catalog.caption.form',
    categoryKey: 'hynDocs.catalog.category.dataEntry',
    order: 18,
    status: 'stable'
  },
  {
    slug: 'dept-select',
    kind: 'component',
    titleKey: 'hynDocs.catalog.title.deptSelect',
    captionKey: 'hynDocs.catalog.caption.deptSelect',
    categoryKey: 'hynDocs.catalog.category.dataEntry',
    order: 21,
    status: 'stable'
  },
  {
    slug: 'tree-select',
    kind: 'component',
    titleKey: 'hynDocs.catalog.title.treeSelect',
    captionKey: 'hynDocs.catalog.caption.treeSelect',
    categoryKey: 'hynDocs.catalog.category.dataEntry',
    order: 19,
    status: 'stable'
  },
  {
    slug: 'dialog',
    kind: 'component',
    titleKey: 'hynDocs.catalog.title.dialog',
    captionKey: 'hynDocs.catalog.caption.dialog',
    categoryKey: 'hynDocs.catalog.category.feedback',
    order: 20,
    status: 'stable'
  },
  {
    slug: 'cron-expression',
    kind: 'component',
    titleKey: 'hynDocs.catalog.title.cronExpression',
    captionKey: 'hynDocs.catalog.caption.cronExpression',
    categoryKey: 'hynDocs.catalog.category.dataEntry',
    order: 22,
    status: 'stable'
  },
  {
    slug: 'table-dialog',
    kind: 'component',
    titleKey: 'hynDocs.catalog.title.tableDialog',
    captionKey: 'hynDocs.catalog.caption.tableDialog',
    categoryKey: 'hynDocs.catalog.category.feedback',
    order: 25,
    status: 'stable'
  },
  {
    slug: 'virtual-table',
    kind: 'component',
    titleKey: 'hynDocs.catalog.title.virtualTable',
    captionKey: 'hynDocs.catalog.caption.virtualTable',
    categoryKey: 'hynDocs.catalog.category.dataDisplay',
    order: 30,
    status: 'stable'
  },
  {
    slug: 'virtual-tree-table',
    kind: 'component',
    titleKey: 'hynDocs.catalog.title.virtualTreeTable',
    captionKey: 'hynDocs.catalog.caption.virtualTreeTable',
    categoryKey: 'hynDocs.catalog.category.dataDisplay',
    order: 40,
    status: 'stable'
  },
  {
    slug: 'entity-picker',
    kind: 'component',
    titleKey: 'hynDocs.catalog.title.entityPicker',
    captionKey: 'hynDocs.catalog.caption.entityPicker',
    categoryKey: 'hynDocs.catalog.category.dataEntry',
    order: 50,
    status: 'preview'
  }
];

/**
 * 根据 slug 查找组件文档元信息，供本地自动路由和文档导航共用。
 */
export const getHynComponentDocEntry = (slug: string): HynComponentDocEntry | undefined => {
  return hynComponentDocEntries.find(entry => entry.slug === slug);
};

/**
 * 按展示顺序返回组件文档清单，避免各页面重复排序。
 */
export const getSortedHynComponentDocEntries = (): HynComponentDocEntry[] => {
  return hynComponentDocEntries.toSorted((left, right) => left.order - right.order);
};

/**
 * 仅返回真实组件文档条目，首页组件卡片不展示 guide 页面，避免把规则文档误认为组件。
 */
export const getSortedHynComponentEntries = (): HynComponentDocEntry[] => {
  return getSortedHynComponentDocEntries().filter(entry => entry.kind !== 'guide');
};
