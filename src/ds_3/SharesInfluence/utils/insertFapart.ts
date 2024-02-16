import { ENDPOINT_MODIFY_FAPART } from "../sharesInfluence.constants";
import { DataInsertFapart, FapartDto } from "../sharesInfluence.interface";

export const insertFapart = async (data: FapartDto) => {
  const createData: DataInsertFapart = {
    branch: data.branch,
    factor_id: data.factor_id,
    farm: data.farm,
    fashare: data.fashare,
    fiscper: data.fiscper,
    fiscvar: data.fiscvar,
    ir_flag: data.ir_flag,
    risk_id: data.risk_id,
  };
  try {
    const response = await fetch(ENDPOINT_MODIFY_FAPART, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(createData, (key, value) => {
        if (value !== "") return value;
        else return null;
      }),
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
