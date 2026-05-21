import { BaseService } from '../core';
import { ISubspacePtr } from '../defs/bi';
import { ISubspaceModel } from './dataset';

/** Builds koob subspace axes asynchronously and reloads them when filters change. */
export class KoobSubspaceAsyncService extends BaseService<ISubspaceModel> {
    public constructor(schemaName: string, subspacePtr: ISubspacePtr, ctorOptions?: Partial<{ restrictiveFilters: any }>);
    public setSuspended(suspended: boolean): void;
}

export default KoobSubspaceAsyncService;
