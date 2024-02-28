import { FaPredprIerDto, FainfoAll } from "../sourceData.interface";

export interface UseColumnsParams {
  pred_id: number;
  setColumns: React.Dispatch<React.SetStateAction<FaPredprIerDto[]>>;
  filters: any;
}

export interface UseRowsParams {
  pred_id: number;
  setRows: React.Dispatch<React.SetStateAction<FainfoAll[]>>;
  filters: any;
  isReload: boolean;
  setIsReload: (value: boolean) => void;
  fiscper: number;
  fiscvar: string;
  ir_flag: number;
  cash: number;
}

export interface UseLockAndUnlock {
  setIsEditing: (value: boolean) => void;
}
