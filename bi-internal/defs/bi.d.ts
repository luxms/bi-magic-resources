import { repo } from '../core';

declare global {
    namespace moment {
        interface Moment {}
    }
}

import { IValue, IRawColor, ITreeNode, ITag, IUnit, IMetric, IEntity, ITaggedEntity } from './common';
import type { IDataEntry, ILegendItem, IStopLight, IStopPoint, IVizelConfigDisplayStoplight, IVizelConfigAxis, IRawVizelConfigDisplay, IDataSourceStyle, IDataSource, IConfigFrame, IRawVizelConfig, IDashConfig, INormDataEntry, INormDataEntry3, IConfigItem, ILocationCardField, ILocationCard, IDashboardTopic, IDashletsItem, IDashboardsItem, IUnitsItem, ILocationArea, ILocationConfig, ILocationsItem, IMetricsItem, IPresetsItem, IPeriodsItem, IBookmark, IMetricSetItem, IPeriodType } from './tables';
type IRawVizelConfigDataSource = IDataSource;
export type { IValue, IRawColor, ITreeNode, ITag, IMetric, IUnit, IEntity, ITaggedEntity, IRawVizelConfig, IRawVizelConfigDataSource, IPeriodType, ILocationArea, ILocationCard, ILocationCardField, };
export type IRange = [number, number];
export interface IDisposable {
    dispose(): any;
}
export interface IPeriod extends IEntity, ITaggedEntity {
    id: string;
    title: string;
    color: string;
    config: any;
    period_id: string;
    period_type: number;
    start: string;
    startDate: moment.Moment;
    middleDate: moment.Moment;
    endDate: moment.Moment;
    orderBy: Date;
    date: Date;
    children: IPeriod[];
    parent: IPeriod;
    root: IPeriod;
    axisId: string;
    year: number;
    quarter: number;
    month: number;
    week: number;
    day: number;
    getTagByGroupId(tagGroupName: string): any;
    getTags(): any[];
    addTag(tag: any): this;
    getParent(): IPeriod;
    update(p: tables.IPeriodsItem): any;
    valueOf(): number;
}
export type ISpatial = ILocationArea;
export interface ILocation extends IEntity, ITaggedEntity {
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
    spatials: ISpatial[];
    children: ILocation[];
    parent: ILocation;
    card: ILocationCard;
    id: string;
    getAltTitle(titleType: string): string;
    is_formula?: boolean;
    is_aggregator?: boolean;
}
export interface IPreset {
    id: string;
    preset_id: number;
    title: string;
    can_be_pie: number;
    parameters: IMetric[];
    metrics: IMetric[];
    getDimensions(): IUnit[];
}
export interface IMLPSubspace {
    ms: IMetric[];
    ls: ILocation[];
    ps: IPeriod[];
}
export interface IKoobDimension {
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
    subtotal?: boolean;
    upSubtotal?: boolean;
    count?: number;
}
export interface IKoobMeasure {
    id: string;
    formula: string;
    axisId?: string;
    source_ident?: string;
    cube_name?: string;
    name?: string;
    title: string;
    format?: string;
    members?: any;
    type: string | 'SUM';
    min?: number;
    max?: number;
    sql: string;
    key?: string;
    config?: any;
    unit?: any;
}
export interface IKoobEntity {
    readonly id: string;
    readonly title: string;
    readonly source_ident: string;
    readonly cube_name: string;
    readonly sql: string;
    readonly formula: string;
    readonly rawFormula: string;
    readonly axisId: string;
    readonly name: string;
    readonly type: string;
    readonly config: any;
    readonly unit?: any;
}
export interface IAggregate {
    avgval: number;
    maxval: number;
    minval: number;
}
export interface IOptionsProvider {
    getOption(optionId: string, defaultValue?: boolean): boolean | undefined;
    hasOption(optionId: string): boolean;
    /**
     * @deprecated
     * @param optionId
     */
    getOptionCount(optionId: string): number;
    setOption(optionId: string, value: boolean): void;
    addOption(optionId: string): boolean;
    removeOption(optionId: string): boolean;
}
export interface IStoplight {
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
export interface IStoplights extends IColorResolver {
    getStoplight(v: IValue): IStoplight;
    forEach(fn: (s: IStoplight) => void): void;
    forEachPoint(fn: (s: IStopPoint) => void): void;
    map<U>(callbackfn: (value: IStoplight, index: number, array: IStoplight[]) => U, thisArg?: any): U[];
}
interface IStoplightsProvider {
    getStoplight(v: number, vizelType?: string): IStoplight;
    getStoplights(vizelType?: string): IStoplights;
}
export interface IVizelConfigDisplay extends IStoplightsProvider {
    xAxisTickTitleRotationAngle?: number;
    color?: string;
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
    plotOptions?: any;
    noDataText?: string;
    customValue?: string;
    conditionalDisplay?: string;
    maxFontSize?: string;
    minFontSize?: string;
    horizontalAlign?: string;
    verticalAlign?: string;
    fontFamily?: string;
    fontSize?: number;
    xAxisLabelLimit?: number;
    yAxisLabelLimit?: number;
    geo?: {
        zoom?: number;
        lat?: number;
        lng?: number;
    };
    rotateXLabel?: number;
    rotateYLabel?: number;
    indicator?: string | any[];
    hasRange(): boolean;
    getRange(): IRange;
    disableRange(): void;
    getLimit(): number;
    getSort(): string;
    getSortBy(): string;
    setSort(v: string): void;
    getVAxisWidth(): number;
    getGradient(): string;
    getStackGroupIndex(e: IEntity): number;
}
declare namespace tables {
    export type { IDataEntry, ILegendItem, IStopLight, IStopPoint, IVizelConfigDisplayStoplight, IVizelConfigAxis, IRawVizelConfigDisplay, IDataSourceStyle, IDataSource, IConfigFrame, IRawVizelConfig, IDashConfig, INormDataEntry, INormDataEntry3, IConfigItem, ILocationCardField, ILocationCard, IDashboardTopic, IDashletsItem, IDashboardsItem, IUnitsItem, ILocationArea, ILocationConfig, ILocationsItem, IMetricsItem, IPresetsItem, IPeriodsItem, IBookmark, IMetricSetItem, IPeriodType, };
}
export { tables };

export namespace responses {
    export interface IBiQueryRequestHash {
        parameters?: string[];
        metrics?: string[];
        locations?: string[];
        periods?: string[];
        norms?: string[];
        closest?: boolean;
    }

