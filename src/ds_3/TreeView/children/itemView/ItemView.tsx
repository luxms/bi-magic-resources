import React, { useCallback } from "react";

import { ItemViewProps } from "./itemView.interface";
import { Td } from "../td/Td";
import { ShowChildrenButton } from "../showChildrenButton/ShowChildrenButton";
import { ContextMenu } from "../contextMenu/ContextMenu";
import { ItemChildrenView } from "../itemChildrenView/ItemChildrenView";

/**
 * Компонента отображающая организацию.
 */
export const ItemView = ({
  item,
  depth,
  formColumns,
  setVisibleContextMenu,
  visibleContextMenu,
  addOpenedRecord,
  deleteOpenedRecord,
  openedRecords,
}: ItemViewProps) => {
  const isOpened = openedRecords?.has(item.id);
  const onClickTdFormColumn = useCallback(
    (frm_id: number) => {
      if (
        item.id === visibleContextMenu.pred_id &&
        frm_id === visibleContextMenu.frm_id
      ) {
        setVisibleContextMenu({
          pred_id: undefined,
          frm_id: undefined,
        });
      } else {
        setVisibleContextMenu({
          pred_id: item.id,
          frm_id,
        });
      }
    },
    [item, visibleContextMenu]
  );

  const onClickShowChildrenButton = useCallback(() => {
    if (isOpened) {
      deleteOpenedRecord(item.id);
    } else {
      addOpenedRecord(item.id);
    }
  }, [isOpened]);

  return (
    <>
      <tr id={item.id?.toString()}>
        <Td>
          {"----".repeat(depth - 1)}
          {item.hasChildren && (
            <ShowChildrenButton
              isOpened={isOpened}
              onClick={onClickShowChildrenButton}
            />
          )}
          {item.id}
        </Td>
        <Td>{item.name}</Td>
        {formColumns.map((column) => {
          const formStatus = item.formData.get(column.id);
          return (
            <Td key={column.id} onClick={() => onClickTdFormColumn(column.id)}>
              {formStatus?.st_title || "No data"}
              {visibleContextMenu?.pred_id === item.id &&
                visibleContextMenu?.frm_id === column.id && (
                  <ContextMenu
                    item={item}
                    frm_id={column.id}
                    formStatus={formStatus?.frm_st}
                    depth={depth}
                  />
                )}
            </Td>
          );
        })}
      </tr>
      {isOpened && (
        <ItemChildrenView
          item={item}
          depth={depth}
          formColumns={formColumns}
          setVisibleContextMenu={setVisibleContextMenu}
          visibleContextMenu={visibleContextMenu}
          addOpenedRecord={addOpenedRecord}
          deleteOpenedRecord={deleteOpenedRecord}
          openedRecords={openedRecords}
        />
      )}
    </>
  );
};
