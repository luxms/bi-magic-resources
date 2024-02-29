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
    const updateData = {
      fa_act: data.fa_act,
      frm_st: data.frm_st,
      user_id: data.user_id,
    };
    try {
      const response = await fetch(
        ENDPOINT_CREATE_FAFORM_STATUS +
          `/.filter(frm_id='${data.frm_id}'&& pred_id='${data.pred_id}'&&fiscper=${data.fiscper}&&fiscvar='${data.fiscvar}'&&ir_flag=${data.ir_flag})`,
        {
          method: "PUT",
          credentials: "same-origin",
          headers: { "Content-type": "application/json; charset=utf-8" },
          body: JSON.stringify(updateData),
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
