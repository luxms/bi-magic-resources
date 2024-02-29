export interface ShapeProps {
    rgba?: string;
    hex?: string;
    alpha?: number;
    className?: string;
    background?: string;
    borderRadius?: number;
    children: JSX.Element[] | JSX.Element | string | number;
}
