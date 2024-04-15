import { createContext } from "react";

import type { TreeViewStateContext, FaConfigs } from "./treeView.interface";

export const TreeViewContext = createContext<TreeViewStateContext>({
  isReload: false,
  setIsReload: () => {},
  clearFilter: false,
  setClearFilter: () => {},
});
