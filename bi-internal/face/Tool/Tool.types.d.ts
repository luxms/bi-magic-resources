interface IToolOptions {
    as: string;
}
export interface IToolProps {
    width?: string;
    height?: string;
    className?: string;
    options?: IToolOptions;
    background?: string;
    padding?: string;
    boxShadow?: string;
    children: JSX.Element[] | JSX.Element;
}
export {};
