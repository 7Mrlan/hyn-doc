/**
 * HYN 文本溢出展示策略。
 *
 * @remarks
 * `fit` 优先完整单行展示并通过组件宽度计算争取空间；`ellipsis` 只在调用方明确要求时省略并配套 tooltip；
 * `wrap` 允许文本自然换行。
 */
export type HynTextOverflowMode = 'fit' | 'ellipsis' | 'wrap';

/** 复用单个 canvas 2D context 做文本测量，避免表格列宽计算时频繁创建离屏 canvas。 */
let measureContext: CanvasRenderingContext2D | undefined;

/**
 * 解析 HYN 文本溢出策略，未声明时继承组件级策略。
 */
export function resolveHynTextOverflowMode(
  localMode: HynTextOverflowMode | undefined,
  inheritedMode: HynTextOverflowMode
): HynTextOverflowMode {
  return localMode ?? inheritedMode;
}

/**
 * 把数字、px 和百分比尺寸转换为像素，供列宽和弹窗宽度计算使用。
 *
 * @remarks
 * 无法稳定换算的 CSS 表达式返回 `undefined`，调用方应保留原始 CSS 表达式。
 */
export function parseHynCssSizeToPixels(value: string | number | undefined, containerWidth: number): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  const size = value.trim();
  const pixelMatch = size.match(/^(\d+(?:\.\d+)?)px$/);
  if (pixelMatch) {
    return Number(pixelMatch[1]);
  }
  const percentMatch = size.match(/^(\d+(?:\.\d+)?)%$/);
  if (percentMatch && containerWidth > 0) {
    return (Number(percentMatch[1]) / 100) * containerWidth;
  }
  const numericValue = Number(size);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}

/**
 * 读取元素当前字体声明，用于 canvas 按真实字体测量文本宽度。
 */
export function resolveHynMeasureFont(element: HTMLElement, forcedWeight: string | undefined): string {
  const style = window.getComputedStyle(element);
  return `${style.fontStyle} ${style.fontVariant} ${forcedWeight ?? style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
}

/**
 * 使用浏览器 canvas 按指定字体测量文本宽度。
 *
 * @throws 浏览器无法创建 canvas 2D context 时抛出错误，避免静默使用不可信宽度。
 */
export function measureHynTextWidth(text: string, font: string): number {
  if (text.length === 0) {
    return 0;
  }
  if (!measureContext) {
    const context = document.createElement('canvas').getContext('2d');
    if (!context) {
      throw new Error('HYN text measurement requires a canvas 2D context.');
    }
    // 创建失败必须显式报错，静默返回 0 会让表格/弹窗宽度在客户浏览器里错误收缩。
    measureContext = context;
  }
  measureContext.font = font;
  return Math.ceil(measureContext.measureText(text).width);
}
