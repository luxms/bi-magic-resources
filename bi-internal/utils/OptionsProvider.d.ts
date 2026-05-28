/**
 *
 *
 *
 */
import { IOptionsProvider } from '../defs/bi';
export declare class OptionsProvider implements IOptionsProvider {
    private readonly _options;
    constructor(options: string[], defaultOptions?: string[]);
    clone(): OptionsProvider;
    hasOption(optionId: string): boolean;
    hasAnyOf(...optionIds: string[]): boolean;
    addOption(optionId: string): boolean;
    removeOption(optionId: string): boolean;
    getOption(optionId: string, defaultValue?: boolean): boolean | undefined;
    getOptions(): string[];
    getRaw(): string[];
    getOptionCount(optionId: string): number;
    setOption(optionId: string, value: boolean): void;
    withOption(optionId: string): OptionsProvider;
    withoutOption(optionId: string): OptionsProvider;
}
