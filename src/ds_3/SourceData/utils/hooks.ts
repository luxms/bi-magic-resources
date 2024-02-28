import { useCallback, useEffect } from "react";

import { KoobDataService } from "bi-internal/services";
import { UrlState } from "bi-internal/core";

import {
  UseColumnsParams,
  UseLockAndUnlock,
  UseRowsParams,
} from "./hooks.interface";
import {
  KOOB_ID_COLUMNS,
  KOOB_ID_LOCK,
  KOOB_ID_ROWS,
  KOOB_ID_UNLOCK,
  dimensionsColumnsDataService,
  dimensionsLock,
  dimensionsRowsDataService,
  dimensionsUnLock,
} from "../sourceData.constants";
import { mapRows } from "./transformationData";
import { FainfoAllDto } from "../sourceData.interface";

export const useColumns = ({
  setColumns,
  pred_id,
  filters = {},
}: UseColumnsParams) => {
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
      filters
    )
      .then((data) => {
        setColumns(data);
      })
      .catch(() => setColumns([]));
  }, [pred_id]);
};

export const useRows = ({
  pred_id,
  setRows,
  filters = {},
  isReload,
  setIsReload,
  fiscper,
  fiscvar,
  ir_flag,
  cash,
}: UseRowsParams) => {
  useEffect(() => {
    setRows([]);
  }, [pred_id, isReload, fiscper, fiscvar, ir_flag, cash]);

  useEffect(() => {
    if (!pred_id) {
      return;
    }
    KoobDataService.koobDataRequest3(
      KOOB_ID_ROWS,
      dimensionsRowsDataService.map((item) => item.id),
      [],
      filters
    )
      .then((data) => {
        const rows = mapRows(data as FainfoAllDto[]);
        setRows(rows);
      })
      .catch(() => setRows([]));
    setIsReload(false);
  }, [pred_id, isReload, fiscper, fiscvar, ir_flag, cash]);
};

export const useLockAndUnLock = ({ setIsEditing }: UseLockAndUnlock) => {
  const url = UrlState.getInstance().getModel();
  const pred_id = url?._pred_id;
  const fiscper = url?._fiscper;
  const fiscvar = url?._fiscvar;
  const user_id = url?._user_id;
  const ir_flag = Number(url?._ir_flag);

  const filters: { [key: string]: any } = {
    PRED_IDF: ["=", pred_id],
    FISCVAR: ["=", fiscvar],
    FISCPER: ["=", fiscper],
    FRM_ID: ["=", 1],
    IR_FLAG: ["=", ir_flag],
  };

  const lock = useCallback(
    (value: any) => {
      const filters: { [key: string]: any } = {
        PRED_IDF: ["=", value._pred_id],
        FISCVAR: ["=", value._fiscvar],
        FISCPER: ["=", value._fiscper],
        FRM_ID: ["=", 1],
        IR_FLAG: ["=", value._ir_flag],
        USR_ID: ["=", value._user_id],
      };
      KoobDataService.koobDataRequest3(
        KOOB_ID_LOCK,
        dimensionsLock.map((item) => item.id),
        [],
        filters
      )
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            if (data[0].locks === true) {
              setIsEditing(true);
            }
            if (data[0].locks === false) {
              alert("Не удается заблокировать");
            }
          }
        })
        .catch(() => setIsEditing(false));
    },
    [user_id, ir_flag, filters]
  );

  const unlock = useCallback(
    (value: any) => {
      const filters: { [key: string]: any } = {
        PRED_IDF: ["=", value._pred_id],
        FISCVAR: ["=", value._fiscvar],
        FISCPER: ["=", value._fiscper],
        FRM_ID: ["=", 1],
        IR_FLAG: ["=", value._ir_flag],
      };
      KoobDataService.koobDataRequest3(
        KOOB_ID_UNLOCK,
        dimensionsUnLock.map((item) => item.id),
        [],
        filters
      ).then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          if (data[0].unlocks === true) {
            setIsEditing(false);
          }
          if (data[0].unlocks === false) {
            alert("Не удается разблокировать.");
          }
        }
      });
    },
    [user_id, ir_flag, filters]
  );
  return {
    lock,
    unlock,
  };
};
