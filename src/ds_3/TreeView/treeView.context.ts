import { createContext } from "react";

import type { TreeViewStateContext } from "./treeView.interface";

export const TreeViewContext = createContext<TreeViewStateContext>({
  isReload: false,
  setIsReload: () => {},
});
