import {
  Column,
  FaintervalDto,
  DataInsertFainterval,
  Row,
} from "../AssessmentIntervals.interface";

export const mapRows = (data: FaintervalDto[]) => {
  const rowsMap = new Map<string | null, Row>();
  data.map((item) => {
    let groupFakt: Row;
    groupFakt = rowsMap.has(item.f_text)
      ? rowsMap.get(item.f_text)!
      : {
          ...item,
          data: [],
        };
    groupFakt.data.push(item);

    rowsMap.set(item.f_text, groupFakt);
  });
  return Array.from(rowsMap.values());
};

export const mapColumns = (data: FaintervalDto[]): Column[] => {
  // Массив всех уникальных
  const ufaIdval = new Set(data.map((item) => item.faidval));
  const columns: Column[] = [];
  ufaIdval.forEach((element) => {
    columns.push({
      faidval: element,
    });
  });
  return columns;
};

export const extractUpdateData = (
  rows: Row[],
  changedData: string[]
): DataInsertFainterval[] => {
  const updateData: DataInsertFainterval[] = [];
  changedData.forEach((item) => {
    const [rowIndex, columnIndex] = item.split("-");
    const fainfoItem = rows[rowIndex];
    const dataItem = fainfoItem.data[columnIndex];
    updateData.push({
      factor_id: dataItem.factor_id,
      farm: dataItem.farm,
      branch: dataItem.branch,
      fiscper: dataItem.fiscper,
      fiscvar: dataItem.fiscvar,
      faidval: dataItem.faidval,
      min_border: dataItem.min_border,
      max_border: dataItem.max_border,
      ir_flag: dataItem.ir_flag,
      dor_kod: dataItem.dor_kod,
    });
  });
  return updateData;
};
