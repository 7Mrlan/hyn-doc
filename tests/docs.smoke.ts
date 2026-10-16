import assert from 'node:assert/strict';
import { createServer, type ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { chromium, type Browser, type Page } from 'playwright';

/** 同一个生产产物同时挂在根目录、GitHub Pages 路径和公司内网子目录。 */
const mounts: string[] = ['/', '/hyn-doc/', '/intranet/component-docs/'];
const dist: string = resolve('apps/docs/dist');
const consumerDist: string = resolve('apps/docs/node_modules/.cache/hyn-browser-checks');
const failures: string[] = [];
/** 测试服务器真实返回 404，以复现旧页面加载已删除 chunk 的发布故障。 */
let missingFilePicker: boolean = false;
const mime: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = createServer((request, response): void => {
  const requestUrl: URL = new URL(request.url ?? '/', 'http://localhost');
  const pathname: string = decodeURIComponent(requestUrl.pathname);
  if (pathname === '/__entities') {
    const name: string = requestUrl.searchParams.get('name') ?? '';
    sendEntityPage(name, response);
    return;
  }
  const mount: string = mounts.findLast(prefix => pathname.startsWith(prefix)) ?? '/';
  const root: string = pathname.startsWith('/__checks/') ? consumerDist : dist;
  const relativePath: string = pathname.startsWith('/__checks/') ? pathname.slice('/__checks/'.length) : pathname.slice(mount.length);
  const file: string = resolve(root, relativePath || 'index.html');
  if (missingFilePicker && /FilePickerRenderer-[^/]+\.js$/.test(pathname)) { response.writeHead(404).end(); return; }
  if (!file.startsWith(`${root}/`) && !file.startsWith(`${root}\\`)) { response.writeHead(403).end(); return; }
  try {
    response.setHeader('Content-Type', mime[extname(file)] ?? 'application/octet-stream');
    response.end(readFileSync(file));
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') { throw error; }
    response.writeHead(404).end();
  }
});

/** 用真实 HTTP 返回乱序查询结果，不替换组件内部状态或 adapter 方法。 */
function sendEntityPage(name: string, response: ServerResponse): void {
  setTimeout(() => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ rows: [{ id: name === 'slow' ? 2 : 1, name: name || 'initial' }], total: 1 }));
  }, name === 'slow' ? 250 : 10);
}

