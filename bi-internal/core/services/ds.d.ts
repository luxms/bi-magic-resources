import { ConfigsRepository, DashboardsRepository, DashboardTopicsRepository, DashletsRepository, IRawConfig, IRawDashboard, IRawDashboardTopic, IRawDashlet, IRawLocation, IRawMetric, IRawMetricSet, IRawPeriod, IRawResource, IRawTextData, IRawUnit, LocationsRepository, MetricSetsRepository, MetricsRepository, PeriodsRepository, ResourcesRepository, TextDataRepository, UnitsRepository } from '../repositories/ds';
import { BaseEntitiesService, IBaseEntities } from './BaseEntitiesService';
export declare class ConfigsService extends BaseEntitiesService<IRawConfig> {
    protected _repo: ConfigsRepository;
    static readonly MODEL: IBaseEntities<IRawConfig>;
    protected constructor(schemaName: string);
    protected _dispose(): void;
    private static _cache;
    static createInstance: (id: number | string) => ConfigsService;
}
export declare class UnitsService extends BaseEntitiesService<IRawUnit> {
    protected _repo: UnitsRepository;
    static readonly MODEL: IBaseEntities<IRawUnit>;
    protected constructor(schemaName: string);
    protected _dispose(): void;
    private static _cache;
    static createInstance: (id: number | string) => UnitsService;
}
export declare class MetricsService extends BaseEntitiesService<IRawMetric> {
    protected _repo: MetricsRepository;
    static readonly MODEL: IBaseEntities<IRawMetric>;
    protected constructor(schemaName: string);
    protected _dispose(): void;
    private static _cache;
    static createInstance: (id: number | string) => MetricsService;
}
export declare class MetricSetsService extends BaseEntitiesService<IRawMetricSet> {
    protected _repo: MetricSetsRepository;
    static readonly MODEL: IBaseEntities<IRawMetricSet>;
    protected constructor(schemaName: string);
    protected _dispose(): void;
    private static _cache;
    static createInstance: (id: number | string) => MetricSetsService;
}
export declare class LocationsService extends BaseEntitiesService<IRawLocation> {
    protected _repo: LocationsRepository;
    static readonly MODEL: IBaseEntities<IRawLocation>;
    protected constructor(schemaName: string);
    protected _dispose(): void;
    private static _cache;
    static createInstance: (id: number | string) => LocationsService;
}
export declare class PeriodsService extends BaseEntitiesService<IRawPeriod> {
    protected _repo: PeriodsRepository;
    static readonly MODEL: IBaseEntities<IRawPeriod>;
    protected constructor(schemaName: string);
    protected _dispose(): void;
    private static _cache;
    static createInstance: (id: number | string) => PeriodsService;
}
export declare class DashboardTopicsService extends BaseEntitiesService<IRawDashboardTopic> {
    protected _repo: DashboardTopicsRepository;
    static readonly MODEL: IBaseEntities<IRawDashboardTopic>;
    protected constructor(schemaName: string);
    protected _dispose(): void;
    private static _cache;
    static createInstance: (id: number | string) => DashboardTopicsService;
}
export declare class DashboardsService extends BaseEntitiesService<IRawDashboard> {
    protected _repo: DashboardsRepository;
    static readonly MODEL: IBaseEntities<IRawDashboard>;
    protected constructor(schemaName: string);
    protected _dispose(): void;
    private static _cache;
    static createInstance: (id: number | string) => DashboardsService;
}
export declare class DashletsService extends BaseEntitiesService<IRawDashlet> {
    protected _repo: DashletsRepository;
    static readonly MODEL: IBaseEntities<IRawDashlet>;
    protected constructor(schemaName: string);
    protected _dispose(): void;
    private static _cache;
    static createInstance: (id: number | string) => DashletsService;
}
export declare class ResourcesService extends BaseEntitiesService<IRawResource> {
    protected _schemaName: string;
    protected _repo: ResourcesRepository;
    private _resources;
    static readonly MODEL: IBaseEntities<IRawResource>;
    static readonly RECYCLE_BIN: string;
    protected constructor(schemaName: string);
    updateContentType(id: number, content_type: string): Promise<IRawResource>;
    updateAltId(id: number, alt_id: string): Promise<IRawResource>;
    private _uploadFile;
    updateContent(id: number, file: any): Promise<boolean>;
    createContent(file: any): Promise<IRawResource>;
    protected _isEntitiesEquals(newEntities: IRawResource[], prevEntities: IRawResource[]): boolean;
    protected _dispose(): void;
    private static _cache;
    static createInstance: (id: number | string) => ResourcesService;
}
export declare class TextDataService extends BaseEntitiesService<IRawTextData> {
    protected _repo: TextDataRepository;
    static readonly MODEL: IBaseEntities<IRawTextData>;
    protected constructor(schemaName: string);
    protected _dispose(): void;
    private static _cache;
    static createInstance: (id: number | string) => TextDataService;
}
