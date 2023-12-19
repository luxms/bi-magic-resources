import React, { memo } from "react";

import { ItemChildredViewProps } from "./itemChildrenView.interface";
import { useItems } from "../../utils/hooks";
import { ItemView } from "../itemView/ItemView";

/**
 * Компонента отображающая дочерние организации.
 */
export const ItemChildrenView = memo(
  ({
    item,
    depth,
    formColumns,
    setVisibleContextMenu,
    visibleContextMenu,
    addOpenedRecord,
    deleteOpenedRecord,
    openedRecords,
  }: ItemChildredViewProps) => {
    const { items } = useItems({ PRED_V_ID: ["=", item.id] });

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
            openedRecords={openedRecords}
            addOpenedRecord={addOpenedRecord}
            deleteOpenedRecord={deleteOpenedRecord}
          />
        ))}
      </>
    );
  }
);
