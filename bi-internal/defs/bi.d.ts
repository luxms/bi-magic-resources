
interface moment{
    [id: string]: any
}


type IRawColor = string | number | number[] | null | undefined;

type IRawColorPair = {
    color?: IRawColor;
    bgColor?: IRawColor;
} | [string, string] | string;

declare type IRange = [number, number];


interface IDisposable {
    dispose();
}


interface IEntity {
    id: number | string;
    title: string;
    ids?: Array<string | number>;
    readonly titles?: string[];
    readonly axisId?: string;
    readonly axisIds?: string[];
    readonly formula?: string[];
    readonly children?: IEntity[];
    readonly parent?: IEntity;
    readonly description?: string;
    config?: any;
    unit?: any;
    color?: string;
}


interface ITaggedEntity {
    rawTags: string[];

    addTag(tag: ITag): this;

    getTags(): ITag[];

    getTag(id: string | number): ITag;

    getTagByGroupId(tagGroupId: string): ITag;
}


interface ITreeNode<T> {
    children: T[];
    parent: T;
    root: T;

    getChildren(): T[];

    getDescendants(): T[];

    getParent(): T;
}


interface ITag extends ITreeNode<ITag> {
    id: number | string;
    title: string;
    axisId: string;

    addChild(tag: ITag): ITag;

    getChildById(id: string): ITag;
}


interface IPeriod extends IEntity, ITaggedEntity /*, ITreeNode<IPeriod> */
{
    id: string;
    title: string;
    color: string;

    config: any;
    period_id: string;
    period_type: number;
    start: string;

    startDate: moment.Moment;           // moment.js
    middleDate: moment.Moment;
    endDate: moment.Moment;             // moment.js
    orderBy: Date;
    date: Date;
    children: IPeriod[];
    parent: IPeriod;

    root: IPeriod;
    axisId: string;

    year: number;
    quarter: number;                                                                                  // 1..4
    month: number;                                                                                    // 1..12
    week: number;                                                                                     // 1..
    day: number;                                                                                     // 1..

    getTagByGroupId(tagGroupName: string): any;

    getTags(): any[];

    addTag(tag: any): this;

    getParent(): IPeriod;

    update(p: tables.IPeriodsItem);

    valueOf(): number;
}


interface IPeriodType {
    id: number;
    pt_id?: number;   // deprecated
    title: string;
}


interface ILocationArea {
    id: string;
    sid?: number;            // deprecated in 3.0
    loc_id: number;
    name: string;
    WKT?: string;            // deprecated in 3.0
    wkt: string;

    // additional
    geoJSON: any;
    lid: string;              // location id
}

type ISpatial = ILocationArea;


interface ILocation extends IEntity, ITaggedEntity /*, ITreeNode<ILocation>*/
{
    config: any;
    is_hidden: number;
    is_point: number;
    latitude: number;
    longitude: number;
    tree_level: number;
    loc_id: number;
    parent_id: string;
    title: string;
    srt?: number;
    src_id: string;

    // additional
    spatials: ISpatial[];
    children: ILocation[];
    parent: ILocation;
    card: ILocationCard;
    id: string;

    // TODO: move to global namespace
    getAltTitle(titleType: string): string;

    is_formula?: boolean;
    is_aggregator?: boolean;
}

declare type ILction = ILocation;

interface ILocationCardField {
    config?: any;
    card_id: number;
    id: string;
    srt: number;
    text_id: string;
    title: string;
    metric_id: number;

    // added
    metric: IMetric;
    cardId: string;
}


interface ILocationCard {
    css_file: string;
    level: number; // TODO: array
    loc_id: number; // TODO: array
    parent_id: number; // TODO: array
    title: string;
    config: any;

    // additional
    fields: ILocationCardField[];
    id: string;
}


interface IUnit extends IEntity {
    id: number;
    config: any;
    unit_id: number;
    title: string;
    axis_title: string;
    tiny_title: string;
    value_prefix: string;
    value_suffix: string;

    isInteger(): boolean;
}


