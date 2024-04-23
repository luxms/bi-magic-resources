import React from 'react';
export declare type ISizes = 'sm' | 'md' | 'lg';
export declare type IVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'link' | 'plain' | '4';
export declare type IWidth = number | string;
export declare type IBoxShadow = boolean | string;
export interface ButtonProps {
    children: React.ReactNode | string;
    disabled?: boolean;
    title?: string;
    style?: {
        [id: string]: string;
    };
    size?: ISizes;
    width?: IWidth;
    variant?: IVariant;
    boxShadow?: IBoxShadow;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    className?: string;
    rightIconWrapperClassname?: string;
    leftIconWrapperClassname?: string;
    onClick?: (e: any) => any;
}
