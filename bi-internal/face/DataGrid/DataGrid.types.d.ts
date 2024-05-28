import React from 'react';
export interface IColumnType {
    name: string;
    title: string;
}
export interface IData {
    columns: IColumnType[];
    rows: [][];
}
export interface DataGridProps {
    wrapperClassName?: string;
    className?: string;
    data: string;
    multiline?: boolean;
    stickyHeader?: boolean;
    draggable?: boolean;
    align?: string;
    columnMaxWidth?: string;
}
export interface IDataGrid extends React.FC<DataGridProps> {
}
