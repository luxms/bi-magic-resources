import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { IKoobDataModel } from "bi-internal/services/koob";

import { createRootKoobDataService } from "./createRootKoobDataService";
import { createFaformKoobDataService } from "./createFaformKoobDataService";
import {
  FaformColumn,
  FaformDto,
  OrganisationData,
  OrganisationDataDto,
} from "../treeView.interface";
import { mapColumns, mapItems } from "./transformationData";
import { TreeViewContext } from "../treeView.context";

/**
 * Хук загрузки орагнизаций.
 */
export const useItems = (filters: any = {}, props?: any) => {
  const { isReloadData, setIsReloadData } = useContext(TreeViewContext);
  const dataService = useMemo(
    () => createRootKoobDataService(filters),
    [props]
  );
  const [items, setItems] = useState<OrganisationData[]>([]);

  const handleSataServiceUpdate = useCallback(
    (model: IKoobDataModel) => {
      if (model.error || model.loading) {
        setItems([]);
        return;
      }

      const itemDtos = model.values as OrganisationDataDto[];
      setItems(mapItems(itemDtos));
    },
    [setItems]
  );

  useEffect(() => {
    if (!items.length || isReloadData) {
      dataService.subscribeUpdatesAndNotify(handleSataServiceUpdate);
    }
  }, [dataService, isReloadData, handleSataServiceUpdate]);

  useEffect(() => {
    if (isReloadData) {
      setIsReloadData(false);
    }
  }, [items, setIsReloadData]);

  return items;
};

/**
 * Хук загрузки доп. колонок.
 */
export const useFaformColumns = () => {
  const { isReloadData, setIsReloadData } = useContext(TreeViewContext);
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
    if (!items.length || isReloadData) {
      dataService.subscribeUpdatesAndNotify(handleSataServiceUpdate);
    }
  }, [isReloadData, dataService, handleSataServiceUpdate]);

  useEffect(() => {
    if (items.length !== 0) {
      setIsReloadData(false);
    }
  }, [items, setIsReloadData]);

  return items;
};
