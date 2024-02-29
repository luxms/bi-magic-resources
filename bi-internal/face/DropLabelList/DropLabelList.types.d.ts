import React = require("../../defs/react");
export interface IColumnType {
    name: string;
    title: string;
}
export interface IItem {
    title: string;
    name: string;
}
export interface IDropLabelListProps {
    itemClassName?: string;
    className?: string;
    multiline?: boolean;
    itemWidth?: string;
    border?: string;
    closeButtonAlreadyShown?: boolean;
    onDataChange: (items: IItem[]) => void;
}
export interface IDropLabelList extends React.FC<IDropLabelListProps> {
}
