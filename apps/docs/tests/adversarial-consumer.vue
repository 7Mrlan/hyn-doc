<template>
  <button type="button" @click="dialogVisible = true">Open validation dialog</button>
  <output data-testid="submit-count">{{ submitCount }}</output>
  <hyn-dialog v-model="dialogVisible" title="Validation check" :model="model" :fields="fields" :rules="rules" @submit="submit">
    <template #closeTimer><button type="button" @click="closeLater">Close after delay</button></template>
  </hyn-dialog>
  <button type="button" @click="pickerVisible = true">Open race picker</button>
  <hyn-entity-picker v-model="selected" v-model:visible="pickerVisible" title="Race check" :adapter="adapter" :columns="columns" :search-fields="searchFields" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FormRules } from 'element-plus';
import { HynDialog, HynEntityPicker } from '@7mrlan/hyn-ui';
import type { HynDialogField, HynEntityAdapter, HynEntityModelValue, HynEntityPageQuery, HynEntityPickerColumn, HynEntitySearchField, HynPageResult } from '@7mrlan/hyn-ui/types';

/** 测试宿主只提供组件公开字段协议，验证真实表单校验与原生下拉的关闭行为。 */
interface CheckForm { name: string; category: string }
interface CheckEntity { id: number; name: string }
interface CheckQuery extends HynEntityPageQuery { name: string }

const dialogVisible = ref<boolean>(false);
const submitCount = ref<number>(0);
const model = ref<CheckForm>({ name: 'checked', category: '' });
const fields: HynDialogField<CheckForm>[] = [
  { key: 'name', prop: 'name', label: 'Name', type: 'input' },
  { key: 'category', prop: 'category', label: 'Category', type: 'select', options: [{ label: 'First', value: 'first' }] },
  { key: 'timer', label: '', type: 'slot', slot: 'closeTimer' }
];
const rules: FormRules<CheckForm> = {
  name: [{ asyncValidator: async (): Promise<void> => { await new Promise<void>(done => window.setTimeout(done, 300)); } }]
};

/** 实际异步校验与提交都完成后才累计次数，快速双击必须只执行一次。 */
async function submit(): Promise<void> {
  await new Promise<void>(done => window.setTimeout(done, 80));
  submitCount.value += 1;
  dialogVisible.value = false;
}

/** 模拟保存回调关闭父弹窗，期间不向下拉框派发点击外部事件。 */
function closeLater(): void {
  window.setTimeout(() => { dialogVisible.value = false; }, 500);
}

const pickerVisible = ref<boolean>(false);
const selected = ref<HynEntityModelValue>([]);
const columns: HynEntityPickerColumn<CheckEntity>[] = [{ key: 'name', field: 'name', title: 'Name' }];
const searchFields: HynEntitySearchField<CheckQuery>[] = [{ key: 'name', label: 'Query', placeholder: 'Query name' }];
/** 测试服务器提供真实 HTTP 响应延迟，组件仍走公开 adapter.fetchPage 协议。 */
const adapter: HynEntityAdapter<CheckEntity, CheckQuery> = {
  fetchPage: async (query: CheckQuery): Promise<HynPageResult<CheckEntity>> => {
    const response: Response = await fetch(`/__entities?name=${encodeURIComponent(query.name)}`);
    if (!response.ok) { throw new Error(`Fixture entity request failed: ${response.status}`); }
    return await response.json() as HynPageResult<CheckEntity>;
  },
  fetchByKeys: async (): Promise<CheckEntity[]> => [],
  getKey: (row: CheckEntity): number => row.id,
  getLabel: (row: CheckEntity): string => row.name,
  createInitialQuery: (): CheckQuery => ({ pageNum: 1, pageSize: 20, name: '' })
};
</script>
