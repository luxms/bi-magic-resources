import React, { useCallback, useEffect, useState, useContext } from "react";

import { VisibleContextMenuState } from "./children/itemView/itemView.interface";
import { useFaformColumns, useItems, useFaConfigs } from "./utils/hooks";
import { Th } from "./children/th/Th";
import { Td } from "./children/td/Td";
import { ItemView } from "./children/itemView/ItemView";
import { TreeViewContext } from "./treeView.context";

import "./styles.scss";

/**
 * Дерево организаций.
 */
const TreeView = (props) => {
  const [visibleContextMenu, setVisibleContextMenu] =
    useState<VisibleContextMenuState>({
      pred_id: undefined,
      frm_id: undefined,
    });
  const [openedRecords, setOpenedRecords] = useState(new Set<number>());

  const addOpenedRecord = (value: number) => {
    setOpenedRecords(new Set<number>(openedRecords.add(value)));
  };

  const deleteOpenedRecord = (value: number) => {
    const setCollection = new Set(openedRecords);
    setCollection.delete(value);
    setOpenedRecords(new Set(setCollection));
  };

  const { items } = useItems({ GR_ID: ["=", 7] }, props);
  const formColumns = useFaformColumns();
  const clearFilter = useFaConfigs({ CFG_KEY: ["=", "FA_FILTERS_CLEAR"] });
  const onClickWindow = useCallback(
    (e: any) => {
      if (!e.target?.dataset?.status) {
        setVisibleContextMenu({
          pred_id: undefined,
          frm_id: undefined,
        });
      }
    },
    [setVisibleContextMenu]
  );
  useEffect(() => {
    window.addEventListener("click", onClickWindow);
    return () => {
      window.removeEventListener("click", onClickWindow);
    };
  }, []);
  const { setIsReload } = useContext(TreeViewContext);
  const onPopState = useCallback(() => {
    setIsReload(true);
  }, []);

  // Обновляем если пользователь нажал назад в формах ввода
  useEffect(() => {
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [onPopState]);

  return (
    <div style={{ padding: "20px", overflow: "scroll", height: "100%" }}>
      <table>
        <thead className="tree-view__thead">
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
              openedRecords={openedRecords}
              addOpenedRecord={addOpenedRecord}
              deleteOpenedRecord={deleteOpenedRecord}
              props={props}
              filterClear={clearFilter}
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
