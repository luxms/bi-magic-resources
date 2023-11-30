import { useCallback, useContext, useEffect, useMemo, useState } from "react";

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

  const dataService = useMemo(
    () => createRootKoobDataService(filters),
    [props]
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
      if (itemDtos.length === 0) {
        dataService.setFilter({ ...filters, branch: ["=", ""] });
        return;
      }
      setItems(mapFaItemActions(itemDtos));
    },
    [setItems]
  );

  useEffect(() => {
    dataService.subscribeUpdatesAndNotify(handleSataServiceUpdate);
  }, [dataService, handleSataServiceUpdate]);

  return items;
};