interface IMetric extends IEntity, ITaggedEntity /*, ITreeNode<IMetric>*/
{
    id: string;
    parent_id: string;
    unit_id: number;
    srt: number;
    tree_level: number;
    title: string;
    is_text_val: number; // 0|1
    config: any;
    is_hidden: number;
    // additional
    parent: IMetric;
    unit: IUnit;
    children: IMetric[];
    is_formula?: boolean;
}


interface IPreset {
    id: string;
    preset_id: number;
    title: string;
    can_be_pie: number;

    // additional
    parameters: IMetric[];
    metrics: IMetric[];

    getDimensions(): IUnit[];
}


interface IMLPSubspace {
    ms: IMetric[];
    ls: ILocation[];
    ps: IPeriod[];
}


interface IKoobDimension {
    id: string;
    axisId?: string;
    formula?: string;
    source_ident?: string;
    cube_name?: string;
    name?: string;
    title: string;
    type: string | 'STRING';
    values?: any[];
    members?: any;
    config?: any;
    min?: number;
    max?: number;
    sql: string;
    key?: string;
    subtotal?: boolean;  // table
    upSubtotal?: boolean;  // table delete
    count?: number;
}

export interface IKoobMeasure {
    id: string;                                                                                       // id для measure, например, x
    formula: string;                                                                                  // формула, например, sum(x) или count(z):x
    axisId?: string;
    source_ident?: string;
    cube_name?: string;
    name?: string;
    title: string;
    format?: string;
    members?: any;
    type: string | 'SUM';                                                                             // SUM, COUNT, AVG, FN
    min?: number;
    max?: number;
    sql: string;
    key?: string;
    config?: any;
    unit?: any;
}


interface IKoobSubspace {
    koob: string;
    xAxis: string;
    yAxis: string;
    xs: any[];
    ys: any[];
    zs: any[];
    allDimensions: IKoobDimension[];
    allMeasures: IKoobMeasure[];
    dimensions: IKoobDimension[];
    measures: IKoobMeasure[];
    filters: { [id: string]: string[] };
    arity?: number;
    pivotData: any;

    reduce(nx: number, ny: number, nz: number): IKoobSubspace;

    isEmpty: () => boolean;
}


interface IAggregate {
    avgval: number;
    maxval: number;
    minval: number;
}


type IValue = number | string;


interface IOptionsProvider {
    getOption(optionId: string, defaultValue?: boolean): boolean | undefined;     // undefined if default not set
    hasOption(optionId: string): boolean;                                         // true or false
    getOptionCount(optionId: string): number;

    setOption(optionId: string, value: boolean): void;                            // deprecated
    // TODO: return new options object
    addOption(optionId: string): boolean;

    removeOption(optionId: string): boolean;                                      // true, if found option
}


interface IStopPoint {
    value: number;
    color: string;
    bgColor: string;
    width: number;
    style: string;
    zIndex: number;
}

interface IStoplight {
    limit?: [number, number];
    name?: string;
    color: string | null;
    bgColor: string | null;
    colorPair: IColorPair;

    hasValue(v: IValue): boolean;

    getColor(e: IEntity, v?: IValue): string;

    getBgColor(e: IEntity, v?: IValue): string;

    getColorPair(e: IEntity, v?: IValue): IColorPair;
}


interface IStoplights extends IColorResolver {
    getStoplight(v: IValue): IStoplight;

    forEach(fn: (s: IStoplight) => void): void;

    forEachPoint(fn: (s: IStopPoint) => void): void;

    map<U>(callbackfn: (value: IStoplight, index: number, array: IStoplight[]) => U, thisArg?: any): U[];
}


interface IStoplightsProvider {
    getStoplight(v: number, vizelType?: string): IStoplight;

    getStoplights(vizelType?: string): IStoplights;
}


