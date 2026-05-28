export type IValue = number | string;
export type IRawColor = string | number | number[] | null | undefined;
export interface ITreeNode<T> {
    children: T[];
    parent: T;
    root: T;
    getChildren(): T[];
    getDescendants(): T[];
    getParent(): T;
}
export interface ITag extends ITreeNode<ITag> {
    id: number | string;
    title: string;
    axisId: string;
    addChild(tag: ITag): ITag;
    getChildById(id: string): ITag;
}
export interface ITaggedEntity {
    rawTags: string[];
    addTag(tag: ITag): this;
    getTags(): ITag[];
    getTag(id: string | number): ITag;
    getTagByGroupId(tagGroupId: string): ITag;
}
export interface IUnit extends IEntity {
    id: number;
    config: any;
    unit_id: number;
    title: string;
    axis_title: string;
    tiny_title: string;
    value_prefix: string;
    value_suffix: string;
    isInteger(): boolean;
}
export interface IEntity {
    id: number | string;
    title: string;
    ids?: Array<string | number>;
    _raw?: any;
    readonly titles?: string[];
    readonly axisId?: string;
    readonly axisIds?: string[];
    readonly formula?: string[];
    readonly rawFormula?: string[];
    readonly children?: IEntity[];
    readonly parent?: IEntity;
    config?: any;
    unit?: any;
}
export interface IMetric extends IEntity, ITaggedEntity {
    id: string;
    parent_id: string;
    unit_id: number;
    srt: number;
    tree_level: number;
    title: string;
    is_text_val: number;
    config: any;
    is_hidden: number;
    parent: IMetric;
    unit: IUnit;
    children: IMetric[];
    is_formula?: boolean;
}
