import React, { useCallback, useEffect, useState } from "react";
import { Formik } from "formik";

import { UrlState } from "bi-internal/core";

import {
  useLockAndUnLock,
  useRowsAndColumnsFapart,
  extractUpdateData,
  mapColumns,
  mapRows,
} from "./utils";
import { updateFapartMass } from "./utils/updateFapart";
import { SharesInfluenceLayout } from "./SharesInfluence.layout";
import { Column, FapartDto, Row, StatusDto } from "./sharesInfluence.interface";
import { insertStatus } from "./utils/insertStatus";
import { KoobDataService } from "bi-internal/services";
import { KOOB_ID_FAPART, dimensionsFapart } from "./sharesInfluence.constants";

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
  const cash = url?._cash;
  const caption = url?._caption;

  const filters: { [key: string]: any } = {
    fiscvar: ["=", fiscvar],
    fiscper: ["=", fiscper],
    branch: ["=", branch],
    farm: ["=", farm],
    ir_flag: ["=", ir_flag],
    total: ["=", 0],
  };

  const insStatus: StatusDto[] = [
    {
      pred_id: pred_id,
      frm_id: 2,
      fiscper: fiscper,
      fiscvar: fiscvar,
      ir_flag: ir_flag,
      frm_st: 11,
      fa_act: 40,
      user_id: user_id,
    },
  ];

  useRowsAndColumnsFapart({
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
    cash,
  });

  const onSubmit = useCallback(
    async (values: { rows: Row[] }) => {
      const updateData = extractUpdateData(
        values.rows,
        Array.from(changedData)
      );

      let response = await updateFapartMass(updateData);
      let isError = response?.status !== 200;
      //if (updateData.length > 0 && !isError) {
      response = await insertStatus(insStatus);
      // }
      /*let isError = false;
      for (let i = 0; i < updateData.length; i++) {
        const element = updateData[i];
        //if (element?.fashare != null) {
        let response = await updateFapart(element);
        if (response?.status !== 200) {
          response = await insertFapart(element);
          isError = response?.status !== 200;
        }
        //}
      }*/
      setRows([]);
      setChangedData(new Set<string>());

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
    farm === undefined
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
          tcaption={caption}
        />
      </Formik>
    </div>
  );
};

export default SharesInfluence;
