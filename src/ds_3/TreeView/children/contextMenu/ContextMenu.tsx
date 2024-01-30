import React, { useCallback, useContext } from "react";
import { AuthenticationService, UrlState } from "bi-internal/core";

import { saveItemFaformStatus } from "../../utils/saveItemFaformStatus";
import { useActions } from "../../utils/hooks";
import { TreeViewContext } from "../../treeView.context";
import { ContextMenuProps } from "./contextMenu.interface";
import { FaItemAction } from "../../treeView.interface";

import "./styles.scss";
import {
  KoobFiltersService,
  KoobService,
  useService,
} from "bi-internal/services";
import { $eid } from "bi-internal/utils";
/**
 * Компонента для контекстного меню по клику на статусы дополнительных колонок.
 */

export const ContextMenu = ({
  item,
  frm_id,
  formStatus,
  props,
}: ContextMenuProps) => {
  const { cfg } = props;
  const { setIsReload } = useContext(TreeViewContext);

  const { userId } = AuthenticationService.getInstance().getModel();

  const koobModel = useService<KoobService>(
    KoobService,
    cfg.getRaw().dataSource.koob
  );
  const irFlagDefValue = $eid(koobModel.dimensions, "ir_flag")?.config
    ?.defaultValue;

  const actionsWithBranch1 = useActions({
    frm_id: ["=", frm_id],
    branch: ["=", item.branch?.trim()],
    frm_st: ["=", formStatus ?? 0],
    gr_id: ["=", item?.gr_id],
  });
  const actionsWithBranch2 = useActions({
    frm_id: ["=", frm_id],
    branch: ["=", item.branch?.trim()],
    frm_st: ["=", formStatus ?? 0],
    gr_id: ["=", null],
  });
  const actionsWithBranch =
    actionsWithBranch1.length > 0 ? actionsWithBranch1 : actionsWithBranch2;

  const actionsWithoutBranch1 = useActions({
    frm_id: ["=", frm_id],
    branch: ["=", ""],
    frm_st: ["=", formStatus ?? 0],
    gr_id: ["=", item?.gr_id],
  });
  const actionsWithoutBranch2 = useActions({
    frm_id: ["=", frm_id],
    branch: ["=", ""],
    frm_st: ["=", formStatus ?? 0],
    gr_id: ["=", null],
  });
  const actionsWithoutBranch =
    actionsWithoutBranch1.length > 0
      ? actionsWithoutBranch1
      : actionsWithoutBranch2;

  const actions =
    actionsWithBranch.length > 0 ? actionsWithBranch : actionsWithoutBranch;

  const dashFilters = KoobFiltersService.getInstance().getModel().filters;

  const onClick = useCallback(
    async (action: FaItemAction) => {
      if (action.frm_st === 0) {
        if (action.url) {
          UrlState.getInstance().updateModel({
            _pred_id: item.id,
            _fiscper: item.fiscper,
            _fiscvar: item.fiscvar,
            _ir_flag: Array.isArray(dashFilters?.ir_flag)
              ? dashFilters?.ir_flag[1]
              : irFlagDefValue,
            _user_id: userId,
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
            fiscper: item.fiscper,
            fiscvar: item.fiscvar,
            user_id: userId,
            ir_flag: Array.isArray(dashFilters?.ir_flag)
              ? dashFilters?.ir_flag[1]
              : irFlagDefValue,
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
    <div id="context-menu" className="context-menu">
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
