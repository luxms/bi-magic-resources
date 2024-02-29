import { BaseRepository } from './BaseRepository';
export interface IRawCube {
    id: string;
    source_ident: string;
    name: string;
    title: string;
    sql_query: string;
    config: any;
}
export declare class CubesRepository extends BaseRepository<IRawCube> {
    constructor();
}
export interface IRawDimension {
    id: string;
    source_ident: string;
    cube_name: string;
    name: string;
    type: 'STRING' | 'NUMBER' | 'PERIOD' | 'SUM' | 'AGGFN';
    title: string;
    sql_query: string;
    config: any;
}
export declare class DimensionsRepository extends BaseRepository<IRawDimension> {
    source_ident?: string;
    cube_name?: string;
    constructor(source_ident?: string, cube_name?: string);
}
