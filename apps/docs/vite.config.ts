import { resolve } from 'node:path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import setupExtend from 'unplugin-vue-setup-extend-plus/vite';

const docsRoot = resolve(import.meta.dirname, 'src');
const hynUiRoot = resolve(import.meta.dirname, '../../packages/hyn-ui/src');

export default defineConfig({
  base: './',
  // 预览或覆盖发布期间，已打开页面仍引用上一版本的 hash 资源；不能在构建开始时删除它们。
  build: { emptyOutDir: false },
  resolve: {
    alias: [
      { find: '@7mrlan/hyn-ui/styles', replacement: `${hynUiRoot}/styles/index.scss` },
      // 源码别名与包 exports 指向同一模块，避免类型检查和真实宿主导入不同的 Cron API。
      { find: '@7mrlan/hyn-ui/cron', replacement: `${hynUiRoot}/HynCronExpression/quartzCron.ts` },
      { find: /^@7mrlan\/hyn-ui(.*)$/, replacement: `${hynUiRoot}$1` },
      { find: '@', replacement: docsRoot }
    ]
  },
  plugins: [
    vue(),
    setupExtend({}),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: resolve(docsRoot, 'auto-imports.d.ts')
    }),
    Components({
      globs: [resolve(hynUiRoot, 'Hyn*/index.vue')],
      resolvers: [ElementPlusResolver({ importStyle: 'css' })],
      dts: resolve(docsRoot, 'components.d.ts')
    })
  ]
});

