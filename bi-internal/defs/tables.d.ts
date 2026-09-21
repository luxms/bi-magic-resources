import { IMetric, IRawColor, IValue } from './common';
interface IDataEntry {
    key?: string;
    loc_id: string | number;
    metric_id?: string | number;
    period_id: string;
    value?: IValue;
    val?: IValue;
    [id: string]: string | number;
}
export interface ILegendItem {
    color?: IRawColor | {
        lights?: IStopLight;
    };
    lineColor?: IRawColor;
    lineWidth?: number;
    bgColor?: IRawColor;
    title?: string;
    options?: string[];
    is_hidden?: boolean;
    widgetType?: string;
    vizelType?: string;
    strokeStyle?: string;
    stack?: string;
    onClickDataPoint?: string;
    display?: IRawVizelConfigDisplay;
    format?: string;
    formatPercent?: string;
    formatTitle?: string;
    srt?: number;
    stoplight?: IVizelConfigDisplayStoplight;
    formula?: string | number;
    tooltip?: string | any;
    markerSize?: number;
    borderRadius?: number;
    marker?: any;
    itemStyle?: any;
    label?: ILegendItemLabel;
    emphasis?: any;
    markPoint?: any;
    markLine?: any;
    markArea?: any;
    areaStyle?: any;
    width?: number;
    height?: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    visible?: boolean;
    headerStyle?: ILegendItem;
    footerStyle?: any;
    echarts?: any;
    value?: ILegendItemValue;
    size?: number;
}
interface ILegendItemValue {
    visible?: boolean;
    content?: string;
}
interface ILegendItemLabel {
    visible?: boolean;
    textStyle?: {
        fontFamily?: string;
        fontSize?: number;
        fontWeight?: string;
        color?: string;
        align?: string;
    };
    backgroundStyle?: {
        backgroundColor?: string;
        padding?: number;
    };
    cornerStyle?: {
        borderRadius?: number;
    };
    borderStyle?: {
        borderColor?: string;
        borderType?: string;
        borderWidth?: number;
    };
    formatter?: string;
    position?: string | [number, number];
    rotate?: number;
    distance?: number;
}
export interface IStopLight {
    name?: string;
    title?: string;
    limit: [number, number];
    color?: IRawColor;
    bgColor?: IRawColor;
    leftClosed?: boolean;
    rightClosed?: boolean;
}
interface IStopPoint {
    name?: string;
    value: number;
    color?: IRawColor;
    bgColor?: string | number | number[];
    width?: number;
    style?: 'dotted' | 'dashed';
    borderType?: 'dotted' | 'dashed' | 'solid';
    zIndex?: number;
    label?: {
        show?: boolean;
        color?: string;
        backgroundColor?: string;
        padding?: number;
        borderRadius?: number;
        position?: 'start' | 'center' | 'end';
        distance?: number;
        formatter?: any;
        fontStyle?: string;
        fontWeight?: string;
        fontSize?: number;
        lineHeight?: number;
        borderColor?: string;
        borderWidth?: number;
    };
}
interface IVizelConfigDisplayStoplight {
    lights?: IStopLight[];
    points?: IStopPoint[];
}
interface IVizelConfigAxis {
    title?: string;
    width?: number;
}
export interface IRawVizelConfigDisplay {
    gap?: string;
    gradient?: string;
    group?: any;
    limit?: number;
    offset?: number;
    range?: [number | string, number | string];
    sort?: string;
    sortBy?: string;
    filterBy?: string | any[];
    filterValue?: IValue;
    stackGroups?: (string | number)[][];
    /**
     * @deprecated
     */
    stoplight?: IVizelConfigDisplayStoplight;
    vAxis?: IVizelConfigAxis;
    xAxis?: IVizelConfigAxis;
    format?: string;
    color?: string;
    bgColor?: string;
    topBar?: any;
    common?: any;
    /**
     * @deprecated
     * @description Используйте display.topBar.headerStyle
     */
    headerStyle?: any;
    /**
     * @deprecated
     * @description Используйте display.topBar.descriptionStyle
     */
    descriptionStyle?: any;
    tooltip?: any;
    maxCircleRadius?: number;
    stripes?: any;
    rotateXLabel?: number;
    rotateYLabel?: number;
    xAxisLabelLimit?: number;
    yAxisLabelLimit?: number;
    vAxisTicks?: number[];
    fontSize?: string;
    colorPositive?: string;
    colorNegative?: string;
    colorSubtotal?: string;
    indicator?: string | any[];
    orient?: string;
    align?: string;
    legend?: any;
    totalLabel?: any;
}
export interface IDataSourceStyle {
    dimensions?: {
        [id: string]: ILegendItem;
    };
    metrics?: {
        [id: string]: ILegendItem;
    };
    locations?: {
        [id: string]: ILegendItem;
    };
    periods?: {
        [id: string]: ILegendItem;
    };
    measures?: {
        [id: string]: any;
    };
    [axisId: string]: {
        [id: string]: ILegendItem | boolean;
    };
}
export interface IDataSource {
    lookupId?: string | number;
    parameters?: string[];
    metrics?: string[];
    locations?: string[];
    periods?: string[] | {
        start?: string;
        end?: string;
        type?: number;
        qty?: number;
    };
    periodType?: string;
    zAxis?: string;
    yAxis?: string;
    y2Axis?: string;
    xAxis?: string;
    style?: IDataSourceStyle;
    dataset?: string;
    koob?: string;
    sortBy?: string;
    subtotals?: string;
    having?: string;
    /**
     * @deprecated используем limitX & limitY & limitZ, не удалять как ключ.
     */
    limit?: number;
    limitX?: number;
    limitY?: number;
    limitZ?: number;
    /**
     * @deprecated используем offsetX & offsetY & offsetZ, не удалять как ключ.
     */
    offset?: number;
    offsetX?: number;
    offsetY?: number;
    offsetZ?: number;
    dimensions?: string[];
    measures?: string[];
    filters?: any;
    innerFilters?: {
        [id: string]: string[];
    };
    /**
     * @deprecated
     */
    innerMeasures?: string[];
    hierarchy?: string[];
    groupColumns?: any;
    xAxes?: string[];
    yAxes?: string[];
    zAxes?: string[];
    koobes?: string[];
}
export interface IConfigFrame {
    x: number;
    y: number;
    w: number;
    h: number;
    i?: number;
    a?: number;
    cfg?: any;
}
interface IRawVizelConfig {
    view_class: string;
    id?: number | string;
    /**
     * @deprecated это поле искусственное
     */
    dashId?: any;
    /**
     * @deprecated это поле искусственное
     */
    dashboardId?: any;
    title?: string;
    description?: string;
    subtitle?: string;
    legend?: {
        [id: string]: ILegendItem;
    };
    lookupId?: number;
    display?: IRawVizelConfigDisplay;
    dataSource?: IDataSource;
    options?: string[];
    saveAbilities?: string[];
    colorPalette?: string[];
    stoplight?: IVizelConfigDisplayStoplight;
    /**
     * @deprecated
     * @description используй миграцию для удаления
     */
    chartStyle?: string;
    context?: any;
    isHidden?: boolean;
    overall?: (string | {
        title: string;
        formula: string;
    })[];
    style?: IDataSourceStyle;
    displayIf?: string;
    stateColor?: string;
    forecast?: any;
    dataDisplay?: any;
    geo?: {
        minZoom?: number;
        maxZoom?: number;
    };
    normsMainColor?: string;
    badValueColor?: string;
    goodValueColor?: string;
    cardId?: string;
    externalUrl?: any;
    titleContext?: string[];
    url?: string;
    disabled?: any;
    visible?: any;
    bgColor?: string;
    bgImage?: string;
    onClick?: string | any;
    onClickDataPoint?: string | any;
    onChangeTab?: string | any;
    htmlText?: string;
    echart?: any;
    groupColumns?: string[];
    readonly report?: {
        title: string;
        output: string;
        template: string;
        paginateByDimension?: Record<string, string>;
        fillOutMode?: 'MERGE' | 'FILL';
    }[];
    activeTab?: string | number;
    /**
     * @deprecated
     */
    children?: IRawVizelConfig[];
    vars?: string[];
}
interface IDashConfig extends IRawVizelConfig {
    topBar?: object;
    frame?: IConfigFrame | string;
}
interface INormDataEntry extends IDataEntry {
    norm_id: string | number;
}
interface INormDataEntry3 {
    metric_id: number;
    loc_id: number;
    period_id: number;
    norm_id: number;
    val: number[];
    normMetric?: IMetric;
}
interface IConfigItem {
    cfg_key: string;
    cfg_val: string;
}
interface ILocationCardField {
    config?: any;
    card_id: number;
    id: number;
    srt: number;
    text_id: string;
    title: string;
    metric_id: number;
}
interface ILocationCard {
    css_file: string;
    id: number;
    level: number;
    loc_id: number;
    parent_id: number;
    title: string;
    fields: ILocationCardField[];
}
interface IDashboardTopic {
    config: any;
    created: string;
    icon_id: number;
    id: number;
    parent_id: number | null;
    srt: number;
    title: string;
    tree_level: number;
    updated: string;
}
interface IDashletsItem {
    config: IDashConfig;
    dashboard_id: number;
    description?: string;
    idx: number;
    layout: string;
    length: string;
    parent_id: number;
    title: string;
    updated: string;
    view_class: string;
    view_id?: number;
    id: number;
}
interface IDashboardsItem {
    config: any;
    icon_id: number;
    id: number;
    srt: number;
    title: string;
    topic_id: number;
    updated: string;
}
interface IUnitsItem {
    axis_title: string;
    config: any;
    created: string;
    divider_id: any;
    id: number;
    scale: number;
    scale_op: string;
    tiny_title: string;
    title: string;
    unit: any;
    updated: string;
    value_prefix: string;
    value_suffix: string;
}
interface ILocationArea {
    id: number;
    sid?: number;
    loc_id: number;
    name: string;
    WKT?: string;
    wkt: string;
}
interface ILocationConfig {
    tags?: string[];
    color?: string;
    bgColor?: string;
    title?: string;
}
interface ILocationsItem {
    id: number;
    config: ILocationConfig;
    is_hidden: number;
    is_point: number;
    latitude: number;
    longitude: number;
    tree_level: number;
    loc_id?: number;
    parent_id: number;
    srt: number;
    src_id: string;
    title: string;
    created: string;
    updated: string;
    tags: any;
}
interface IMetricsItem {
    is_norm: number;
    alt_id?: string;
    config: any;
    dim_id?: number;
    unit_id: number;
    id: string | number;
    is_hidden: number;
    is_text_val: number;
    tree_level: number;
    parent_id: string | number;
    title: string;
    srt?: number;
    tags: any;
}
interface IPresetsItem {
    can_be_pie: number;
    created: string;
    metrics: number[];
    preset_id?: number;
    title: string;
    updated: string;
    id: number;
}
interface IPeriodsItem {
    id: string;
    config: any;
    period_id?: string;
    period_type: number | string;
    qty: number | string;
    start: string;
    start_time?: string;
    title: string;
    tags?: any;
}
interface IBookmark {
    config: any;
    context: any;
    created: string;
    dataset_guid: number;
    dataset_id: number;
    description: string;
    full_url: string;
    id: number;
    srt: number;
    tiny_url: string;
    title: string;
    topic_id: number;
    updated: string;
    user_id: number;
}
interface IMetricSetItem {
    id: number;
    title: string;
}
interface IPeriodType {
    id: number;
    title: string;
}
export { IDataEntry, IStopPoint, IVizelConfigDisplayStoplight, IVizelConfigAxis, IRawVizelConfig, IDashConfig, INormDataEntry, INormDataEntry3, IConfigItem, ILocationCardField, ILocationCard, IDashboardTopic, IDashletsItem, IDashboardsItem, IUnitsItem, ILocationArea, ILocationConfig, ILocationsItem, IMetricsItem, IPresetsItem, IPeriodsItem, IBookmark, IMetricSetItem, IPeriodType, };
