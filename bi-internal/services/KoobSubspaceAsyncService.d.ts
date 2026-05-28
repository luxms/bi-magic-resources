import { BaseService, repo } from '../core';
import type { IEntity, IKoobEntity, IRawVizelConfigDataSource, ISubspacePtr } from '../defs/bi';
import { ISubspaceModel } from './dataset';
/**
 * KoobSubspaceAsyncService
 * скачиваю данные по осям, максимум по 128 на ось
 * у subspace метод async sortBy(id:string) -> возвращает новый subspace отсортированный по id + || -
 */
export declare class KoobSubspaceAsyncService extends BaseService<ISubspaceModel> {
    private ctorOptions;
    private readonly _subspacePtr;
    private readonly _schemaName;
    private _suspended;
    private _wasChangedWhileBeingSuspended;
    private _disableLoadData;
    private _disposed;
    private readonly _cubeService;
    private readonly _dimensionsService;
    private readonly _koobFiltersService;
    private readonly _unitsService;
    private readonly _atlasHierarchyValuesService;
    private readonly _koobDimensionsMemberService;
    private readonly _RtService;
    private _cancelToken;
    constructor(schemaName: string, subspacePtr: ISubspacePtr, ctorOptions?: Partial<{
        restrictiveFilters: any;
    }>);
    private _makeEmptySubspace;
    private _init;
    protected _dispose(): void;
    setSuspended(suspended: boolean): void;
    private _onUpdateSubspace;
    private _onSignalToUpdateDashboard;
    private _onFilterUpdated;
    private _onVarsUpdated;
    /**
     * @description исходя из cfg.dataSource.dimensions отдаю доступные dimension
     */
    private _makeDimensions;
    /**
     * @description исходя из cfg.dataSource.measures отдаю доступные мешы + проверяю на наличие VARS
     */
    private _makeMeasures;
    /**
     * @param options
     * @param offset
     * @param limit
     * @param comment
     */
    private _getAxis;
    private _createSubspace;
}
export default KoobSubspaceAsyncService;
type IMakeSortByOptions = {
    hasModel: boolean;
    disableSort: boolean;
};
/**
 * @param {IKoobEntity[]} axes - Массив осей
 * @param {IKoobEntity[]} measures - Массив мер
 * @param {IRawVizelConfigDataSource} dataSource - cfg.dataSource
 * @param {IMakeSortByOptions} options - Дополнительные опции:
 *                                       - hasModel: boolean - Флаг использования модели
 *                                       - disableSort: boolean - Флаг отключения сортировки (вернет пустой массив)
 * @returns {string[]} Массив строк параметров сортировки
 * @description Функция выполняет следующие действия:
 *              1. Если сортировка отключена (options.disableSort), возвращает пустой массив.
 *              2. Обрабатывает существующие параметры сортировки из dataSource.sortBy
 *              3. Добавляет сортировку по осям (по возрастанию, если не указано иное)
 *              4. Специальная обработка для оси "measures":
 *                 - Добавляет сортировку по "_measure_idx_" при наличии нескольких мер.
 *                 - Вставляет сортировку по мерам перед осью "measures".
 *              5. Фильтрует нежелательные значения ("+measures" и "+[measures]")
 */
export declare function makeSortBy(axes: IKoobEntity[], measures: IKoobEntity[], dataSource: IRawVizelConfigDataSource, options: IMakeSortByOptions): string[];
/**
 * @param {repo.koob.IRawDimension} dimension - Сырые данные измерения:
 * @param {IRawVizelConfigDataSource} dataSource - cfg.dataSource
 * @param {Record<string, string>} granularity - Объект гранулярности измерений: Ключ - имя измерения, значение - тип гранулярности (week/month/quarter/year)
 * @returns {IKoobEntity} - Объект кастомного измерения
 * @description Функция выполняет следующие преобразования:
 *             1. Формирует базовую структуру измерения (ID, название, SQL-запрос и т.д.)
 *             2. Обрабатывает гранулярность измерения (если указана) - преобразует формулу измерения
 *             3. Извлекает и обрабатывает название измерения из различных источников: (поле title, dataSource.style, из связанных колонок)
 */
export declare function makeDimension(dimension: repo.koob.IRawDimension, dataSource: IRawVizelConfigDataSource, granularity: Record<string, string>): IKoobEntity;
/**
 * @param {string} rawFormula - Исходная формула измерения. Может содержать: ('column1', 'sum(column1)', 'sum(column1):custom_id', '$varName')
 * @param {Array<repo.koob.IRawDimension>} dimensions - Массив исходных измерений, из которых берутся метаданные
 * @param { Record<string, any>} style - cfg.dataSource.style
 * @param {Record<string, unknown>} allVars - Объект с переменными ds.vars
 * @returns {IKoobEntity} - Объект кастомного измерения
 * @description Функция выполняет следующие действия:
 *              1. Извлекает ID измерения из формулы (с поддержкой различных форматов)
 *              2. Определяет заголовок измерения (с приоритетом: style.title > columns.title > ID измерения)
 *              3. Заменяет переменные в формуле на их значения
 *              4. Формирует объект измерения с полной структурой IKoobEntity
 */
