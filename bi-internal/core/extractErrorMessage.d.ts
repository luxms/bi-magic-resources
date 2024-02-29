export declare function extractErrorMessageAndKey(err: any): {
    message: string;
    key: string;
};
/**
 *  Makes string from error of any type:
 *    JS exceptions, http responses, text
 *
 * @param err
 * @returns {string}
 */
export declare function extractErrorMessage(err: any): string;
