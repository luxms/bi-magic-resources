import { ENDPOINT_MODIFY_FAPART } from "../sharesInfluence.constants";
import { FapartDto } from "../sharesInfluence.interface";

const getUrlChunk = (props: FapartDto) => {
  const { factor_id, risk_id, branch, farm, fiscper, fiscvar, ir_flag } = props;
  return (
    `/.filter(risk_id='${risk_id}' && factor_id='${factor_id}' && branch='${branch}' && farm='${farm}' ` +
    `&& fiscvar='${fiscvar}' && fiscper = '${fiscper}' && ir_flag = '${ir_flag}')`
  );
};

export const updateFapart = async (data: FapartDto) => {
  const { fashare } = data;
  const updateData = {
    fashare,
  };
  try {
    const response = await fetch(
      `${ENDPOINT_MODIFY_FAPART}${getUrlChunk(data)}`,
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
