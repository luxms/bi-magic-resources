/**
 *
 *
 *
 */
interface IOptions {
    filter?: {
        [key: string]: string | number | null | undefined;
    };
    order_by?: string[] | string;
    limit?: number;
    offset?: number;
    meta?: boolean;
    count?: boolean;
    filters?: {
        [key: string]: string | number | null | undefined;
    };
    orderBy?: string[] | string;
}
interface IMeta {
    column_name: string;
    ordinal_position: number;
    column_default: string | null;
    is_nullable: 'YES' | 'NO';
    data_type: 'text' | 'jsonb';
    udt_schema: 'pg_catalog';
    udt_name: 'text' | 'jsonb';
}
export declare class BaseRepository<E> {
    protected _schemaName: string;
    protected _tableId: string;
    protected _baseUrl: string;
    protected _processTextResponse: (response: string) => string;
    private _options;
    protected constructor(schemaName: string, tableId: string, options?: IOptions | string[]);
    meta(): Promise<IMeta[]>;
    create(entity: Partial<E>): Promise<E>;
    createMany(entities: Partial<E>[]): Promise<E[]>;
    updateMany(entities: Partial<E>[]): Promise<E[]>;
    list(): Promise<E[]>;
    find(expr: IOptions): Promise<E[]>;
    getById(id: string | number): Promise<E>;
    update(id: string | number, entity: Partial<E>): Promise<E>;
    remove(id: string | number): Promise<any>;
    getSchemaName(): string;
    getTableName(): string;
    getOrderBy(): string[] | null;
    getFilters(): IOptions;
    getOptions(): IOptions;
    protected _getUrl(method: 'GET' | 'POST' | 'PUT' | 'DELETE', id?: string | number): string;
    protected _sort(es: E[]): void;
    protected _unpack(e: any): E;
    protected _pack(e: Partial<E>): any;
    protected _filter(e: E): boolean;
    private static createExpression;
    private _doRequest;
}
export {};
