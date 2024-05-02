import { KoobDataService } from "bi-internal/services";

import { FA_ITEM_ACTION } from "../treeView.constants";

/**
 * Создаем KoobDataService для загрузки экшенов доп колонок.
 */
export const createFaItemActionsKoobDataService = (filters) => {
  return new KoobDataService(
    FA_ITEM_ACTION,
    [
      { id: "srt", type: "INTEGER", sql: "srt", title: "srt" },
      { id: "frm_id", type: "INTEGER", sql: "frm_id", title: "frm_id" },
      { id: "branch", type: "STRING", sql: "branch", title: "branch" },
      {
        id: "dashboard_id",
        type: "INTEGER",
        sql: "dashboard_id",
        title: "dashboard_id",
      },
      {
        id: "dataset_id",
        type: "INTEGER",
        sql: "dataset_id",
        title: "dataset_id",
      },
      { id: "disabled", type: "BOOLEAN", sql: "disabled", title: "disabled" },
      { id: "frm_act", type: "INTEGER", sql: "frm_act", title: "frm_act" },
      {
        id: "frm_bound",
        type: "INTEGER",
        sql: "frm_bound",
        title: "frm_bound",
      },
      {
        id: "frm_bound_st_end",
        type: "INTEGER",
        sql: "frm_bound_st_end",
        title: "frm_bound_st_end",
      },

      { id: "frm_st", type: "INTEGER", sql: "frm_st", title: "frm_st" },
      {
        id: "frm_st_end",
        type: "INTEGER",
        sql: "frm_st_end",
        title: "frm_st_end",
      },
      {
        id: "leaf_hier_level",
        type: "INTEGER",
        sql: "leaf_hier_level",
        title: "leaf_hier_level",
      },
      {
        id: "lvl_st_beg",
        type: "INTEGER",
        sql: "lvl_st_beg",
        title: "lvl_st_beg",
      },
      {
        id: "lvl_st_beg_bound",
        type: "INTEGER",
        sql: "lvl_st_beg_bound",
        title: "lvl_st_beg_bound",
      },
      {
        id: "lvl_st_end",
        type: "INTEGER",
        sql: "lvl_st_end",
        title: "lvl_st_end",
      },
      {
        id: "lvl_st_end_bound",
        type: "INTEGER",
        sql: "lvl_st_end_bound",
        title: "lvl_st_end_bound",
      },
      {
        id: "title",
        type: "STRING",
        sql: "title",
        title: "title",
      },
      {
        id: "url",
        type: "STRING",
        sql: "url",
        title: "url",
      },
      {
        id: "filters",
        type: "STRING",
        sql: "filters",
        title: "filters",
      },
      {
        id: "ir_flag",
        type: "INTEGER",
        sql: "ir_flag",
        title: "ir_flag",
      },
    ],
    [],
    filters
  );
};
