import React, { PropsWithChildren } from "react";

import "./styles.scss";

/**
 * Стилизиванный тег td
 */
export const Td = ({
  children,
  onClick,
}: PropsWithChildren<{ onClick?: () => void }>) => (
  <td className="td-custom" onClick={onClick}>
    {children}
  </td>
);
