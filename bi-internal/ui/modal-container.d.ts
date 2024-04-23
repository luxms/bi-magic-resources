import React from 'react';
import {tables} from "../defs/bi";

interface IModalCreateVizel {
    readonly rawCfg: tables.IRawVizelConfig;
    readonly schemaName: string;
}

/**
 * @description Модальное окно - обертка, рисующая только Vizel-bi. Сохраняет текущее состояние в url['_modalBi']
 */
export class ModalContainer extends React.Component<any, any> {
    public constructor(props: any)

    /**
     * @method
     * @deprecated
     * @description Публичный метод hack, который дернет перерисовку у визеля
     */
    public resize(): void;

    /**
     * @method
     * @param {tables.IRawVizelConfig, string} rawVizelModal - сырой конфиг визеля + схема Датасета.
     * @param {string} vTitle - Заголовок модального окна
     * @description Метод для отображения нового окна модалки, последовательно можно открыть и закрыть n-ое кол-во модальных окон.
     */
    public push(rawVizelModal: IModalCreateVizel, vTitle: string | string[]): void;

    /**
     * @method
     * @param {tables.IRawVizelConfig} rawCfg - сырой конфиг визеля
     * @param {string} title - Заголовок модального окна
     * @description Метод для отображения нового окна модалки, последовательно можно открыть и закрыть n-ое кол-во модальных окон. (берет текущий schemaName из url)
     */
    public pushVizelConfig(rawCfg: tables.IRawVizelConfig, title?: string | string[]): Promise<any>

    /**
     * @method
     * @description Удаляет последнюю модалку из стека
     */
    public pop(): void;

    /**
     * @method
     * @description Очищает весь стек и скрывает модалку.
     */
    public hide(): void;
}

export declare const modalContainer: ModalContainer;
