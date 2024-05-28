import React from 'react';
interface IBaseProps extends React.HTMLAttributes<HTMLElement> {
    children?: JSX.Element[] | JSX.Element | Element | string;
    className?: string;
}
export interface IAppLogoProps extends IBaseProps {
    icon?: JSX.Element | Element | string;
    altImage?: string;
    renderItem?: () => any;
}
export interface IAppLogoTextProps extends IBaseProps {
    major?: boolean;
}
export interface IAppLogo extends React.FC<IAppLogoProps> {
    Text: React.FC<IAppLogoTextProps>;
}
export {};
