import {IColorPair, IColorResolver, IEntity, IStoplights, IValue, tables} from "../defs/bi";
import IRawVizelConfig = tables.IRawVizelConfig;

declare namespace vizel_config {

  /**
   * @param {IRawVizelConfig} rawCfg - конфиг визеля
   * @param {IEntity} e - сущность оси
   * @param idx
   * @description Функционал cfg.getLegendItem. Ищет в dataSource.style объект, * | axisId | axisId[id], в МЛП ( metrics[mId], locations[lId], periods[pId])
   */
  export function getLegendItem(rawCfg: IRawVizelConfig, e: IEntity, idx: number): tables.ILegendItem

  /**
   * @param {IRawVizelConfig} rawCfg - конфиг визеля
   * @param {IEntity} e - сущность оси
   * @description Вызываю cfg.getLegendItem и ищу ключ format
   */
  export function getFormat(rawCfg: IRawVizelConfig, e: IEntity): string | null

  /**
   * @param {IRawVizelConfig} rawCfg - конфиг визеля
   * @param {IEntity} e - сущность оси
   * @description Находит ключ title в style, понимает lpe:
   */
  export function getTitle(rawCfg: IRawVizelConfig, e: IEntity): string


  export function getLegendColorPair(rawCfg: IRawVizelConfig, e: IEntity, idx?: number): IColorPair

  export function getLegendColor(rawCfg: IRawVizelConfig, e: IEntity,  idx?: number): string

  export function getLegendBgColor(rawCfg:IRawVizelConfig, e: IEntity, idx?: number): string

  export function getColorPair(rawCfg: IRawVizelConfig, colorResolver: IColorResolver, e: IEntity, v: number, idx?: number): IColorPair

  export function getColor(colorResolver: IColorResolver, rawCfg: IRawVizelConfig, e: IEntity, v: number, idx?: number): string

  export function getBgColor(colorResolver: IColorResolver, rawCfg: IRawVizelConfig, e: IEntity, v: number, idx?: number): string

  export function getStoplights(rawCfg: IRawVizelConfig): IStoplights | null

  export function getStoplight(rawCfg: IRawVizelConfig, v: IValue): IStoplights | null

  export function getOption(rawCfg: {options?: string[]}, optionId: string, defaultValue?: boolean): boolean | undefined

  export function hasOption(rawCfg: {options?: string[]}, optionId: string): boolean

  export function getOptionCount(rawCfg: {options?: string[]}, optionId: string): number

}
