import {
  FaItemAction,
  FaItemActionDto,
  FaformColumn,
  FaformDto,
  OrganisationData,
  OrganisationDataDto,
  FaConfigs,
  FaConfigsDto,
} from "../treeView.interface";

/**
 * Преобразование сущностей организаций получаемых из бд к внутреннему формату.
 */
export const mapItems = (dtos: OrganisationDataDto[]): OrganisationData[] => {
  const organisationsMap = new Map<OrganisationData["id"], OrganisationData>();
  if (dtos) {
    dtos.forEach((dto) => {
      // Если у записи dto поле pred_v_id = какому либо
      // другому значению predpr_pred_id из dtos, то этой записи не должно быть
      const isReturn = dtos.find(
        (item) => dto.pred_v_id === item.predpr_pred_id
      );
      let organisationData: OrganisationData;
      if (!isReturn) {
        organisationData = organisationsMap.has(dto.predpr_pred_id)
          ? organisationsMap.get(dto.predpr_pred_id)!
          : {
              id: dto.predpr_pred_id,
              name: dto.pname || "",
              hasChildren: dto.children_count > 0,
              branch: dto.branch,
              farm: dto.farm,
              formData: new Map<
                number,
                { frm_st: number; st_title?: string }
              >(),
              gr_id: dto.gr_id,
              fiscper: dto.fiscper,
              fiscvar: dto.fiscvar,
              ir_flag: dto.ir_flag,
              dor_kod: dto.dor_kod,
              fiscper_text: dto.fiscper_text,
            };

        if (
          dto.form_id !== undefined &&
          dto.form_id !== null &&
          dto.form_status
        ) {
          organisationData.formData.set(dto.form_id, {
            frm_st: dto.form_status,
            st_title: dto.st_title,
          });
        }
        organisationsMap.set(organisationData.id, organisationData);
      }
    });
  }
  return Array.from(organisationsMap.values());
};

/**
 * Преобразование сущностей доп. колонок получаемых из бд к внутреннему формату.
 */
export const mapColumns = (dtos: FaformDto[]): FaformColumn[] =>
  dtos?.map((dto) => ({ id: dto?.frm_id, title: dto?.title }));

/**
 * Преобразование сущностей пармаетров ФА получаемых из бд к внутреннему формату.
 */
export const mapFaConfigs = (dtos: FaConfigsDto[]): FaConfigs[] =>
  dtos?.map((dto) => ({ cfg_key: dto?.cfg_key, cfg_val: dto?.cfg_val }));

/**
 * Преобразование сущностей экшенов доп. колонок получаемых из бд к внутреннему формату.
 */
export const mapFaItemActions = (dtos: FaItemActionDto[]): FaItemAction[] =>
  dtos?.map((dto) => ({
    frm_id: dto.frm_id,
    frm_st: dto.frm_st_end,
    title: dto.title,
    disabled: dto.disabled,
    url: dto.url,
    fa_act: dto.frm_act,
    dashboard_id: dto.dashboard_id,
    dataset_id: dto.dataset_id,
    filters: dto.filters,
  }));
