import {
  Column,
  FapartDto,
  DataInsertFapart,
  Row,
} from "../sharesInfluence.interface";

export const mapRows = (data: FapartDto[]) => {
  const rowsMap = new Map<string | null, Row>();
  data.map((item) => {
    let groupRisk: Row;
    groupRisk = rowsMap.has(item.r_text)
      ? rowsMap.get(item.r_text)!
      : {
          ...item,
          data: [],
        };
    groupRisk.data.push(item);

    rowsMap.set(item.r_text, groupRisk);
  });
  return Array.from(rowsMap.values());
};

export const mapColumns = (data: FapartDto[]) => {
  // Массив всех уникальных obj_text
  const objTexts = new Set(data.map((item) => item.obj_text));
  // Массив всех уникальных obj_text-f_group_text
  const fFroupTexts = new Set(
    data.map((item) => item.obj_text + "*" + item.f_group_text)
  );
  // Определение значений второго и третьего уровня
  // f_group_text = массив уникальных f_text
  const thirdLineObjColumns: {
    f_group_text: string;
    data: { f_text: string }[];
  }[] = [];
  fFroupTexts.forEach((element) => {
    thirdLineObjColumns.push({
      f_group_text: element,
      data: Array.from(
        new Set(
          data
            .filter(
              (item) => item.obj_text + "*" + item.f_group_text === element
            )
            .map((item) => item.f_text ?? "-")
        )
      ).map((item) => ({
        f_text: item,
      })),
    });
  });
  // Результирующий массив, содержит три уровня obj_text f_group_text f_text
  const columns: Column[] = [];
  // ....
  // Всё как в тумане... Я ёжик
  // ....^^^....
  // Проходимся по каждой уникальной записи obj_text
  objTexts.forEach((element) => {
    // Получаем все уникальные записи f_group_text по obj_text
    const filtredData = Array.from(
      new Set(
        data
          .filter((item) => item.obj_text === element)
          .map((item) => item.obj_text + "*" + item.f_group_text)
      )
    );
    const fGroupTextFiltred: {
      f_group_text: string;
      colspan?: number;
      data: { f_text: string }[];
    }[] = [];

    // По записям filtredData ищем в ранее полученном массиве готовые значения
    filtredData.forEach((fFroupText) => {
      fGroupTextFiltred.push(
        ...thirdLineObjColumns.filter(
          (thirdLineObjItem) => fFroupText === thirdLineObjItem.f_group_text
        )
      );
    });

    let colspanObjText = 0;
    // Новая константа для установки colspan
    const columnsItem = fGroupTextFiltred.map((element) => {
      const fTextLength = element.data.length;
      colspanObjText += fTextLength;
      const f_group_text = element.f_group_text.split("*")[1];
      return {
        ...element,
        f_group_text: f_group_text !== "null" ? f_group_text : "",
        colspan: fTextLength,
      };
    });

    columns.push({
      obj_text: element ?? "-",
      colspan: colspanObjText,
      data: columnsItem,
    });
  });

  return columns;
};

export const extractUpdateData = (
  rows: Row[],
  changedData: string[]
): DataInsertFapart[] => {
  const updateData: DataInsertFapart[] = [];
  changedData.forEach((item) => {
    const [rowIndex, columnIndex] = item.split("-");
    const fainfoItem = rows[rowIndex];
    const dataItem = fainfoItem.data[columnIndex];
    updateData.push({
      branch: dataItem.branch,
      factor_id: dataItem.factor_id,
      farm: dataItem.farm,
      fashare: dataItem.fashare,
      fiscper: dataItem.fiscper,
      fiscvar: dataItem.fiscvar,
      ir_flag: dataItem.ir_flag,
      risk_id: dataItem.risk_id,
    });
  });
  return updateData;
};