export declare function makeCustomDimension(rawFormula: string, dimensions: repo.koob.IRawDimension[], style: Record<string, any>, allVars: Record<string, unknown>): IKoobEntity;
/**
 * @param {repo.koob.IRawDimension[]} dimensions - Массив измерений с информацией о колонках
 * @param {IRawVizelConfigDataSource} dataSource - cfg.dataSource
 * @param {Record<string, unknown>} allVars - Объект с переменными ds.vars
 * @param {repo.ds.IRawUnit[]} units - Массив единиц измерения (УСТАРЕВШИЙ)
 * @returns {IKoobEntity[]} - Объект кастомного измерения
 * @description Преобразует массив строковых мер (measures) в массив объектов с полной информацией о мерах
 *              1. Извлекает идентификатор меры из строкового представления
 *              2. Определяет тип меры (SUM, COUNT, AVG или FN) по префиксу функции
 *              3. Заменяет переменные в формуле на их значения
 *              4. Формирует заголовок меры с учетом dataSource.style и названий колонок
 *              5. Добавляет дополнительную информацию из dimensions и units(УСТАРЕВШИЙ)
 */
export declare function makeMeasures(dimensions: repo.koob.IRawDimension[], dataSource: IRawVizelConfigDataSource, allVars: Record<string, unknown>, units: repo.ds.IRawUnit[]): IKoobEntity[];
export declare function makeMeasure(measure: string, dimensions: repo.koob.IRawDimension[], style: Record<string, any>, allVars: Record<string, unknown>, units: repo.ds.IRawUnit[]): {
    id: string;
    title: string;
    source_ident: string;
    cube_name: string;
    name: string;
    axisId: string;
    formula: string;
    rawFormula: string;
    type: string;
    sql: string;
    unit: any;
    config: any;
};
/**
 * @param dimensions {Array<IKoobEntity>} - Массив объектов измерений
 * @param dataSource {IRawVizelConfigDataSource} - cfg.dataSource
 * @description Формирует оси xAxis, yAxis, zAxis
 *              1. Отфильтровывает несуществующие измерения
 *              2. По умолчанию, если не заданы оси все меры кидает на yAxis, а все измерения на xAxis
 *              3. Поддерживает xAxis, yAxis, zAxis
 */
export declare function makeAxes(dimensions: IKoobEntity[], dataSource: IRawVizelConfigDataSource): {
    xAxis: any[];
    yAxis: any[];
    zAxis: any[];
};
/**
 * @param data {Record<string, any>} - объект с данными для оси
 * @param options - массив опций осей (меры и измерения)
 * @param measures - массив доступных мер
 * @param titles {Array<Array<id: number, title: string>>} - справочники заголовков для значений измерений
 * @description Формирую сущность оси, + особенности
 *              1. Использую _measure_idx_ для выбора текущей меры
 *              2. Учитывает случай, когда на оси несколько измерений и одна мера (пропускает меру)
 *              3. Сохраняет unit и из меры
 *              4. Обрабатывает специальные флаги подытогов %measure$∑ = 1 | %measure$∑ = '1'
 *              5. Сохраняет исходные данные в поле _raw
 */
export declare function makeAxis(data: Record<string, any>, options: IKoobEntity[], measures: IKoobEntity[], titles: {
    id: number;
    title: string;
}[][]): IEntity;
/**
 * @param options {IKoobEntity[]} - Массив опций осей (меры и измерения)
 * @param measures {IKoobEntity[]} - Массив мер
 * @returns Объект с axisIds и вспомогательными флагами
 * @description Формирует массив идентификаторов осей:
 *              1. Извлекает formula или id из каждой опции
 *              2. Заменяет measures на range() при наличии нескольких мер
 *              3. Фильтрует 'measures' из результата
 */
export declare function makeAxisIds(options: IKoobEntity[], measures: IKoobEntity[]): string[];
/**
 * @param axisIds {string[]} - Массив идентификаторов осей
 * @param options {IKoobEntity[]} - Массив опций осей (меры и измерения)
 * @param measures {IKoobEntity[]} - Массив мер
 * @param subtotalsConfig {string} - Строка конфигурации подытогов из dataSource.subtotals
 * @returns {string[]} Массив подытогов
 * @description Формирует массив подытогов:
 *              1. Фильтрует только те, что есть в axisIds
 *              2. Вставляет '_measure_idx_' при наличии measures и нескольких мер
 */
export declare function makeSubtotals(axisIds: string[], options: IKoobEntity[], measures: IKoobEntity[], subtotalsConfig: string): string[];
