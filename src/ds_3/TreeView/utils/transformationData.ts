import {
  FaformColumn,
  FaformDto,
  OrganisationData,
  OrganisationDataDto,
} from "../treeView.interface";

/**
 * Преобразование сущностей организаций получаемых из бд к внутреннему формату.
 */
export const mapItems = (dtos: OrganisationDataDto[]): OrganisationData[] => {
  const organisationsMap = new Map<OrganisationData["id"], OrganisationData>();
  dtos.forEach((dto) => {
    // Если у записи dto поле pred_v_id = какому либо
    // другому значению predpr_pred_id из dtos, то этой записи не должно быть
    const isReturn = dtos.find((item) => dto.pred_v_id === item.predpr_pred_id);
    if (isReturn) {
      console.log(isReturn.predpr_pred_id + " --- " + dto.predpr_pred_id);
    }

    let organisationData: OrganisationData;
    if (!isReturn) {
      organisationData = organisationsMap.has(dto.predpr_pred_id)
        ? organisationsMap.get(dto.predpr_pred_id)!
        : {
            id: dto.predpr_pred_id,
            name: dto.pname || "",
            hasChildren: dto.children_count > 0,
            formData: new Map<number, number>(),
          };

      if (
        dto.form_id !== undefined &&
        dto.form_id !== null &&
        dto.form_status
      ) {
        organisationData.formData.set(dto.form_id, dto.form_status);
      }
      organisationsMap.set(organisationData.id, organisationData);
    }
  });
  return Array.from(organisationsMap.values());
};

/**
 * Преобразование сущностей доп. колонок получаемых из бд к внутреннему формату.
 */
export const mapColumns = (dtos: FaformDto[]): FaformColumn[] =>
  dtos?.map((dto) => ({ id: dto?.frm_id, title: dto?.title }));
