import { data_engine } from './data-manip';
import { IDisposable, IUrl, repo } from '../core';
import { IColorPair, IColorResolver, IEntity, IGeo, ILocation, ILocationArea, ILocationCard, ILocationsHelper, IMapFill, IMetric, IMetricsHelper, IPeriod, IPeriodInfo, IPeriodsHelper, IPreset, IRange, IRawVizelConfig, IStoplight, IStoplights, ISubspace, ISubspacePtr, ITitleResolver, IUnit, IValue, IVizelConfigDisplay, IVizelController, IVizelProperties, responses, tables } from './bi';
import type { IVizel } from './bi';
/**
 * @deprecated уходим от этого типа конфига
 */
export interface IVizelConfig extends IRawVizelConfig {
    /**
     * @deprecated Используйте vizel_config.getTitle
     */
    getTitle(e: IEntity, v?: number, index?: number): string;
    /**
     * @deprecated Используйте vizel_config.getFormat
     */
    getFormat(e: IEntity): string;
    /**
     * @deprecated
     */
    _dataset: IDatasetModel;
    /**
     * @deprecated
     */
    dataset: IDatasetModel;
    /**
     * @deprecated
     */
    /**
     * @deprecated
     */
    hasOption(optionId: string): boolean;
    /**
     * @deprecated
     */
    getOptionCount(optionId: string): number;
    /**
     * @deprecated
     */
    setOption(optionId: string, value: boolean): void;
    /**
     * @deprecated
     */
    addOption(optionId: string): boolean;
    /**
     * @deprecated
     */
    removeOption(optionId: string): boolean;
    /**
     * @deprecated
     */
    getStoplight(v: number, vizelType?: string): IStoplight;
    /**
     * @deprecated
     */
    getStoplights(vizelType?: string): IStoplights;
    /**
     * @deprecated
     */
    getDataset(): IDatasetModel;
    /**
     * @deprecated
     */
    getProperty(key: any): any;
    /**
     * @deprecated
     */
    setProperty(key: string, value: any): void;
    /**
     * @deprecated Используйте vizel_config.getLegendItem
     */
    getLegendItem(e: IEntity, idx?: number): tables.ILegendItem;
    /**
     * @deprecated
     */
    serialize(): tables.IRawVizelConfig;
    /**
     * @deprecated
     */
    getColor(e: IEntity, v?: IValue, index?: number, colorPalette?: string[]): string | null;
    /**
     * @deprecated
     */
    getBgColor(e: IEntity, v?: IValue, index?: number): string | null;
    /**
     * @deprecated
     */
    getColorPair(e: IEntity, v?: IValue, index?: number, colorPalette?: string[]): IColorPair;
    /**
     * @deprecated используйте rawCfg
     */
    clone(): IVizelConfig;
    /**
     * @deprecated
     */
    getDisplay(vizelType?: string): IVizelConfigDisplay;
    /**
     * @deprecated
     */
    getRange(): IRange;
    /**
     * @deprecated
     */
    disableRange(): void;
    /**
     * @deprecated
     */
    getUrl(): string;
    /**
     * @deprecated
     */
    getBgImage(): string;
    dataSource?: tables.IDataSource;
    /**
     * @deprecated Используйте props view_class
     */
    getVizelType(): string;
    /**
     * @deprecated
     */
    setVizelType(vizelType: string): void;
    /**
     * @deprecated
     */
    setTitle(title: string): void;
    /**
     * @deprecated
     */
    getSubspacePtr(): ISubspacePtr;
    /**
     * @deprecated
     */
    controller: IVizelController;
    title?: string;
    description?: string;
    display?: tables.IRawVizelConfigDisplay;
    legend?: {
        [id: string]: tables.ILegendItem;
    };
    badValueColor?: string;
    goodValueColor?: string;
    normsMainColor?: string;
    onClickDataPoint?: string | any;
    onClick?: string | any;
    cardId?: string;
    externalUrl?: IUrl;
    dashboardId?: number | string;
    dashId?: number | string;
    normStrategy?: string;
    context?: any;
    options?: string[];
    titleContext?: string[];
    report?: {
        title: string;
        output: string;
        template: string;
    }[];
    /**
     * @deprecated
     */
    colorResolver?: IColorResolver;
    /**
     * @deprecated
     */
    titleResolver?: ITitleResolver;
    /**
     * @deprecated
     */
    chartStyle: string;
    /**
     * @deprecated
     */
    showLegend: boolean;
    /**
     * @deprecated
     */
    visualMap?: any;
    /**
     * @deprecated Используйте props.rawCfg
     */
    getRaw(): tables.IRawVizelConfig;
}
export interface IDashlet extends IEntity {
    id: string;
    title: string;
    layout: string;
    children: IDashlet[];
    getDataset(): IDatasetModel;
    getDashboard(): IDashboard;
    getFrame(): tables.IConfigFrame;
    getDescription(): string;
    getRawVizelConfig(): tables.IRawVizelConfig;
    isContainer(): boolean;
    isRoot(): boolean;
    legend: any;
}
export interface IDashletsHelper {
    dashboards: IDashboard[];
    dashboardTopics: tables.IDashboardTopic[];
    getDashboard(id: string): IDashboard;
    getDash(id: string): IDashlet;
    getDashes(): IDashlet[];
}
export interface IDashboard extends IEntity {
    id: string;
    title: string;
    topic_id: number;
    stateColor: string;
    srt: number;
    getRootDashes(): IDashlet[];
    getDashes(): IDashlet[];
}
export interface IConfigHelper {
    hasValue(key: string): boolean;
    getValue(key: string, defaultValue?: string): string;
    getStringValue(key: string, defaultValue?: string): string;
    getIntValue(key: string, defaultValue?: number): number;
    getFloatValue(key: string, defaultValue?: number): number;
    getBoolValue(key: string, defaultValue?: any): boolean;
    getEnumValue(key: string, values: string[], defaultValue?: string): string;
    getStringArray(key: string, defaultValue?: string[]): string[];
    getIntArray(key: string, defaultValue?: number[]): number[];
    getEnterUrl(datasetKey: string): IUrl;
}
export interface IDatasetModel {
    id: number;
    guid: string;
    schema_name: string;
    title: string;
    description: string;
    units: IUnit[];
    metrics: IMetric[];
    rootMetrics: IMetric[];
    presets: IPreset[];
    locationCards: ILocationCard[];
    locationAreas: ILocationArea[];
    locations: ILocation[];
    rootLocations: ILocation[];
    periods: IPeriod[];
    dashlets: repo.ds.IRawDashlet[];
    defaultMetrics: IMetric[];
    defaultLocations: ILocation[];
    defaultPeriods: IPeriod[];
    metricsHelper: IMetricsHelper;
    locationsHelper: ILocationsHelper;
    periodsHelper: IPeriodsHelper;
    dashletsHelper: IDashletsHelper;
    getDataProvider(): data_engine.IDataProvider;
    getConfigHelper(): IConfigHelper;
    getEnterUrl(): IUrl;
    /**
     * @deprecated
     * @param d
     * @param view_class
     */
    createVizelConfig(d: tables.IRawVizelConfig, view_class?: string): IVizelConfig;
    getDatasetTitleTemplate(route: string): string;
    getBiQuery(): any;
    getConfigParameter(key: string, defaultValue?: string): string;
    update(dataset: repo.adm.IRawDataset, storage: responses.ITables): void;
    M: (id: string) => IMetric;
    L: (id: string | number) => ILocation;
    P: (id: string) => IPeriod;
    getPeriodInfoByRange(startId: string, endId: string, type?: number): IPeriodInfo;
}
export interface IDatasetServiceModel {
    loading: boolean;
    error: string;
    dataset: IDatasetModel;
}
export interface IAxesOrder extends Array<string> {
    xs?: string;
    ys?: string;
    zs?: string;
    aas?: string;
    abs?: string;
}
export interface IDsState {
    loading?: boolean | number;
    error?: string;
    autoscale: boolean;
    chartType: string;
    dash: IDashlet;
    dboard: IDashboard;
    geo: IGeo;
    locations: ILocation[];
    formulaLocations: ILocation[];
    axesOrder: IAxesOrder;
    mapfill: IMapFill;
    metrics: IMetric[];
    periodInfo: IPeriodInfo;
    periods: IPeriod[];
    preset: IPreset;
    route: string;
    mapMetricsPanelVisible: boolean;
    datasetTitle: string;
    datasetDescriptionHTML: string;
    dataset: IDatasetModel;
    customConfig: any;
}
export interface IDsStateService {
    getModel(): IDsState;
    getDataset(): IDatasetModel;
    getMaxParametersNumber(): number;
    getMaxLocationsNumber(): number;
    setMetrics(ms: IMetric[]): void;
    setPreset(p: IPreset): void;
    setPeriods(start: IPeriod, end: IPeriod, type: number): any;
    setFormulaLocations(ls: ILocation[]): void;
    setGeo(g: IGeo): void;
    setDboard(dboard: IDashboard): void;
    setDash(dash: IDashlet): void;
    setAxesOrder(ao: IAxesOrder): void;
    setAutoscale(autoscale: boolean): void;
    setMapfill(mf: IMapFill): void;
    setChartType(chartType: string): void;
    setCustomConfig(config: any): void;
    toggleParameter(p: IMetric): void;
    removeMetric(p: IMetric): void;
    toggleFormulaLocation(l: ILocation): void;
    removeFormulaLocation(l: ILocation): void;
    goToPlots(): void;
    setMapMetricsPanelVisible(mapMetricsPanelVisible: boolean): void;
    subscribe(items: string | string[], callback: any): IDisposable;
    subscribeUpdates(listener: (model: IDsState) => void): IDisposable;
    subscribeUpdatesAndNotify(listener: (model: IDsState) => void): IDisposable;
    unsubscribe(listener: (model: IDsState) => void): void;
    retain(): IDsStateService;
    release(): boolean;
}
export interface IVizelProps {
    readonly editDashletId?: number;
    readonly view_class: string;
    readonly schema_name: string;
    readonly cfg: IVizelConfig;
    /**
     * @deprecated Пожалуйста используйте cfg
     */
    readonly rawCfg: tables.IRawVizelConfig;
    readonly dp: data_engine.IDataProvider;
    readonly dataset: IDatasetModel;
    readonly subspace: ISubspace;
    readonly controller: IVizelController;
    readonly colorResolver: IColorResolver;
    readonly title?: string;
    readonly dashlet?: repo.ds.IRawDashlet;
    readonly dashlets?: repo.ds.IRawDashlet[];
    readonly editMode: '' | 'edt' | 'builder';
    readonly dashId?: string;
    readonly dashboardId?: number;
    readonly suspended?: boolean;
    readonly onVizelPropertiesChanged?: (property: IVizelProperties) => void;
    readonly onChangeDashlets?: (updated: Partial<repo.ds.IRawDashlet>[], deleted?: Array<string | number>) => any;
    readonly onEditDashlet?: (dashId: string | number) => void;
    readonly onCreateDashlet?: (dashlet: Partial<repo.ds.IRawDashlet>) => Promise<repo.ds.IRawDashlet>;
    readonly onUserChange?: (config: repo.ds.IRawDashlet['config']) => void;
    /**
     * @deprecated
     */
    showLegend?: boolean;
    properties?: IVizelProperties;
    renderError?: (error: string) => any;
    renderLoading?: (loading: boolean) => any;
    subspaceLoading?: boolean;
}
export interface IVizelClass {
    new (props: IVizelProps): IVizel;
}
export declare enum LoadingStatus {
    UNDEFINED = 0,
    LOADING_FIRST_TIME = 1,
    LOADING = 2,
    NO_DATA = 3,
    HAS_DATA = 4
}
export interface IModuleOptions {
    useSinglePeriod?: boolean;
    metricsPanel?: boolean;
    locationsPanel?: boolean;
    periodsPanel?: boolean;
}
