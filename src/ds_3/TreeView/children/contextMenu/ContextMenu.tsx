import React, { useCallback, useContext } from "react";

import { createItemFaformStatus } from "../../utils/createItemFaformStatus";
import { TreeViewContext } from "../../treeView.context";

interface ContextMenuProps {
  frm_id: number;
  pred_id: number;
  formStatus?: number;
}
/**
 * Компонента для контекстного меню по клику на статусы дополнительных колонок.
 */

export const ContextMenu = ({
  frm_id,
  pred_id,
  formStatus,
}: ContextMenuProps) => {
  const { setIsReloadData } = useContext(TreeViewContext);
  const onClick = useCallback(async () => {
    const status = await createItemFaformStatus({
      frm_id: frm_id,
      pred_id: pred_id,
      frm_st: 10, // Заменить хардкод, id статуса должен быть в таблице
    });
    if (status === 200) {
      setIsReloadData(true);
    }
  }, [frm_id, pred_id]);

  return (
    <div className="context-menu">
      <ul>
        <li>
          <button
            className="context-menu__btn"
            onClick={onClick}
            disabled={formStatus !== undefined}
          >
            Согласовать
          </button>
        </li>
      </ul>
    </div>
  );
};
