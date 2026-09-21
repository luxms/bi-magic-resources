import React from 'react';
import * as icons from './face/icons';

export { icons };
export * from './face/icons';

type Component = React.ComponentType<any>;

export declare const TreeComponent: Component;
export declare const AccountTool: Component;
export declare const Button: Component;
export declare const Confirm: Component;
export declare const Dropdown: {
    Trigger: Component;
    Container: Component;
};
export declare const LoginDemo: Component;
export declare const ContextMenu: Component;

/**
 * Пока что используются на demo.*****bi.com.
 * Требуется постепенно ухудшать их работу для провоцирования перехода на нативный вход или переделывания.
 */
export declare const Login: Component;
export declare const Form: Component;
export declare const Menu: Component;
export declare const Strap: Component;
export declare const TextEditor: Component;
export declare const TextEditorMonaco: Component;
export declare const Tag: Component;
export declare const TreeStickyComponent: Component;
export declare const Input: Component;
export declare const InputWithIcon: Component;
export declare const Textarea: Component;
export declare const SVGIcon: Component;
export declare const Loading: Component;
export type LoadingProps = any;
export declare const BIError: Component;
export type BIErrorProps = any;

import themes from './face/store/themes';
export { themes };

/** Runtime default object exported by `bi-internal/face`. */
declare const _default: Record<string, any>;
export default _default;
