import React, { useState, useCallback } from "react";
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
import { KoobDataService, KoobFiltersService } from "bi-internal/services";
import {
  KOOB_ID_ROWS,
  dimensionsRowsDataService,
} from "./sourceData.constants";

const SourceData = (props) => {
  const [columns, setColumns] = useState<FaPredprIerDto[]>([]);
  const [rows, setRows] = useState<FainfoAll[]>([]);

  const url = UrlState.getInstance().getModel();
  // Хардкод
  const pred_id = url?._pred_id ?? 2176;

  useColumns({ pred_id, setColumns });
  useRows({ pred_id, setRows });

  const onSubmit = useCallback(async (values: { rows: FainfoAll[] }) => {
    const updateData = extractUpdateData(values.rows);
    const response = await updateFadata(updateData);
    if (response?.status === 200) {
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
    }
  }, []);

  if (!pred_id) {
    return <div>pred_id пустое</div>;
  }
  if (rows.length === 0) {
    return <div>Ничего не найдено</div>;
  }

  return (
    <div style={{ padding: "20px", overflow: "scroll", maxHeight: "80vh" }}>
      <Formik initialValues={{ rows }} onSubmit={onSubmit}>
        <SourceDataLayout columns={columns} rows={rows} />
      </Formik>
    </div>
  );
};

export default SourceData;
