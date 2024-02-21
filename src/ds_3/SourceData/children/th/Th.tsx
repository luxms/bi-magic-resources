import React, { PropsWithChildren } from "react";
import classNames from "classnames";

import "./styles.scss";

/**
 * Стилизиванный тег th
 */
export const Th = ({
  children,
  className,
  colspan,
  rowspan,
}: PropsWithChildren<{
  colspan?: number;
  rowspan?: number;
  className?: string;
}>) => (
  <th
    colSpan={colspan}
    rowSpan={rowspan}
    className={classNames("source-data-th-custom", className)}
  >
    {children}
  </th>
);
