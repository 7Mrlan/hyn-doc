export interface HynPageResult<T> {
  rows: T[];
  total: number;
}

export type UploadExtraData = Record<string, string | number | boolean | undefined>;

export * from './HynDeptSelect/types';
export * from './HynDialog/types';
export * from './HynEntityPicker/types';
export * from './HynForm/types';
export * from './HynTable/types';
export * from './HynTableDialog/types';
export * from './HynTreeSelect/types';
export * from './HynVirtualTable/types';
export * from './HynVirtualTreeTable/types';