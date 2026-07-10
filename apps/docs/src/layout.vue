<template>
  <div class="hyn-doc-shell">
    <a class="hyn-doc-skip" href="#hyn-doc-main">{{ t('hynDocs.layout.skipToContent') }}</a>

    <aside class="hyn-doc-sidebar" :aria-label="t('hynDocs.layout.sidebarAria')">
      <router-link class="hyn-doc-brand" to="/component/hyn" @click="handleNavClick('/component/hyn', $event)">
        <span class="hyn-doc-brand__mark">HYN</span>
        <span class="hyn-doc-brand__copy">
          <strong>{{ t('hynDocs.layout.brandTitle') }}</strong>
          <small>{{ t('hynDocs.layout.brandSubtitle') }}</small>
        </span>
      </router-link>

      <nav class="hyn-doc-nav">
        <router-link
          class="hyn-doc-nav__item"
          to="/component/hyn"
          :class="{ 'is-active': isHomeActive }"
          @click="handleNavClick('/component/hyn', $event)"
        >
          <span>{{ t('hynDocs.layout.overviewTitle') }}</span>
          <small>{{ t('hynDocs.layout.overviewCaption') }}</small>
        </router-link>
        <router-link
          v-for="entry in docEntries"
          :key="entry.slug"
          class="hyn-doc-nav__item"
          :to="`/component/hyn/${entry.slug}`"
          :class="{ 'is-active': activeSlug === entry.slug }"
          @pointerenter="preloadDocPage(entry.slug)"
          @focus="preloadDocPage(entry.slug)"
          @click="handleNavClick(`/component/hyn/${entry.slug}`, $event)"
        >
          <span>{{ t(entry.titleKey) }}</span>
          <small>{{ t(entry.captionKey) }}</small>
        </router-link>
      </nav>
    </aside>

    <main id="hyn-doc-main" ref="contentRef" class="hyn-doc-content" tabindex="-1">
      <router-view v-slot="{ Component, route: currentRoute }">
        <keep-alive :max="8">
          <component :is="Component" :key="currentRoute.name ?? currentRoute.path" />
        </keep-alive>
      </router-view>
    </main>

    <aside class="hyn-doc-toc" :aria-label="t('hynDocs.layout.tocAria')">
      <span class="hyn-doc-toc__label">{{ t('hynDocs.layout.tocTitle') }}</span>
      <button
        v-for="item in tocItems"
        :key="item.id"
        type="button"
        class="hyn-doc-toc__item"
        @click="scrollToHeading(item.id)"
      >
        {{ item.text }}
      </button>
    </aside>
  </div>
</template>

<script setup name="HynComponentDocsLayout" lang="ts">
import { getSortedHynComponentDocEntries } from './docs/catalog';
import { preloadAllHynDocPages, preloadHynDocPage } from './router';
import { useAppI18n } from '@/utils/i18n';

interface TocItem {
  id: string;
  text: string;
}

const route = useRoute();
const { t, locale } = useAppI18n();
const contentRef = ref<HTMLElement | null>(null);
const tocItems = ref<TocItem[]>([]);
const docEntries = getSortedHynComponentDocEntries();
let tocFrame = 0;
let docPreloadTimer: number | undefined;

/** 鼠标悬停或键盘聚焦时提前加载目标页，保持导航反馈即时。 */
const preloadDocPage = (slug: string): void => {
  preloadHynDocPage(slug);
};

const activeSlug = computed(() => {
  const path = route.path.replace(/\/+$/, '');
  return docEntries.find(entry => path.endsWith(`/${entry.slug}`))?.slug ?? '';
});

const isHomeActive = computed(() => {
  return route.path.replace(/\/+$/, '') === '/component/hyn';
});

/**
 * 避免快速重复点击当前文档路由触发多余导航和重渲染。
 */
const handleNavClick = (targetPath: string, event: MouseEvent): void => {
  if (route.path.replace(/\/+$/, '') === targetPath) {
    event.preventDefault();
  }
};

/**
 * 生成稳定锚点，避免文档标题变化造成右侧目录无法跳转。
 */
const normalizeHeadingId = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\da-z\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * 刷新当前页面目录，文档页只需要给 h2 添加 data-doc-heading。
 */
const refreshToc = async (): Promise<void> => {
  await nextTick();
  const container = contentRef.value;
  if (!container) {
    tocItems.value = [];
    return;
  }

  tocItems.value = Array.from(container.querySelectorAll<HTMLElement>('[data-doc-heading]')).map((heading, index) => {
    const text = heading.textContent?.trim() || t('hynDocs.layout.fallbackSection', { index: index + 1 });
    if (!heading.id) {
      heading.id = normalizeHeadingId(text) || `hyn-doc-section-${index + 1}`;
    }
    return { id: heading.id, text };
  });
};

