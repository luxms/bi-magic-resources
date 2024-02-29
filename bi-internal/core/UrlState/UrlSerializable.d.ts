/**
 *
 *
 *
 *
 *
 */
export default class UrlSerializable {
    private readonly _structure;
    constructor(structure: any);
    serializeSearch(urlObject: any): string;
    private _parseFilterExpression;
    deserializeSearch(urlString: string): any;
}
