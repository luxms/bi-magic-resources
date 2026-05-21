import { BaseService, IBaseModel, repo, srv } from '../core';

export interface IRawDboardDashletMode extends repo.ds.IRawDashboard {}
export interface IRawDbordTopicMode extends repo.ds.IRawDashboardTopic {}

export interface IDashboardsByTopicsModel extends IBaseModel {
    readonly topics: IRawDbordTopicMode[];
    readonly dashboards: IRawDboardDashletMode[];
}

/**
 * @deprecated Use transaction dataset services and build children manually.
 */
export class DashboardByTopicsService extends BaseService<IDashboardsByTopicsModel> {
    public dashboardTopicsService: srv.ds.DashboardTopicsService;
    public dashboardsService: srv.ds.DashboardsService;
    public constructor(schemaName: string);
}
