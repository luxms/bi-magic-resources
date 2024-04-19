import { Column, Row } from "../AssessmentIntervals.interface";

export interface UseLockAndUnlockParams {
  setIsEditing: (value: boolean) => void;
}
export interface UseRowsAndColumnsFaintervalParams {
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
  dor_kod: number;
  cash: number;
  gr_id: number;
}
