import { IKoobDimension } from "bi-internal/defs/bi";
import { KoobDataService, KoobFiltersService } from "bi-internal/services";

/**
 * Поля, которые необходимо получить из куба(получение динамических столбцов).
 */
export const dimensionsColumnsDataService: IKoobDimension[] = [
  {
    id: "date_kd_pd",
    type: "STRING",
    sql: "date_kd_pd",
    title: "date_kd_pd",
  },
  {
    id: "date_kd_v",
    type: "STRING",
    sql: "date_kd_v",
    title: "date_kd_v",
  },
  {
    id: "date_nd_pd",
    type: "STRING",
    sql: "date_nd_pd",
    title: "date_nd_pd",
  },
  {
    id: "date_nd_v",
    type: "STRING",
    sql: "date_nd_v",
    title: "date_nd_v",
  },
  {
    id: "fiscper",
    type: "INTEGER",
    sql: "fiscper",
    title: "fiscper",
  },
  {
    id: "fiscvar",
    type: "STRING",
    sql: "fiscvar",
    title: "fiscvar",
  },
  {
    id: "level",
    type: "INTEGER",
    sql: "level",
    title: "level",
  },
  {
    id: "nom",
    type: "INTEGER",
    sql: "nom",
    title: "nom",
  },
  {
    id: "path",
    type: "STRING",
    sql: "path",
    title: "path",
  },
  {
    id: "pred_id",
    type: "INTEGER",
    sql: "pred_id",
    title: "pred_id",
  },
  {
    id: "pred_idf",
    type: "INTEGER",
    sql: "pred_idf",
    title: "pred_idf",
  },
  {
    id: "pred_v_id",
    type: "INTEGER",
    sql: "pred_v_id",
    title: "pred_v_id",
  },
  {
    id: "sname",
    type: "STRING",
    sql: "sname",
    title: "sname",
  },
  {
    id: "vname",
    type: "STRING",
    sql: "vname",
    title: "vname",
  },
];
/**
 * Название куба на получение динамических столбцов.
 */
export const KOOB_ID_COLUMNS = "luxmsbi.fa_predpr_ier";

/**
 * Поля, которые необходимо получить из куба(получение строк таблицы).
 */
export const dimensionsRowsDataService: IKoobDimension[] = [
  {
    id: "disabled",
    type: "BOOLEAN",
    sql: "disabled",
    title: "disabled",
  },
  {
    id: "fa_data",
    type: "NUMERIC (17,3)",
    sql: "fa_data",
    title: "fa_data",
  },
  {
    id: "fasyst",
    type: "STRING",
    sql: "fasyst",
    title: "fasyst",
  },
  {
    id: "fiscper",
    type: "INTEGER",
    sql: "fiscper",
    title: "fiscper",
  },
  {
    id: "fiscvar",
    type: "STRING",
    sql: "fiscvar",
    title: "fiscvar",
  },
  {
    id: "grtitle",
    type: "STRING",
    sql: "grtitle",
    title: "grtitle",
  },
  {
    id: "info_id",
    type: "INTEGER",
    sql: "info_id",
    title: "info_id",
  },
  {
    id: "ititle",
    type: "STRING",
    sql: "ititle",
    title: "ititle",
  },
  {
    id: "pred_id",
    type: "INTEGER",
    sql: "pred_id",
    title: "pred_id",
  },
  {
    id: "pred_idf",
    type: "INTEGER",
    sql: "pred_idf",
    title: "pred_idf",
  },
];
/**
 * Название куба на получение строк.
 */
export const KOOB_ID_ROWS = "luxmsbi.public_fainfo_all";

/**
 * Название таблицы для update.
 */
export const ENDPOINT_UPDATE_FADATA = "/api/db/public.fadata";
