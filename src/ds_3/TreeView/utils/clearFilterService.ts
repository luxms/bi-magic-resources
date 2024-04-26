import { FaConfigs } from "../treeView.interface";
import { KoobFiltersService, useServiceItself } from "bi-internal/services";

export const clearFilterService = (filterClear: FaConfigs) => {
  const filters = filterClear.cfg_val.split(",");
  // const koobFiltersService =
  //   useServiceItself<KoobFiltersService>(KoobFiltersService);
  // const koobFiltersModel = koobFiltersService.getModel();
  // console.log(koobFiltersModel.loading + " " + koobFiltersModel.error);

  // if (koobFiltersModel.loading || koobFiltersModel.error) return;
  filters.forEach((item) => {
    KoobFiltersService.getInstance().setFilter("", item, undefined);
  });
};
