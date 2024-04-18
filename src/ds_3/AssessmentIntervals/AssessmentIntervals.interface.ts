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
export interface FaintervalDto {
  factor_id: number;
  branch: string;
  pred_id: number;
  gr_id: number;
  dor_kod: number;
  f_group_text: string;
  f_text: string;
  farm: string;
  fiscper: number;
  fiscper_text: string;
  fiscvar: string;
  ir_flag: number;
  faidval: number;
  min_border: number;
  max_border: number;
  disabled: boolean;
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
  tcaption: string;
}

export interface Column {
  faidval: number;
}

export interface Row extends FaintervalDto {
  data: FaintervalDto[];
}

export interface DataInsertFainterval {
  factor_id: number;
  farm: string;
  branch: string;
  fiscper: number;
  fiscvar: string;
  faidval: number;
  min_border: number;
  max_border: number;
  ir_flag: number;
  dor_kod: number;
  gr_id: number;
}
