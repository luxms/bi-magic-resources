import { ENDPOINT_CREATE_FAFORM_STATUS } from "../treeView.constants";
import { FaformStatusDto } from "../treeView.interface";

/**
 * Корректировка формата вывода числовых данных
 * @param data Данные для запроса.
 */
export const saveItemFaformStatus = async (
  data: FaformStatusDto,
  oldFrmSt?: number
) => {
  if (oldFrmSt !== undefined) {
    // UPDATE
    try {
      const response = await fetch(
        ENDPOINT_CREATE_FAFORM_STATUS +
          `/.filter(frm_id='${data.frm_id}' && pred_id='${data.pred_id}' && frm_st = ${oldFrmSt})`,
        {
          method: "PUT",
          credentials: "same-origin",
          headers: { "Content-type": "application/json; charset=utf-8" },
          body: JSON.stringify(data),
        }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  } else {
    // INSERT
    try {
      const response = await await fetch(ENDPOINT_CREATE_FAFORM_STATUS, {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json; charset=utf-8" },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
};
//   const response = await fetch(
//     `${getEndpoint()}${getUrlFilterChunk({
//       userName,
//       dashboardId,
//       schemaName,
//     })}`,
//     {
//       method: "PUT",
//       credentials: "same-origin",
//       headers: { "Content-type": "application/json; charset=utf-8" },
//       body: JSON.stringify(updateData),
//     }
//   try {
//     const response = await fetch(ENDPOINT_CREATE_FAFORM_STATUS, {
//       method: "POST",
//       credentials: "same-origin",
//       body: JSON.stringify(data),
//       headers: { "Content-type": "application/json; charset=utf-8" },
//     });
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// };
