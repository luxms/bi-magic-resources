import React = require("../../defs/react");
export interface IAccountToolProps extends React.HTMLAttributes<HTMLElement> {
    title?: string;
    icon1?: JSX.Element | Element;
    icon2?: JSX.Element | Element;
    menu: JSX.Element | Element;
    className?: string;
    onShow?: (instance: any) => void;
    onHide?: (instance: any) => void;
    visible?: boolean;
    onClickOutside?: (instance: any) => void;
    onClick?: (instance: any) => void;
}
