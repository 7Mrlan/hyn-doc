import { computed, ref, watch, type ComputedRef, type WritableComputedRef } from 'vue';
import type { HynFormTreeLinkageField } from '../types';

/**
 * 为 HynForm 树形字段维护可交互的父子联动状态。
 *
 * @remarks
 * 字段只传初始值时由渲染器本地维护；业务需要同步后端关联字段时通过 onLinkageChange 写回表单模型。
 */
export function useTreeSelectLinkage<TModel extends object>(
  field: ComputedRef<HynFormTreeLinkageField<TModel>>,
  model: TModel
): WritableComputedRef<boolean> {
  const localLinkage = ref(field.value.linkage === true);

  watch(
    () => field.value.linkage,
    linkage => {
      localLinkage.value = linkage === true;
    }
  );

  return computed({
    get: () => localLinkage.value,
    set: linkage => {
      if (localLinkage.value === linkage) {
        return;
      }
      localLinkage.value = linkage;
      field.value.onLinkageChange?.(linkage, model);
    }
  });
}
