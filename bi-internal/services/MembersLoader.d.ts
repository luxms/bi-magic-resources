/**
 * Project-side shim for the moved-out MembersLoader.
 *
 * The implementation now lives in `@bi/datafun` and accepts a pre-resolved
 * cube + dimensions snapshot. Call sites that previously instantiated
 * `MembersLoader` directly should switch to the PagedAxis React component
 * which handles the cube/dimensions lifecycle.
 */
export interface IMembersLoaderOptions {
    readonly [key: string]: any;
}
export interface IMembersLoaderModel {
    readonly loading?: boolean;
    readonly error?: string | null;
    readonly [key: string]: any;
}
export declare const MembersLoader: any;
export declare const QMembersLoader: any;
export default MembersLoader;
