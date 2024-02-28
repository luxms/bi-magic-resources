import { useCallback, useEffect } from "react";

import { KoobDataService } from "bi-internal/services";
import { UrlState } from "bi-internal/core";

import {
  UseLockAndUnlockParams,
  UseRowsAndColumnsFapartParams,
} from "./hooks.interface";
import {
  KOOB_ID_FAPART,
  KOOB_ID_LOCK,
  KOOB_ID_UNLOCK,
  dimensionsFapart,
  dimensionsLock,
  dimensionsUnLock,
} from "../sharesInfluence.constants";
import { FapartDto, LockDto, UnlockDto } from "../sharesInfluence.interface";
import { mapColumns, mapRows } from "./transformationData";

export const useRowsAndColumnsFapart = ({
  filters,
  pred_id,
  setColumns,
  setRows,
  isReload,
  setIsReload,
  branch,
  farm,
  fiscper,
  fiscvar,
  ir_flag,
  cash,
}: UseRowsAndColumnsFapartParams) => {
  useEffect(() => {
    setRows([]);
    setColumns([]);
  }, [pred_id, branch, farm, fiscper, fiscvar, ir_flag, cash]);

  useEffect(() => {
    KoobDataService.koobDataRequest3(
      KOOB_ID_FAPART,
      dimensionsFapart,
      [],
      filters
    )
      .then((data: FapartDto[]) => {
        setRows(mapRows(data));
        setColumns(mapColumns(data));
      })
      .catch(() => {
        setRows([]);
        setColumns([]);
      });
    setIsReload(false);
  }, [pred_id, branch, farm, fiscper, fiscvar, ir_flag, isReload, cash]);
};

export const useLockAndUnLock = ({ setIsEditing }: UseLockAndUnlockParams) => {
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
    FRM_ID: ["=", 5],
    IR_FLAG: ["=", ir_flag, null],
  };
  const lock = useCallback(() => {
    KoobDataService.koobDataRequest3(KOOB_ID_LOCK, dimensionsLock, [], {
      ...filters,
      USR_ID: ["=", user_id],
    })
      .then((data: LockDto[]) => {
        if (data.length > 0) {
          if (data[0].locks === true) {
            setIsEditing(true);
          }
          if (data[0].locks === false) {
            alert("Не удается заблокировать");
          }
        }
      })
      .catch(() => setIsEditing(false));
  }, [pred_id, fiscper, fiscvar, ir_flag]);

  const unlock = useCallback(() => {
    KoobDataService.koobDataRequest3(
      KOOB_ID_UNLOCK,
      dimensionsUnLock,
      [],
      filters
    ).then((data: UnlockDto[]) => {
      if (data.length > 0) {
        if (data[0].unlocks === true) {
          setIsEditing(false);
        }
        if (data[0].unlocks === false) {
          alert("Не удается разблокировать.");
        }
      }
    });
  }, [pred_id, fiscper, fiscvar, ir_flag]);
  return {
    lock,
    unlock,
  };
};
