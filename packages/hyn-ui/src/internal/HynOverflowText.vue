<template>
  <el-tooltip
    v-if="shouldWrapTooltip"
    :content="content"
    :disabled="tooltipDisabled"
    effect="dark"
    placement="top"
    :persistent="false"
    :show-after="300"
    teleported
  >
    <component
      :is="tag"
      ref="textRef"
      class="hyn-overflow-text"
      :class="modeClass"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <slot>{{ content }}</slot>
    </component>
  </el-tooltip>
  <component
    v-else-if="shouldUseSharedTooltip"
    :is="tag"
    ref="textRef"
    class="hyn-overflow-text"
    :class="modeClass"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot>{{ content }}</slot>
  </component>
  <component
    v-else
    :is="tag"
    ref="textRef"
    class="hyn-overflow-text"
    :class="modeClass"
  >
    <slot>{{ content }}</slot>
  </component>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, ref, watch } from 'vue';
import { HYN_TABLE_TOOLTIP_KEY } from './tableTooltip';
import type { HynTextOverflowMode } from '../shared/overflow';

const props = withDefaults(
  defineProps<{
    /** 用于溢出测量和 tooltip 展示的纯文本内容，slot 只负责自定义视觉结构。 */
    content: string;
    /** 文本溢出策略，只有 ellipsis 模式会在鼠标悬停时按真实 DOM 尺寸开启 tooltip。 */
    mode: HynTextOverflowMode;
    /** 根节点标签，表格单元格通常用 div，内联标题通常用 span。 */
    tag?: 'span' | 'div';
  }>(),
  {
    tag: 'span'
  }
);

const textRef = ref<HTMLElement>();
const tableTooltip = inject(HYN_TABLE_TOOLTIP_KEY, null);
// 溢出状态只记录真实 DOM 测量结果，tooltip 是否启用不能仅靠字符串长度判断。
const overflowing = ref(false);
const modeClass = computed(() => `is-overflow-${props.mode}`);
const shouldUseSharedTooltip = computed(() => Boolean(tableTooltip) && props.mode === 'ellipsis' && props.content !== '');
const shouldWrapTooltip = computed(() => !shouldUseSharedTooltip.value && props.mode === 'ellipsis' && props.content !== '');
const tooltipDisabled = computed(() => !overflowing.value);

/** 鼠标进入时读取真实 DOM 尺寸，只对已经被省略的文本展示 tooltip。 */
function refreshOverflowState(): void {
  const element = textRef.value;
  if (!element || props.mode !== 'ellipsis') {
    overflowing.value = false;
    return;
  }
  overflowing.value = element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
}

function handleMouseEnter(): void {
  void nextTick(() => {
    refreshOverflowState();
    if (!shouldUseSharedTooltip.value || !overflowing.value || !textRef.value) {
      return;
    }
    tableTooltip?.show(textRef.value, props.content, 300);
  });
}

function handleMouseLeave(): void {
  if (textRef.value) {
    tableTooltip?.hide(textRef.value);
  }
  overflowing.value = false;
}

watch(
  () => [props.content, props.mode] as const,
  () => {
    if (textRef.value) {
      tableTooltip?.hide(textRef.value);
    }
    overflowing.value = false;
  },
  { flush: 'sync' }
);
</script>

<style lang="scss" scoped>
.hyn-overflow-text {
  display: block;
  width: 100%;
  min-width: 0;
  line-height: inherit;
}

.hyn-overflow-text.is-overflow-fit {
  overflow: visible;
  text-overflow: clip;
  white-space: nowrap;
}

.hyn-overflow-text.is-overflow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hyn-overflow-text.is-overflow-wrap {
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
  overflow-wrap: anywhere;
}
</style>
