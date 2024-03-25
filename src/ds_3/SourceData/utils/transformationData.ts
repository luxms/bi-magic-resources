import { FadataDto, FainfoAll, FainfoAllDto } from "../sourceData.interface";

export const mapRows = (dtos: FainfoAllDto[]): FainfoAll[] => {
  const fainfoMap = new Map<FainfoAll["info_id"], FainfoAll>();
  if (dtos) {
    dtos.forEach((dto) => {
      let fainfoData: FainfoAll;
      fainfoData = fainfoMap.has(dto.info_id)
        ? fainfoMap.get(dto.info_id)!
        : {
            info_id: dto.info_id,
            fasyst: dto.fasyst,
            grtitle: dto.grtitle,
            ititle: dto.ititle,
            data: [],
            fiscper: dto.fiscper,
            fiscvar: dto.fiscvar,
          };

      fainfoData.data.push({
        pred_id: dto.pred_id,
        fa_data: dto.fa_data,
        disabled: dto.disabled,
      });

      fainfoMap.set(fainfoData.info_id, fainfoData);
    });
  }
  return Array.from(fainfoMap.values());
};

export const extractUpdateData = (
  fainfoAll: FainfoAll[],
  changedData: string[]
): FadataDto[] => {
  const updateData: FadataDto[] = [];
  changedData.forEach((item) => {
    const [rowIndex, columnIndex] = item.split("-");
    const fainfoItem = fainfoAll[rowIndex];
    const dataItem = fainfoItem.data[columnIndex];

    updateData.push({
      info_id: fainfoItem.info_id,
      fiscper: fainfoItem.fiscper,
      fiscvar: fainfoItem.fiscvar,
      pred_id: dataItem.pred_id,
      fa_data: dataItem.fa_data,
    });
  });
  return updateData;
};
