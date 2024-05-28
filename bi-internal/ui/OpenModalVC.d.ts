import React from 'react';
import CSSProperties = React.CSSProperties;

export interface IOpenModalVMOpt {
    readonly cancelWrapper?: boolean;   // default = true,  закрытие модального окна по клику на wrapper
    readonly hiddenWrapper?: boolean;   // default = false,  наличие wrapper'a
    readonly style?: CSSProperties;
    readonly className?: string;
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
