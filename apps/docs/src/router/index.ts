import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import DocsHome from '@/index.vue';
import DocsLayout from '@/layout.vue';

/** 文档页 slug 与按需加载器的唯一映射，新增页面时必须显式登记。 */
const docPageLoaders = {
  'cron-expression': () => import('@/docs/pages/cron-expression.vue'),
  'dept-select': () => import('@/docs/pages/dept-select.vue'),
  dialog: () => import('@/docs/pages/dialog.vue'),
  'entity-picker': () => import('@/docs/pages/entity-picker.vue'),
  form: () => import('@/docs/pages/form.vue'),
  'global-config': () => import('@/docs/pages/global-config.vue'),
  'i18n-boundary': () => import('@/docs/pages/i18n-boundary.vue'),
  table: () => import('@/docs/pages/table.vue'),
  'table-dialog': () => import('@/docs/pages/table-dialog.vue'),
  'tree-select': () => import('@/docs/pages/tree-select.vue'),
  'virtual-table': () => import('@/docs/pages/virtual-table.vue'),
  'virtual-tree-table': () => import('@/docs/pages/virtual-tree-table.vue')
} as const;

type HynDocSlug = keyof typeof docPageLoaders;

/** 预加载单个文档页及其 Vite 依赖 chunk，不实例化页面组件。 */
export const preloadHynDocPage = (slug: string): void => {
  const loader = docPageLoaders[slug as HynDocSlug];
  if (loader) {
    void loader();
  }
};

/** 在首屏稳定后预加载全部文档页，消除后续菜单切换的网络等待。 */
export const preloadAllHynDocPages = (): void => {
  Object.values(docPageLoaders).forEach(loader => {
    void loader();
  });
};

/** 自动生成静态 Pages 可用的文档子路由。 */
const docRoutes: RouteRecordRaw[] = Object.entries(docPageLoaders).map(([slug, component]) => ({
  path: slug,
  name: `HynDocs${slug.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('')}`,
  component,
  meta: { title: slug, noCache: true, breadcrumb: false }
}));

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/component/hyn' },
    {
      path: '/component/hyn',
      component: DocsLayout,
      children: [
        { path: '', name: 'HynDocsHome', component: DocsHome, meta: { title: 'hynComponentDocs', noCache: true, breadcrumb: false } },
        ...docRoutes
      ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/component/hyn' }
  ]
});

export default router;