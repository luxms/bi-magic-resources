import { ENDPOINT_MODIFY_FAINTERVAL } from "../AssessmentIntervals.constants";
import { FaintervalDto } from "../AssessmentIntervals.interface";

const getUrlChunk = (props: FaintervalDto) => {
  const {
    factor_id,
    branch,
    farm,
    fiscper,
    fiscvar,
    ir_flag,
    dor_kod,
    faidval,
  } = props;
  return (
    `/.filter(dor_kod='${dor_kod}' && factor_id='${factor_id}' && branch='${branch}' && farm='${farm}' ` +
    `&& fiscvar='${fiscvar}' && fiscper = '${fiscper}'&& faidval = '${faidval}' && ir_flag = '${ir_flag}')`
  );
};

export const updateFainterval = async (data: FaintervalDto) => {
  const { min_border, max_border } = data;
  const updateData = {
    min_border,
    max_border,
  };
  try {
    const response = await fetch(
      `${ENDPOINT_MODIFY_FAINTERVAL}${getUrlChunk(data)}`,
      {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify(updateData, (key, value) => {
          if (value !== "") return value;
          else return null;
        }),
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
