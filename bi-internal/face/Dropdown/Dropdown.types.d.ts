import React from 'react';
interface IBaseProps {
    children: JSX.Element[] | Element[] | JSX.Element | Element | any;
    className?: string;
}
interface IReferenceClientRect {
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
}
export interface IDropdownContainerProps extends IBaseProps {
}
export interface DropdownTriggerProps extends IBaseProps {
    menu: React.ReactNode;
    appendTo?: any;
    aria?: any;
    delay?: number | [number | null, number | null];
    getReferenceClientRect?: () => IReferenceClientRect;
    hideOnClick?: true | false | 'toggle';
    ignoreAttributes?: boolean;
    interactive?: boolean;
    interactiveBorder?: number;
    interactiveDebounce?: number;
    moveTransition?: string;
    offset?: [number, number];
    onAfterUpdate?: (instance: any, partialProps: any) => void;
    onBeforeUpdate?: (instance: any, partialProps: any) => void;
    onClickOutside?: (instance: any, event: any) => void;
    onCreate?: (instance: any) => void;
    onDestroy?: (instance: any) => void;
    onHidden?: (instance: any) => void;
    onHide?: (instance: any) => void;
    onMount?: (instance: any) => void;
    onShow?: (instance: any) => void;
    onTrigger?: (instance: any, event: any) => void;
    onUntrigger?: (instance: any, event: any) => void;
    placement?: 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'auto' | 'auto-start' | 'auto-end';
    plugins?: any[];
    popperOptions?: any;
    render?: any;
    showOnCreate?: boolean;
    touch?: true | false | 'hold' | ['hold', number];
    trigger?: 'mouseenter focus' | 'click' | 'focusin' | 'mouseenter click' | 'manual';
    triggerTarget?: any;
    zIndex?: number;
    visible?: boolean;
    onClick?: (event: any) => void;
}
export {};
