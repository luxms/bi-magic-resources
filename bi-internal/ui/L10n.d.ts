import React from "react";

type L10nProps = React.PropsWithChildren<{section?: string}>;

/**
 * React обертка - перевод
 */
export const L10n: (props: L10nProps)=>React.JSX.Element
