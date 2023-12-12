import React, { PropsWithChildren } from "react";
import classNames from "classnames";

import "./styles.scss";

/**
 * Стилизиванный тег td
 */
export const Td = ({
  children,
  disabled,
}: PropsWithChildren<{ disabled: boolean }>) => (
  <td
    className={classNames([
      "source-data-td-custom",
      { "source-data-td-custom__disabled": disabled },
    ])}
  >
    {children}
  </td>
);
