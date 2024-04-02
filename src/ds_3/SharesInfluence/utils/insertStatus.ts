import { ENDPOINT_STATUS } from "../sharesInfluence.constants";
import { StatusDto } from "../sharesInfluence.interface";

export const insertStatus = async (data: StatusDto[]) => {
  try {
    const insertData: {
      insert: StatusDto;
    }[] = [];
    data.forEach((element) => {
      insertData.push({ insert: element });
    });
    const response = await fetch(ENDPOINT_STATUS, {
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
};
