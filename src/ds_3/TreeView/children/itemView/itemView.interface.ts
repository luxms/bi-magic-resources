import { FaformColumn, OrganisationData } from "../../treeView.interface";

export interface ItemViewProps {
  item: OrganisationData;
  depth: number;
  formColumns: FaformColumn[];
  visibleContextMenu: VisibleContextMenuState;
  setVisibleContextMenu: (params: VisibleContextMenuState) => void;
  setItems: (items: OrganisationData[]) => void;
  items: OrganisationData[];
}

export interface VisibleContextMenuState {
  pred_id: number | undefined;
  frm_id: number | undefined;
}
