import { BaseService, srv, repo, IBaseModel } from '../core';
export interface IRawDboardDashletMode extends repo.ds.IRawDashboard {
}
export interface IRawDbordTopicMode extends repo.ds.IRawDashboardTopic {
}
export interface IDashboardsByTopicsModel extends IBaseModel {
    readonly topics: IRawDbordTopicMode[];
    readonly dashboards: IRawDboardDashletMode[];
}
/**
 * @deprecated
 * используйте TransactionDatasetTriggerService и сами children формируйте
 */
export declare class DashboardByTopicsService extends BaseService<IDashboardsByTopicsModel> {
    private readonly _schemaName;
    dashboardTopicsService: srv.ds.DashboardTopicsService;
    dashboardsService: srv.ds.DashboardsService;
    private dashletsService;
    constructor(schemaName: string);
    private _onServiceUpdate;
    protected _dispose(): void;
}
