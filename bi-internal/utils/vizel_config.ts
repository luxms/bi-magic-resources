import type { IEntity, IRawVizelConfig, IStoplight, IStoplights, IValue } from '../defs/bi';
import type { IDataSource, ILegendItem } from '../defs/tables';
export interface IRawCfgDataSource {
    dataSource?: IDataSource;
    legend?: any;
}
export interface IRawCfgColorPalette extends IRawCfgDataSource {
    colorPalette?: string[];
}
declare namespace vizel_config {
    /**
     * @param {IRawCfgDataSource} cfg - конфиг визеля
     * @param {IEntity} e - сущность оси
     * @param idx
     * @description Функционал cfg.getLegendItem. Ищет в dataSource.style объект, * | axisId | axisId[id], в МЛП ( metrics[mId], locations[lId], periods[pId])
     */
    function getLegendItem(cfg: IRawCfgDataSource, e: IEntity, idx?: number): ILegendItem;
    /**
     * @param {IRawCfgDataSource} cfg - конфиг визеля
     * @param {IEntity} e - сущность оси
     * @description Вызываю cfg.getLegendItem и ищу ключ format
     */
    function getFormat(cfg: IRawCfgDataSource, e: IEntity): string | null;
    /**
     * @param {IRawCfgDataSource} cfg - конфиг визеля
     * @param {IEntity} e - сущность оси
     * @param {any} lpeCtxIfHasLPE - 14944 - ВЫНУЖДЕН ДОБАВИТЬ ДОПОЛНИТЕЛЬНЫЙ КОНТЕКСТ ДЛЯ LPE, ЭТО ОЧЕНЬ ПЛОХО. НО НЕ ВЫЗВАТЬ createAtlasLpeForReact - ЛОМАЮТСЯ ИМПОРТЫ
     * @description Находит ключ title в style, понимает lpe:
     */
    function getTitle(cfg: IRawCfgDataSource, e: IEntity, lpeCtxIfHasLPE?: Record<any, any>): string;
    function getStoplights(cfg: IRawVizelConfig): IStoplights | null;
    function getStoplight(cfg: IRawVizelConfig, v: IValue): IStoplight | null;
    /**
     * @param {{options?: string[]}} cfg - принимает объект, у которого предположительно есть ключ options
     * @param {string} optionId - имя опции в массив options
     * @param defaultValue
     * @description Ф-ия позволяет быстро проверить наличие опции, при её отсутствие возвращает defaultValue
     */
    function getOption(cfg: {
        options?: string[];
    }, optionId: string, defaultValue?: boolean): boolean | undefined;
    /**
     * @param {{options?: string[]}} cfg - принимает объект, у которого предположительно есть ключ options
     * @param {string} optionId - имя опции в массив options
     * @description Ф-ия позволяет быстро проверить наличие опции;
     */
    function hasOption(cfg: {
        options?: string[];
    }, optionId: string): boolean;
    function getOptionCount(cfg: {
        options?: string[];
    }, optionId: string): number;
}
export default vizel_config;

export { vizel_config };
