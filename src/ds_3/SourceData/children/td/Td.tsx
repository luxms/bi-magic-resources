import React, { PropsWithChildren } from "react";
import classNames from "classnames";

import "./styles.scss";

/**
 * Стилизиванный тег td
 */
export const Td = ({
  children,
  disabled,
  className,
}: PropsWithChildren<{ disabled?: boolean; className?: string }>) => (
  <td
    className={classNames(
      [
        "source-data-td-custom",
        { "source-data-td-custom__disabled": disabled },
      ],
      className
    )}
  >
    {children}
  </td>
);
