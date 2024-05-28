export * from './utils/utils'
export * from './utils/list';
export * from './utils/c-utils'
export * from './utils/lpe'
export * from './utils/vizel_config'

import {mouseWatcher} from './utils/MouseWathcer';

declare module 'wellknown' {
    export function parse(wktString: string): any;
}

/**
 * @param {number} value
 * @param  {string} format
 * @description https://www.npmjs.com/package/format-number-with-string
 */
export declare function formatNumberWithString(value: number, format: string): string


export {mouseWatcher}
