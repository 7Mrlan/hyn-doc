# HYN Component Documentation

Standalone HYN component documentation and the source workspace for `@7mrlan/hyn-ui`.

- Public documentation: `https://7mrlan.github.io/hyn-doc/`
- Local development: `corepack pnpm@10.0.0 docs:dev`
- Local verification: `corepack pnpm@10.0.0 ui:typecheck`, `corepack pnpm@10.0.0 docs:typecheck`, `corepack pnpm@10.0.0 ui:consumer-check`, `corepack pnpm@10.0.0 docs:build`, and `corepack pnpm@10.0.0 docs:test`
- Documentation deployment: only pushes to `develop` run the GitHub Pages workflow.
- UI releases: push a `hyn-ui-v*` tag after a reviewed package version update. The package is published to GitHub Packages; consumers must provide a `read:packages` token outside repository files.

The docs app intentionally has no SSO router, store, proxy, API client, or authentication dependency. Interactive examples use deterministic local fixtures.

## 公司内网部署

```powershell
corepack pnpm@10.0.0 install --frozen-lockfile
corepack pnpm@10.0.0 docs:build
```

将 `apps/docs/dist/` 内的全部文件复制到内网 HTTP 静态站点即可。资源使用相对地址，路由使用 Hash；同一个产物可部署到根目录、`/hyn-doc/` 或 `/intranet/component-docs/`，不需要修改源码或重新构建。访问子目录时保留末尾 `/`，例如 `/intranet/component-docs/#/component/hyn`。

运行中的站点无需 Node.js、GitHub、CDN、SSO 或业务后端。构建机需要 Node.js 22.13+、pnpm 10 和已安装依赖；完全离线构建前需在可联网环境准备依赖缓存。示例的编辑、删除和 JSON 导入只改变当前页面会话，刷新后恢复 fixture。上传类业务组件通过运行时宿主注入，文档中的宿主适配不承诺服务器上传。

构建保留已有 hash 资源，避免预览期间重建使已打开页面的按需组件失效。覆盖发布时先上传新增 `assets/`，保留上一版本资源，再更新 `index.html`；HTML 建议使用 `Cache-Control: no-cache`。独立新服务器或 CI 全新目录没有旧资源，采用整体替换发布时，旧标签页可能需要刷新：站点会显示资源加载失败提示，异步字段也会显示错误，不会自动刷新丢弃草稿。旧资源应按发布保留策略清理，不能在仍需兼容旧标签页时直接删除。

Nginx 根目录示例（将文件放入此目录）：

```nginx
server {
    listen 80;
    root /srv/hyn-doc;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
```

使用 IIS 时建立普通静态站点或虚拟目录，启用静态内容，确保 `.js` 使用 JavaScript MIME 类型。Hash 路由不需要重写规则。内网域名由部署环境决定，产物中没有 API 主机、登录回调或固定域名配置。浏览器剪贴板功能要求 HTTPS 或 localhost；内网部署请配置 HTTPS，以保持代码复制与 Cron 表达式复制可用。

## 组件包接入

宿主使用 Vue 3、Element Plus 和 Vite Vue/Sass 编译能力。HYN 源码显式导入 Vue API、Element Plus 组件和 loading 指令，无需宿主提供自动导入插件或注册字符串图标。先加载以下样式，再加载宿主覆盖样式：

```ts
import 'element-plus/dist/index.css';
import '@7mrlan/hyn-ui/styles';
import zhCNComponents from '@7mrlan/hyn-ui/locales/zh_CN';
import enUSComponents from '@7mrlan/hyn-ui/locales/en_US';
import { configureHynRuntime } from '@7mrlan/hyn-ui/runtime';
```

`styles` 包含 HYN 表单、弹窗、表格弹窗布局和所需 CSS 变量。`locales/*` 完整提供 `common`、`quartzCron`、`app.common`、`app.hynForm`、`app.hynTreeSelect`、`app.table` 命名空间；业务页面自己的字段名称仍由宿主提供。独立文档站完整接入示例见 `apps/docs/src/i18n.ts` 与 `apps/docs/src/runtime/hynRuntime.ts`。组件包发布到其他 npm 仓库时可调整 `publishConfig.registry`，静态文档部署与包发布互不依赖。

## 浏览器验收

首次准备浏览器：`corepack pnpm@10.0.0 exec playwright install chromium`。构建后运行 `corepack pnpm@10.0.0 docs:test`，测试会编译不启用自动导入的独立测试宿主并启动临时 HTTP 服务，覆盖三个挂载目录、Label 几何位置、编辑/取消/保存、真实文件选择入口、JSON 非法类型/日期/重复编号/整批原子性、批量导入分页、删除确认、树节点操作、日志查询/分页/导出、实体选择和 Cron。另以真实 404 验证资源失败和用户主动刷新，以真实 HTTP 乱序响应验证最新查询，并覆盖异步校验期间双击和取消、父弹窗关闭后浮层清理。测试宿主只写入 `apps/docs/node_modules/.cache/hyn-browser-checks`，不进入发布产物。正常路径出现运行时报错、警告或外部请求即失败，故障路径只接受预期资源错误。测试结束关闭临时服务和浏览器。

`corepack pnpm@10.0.0 docs:contracts` 检查组件包是否仍引用原业务项目路径、所需 CSS 变量是否由包内定义，以及静态翻译键在中英文资源中是否存在；`docs:typecheck` 同时检查浏览器测试和独立宿主的 TypeScript/Vue 源码。
