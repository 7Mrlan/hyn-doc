import type { HynVirtualTableColumn } from '../HynVirtualTable/types';
import type { HynPageResult } from '../types';

/**
 * HYN 实体选择统一主键类型。
 *
 * @remarks
 * 用户、角色、岗位、应用等实体主键在不同接口中可能是数字或字符串。
 */
export type HynEntityKey = string | number;

/**
 * 实体选择对外绑定值。
 *
 * @remarks
 * 单选返回单个 key，多选返回 key 数组；`undefined` / `null` 表示无选择。
 */
export type HynEntityModelValue = HynEntityKey | HynEntityKey[] | undefined | null;

/**
 * 实体分页查询的最小公共参数。
 */
export interface HynEntityPageQuery {
  /** 当前页码，沿用 RuoYi 分页参数。 */
  pageNum?: number;
  /** 每页条数，沿用 RuoYi 分页参数。 */
  pageSize?: number;
}

/**
 * HYN 实体选择数据适配器。
 *
 * @remarks
 * 业务页只提供接口和字段映射，选择器内部负责远程分页、回显、跨页缓存和禁用态。
 */
export interface HynEntityAdapter<TRow, TQuery extends HynEntityPageQuery = HynEntityPageQuery> {
  /** 按查询条件加载一页候选实体。 */
  fetchPage: (query: TQuery) => Promise<HynPageResult<TRow>>;
  /** 按主键批量补齐已选实体回显，必须尽量保持传入 key 的语义。 */
  fetchByKeys: (keys: HynEntityKey[]) => Promise<TRow[]>;
  /** 从实体行读取稳定主键。 */
  getKey: (row: TRow) => HynEntityKey;
  /** 从实体行读取展示标签。 */
  getLabel: (row: TRow) => string;
  /** 判断实体是否不可选择，常用于停用用户、禁用角色或停用岗位。 */
  getDisabled?: (row: TRow) => boolean;
  /** 创建查询初始值，避免组件内部猜业务字段。 */
  createInitialQuery: () => TQuery;
}

/**
 * 实体选择搜索表单字段配置。
 */
export interface HynEntitySearchField<TQuery extends HynEntityPageQuery = HynEntityPageQuery> {
  /** 绑定到查询对象的字段名。 */
  key: Extract<keyof TQuery, string>;
  /** 搜索项标签。 */
  label: string;
  /** 输入框占位提示。 */
  placeholder: string;
}

/**
 * 远程下拉中使用的实体选项。
 */
export interface HynEntityRemoteOption {
  /** 实体主键。 */
  value: HynEntityKey;
  /** 展示标签。 */
  label: string;
  /** 是否禁用选择。 */
  disabled: boolean;
}

/**
 * 实体选择弹窗表格列配置，复用 HynVirtualTable 的列协议。
 */
export type HynEntityPickerColumn<TRow> = HynVirtualTableColumn<TRow>;