interface IVizelConfigDisplay extends IStoplightsProvider {
    xAxisTickTitleRotationAngle?: number;
    color?: string;                         // for text/list vizel
    bgColor?: string;
    backgroundShape?: string;
    cmpTitle?: string;
    gradient?: string;
    readonly group: any;
    title?: string;
    format?: string;
    filter?: string;
    filterBy?: string | any[];
    widths?: any[];
    excludeY?: string[];
    excludeX?: string[];
    plotOptions?: any;                                                                                // additional options for chart

    customValue?: string;
    maxFontSize?: string;
    minFontSize?: string;
    horizontalAlign?: string;
    verticalAlign?: string;
    fontFamily?: string;
    fontSize?: number;
    xAxisLabelLimit?: number; // лимит знаков, в разметки оси x
    yAxisLabelLimit?: number; // лимит знаков, в разметки оси y
    geo?: {
        zoom?: number;
        lat?: number;
        lng?: number;
    };
    rotateXLabel?: number;
    rotateYLabel?: number;

    hasRange(): boolean;

    getRange(): IRange;

    disableRange(): void;

    getLimit(): number;

    getSort(): string;          // 'asc', 'desc', null

    getSortBy(): string;        // id of IEntity to sort

    setSort(v: string): void;

    getVAxisWidth(): number;

    getGradient(): string;

    getStackGroupIndex(e: IEntity): number;
}


declare module tables {

    export interface IDataEntry {                 // table: data
        key?: string;               // deprecated
        loc_id: string | number;
        metric_id?: string | number;
        period_id: string;
        value?: IValue;             // deprecated
        val?: IValue;

        [id: string]: string | number;
    }

    export interface ILegendItem {
        color?: IRawColor;
        lineColor?: IRawColor;
        lineWidth?: number;
        bgColor?: IRawColor;
        title?: string;
        options?: string[];
        widgetType?: string;
        vizelType?: string;
        strokeStyle?: string;
        stack?: string;
        onClickDataPoint?: string;
        display?: tables.IVizelConfigDisplay;
        format?: string;
        formatPercent: string; // pie percent
        srt?: number;
        stoplight?: IVizelConfigDisplayStoplight;
        formula?: string | number;
        tooltip?: string | any;                                                                         // Формат или конфиг визеля
        markerSize?: number;
        // colorFormula?: string;
        borderRadius?: number;
        marker?: any;
        itemStyle?: any;
        label?: any;
        emphasis?: any;
        markPoint?: any;
        markLine?: any;
        markArea?: any;
        areaStyle?: any;
        minWidth?: number;
        minHeight?: number;
        visible?: boolean;
    }

    export interface IStopLight {
        name?: string;
        title?: string;
        limit: [number, number];               // [number, number] | {min?: number, max?:number} | number
        color?: IRawColor;
        bgColor?: IRawColor;
        leftClosed?: boolean;                   // maybe move to range?
        rightClosed?: boolean;
    }

    export interface IStopPoint {
        name?: string;
        value: IValue;
        color?: IRawColor;
        bgColor?: string | number | number[];
        width?: number;
        style?: 'dotted' | 'dashed';
        zIndex?: number;
    }

    export interface IVizelConfigDisplayStoplight {
        lights?: IStopLight[];
        points?: IStopPoint[];
    }

    export interface IVizelConfigAxis {
        title?: string;
        width?: number;
    }

    export interface IVizelConfigDisplay {
        gap?: string;                                                                                   // для board - расстояние между children
        gradient?: string;
        group?: any;
        limit?: number;
        offset?: number;
        range?: [number | string, number | string];        // может lpe
        sort?: string;
        sortBy?: string;
        filterBy?: string | any[];
        filterValue?: IValue;
        stackGroups?: (string | number)[][];
        stoplight?: IVizelConfigDisplayStoplight;
        vAxis?: IVizelConfigAxis;
        xAxis?: IVizelConfigAxis;
        // colorFormula?: string;
        color?: string;
        headerStyle?: any;
        tooltip?: string;
    }

    export interface IDataSourceStyle {
        dimensions?: { [id: string]: ILegendItem };
        metrics?: { [id: string]: ILegendItem };
        locations?: { [id: string]: ILegendItem };
        periods?: { [id: string]: ILegendItem };
        measures?: { [id: string]: any };

