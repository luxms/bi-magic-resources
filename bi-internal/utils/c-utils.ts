export interface IPkFontMetrics {
    fontStyle?: string;
    fontVariant?: string;
    fontWeight?: string;
    fontStretch?: string;
    fontSize?: number | string;
    lineHeight?: number | string;
    fontFamily?: string;
}

/**
 * @param ctx - canvas
 * @param {IPkFontMetrics} fontMetrics - набор ключей для шрифта
 * @description устанавливает шрифт в canvas э-т
 */
export declare function setFont(ctx: CanvasRenderingContext2D, fontMetrics?: IPkFontMetrics);

/**
 * @param {string} text - строка текста
 * @param {IPkFontMetrics} fontMetrics - набор ключей для шрифта
 * @description создает эл-т canvas, и считает его длину в px
 */
export declare function getTextWidth(text: string, fontMetrics?: IPkFontMetrics): number

interface TextMetricsExtend extends TextMetrics {
    height: number;
}

/**
 * @param {string} text - строка текста
 * @param {IPkFontMetrics} fontMetrics - набор ключей для шрифта
 * @description создает эл-т canvas, и считает его длину и ширину в px
 */
export declare function getTextSize(text: string, fontMetrics?: IPkFontMetrics): TextMetricsExtend

/**
 * @param {string} text - строка текста
 * @param {IPkFontMetrics} fontMetrics - набор ключей для шрифта
 * @param  viewBox
 * @description создает эл-т svg, и считает его длину и ширину x,y в px
 */
export declare function getSvgTextSize(text: string, fontMetrics?: IPkFontMetrics, viewBox?: {x: number, y: number, width: number, height: number}): DOMRect

/**
 * @param {any} val
 * @description React hook для сравнения state
 */
export declare function useCompare(value: any): boolean

/**
 * @param axisTitle
 * @param axisLongestLabel
 * @param whatMeasure
 * @param styleAxisTitle
 * @param styleAxisLabel
 * @description Вспомогательная функция для echarts.Рассчитываю расстояние отступа слева,чтобы влезли и название оси и лейблы значений
 */
export declare function getAxisGap (axisTitle: string, axisLongestLabel: string, whatMeasure?: string, styleAxisTitle?: IPkFontMetrics, styleAxisLabel?: IPkFontMetrics)