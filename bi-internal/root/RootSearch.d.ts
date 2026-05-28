import React from 'react';
interface IRootSearch {
    readonly search: string;
    readonly visible: boolean;
}
/**
 * @deprecated
 * @description Старый компонент используется для глобального поиска у таких разделов как обсуждения, новости, чаты
 */
export declare class RootSearch extends React.Component<any, IRootSearch> {
    private readonly _searchVC;
    private readonly _urlState;
    private readonly _inputRef;
    readonly state: IRootSearch;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(_: any, prevState: Readonly<IRootSearch>): void;
    componentWillUnmount(): void;
    private _onUpdateModel;
    private _onUrlUpdate;
    render(): React.JSX.Element;
}
export {};
