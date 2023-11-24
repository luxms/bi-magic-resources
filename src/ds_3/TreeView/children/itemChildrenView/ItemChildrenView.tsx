import React from "react";

import { ItemChildredViewProps } from "./itemChildrenView.interface";
import { useItems } from "../../utils/hooks";
import { ItemView } from "../itemView/ItemView";

/**
 * Компонента отображающая дочерние организации.
 */
export const ItemChildrenView = ({
  item,
  depth,
  formColumns,
  setVisibleContextMenu,
  visibleContextMenu,
}: ItemChildredViewProps) => {
  const items = useItems({ PRED_V_ID: ["=", item.id] });

  return (
    <>
      {items.map((item) => (
        <ItemView
          key={item.id}
          item={item}
          depth={depth + 1}
          formColumns={formColumns}
          setVisibleContextMenu={setVisibleContextMenu}
          visibleContextMenu={visibleContextMenu}
        />
      ))}
    </>
  );
};