/**
 * 合并快速路由切换中的目录刷新，只处理最后一次页面状态。
 */
const scheduleRefreshToc = (): void => {
  if (tocFrame) {
    window.cancelAnimationFrame(tocFrame);
  }
  tocFrame = window.requestAnimationFrame(() => {
    tocFrame = 0;
    void refreshToc();
  });
};

/**
 * 切换文档路由后重置主内容滚动区，并重建页内目录。
 */
const scrollContentToTop = async (): Promise<void> => {
  await nextTick();
  contentRef.value?.scrollTo({ top: 0, behavior: 'auto' });
  scheduleRefreshToc();
};

/**
 * 在文档滚动容器内定位到指定标题。
 */
const scrollToHeading = (id: string): void => {
  contentRef.value?.querySelector<HTMLElement>(`#${CSS.escape(id)}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
};

watch(
  () => route.fullPath,
  () => {
    void scrollContentToTop();
  },
  { flush: 'post' }
);

watch(
  () => locale.value,
  () => {
    scheduleRefreshToc();
  },
  { flush: 'post' }
);

onMounted(() => {
  scheduleRefreshToc();
  docPreloadTimer = window.setTimeout(() => {
    preloadAllHynDocPages();
  }, 320);
});

onBeforeUnmount(() => {
  if (tocFrame) {
    window.cancelAnimationFrame(tocFrame);
  }
  if (docPreloadTimer !== undefined) {
    window.clearTimeout(docPreloadTimer);
  }
});
</script>

<style lang="scss">
.hyn-doc-shell {
  --hyn-doc-bg: #f4fbf6;
  --hyn-doc-bg-strong: #eaf7ee;
  --hyn-doc-surface: rgba(255, 255, 255, 0.74);
  --hyn-doc-surface-strong: rgba(255, 255, 255, 0.92);
  --hyn-doc-ink: #132018;
  --hyn-doc-muted: #667568;
  --hyn-doc-subtle: #dcebe0;
  --hyn-doc-border: rgba(34, 91, 61, 0.14);
  --hyn-doc-primary: #2f9e74;
  --hyn-doc-primary-strong: #16734f;
  --hyn-doc-primary-soft: rgba(52, 199, 89, 0.14);
  --hyn-doc-mint: #34c759;
  --hyn-doc-amber: #b7791f;
  --hyn-doc-danger: #c24152;
  --hyn-doc-code-bg: #101a16;
  --hyn-doc-code-rail: #18251f;
  --hyn-doc-radius: 24px;
  --hyn-doc-radius-sm: 16px;
  --hyn-doc-shadow: 0 20px 70px rgba(31, 82, 56, 0.12);
  --hyn-doc-shadow-soft: 0 10px 34px rgba(31, 82, 56, 0.08);
  --hyn-doc-ease: cubic-bezier(0.2, 0.8, 0.2, 1);

  position: relative;
  display: grid;
  width: 100%;
  height: 100dvh;
  min-width: 0;
  grid-template-columns: 292px minmax(0, 1fr) 220px;
  gap: 20px;
  padding: 22px;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(52, 199, 89, 0.16) 0%, transparent 28%),
    linear-gradient(180deg, #fbfffc 0%, var(--hyn-doc-bg) 42%, var(--hyn-doc-bg-strong) 100%);
  color: var(--hyn-doc-ink);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.hyn-doc-shell,
.hyn-doc-shell * {
  box-sizing: border-box;
}

.hyn-doc-shell::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(47, 158, 116, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(47, 158, 116, 0.045) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.62), transparent 78%);
  content: '';
}

.hyn-doc-skip {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 20;
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--hyn-doc-ink);
  color: #fff;
  transform: translateY(-140%);
}

.hyn-doc-skip:focus {
  transform: translateY(0);
}

.hyn-doc-sidebar,
.hyn-doc-toc,
.hyn-doc-hero,
.hyn-doc-section,
.hyn-doc-card,
.hyn-doc-link-card,
.hyn-doc-demo-frame,
.hyn-doc-api-table {
  border: 1px solid var(--hyn-doc-border);
  border-radius: var(--hyn-doc-radius);
  background: var(--hyn-doc-surface);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.85) inset,
    var(--hyn-doc-shadow-soft);
}

.hyn-doc-sidebar,
.hyn-doc-toc {
  backdrop-filter: blur(14px);
}

.hyn-doc-sidebar,
.hyn-doc-content,
.hyn-doc-toc {
  position: relative;
  z-index: 1;
  min-width: 0;
  min-height: 0;
}

.hyn-doc-sidebar {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.hyn-doc-brand {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
  padding: 22px;
  border-bottom: 1px solid var(--hyn-doc-border);
  color: inherit;
}

.hyn-doc-brand__mark {
  display: inline-flex;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: linear-gradient(145deg, #123021, #1e5d43);
  color: #f7fff9;
  font-weight: 900;
  letter-spacing: 0;
  box-shadow: 0 16px 34px rgba(31, 82, 56, 0.22);
}

.hyn-doc-brand__copy {
  min-width: 0;
}

.hyn-doc-brand strong,
.hyn-doc-card h2,
.hyn-doc-section h2,
.hyn-doc-section h3,
.hyn-doc-link-card strong {
  display: block;
  margin: 0;
  color: var(--hyn-doc-ink);
  letter-spacing: 0;
}

.hyn-doc-brand small,
.hyn-doc-nav__item small,
.hyn-doc-muted,
.hyn-doc-page p,
.hyn-doc-card p,
.hyn-doc-api-table__row p {
  color: var(--hyn-doc-muted);
  line-height: 1.74;
}

.hyn-doc-nav {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}

.hyn-doc-nav__item {
  display: grid;
  min-width: 0;
  gap: 4px;
  padding: 13px 14px;
  border: 1px solid transparent;
  border-radius: 18px;
  color: var(--hyn-doc-muted);
  transition:
    background-color 0.16s var(--hyn-doc-ease),
    border-color 0.16s var(--hyn-doc-ease),
    color 0.16s var(--hyn-doc-ease),
    transform 0.16s var(--hyn-doc-ease);
}

.hyn-doc-nav__item span {
  min-width: 0;
  color: inherit;
  font-size: 14px;
  font-weight: 820;
}

.hyn-doc-nav__item small {
  min-width: 0;
  font-size: 12px;
}

.hyn-doc-nav__item:hover,
.hyn-doc-nav__item.is-active {
  border-color: rgba(47, 158, 116, 0.24);
  background: linear-gradient(135deg, rgba(52, 199, 89, 0.18), rgba(255, 255, 255, 0.72));
  color: var(--hyn-doc-primary-strong);
  transform: translateX(2px);
}

.hyn-doc-nav__item:focus-visible,
.hyn-doc-code__copy:focus-visible,
.hyn-doc-toc__item:focus-visible {
  outline: 3px solid rgba(52, 199, 89, 0.28);
  outline-offset: 2px;
}

.hyn-doc-content {
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}

.hyn-doc-toc {
  align-self: start;
  display: grid;
  gap: 6px;
  max-height: calc(100dvh - 44px);
  padding: 16px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
}

.hyn-doc-toc__label,
.hyn-doc-kicker {
  color: var(--hyn-doc-primary-strong);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hyn-doc-toc__item {
  width: 100%;
  min-width: 0;
  padding: 9px 10px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--hyn-doc-muted);
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.14s var(--hyn-doc-ease),
    color 0.14s var(--hyn-doc-ease);
}

.hyn-doc-toc__item:hover {
  background: var(--hyn-doc-primary-soft);
  color: var(--hyn-doc-primary-strong);
}

.hyn-doc-page {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 20px;
}

.hyn-doc-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
  padding: clamp(26px, 4vw, 42px);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.88), rgba(237, 250, 240, 0.74)),
    var(--hyn-doc-surface);
  animation: hyn-doc-rise 0.2s var(--hyn-doc-ease) both;
}

.hyn-doc-hero h1 {
  margin: 10px 0 0;
  color: var(--hyn-doc-ink);
  font-size: clamp(40px, 5.6vw, 72px);
  line-height: 0.96;
  letter-spacing: 0;
}

.hyn-doc-section {
  display: grid;
  min-width: 0;
  gap: 18px;
  padding: clamp(22px, 3vw, 30px);
  animation: hyn-doc-rise 0.18s var(--hyn-doc-ease) both;
}

.hyn-doc-section__heading {
  max-width: 920px;
  margin-bottom: 0;
}

.hyn-doc-section__heading.is-row {
  display: flex;
  max-width: none;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.hyn-doc-section > .el-button {
  justify-self: start;
}

.hyn-doc-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.hyn-doc-grid.is-two {
  grid-template-columns: minmax(0, 1fr);
}

.hyn-doc-grid.is-four {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.hyn-doc-card,
.hyn-doc-link-card {
  min-width: 0;
  padding: 18px;
  transition:
    border-color 0.16s var(--hyn-doc-ease),
    box-shadow 0.16s var(--hyn-doc-ease),
    transform 0.16s var(--hyn-doc-ease);
}

.hyn-doc-card {
  display: grid;
  align-content: start;
  gap: 10px;
  height: 100%;
}

.hyn-doc-card > :first-child {
  margin-top: 0;
}

.hyn-doc-card > :last-child {
  margin-bottom: 0;
}

.hyn-doc-card .hyn-doc-code {
  width: 100%;
}

.hyn-doc-card:hover,
.hyn-doc-link-card:hover {
  border-color: rgba(47, 158, 116, 0.28);
  box-shadow: var(--hyn-doc-shadow);
  transform: translateY(-2px);
}

.hyn-doc-link-card {
  display: grid;
  min-height: 172px;
  align-content: start;
  gap: 10px;
}

.hyn-doc-pill-row,
.hyn-doc-tag-row {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: 8px;
}

.hyn-doc-pill-row span,
.hyn-doc-tag {
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid rgba(47, 158, 116, 0.12);
  border-radius: 999px;
  background: var(--hyn-doc-primary-soft);
  color: var(--hyn-doc-primary-strong);
  font-size: 12px;
  font-weight: 820;
}

.hyn-doc-tag.is-mint {
  background: rgba(52, 199, 89, 0.14);
  color: #137346;
}

.hyn-doc-tag.is-amber {
  background: rgba(183, 121, 31, 0.12);
  color: var(--hyn-doc-amber);
}

.hyn-doc-tag.is-danger {
  background: rgba(194, 65, 82, 0.1);
  color: var(--hyn-doc-danger);
}

.hyn-doc-code {
  min-width: 0;
  border: 1px solid rgba(209, 232, 216, 0.16);
  border-radius: 18px;
  overflow: hidden;
  background: var(--hyn-doc-code-bg);
  box-shadow: 0 18px 44px rgba(16, 26, 22, 0.18);
}

.hyn-doc-code__bar {
  display: flex;
  min-height: 44px;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 12px 0 16px;
  border-bottom: 1px solid rgba(220, 235, 224, 0.12);
  background: var(--hyn-doc-code-rail);
  color: #d7e8dc;
}

.hyn-doc-code__title {
  min-width: 0;
  overflow: hidden;
  font-size: 12px;
  font-weight: 820;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hyn-doc-code__meta {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
}

.hyn-doc-code__language {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(52, 199, 89, 0.12);
  color: #a8f0c1;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.hyn-doc-code__copy {
  min-height: 28px;
  padding: 5px 10px;
  border: 1px solid rgba(216, 237, 222, 0.22);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: #effaf2;
  cursor: pointer;
  transition:
    background-color 0.14s var(--hyn-doc-ease),
    color 0.14s var(--hyn-doc-ease),
    transform 0.14s var(--hyn-doc-ease);
}

.hyn-doc-code__copy:hover {
  background: rgba(52, 199, 89, 0.18);
  color: #fff;
  transform: translateY(-1px);
}

.hyn-doc-code__body {
  overflow: visible;
  scrollbar-width: none;
}

.hyn-doc-code.is-compact .hyn-doc-code__body {
  max-height: none;
}

.hyn-doc-code.is-expanded .hyn-doc-code__body {
  max-height: none;
}

.hyn-doc-code pre,
.hyn-doc-code code {
  max-width: 100%;
  margin: 0;
  overflow-x: hidden !important;
  white-space: pre-wrap !important;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.hyn-doc-code pre {
  padding: 18px;
  background: transparent !important;
}

.hyn-doc-code code {
  display: block;
  color: #e8f4ec;
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.72;
}

.hyn-doc-code .hljs {
  background: transparent !important;
  color: #e8f4ec;
}

.hyn-doc-code .hljs-keyword,
.hyn-doc-code .hljs-selector-tag,
.hyn-doc-code .hljs-title.function_ {
  color: #91d7ff;
}

.hyn-doc-code .hljs-string,
.hyn-doc-code .hljs-attr,
.hyn-doc-code .hljs-template-variable {
  color: #a8f0c1;
}

.hyn-doc-code .hljs-number,
.hyn-doc-code .hljs-literal {
  color: #ffd38a;
}

.hyn-doc-code .hljs-comment {
  color: #80978a;
  font-style: italic;
}

.hyn-doc-two-column {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

.hyn-doc-two-column.is-even {
  grid-template-columns: minmax(0, 1fr);
}

.hyn-doc-comparison-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-items: stretch;
}

.hyn-doc-comparison-card {
  display: flex;
  min-width: 0;
  height: 100%;
  flex-direction: column;
  gap: 12px;
}

.hyn-doc-comparison-card > .hyn-doc-comparison-control {
  width: 100%;
  margin-top: auto;
}

.hyn-doc-comparison-card .hyn-remote-select {
  width: 100%;
}

.hyn-doc-api-table {
  display: grid;
  overflow: hidden;
}

.hyn-doc-api-table__row {
  display: grid;
  grid-template-columns: minmax(130px, 190px) minmax(180px, 260px) minmax(0, 1fr);
  min-height: 52px;
  align-items: center;
  border-top: 1px solid var(--hyn-doc-border);
  background: rgba(255, 255, 255, 0.62);
}

.hyn-doc-api-table__row:first-child {
  border-top: 0;
}

.hyn-doc-api-table__row.is-head {
  background: rgba(235, 248, 239, 0.8);
  color: var(--hyn-doc-ink);
  font-weight: 900;
}

.hyn-doc-api-table__row code,
.hyn-doc-api-table__row span,
.hyn-doc-api-table__row p {
  min-width: 0;
  margin: 0;
  padding: 12px;
  line-height: 1.62;
}

.hyn-doc-api-table__row code {
  color: var(--hyn-doc-primary-strong);
  font-family: Consolas, Monaco, 'Courier New', monospace;
  white-space: normal;
  overflow-wrap: anywhere;
}

.hyn-doc-demo-frame {
  min-height: 360px;
  padding: 14px;
  overflow: hidden;
}

.hyn-doc-demo-frame.is-virtual-table-demo {
  display: flex;
  height: min(54dvh, 520px);
  min-height: 360px;
  flex-direction: column;
}

.hyn-doc-demo-frame.is-virtual-table-demo > .hyn-table {
  flex: 1 1 auto;
  min-height: 0;
}

.hyn-doc-status {
  display: inline-flex;
  min-width: 48px;
  justify-content: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 820;
}

.hyn-doc-status.is-success {
  background: rgba(52, 199, 89, 0.15);
  color: #137346;
}

.hyn-doc-status.is-info {
  background: rgba(47, 158, 116, 0.12);
  color: var(--hyn-doc-primary-strong);
}

.hyn-doc-status.is-muted {
  background: rgba(255, 255, 255, 0.76);
  color: var(--hyn-doc-muted);
}

.hyn-doc-check-list {
  display: grid;
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.hyn-doc-check-list li {
  position: relative;
  padding-left: 24px;
  color: var(--hyn-doc-muted);
  line-height: 1.7;
}

.hyn-doc-check-list li::before {
  position: absolute;
  top: 0.72em;
  left: 4px;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--hyn-doc-mint);
  content: '';
}

@keyframes hyn-doc-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hyn-doc-shell *,
  .hyn-doc-shell *::before,
  .hyn-doc-shell *::after {
    animation-duration: 0.001ms !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}

@media (max-width: 1360px) {
  .hyn-doc-shell {
    grid-template-columns: 270px minmax(0, 1fr);
  }

  .hyn-doc-comparison-grid {
    grid-template-columns: 1fr;
  }

  .hyn-doc-toc {
    display: none;
  }
}

@media (max-width: 980px) {
  .hyn-doc-shell {
    height: 100dvh;
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 14px;
  }

  .hyn-doc-sidebar {
    max-height: 260px;
  }

  .hyn-doc-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hyn-doc-hero,
  .hyn-doc-two-column,
  .hyn-doc-two-column.is-even,
  .hyn-doc-comparison-grid {
    grid-template-columns: 1fr;
  }

  .hyn-doc-content {
    padding-right: 0;
  }
}

@media (max-width: 760px) {
  .hyn-doc-shell {
    padding: 12px;
  }

  .hyn-doc-nav,
  .hyn-doc-grid,
  .hyn-doc-grid.is-two,
  .hyn-doc-grid.is-four {
    grid-template-columns: 1fr;
  }

  .hyn-doc-hero,
  .hyn-doc-section {
    padding: 20px;
  }

  .hyn-doc-api-table__row,
  .hyn-doc-api-table__row.is-head {
    grid-template-columns: 1fr;
  }
}
</style>
