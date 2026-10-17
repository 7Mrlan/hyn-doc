<template>
  <button type="button" @click="dialogVisible = true">Open validation dialog</button>
  <output data-testid="submit-count">{{ submitCount }}</output>
  <output data-testid="validation-count">{{ validationCount }}</output>
  <hyn-dialog v-model="dialogVisible" title="Validation check" :model="model" :fields="fields" :rules="rules" @submit="submit">
    <template #closeTimer><button type="button" @click="closeLater">Close after delay</button></template>
  </hyn-dialog>
  <button type="button" @click="pickerVisible = true">Open race picker</button>
  <hyn-entity-picker v-model="selected" v-model:visible="pickerVisible" title="Race check" :adapter="adapter" :columns="columns" :search-fields="searchFields" />
  <hyn-virtual-table data-testid="scroll-table" :rows="scrollRows" :columns="scrollColumns" :row-key="scrollRowKey" :height="240" />
  <hyn-virtual-tree-table data-testid="scroll-tree-table" :rows="scrollTreeRows" :columns="scrollTreeColumns" :row-key="scrollRowKey" :height="240" />
  <select v-model="overflowConfig.overflowMode" data-testid="overflow-mode" aria-label="Overflow mode"><option>fit</option><option>ellipsis</option><option>wrap</option></select>
  <div data-testid="policy-editor" style="width: min(800px, 100%)"><hyn-cron-visual-editor v-model:active-tab="cronTab" :model="cronModel" :disabled="false" /></div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormRules } from 'element-plus';
import { HynDialog, HynEntityPicker, HynVirtualTable, HynVirtualTreeTable } from '@7mrlan/hyn-ui';
import type { HynDialogField, HynEntityAdapter, HynEntityModelValue, HynEntityPageQuery, HynEntityPickerColumn, HynEntitySearchField, HynPageResult, HynVirtualTableColumn, HynVirtualTreeTableColumn, HynVirtualTreeTableRow } from '@7mrlan/hyn-ui/types';
import { provideHynGlobalConfig, type HynGlobalConfig } from '@7mrlan/hyn-ui/config';
import { parseQuartzExpressionToModel, type QuartzCronTabKey } from '@7mrlan/hyn-ui/cron';
import HynCronVisualEditor from '../../../packages/hyn-ui/src/HynCronExpression/HynCronVisualEditor.vue';

/** 测试宿主只提供组件公开字段协议，验证真实表单校验与原生下拉的关闭行为。 */
interface CheckForm { name: string; category: string }
interface CheckEntity { id: number; name: string }
interface CheckQuery extends HynEntityPageQuery { name: string }

/** 大数据集通过真实虚拟组件渲染，验证主题出口和滚动层叠，宿主不加载文档站样式。 */
const scrollRows: CheckEntity[] = Array.from({ length: 1000 }, (_, index) => ({ id: index + 1, name: `Row ${index + 1}` }));
const scrollColumns: HynVirtualTableColumn<CheckEntity>[] = [{ key: 'name', title: 'Name', minWidth: 900 }];
const scrollTreeColumns: HynVirtualTreeTableColumn<CheckEntity>[] = [{ key: 'name', title: 'Tree name', tree: true, minWidth: 900 }];
const scrollTreeRows: HynVirtualTreeTableRow<CheckEntity>[] = scrollRows.map(row => ({ key: row.id, row, depth: 0, hasChildren: false, expanded: false }));
/** 两种组件都通过稳定业务主键保持虚拟行身份。 */
const scrollRowKey = (row: CheckEntity): number => row.id;
/** 测试通过公开 provider 实时切换策略，不替换组件内部 computed 或 DOM 样式。 */
const overflowConfig = reactive<HynGlobalConfig>({ overflowMode: 'fit' });
provideHynGlobalConfig(overflowConfig);
const cronTab = ref<QuartzCronTabKey>('day');
const cronModel = ref(parseQuartzExpressionToModel('0 0 12 * * ?', 2026).model);

const dialogVisible = ref<boolean>(false);
const submitCount = ref<number>(0);
/** 响应处理结束后递增，使取消用例可以等校验真正完成而不是等待固定毫秒数。 */
const validationCount = ref<number>(0);
const model = ref<CheckForm>({ name: 'checked', category: '' });
const fields: HynDialogField<CheckForm>[] = [
  { key: 'name', prop: 'name', label: 'Name', type: 'input' },
  { key: 'category', prop: 'category', label: 'Category', type: 'select', options: [{ label: 'First', value: 'first' }] },
  { key: 'timer', label: '', type: 'slot', slot: 'closeTimer' }
];
const rules: FormRules<CheckForm> = {
  name: [{ asyncValidator: validateName }]
};

/** 真实 HTTP 校验由测试服务器释放响应，保证取消与完成的先后顺序可验证。 */
async function validateName(): Promise<void> {
  const response: Response = await fetch('/__validation', { cache: 'no-store' });
  if (!response.ok) { throw new Error(`Fixture validation request failed: /__validation status=${response.status}`); }
  validationCount.value += 1;
}

/** 累计业务保存的开始次数，不能用尚未结束的保存延时掩盖取消后误触发提交。 */
async function submit(): Promise<void> {
  submitCount.value += 1;
  await new Promise<void>(done => window.setTimeout(done, 80));
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