/** 所有示例断言都使用真实浏览器事件，不替换组件、接口或事件处理函数。 */
async function runSmoke(browser: Browser, origin: string): Promise<void> {
  const page: Page = await browser.newPage({ locale: 'zh-CN', viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') { failures.push(message.text()); }
  });
  page.on('request', request => {
    if (!request.url().startsWith(origin) && !request.url().startsWith('blob:') && !request.url().startsWith('data:')) {
      failures.push(`Unexpected external request: ${request.url()}`);
    }
  });
  for (const mount of mounts) {
    await page.goto(`${origin}${mount}#/component/hyn/dept-select`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.hyn-form__grid').evaluate(element => getComputedStyle(element).display), 'grid');
    assert.ok(await page.locator('.hyn-tree-select__virtual-trigger').first().evaluate(element => element.clientWidth) > 160);
    await page.locator('.hyn-tree-select__virtual-trigger').first().click();
    await page.locator('.el-tree-node:visible .el-tree-node__expand-icon').first().click();
    await page.locator('.el-tree-node:visible').filter({ hasText: '前端组' }).click();
    assert.match(await page.locator('.hyn-tree-select__virtual-trigger').first().innerText(), /前端组/);
    await page.reload({ waitUntil: 'networkidle' });
    console.log(`PASS deployment ${mount}`);
  }

  /** 页内导航确保懒加载资源也从当前挂载路径读取。 */
  async function open(slug: string): Promise<void> {
    await page.goto(`${origin}/intranet/component-docs/#/component/hyn/${slug}`, { waitUntil: 'networkidle' });
    const formPageTitles: Record<string, string> = {
      'dept-select': 'HynDeptSelect', 'tree-select': 'HynTreeSelect', form: 'HynForm', table: 'HynTable', dialog: 'HynDialog'
    };
    if (formPageTitles[slug]) {
      await page.waitForFunction(title => document.querySelector('main h1')?.textContent?.trim() === title, formPageTitles[slug]);
    }
  }

  /** 测量实际 Label slot 与控件行的位置，覆盖原先只验证栅格和点击时遗漏的 5px 偏移。 */
  async function assertFormAlignment(): Promise<void> {
    const issues: string[] = await page.evaluate(() => {
      // Hash 导航可在定位与求值之间卸载旧页，测量必须从当前文档重新获取节点。
      const forms: Element[] = Array.from(document.querySelectorAll('.hyn-form')).filter(form => form.getClientRects().length > 0);
      if (forms.length === 0) { return ['No visible HYN form was available for alignment measurement']; }
      return forms.flatMap(form => {
        const stacked: boolean = form.classList.contains('is-label-stacked');
        return Array.from(form.querySelectorAll('.hyn-form__item')).flatMap(item => {
          const label: HTMLElement | null = item.querySelector<HTMLElement>('.hyn-form__label');
          const labelContainer: HTMLElement | null = item.querySelector<HTMLElement>('.el-form-item__label');
          const content: HTMLElement | null = item.querySelector<HTMLElement>('.hyn-form__content');
          if (!label || !labelContainer || !content || !label.textContent?.trim()) { return []; }
          const labelRect: DOMRect = label.getBoundingClientRect();
          const contentRect: DOMRect = content.getBoundingClientRect();
          const controlHeight: number = Number.parseFloat(getComputedStyle(form).getPropertyValue('--app-control-height'));
          if (!Number.isFinite(controlHeight)) { return ['Form control height token is missing']; }
          if (stacked) {
            // 顶部 Label 的必填星号参与外层布局，文字本身允许相对星号缩进。
            return Math.abs(labelContainer.getBoundingClientRect().left - contentRect.left) > 1 || labelRect.bottom > contentRect.top
              ? [`${label.textContent}: stacked label is not aligned with its control`] : [];
          }
          const expectedCenter: number = contentRect.top + Math.max(controlHeight, labelRect.height) / 2;
          const delta: number = Math.abs(labelRect.top + labelRect.height / 2 - expectedCenter);
          const gap: number = contentRect.left - labelRect.right;
          return delta > 1 || Math.abs(gap - 12) > 1
            ? [`${label.textContent}: center delta=${delta}, horizontal gap=${gap}`] : [];
        });
      });
    });
    assert.deepEqual(issues, [], 'Form labels must align with the control row and preserve column edges');
  }

  for (const width of [1920, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const slug of ['dept-select', 'tree-select', 'form']) {
      await open(slug);
      await assertFormAlignment();
    }
  }
  console.log('PASS desktop label vertical centers and horizontal edges');

  await open('table');
  const firstRowName: string = await page.locator('.el-table__body tr').first().innerText();
  await page.locator('.hyn-table-action-cell button').first().click();
  await assertFormAlignment();
  await page.locator('.el-dialog:visible input').first().fill('已编辑的示例');
  await page.locator('.el-dialog:visible').getByRole('button', { name: '取消', exact: true }).click();
  assert.equal(await page.locator('.el-table__body tr').first().innerText(), firstRowName);
  await page.locator('.hyn-table-action-cell button').first().click();
  await page.locator('.el-dialog:visible input').first().fill('已编辑的示例');
  await page.locator('.el-dialog:visible').getByRole('button', { name: '确定', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.el-table__body')?.textContent?.includes('已编辑的示例'));
  await page.getByRole('button', { name: '导入', exact: true }).click();
  const uploadArea = page.locator('.el-dialog:visible .el-upload-dragger');
  await uploadArea.waitFor({ state: 'visible' });
  assert.equal(await uploadArea.isVisible(), true, 'The file chooser must be visible, not merely present as a hidden input');
  await page.locator('.el-dialog:visible').getByRole('button', { name: '确定', exact: true }).click();
  await page.locator('.el-dialog:visible .el-form-item__error').waitFor();
  const chooserPromise = page.waitForEvent('filechooser');
  await uploadArea.click();
  await (await chooserPromise).setFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{}') });
  await page.locator('.el-dialog:visible .el-form-item__error').waitFor({ state: 'hidden' });
  await page.locator('.el-dialog:visible').getByRole('button', { name: '确定', exact: true }).click();
  await page.locator('.el-dialog:visible [role=alert]').waitFor();
  await page.locator('.el-dialog:visible').getByRole('button', { name: '取消', exact: true }).click();
  await page.getByRole('button', { name: '导入', exact: true }).click();
  await page.locator('.el-dialog:visible input[type=file]').setInputFiles({ name: 'demo.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify([{ id: 88, name: '导入记录', code: 'IMPORTED', status: 'enabled', createTime: '2026-10-16 10:00:00', remark: 'local' }])) });
  await page.locator('.el-dialog:visible').getByRole('button', { name: '确定', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.el-table__body')?.textContent?.includes('导入记录'));
  await page.locator('.el-table__body tr').filter({ hasText: '导入记录' }).getByRole('button', { name: '删除', exact: true }).click();
  await page.locator('.el-message-box').getByRole('button', { name: '取消', exact: true }).click();
  assert.equal(await page.locator('.el-table__body tr').filter({ hasText: '导入记录' }).count(), 1);
  await page.locator('.el-table__body tr').filter({ hasText: '导入记录' }).getByRole('button', { name: '删除', exact: true }).click();
  await page.locator('.el-message-box').getByRole('button', { name: '确定', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.el-table__body')?.textContent?.includes('导入记录'));
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 JSON 模板', exact: true }).click();
  assert.equal((await downloadPromise).suggestedFilename(), 'hyn-table-template.json');
  const validRow = { id: 99, name: '禁止部分导入', code: 'BOUNDARY', status: 'enabled', createTime: '2026-10-16 10:00:00', remark: 'local' };
  for (const invalidRows of [
    [{ ...validRow, status: ['enabled'] }],
    [{ ...validRow, status: { value: 'enabled' } }],
    [{ ...validRow, createTime: '2026-02-30 10:00:00' }],
    [validRow, { ...validRow }],
    [validRow, { ...validRow, id: 100, name: '' }]
  ]) {
    await page.getByRole('button', { name: '导入', exact: true }).click();
    await page.locator('.el-dialog:visible input[type=file]').setInputFiles({ name: 'invalid-rows.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(invalidRows)) });
    await page.locator('.el-dialog:visible').getByRole('button', { name: '确定', exact: true }).click();
    await page.locator('.el-dialog:visible [role=alert]').waitFor();
    assert.equal(await page.locator('.el-table__body tr').filter({ hasText: '禁止部分导入' }).count(), 0);
    await page.locator('.el-dialog:visible').getByRole('button', { name: '取消', exact: true }).click();
    await page.locator('.el-dialog:visible').waitFor({ state: 'hidden' });
  }
  await page.getByRole('button', { name: '导入', exact: true }).click();
  await page.locator('.el-dialog:visible input[type=file]').setInputFiles({ name: 'paged-rows.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(Array.from({ length: 50 }, (_, index) => ({ ...validRow, id: 1000 + index, name: `分页导入 ${index}` })))) });
  await page.locator('.el-dialog:visible').getByRole('button', { name: '确定', exact: true }).click();
  await page.locator('.el-dialog:visible').waitFor({ state: 'hidden' });
  assert.ok(await page.locator('.el-table__body tr').count() <= 10);
  assert.match(await page.locator('main .el-pagination__total').innerText(), /53/);
  console.log('PASS table edit, cancel, import validation, import, delete confirmation, template');

  await open('virtual-table');
  await page.locator('.hyn-table-action-cell button').first().click();
  await page.locator('.el-dialog:visible input').first().fill('虚拟列表编辑');
  await page.locator('.el-dialog:visible').getByRole('button', { name: '确定', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.hyn-table')?.textContent?.includes('虚拟列表编辑'));
  await page.getByRole('button', { name: '删除', exact: true }).first().click();
  await page.locator('.el-message-box').getByRole('button', { name: '确定', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.hyn-table')?.textContent?.includes('虚拟列表编辑'));
  console.log('PASS virtual table edit and delete');

  await open('virtual-tree-table');
  await page.locator('.hyn-table-action-cell button').first().click();
  await page.locator('.el-dialog:visible input').first().fill('树节点编辑');
  await page.locator('.el-dialog:visible').getByRole('button', { name: '确定', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.hyn-virtual-tree-table')?.textContent?.includes('树节点编辑'));
  await page.locator('.hyn-table-action-cell button').nth(1).click();
  await page.locator('.el-dialog:visible input').first().fill('新增子节点示例');
  await page.locator('.el-dialog:visible').getByRole('button', { name: '确定', exact: true }).click();
  await page.getByRole('button', { name: '展开', exact: true }).first().click();
  await page.getByText('新增子节点示例', { exact: true }).waitFor();
  await page.getByRole('button', { name: '删除', exact: true }).first().click();
  await page.locator('.el-message-box').getByRole('button', { name: '确定', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.hyn-virtual-tree-table')?.textContent?.includes('树节点编辑'));
  console.log('PASS virtual tree edit, add child, subtree delete');

  await open('table-dialog');
  await page.locator('main > .hyn-doc-page .hyn-doc-section button').first().click();
  const logDialog = page.locator('.hyn-table-dialog:visible');
  await logDialog.locator('.hyn-table-action-cell button').first().click();
  await page.locator('.hyn-dialog:visible').getByText('ryTask.RyNoParams', { exact: true }).waitFor();
  await page.locator('.hyn-dialog:visible .el-dialog__headerbtn').click();
  await logDialog.locator('.query-form input').first().fill('不存在的任务');
  await logDialog.getByRole('button', { name: '搜索', exact: true }).click();
  await logDialog.locator('.el-table__empty-block').waitFor();
  await logDialog.getByRole('button', { name: '重置', exact: true }).click();
  await logDialog.locator('.el-table__body tr').first().waitFor();
  await logDialog.locator('.btn-next').click();
  assert.match(await logDialog.locator('.el-table__body tr').first().innerText(), /11/);
  await logDialog.locator('.el-table__body tr .el-checkbox').first().click();
  await logDialog.getByRole('button', { name: '删除', exact: true }).click();
  await page.locator('.el-message-box').getByRole('button', { name: '确定', exact: true }).click();
  assert.match(await logDialog.locator('.el-pagination__total').innerText(), /35/);
  const exportPromise = page.waitForEvent('download');
  await logDialog.getByRole('button', { name: '导出', exact: true }).click();
  assert.equal((await exportPromise).suggestedFilename(), 'hyn-log-demo.json');
  await logDialog.locator('.el-dialog__headerbtn').click();
  console.log('PASS log details, query, reset, pagination, bulk delete, export');

  for (const slug of ['form', 'dialog', 'tree-select', 'cron-expression', 'entity-picker', 'global-config', 'i18n-boundary']) {
    await open(slug);
    assert.equal(await page.locator('main h1').count(), 1);
    assert.equal(await page.locator('main').evaluate(element => Array.from(element.querySelectorAll('*')).filter(child => child.tagName.startsWith('EL-') || child.tagName === 'PAGINATION').length), 0);
  }
  await open('dept-select');
  await page.locator('.hyn-tree-select__virtual-trigger').nth(1).click();
  await page.locator('.hyn-tree-select__virtual-panel:visible .el-tree-node__expand-icon').first().click();
  await page.locator('.hyn-tree-select__virtual-panel:visible .el-tree-node').filter({ hasText: '平台组' }).locator('.el-checkbox').click();
  assert.match(await page.locator('.hyn-tree-select__virtual-trigger').nth(1).innerText(), /平台组/);
  await page.locator('.hyn-tree-select__virtual-panel:visible .hyn-tree-select__linkage-button').click();
  assert.equal(await page.locator('.hyn-tree-select__virtual-panel:visible .hyn-tree-select__linkage-button').getAttribute('aria-pressed'), 'false');
  await page.locator('main h1').click();
  await page.locator('main .hyn-form__item').nth(2).locator('.el-select__wrapper').click();
  await page.locator('.el-select-dropdown:visible').getByText('前端组', { exact: true }).click();
  assert.match(await page.locator('main .hyn-form__item').nth(2).innerText(), /前端组/);
  await page.locator('main h1').click();
  await page.locator('main .hyn-form__item').nth(2).locator('.el-tag__close').click();
  assert.doesNotMatch(await page.locator('main .hyn-form__item').nth(2).innerText(), /前端组/);
  console.log('PASS department tree multiple/linkage and flat selection/tag removal');
  await open('dialog');
  await page.locator('main .hyn-doc-section button').first().click();
  await assertFormAlignment();
  await page.locator('.hyn-dialog:visible input').first().fill('本地岗位');
  await page.locator('.hyn-dialog:visible input').nth(1).fill('LOCAL_POST');
  await page.locator('.hyn-dialog:visible').getByRole('button', { name: '确定', exact: true }).click();
  await page.locator('.hyn-dialog:visible').waitFor({ state: 'hidden' });
  await open('entity-picker');
  await page.locator('main button').filter({ hasText: '打开' }).click();
  await page.locator('.hyn-entity-picker-dialog:visible .el-pagination').waitFor();
  await page.locator('.hyn-entity-picker-dialog:visible .hyn-table__row .el-checkbox:not(.is-disabled)').first().click();
  await page.locator('.hyn-entity-picker-dialog:visible').getByRole('button', { name: '确定', exact: true }).click();
  await page.locator('.hyn-entity-picker-dialog:visible').waitFor({ state: 'hidden' });
  await open('cron-expression');
  await page.locator('.hyn-cron-expression button').first().click();
  await page.locator('.hyn-dialog:visible .quartz-cron-editor').waitFor();
  await page.locator('.hyn-dialog:visible').getByRole('button', { name: '关闭', exact: true }).click();
  await page.locator('.hyn-doc-language').selectOption('en_US');
  assert.match(await page.locator('main h1').innerText(), /Cron/);
  assert.equal(await page.locator('button, input[placeholder]').evaluateAll(elements => elements.some(element => /(?:app\.hyn|quartzCron\.|common\.confirm)/.test((element.textContent ?? '') + (element.getAttribute('placeholder') ?? '')))), false);
  await open('form');
  await assertFormAlignment();
  await page.setViewportSize({ width: 390, height: 844 });
  await open('dept-select');
  assert.equal(await page.locator('main .hyn-form__grid').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length), 1);
  await assertFormAlignment();
  await open('form');
  await assertFormAlignment();
  console.log('PASS remaining routes, form dialog submit, entity picker, Cron, language, mobile');
  await page.close();
}

/** 发布期间资源缺失必须显示字段错误与刷新提示；刷新后验证真实文件选择入口恢复。 */
async function runResourceFailureSmoke(browser: Browser, origin: string): Promise<void> {
  const page: Page = await browser.newPage({ locale: 'zh-CN', viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(10000);
  const resourceErrors: string[] = [];
  page.on('pageerror', error => resourceErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') { resourceErrors.push(message.text()); } });
  try {
    await page.goto(`${origin}/#/component/hyn/table`, { waitUntil: 'networkidle' });
    missingFilePicker = true;
    await page.getByRole('button', { name: '导入', exact: true }).click();
    await page.locator('.hyn-form-field-error').waitFor();
    await page.locator('.hyn-doc-resource-error').waitFor();
    assert.ok(resourceErrors.some(message => /404|dynamically imported module/.test(message)), 'The error state must correspond to a real failed resource request');
    assert.match(await page.locator('.hyn-doc-resource-error').innerText(), /保留尚未保存/);
    missingFilePicker = false;
    await page.locator('.hyn-doc-resource-error').getByRole('button', { name: '刷新', exact: true }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '导入', exact: true }).click();
    await page.locator('.el-dialog:visible .el-upload-dragger').waitFor();
    assert.equal(await page.locator('.hyn-doc-resource-error').count(), 0);
    assert.equal(await page.locator('.hyn-form-field-error').count(), 0);
    console.log('PASS real 404 resource failure, visible error state, explicit refresh, file chooser recovery');
  } finally {
    missingFilePicker = false;
    await page.close();
  }
}

/** 独立宿主运行真实组件，覆盖异步校验重入、父弹窗关闭浮层与远程查询乱序。 */
async function runConsumerAdversarialSmoke(browser: Browser, origin: string): Promise<void> {
  const page: Page = await browser.newPage({ locale: 'zh-CN', viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', message => { if (message.type() === 'error' || message.type() === 'warning') { failures.push(message.text()); } });
  try {
    await page.goto(`${origin}/__checks/tests/adversarial.html`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open validation dialog', exact: true }).click();
    await page.locator('.hyn-dialog:visible').getByRole('button', { name: '确定', exact: true }).dblclick();
    await page.locator('.hyn-dialog:visible').waitFor({ state: 'hidden' });
    assert.equal(await page.getByTestId('submit-count').innerText(), '1');
    await page.getByRole('button', { name: 'Open validation dialog', exact: true }).click();
    await page.locator('.hyn-dialog:visible').getByRole('button', { name: '确定', exact: true }).click();
    await page.locator('.hyn-dialog:visible').getByRole('button', { name: '取消', exact: true }).click();
    await page.locator('.hyn-dialog:visible').waitFor({ state: 'hidden' });
    // 等待真实异步校验和提交窗口结束，确认取消不会延迟触发保存。
    await page.waitForTimeout(450);
    assert.equal(await page.getByTestId('submit-count').innerText(), '1');
    await page.getByRole('button', { name: 'Open validation dialog', exact: true }).click();
    await page.getByRole('button', { name: 'Close after delay', exact: true }).click();
    await page.locator('.hyn-dialog:visible .el-select__wrapper').click();
    await page.locator('.el-select-dropdown:visible').waitFor();
    await page.locator('.hyn-dialog:visible').waitFor({ state: 'hidden' });
    assert.equal(await page.locator('.el-select-dropdown:visible').count(), 0);
    await page.getByRole('button', { name: 'Open race picker', exact: true }).click();
    const picker = page.locator('.hyn-entity-picker-dialog:visible');
    await picker.getByText('initial', { exact: true }).waitFor();
    await picker.getByPlaceholder('Query name').fill('slow');
    await picker.getByRole('button', { name: '搜索', exact: true }).click();
    await picker.getByPlaceholder('Query name').fill('fast');
    await picker.getByRole('button', { name: '搜索', exact: true }).click();
    await picker.getByText('fast', { exact: true }).waitFor();
    await page.waitForLoadState('networkidle');
    assert.equal(await picker.getByText('slow', { exact: true }).count(), 0);
    assert.equal(await picker.getByText('fast', { exact: true }).count(), 1);
    console.log('PASS independent consumer: double-submit lock, cancel during validation, native overlay close, real HTTP response race');
  } finally {
    await page.close();
  }
}

await new Promise<void>(done => server.listen(0, '127.0.0.1', done));
const address = server.address();
assert.ok(address && typeof address !== 'string');
const browser: Browser = await chromium.launch({ headless: true });
try {
  await runSmoke(browser, `http://127.0.0.1:${address.port}`);
  await runResourceFailureSmoke(browser, `http://127.0.0.1:${address.port}`);
  await runConsumerAdversarialSmoke(browser, `http://127.0.0.1:${address.port}`);
  assert.deepEqual(failures, [], 'Console warnings, runtime errors, and external requests must be absent');
} finally {
  await browser.close();
  server.close();
}
