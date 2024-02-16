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
  align,
}: PropsWithChildren<{
  colspan?: number;
  rowspan?: number;
  className?: string;
  align?: "left" | "center" | "right" | "justify" | "char" | undefined;
}>) => (
  <th
    align={align}
    colSpan={colspan}
    rowSpan={rowspan}
    className={classNames("assessment-intervals-th-custom", className)}
  >
    {children}
  </th>
);
