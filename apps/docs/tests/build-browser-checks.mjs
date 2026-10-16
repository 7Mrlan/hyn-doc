import assert from 'node:assert/strict';
import { resolve, sep } from 'node:path';
import { build } from 'vite';
import vue from '@vitejs/plugin-vue';

/** 测试产物只写入本项目缓存目录，禁止清理业务源码或文档发布目录。 */
const root = resolve(import.meta.dirname, '..');
const outDir = resolve(root, 'node_modules/.cache/hyn-browser-checks');
assert.ok(outDir.startsWith(`${root}${sep}`));
await build({
  configFile: false,
  root,
  base: './',
  resolve: { alias: { '@': resolve(root, 'src') } },
  plugins: [vue()],
  build: { outDir, emptyOutDir: true, rolldownOptions: { input: resolve(import.meta.dirname, 'adversarial.html') } }
});
