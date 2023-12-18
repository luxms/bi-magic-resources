import React, { PropsWithChildren } from "react";

import "./styles.scss";

/**
 * Стилизиванный тег th
 */
export const Th = ({ children }: PropsWithChildren<{}>) => (
  <th className="source-data-th-custom">{children}</th>
);