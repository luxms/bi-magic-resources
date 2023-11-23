/**
 * Интерфейс сущности, которую мы получаем из БД, и описывающей дополнительную колонку.
 */
export interface FaformDto {
  frm_id: number;
  title: string;
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
  form_status?: string;
  form_title?: string;
  form_id?: number;
  children_count: number;
}

/**
 * Интерфейс сущности, которую мы получаем из БД, и описывающей статусы дополнительных колонок.
 */
export interface FaformStatusDto {
  frm_id: number;
  frm_st: number;
  pred_id: number;
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
  hasChildren: boolean;
  formData: Map<number, string>;
}
