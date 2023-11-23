import React from "react";

interface TreeViewContext {
  isReloadData: boolean;
  setIsReloadData: (value: boolean) => void;
}
export const TreeViewContext = React.createContext<TreeViewContext>({
  isReloadData: false,
  setIsReloadData: () => {},
});
