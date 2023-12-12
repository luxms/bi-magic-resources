import { KoobDataService } from "bi-internal/services";

import { FAFORM_KOOB_ID } from "../treeView.constants";

/**
 * Создаем KoobDataService для загрузки доп. колонок.
 */
export const createFaformKoobDataService = () => {
  return new KoobDataService(
    FAFORM_KOOB_ID,
    [
      {
        id: "frm_id",
        type: "INTEGER",
        sql: "predpr_pred_id",
        title: "predpr_pred_id",
      },
      { id: "title", type: "STRING", sql: "title", title: "title" },
    ],
    [],
    {},
    undefined,
    ["+frm_id"]
  );
};
