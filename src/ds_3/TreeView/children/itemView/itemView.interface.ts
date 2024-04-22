import {
  FaformColumn,
  OrganisationData,
  FaConfigs,
} from "../../treeView.interface";

export interface ItemViewProps {
  item: OrganisationData;
  depth: number;
  formColumns: FaformColumn[];
  visibleContextMenu: VisibleContextMenuState;
  setVisibleContextMenu: (params: VisibleContextMenuState) => void;
  openedRecords: Set<number>;
  addOpenedRecord: (value: number) => void;
  deleteOpenedRecord: (value: number) => void;
  props: any;
  filterClear: FaConfigs[];
}

export interface VisibleContextMenuState {
  pred_id: number | undefined;
  frm_id: number | undefined;
}
