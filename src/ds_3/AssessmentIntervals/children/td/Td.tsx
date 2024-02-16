import React, { PropsWithChildren } from "react";
import classNames from "classnames";

import "./styles.scss";

/**
 * Стилизиванный тег td
 */
export const Td = ({
  children,
  disabled,
}: PropsWithChildren<{ disabled?: boolean }>) => (
  <td
    className={classNames([
      "assessment-intervals-td-custom",
      { "assessment-intervals-td-custom__disabled": disabled },
    ])}
  >
    {children}
  </td>
);
