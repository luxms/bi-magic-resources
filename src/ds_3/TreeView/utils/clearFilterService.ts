import { FaConfigs } from "../treeView.interface";
import { KoobFiltersService } from "bi-internal/services";

export const clearFilterService = (filterClear: FaConfigs) => {
  const filters = filterClear.cfg_val.split(",");
  filters.forEach((item) => {
    KoobFiltersService.getInstance().setFilter("", item, undefined);
  });
};
