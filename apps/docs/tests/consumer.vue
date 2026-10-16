<template>
  <hyn-form :model="model" :fields="fields" :columns="2" />
  <hyn-dept-select v-model="department" />
  <hyn-cron-expression v-model="cron" />
  <hyn-dialog v-model="visible" title="Consumer check"><hyn-table :rows="[]" :columns="[]" :row-key="rowKey" /></hyn-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import 'element-plus/dist/index.css';
import '@7mrlan/hyn-ui/styles';
import { HynForm, HynDeptSelect, HynCronExpression, HynDialog, HynTable } from '@7mrlan/hyn-ui';
import type { HynFormField } from '@7mrlan/hyn-ui/types';

/** 验证宿主仅显式导入公共组件，不提供自动导入或全局组件注册。 */
const model = ref<{ name: string }>({ name: '' });
const fields: HynFormField<{ name: string }>[] = [{ key: 'name', prop: 'name', type: 'input', label: 'Name' }];
const department = ref<number>();
const cron = ref<string>('0 0 12 * * ?');
const visible = ref<boolean>(false);
/** 空表也声明真实主键协议，避免测试消费者依赖隐式行编号。 */
const rowKey = (row: { id: number }): number => row.id;
</script>
