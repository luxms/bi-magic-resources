import React, { useCallback, useContext } from "react";
import { AuthenticationService, UrlState } from "bi-internal/core";

import { saveItemFaformStatus } from "../../utils/saveItemFaformStatus";
import { useActions } from "../../utils/hooks";
import { TreeViewContext } from "../../treeView.context";
import { ContextMenuProps } from "./contextMenu.interface";
import { FaItemAction } from "../../treeView.interface";
import { clearFilterService } from "../../utils/clearFilterService";

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
  depth,
  props,
  filterClear,
}: ContextMenuProps) => {
  const { cfg } = props;
  const { setIsReload } = useContext(TreeViewContext);
  const { setClearFilter } = useContext(TreeViewContext);

  const { userId } = AuthenticationService.getInstance().getModel();

  const koobModel = useService<KoobService>(
    KoobService,
    cfg.getRaw().dataSource.koob
  );
  const irFlagDefValue = $eid(koobModel.dimensions, "ir_flag")?.config
    ?.defaultValue;
  const dashFilters = KoobFiltersService.getInstance().getModel().filters;

  const actionsWithBranch1 = useActions({
    frm_id: ["=", frm_id],
    branch: ["=", item.branch?.trim()],
    frm_st: ["=", formStatus ?? 0],
    gr_id: ["=", item?.gr_id],
    // leaf_hier_level: ["=", depth],
    ir_flag: Array.isArray(dashFilters?.ir_flag)
      ? dashFilters?.ir_flag
      : ["=", irFlagDefValue],
  });
  const actionsWithBranch2 = useActions({
    frm_id: ["=", frm_id],
    branch: ["=", item.branch?.trim()],
    frm_st: ["=", formStatus ?? 0],
    gr_id: ["=", null],
    // leaf_hier_level: ["=", depth],
    ir_flag: Array.isArray(dashFilters?.ir_flag)
      ? dashFilters?.ir_flag
      : ["=", irFlagDefValue],
  });

  const actionsWithoutBranch1 = useActions({
    frm_id: ["=", frm_id],
    branch: ["=", ""],
    frm_st: ["=", formStatus ?? 0],
    gr_id: ["=", item?.gr_id],
    // leaf_hier_level: ["=", depth],
    ir_flag: Array.isArray(dashFilters?.ir_flag)
      ? dashFilters?.ir_flag
      : ["=", irFlagDefValue],
  });
  const actionsWithoutBranch2 = useActions({
    frm_id: ["=", frm_id],
    branch: ["=", ""],
    frm_st: ["=", formStatus ?? 0],
    gr_id: ["=", null],
    //   leaf_hier_level: ["=", depth],
    ir_flag: Array.isArray(dashFilters?.ir_flag)
      ? dashFilters?.ir_flag
      : ["=", irFlagDefValue],
  });

  const actions =
    actionsWithBranch1.length > 0
      ? actionsWithBranch1
      : actionsWithBranch2.length > 0
      ? actionsWithBranch2
      : actionsWithoutBranch1.length > 0
      ? actionsWithoutBranch1
      : actionsWithoutBranch2;

  const onClick = useCallback(
    async (action: FaItemAction) => {
      if (action.frm_st === 0) {
        if (action.url) {
          clearFilterService(filterClear[0]);
          const setFilters = action.filters?.split(",");
          setFilters?.forEach((filter) => {
            if (filter.indexOf("=") > 0) {
              if (filter.indexOf("!=") > 0) {
                const valFilters = filter.split("!=");
                let val = valFilters[1].split(";");
                KoobFiltersService.getInstance().setFilter("", valFilters[0], [
                  "!=",
                  ...val,
                ]);
              } else {
                const valFilters = filter.split("=");
                let val = valFilters[1].split(";");
                KoobFiltersService.getInstance().setFilter("", valFilters[0], [
                  "=",
                  ...val,
                ]);
              }
            } else
              switch (filter) {
                case "pred_id":
                  KoobFiltersService.getInstance().setFilter("", filter, [
                    "=",
                    item.id,
                  ]);
                  break;
                case "pred_idf":
                  KoobFiltersService.getInstance().setFilter("", filter, [
                    "=",
                    item.id,
                  ]);
                  break;
                case "frm_id":
                  KoobFiltersService.getInstance().setFilter("", filter, [
                    "=",
                    frm_id,
                  ]);
                  break;
                case "farm":
                  if (item[filter] != null) {
                    KoobFiltersService.getInstance().setFilter("", filter, [
                      "=",
                      item[filter],
                    ]);
                  }
                  break;
                case "fiscper":
                  KoobFiltersService.getInstance().setFilter("", filter, [
                    "=",
                    String(item[filter]),
                  ]);
                  break;
                case "ir_flag":
                  KoobFiltersService.getInstance().setFilter(
                    "",
                    filter,
                    Array.isArray(dashFilters?.ir_flag)
                      ? dashFilters?.ir_flag
                      : ["=", irFlagDefValue]
                  );
                  break;

                default:
                  if (item.hasOwnProperty(filter)) {
                    //console.log(filter + item[filter]);
                    KoobFiltersService.getInstance().setFilter("", filter, [
                      "=",
                      item[filter],
                    ]);
                  }
              }
          });

          UrlState.getInstance().updateModel({
            _pred_id: item.id,
            _caption:
              action.fa_act == 4
                ? "Линейные подразделения " +
                  item.name +
                  " " +
                  item.fiscper_text
                : action.fa_act == 42
                ? "Службы " + item.name + " " + item.fiscper_text
                : item.name + " " + item.fiscper_text,
            _fiscper: item.fiscper,
            _fiscvar: item.fiscvar,
            _ir_flag: Array.isArray(dashFilters?.ir_flag)
              ? dashFilters?.ir_flag[1]
              : irFlagDefValue,
            _user_id: userId,
            _branch: item.branch,
            _farm: item.farm,
            _dor_kod:
              Number(item.branch) == 189 &&
              Number(item.farm) == 800 &&
              action.fa_act == 4
                ? item.dor_kod ?? 0
                : 0,
            _gr_id: action.fa_act == 4 ? 0 : 10,
            _fa_act: action.fa_act,
            _cash: Math.random(),
          });
          UrlState.navigate({
            segment: "ds",
            segmentId: `ds_${action.dataset_id}`,
            dboard: action.dashboard_id,
          });
          setClearFilter(true);
        }
      } else {
        const response = await saveItemFaformStatus(
          [
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
          ],
          formStatus
        );

        if (response?.status === 200) {
          setIsReload(true);
        }
      }
    },
    [frm_id, item, filterClear]
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
