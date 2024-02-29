export declare type BoxShadow = boolean | string;
export interface ConfirmProps {
    width?: string;
    boxShadow?: BoxShadow;
    className?: string;
    title: string;
    cancelText: string;
    acceptText: string;
    onConfirm: () => void;
    onCancel: () => void;
}
