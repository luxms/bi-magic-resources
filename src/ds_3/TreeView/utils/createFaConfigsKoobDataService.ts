import { KoobDataService } from "bi-internal/services";

import { FACONFIGS} from "../treeView.constants";

/**
 * Создаем KoobDataService для загрузки параметров ФА.
 */
export const createFaConfigsKoobDataService = (filters) => {
  return new KoobDataService(
    FACONFIGS,
    demensionsFaConfigsKoob,
    [],
    filters
  );
};
export const demensionsFaConfigsKoob = [
  { id: "cfg_key", type: "STRING", sql: "cfg_key", title: "cfg_key" },
  { id: "cfg_val", type: "STRING", sql: "cfg_val", title: "cfg_val" },
];
