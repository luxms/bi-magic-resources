import React = require("../../defs/react");
interface IBaseProps {
    children: string | number | JSX.Element[] | JSX.Element | Element;
    className?: string;
}
export interface TinySliderProps extends IBaseProps {
}
export interface ITinySlider extends React.FC<TinySliderProps> {
}
export {};
