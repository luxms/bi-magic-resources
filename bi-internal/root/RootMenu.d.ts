import React from 'react';

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

interface IRootMenuProp {
    tabs: IRootSegment[];
    activeTabIndex: number | null;
}

export class RootMenu extends React.Component<IRootMenuProp> {
    public constructor(props:IRootMenuProp)
}
