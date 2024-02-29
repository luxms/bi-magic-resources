import React = require("../../defs/react");
export declare type Sizes = 'sm' | 'md' | 'lg';
interface IBaseProps {
    children: string | number | JSX.Element[] | JSX.Element | Element;
    className?: string;
}
export interface FormNoticeProps {
    children?: string | number | JSX.Element[] | JSX.Element | Element;
    className?: string;
    message: string;
    icon: string | number | JSX.Element | Element;
    color?: string;
    show: boolean;
    error: boolean;
    position?: string;
}
export interface FormLogoProps {
    children?: string | number | JSX.Element[] | JSX.Element | Element;
    className?: string;
}
export interface FormInputProps {
    className?: string;
    children?: string | number | JSX.Element[] | JSX.Element | Element;
    iconStart?: JSX.Element[] | JSX.Element | Element;
    iconEnd?: JSX.Element[] | JSX.Element | Element | boolean;
    type: string;
    placeholder?: string;
    iconEndProps?: any;
    value?: any;
    onChange?: (value: any) => any;
    autoFocus?: boolean;
    autoComplete?: string;
    size?: Sizes;
}
export interface FormProps extends IBaseProps {
}
export interface IForm extends React.FC<FormProps> {
    Input: React.FC<FormInputProps>;
    Logo: React.FC<FormLogoProps>;
    Notice: React.FC<FormNoticeProps>;
}
export {};
