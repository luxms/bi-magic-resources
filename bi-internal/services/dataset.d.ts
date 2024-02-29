import {
    BaseService,
    IDisposable,
    UrlState,
    IUrl,
    createSingleton,
    AuthenticationService,
    IAuthentication
} from '../core'

import {IDatasetServiceModel, IDsState, IDsStateService, IDatasetModel, IAxesOrder} from '../defs/types'
import {IPreset, IMetric, ILocation, IMapFill, IGeo, IPeriod, ISubspacePtr} from '../defs/bi';

interface IDepsModels {
    dataset: IDatasetServiceModel;
    url: IUrl;
}

/**
 * @param {string} schemaName  - имя датасета
 * @param {ISubspacePtr} subspacePtr - вспомогательная функция с работой datasource
 * @param {boolean} isExternal - external vizel?
 * @param {function} onChange -  функция callback при изменении модели
 * @description Асинхронная функция создания subspace, сама решает какой subspace создать для МЛП,КУБОВ,ЛУКАП
 * SubspacePtr можно взять из конфига методом getSubspacePtr()
 */
export function createSubspaceGenerator(schemaName: string, subspacePtr: ISubspacePtr, isExternal: boolean, onChange: any): IDisposable;

export class DatasetService extends BaseService<IDatasetServiceModel> {
    public constructor(datasetId: string | number)
    public static createInstance(id: string | number): DatasetService
}

/**
 * @description Подписан на url, показывает в моделе какой датасет/дешборд/дешлет/метрика... на экране.
 */
export class CurrentDsStateService extends BaseService<IDsState> {
    protected _onDepsReadyAndUpdated({
                                         authentication,
                                         dsState,
                                         urlState
                                     }: { authentication: IAuthentication, dsState: IDsState, urlState: IUrl });

    public static getInstance(): CurrentDsStateService;
    public static subscribeUpdatesAndNotify(listener: (model: IDsState) => void): IDisposable;
    public static unsubscribe(listener: (...args: any[]) => any): boolean;
}


export class DsStateService extends BaseService<IDsState> implements IDsStateService {

    private constructor(datasetId: string | number);
    protected _onDepsReadyAndUpdated(depsModels: IDepsModels, prevDepsModels: IDepsModels): any;

    public getMaxParametersNumber(): number;

    public getMaxLocationsNumber(): number;

    public _getPreset(dataset: IDatasetModel, url: IUrl): IPreset;
    public _getMetrics(dataset: IDatasetModel, url: IUrl): IMetric[];

    public setFormulaLocations(locations: ILocation[], skipCheck?: boolean): void;

    public removeFormulaLocation(location: ILocation): void;

    public _removeFormulaLocation(location: ILocation): void;

    public toggleFormulaLocation(location: ILocation): void;

    public setMetrics(metrics: IMetric[], skipCheck?: boolean): void;
    public removeMetric(metric: IMetric): void ;

    public toggleParameter(metric: IMetric): void;

    public setGeo(newGeo: IGeo): void;
    public setCustomConfig(config: any): void;

    public setPreset(preset: IPreset): void;

    public setDboard(db): void;

    public setDash(dash): void;

    public setChartType(chartType: string): void;

    public setMapfill(mapfill: IMapFill): void;

    public setMapMetricsPanelVisible(mapMetricsPanelVisible: boolean): void;

    public isActive(): boolean;

    public getDataset(): IDatasetModel;

    public setPeriods(start: IPeriod, end: IPeriod, pt: number): void;

    public setAxesOrder(axesOrder: IAxesOrder): void;

    public setAutoscale(value): void;

    public goToPlots(extra?: any): void;
    
    public static createInstance(id: string | number): DsStateService;
}

