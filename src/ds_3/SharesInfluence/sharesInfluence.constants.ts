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
 * Название куба для получения основноых данных.
 */
export const KOOB_ID_FAPART = "luxmsbi.fapart";

/**
 * Получаемые поля куба KOOB_ID_FAPART.
 */
export const dimensionsFapart = [
  "r_group_text",
  "obj_text",
  "f_group_text",
  "f_text",
  "branch",
  "farm",
  "fiscper",
  "fiscper_text",
  "fiscvar",
  "ir_flag",
  "r_text",
  "factor_id",
  "risk_id",
  "fashare",
];

export const ENDPOINT_MODIFY_FAPART = "/api/db/public.fapart";
export const ENDPOINT_MODIFY_FAPART_MASS =
  "/api/v3/writeback/batch/koob/luxmsbi.fapart";
