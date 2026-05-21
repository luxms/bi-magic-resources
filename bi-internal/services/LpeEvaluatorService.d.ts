import React from 'react';
import { BaseService } from '../core';

export interface ILPEEvaluatorProps {
    readonly schema_name: string;
    readonly expression: string;
    readonly ctx: any;
    readonly renderError?: (...args: any[]) => string | React.JSX.Element;
}

export class LPEEvaluator extends React.Component<ILPEEvaluatorProps, any> {}
export class LPESpanEvaluator extends LPEEvaluator {}

/**
 * Evaluates an LPE expression and updates when expression streams change.
 */
export class LpeEvaluatorService extends BaseService<any> {
    public static MODEL: any;
    public constructor(schemaName: string, expression: string, ctx: any);
}

export const streamAdapter: any;

export class LightweightStream extends BaseService<any> {
    public constructor(value: any, onDispose?: any);
    public set(value: any): void;
}
