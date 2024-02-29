import React = require("../../defs/react");
interface IBaseProps extends React.HTMLAttributes<HTMLElement> {
    children: JSX.Element[] | JSX.Element | Element[] | Element | string;
    className?: string;
}
export interface HeaderTitleProps extends IBaseProps {
    highlighted?: boolean;
}
export interface HeaderProps extends IBaseProps {
}
export interface IHeader extends React.FC<HeaderProps> {
    Title: React.FC<HeaderTitleProps>;
}
export {};
