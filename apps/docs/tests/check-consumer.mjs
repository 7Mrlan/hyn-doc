import { resolve } from 'node:path';
import { build } from 'vite';
import vue from '@vitejs/plugin-vue';

/** 此构建故意只启用 Vue 编译器，保证包不再依赖文档站的自动导入插件。 */
await build({
  configFile: false,
  root: resolve(import.meta.dirname, '..'),
  plugins: [vue()],
  build: {
    write: false,
    lib: { entry: resolve(import.meta.dirname, 'consumer.vue'), formats: ['es'] },
    rolldownOptions: { external: ['vue', 'element-plus', '@element-plus/icons-vue'] }
  }
});
