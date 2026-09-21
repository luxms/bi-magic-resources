export * from './utils/utils'
export * from './utils/list';
export * from './utils/c-utils'
export * from './utils/lpe'
export * from './utils/vizel_config'

import {mouseWatcher} from './utils/MouseWathcer';
import {vizel_config} from './utils/vizel_config';

declare module 'wellknown' {
    export function parse(wktString: string): any;
}

/**
 * @param {number} value
 * @param  {string} format
 * @description https://www.npmjs.com/package/format-number-with-string
 */
export declare function formatNumberWithString(value: number, format: string): string


export {mouseWatcher, vizel_config};

export type {
    IBiQuery,
    IColorsProvider,
    ICubeProvider,
    IDataMatrixProvider,
    IDataProvider,
    IMLPSubscribeCallback,
    IMatrixProvider,
    INormZone,
    INormsProvider,
    INormsResponse,
    IRawDataProvider,
    IRawRequest,
    IRawResponse,
    ISubscribeCallback,
    IValueProvider,
    IVectorProvider,
} from './defs/data-manip';

export interface IColor {
    toRGB(): any;
    toHSV(): any;
    add(d1: number, d2: number, d3: number): IColor;
    mul(x1: number, x2: number, x3: number): IColor;
    toString(): string;
}

export interface ICreateDataMatrix {
    readonly xs: any[];
    readonly ys: any[];
    readonly z: any;
    readonly matrix: any[][];
    readonly normsResponses: any[];
}

export interface IDataMatrix {
    readonly xs: any[];
    readonly ys: any[];
    readonly z: any;
    readonly matrix: any[][];
    readonly normsResponses: any[];
    getY(idx: number | string): any;
    getX(idx: number | string): any;
    getVectorY(x: number | any): any[];
    getVectorX(y: number | any): any[];
    getNormsResponse(y: number | any): any;
    hasData(): boolean;
    hasNumericData(): boolean;
}

export type IGradientEchartsColorStop = {offset: number, color: string};

export interface IVizelDescription {
    viewClass: string;
    chartStyle: string;
    [key: string]: any;
}

export declare const VIZEL_YVC_TYPES: string[];
export declare const DASHLET_MIME_TYPE: string;
export declare const DASHBOARD_MIME_TYPE: string;
export declare const DIMENSION_ID_MIME_TYPE: string;
export declare const SUBTOTAL_ID_MIME_TYPE: string;
export declare const MEASURE_ID_MIME_TYPE: string;
export declare const FILTERS_ID_MIME_TYPE: string;
export declare const HIERARCHY_ID_MIME_TYPE: string;
export declare const XLSX_MIME_TYPE: string;
export declare const DS_VAR_MIME_TYPE: string;
export declare const MessageHub: any;

export declare function makeObjectConfig(treeConfig: { [id: string]: any }, prefix?: string): any;
export declare function ruKbdToEng(s: string): string;
export declare function extractMeasureName(formula: string): string;
export declare function getVars(measures: string[] | string): string[];
export declare function replaceVars(entities: string[], vars: Record<string, unknown>): string[];
export declare function replaceVar(entity: string, vars: Record<string, unknown>): string;
export declare function extractVarsFromVarsModel(varsModel: Record<string, any>): Record<string, unknown>;
export declare function stringifyForLPE(v: any): string;
export declare function extractDimensionTitle(rawFormula: string, style?: Record<string, any>, title?: string): string;
export declare function makeHashFromList(...args: any[]): Record<string, any>;
export declare function isFloat(n: any): boolean;
export declare function isMDXBehaviour(cube: any): boolean;
export declare function isGlobalCube(cube: any): boolean;
export declare function findAllChildren<T extends {id: number | string, parent_id: number | string}>(id: T['id'], items: T[]): T[];
export declare function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T;
export declare function filterObject<T extends object>(obj: T): Partial<T>;
export declare function copyTextToClipboard(text: string): Promise<any>;
export declare function readTextFromClipboard(): Promise<any>;

export declare function urlExtractParams(url: string): any;
export declare function replaceNavigateWithSubstitutions(eventDescription: string, repl: any): any;
export declare function markContinuousPeriodType<E extends any>(es: E[], cpt: [number, number] | null): E[];

export declare function makeEchartsGradient(gradientType: string, baseColor: string, chartType?: string): any;

export declare function vectorMin(vec: any[]): number;
export declare function vectorMax(vec: any[]): number;
export declare function matrixMin(mtx: any[][]): number;
export declare function matrixMax(mtx: any[][]): number;
export declare function cubeMin(cub: any[][][]): number;
export declare function cubeMax(cub: any[][][]): number;
export declare function sum(...args: number[]): number;
export declare function vectorSum(vec: number[]): number;
export declare function matrixSum(mtx: number[][]): number;
export declare function cubeSum(cub: number[][][]): number;
export declare function vectorSumNull(vec: number[]): number | null;
export declare function createConstVector<T>(v: T, x: number): T[];
export declare function createConstMatrix<T>(v: T, y: number, x: number): T[][];
export declare function createConstCube<T>(v: T, z: number, y: number, x: number): T[][][];
export declare function createNullVector<T>(x: number): T[];
export declare function createNullMatrix<T>(y: number, x: number): T[][];
export declare function createNullCube<T>(z: number, y: number, x: number): T[][][];
export declare const isNullValue: (val: any) => boolean;
export declare const isNullVector: (vec: any[]) => boolean;
export declare const isNullMatrix: (mtx: any[][]) => boolean;
export declare const isNullCube: (cub: any[][][]) => boolean;
export declare const isNumberValue: (val: any) => boolean;
export declare const isNumberVector: (vec: any[]) => boolean;
export declare function matrixTranspose<T>(mtx: T[][]): T[][];
export declare function vectorHasNumericData(vec: any[]): boolean;
export declare function matrixHasNumericData(mtx: any[][]): boolean;
export declare function createDataMatrix(args: ICreateDataMatrix): IDataMatrix;

export declare const L: any;
export declare const wktParse: (wktString: string) => any;
export declare const langL: (template: TemplateStringsArray, ...args: any[]) => string;
export declare const skin: {
    'main-font-family': string;
};
export declare const getBuildVersion: () => string | undefined;
export declare const getBuildDate: () => string | undefined;
export declare const LoadFromResources: any;
export declare const createAtlasLpeForReact: any;
export declare const lpe: any;
export declare const MapService: any;
export declare const OptionsProvider: any;
export declare const lpeBaseContext: any;

/**
 * Runtime namespace object exported by `bi-internal/utils`.
 */
declare const _default: Record<string, any> & {
    vizel_config: any;
    L: any;
    wktParse: (wktString: string) => any;
    formatNumberWithString: typeof formatNumberWithString;
    langL: (template: TemplateStringsArray, ...args: any[]) => string;
    mouseWatcher: typeof mouseWatcher;
    skin: {
        'main-font-family': string;
    };
    lpeRun: (...args: any[]) => any;
    getBuildVersion: () => string | undefined;
    getBuildDate: () => string | undefined;
    LoadFromResources: any;
    lpe: any;
    MapService: any;
    OptionsProvider: any;
    lpeBaseContext: any;
};

export default _default;
