import React from 'react';
interface IBaseProps {
    children: string | number | JSX.Element[] | JSX.Element | Element;
    className?: string;
}
export interface LoginProps extends IBaseProps {
    loginWithDemo?: boolean;
    background?: string;
}
export interface ILogin extends React.FC<LoginProps> {
}
export {};
