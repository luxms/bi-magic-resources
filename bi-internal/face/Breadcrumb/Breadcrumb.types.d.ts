export interface IBreadcrumbListItem {
    [id: string]: any;
    id: string | number;
    title: string;
    path?: string;
}
export interface IBreadcrumb {
    readonly list: IBreadcrumbListItem[];
    readonly onClickPath?: (item: IBreadcrumbListItem, idx: number, list: IBreadcrumbListItem[]) => void;
}
