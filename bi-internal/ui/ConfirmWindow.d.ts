import React from 'react';

interface IConfirmWindowProps {
    readonly title?: string;
    readonly text?: string;
    readonly preTitle?: string;
    readonly textBtnConfirm?: string;
    readonly textBtnConfirmStyle?: any;
    readonly textBtnCancel?: string;
    readonly textBtnCancelStyle?: any;
    readonly onModalCancel?: (args?: any) => void;
    readonly onModalResult?: (args?: any) => void;
}

/**
 * @param props
 * @description Стандартное окно уведомления, обычно используется, чтобы спросить: удалить это ? да-нет
 */
export declare const ConfirmWindow: React.FC<IConfirmWindowProps>
export default ConfirmWindow;