        // ... any other axis
        [axisId: string]: { [id: string]: ILegendItem };
    }

    export interface IDataSource {
        parameters?: string[];
        metrics?: string[];
        locations?: string[];
        periods?: string[] | { start?: string; end?: string; type?: number; qty?: number };
        periodType?: string;
        zAxis?: string;   // 'locations', 'parameters', 'periods', 'metrics'
        yAxis?: string;
        xAxis?: string;
        style?: IDataSourceStyle;
        dataset?: string;
        koob?: string;
        sortBy?: string; // '+age;-dt'
        subtotals?: string; // age;dt
        limit?: number;
        lookupId?: string | number;
        dimensions?: string[];
        measures?: string[];
        filters?: any;
        innerFilters?: { [id: string]: string[] }; //  временный или нет, внутренний  фильтр для pivot
        innerMeasures?: string[];                    //  временный или нет, внутренний  фильтр для pivot x2
        hierarchy?: string[];                      // todo убрать, когда будет иерархия для кубов
        groupColumns?: any;
        xAxes?: string[];
        yAxes?: string[];
    }

    interface IConfigFrame {
        x: number;
        y: number;
        w: number;
        h: number;
        i?: number;
        cfg?: any;
    }

    interface IRawVizelConfig {
        view_class?: string;        // additional field, used to skip DashConfig in bookmarks
        title?: string;             // additional field, used to skip DashConfig in bookmarks
        // vizelType?: string;         // additional field, used to skip DashConfig in bookmarks
        description?: string;
        legend?: { [id: string]: ILegendItem };
        display?: IVizelConfigDisplay;
        dataSource?: IDataSource;
        options?: string[];
        saveAbilities?: string[];   // used in koob-table-simple
        colorPalette?: string[];     // used in pie && bublik
        chartStyle?: string;        // deprecated
        context?: any;              // used in external vizel
        isHidden?: boolean;
        overall?: (string | { title: string, formula: string })[];
        style?: IDataSourceStyle;
        displayIf?: string;                                                                             // lpe expression
        stateColor?: string;                                                                            // Общий цвет визеля

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

        header?: {
            style?: any;
        };

        onClick?: string | any;
        onClickDataPoint?: string | any;
        htmlText?: string;
        echart?: any; // hack  позволяющий переписывать конфиг графика из конфига
        groupColumns?: string[]; // группировка для koob-table-simple
        report?: { title: string, output: string, template: string };
    }

    export interface IDashConfig extends IRawVizelConfig {
        topBar?: object;
        frame?: IConfigFrame;
    }

    export interface INormDataEntry extends IDataEntry {
        norm_id: string | number;

        // Hacky property
        // will be set while postprocessing norm data
        // and is using into NormManager
        // TODO: rethink process of populating norm response with corresponding metrics
        normMetric?: IMetric;
    }

    export interface INormDataEntry3 {
        metric_id: number;
        loc_id: number;
        period_id: number;
        norm_id: number;
        val: number[];

        // Hacky property
        // will be set while postprocessing norm data
        // and is using into NormManager
        // TODO: rethink process of populating norm response with corresponding metrics
        normMetric?: IMetric;
    }

    export interface IConfigItem {                // table: config
        cfg_key: string;
        cfg_val: string;
    }

    export interface ILocationCardField {
        config?: any;
        card_id: number;
        id: number;
        srt: number;
        text_id: string;
        title: string;
        metric_id: number;
    }

    export interface ILocationCard {
        css_file: string;
        id: number;
        level: number; // TODO: array
        loc_id: number; // TODO: array
        parent_id: number; // TODO: array
        title: string;
    }

    export interface IDashboardTopic {
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

    export interface IDashletsItem {        // table: dashboard_views
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
        view_id?: number;                    // deprecated
        id: number;
    }

    export interface IDashboardsItem {            // table: dashboards
        config: any;
        // device: string;
        // editable: number;
        icon_id: number;
        id: number;
        srt: number;
        title: string;
        topic_id: number;
        updated: string;
    }

