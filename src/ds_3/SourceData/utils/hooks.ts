import { useEffect } from "react";

import { KoobDataService } from "bi-internal/services";

import { UseColumnsParams, UseRowsParams } from "./hooks.interface";
import {
  KOOB_ID_COLUMNS,
  KOOB_ID_ROWS,
  dimensionsColumnsDataService,
  dimensionsRowsDataService,
} from "../sourceData.constants";
import { mapRows } from "./transformationData";
import { FainfoAllDto } from "../sourceData.interface";

export const useColumns = ({ setColumns, pred_id }: UseColumnsParams) => {
  useEffect(() => {
    setColumns([]);
  }, [pred_id]);

  useEffect(() => {
    if (!pred_id) {
      return;
    }
    KoobDataService.koobDataRequest3(
      KOOB_ID_COLUMNS,
      dimensionsColumnsDataService.map((item) => item.id),
      [],
      {
        // Хардкод
        PRED_IDF: ["=", pred_id],
        FISCVAR: ["=", "Q4"],
        FISCPER: ["=", 2023002],
      }
    )
      .then((data) => {
        setColumns(data);
      })
      .catch(() => setColumns([]));
  }, [pred_id]);
};

export const useRows = ({ pred_id, setRows }: UseRowsParams) => {
  useEffect(() => {
    setRows([]);
  }, [pred_id]);

  useEffect(() => {
    if (!pred_id) {
      return;
    }
    KoobDataService.koobDataRequest3(
      KOOB_ID_ROWS,
      dimensionsRowsDataService.map((item) => item.id),
      [],
      {
        // Хардкод
        PRED_IDF: ["=", pred_id],
        FISCVAR: ["=", "Q4"],
        FISCPER: ["=", 2023002],
      }
    )
      .then((data) => {
        const rows = mapRows(data as FainfoAllDto[]);
        setRows(rows);
      })
      .catch(() => setRows([]));
  }, [pred_id]);
};
