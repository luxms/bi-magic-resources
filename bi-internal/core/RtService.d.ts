/**
 *
 *
 */
import { BaseService } from './BaseService';
import { IDisposable } from './Observable';
export interface IRtModel {
    loading?: boolean | number;
    error?: string | null;
    connected: boolean;
}
export interface IRtMessage {
    type: string;
    payload: any;
}
export declare type IRtDatasetSubscriptionCallback = (type: string, payload: any) => void;
export declare class RtService extends BaseService<IRtModel> {
    private _dsSubscriptions;
    private _connection;
    private _session;
    private _client;
    constructor();
    private _rSocketSubscriptions;
    private _subscribeDataset;
    unsubscribeDataset(schema_name: string, callback: (type: string, payload: any) => void): boolean;
    subscribeDataset(schemaName: string, callback: (type: string, payload: any) => void): IDisposable;
    publishDsMessage(schema_name: string, type: string, payload: any): void;
    onInternalDataUpdated(schemaName: string, mlpvPtrs: any): void;
    private _reload;
    private _onReceivedDsRtMessages;
    private _notifyDsRtMessages;
    private _onConnected;
    private _getUrl;
    private _connect;
    private _disconnect;
    static getInstance: () => RtService;
    static publishDsMessage(schemaName: string, type: string, payload: any): void;
}
