import { CalendarProps } from "../Calendar/Calendar.types";
import Tree from "./Tree";
export interface TreeComponentProps extends CalendarProps {
    className?: string;
    formatTitle?: (p: string) => string;
}
export interface ITreeComponenetState {
    tree: IPanelLocationsTreeTabVM;
}
export interface ITreeItemVM {
    id: string;
    title: string;
    children: ITreeItemVM[];
    expanded: boolean;
    expandable: boolean;
    expandDisabled: boolean;
    checked: boolean;
    checkable: boolean;
    color: string;
}
export interface IPanelLocationsItemVM extends ITreeItemVM {
    id: string;
    title: string;
    children: IPanelLocationsItemVM[];
    expandable: boolean;
    expanded: boolean;
    checkable: boolean;
    checked: boolean;
    onToggleExpanded?: (id: string) => void;
    onToggleChecked?: (id: string) => void;
    onContextMenu?: (id: string, x: number, y: number) => boolean;
    getChildren: (id: string) => any[] | undefined;
    defaultExpandedItem: (id: string) => boolean;
    renderItem: (item: any, needExpand: boolean) => JSX.Element;
    onClick: (id: string) => void;
    tree: Tree;
    change: boolean;
}
export interface IPanelLocationsTreeTabVM {
    loading?: boolean;
    error?: string;
    title: string;
    items: IPanelLocationsItemVM[];
}
export interface ITreeTabProps {
    rootItems: any[];
    getItemId: (id: string) => any;
    getChildren: (id: string) => any[] | undefined;
    defaultExpandedItem: (id: string) => boolean;
    renderItem: (item: any, expanded: boolean, level: number) => JSX.Element;
    onClick: (item: any) => void;
}
export interface ITreeTabState {
    change: boolean;
}
export interface ITableComponentProps {
    data: any[];
    render: any;
    size?: {
        column: string[];
    };
    scroll?: {
        left: number;
        top: number;
    };
    cellHeight?: number;
    renderItem: (item: any, expanded: boolean, level: number) => JSX.Element;
    onClick: (item: any) => void;
}
export interface ITreeComponentProps {
    rootItems: any[];
    getChildren: (item: any) => any[] | undefined;
    defaultExpandedItem: (item: any) => boolean;
    renderItem: (item: any, expanded?: boolean, level?: number) => JSX.Element;
    onClick?: (item: any) => void;
}
