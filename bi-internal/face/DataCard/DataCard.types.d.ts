import React from 'react';
interface IBaseProps {
    children: string | number | JSX.Element[] | JSX.Element | Element;
    className?: string;
}
export interface DataCardProps extends IBaseProps {
    backgroundTheme: 'purple' | 'darkBlue' | 'blue' | 'pink' | 'green' | 'orange';
    background?: string;
    icon: JSX.Element[] | JSX.Element | Element;
}
export interface DataCardTitleProps extends IBaseProps {
}
export interface DataCardSubTitleProps extends IBaseProps {
    value?: string | number;
}
export interface IDataCard extends React.FC<DataCardProps> {
    Title: React.FC<DataCardTitleProps>;
    SubTitle: React.FC<DataCardSubTitleProps>;
}
export {};
