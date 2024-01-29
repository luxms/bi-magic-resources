export interface SourceDataLayoutProps {
  columns: FaPredprIerDto[];
  rows: FainfoAll[];
  addChangedData: (value: string) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  setIsReload: (value: boolean) => void;
  lock: () => void;
  unlock: () => void;
}
/**
 * Интерфейс БД получения динамических заголовков
 */
export interface FaPredprIerDto {
  pred_id: number;
  sname: string;
  vname: string;
  pred_idf: number;
}
/**
 * Интерфейс БД получения строк
 */
export interface FainfoAllDto {
  pred_id: number;
  info_id: number;
  ititle?: string;
  grtitle?: string;
  fasyst?: string;
  fa_data?: number;
  fiscper: number;
  fiscvar: string;
  disabled: boolean;
}
/**
 * Интерфейс БД таблицы public.fadata
 */
export interface FadataDto {
  pred_id: number;
  info_id: number;
  fa_data?: number;
  fiscper: number;
  fiscvar: string;
}
/**
 * Интерфейс сущности, которую мы используем в наших UI комонентах, и описывающей столбцы.
 */

export interface FainfoAll {
  info_id: number;
  data: { pred_id: number; fa_data?: number; disabled: boolean }[];
  grtitle?: string;
  ititle?: string;
  fasyst?: string;
  fiscper: number;
  fiscvar: string;
}
export interface FainfoAllData {
  pred_id: number;
  fa_data?: number;
  disabled: boolean;
}
