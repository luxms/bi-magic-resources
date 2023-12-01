import React, { useCallback, useContext } from "react";

import { saveItemFaformStatus } from "../../utils/saveItemFaformStatus";
import { useActions } from "../../utils/hooks";
import { TreeViewContext } from "../../treeView.context";
import { ContextMenuProps } from "./contextMenu.interface";

import "./styles.scss";

/**
 * Компонента для контекстного меню по клику на статусы дополнительных колонок.
 */

export const ContextMenu = ({
  item,
  frm_id,
  formStatus,
  depth,
}: ContextMenuProps) => {
  const { setIsReload } = useContext(TreeViewContext);

  const actions = useActions({
    frm_id: ["=", frm_id],
    branch: ["=", item.branch?.trim()],
    frm_st: ["=", formStatus ?? 0],
    leaf_hier_level: ["=", depth, 0],
  });

  const onClick = useCallback(
    async (frm_st: number) => {
      if (frm_st === 0) {
        return;
      }
      const response = await saveItemFaformStatus(
        {
          frm_id: frm_id,
          pred_id: item.id,
          frm_st,
        },
        formStatus
      );

      if (response?.status === 200) {
        setIsReload(true);
      }
    },
    [frm_id, item]
  );

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="context-menu">
      <ul>
        {actions.map((action) => (
          <li>
            <button
              className="context-menu__btn"
              onClick={() => onClick(action.frm_st)}
              disabled={action.disabled}
            >
              {action.title}
            </button>
          </li>
        ))}
        <li>
          <button className="context-menu__btn" onClick={() => onClick(10)}>
            Тестовый экшен frm_st = 10
          </button>
        </li>
      </ul>
    </div>
  );
};
