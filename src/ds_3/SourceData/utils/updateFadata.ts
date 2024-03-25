import {
  ENDPOINT_UPDATE_FADATA,
  ENDPOINT_UPDATE_FADATA_MASS,
} from "../sourceData.constants";
import { FadataDto } from "../sourceData.interface";

const getUrlChunk = (props: FadataDto) => {
  const { pred_id, fiscper, fiscvar, info_id } = props;
  return `/.filter(pred_id='${pred_id}' && info_id='${info_id}' && fiscper = '${fiscper}' && fiscvar = '${fiscvar}')`;
};

export const updateFadata = async (data: FadataDto) => {
  try {
    const { fa_data } = data;
    const updateData = {
      fa_data: fa_data,
    };
    const response = await fetch(
      `${ENDPOINT_UPDATE_FADATA}${getUrlChunk(data)}`,
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
export const updateFadataMass = async (data: FadataDto[]) => {
  try {
    const updateData: {
      update: FadataDto;
    }[] = [];
    data.forEach((element) => {
      updateData.push({ update: element });
    });

    const response = await fetch(ENDPOINT_UPDATE_FADATA_MASS, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(updateData, (key, value) => {
        if (value !== "") return value;
        else return null;
      }),
    });
    if (response?.status !== 200) {
      return response;
    } else {
      let parsed = await response?.json();
      const insertData: {
        insert: FadataDto;
      }[] = [];
      parsed.forEach((element) => {
        if (element.count[0] === 0) {
          insertData.push({ insert: element.update });
        }
      });

      if (insertData.length > 0) {
        const response1 = await fetch(ENDPOINT_UPDATE_FADATA_MASS, {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-type": "application/json; charset=utf-8" },
          body: JSON.stringify(insertData, (key, value) => {
            if (value !== "") return value;
            else return null;
          }),
        });
        return response1;
      } else {
        return response;
      }
    }
  } catch (error) {
    console.log(error);
  }
};
