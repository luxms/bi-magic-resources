import React = require("../defs/react");

interface IExpandableSearchProps {
    onSearchTermChanged: (searchTerm: string) => any;
    onToggleExpanded?: (expanded: boolean) => any;
}

/**
 * @deprecated
 * @deprecated Использовался в старом компоненте DatasetsListView (стартовый экран)
 */
export class ExpandableSearch extends React.Component<IExpandableSearchProps> {
    public constructor(props)
}
