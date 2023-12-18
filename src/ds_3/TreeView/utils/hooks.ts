import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { KoobFiltersService } from "bi-internal/services";
import { IKoobDataModel } from "bi-internal/services/koob";

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
export const useItems = (filters: any = {}, props?: any) => {
  const { isReload, setIsReload } = useContext(TreeViewContext);
  const [items, setItems] = useState<OrganisationData[]>([]);
  const dashFilters = KoobFiltersService.getInstance().getModel().filters;

  const dataService = useMemo(
    () => createRootKoobDataService({ ...filters, ...dashFilters }),
    [props, dashFilters]
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
  const dataService = useMemo(createFaformKoobDataService, []);
  const [items, setItems] = useState<FaformColumn[]>([]);

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
