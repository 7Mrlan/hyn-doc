<template><p class="hyn-form-field-error" role="alert">{{ t('app.hynForm.rendererLoadFailed') }}</p></template>

<script setup lang="ts">
import { useHynI18n } from '../../runtime';

/** 加载错误保留字段位置和明确反馈，不用空节点或替代控件掩盖失败。 */
const { t } = useHynI18n();
</script>

<style scoped>
.hyn-form-field-error { margin: 0; color: var(--el-color-danger); line-height: var(--app-line-height-base); }
</style>
