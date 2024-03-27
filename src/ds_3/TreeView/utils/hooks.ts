import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  KoobFiltersService,
  useService,
  KoobService,
} from "bi-internal/services";
import { IKoobDataModel } from "bi-internal/services/koob";
import { KoobDataService } from "bi-internal/services";
import { $eid } from "bi-internal/utils";

import { demensionsRootKoob } from "./createRootKoobDataService";
import { createFaformKoobDataService } from "./createFaformKoobDataService";
import {
  FaItemAction,
  FaItemActionDto,
  FaformColumn,
  FaformDto,
  OrganisationData,
  OrganisationDataDto,
  FaConfigs,
  FaConfigsDto,
} from "../treeView.interface";
import {
  mapColumns,
  mapFaItemActions,
  mapItems,
  mapFaConfigs,
} from "./transformationData";
import { createFaItemActionsKoobDataService } from "./createFaItemActionsKoobDataService";
import { demensionsFaConfigsKoob } from "./createFaConfigsKoobDataService";

import { TreeViewContext } from "../treeView.context";
import { ROOT_KOOB_ID, FACONFIGS } from "../treeView.constants";

/**
 * Хук загрузки орагнизаций.
 */

const pickExisting = (obj, keys) =>
  Object.fromEntries(keys.filter((n) => n in obj).map((n) => [n, obj[n]]));

export const useItems = (filters: any = {}, props?: any) => {
  const { cfg } = props;
  const { isReload, setIsReload } = useContext(TreeViewContext);
  const [items, setItems] = useState<OrganisationData[]>([]);
  const [pickFilters, setPickFilters] = useState<
    | {
        [k: string]: any;
      }
    | undefined
  >();

  const koobModel = useService<KoobService>(
    KoobService,
    cfg.getRaw().dataSource.koob
  );
  const dashFilters = useMemo(
    () => KoobFiltersService.getInstance().getModel().filters,
    [props]
  );
  useEffect(() => {
    const pickFilters = pickExisting(dashFilters, cfg.dataSource.dimensions);

    // если фильтр dashFilters.ir_flag = 1 добавлять фильтр branch: ['=', 184] и отправлять в сервис фильтров
    if (dashFilters?.ir_flag && dashFilters?.ir_flag[1] === 1) {
      KoobFiltersService.getInstance().setFilter(ROOT_KOOB_ID, "branch", [
        "=",
        "184",
      ]);
      pickFilters["branch"] = ["=", "184"];
    } else {
      /*KoobFiltersService.getInstance().setFilter(
        ROOT_KOOB_ID,
        "branch",
        undefined
      );*/
    }

    //значения фильтров по умолчанию из настроек куба
    cfg.dataSource.dimensions.forEach((dimension) => {
      const column = $eid(koobModel.dimensions, dimension);
      if (
        column?.config?.defaultValue &&
        !pickFilters.hasOwnProperty(dimension)
      ) {
        pickFilters[dimension] = column?.config?.defaultValue;
      }
    });
    const ir_flag = $eid(koobModel.dimensions, "ir_flag");
    if (
      ir_flag !== undefined &&
      ir_flag?.config?.defaultValue !== undefined &&
      !pickFilters.hasOwnProperty("ir_flag")
    ) {
      pickFilters["ir_flag"] = ir_flag?.config?.defaultValue;
    }
    setPickFilters(pickFilters);
  }, [dashFilters, koobModel]);

  useEffect(() => {
    if (pickFilters === undefined) {
      return undefined;
    }

    // Если дефолтное значение
    const filterIrFlag =
      pickFilters !== undefined &&
      Object.keys(pickFilters).length !== 0 &&
      (pickFilters?.ir_flag !== null || pickFilters?.ir_flag !== undefined)
        ? { ir_flag: ["=", null, pickFilters.ir_flag] }
        : {};

    if (Array.isArray(pickFilters?.ir_flag)) {
      filterIrFlag.ir_flag = [...pickFilters.ir_flag, null];
    }

    KoobDataService.koobDataRequest3(
      ROOT_KOOB_ID,
      demensionsRootKoob.map((item) => item.id),
      [],
      { ...filters, ...pickFilters, ...filterIrFlag }
    )
      .then((data) => {
        setItems(mapItems(data as OrganisationDataDto[]));
      })
      .catch(() => setItems([]));

    setIsReload(false);
  }, [pickFilters, isReload]);

  return { items, setItems };
};

/**
 * Хук загрузки доп. колонок.
 */
export const useFaformColumns = () => {
  const [items, setItems] = useState<FaformColumn[]>([]);

  const dataService = useMemo(createFaformKoobDataService, []);

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

/**
 * Хук загрузки параметров ФА.
 */
export const useFaConfigs = (filters: any = {}) => {
  const [items, setItems] = useState<FaConfigs[]>([]);

  useEffect(() => {
    KoobDataService.koobDataRequest3(
      FACONFIGS,
      demensionsFaConfigsKoob.map((item) => item.id),
      [],
      filters
    )
      .then((data) => {
        setItems(mapFaConfigs(data as FaConfigsDto[]));
      })
      .catch(() => setItems([]));
  }, []);

  return items;
};
