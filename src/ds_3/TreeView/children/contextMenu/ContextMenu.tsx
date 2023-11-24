import React, { useCallback } from "react";

import { createItemFaformStatus } from "../../utils/createItemFaformStatus";
import { FaformStatusDto, OrganisationData } from "../../treeView.interface";

interface ContextMenuProps {
  frm_id: number;
  pred_id: number;
  formStatus?: number;
  setItems: (items: OrganisationData[]) => void;
  items: OrganisationData[];
}
/**
 * Компонента для контекстного меню по клику на статусы дополнительных колонок.
 */

export const ContextMenu = ({
  frm_id,
  pred_id,
  formStatus,
  setItems,
  items,
}: ContextMenuProps) => {
  const onClick = useCallback(async () => {
    const response = await createItemFaformStatus({
      frm_id: frm_id,
      pred_id: pred_id,
      frm_st: 10, // Заменить хардкод, id статуса должен быть в таблице
    });
    if (response?.status === 200) {
      const data: FaformStatusDto = await response.json();
      setItems(
        items.map((item) => {
          if (data.pred_id === item.id) {
            item.formData.set(data.frm_id, data.frm_st);
          }
          return { ...item };
        })
      );
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
