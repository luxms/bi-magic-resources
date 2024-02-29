import React = require("../defs/react")
import {ISummaryModel} from '../services/services'

export interface IRootSegment {
    title: string;
    url: string;
    bgUrl: string;
    key: string;
    bgColor?: string;
    getTabElementClass?(): any;
    getBodyElementClass?(): any;
    getIcon?(): any;
    tabElementClassCached?: any;    // TODO: move to View class
    bodyElementClassCached?: any;   // TODO: move to View class
}

export interface IRootVM {
    viewClassId: 'Root/Root';
    error: string;
    loading: boolean;
    tabs: IRootSegment[];
    summary: ISummaryModel;
    activeTabIndex: number;
    activeTab: IRootSegment;
    showHeader: boolean;
}

export class RootContent extends React.Component<IRootVM> {
    public constructor(props:IRootVM)
}