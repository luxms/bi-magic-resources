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
import { updateFadataMass } from "./utils/updateFadata";
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
  const cash = url?._cash;
  const isView = url._fa_act === 34 ? true : false;
  const caption = url?._caption;

  const filters: { [key: string]: any } = {
    pred_idf: ["=", pred_id],
    fiscvar: ["=", fiscvar],
    fiscper: ["=", fiscper],
  };
  const insStatus: StatusDto[] = [
    {
      pred_id: pred_id,
      frm_id: 1,
      fiscper: fiscper,
      fiscvar: fiscvar,
      ir_flag: ir_flag,
      frm_st: 10,
      fa_act: 32,
      user_id: user_id,
    },
  ];
  useColumns({ pred_id, setColumns, filters });
  useRows({
    pred_id,
    setRows,
    filters: { ...filters, ir_flag: ["=", ir_flag, null] },
    isReload,
    setIsReload,
    fiscper,
    fiscvar,
    ir_flag,
    cash,
  });

  const onSubmit = useCallback(
    async (values: { rows: FainfoAll[] }) => {
      const updateData = extractUpdateData(
        values.rows,
        Array.from(changedData)
      );
      let response = await updateFadataMass(updateData);
      let isError = response?.status !== 200;
      if (updateData.length > 0 && !isError) {
        response = await insertStatus(insStatus);
      }
      /* for (let i = 0; i < updateData.length; i++) {
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
      }*/

      setRows([]);
      setChangedData(new Set<string>());
      KoobDataService.koobDataRequest3(
        KOOB_ID_ROWS,
        dimensionsRowsDataService.map((item) => item.id),
        [],
        { ...filters, ir_flag: ["=", ir_flag, null] }
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

  //Коды клавиш
  const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  // Выбираем все вводимые элементы
  const inputElems = document.getElementsByTagName("input");

  // Создаем массив вводимых элементов
  const inputElemsMass = Array.prototype.slice.call(inputElems);

  //Добавляем обработчики
  inputElemsMass.forEach((elem) => {
    if (elem.type.toLowerCase() == "number") {
      elem.addEventListener("focus", disableScroll, false);
      elem.addEventListener("blur", enableScroll, false);
    }
  });

  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
  }

  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }

  function disableScroll() {
    if (window.addEventListener)
      // older FF
      window.addEventListener("DOMMouseScroll", preventDefault, false);
    document.addEventListener("wheel", preventDefault, { passive: false }); // Disable scrolling in Chrome
    window.onwheel = preventDefault; // modern standard
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
  }

  function enableScroll() {
    if (window.removeEventListener)
      window.removeEventListener("DOMMouseScroll", preventDefault, false);
    document.removeEventListener("wheel", preventDefault); // Enable scrolling in Chrome
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
  }

  const onPopState = useCallback(() => {
    if (isEditing) {
      const url = UrlState.getInstance().getModel();
      unlock(url);
    }
    setRows([]);
  }, [isEditing, pred_id, unlock, isReload]);

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
          isView={isView}
          setIsEditing={setIsEditing}
          setIsReload={setIsReload}
          lock={lock}
          unlock={unlock}
          tcaption={caption}
        />
      </Formik>
    </div>
  );
};

export default SourceData;
