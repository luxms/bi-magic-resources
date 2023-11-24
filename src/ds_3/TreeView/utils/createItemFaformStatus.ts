import { ENDPOINT_CREATE_FAFORM_STATUS } from "../treeView.constants";
import { FaformStatusDto } from "../treeView.interface";

/**
 * Корректировка формата вывода числовых данных
 * @param data Данные для запроса.
 */
export const createItemFaformStatus = async (data: FaformStatusDto) => {
  try {
    const response = await fetch(ENDPOINT_CREATE_FAFORM_STATUS, {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=utf-8" },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