    export interface IUnitsItem {            // table: units
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

    export interface ILocationArea {
        id: number;
        sid?: number;            // deprecated in 3.0
        loc_id: number;
        name: string;
        WKT?: string;            // deprecated in 3.0
        wkt: string;
    }

    export interface ILocationConfig {
        tags?: string[];
        color?: string;
        bgColor?: string;
        title?: string;
    }

    export interface ILocationsItem {                                             // table: locations
        id: number;                                                                 // v3.0
        config: ILocationConfig;
        is_hidden: number;
        is_point: number;
        latitude: number;
        longitude: number;
        tree_level: number;
        loc_id?: number;                       // deprecated
        parent_id: number;
        srt: number;
        src_id: string;
        title: string;
        created: string;
        updated: string;
        tags: any;
    }

    export interface IMetricsItem {
        is_norm: number;
        // table: params
        alt_id?: string;
        config: any;
        dim_id?: number;                       // v3.0: unit_id
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

    export interface IPresetsItem {                                               // table: presets
        can_be_pie: number;
        created: string;
        metrics: number[];
        preset_id?: number;                                                         // deprecated in v3.0
        title: string;
        updated: string;
        id: number;
    }

    export interface IPeriodsItem {                                               // table: periods
        id: string;
        config: any;
        period_id?: string;
        period_type: number | string;                                               // may be string when updating from trigger
        qty: number | string;
        start: string;                                                              // deprecated
        start_time?: string;
        title: string;
        tags?: any;
    }

    export interface IBookmark {
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

    export interface IMetricSetItem {
        id: number;
        title: string;
    }

    export interface IPeriodType {
        id: number;
        title: string;
    }
}


/**
 *
 * submodule: responses from server
 *
 */
declare module responses {
    interface IDatasetDescription {
        config: any;
        datafile: string;
        description: string;
        groups: number[];
        guid?: string;
        icon: string;
        id: string | number;
        image: string;
        lastPeriod: tables.IPeriodsItem[];
        parent_id: string;
        schema_name: string;
        serial: string;
        sqlite_file?: string;
        title: string;
        ui_cfg: { [id: string]: string };
        srt: number;
        is_visible?: number;
        is_ready?: number;
    }

    interface IGroup {
        id: number;
        config: any;
        title: string;
        datasets: string[];     // guids || schema_names
    }

    interface IProvider {
        contact: any;
        id: number;
        image: string;
        subtitle: string;
        title: string;
        url: string;
    }

    // network response: all the tables
    export interface ITables {
        config: tables.IConfigItem[];

        dashboard_views?: tables.IDashletsItem[];                                                       // deprecated in 3.0
        dashes?: tables.IDashletsItem[];                                                                // deprecated in 3.0
        dashlets: tables.IDashletsItem[];

        dashboard_topics: tables.IDashboardTopic[];

        dashboards: tables.IDashboardsItem[];
        dimensions?: tables.IUnitsItem[];                                                               // deprecated in 3.0
        units: tables.IUnitsItem[];
        location_card_fields: tables.ILocationCardField[];
        location_cards: tables.ILocationCard[];
        locations: tables.ILocationsItem[];

        params: tables.IMetricsItem[];              // deprecated in 3.0
        metrics: tables.IMetricsItem[];

        period_types: any[];
        periods: tables.IPeriodsItem[];
        preset_lists: any[];

        presets: tables.IPresetsItem[];              // deprecated in 3.0
        metric_sets: tables.IPresetsItem[];

        spatial: tables.ILocationArea[];                              // deprecated in 3.0
        location_areas: tables.ILocationArea[];

        data?: tables.IDataEntry[];                 // optional table: data
    }

    export interface IDatasetsResponse {
        datasets: IDatasetDescription[];
        groups: IGroup[];
        provider: IProvider;
        serverTitle: string;
        version: string;
    }

    // network response: dataset (dataset_biquery?guid=...)
    export interface IDatasetResponse {
        dataset: IDatasetDescription;
        groups: any;
        tables: ITables;
    }

