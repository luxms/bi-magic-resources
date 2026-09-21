import React from 'react';
export declare class RootHeader extends React.Component<any, any> {
    state: {
        etlConfig: any;
        errorCollectorButtonVC: any;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    private _onBrandServiceUpdated;
    private _initErrorCollectorButton;
    render(): React.JSX.Element;
}
