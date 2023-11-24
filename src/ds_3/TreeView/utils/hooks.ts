import { useCallback, useEffect, useMemo, useState } from "react";

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

/**
 * Хук загрузки орагнизаций.
 */
export const useItems = (
  filters: any = {},
  setItems: (items: OrganisationData[]) => void,
  props?: any
) => {
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
    },
    [setItems]
  );

  useEffect(() => {
    dataService.subscribeUpdatesAndNotify(handleSataServiceUpdate);
  }, [dataService, handleSataServiceUpdate]);
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
