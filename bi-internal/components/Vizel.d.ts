import {ISubspace, IVizel, IVizelListener, IVizelProperties } from '../defs/bi'
import React = require("../defs/react")
import { IVizelProps } from '../defs/types'

export class Vizel extends React.Component<IVizelProps> implements IVizel{
    public save(saveAbility: string, titleContext: string[], $anchor?: any): void;

    public resize(width?: number, height?: number): void;

    public onVizelPropertiesChanged(props: IVizelProperties, vzl?: IVizel): void;

    public setAxes(subspace: ISubspace): Promise<any>;

    public getProperties(): IVizelProperties;

    public setProperties(o: { [id: string]: any }): boolean ;

    public addListener(listener: IVizelListener): void ;

    public removeListener(listener: IVizelListener): void ;
}