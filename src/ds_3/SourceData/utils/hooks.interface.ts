import { FaPredprIerDto, FainfoAll } from "../sourceData.interface";

export interface UseColumnsParams {
  pred_id: number;
  setColumns: React.Dispatch<React.SetStateAction<FaPredprIerDto[]>>;
}

export interface UseRowsParams {
  pred_id: number;
  setRows: React.Dispatch<React.SetStateAction<FainfoAll[]>>;
}
