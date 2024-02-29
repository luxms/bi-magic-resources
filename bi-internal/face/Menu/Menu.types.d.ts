import React = require("../../defs/react");
interface IBaseProps {
    children?: any;
    className?: string;
}
export interface MenuToggleControlsProps extends IBaseProps {
}
export interface MenuControlProps {
    className?: string;
    mark: string;
    icon?: JSX.Element | Element | string;
}
export interface MenuToolkitProps extends IBaseProps {
}
export interface MenuFooterProps extends IBaseProps {
}
export interface MenuSeparatorProps extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    innerRef?: any;
}
export interface MenuItemProps {
    children: React.ReactNode;
    className?: string;
    title: string;
    icon?: JSX.Element | Element | string;
    imgAlt?: string;
    active?: boolean;
    href?: string;
    level?: number;
    tooltipMode?: boolean;
    iconDropdown?: React.ReactNode;
    onIconClick?: () => any;
    iconDropdownVisible?: boolean;
    iconDropdownOutsideClick?: () => any;
    iconDropdownProps?: any;
}
export interface MenuSubListProps extends IBaseProps {
    title: string;
    icon?: JSX.Element | Element | string;
    highlight?: boolean;
    treeLevel: number;
    tooltipMode?: boolean;
}
export interface MenuListProps extends IBaseProps {
}
export interface MenuContentProps extends IBaseProps {
    innerRef?: any;
    style?: {
        [id: string]: string;
    };
}
export interface MenuHeaderProps extends IBaseProps {
}
export interface MenuProps extends IBaseProps {
    onHidden?: () => any;
    onCompact?: () => any;
    onExpanded?: () => any;
}
export interface IMenu extends React.FC<MenuProps> {
    Header: React.FC<MenuHeaderProps>;
    Content: React.FC<MenuContentProps>;
    List: React.FC<MenuListProps>;
    SubList: React.FC<MenuSubListProps>;
    Item: React.FC<MenuItemProps>;
    Separator: React.FC<MenuSeparatorProps>;
    Footer: React.FC<MenuFooterProps>;
    Toolkit: React.FC<MenuToolkitProps>;
    ToggleControls: React.FC<MenuToggleControlsProps>;
    Control: React.FC<MenuControlProps>;
}
export {};
