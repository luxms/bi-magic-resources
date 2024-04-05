import { KoobDataService } from "bi-internal/services";

import { ROOT_KOOB_ID } from "../treeView.constants";

/**
 * Создаем KoobDataService для загрузки орагнизаций.
 */
export const createRootKoobDataService = (filters: any = {}) => {
  return new KoobDataService(ROOT_KOOB_ID, demensionsRootKoob, [], filters);
};

export const demensionsRootKoob = [
  {
    id: "predpr_pred_id",
    type: "INTEGER",
    sql: "predpr_pred_id",
    title: "predpr_pred_id",
  },
  { id: "gr_id", type: "INTEGER", sql: "gr_id", title: "gr_id" },
  {
    id: "pred_v_id",
    type: "INTEGER",
    sql: "pred_v_id",
    title: "pred_v_id",
  },
  {
    id: "pred_n_id",
    type: "INTEGER",
    sql: "pred_n_id",
    title: "pred_n_id",
  },
  { id: "pname", type: "STRING", sql: "pname", title: "pname" },
  { id: "sname", type: "STRING", sql: "sname", title: "sname" },
  { id: "vname", type: "STRING", sql: "vname", title: "vname" },
  {
    id: "form_status",
    type: "STRING",
    sql: "form_status",
    title: "form_status",
  },
  {
    id: "form_id",
    type: "INTEGER",
    sql: "form_id",
    title: "form_id",
  },
  {
    id: "form_title",
    type: "STRING",
    sql: "form_title",
    title: "form_title",
  },
  {
    id: "children_count",
    type: "INTEGER",
    sql: "children_count",
    title: "children_count",
  },
  {
    id: "branch",
    type: "STRING",
    sql: "branch",
    title: "branch",
  },
  {
    id: "dor_kod",
    type: "INTEGER",
    sql: "dor_kod",
    title: "dor_kod",
  },
  {
    id: "st_title",
    type: "STRING",
    sql: "st_title",
    title: "st_title",
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
    id: "ir_flag",
    type: "INTEGER",
    sql: "ir_flag",
    title: "ir_flag",
  },
  {
    id: "farm",
    type: "STRING",
    sql: "farm",
    title: "farm",
  },
  {
    id: "fiscper_text",
    type: "STRING",
    sql: "fiscper_text",
    title: "fiscper_text",
  },
];
