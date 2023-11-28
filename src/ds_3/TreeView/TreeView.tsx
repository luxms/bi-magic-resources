import React, { useState } from "react";

import { VisibleContextMenuState } from "./children/itemView/itemView.interface";
import { useFaformColumns, useItems } from "./utils/hooks";
import { Th } from "./children/th/Th";
import { Td } from "./children/td/Td";
import { ItemView } from "./children/itemView/ItemView";
import { TreeViewContext } from "./treeView.context";
import { TreeViewStateContext } from "./treeView.interface";

/**
 * Дерево организаций.
 */
const TreeView = (props) => {
  const [visibleContextMenu, setVisibleContextMenu] =
    useState<VisibleContextMenuState>({
      pred_id: undefined,
      frm_id: undefined,
    });

  // const [openedRecords, setOpenedRecords] = useState(new Set());
  const { items } = useItems({ GR_ID: ["=", 7] }, props);
  const formColumns = useFaformColumns();
  return (
    <div style={{ padding: "20px", overflow: "scroll", maxHeight: "400px" }}>
      <table>
        <thead>
          <Th>ID</Th>
          <Th>Наименование</Th>
          {formColumns.map((column) => (
            <Td key={column.id}>{column.title}</Td>
          ))}
        </thead>
        <tbody>
          {items.map((item) => (
            <ItemView
              key={item.id}
              item={item}
              depth={1}
              formColumns={formColumns}
              visibleContextMenu={visibleContextMenu}
              setVisibleContextMenu={setVisibleContextMenu}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
const TreeViewMain = (props) => {
  const [isReload, setIsReload] = useState(false);
  return (
    <TreeViewContext.Provider value={{ isReload, setIsReload }}>
      <TreeView {...props} />
    </TreeViewContext.Provider>
  );
};
export default TreeViewMain;
