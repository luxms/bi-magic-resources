/**
 *
 *
 *
 */
import { BaseService } from '../core';
import { IDatasetModel, IDsStateService } from '../defs/types';
export interface IDsShellVM {
    viewClassId: 'DsShell';
    loading?: boolean;
    error?: string;
    id: string;
    schema_name: string;
    schemaName: string;
    eastPanel: any;
    westPanel: any;
    northPanel: any;
    eastPanelEnabled: boolean;
    westPanelEnabled: boolean;
    northPanelEnabled: boolean;
    datasetTitle: string;
    datasetDescriptionHTML: string;
    datasetUrl: string;
    route: string;
    toggleEastPanel?: () => void;
    toggleWestPanel?: () => void;
    toggleNorthPanel?: () => void;
    dataset: IDatasetModel;
    state: IDsStateService;
    embeddingSession?: boolean;
}
export declare class DsShellVC extends BaseService<IDsShellVM> {
    id: string;
    private _dsStateService;
    private _panelLocationsVC;
    private _panelMetricsVC;
    private _dataset;
    constructor(dsId: string);
    private _onServiceUpdated;
    private _onToggleEastPanel;
    private _onToggleWestPanel;
    private _onToggleNorthPanel;
    protected _dispose(): void;
}
