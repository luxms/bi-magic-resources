import { OrganisationData } from "../../treeView.interface";

export interface ContextMenuProps {
  item: OrganisationData;
  frm_id: number;
  formStatus?: number;
  depth: number;
  setScrollId: (value: number | undefined) => void;
}
