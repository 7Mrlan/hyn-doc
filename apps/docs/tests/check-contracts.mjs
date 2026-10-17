import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

/** 同时检查实际源码和资源定义，避免浏览器生产模式关闭翻译警告后漏掉缺失语言键。 */
const root = resolve(import.meta.dirname, '../../..');
const packageRoot = resolve(root, 'packages/hyn-ui/src');
const docsRoot = resolve(root, 'apps/docs/src');
const sourceFiles = [packageRoot, docsRoot].flatMap(folder => readdirSync(folder, { recursive: true })
  .filter(file => /\.(ts|vue)$/.test(file) && !file.includes('locales') && !file.endsWith('.d.ts'))
  .map(file => resolve(folder, file)));

/** 只读取语言资源的对象字面量，禁止为静态检查执行文件中的任意表达式。
 * @param {string} path
 * @returns {Record<string, unknown>}
 */
function readLocale(path) {
  const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
  const statement = source.statements.find(ts.isExportAssignment);
  assert.ok(statement && ts.isObjectLiteralExpression(statement.expression), `Expected a literal locale export: ${path}`);
  return readLocaleObject(statement.expression);
}

/** 从 AST 提取资源文本，保留嵌套命名空间和代码块字符串，不进行代码求值。
 * @param {import('typescript').ObjectLiteralExpression} node
 * @returns {Record<string, unknown>}
 */
function readLocaleObject(node) {
  return Object.fromEntries(node.properties.map(property => {
    assert.ok(ts.isPropertyAssignment(property), 'Locale resources may only contain explicit literal properties');
    const key = property.name.text;
    const value = property.initializer;
    if (ts.isObjectLiteralExpression(value)) { return [key, readLocaleObject(value)]; }
    assert.ok(ts.isStringLiteralLike(value), `Expected a string locale leaf: ${key}`);
    return [key, value.text];
  }));
}

for (const [language, suffix] of [['zh_CN', 'zh-CN'], ['en_US', 'en-US']]) {
  const components = readLocale(resolve(packageRoot, `locales/${language}.ts`));
  const application = readLocale(resolve(docsRoot, `locales.app.${suffix}.ts`));
  const messages = { ...components, app: { ...application, ...components.app }, hynDocs: readLocale(resolve(docsRoot, `locales.${suffix}.ts`)) };
  for (const path of sourceFiles) {
    const source = readFileSync(path, 'utf8');
    for (const match of source.matchAll(/\bt\(['"]([a-zA-Z][\w.]+)['"]/g)) {
      const value = match[1].split('.').reduce((current, key) => current?.[key], messages);
      assert.equal(typeof value, 'string', `${language}: missing ${match[1]} in ${path}`);
    }
  }
}

const packageSources = readdirSync(packageRoot, { recursive: true })
  .filter(file => /\.(ts|vue|scss)$/.test(file) && !file.includes('locales'))
  .map(file => readFileSync(resolve(packageRoot, file), 'utf8'));
/** 宿主需要导出的变量同时包含 app 前缀和历史表格命名，不能因命名风格不同漏检。 */
const definedTokens = new Set(packageSources.flatMap(source => [...source.matchAll(/(--[\w-]+)['"]?\s*:/g)].map(match => match[1])));
for (const source of packageSources) {
  assert.equal(/from\s+['"]@\//.test(source), false, 'Package must not import the original business application alias');
  for (const match of source.matchAll(/var\(\s*(--[\w-]+)/g)) {
    // Element Plus 提供 el 变量；组件局部尺寸由 props/computed 提供，不属于宿主主题出口。
    if (/^--(?:el-|hyn-|cron-)/.test(match[1])) { continue; }
    assert.ok(definedTokens.has(match[1]), `Package style token is missing: ${match[1]}`);
  }
}
console.log('PASS public package aliases, complete CSS tokens, Chinese and English static translation keys');
