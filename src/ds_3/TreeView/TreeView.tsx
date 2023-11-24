import React, { useState } from "react";

import { VisibleContextMenuState } from "./children/itemView/itemView.interface";
import { useFaformColumns, useItems } from "./utils/hooks";
import { Th } from "./children/th/Th";
import { Td } from "./children/td/Td";
import { ItemView } from "./children/itemView/ItemView";
import { OrganisationData } from "./treeView.interface";

import "./TreeView.scss";

/**
 * Дерево организаций.
 */
const TreeView = (props) => {
  const [visibleContextMenu, setVisibleContextMenu] =
    useState<VisibleContextMenuState>({
      pred_id: undefined,
      frm_id: undefined,
    });
  const [items, setItems] = useState<OrganisationData[]>([]);

  useItems({ GR_ID: ["=", 7] }, setItems, props);
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
              depth={0}
              formColumns={formColumns}
              visibleContextMenu={visibleContextMenu}
              setVisibleContextMenu={setVisibleContextMenu}
              items={items}
              setItems={setItems}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TreeView;
