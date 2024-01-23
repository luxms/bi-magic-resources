import { useCallback, useContext, useEffect, useMemo, useState} from "react";

import { KoobFiltersService, useService, KoobService } from "bi-internal/services";
import { IKoobDataModel } from "bi-internal/services/koob";
import {$eid} from "bi-internal/utils";

import { createRootKoobDataService } from "./createRootKoobDataService";
import { createFaformKoobDataService } from "./createFaformKoobDataService";
import {
  FaItemAction,
  FaItemActionDto,
  FaformColumn,
  FaformDto,
  OrganisationData,
  OrganisationDataDto,
} from "../treeView.interface";
import { mapColumns, mapFaItemActions, mapItems } from "./transformationData";
import { createFaItemActionsKoobDataService } from "./createFaItemActionsKoobDataService";
import { TreeViewContext } from "../treeView.context";

/**
 * Хук загрузки орагнизаций.
 */
const pickExisting = (obj, keys) =>Object.fromEntries(keys.filter(n => n in obj).map(n => [ n, obj[n] ]));

export const useItems = (filters: any = {}, props?: any) => {
  const { cfg } = props;

  const koobModel =   useService<KoobService>(KoobService, cfg.getRaw().dataSource.koob);
  const { isReload, setIsReload } = useContext(TreeViewContext);
  const [items, setItems] = useState<OrganisationData[]>([]);

  const dashFilters = KoobFiltersService.getInstance().getModel().filters;

  const fFilters = useMemo(() => pickExisting(dashFilters,cfg.dataSource.dimensions),[dashFilters]);
 // if (Object.entries(fFilters).length === 0) {
  //значения фильтров по умолчанию из настроек куба
  for(let key in cfg.dataSource.dimensions) {
    const column = $eid(koobModel.dimensions, cfg.dataSource.dimensions[key]);
    if (column?.config?.defaultValue && !fFilters.hasOwnProperty(cfg.dataSource.dimensions[key])){
      fFilters[cfg.dataSource.dimensions[key]] = column?.config?.defaultValue;
    }
  };
//};
//console.log(fFilters);

  const dataService = useMemo(
    () => createRootKoobDataService({ ...filters, ...fFilters }),
    [fFilters]
  );

  const handleSataServiceUpdate = useCallback(
    (model: IKoobDataModel) => {
      if (model.error || model.loading) {
        setItems([]);
        return;
      }

      const itemDtos = model.values as OrganisationDataDto[];
      setItems(mapItems(itemDtos));
      if (isReload) {
        setIsReload(false);
      }
    },
    [setItems, isReload]
  );

  useEffect(() => {
    dataService.subscribeUpdatesAndNotify(handleSataServiceUpdate);
  }, [dataService, handleSataServiceUpdate]);

  return { items, setItems };
};

/**
 * Хук загрузки доп. колонок.
 */
export const useFaformColumns = () => {
 
  const [items, setItems] = useState<FaformColumn[]>([]);

  const dataService = useMemo( createFaformKoobDataService, []);

  const handleSataServiceUpdate = useCallback(
    (model: IKoobDataModel) => {
      if (model.error || model.loading) {
        setItems([]);
        return;
      }

      const itemDtos = model.values as FaformDto[];

      setItems(mapColumns(itemDtos));
    },
    [setItems]
  );

  useEffect(() => {
    dataService.subscribeUpdatesAndNotify(handleSataServiceUpdate);
  }, [dataService, handleSataServiceUpdate]);

  return items;
};

/**
 * Хук загрузки экшенов для ячейки по доп колонкам.
 */
export const useActions = (filters: any = {}) => {
  const dataService = useMemo(
    () => createFaItemActionsKoobDataService(filters),
    []
  );
  const [items, setItems] = useState<FaItemAction[]>([]);

  const handleSataServiceUpdate = useCallback(
    (model: IKoobDataModel) => {
      if (model.error || model.loading) {
        setItems([]);
        return;
      }

      const itemDtos = model.values as FaItemActionDto[];

      setItems(mapFaItemActions(itemDtos));
    },
    [setItems]
  );

  useEffect(() => {
    dataService.subscribeUpdatesAndNotify(handleSataServiceUpdate);
  }, [dataService, handleSataServiceUpdate]);

  return items;
};
