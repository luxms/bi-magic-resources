import { ENDPOINT_STATUS } from "../sourceData.constants";
import { StatusDto } from "../sourceData.interface";

const getUrlChunk = (props: StatusDto) => {
  const { pred_id, frm_id, fiscper, fiscvar, ir_flag } = props;
  return `/.filter(pred_id='${pred_id}' && frm_id='${frm_id}' && fiscper = '${fiscper}' && fiscvar = '${fiscvar}
  ' && ir_flag='${ir_flag}')`;
};

export const updateStatus = async (data: StatusDto) => {
  try {
    const { frm_st, fa_act, user_id } = data;
    const updateData = {
      frm_st: frm_st,
      fa_act: fa_act,
      user_id: user_id,
    };
    const response = await fetch(`${ENDPOINT_STATUS}${getUrlChunk(data)}`, {
      method: "PUT",
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
};
