import type { HynFormFieldType } from '../HynForm/types';
import { measureHynTextWidth } from './overflow';

/** 表单双列布局的列间距，参与列数计算和弹窗自然宽度估算，必须与 HYN 表单样式中的 gap 保持一致。 */
export const HYN_FORM_COLUMN_GAP = 16;
/** 常规输入控件的最低可用宽度，用作文本框、数字框等单行控件的布局下限。 */
export const HYN_FORM_REGULAR_CONTROL_MIN_WIDTH = 160;
/** 宽控件的最低可用宽度，用于日期范围、编辑器、上传等天然需要更大操作面的字段。 */
export const HYN_FORM_WIDE_CONTROL_MIN_WIDTH = 320;
/** label 堆叠布局的容器宽度下限，窄于该值时优先保护输入区域而不是强行横排。 */
export const HYN_FORM_STACKED_LABEL_BREAKPOINT = 520;
/** 横向 label 与控件之间的安全余量，避免测量误差或必填标记把控件挤到换行。 */
export const HYN_FORM_INLINE_LABEL_SAFE_GAP = 32;
/** Element Plus label 内部基础留白，测量 label 文本后需要补上这部分真实占位。 */
export const HYN_FORM_LABEL_BASE_INLINE_PADDING = 18;
/** 必填星号的预留宽度，避免必填字段比非必填字段多出的标记影响列数判断。 */
export const HYN_FORM_LABEL_REQUIRED_MARKER_WIDTH = 12;
/** label tooltip 图标的预留宽度，用于让带说明图标的字段参与同一套 label 宽度测量。 */
export const HYN_FORM_LABEL_TOOLTIP_ICON_WIDTH = 20;
/** 单选和复选选项之间的水平间距，弹窗估宽时用它还原真实横排宽度。 */
export const HYN_FORM_CHOICE_OPTION_GAP = 16;
/** 单选和复选指示器加 label 内边距的合计宽度，用于把纯文本测量转换成控件占位。 */
export const HYN_FORM_CHOICE_INDICATOR_LABEL_WIDTH = 22;
/** 选择类控件横排时的保护宽度，避免浏览器字体取整导致最后一个选项贴边。 */
export const HYN_FORM_CHOICE_INLINE_SAFE_WIDTH = 8;
/** 下拉框箭头、清除按钮和左右内边距的合计宽度，估算 select 控件时需叠加到文本宽度上。 */
export const HYN_FORM_SELECT_CHROME_WIDTH = 52;
/** 下拉框文本右侧安全余量，防止选项最长文本刚好贴住选择器 chrome 区域。 */
export const HYN_FORM_SELECT_TEXT_SAFE_WIDTH = 8;

/** HYN 表单列数计算输入，调用方必须传入实际容器宽度和已测量 label 宽度。 */
export interface HynFormColumnLayoutInput {
  /** 调用方期望的最大列数；当前算法只在容器不足时把双列降为单列，不会主动升列。 */
  requestedColumns: 1 | 2;
  /** 表单外层容器的实际像素宽度，来自 DOM 测量，传 0 表示尚未完成布局。 */
  formWidth: number;
  /** 当前语言、必填标记和 tooltip 图标共同决定的 label 实际占位宽度。 */
  labelWidth: number;
  /** 当前字段集合所需的控件最低宽度，用来保护输入区不被双列布局压缩到不可用。 */
  controlMinWidth: number;
}

/** HYN 表单 label 位置计算输入，用于判断是否需要从横向 label 切换到顶部 label。 */
export interface HynFormLabelPositionInput {
  /** 表单外层容器的实际像素宽度，值为 0 时保持横向 label，避免首帧误判为堆叠。 */
  formWidth: number;
  /** 当前可见字段中最大的 label 占位宽度，已包含必填和提示图标的安全宽度。 */
  labelWidth: number;
  /** 当前字段类型对应的最低控件宽度，用于判断横向 label 是否仍有足够输入空间。 */
  controlMinWidth: number;
}

/** HYN 弹窗自然宽度计算输入，选择类字段必须传入当前语言下的真实展示文本。 */
export interface HynFormFieldControlMinWidthInput {
  /** HYN 表单字段类型；宽度策略按控件交互形态区分，而不是按业务字段名猜测。 */
  fieldType: HynFormFieldType;
  /** 当前语言下会展示在控件里的候选文案，主要用于 select、radio 和 checkbox 的自然宽度估算。 */
  optionLabels: string[];
  /** 实际渲染字体串，文本测量必须和页面字体一致，否则中英文切换后宽度会漂移。 */
  measureFont: string;
}

/** HYN 单选/复选控件宽度计算输入，用于让选项文本参与弹窗自然宽度决策。 */
interface HynFormChoiceControlMinWidthInput {
  /** 仅限 radio/checkbox，选择类控件需要按选项文本重新估算控件宽度。 */
  fieldType: 'radio' | 'checkbox';
  /** 当前语言下的选项展示文本，用来估算横排或多行展示的自然宽度。 */
  optionLabels: string[];
  /** 与页面一致的字体串，保证 choice 宽度估算和真实渲染接近。 */
  measureFont: string;
}

