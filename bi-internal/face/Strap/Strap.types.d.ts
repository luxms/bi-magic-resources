import React from 'react';
interface IBaseProps {
    children: string | number | JSX.Element[] | JSX.Element | Element;
    className?: string;
}
export interface StrapBodyProps extends IBaseProps {
}
export interface StrapContentProps extends IBaseProps {
}
export interface StrapProps extends IBaseProps {
}
export interface IStrap extends React.FC<StrapProps> {
    Body: React.FC<StrapBodyProps>;
    Content: React.FC<StrapContentProps>;
}
export {};
