import { ENDPOINT_STATUS } from "../sourceData.constants";
import { StatusDto } from "../sourceData.interface";

export const insertStatus = async (data: StatusDto) => {
  try {
    const response = await fetch(ENDPOINT_STATUS, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(data, (key, value) => {
        if (value !== "") return value;
        else return null;
      }),
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
