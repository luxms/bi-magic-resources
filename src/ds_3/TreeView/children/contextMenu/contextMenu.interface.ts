import { OrganisationData, FaConfigs } from "../../treeView.interface";

export interface ContextMenuProps {
  item: OrganisationData;
  frm_id: number;
  formStatus?: number;
  depth: number;
  props: any;
  filterClear: FaConfigs[];
}
