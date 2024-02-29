import React = require("../defs/react");


interface IOnlyWhenVisibleProps {
    readonly className?: string;
    readonly children: any;
    readonly fallback?: () => any;
}

/**
 * @description Обертка, которая позволяет не грузить полностью контент, если он находится вне зоны видимости при скролле.
 */
export class OnlyWhenVisible extends React.Component<IOnlyWhenVisibleProps>{
    public constructor(props: IOnlyWhenVisibleProps)
    public render(): React.JSX.Element;
}
export default OnlyWhenVisible;