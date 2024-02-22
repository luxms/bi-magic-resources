import React, { useState, useCallback, useEffect } from "react";
import { Formik } from "formik";

import { UrlState } from "bi-internal/core";
import { KoobDataService } from "bi-internal/services";

import {
  KOOB_ID_ROWS,
  dimensionsRowsDataService,
} from "./sourceData.constants";
import { SourceDataLayout } from "./SourceData.layout";
import {
  FaPredprIerDto,
  FainfoAll,
  FainfoAllDto,
  StatusDto,
} from "./sourceData.interface";
import { useColumns, useLockAndUnLock, useRows } from "./utils/hooks";
import { extractUpdateData, mapRows } from "./utils/transformationData";
import { updateFadata } from "./utils/updateFadata";
import { insertFadata } from "./utils/insertFadata";
import { updateStatus } from "./utils/updateStatus";
import { insertStatus } from "./utils/insertStatus";
const SourceData = (props) => {
  const [columns, setColumns] = useState<FaPredprIerDto[]>([]);
  const [rows, setRows] = useState<FainfoAll[]>([]);
  const [changedData, setChangedData] = useState(new Set<string>());
  // Флаг открытия закрытия редактирования. Выставляется после блокировки
  const [isEditing, setIsEditing] = useState(false);
  // Флаг отвечает за перезагрузку данных, если открыли на редактирование.
  const [isReload, setIsReload] = useState(false);

  const { lock, unlock } = useLockAndUnLock({ setIsEditing });

  const addChangedData = useCallback(
    (value: string) => {
      setChangedData(new Set<string>(changedData.add(value)));
    },
    [changedData, setChangedData]
  );

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
  };
  const insStatus: StatusDto = {
    pred_id: pred_id,
    frm_id: 1,
    fiscper: fiscper,
    fiscvar: fiscvar,
    ir_flag: ir_flag,
    frm_st: 10,
    fa_act: 32,
    user_id: user_id,
  };
  useColumns({ pred_id, setColumns, filters });
  useRows({
    pred_id,
    setRows,
    filters: { ...filters, IR_FLAG: ["=", ir_flag, null] },
    isReload,
    setIsReload,
  });

  const onSubmit = useCallback(
    async (values: { rows: FainfoAll[] }) => {
      const updateData = extractUpdateData(
        values.rows,
        Array.from(changedData)
      );
      let isError = false;
      for (let i = 0; i < updateData.length; i++) {
        const element = updateData[i];
        //if (element?.fa_data != null) {
        let response = await updateFadata(element);
        if (response?.status !== 200) {
          response = await insertFadata(element);
          isError = response?.status !== 200;
        }

        if (i == updateData.length - 1) {
          response = await insertStatus(insStatus);
          if (response?.status !== 200) {
            response = await updateStatus({ ...insStatus, frm_st: 20 });
          }
        }
        //}
      }

      setRows([]);
      setChangedData(new Set<string>());
      KoobDataService.koobDataRequest3(
        KOOB_ID_ROWS,
        dimensionsRowsDataService.map((item) => item.id),
        [],
        { ...filters, IR_FLAG: ["=", ir_flag, null] }
      )
        .then((data) => {
          const rows = mapRows(data as FainfoAllDto[]);
          setRows(rows);
        })
        .catch(() => setRows([]));
      if (isError) {
        alert("Ошибка при сохранении записей");
      }
    },
    [changedData]
  );

  useEffect(() => {
    setChangedData(new Set<string>());
  }, [pred_id, fiscper, fiscvar]);

  // Если пользователь закрыл вкладку на которой была установлена блокировка
  useEffect(() => {
    window.addEventListener("beforeunload", unlock);
    return () => {
      window.removeEventListener("beforeunload", unlock);
    };
  }, [pred_id]);

  const onPopState = useCallback(() => {
    if (isEditing) {
      unlock();
    }
  }, [isEditing, pred_id, unlock]);

  // Если пользователь нажал назад будучи на вкладке на которой была установлена блокировка
  useEffect(() => {
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [pred_id, onPopState]);

  if (
    pred_id === undefined ||
    fiscper === undefined ||
    fiscvar === undefined ||
    user_id === undefined ||
    ir_flag === undefined
  ) {
    return <div>Переход был осуществлен не из TreeView</div>;
  }
  if (rows.length === 0) {
    return <div>Ничего не найдено</div>;
  }

  return (
    <div style={{ padding: "20px", height: "100%", width: "100%" }}>
      <Formik initialValues={{ rows }} onSubmit={onSubmit}>
        <SourceDataLayout
          columns={columns}
          rows={rows}
          addChangedData={addChangedData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setIsReload={setIsReload}
          lock={lock}
          unlock={unlock}
        />
      </Formik>
    </div>
  );
};

export default SourceData;
