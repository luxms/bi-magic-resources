/**
 * Интерфейс сущности, которую мы получаем из БД, и описывающей дополнительную колонку.
 */
export interface FaformDto {
  frm_id: number;
  title: string;
}
/**
 * Интерфейс сущности, которую мы получаем из БД, и описывающей параметры ФА.
 */
export interface FaConfigsDto {
  cfg_key: string;
  cfg_val: string;
}

/**
 * Интерфейс сущности, которую мы используем в наших UI комонентах, и описывающей параметры ФА.
 */

export interface FaConfigs {
  cfg_key: string;
  cfg_val: string;
}
/**
 * Интерфейс сущности, которую мы получаем из БД, и описывающей организацию.
 */
export interface OrganisationDataDto {
  predpr_pred_id: number;
  pname?: string;
  gr_id?: number;
  sname?: string;
  vname?: string;
  pred_v_id?: number;
  pred_n_id?: number;
  form_status?: number;
  form_title?: string;
  form_id?: number;
  children_count: number;
  branch?: string;
  farm?: string;
  dor_kod?: number;
  st_title?: string;
  fiscper: number;
  fiscvar: string;
  ir_flag: number;
  fiscper_text: string;
}

/**
 * Интерфейс сущности, которую мы получаем из БД, и описывающей экшены доп колонок.
 */
export interface FaItemActionDto {
  srt?: number;
  frm_id: number;
  branch?: string;
  dashboard_id?: number;
  dataset_id?: number;
  disabled: boolean;
  frm_act: number;
  frm_bound?: number;
  frm_bound_st_end?: number;
  frm_st: number;
  frm_st_end: number;
  leaf_hier_level: number;
  lvl_st_beg?: number;
  lvl_st_beg_bound?: number;
  lvl_st_end?: number;
  lvl_st_end_bound?: number;
  title: string;
  url?: string;
  filters: string;
}

/**
 * Интерфейс сущности, которую мы получаем из БД, и описывающей статусы дополнительных колонок.
 */
export interface FaformStatusDto {
  frm_id: number;
  frm_st: number;
  pred_id: number;
  fa_act: number;
  fiscper: number;
  fiscvar: string;
  user_id?: number;
  ir_flag: number;
}

/**
 * Интерфейс сущности, которую мы используем в наших UI комонентах, и описывающей дополнительную колонку.
 */
export interface FaformColumn {
  id: number;
  title: string;
}

/**
 * Интерфейс сущности, которую мы используем в наших UI комонентах, и описывающей организацию.
 */
export interface OrganisationData {
  id: number;
  name: string;
  branch?: string;
  farm?: string;
  dor_kod?: number;
  hasChildren: boolean;
  formData: Map<number, { frm_st: number; st_title?: string }>;
  gr_id?: number;
  fiscper: number;
  fiscvar: string;
  ir_flag: number;
  fiscper_text: string;
}

/**
 * Интерфейс сущности, которую мы используем в наших UI комонентах, и описывающей экшены дополнительных колонок.
 */
export interface FaItemAction {
  srt?: number;
  frm_id: number;
  frm_st: number;
  title: string;
  disabled: boolean;
  url?: string;
  fa_act: number;
  dashboard_id?: number;
  dataset_id?: number;
  filters: string;
}

/**
 * Контекст дешборда
 */
export interface TreeViewStateContext {
  isReload: boolean;
  setIsReload: (value: boolean) => void;
  clearFilter: boolean;
  setClearFilter: (value: boolean) => void;
}
