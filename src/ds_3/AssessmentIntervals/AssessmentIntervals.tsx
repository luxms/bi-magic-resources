import React, { useCallback, useEffect, useState } from "react";
import { Formik } from "formik";

import { UrlState } from "bi-internal/core";

import {
  useLockAndUnLock,
  useRowsAndColumnsFainterval,
  extractUpdateData,
  mapColumns,
  mapRows,
  insertFainterval,
  updateFainterval,
} from "./utils";
import { SharesInfluenceLayout } from "./AssessmentIntervals.layout";
import { updateFaintervalMass } from "./utils/updateFainterval";
import {
  Column,
  FaintervalDto,
  DataInsertFainterval,
  Row,
} from "./AssessmentIntervals.interface";
import { KoobDataService } from "bi-internal/services";
import {
  KOOB_ID_FAINTERVAL,
  dimensionsFainterval,
} from "./AssessmentIntervals.constants";

const SharesInfluence = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
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
  const branch = url?._branch;
  const farm = url?._farm;
  const dor_kod = url?._dor_kod;
  const cash = url?._cash;

  const filters: { [key: string]: any } = {
    fiscvar: ["=", fiscvar],
    fiscper: ["=", fiscper],
    branch: ["=", branch],
    farm: ["=", farm],
    ir_flag: ["=", ir_flag],
    total: ["=", 0],
    dor_kod: ["=", dor_kod],
    pred_id: ["=", pred_id],
  };
  useRowsAndColumnsFainterval({
    pred_id,
    filters,
    setRows,
    setColumns,
    isReload,
    setIsReload,
    fiscper,
    fiscvar,
    ir_flag,
    branch,
    farm,
    dor_kod,
    cash,
  });

  const onSubmit = useCallback(
    async (values: { rows: Row[] }) => {
      const updateData = extractUpdateData(
        values.rows,
        Array.from(changedData)
      );

      let response = await updateFaintervalMass(updateData);
      let isError = response?.status !== 200;

      /*let isError = false;
      for (let i = 0; i < updateData.length; i++) {
        const element = updateData[i];
        // if (element?.min_border != null || element?.max_border != null) {
        let response = await updateFainterval(element);
        if (response?.status !== 200) {
          response = await insertFainterval(element);
          isError = response?.status !== 200;
        }
        // }
      }*/
      setRows([]);
      setChangedData(new Set<string>());

      KoobDataService.koobDataRequest3(
        KOOB_ID_FAINTERVAL,
        dimensionsFainterval,
        [],
        filters
      )
        .then((data: FaintervalDto[]) => {
          setRows(mapRows(data));
          setColumns(mapColumns(data));
        })
        .catch(() => {
          setRows([]);
          setColumns([]);
        });
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
    setRows([]);
  }, [isEditing, pred_id, unlock]);

  // Если пользователь нажал назад будучи на вкладке на которой была установлена блокировка
  useEffect(() => {
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [pred_id, onPopState]);

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

  if (
    pred_id === undefined ||
    fiscper === undefined ||
    fiscvar === undefined ||
    user_id === undefined ||
    ir_flag === undefined ||
    branch === undefined ||
    farm === undefined ||
    dor_kod === undefined
  ) {
    return <div>Переход был осуществлен не из TreeView</div>;
  }

  if (columns.length === 0 && rows.length === 0) {
    return <div>Ничего не найдено</div>;
  }

  return (
    <div style={{ padding: "20px", overflow: "scroll", maxHeight: "100%" }}>
      <Formik initialValues={{ rows }} onSubmit={onSubmit} enableReinitialize>
        <SharesInfluenceLayout
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

export default SharesInfluence;
