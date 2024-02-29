export function parse(lpeExpression: string): any;

export function deparse(lispExpression: any): string;

export function eval_lisp(prog: any, ctx?: any, parameters?: any): any;

export function eval_lpe(prog: string, ctx?: any, parameters?: any): any;

/**
 * @param {any} lpeCode - ЛПЕ выражение
 * @param {any} ctx - контекст ЛПЕ выражения
 */
export function lpeRun(lpeCode: any, ctx: any): any