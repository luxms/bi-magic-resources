import React = require("../defs/react");
interface IBIIconProps {
    icon?: string;
    text?: string;
    className?: string;
    href?: string;                // if set, then <a>
    style?: any;
    onPress?: any;
    hint?: string;
    shape?: string;               // circle
    onDragOver?: any;
    onDragLeave?: any;
    onDrop?: any;
    target?: string;
}

/**
 * @description вставляет иконки по названию из assets/icons
 */
export class BIIcon extends React.PureComponent<IBIIconProps> {
    public constructor(props)
}
