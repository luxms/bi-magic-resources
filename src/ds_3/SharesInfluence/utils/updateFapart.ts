import {
  ENDPOINT_MODIFY_FAPART,
  ENDPOINT_MODIFY_FAPART_MASS,
} from "../sharesInfluence.constants";
import { DataInsertFapart, FapartDto } from "../sharesInfluence.interface";

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

export const updateFapartMass = async (data: DataInsertFapart[]) => {
  try {
    const updateData: {
      update: DataInsertFapart;
    }[] = [];
    data.forEach((element) => {
      updateData.push({ update: element });
    });
    const response = await fetch(ENDPOINT_MODIFY_FAPART_MASS, {
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
        insert: DataInsertFapart;
      }[] = [];
      parsed.forEach((element) => {
        if (element.count[0] === 0) {
          insertData.push({ insert: element.update });
        }
      });

      if (insertData.length > 0) {
        const response1 = await fetch(ENDPOINT_MODIFY_FAPART_MASS, {
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
