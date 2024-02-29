export interface IGeometryParameters {
    width: number;
    height: number;
    top: number;
    bottom: number;
    left: number;
    right: number;
    x: number;
    y: number;
}
export declare type SubscribeParameters = Array<'width' | 'height' | 'top' | 'bottom' | 'left' | 'right' | 'x' | 'y'> | 'width' | 'height' | 'top' | 'bottom' | 'left' | 'right' | 'x' | 'y';
export interface IElementSubscriber {
    subscribeParameters: SubscribeParameters;
    subscriber: (currentData: IGeometryParameters, previousData: IGeometryParameters) => any;
}
export interface IElementObserver {
    element: HTMLElement;
    elementGeometry: IGeometryParameters;
    subscribers: Array<IElementSubscriber>;
    subscribe: (fn: Function, subscribeParameters: SubscribeParameters) => any;
    unsubscribe: (fn: Function) => any;
    _notify: (currentData: IGeometryParameters, previousData: IGeometryParameters) => void;
}
declare class GeometryObserver {
    private static _instance;
    private _elementsObserver;
    private _tracking;
    static getInstance(): GeometryObserver;
    private _watch;
    addSubscription(element: HTMLElement, callback: (currentData?: IGeometryParameters, previousData?: IGeometryParameters) => any, parameters?: SubscribeParameters): any;
    removeSubscription(element: HTMLElement, callback: (currentData?: IGeometryParameters, previousData?: IGeometryParameters) => any): void;
    watch(): void;
}
export default GeometryObserver;
