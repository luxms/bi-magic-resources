import React = require("../../../defs/react");
interface IBaseProps {
    children: string | number | JSX.Element[] | JSX.Element | Element;
    className?: string;
}
export interface LoginDemoItemImageProps extends IBaseProps {
}
export interface LoginDemoItemDescProps extends IBaseProps {
}
export interface LoginDemoItemTitleProps {
    children: any;
    className?: string;
    background?: string;
}
export interface LoginDemoItemProps extends IBaseProps {
    background?: string;
}
export interface LoginDemoProps extends IBaseProps {
}
export interface ILoginDemo extends React.FC<LoginDemoProps> {
    Item: React.FC<LoginDemoItemProps>;
    ItemTitle: React.FC<LoginDemoItemTitleProps>;
    ItemDesc: React.FC<LoginDemoItemDescProps>;
    ItemImage: React.FC<LoginDemoItemImageProps>;
}
export {};
