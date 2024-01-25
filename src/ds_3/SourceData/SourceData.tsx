import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Formik } from "formik";

import { UrlState } from "bi-internal/core";
import { SourceDataLayout } from "./SourceData.layout";
import {
  FaPredprIerDto,
  FainfoAll,
  FainfoAllDto,
} from "./sourceData.interface";
import { useColumns, useRows } from "./utils/hooks";
import { extractUpdateData, mapRows } from "./utils/transformationData";
import { updateFadata } from "./utils/updateFadata";
import { insertFadata } from "./utils/insertFadata";
import { KoobDataService } from "bi-internal/services";
import {
  KOOB_ID_ROWS,
  dimensionsRowsDataService,
} from "./sourceData.constants";

const SourceData = (props) => {
  const [columns, setColumns] = useState<FaPredprIerDto[]>([]);
  const [rows, setRows] = useState<FainfoAll[]>([]);
  const [changedData, setChangedData] = useState(new Set<string>());

  const addChangedData = useCallback(
    (value: string) => {
      setChangedData(new Set<string>(changedData.add(value)));
    },
    [changedData, setChangedData]
  );

  const url = UrlState.getInstance().getModel();
  // Хардкод
  //const pred_id = 2176;
  const pred_id = url?._pred_id;
  const fiscper = url?._fiscper;
  const fiscvar = url?._fiscvar;

  const filters: { [key: string]: any } = {
    PRED_IDF: ["=", pred_id],
    FISCVAR: ["=", fiscvar],
    FISCPER: ["=", fiscper],
  };

  useColumns({ pred_id, setColumns, filters });
  useRows({ pred_id, setRows, filters });

  const onSubmit = useCallback(
    async (values: { rows: FainfoAll[] }) => {
      const updateData = extractUpdateData(
        values.rows,
        Array.from(changedData)
      );
      for (let i = 0; i < updateData.length; i++) {
        const element = updateData[i];
        if (element?.fa_data != null) {
          let response = await updateFadata(element);
          if (response?.status != 200) {
            response = await insertFadata(element);
          }
        }
      }

      //const response = await insertFadata(updateData);
      //console.log(JSON.stringify(updateData));
      //const response = await updateFadata(updateData);
      setRows([]);
      setChangedData(new Set<string>());
      //if (response?.status === 200) {
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
      //}
    },
    [changedData]
  );

  useEffect(() => {
    setChangedData(new Set<string>());
  }, [pred_id, fiscper, fiscvar]);

  if (!pred_id || !fiscper || !fiscvar) {
    return <div>Переход был осуществлен не из TreeView</div>;
  }
  if (rows.length === 0) {
    return <div>Ничего не найдено</div>;
  }

  return (
    <div style={{ padding: "20px", overflow: "scroll", maxHeight: "80vh" }}>
      <Formik initialValues={{ rows }} onSubmit={onSubmit}>
        <SourceDataLayout
          columns={columns}
          rows={rows}
          addChangedData={addChangedData}
        />
      </Formik>
    </div>
  );
};

export default SourceData;
