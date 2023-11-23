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
    const organisationData: OrganisationData = organisationsMap.has(
      dto.predpr_pred_id
    )
      ? organisationsMap.get(dto.predpr_pred_id)!
      : {
          id: dto.predpr_pred_id,
          name: dto.pname || "",
          hasChildren: dto.children_count > 0,
          formData: new Map<number, string>(),
        };

    if (dto.form_id !== undefined && dto.form_id !== null && dto.form_status) {
      organisationData.formData.set(dto.form_id, dto.form_status);
    }
    organisationsMap.set(organisationData.id, organisationData);
  });

  return Array.from(organisationsMap.values());
};

/**
 * Преобразование сущностей доп. колонок получаемых из бд к внутреннему формату.
 */
export const mapColumns = (dtos: FaformDto[]): FaformColumn[] =>
  dtos?.map((dto) => ({ id: dto?.frm_id, title: dto?.title }));
