import { Column, Row } from "../sharesInfluence.interface";

export interface UseLockAndUnlockParams {
  setIsEditing: (value: boolean) => void;
}
export interface UseRowsAndColumnsFapartParams {
  filters: { [key: string]: any };
  pred_id: string;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  setRows: React.Dispatch<React.SetStateAction<Row[]>>;
  isReload: boolean;
  setIsReload: (value: boolean) => void;
  fiscper: string;
  fiscvar: string;
  ir_flag: number;
  branch: string;
  farm: string;
  cash: number;
}
