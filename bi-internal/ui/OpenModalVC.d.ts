import React from 'react';
import { BaseService, IBaseModel } from '../core';
import CSSProperties = React.CSSProperties;

export interface IOpenModalVMOpt {
    readonly cancelWrapper?: boolean;   // default = true,  закрытие модального окна по клику на wrapper
    readonly cancelEsc?: boolean;       // default = true
    readonly hiddenWrapper?: boolean;   // default = false,  наличие wrapper'a
    readonly style?: CSSProperties;
    readonly className?: string;
    readonly confirmSting?: string;
}

export interface IOpenModalVM extends IBaseModel {
    readonly reactElements: React.ReactElement[];
    readonly options: IOpenModalVMOpt[];
    readonly onCancel: any;
    readonly onResult: any;
}

/**
 * @param {React.ReactElement} el - реакт компонент
 * @param {IOpenModalVMOpt}  options - доп опции
 * @description Функция открывает окно, в котором встиавлен реакт эл-т, у которого в props добавляются функции:
 *  onModalCancel: (args: any) => void
 *  onModalResult: (args: any) => void
 * , Функции срабатываают на  openModal.then((args)=> аргументы из onModalResult ).catch((args)=> аргументы из onModalCancel)
 */
export function openModal(el: React.ReactElement, options?: IOpenModalVMOpt): Promise<any>

export class OpenModalVC extends BaseService<IOpenModalVM> {
    public static getInstance(): OpenModalVC;
    public setVizel(reactEl: React.ReactElement, options?: IOpenModalVMOpt): void;
    public onModalCancel(args: any, reactEl: React.ReactElement): void;
    public onModalResult(args: any, reactEl: React.ReactElement): void;
    public resetModel(): void;
}

export default openModal;
