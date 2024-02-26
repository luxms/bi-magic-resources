import React, { PropsWithChildren } from "react";
import classNames from "classnames";

import "./styles.scss";

/**
 * Стилизиванный тег td
 */
export const Td = ({
  children,
  className,
  onClick,
}: PropsWithChildren<{ className?: string; onClick?: () => void }>) => (
  <td className={classNames("td-custom", className)} onClick={onClick}>
    {children}
  </td>
);
