import React, { useCallback, useContext, useEffect, useState } from "react";

import { saveItemFaformStatus } from "../../utils/saveItemFaformStatus";
import { OrganisationData } from "../../treeView.interface";
import { useActions } from "../../utils/hooks";

import "./styles.scss";
import { leadingZerosBranch } from "../../utils/transformationData";
import { TreeViewContext } from "../../treeView.context";

interface ContextMenuProps {
  item: OrganisationData;
  frm_id: number;
  formStatus?: number;
  depth: number;
}
/**
 * Компонента для контекстного меню по клику на статусы дополнительных колонок.
 */

export const ContextMenu = ({
  item,
  frm_id,
  formStatus,
  depth,
}: ContextMenuProps) => {
  const [filter, setFilter] = useState({
    frm_id: ["=", frm_id],
    branch: ["=", leadingZerosBranch(item.branch)],
    frm_st: ["=", formStatus ?? 0],
    leaf_hier_level: ["=", depth, 0],
  });
  const { setIsReload } = useContext(TreeViewContext);
  const actions = useActions(filter);

  useEffect(() => {
    if (actions.length === 0 && item?.branch) {
      setFilter({ ...filter, branch: ["=", ""] });
    }
  }, [actions]);

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
            Тестовый экшен
          </button>
        </li>
      </ul>
    </div>
  );
};
