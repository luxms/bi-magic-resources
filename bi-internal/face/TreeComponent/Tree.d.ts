declare class NodeTree {
    expanded: boolean | undefined;
    parent: NodeTree;
    children: NodeTree[];
    level: number;
    item: any;
    multiRoot: boolean;
    constructor({ expanded, level, item, multiRoot, parent }: {
        expanded: any;
        level?: number;
        item?: any;
        multiRoot?: boolean;
        parent?: any;
    });
}
export interface ITreeData {
    readonly list: NodeTree[];
    readonly _root: NodeTree;
    expandNode(node: NodeTree): void;
}
declare class Tree implements ITreeData {
    _root: NodeTree;
    list: NodeTree[];
    private getChildren;
    private defaultExpandedItem;
    constructor({ data, numberOfElements, getChildren, defaultExpandedItem, }: {
        data: any;
        numberOfElements: any;
        getChildren: any;
        defaultExpandedItem: any;
    });
    create(obj: any, numberOfElements: any): void;
    addLevel(parent: any, level: any): void;
    createList(parent: any): void;
    removeChildren(parent: any): void;
    addChildren(parent: any): void;
    expandNode(parent: any): void;
    expandedNodes(parent: any): void;
}
export default Tree;
