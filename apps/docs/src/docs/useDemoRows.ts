import { computed, reactive, ref, shallowRef, type ComputedRef, type Ref, type ShallowRef } from 'vue';
import modal from '@/plugins/modal';
import { useAppI18n } from '@/utils/i18n';

/** 文档示例的本地编辑与删除契约，不包含后端持久化能力。 */
interface DemoRowsState<TRow> {
  /** 合并 fixture 与本页修改后的当前可见记录。 */
  rows: ComputedRef<TRow[]>;
  /** 独立草稿，取消编辑不会影响源记录。 */
  editModel: ShallowRef<TRow | undefined>;
  /** 由操作列和弹窗共同控制的编辑状态。 */
  editVisible: Ref<boolean>;
  /** 复制当前记录后打开编辑窗口。 */
  openEdit: (row: TRow) => void;
  /** 校验成功后发布草稿内容。 */
  saveEdit: () => void;
  /** 批量删除返回是否确认，供页面同步选择状态。 */
  deleteRows: (ids: number[]) => Promise<boolean>;
  /** 原子合并已校验的导入结果或编辑草稿。 */
  upsertRows: (incoming: TRow[]) => void;
}

/** 示例按稳定编号保存本地修改；源数据变化时未编辑的行仍跟随当前语言和数据量。 */
export function useDemoRows<TRow extends { id: number }>(source: ComputedRef<TRow[]>): DemoRowsState<TRow> {
  const { t } = useAppI18n();
  const changes = shallowRef<Map<number, TRow>>(new Map());
  const removedIds = shallowRef<Set<number>>(new Set());
  /** 新增与编辑分别记录，缩小虚拟数据集时不把已编辑旧行误当成新增行。 */
  const insertedIds = shallowRef<Set<number>>(new Set());
  const editModel = shallowRef<TRow>();
  const editVisible = ref<boolean>(false);
  /** 合并 fixture、编辑和新增记录，再统一过滤确认删除的编号。 */
  const rows = computed<TRow[]>(() => {
    const sourceIds = new Set(source.value.map(row => row.id));
    return [
      ...source.value.map(row => changes.value.get(row.id) ?? row),
      ...Array.from(changes.value.values()).filter(row => insertedIds.value.has(row.id) && !sourceIds.has(row.id))
    ].filter(row => !removedIds.value.has(row.id));
  });

  /** 导入或编辑只更新本页会话；复制记录后发布新集合，不修改原始 fixture。 */
  function upsertRows(incoming: TRow[]): void {
    const nextChanges = new Map(changes.value);
    const nextRemoved = new Set(removedIds.value);
    const nextInserted = new Set(insertedIds.value);
    const sourceIds = new Set(source.value.map(row => row.id));
    incoming.forEach(row => {
      nextChanges.set(row.id, { ...row });
      nextRemoved.delete(row.id);
      if (!sourceIds.has(row.id)) { nextInserted.add(row.id); }
    });
    changes.value = nextChanges;
    removedIds.value = nextRemoved;
    insertedIds.value = nextInserted;
  }

  /** 编辑草稿与当前行隔离，取消或关闭不会改动表格数据。 */
  function openEdit(row: TRow): void {
    editModel.value = reactive({ ...row }) as TRow;
    editVisible.value = true;
  }

  /** HynDialog 校验通过后提交草稿，再关闭编辑窗口。 */
  function saveEdit(): void {
    if (!editModel.value) {
      throw new Error('Cannot save a documentation row before opening the editor.');
    }
    upsertRows([editModel.value]);
    editVisible.value = false;
    modal.msgSuccess(t('hynDocs.demo.saved'));
  }

  /** 删除必须经用户确认；取消不会更改 fixture 或选择状态。 */
  async function deleteRows(ids: number[]): Promise<boolean> {
    if (ids.length === 0 || !await modal.confirm(t('hynDocs.demo.deleteConfirm', { count: ids.length }))) {
      return false;
    }
    removedIds.value = new Set([...removedIds.value, ...ids]);
    modal.msgSuccess(t('app.common.deleteSuccess'));
    return true;
  }


  return { rows, editModel, editVisible, openEdit, saveEdit, deleteRows, upsertRows };
}
