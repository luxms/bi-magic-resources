import { ENDPOINT_UPDATE_FADATA } from "../sourceData.constants";
import { FadataDto } from "../sourceData.interface";

export const insertFadata = async (data: FadataDto) => {
  try {
    const response = await fetch(ENDPOINT_UPDATE_FADATA, {
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
