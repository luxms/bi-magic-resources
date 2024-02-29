import { data_engine } from '../../data-manip/data-manip';
import {IObservable, IDisposable} from "../core/Observable";
import {IUrl} from '../core/UrlState/UrlState'
// import { IDisposable, IObservable, IUrl } from '../core/Observable;
// import { IDisposable, IObservable, IUrl } from '../core/Observable;
import {
    IColorResolver,
    IEntity,
    IGeo,
    ILocation,
    ILocationArea,
    ILocationCard,
    ILocationsHelper,
    IMapFill,
    IMetric,
    IMetricsHelper,
    IOptionsProvider,
    IPeriod,
    IPeriodInfo,
    IPeriodsHelper,
    IPreset,
    IRange,
    IStoplightsProvider,
    ISubspace,
    ISubspacePtr,
    ITitleResolver,
    IUnit,
    IVizel,
    IVizelConfigDisplay,
    IVizelController, IVizelProperties,
    responses,
    tables
} from './bi';


export interface IVizelConfig extends IColorResolver, ITitleResolver, IOptionsProvider, IStoplightsProvider {
    dataset: IDatasetModel;

    getDataset(): IDatasetModel;

    getProperty(key): any;

    setProperty(key: string, value: any): void;

    getLegendItem(e: IEntity, idx?: number): tables.ILegendItem;

    serialize(): tables.IRawVizelConfig;

    clone(): IVizelConfig;

    getDisplay(vizelType?: string): IVizelConfigDisplay;

    getRange(): IRange;

    disableRange(): void;

    getUrl(): string;

    getBgImage(): string;

    dataSource?: tables.IDataSource;

    getVizelType(): string;

    setVizelType(vizelType: string): void;

    setTitle(title: string): void;

    getSubspacePtr(): ISubspacePtr;

    controller: IVizelController;
    // drilldown?: (event:any, z:IEntity, y:IEntity, x:IEntity)=>void;

    // TODO: move to methods: setters/getters
    title?: string;
    description?: string;
    display?: tables.IVizelConfigDisplay;
    legend?: { [id: string]: tables.ILegendItem; };
    badValueColor?: string;
    goodValueColor?: string;
    normsMainColor?: string;
    onClickDataPoint?: string | any;
    onClick?: string | any;                   // TODO: describe IUrl type
    cardId?: string;
    externalUrl?: IUrl;
    dashboardId?: number | string;
    dashId?: number | string;
    normStrategy?: string;
    context?: any;

    titleContext?: string[];
    colorResolver?: IColorResolver;
    titleResolver?: ITitleResolver;

    // deprecated
    chartStyle: string;
    showLegend: boolean;
    visualMap?: any;

    getRaw(): tables.IRawVizelConfig;
}


export interface IDashlet extends IEntity {
    id: string;
    title: string;
    layout: string;           // V|H|''
    children: IDashlet[];

    getDataset(): IDatasetModel;

    getDashboard(): IDashboard;

    getFrame(): tables.IConfigFrame;

    getDescription(): string;

    getRawVizelConfig(): tables.IRawVizelConfig;

    isContainer(): boolean;

    isRoot(): boolean;

    // TODO: remove
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


export interface IDatasetModel extends IObservable {
    id: number;
    guid: string;
    // deprecated
    // schemaName: string;
    schema_name: string;
    title: string;
    description: string;
    //
    units: IUnit[];
    metrics: IMetric[];
    rootMetrics: IMetric[];
    presets: IPreset[];
    locationCards: ILocationCard[];
    locationAreas: ILocationArea[];
    locations: ILocation[];
    rootLocations: ILocation[];
    periods: IPeriod[];

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

    createVizelConfig(d: tables.IRawVizelConfig, view_class?: string): IVizelConfig;

    // createVizelController(vizelConfig: IVizelConfig, defaultAction: string): IVizelController;

    getDatasetTitleTemplate(route: string): string;

    getBiQuery(): any;

    getConfigParameter(key: string, defaultValue?: string): string;  // makes lookup in table config and in lang

    update(datasetDescription: responses.IDatasetDescription, storage: responses.ITables): void;

    getSerial(): moment.Moment;

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
    // etc...
}

export interface IDsState {
    loading?: boolean;
    error?: string;
    //
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

    setPeriods(start: IPeriod, end: IPeriod, type: number);

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

    subscribe(items: string, callback: any): IDisposable;

    subscribeUpdates(listener: (model: IDsState) => void): IDisposable;

    subscribeUpdatesAndNotify(listener: (model: IDsState) => void): IDisposable;

    unsubscribe(listener: (model: IDsState) => void): void;

    retain(): IDsStateService;

    release(): boolean;
}


// constructor props
export interface IVizelProps {
    dp: data_engine.IDataProvider;
    cfg: IVizelConfig;
    subspace: ISubspace;
    listener?: any;
    showLegend?: boolean;
    onVizelPropertiesChanged?: (properties: IVizelProperties, vizel: any) => void;
    properties?: IVizelProperties;
    renderError?: (error: string) => any;
    renderLoading?: (loading: boolean) => any;
}

export interface IVizelClass {
    new(props: IVizelProps): IVizel;
}


export enum LoadingStatus {
    UNDEFINED,
    LOADING_FIRST_TIME,
    LOADING,
    NO_DATA,
    HAS_DATA,
}

export interface IModuleOptions {
    useSinglePeriod?: boolean;
    metricsPanel?: boolean;
    locationsPanel?: boolean;
    periodsPanel?: boolean;
}
