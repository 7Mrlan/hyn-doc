<template><span role="status">{{ t('app.common.loading') }}</span></template>

<script setup lang="ts">
import { useHynI18n } from '../../runtime';

/** 可选字段按需加载时明确显示等待状态，避免暂时空白被误认为无控件。 */
const { t } = useHynI18n();
</script>
