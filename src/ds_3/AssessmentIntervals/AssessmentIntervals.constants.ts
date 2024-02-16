/**
 * Название куба для блокирования редактирования.
 */
export const KOOB_ID_LOCK = "luxmsbi.public_fainfo_lock";

/**
 * Получаемые поля куба KOOB_ID_LOCK.
 */
export const dimensionsLock = [
  "fiscper",
  "fiscvar",
  "pred_id",
  "pred_idf",
  "locks",
  "usr_id",
  "ir_flag",
  "frm_id",
];
/**
 * Название куба для разблокирования редактирования.
 */
export const KOOB_ID_UNLOCK = "luxmsbi.public_fainfo_unlock";

/**
 * Получаемые поля куба KOOB_ID_UNLOCK.
 */
export const dimensionsUnLock = [
  "fiscper",
  "fiscvar",
  "pred_id",
  "pred_idf",
  "unlocks",
  "ir_flag",
  "frm_id",
];

/**
 * Название куба для получения основных данных.
 */
export const KOOB_ID_FAINTERVAL = "luxmsbi.fainterval";

/**
 * Получаемые поля куба KOOB_ID_FAINTERVAL.
 */
export const dimensionsFainterval = [
  "f_group_text",
  "fanumb",
  "f_text",
  "branch",
  "farm",
  "dor_kod",
  "fiscper",
  "fiscper_text",
  "fiscvar",
  "ir_flag",
  "factor_id",
  "faidval",
  "min_border",
  "max_border",
];

export const ENDPOINT_MODIFY_FAINTERVAL = "/api/db/public.fainterval";
