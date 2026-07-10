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
  base: '/hyn-doc/',
  resolve: {
    alias: [
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

