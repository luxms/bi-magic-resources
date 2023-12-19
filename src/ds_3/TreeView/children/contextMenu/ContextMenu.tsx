import React, { useCallback, useContext } from "react";
import { UrlState } from "bi-internal/core";

import { saveItemFaformStatus } from "../../utils/saveItemFaformStatus";
import { useActions } from "../../utils/hooks";
import { TreeViewContext } from "../../treeView.context";
import { ContextMenuProps } from "./contextMenu.interface";
import { FaItemAction } from "../../treeView.interface";

import "./styles.scss";
/**
 * Компонента для контекстного меню по клику на статусы дополнительных колонок.
 */

export const ContextMenu = ({ item, frm_id, formStatus }: ContextMenuProps) => {
  const { setIsReload } = useContext(TreeViewContext);
  const actionsWithBranch = useActions({
    frm_id: ["=", frm_id],
    branch: ["=", item.branch?.trim()],
    frm_st: ["=", formStatus ?? 0],
    gr_id: ["=", ...(item?.gr_id ? [item.gr_id, null] : [null])],
  });
  const actionsWithoutBranch = useActions({
    frm_id: ["=", frm_id],
    branch: ["=", ""],
    frm_st: ["=", formStatus ?? 0],
    gr_id: ["=", ...(item?.gr_id ? [item.gr_id, null] : [null])],
  });

  const actions =
    actionsWithBranch.length > 0 ? actionsWithBranch : actionsWithoutBranch;

  const onClick = useCallback(
    async (action: FaItemAction) => {
      if (action.frm_st === 0) {
        if (action.url) {
          UrlState.getInstance().updateModel({
            _pred_id: item.id,
            _fiscper: item.fiscper,
            _fiscvar: item.fiscvar,
          });
          UrlState.navigate({
            segment: "ds",
            segmentId: `ds_${action.dataset_id}`,
            dboard: action.dashboard_id,
          });
        }
      } else {
        const response = await saveItemFaformStatus(
          {
            frm_id: frm_id,
            pred_id: item.id,
            frm_st: action.frm_st,
            fa_act: action.fa_act,
          },
          formStatus
        );

        if (response?.status === 200) {
          setIsReload(true);
        }
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
              onClick={() => onClick(action)}
              disabled={action.disabled}
            >
              {action.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
