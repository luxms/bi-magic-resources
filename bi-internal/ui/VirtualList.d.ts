import React = require("../defs/react");

interface IVirtualListProps {
    readonly className?: string;
    readonly items: { length: number };                                                                          // array-like
    readonly renderItem: (item: any, idx: number) => any;
    readonly defaultsize?: number;
}

export class VirtualList extends React.Component<IVirtualListProps> {
    public constructor(props: IVirtualListProps)
    public render(): React.JSX.Element;
}
export default VirtualList;
