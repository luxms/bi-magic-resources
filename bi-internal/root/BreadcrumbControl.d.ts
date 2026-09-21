import React from 'react';
interface IBreadcrumbItem {
    readonly id: string | number;
    readonly title: string;
    readonly url?: string;
    readonly description?: string | React.ReactNode;
}
interface IBreadcrumbControlState {
    readonly list: IBreadcrumbItem[];
    readonly path: Array<string | number>;
    readonly schemaName: string;
    readonly dboard: string | number;
    readonly dash: string;
    readonly topic: number;
    readonly cfg: any;
}
interface IBreadcrumbControlProps {
    readonly dsTitle: string;
    readonly dsDescription: string;
    readonly dashboardCfg: any;
}
declare class BreadcrumbControl extends React.Component<any, Partial<IBreadcrumbControlState>> {
    private readonly _urlState;
    private readonly _datasetsTopicsService;
    private readonly _datasetsService;
    private readonly _datasetTopicsMapsService;
    private _dashboardsService;
    private _dashletsService;
    private _dashboardTopicsService;
    private _dsStateService;
    readonly state: IBreadcrumbControlState;
    constructor(props: IBreadcrumbControlProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<IBreadcrumbControlState>): void;
    componentWillUnmount(): void;
    private _onUpdateModel;
    private _getDatasetTopicId;
    private _getDatasetTopicTitle;
    private _getDashBoardTopicTitle;
    private _getDatasetTitle;
    private _getDatasetDescription;
    private _getDashboardTitle;
    private _getDashTitle;
    private _getDashDescription;
    private _getDashboardId;
    private _getDashboardTopicId;
    private _createBreadcrumbList;
    private _getBreadcrumb;
    private _onClick;
    private _renderItem;
    render(): React.JSX.Element;
}
export default BreadcrumbControl;
