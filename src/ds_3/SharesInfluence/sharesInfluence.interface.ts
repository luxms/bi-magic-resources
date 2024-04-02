export interface LockDto {
  fiscper: number;
  fiscvar: string;
  ir_flag: number;
  pred_id: number;
  pred_idf: number;
  locks: boolean;
  usr_id: number;
  frm_id: number;
}

export interface UnlockDto {
  fiscper: number;
  fiscvar: string;
  ir_flag: number;
  pred_id: number;
  pred_idf: number;
  unlocks: boolean;
  frm_id: number;
}
export interface FapartDto {
  risk_id: number;
  factor_id: number;
  branch: string;
  f_group_text: string;
  f_text: string;
  farm: string;
  fashare?: number;
  fiscper: number;
  fiscper_text: string;
  fiscvar: string;
  ir_flag: number;
  obj_text: string;
  r_group_text: string | null;
  r_text: string;
}

export interface SharesInfluenceLayoutProps {
  columns: Column[];
  rows: Row[];
  addChangedData: (value: string) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  setIsReload: (value: boolean) => void;
  lock: () => void;
  unlock: () => void;
}

export interface Column {
  obj_text: string;
  colspan?: number;
  data: {
    f_group_text: string;
    colspan?: number;
    data: { f_text: string }[];
  }[];
}

export interface Row extends FapartDto {
  data: FapartDto[];
}

export interface DataInsertFapart {
  risk_id: number;
  factor_id: number;
  branch: string;
  farm: string;
  fiscvar: string;
  fiscper: number;
  fashare?: number;
  ir_flag: number;
}

/**
 * Интерфейс БД таблицы public.faform_status
 */
export interface StatusDto {
  pred_id: number;
  frm_id: number;
  fiscper: number;
  fiscvar: string;
  ir_flag: number;
  frm_st: number;
  fa_act: number;
  user_id: number;
}