    export interface IBiQueryRequestHash {
        parameters?: string[];
        metrics?: string[];
        locations?: string[];
        periods?: string[] | { start: string; end: string; type: number; qty: number };
        closest?: boolean;
    }

    // export interface IBiQueryQuery {
    //   cube: IBiQueryRequestHash;
    //   type: string;
    //   id: string;
    // }

    // export interface IBiQueryResponse {
    //   BIData: {
    //     version: string;
    //     responses: {
    //       id: string;
    //       records: number;
    //       data: tables.IDataEntry[];
    //     }[];
    //   }
    // }
}


interface IVizelController {
    handleExpandFullScreen?: () => any;
    handleChartClick?: (event, subspace) => any;
    handleClose?: (z: IEntity) => any;
    handleVCPClick?: (event, vcpv: IVCPV, context?: any) => any;
    handleXClick?: (event, e: IEntity, context?: any) => any;
    setChartClickAction?: (action: any) => any;

    setAxes?(subspace: ISubspace): Promise<any>;
}

interface IColorPair {
    color: string | null;
    bgColor: string | null;
}


interface IColorResolver {
    getColor(e: IEntity, v?: IValue, index?: number, colorPalette?: string[]): string | null;

    getBgColor(e: IEntity, v?: IValue, index?: number): string | null;

    getColorPair(e: IEntity, v?: IValue, index?: number, colorPalette?: string[]): IColorPair;     // TODO: implement every colorResolver to have method
}


interface ITitleResolver {
    getTitle(e: IEntity, v?: number, index?: number): string;

    getFormat(e: IEntity): string;
}


interface ISize {
    width?: number;
    height?: number;
}


interface IMLPPtrCube {
    forEach(fn: (mid: string, lid: string, pid: string, v: IValue) => void): void;
}


export interface ISubspace extends IMLPSubspace {
    schemaName?: string;
    koob?: string;                                                                              // marker for koob data
    lookupId?: string;

    xAxis?: string;
    yAxis?: string;
    zAxis?: string;

    axesOrder?: any;                                                                                   // TODO: move to ds/types and declare as IAxesOrder

    ms: IMetric[];
    ls: ILocation[];
    ps: IPeriod[];
    //
    xs: IEntity[];
    ys: IEntity[];
    zs: IEntity[];
    aas?: IEntity[];
    abs?: IEntity[];

    allDimensions?: IKoobDimension[];
    allMeasures?: IKoobMeasure[];
    measures?: IKoobMeasure[];
    dimensions?: IKoobDimension[];
    filters?: any;
    rawFilters?: any;
    arity?: any;
    pivotData?: any;
    offset?: number;
    limit?: number;
    subtotals?: string[];

    getZ(idx: number): IEntity;

    getY(idx: number): IEntity;

    getX(idx: number): IEntity;

    getMLP(z: IEntity, y: IEntity, x: IEntity): IMLP;

    getMatrixYX?(): IValue[][];  // todo delete когда будет новый апи

    getVectorX?(): IValue[];  // todo delete когда будет новый апи

    getVectorY?(): IValue[]; // todo delete когда будет новый апи

    reduce(nx: number, ny: number, nz: number): ISubspace;

    isEmpty(): boolean;

    splitByZ?(): ISubspace[];

    splitByY?(): ISubspace[];

    splitByX?(): ISubspace[];

    getZYXIndexesByMLPIds?(mid: string, lid: string, pid: string): [number, number, number];

    projectData?(mlpCube: IMLPPtrCube): IValue[][][];

    getArity?(): number;

    getRawConfig?(): tables.IDataSource;

    toString?(): string;

    getXsLength?: () => Promise<number>;

    getYsLength?: () => Promise<number>;

    createSubspaceAxes?: (from: [number, number], to: [number, number]) => Promise<ISubspace>;

    sortBy?: (id: string) => Promise<ISubspace>;
}


interface ISubspacePtr {
    koob?: string;
    lookupId?: string | number;

    dataSource: tables.IDataSource;

