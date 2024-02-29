import { BaseRepository } from './BaseRepository';
export interface IRawConfig {
    id: number;
    cfg_key: string;
    cfg_val: string;
    cfg_type: string | null;
    updated: string;
    created: string;
}
export declare class ConfigsRepository extends BaseRepository<IRawConfig> {
    constructor(schemaName: string);
}
export interface IRawUnit {
    id: number;
    parent_id: number | null;
    scale: number;
    scale_op: '*';
    value_prefix: string | null;
    value_suffix: string | null;
    title: string;
    tiny_title: string;
    axis_title: string;
    config: any;
    updated: string;
    created: string;
}
export declare class UnitsRepository extends BaseRepository<IRawUnit> {
    constructor(schemaName: string);
}
export interface IRawMetric {
    id: number;
    parent_id: number | null;
    tree_level: number;
    tree_path: string | null;
    title: string;
    unit_id: number | null;
    is_text_val: 0 | 1;
    is_norm: 0 | 1;
    is_calc: 0 | 1;
    formula: null;
    is_hidden: 0 | 1;
    srt: number;
    tags: string[];
    src_id: string | null;
    alt_id: string | null;
    config: any;
    updated: string;
    created: string;
}
export declare class MetricsRepository extends BaseRepository<IRawMetric> {
    constructor(schemaName: string);
}
export interface IRawMetricSet {
    id: number;
    title: string;
    can_be_pie: number;
    config: any;
    updated: string;
    created: string;
}
export declare class MetricSetsRepository extends BaseRepository<IRawMetricSet> {
    constructor(schemaName: string);
}
export interface IRawLocation {
    id: number;
    parent_id: number | null;
    tree_level: number;
    tree_path: string | null;
    title: string;
    latitude: number;
    longitude: number;
    is_hidden: 0 | 1;
    srt: number;
    tags: string[];
    src_id: null;
    alt_id: string | null;
    config: any;
    updated: string;
    created: string;
}
export declare class LocationsRepository extends BaseRepository<IRawLocation> {
    constructor(schemaName: string);
}
export interface IRawPeriod {
    id: number;
    parent_id: number | null;
    tree_level: number;
    period_type: number;
    qty: number;
    start_time: string;
    title: string;
    tags: string[];
    src_id: null;
    alt_id: string | null;
    tree_path: string | null;
    config: any;
    updated: string;
    created: string;
}
export declare class PeriodsRepository extends BaseRepository<IRawPeriod> {
    constructor(schemaName: string);
    protected _processTextResponse: (response: string) => string;
    protected _sort(es: IRawPeriod[]): void;
}
export interface IRawDashboardTopic {
    id: number;
    parent_id: number | null;
    icon_id: number;
    title: string;
    tree_level: number;
    srt: number;
    config: any;
    updated: string;
    created: string;
}
export declare class DashboardTopicsRepository extends BaseRepository<IRawDashboardTopic> {
    constructor(schemaName: string);
}
export interface IRawDashboard {
    id: number;
    topic_id: number;
    icon_id: number;
    title: string;
    srt: number;
    config: any;
    updated: string;
    created: string;
}
export declare class DashboardsRepository extends BaseRepository<IRawDashboard> {
    constructor(schemaName: string);
}
export interface IRawDashlet {
    id: number;
    parent_id: number | null;
    dashboard_id: number;
    view_class: string;
    title: string;
    description: string | null;
    layout: '' | 'V' | 'H';
    length: '';
    idx: number;
    config: any;
    updated: string;
    created: string;
}
export declare class DashletsRepository extends BaseRepository<IRawDashlet> {
    constructor(schemaName: string);
    protected _sort(es: IRawDashlet[]): void;
}
export interface IRawAttachment {
    id: number;
    config: any;
    title: string;
    attachment_type: 'vcp-lookup-table' | 'metric-values' | 'external-metric';
    during?: string;
    m_where?: string;
    l_where?: string;
    p_where?: string;
    pt_where?: string;
    u_where?: string;
    data_source?: string;
    norm_id?: number;
    payload?: string;
    alt_payload?: string;
}
export declare class AttachmentsRepository extends BaseRepository<IRawAttachment> {
    constructor(schemaName: string);
}
export interface IRawResource {
    id: number;
    alt_id: string;
    content_type: string;
    content_length: number;
    created: string;
    updated: string;
    config: any;
}
export declare class ResourcesRepository extends BaseRepository<IRawResource> {
    constructor(schemaName: string);
}
export interface IRawTextData {
    id: number;
    metric_id: number;
    loc_id: number;
    period_id: number;
    val: string;
}
export declare class TextDataRepository extends BaseRepository<IRawTextData> {
    constructor(schemaName: string);
    protected _processTextResponse: (response: string) => string;
}