/** 需要宽输入区域的字段类型集合，避免复杂控件被普通输入框宽度压缩。 */
const wideControlFieldTypes = new Set<HynFormFieldType>([
  'dateRange',
  'cron',
  'editor',
  'textarea',
  'imageUpload',
  'fileUpload',
  'filePicker'
]);

/** 根据字段类型返回表单控件的最小可用宽度，用于弹窗估宽和表单列数计算。 */
export function getHynFormControlMinWidth(fieldType: HynFormFieldType): number {
  return wideControlFieldTypes.has(fieldType) ? HYN_FORM_WIDE_CONTROL_MIN_WIDTH : HYN_FORM_REGULAR_CONTROL_MIN_WIDTH;
}

/** 根据字段类型和真实展示文本返回弹窗期望控件宽度，避免选择类字段被普通输入框宽度错误挤压。 */
export function getHynFormFieldControlMinWidth(input: HynFormFieldControlMinWidthInput): number {
  const baseWidth = getHynFormControlMinWidth(input.fieldType);
  if (input.fieldType === 'select') {
    return Math.max(baseWidth, getHynFormSelectControlMinWidth(input.optionLabels, input.measureFont));
  }
  if (input.fieldType !== 'radio' && input.fieldType !== 'checkbox') {
    return baseWidth;
  }
  return Math.max(
    baseWidth,
    getHynFormChoiceControlMinWidth({
      fieldType: input.fieldType,
      optionLabels: input.optionLabels,
      measureFont: input.measureFont
    })
  );
}

/** 计算下拉选择器完整展示当前语言 placeholder、选项和已选值所需的期望宽度。 */
function getHynFormSelectControlMinWidth(optionLabels: string[], measureFont: string): number {
  if (optionLabels.length === 0) {
    return HYN_FORM_REGULAR_CONTROL_MIN_WIDTH;
  }
  // select 的真实占位等于最长文案加上下拉箭头、清除按钮和输入框内边距。
  const maxTextWidth = optionLabels.reduce((maxWidth, label) => {
    return Math.max(maxWidth, measureHynTextWidth(label, measureFont));
  }, 0);
  return Math.ceil(maxTextWidth + HYN_FORM_SELECT_CHROME_WIDTH + HYN_FORM_SELECT_TEXT_SAFE_WIDTH);
}

/** 计算 choice 字段在优先横排时需要的宽度；复选允许多行，因此只把常用行宽作为目标宽度。 */
function getHynFormChoiceControlMinWidth(input: HynFormChoiceControlMinWidthInput): number {
  if (input.optionLabels.length === 0) {
    return HYN_FORM_REGULAR_CONTROL_MIN_WIDTH;
  }

  // radio 需要尽量单行展示；checkbox 允许换行，因此同时计算最宽单项和完整横排宽度。
  const optionWidths = input.optionLabels.map(
    label => measureHynTextWidth(label, input.measureFont) + HYN_FORM_CHOICE_INDICATOR_LABEL_WIDTH
  );
  const widestOptionWidth = optionWidths.reduce((maxWidth, width) => Math.max(maxWidth, width), 0);
  const inlineWidth =
    optionWidths.reduce((totalWidth, width) => totalWidth + width, 0) +
    Math.max(0, optionWidths.length - 1) * HYN_FORM_CHOICE_OPTION_GAP +
    HYN_FORM_CHOICE_INLINE_SAFE_WIDTH;

  if (input.fieldType === 'radio') {
    return Math.ceil(inlineWidth);
  }
  return Math.ceil(Math.max(widestOptionWidth, Math.min(inlineWidth, HYN_FORM_WIDE_CONTROL_MIN_WIDTH)));
}

/** 计算 HYN 表单在当前容器宽度下应使用的列数，桌面优先保持双列。 */
export function resolveHynFormColumnCount(input: HynFormColumnLayoutInput): 1 | 2 {
  if (input.requestedColumns === 1) {
    return 1;
  }
  if (input.formWidth <= 0) {
    return input.requestedColumns;
  }
  const columnWidth = (input.formWidth - HYN_FORM_COLUMN_GAP) / 2;
  return columnWidth - input.labelWidth >= input.controlMinWidth ? 2 : 1;
}

/** 计算 HYN 表单 label 是否需要切到顶部，仅在容器确实窄到无法横向排布时堆叠。 */
export function resolveHynFormLabelPosition(input: HynFormLabelPositionInput): 'right' | 'top' {
  if (input.formWidth <= 0) {
    return 'right';
  }
  const inlineMinWidth = Math.max(
    HYN_FORM_STACKED_LABEL_BREAKPOINT,
    input.labelWidth + input.controlMinWidth + HYN_FORM_INLINE_LABEL_SAFE_GAP
  );
  return input.formWidth < inlineMinWidth ? 'top' : 'right';
}
