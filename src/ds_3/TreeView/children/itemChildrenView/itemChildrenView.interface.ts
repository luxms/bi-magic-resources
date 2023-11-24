import { FaformColumn, OrganisationData } from "../../treeView.interface";
import { VisibleContextMenuState } from "../itemView/itemView.interface";

export interface ItemChildredViewProps {
  item: OrganisationData;
  depth: number;
  formColumns: FaformColumn[];
  visibleContextMenu: VisibleContextMenuState;
  setVisibleContextMenu: (params: VisibleContextMenuState) => void;
}