    metricsDrilldown: number;
    locationsDrilldown: number;
    disableLoadData: number;

    isCombine(): boolean;

    getCombineAxes(): { xAxis: string[], yAxis: string[], zAxis: string[], tags: string[][] };

    getAxisEntityIds(axisName: string): string | string[];

    getAxesOrder(): string[];

    getMIds(): string[];

    getLIds(): string[];

    getPIds(): string[] | { start?: string; end?: string; type?: number; qty?: number };

    getPType(): string;
}


interface IAxis<E extends IEntity> {
    axisId: string;
    entities: E[];
}


interface IMetricsHelper {

}

interface ILocationsHelper {
    tagAxes: { [axisId: string]: IAxis<any> };
}


interface IPeriodsHelper {
    addPeriods(ps: tables.IPeriodsItem[]): void;

    getDefaultPeriodType(): number;

    getPeriodsByTypeId(periodTypeId: number): IPeriod[];

    getAvailablePeriodTypes(): number[];

    isFirst(p: IPeriod): boolean;

    isLast(p: IPeriod): boolean;

    getPeriodsByDatesAndType(from, to, periodType: number): IPeriod[];
}


interface IGeo {
    lat?: number;
    lng?: number;
    zoom?: number;
}


interface IMapFill {
    enabled: boolean;
    locations?: ILocation[];
    metric?: IMetric;
}


interface IMapLayer extends IDisposable {
    title: string;
    icon: string;
    dialog: any;
    active: boolean;
    isDialogVisible: boolean;

    toggle(): void;
}

interface IPeriodInfo {
    type: number;
    startId: string;
    endId: string;
    start: IPeriod;
    end: IPeriod;
    startDate: moment.Moment;
    endDate: moment.Moment;
    periods: IPeriod[];
}


interface IMLPPtr {
    metric_id?: string;
    loc_id: string;
    period_id: string;
    key?: string;
}


interface IMLPVPtr extends IMLPPtr {
    val: IValue;
}

interface IRetainable {
    retain();

    release();

    lock<T>(fn: () => T): Promise<T>;
}


interface IObservable extends IRetainable {
    subscribe(event: string, listener: any): IDisposable;
}


interface IVizelListener {
    // onSaveAbilityChanged(abilities: string[]);
    onVizelPropertiesChanged(props: IVizelProperties, vzl?: IVizel): void;
}

declare type IVizelPropertiesDataRange = { [dimId: string]: IRange };

interface IVizelProperties {
    saveAbilities?: string[];
    minSize?: ISize;
    maxSize?: ISize;
    dataRange?: IVizelPropertiesDataRange;
    vAxisRange?: IVizelPropertiesDataRange;
    hasSettings?: boolean;
    toolbarButtons?: any[];
    width?: number;
    height?: number;
}


interface IVizel {
    scale?: (min: number, max: number, dim?: any) => void;

    setAxes(subspace: ISubspace): Promise<any>;

    resize(width?: number, height?: number): void;

    getProperties(): IVizelProperties;

    setProperties(o: { [id: string]: any }): boolean;

    addListener(listener: IVizelListener): void;

    removeListener(listener: IVizelListener): void;

    save(saveAbility: string, titleContext: string[], $anchor?: any): void;

    getFullscreenVizel?(): Promise<IVizel>;

    saveHandler?(event): void;
}


interface IVizelDescription {
    type: string;
    group: string;
    inner: string;
    file: string;
    title: string;
    icon: string;

    toString(): string;
}


interface IHasError {
    error: string;
}


interface IMLP {
    m: IMetric;
    l: ILocation;
    p: IPeriod;
}

interface IMLPV extends IMLP {
    v: IValue;
}

interface IVCP extends IMLP {
    x: IEntity;
    y?: IEntity;
    z?: IEntity;
    aa?: IEntity;
    ab?: IEntity;
    ac?: IEntity;
    filters?: any;
}

interface IVCPV extends IVCP {
    v: IValue;
}

export interface IFromTo {
    from: number;
    to: number;
}
