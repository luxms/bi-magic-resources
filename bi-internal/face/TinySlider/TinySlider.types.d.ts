import React from 'react';
interface IBaseProps {
    children: string | number | JSX.Element[] | JSX.Element | Element;
    className?: string;
}
export interface TinySliderProps extends IBaseProps {
}
export interface ITinySlider extends React.FC<TinySliderProps> {
}
export {};
