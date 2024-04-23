import React from 'react';
import {IVizelProperties, tables} from '../defs/bi'
import {repo} from '../core'

export interface IVizelFromCfgProps {
    readonly schema_name: string;
    readonly view_class?: string;
    readonly title?: string;
    readonly description?: string;
    readonly cfg?: any;
    readonly rawCfg: tables.IRawVizelConfig;
    readonly onVizelPropertiesChanged?: (properties: IVizelProperties, vizel: any) => void;
    readonly properties?: IVizelProperties;
    readonly datasetId?: number;
    readonly dashId?: number | string;
    readonly dashboardId?: number | string;
    readonly dashboardTitle?: string;
    readonly datasetTitle?: string;
    readonly loadingIndicatorFunc?: () => void;
    readonly renderError?: (error: string) => any;
    readonly renderLoading?: (loading: boolean) => any;
    readonly editMode?: string;
    readonly onEditDashlet?: () => void;
    readonly onChangeDashlets?: (updated: repo.ds.IRawDashlet[], deleted?: number[]) => any;
    readonly dashlet?: any;
}

/**
 * @description Позволяет вставлять bi-визели используя rawCfg
 */
export class VizelFromCfg extends React.Component<IVizelFromCfgProps> {
    public constructor(props)

    /**
     * @description позволяет сообщать визелю об изменении ширины/длинны контейнера
     */
    public resize(width, height): void;

    /**
     * @description отрисовка кнопки сохранить как
     */
    public save(saveAbility, titleContext, $anchor): void;

    public addListener(listener): void;

    public setProperties(o): void
}

export default VizelFromCfg;
