<template>
  <HynOverflowText :content="content" mode="ellipsis" tag="div" class="hyn-table__cell-text">
    <slot />
  </HynOverflowText>
</template>

<script setup lang="ts">
import HynOverflowText from '../../internal/HynOverflowText.vue';

defineProps<{
  /** 原始单元格文本，交给 HynOverflowText 基于真实 DOM 溢出状态决定是否展示 tooltip。 */
  content: string;
}>();
</script>
