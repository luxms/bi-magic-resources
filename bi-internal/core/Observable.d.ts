/**
 *
 *
 *
 */
import { Retainable, IRetainable } from './Retainable';
export interface IDisposable {
    dispose(): void;
}
export interface IObservable extends IRetainable {
    subscribe(event: string, listener: any): IDisposable;
}
export declare class Observable extends Retainable implements IObservable {
    private _listeners;
    constructor();
    protected _notify(eventDescription: string | ((event: string) => boolean), ...args: any[]): void;
    subscribe(event: string, listener: any): IDisposable;
    unsubscribe(listener: (...args: any[]) => any): boolean;
    once(event: string, listener: any): IDisposable;
    /**
     * Wait the observer to signal specified event
     *
     * usage:
     *     eventData = await observer.happens('custom-event');
     *     observer.happens('custom-event').then((eventData) => ...);
     *
     * @param {string} event
     * @returns {Promise<any>}
     */
    happens(event: string): Promise<any>;
    protected _dispose(): void;
}
