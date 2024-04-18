import { ENDPOINT_MODIFY_FAINTERVAL } from "../AssessmentIntervals.constants";
import {
  DataInsertFainterval,
  FaintervalDto,
} from "../AssessmentIntervals.interface";

export const insertFainterval = async (data: FaintervalDto) => {
  const createData: DataInsertFainterval = {
    factor_id: data.factor_id,
    farm: data.farm,
    branch: data.branch,
    fiscper: data.fiscper,
    fiscvar: data.fiscvar,
    faidval: data.faidval,
    min_border: data.min_border,
    max_border: data.max_border,
    ir_flag: data.ir_flag,
    dor_kod: data.dor_kod,
    gr_id: data.gr_id,
  };
  try {
    const response = await fetch(ENDPOINT_MODIFY_FAINTERVAL, {
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
