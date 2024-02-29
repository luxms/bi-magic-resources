export declare const createHeader: (headers?: Record<string, any>) => {
    traceparent: string;
    tracestate: string;
    'LuxmsBI-Trace-Id': string;
    'LuxmsBI-Context-Id': string;
};
export declare const camelToSnakeCase: (str: any) => any;
