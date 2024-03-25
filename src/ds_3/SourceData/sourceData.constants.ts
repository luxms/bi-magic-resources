import { IKoobDimension } from "bi-internal/defs/bi";
import { KoobDataService, KoobFiltersService } from "bi-internal/services";

/**
 * Поля, которые необходимо получить из куба(получение динамических столбцов).
 */
export const dimensionsColumnsDataService: IKoobDimension[] = [
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
    id: "ir_flag",
    type: "INTEGER",
    sql: "ir_flag",
    title: "ir_flag",
  },
];

export const dimensionsLock = [
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
    id: "locks",
    type: "BOOLEAN",
    sql: "locks",
    title: "locks",
  },
  {
    id: "usr_id",
    type: "INTEGER",
    sql: "usr_id",
    title: "usr_id",
  },
  {
    id: "ir_flag",
    type: "INTEGER",
    sql: "ir_flag",
    title: "ir_flag",
  },
  {
    id: "frm_id",
    type: "INTEGER",
    sql: "frm_id",
    title: "frm_id",
  },
];

export const dimensionsUnLock = [
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
    id: "unlocks",
    type: "BOOLEAN",
    sql: "unlocks",
    title: "unlocks",
  },
  {
    id: "ir_flag",
    type: "INTEGER",
    sql: "ir_flag",
    title: "ir_flag",
  },
  {
    id: "frm_id",
    type: "INTEGER",
    sql: "frm_id",
    title: "frm_id",
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

/**
 * Название таблицы для update.
 */
export const ENDPOINT_UPDATE_FADATA_MASS =
  "/api/v3/writeback/batch/koob/luxmsbi.fadata";

/**
 * Название таблицы для статуса.
 */
export const ENDPOINT_STATUS =
  "/api/v3/writeback/batch/koob/luxmsbi.faform_status";

/**
 * Название куба для блокирования редактирования.
 */
export const KOOB_ID_LOCK = "luxmsbi.public_fainfo_lock";

/**
 * Название куба для разблокирования редактирования.
 */
export const KOOB_ID_UNLOCK = "luxmsbi.public_fainfo_unlock";