    export interface ITables {
        config: tables.IConfigItem[];
        dashboard_views?: tables.IDashletsItem[];
        dashes?: tables.IDashletsItem[];
        dashlets: tables.IDashletsItem[];
        dashboard_topics: tables.IDashboardTopic[];
        dashboards: tables.IDashboardsItem[];
        dimensions?: tables.IUnitsItem[];
        units: tables.IUnitsItem[];
        location_card_fields: tables.ILocationCardField[];
        location_cards: tables.ILocationCard[];
        locations: tables.ILocationsItem[];
        params?: tables.IMetricsItem[];
        metrics: tables.IMetricsItem[];
        period_types: any[];
        periods: tables.IPeriodsItem[];
        preset_lists: any[];
        presets?: tables.IPresetsItem[];
        metric_sets: tables.IPresetsItem[];
        spatial?: tables.ILocationArea[];
        location_areas: tables.ILocationArea[];
        data?: tables.IDataEntry[];
        is_ready?: number;
    }
}
export interface IVizelController {
    readonly handleChartClick?: (event: any, subspace: any) => any;
    readonly handleVCPClick?: (event: any, vcpv: IVCPV, context?: any) => any;
    readonly handleHierarchyClick?: (rawCfg: IRawVizelConfig, schemaName: string, title: string) => Promise<void>;
    /**
     * @deprecated
     */
    readonly handleExpandFullScreen?: () => any;
    /**
     * @deprecated
     */
    readonly handleClose?: (z: IEntity) => any;
    /**
     * @deprecated
     */
    readonly handleXClick?: (event: any, e: IEntity, context?: any) => any;
    /**
     * @deprecated
     */
    readonly setChartClickAction?: (action: any) => any;
}
export interface IColorPair {
    readonly color: string | null;
    readonly bgColor: string | null;
}

export interface IGeo {
    zoom?: number;
    lat?: number;
    lng?: number;
    [id: string]: any;
}

export interface IPeriodInfo {
    readonly start?: IPeriod;
    readonly end?: IPeriod;
    readonly type?: number;
    readonly [id: string]: any;
}

export interface IMetricsHelper {
    metrics?: IMetric[];
    rootMetrics?: IMetric[];
    getTagGroup?(tagGroupName: string): any;
}

export interface IColorResolver {
    getColor(e: IEntity, v?: IValue, index?: number, colorPalette?: string[]): string | null;
    getBgColor(e: IEntity, v?: IValue, index?: number): string | null;
    getColorPair(e: IEntity, v?: IValue, index?: number, colorPalette?: string[]): IColorPair;
}
export interface ITitleResolver {
    getTitle(e: IEntity, v?: number, index?: number): string;
    getFormat(e: IEntity): string;
}
interface ISize {
    width?: number;
    height?: number;
}
export interface IMLPPtrCube {
    forEach(fn: (mid: string, lid: string, pid: string, v: IValue) => void): void;
}
export interface ISubspace extends IMLPSubspace {
    schemaName?: string;
    schema_name?: string;
    koob?: string;
    lookupId?: string;
    xAxis?: string;
    yAxis?: string;
    zAxis?: string;
    axesOrder?: any;
    ms: IMetric[];
    ls: ILocation[];
    ps: IPeriod[];
    xs: IEntity[];
    ys: IEntity[];
    zs: IEntity[];
    aas?: IEntity[];
    abs?: IEntity[];
    cube: repo.koob.IRawCube;
    measures?: IKoobEntity[];
    dimensions?: IKoobEntity[];
    filters?: any;
    arity?: any;
    pivotData?: any;
    offset?: number;
    subtotals?: string[];
    having?: string;
    limit?: number;
    subspacePtr?: ISubspacePtr;
    getZ(idx: number): IEntity;
    getY(idx: number): IEntity;
    getX(idx: number): IEntity;
    getMLP(z: IEntity, y: IEntity, x: IEntity): IMLP;
    getMatrixYX?(): IValue[][];
    getVectorX?(): IValue[];
    getVectorY?(): IValue[];
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
}
export interface ISubspacePtr {
    readonly koob?: string;
    readonly lookupId?: string | number;
    readonly dataSource: tables.IDataSource;
    readonly schema_name?: string;
    readonly dashboard?: number;
    readonly dashlet?: number;
    readonly having?: string;
    readonly metricsDrilldown: number;
    readonly locationsDrilldown: number;
    readonly disableLoadData: boolean;
    readonly loadAllData: boolean;
    /**
     * Может включаться для подавления автоматического выставления сортировки столбцов по возрастанию
     * Нужно лишь в том случае, когда пользователь задает сортировку самостоятельно
     */
    hackDisableSort: boolean;
    isCombine(): boolean;
    getCombineAxes(): {
        xAxis: string[];
        yAxis: string[];
        zAxis: string[];
        tags: string[][];
    };
    getAxisEntityIds(axisName: string): string | string[];
    getAxesOrder(): string[];
    getMIds(): string[];
    getLIds(): string[];
    getPIds(): string[] | {
        start?: string;
        end?: string;
        type?: number;
        qty?: number;
    };
    getPType(): string;
}
export interface IAxis<E extends IEntity> {
    axisId: string;
    entities: E[];
}
export interface ILocationsHelper {
    tagAxes: {
        [axisId: string]: IAxis<any>;
    };
}
export interface IPeriodsHelper {
    addPeriods(ps: tables.IPeriodsItem[]): void;
    getDefaultPeriodType(): number;
    getPeriodsByTypeId(periodTypeId: number): IPeriod[];
    getAvailablePeriodTypes(): number[];
    isFirst(p: IPeriod): boolean;
    isLast(p: IPeriod): boolean;
    getPeriodsByDatesAndType(from: any, to: any, periodType: number): IPeriod[];
}
export interface IMapFill {
    enabled: boolean;
    locations?: ILocation[];
    metric?: IMetric;
}
declare type IVizelPropertiesDataRange = {
    [dimId: string]: IRange;
};
export interface IVizelPropertiesBtn {
    readonly id: string;
    readonly title: string;
    readonly icon: string;
    readonly type?: string;
    readonly active?: boolean;
    readonly srt?: number;
    readonly hideMenu?: boolean;
    readonly onClick: (...args: any) => void;
    readonly onClickSettings?: (...args: any) => void;
}
export interface IVizelProperties {
    saveAbilities?: string[];
    saveBlobAbilities?: string[];
    minSize?: ISize;
    maxSize?: ISize;
    dataRange?: IVizelPropertiesDataRange;
    vAxisRange?: IVizelPropertiesDataRange;
    hasSettings?: boolean;
    toolbarButtons?: any[];
    width?: number;
    height?: number;
    forecast?: any;
    fullScreen?: boolean;
    menuListBtn?: {
        [key: string]: IVizelPropertiesBtn;
    };
}
interface IMLP {
    m: IMetric;
    l: ILocation;
    p: IPeriod;
    ms: IMetric[];
    ls: ILocation[];
    ps: IPeriod[];
}
export type IMLPType = 'metrics' | 'locations' | 'periods';
export interface IMLPV extends IMLP {
    v: IValue;
}
export interface IVCP extends IMLP {
    x: IEntity;
    y?: IEntity;
    z?: IEntity;
    aa?: IEntity;
    ab?: IEntity;
    ac?: IEntity;
    filters?: any;
    ys?: IEntity[];
}
export interface IVCPV extends IVCP {
    v: IValue;
}
export interface ICubeVCP {
    x: IEntity;
    y: IEntity;
    z?: IEntity;
    xs?: IEntity;
    ys?: IEntity;
    zs?: IEntity;
    filters: any;
    measures: IKoobEntity[];
    cube: string;
    schema_name: string;
    v?: IValue;
}
export interface IFromTo {
    from: number;
    to: number;
}


export interface IVizelListener {
    onVizelPropertiesChanged(props: IVizelProperties, vzl?: IVizel): void;
}

export interface IVizelDescription {
    readonly type: string;
    readonly group: string;
    readonly inner: string;
    readonly file: string;
    readonly title: string;
    readonly icon: string;
    readonly toString: () => string;
}

export interface IVizel {
    readonly resize: (width?: number, height?: number) => void;
    readonly setProperties: (o: { [id: string]: any }) => boolean;
    readonly save: (saveAbility: string, titleContext: string[], subtitle?: string) => any;
    setAxes?(subspace: ISubspace): Promise<any>;
    getProperties?(): IVizelProperties;
    addListener?(listener: IVizelListener): void;
    removeListener?(listener: IVizelListener): void;
    getFullscreenVizel?(): Promise<IVizel>;
    saveHandler?(event: any): void;
}
