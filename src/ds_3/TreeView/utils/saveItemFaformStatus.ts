import { ENDPOINT_CREATE_FAFORM_STATUS } from "../treeView.constants";
import { FaformStatusDto } from "../treeView.interface";

/**
 * Корректировка формата вывода числовых данных
 * @param data Данные для запроса.
 */
export const saveItemFaformStatus = async (
  data: FaformStatusDto[],
  oldFrmSt?: number
) => {
  if (oldFrmSt !== undefined) {
    // UPDATE
    const updateData: {
      update: FaformStatusDto;
    }[] = [];
    data.forEach((element) => {
      updateData.push({ update: element });
    });
    try {
      const response = await fetch(ENDPOINT_CREATE_FAFORM_STATUS, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify(updateData, (key, value) => {
          if (value !== "") return value;
          else return null;
        }),
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  } else {
    // INSERT
    const insertData: {
      insert: FaformStatusDto;
    }[] = [];
    data.forEach((element) => {
      insertData.push({ insert: element });
    });
    try {
      const response = await await fetch(ENDPOINT_CREATE_FAFORM_STATUS, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify(insertData, (key, value) => {
          if (value !== "") return value;
          else return null;
        }),
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
};
