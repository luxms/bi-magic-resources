import React = require("../defs/react");
import PropsWithChildren = React.PropsWithChildren;

type IfICanSelect =
    { eachOf?: string[], oneOf?: string[], one?: string, oneValue?: any }
    & ({ eachOf: string[] } | { oneOf: string[] } | { one: string, oneValue?: any });
type IfICanProps = Readonly<PropsWithChildren<IfICanSelect>>;

/**
 * React-компонент для оборачивания функционала по правам
 * Проверит один или более claim и покажет дочерние элементы
 *
 * <IfICan eachOf={['U adm.topics', 'U adm.dataset_topics_maps']}>
 *   Мы можем редактировать топики
 * </IfICan>
 *
 */
export class IfICan extends React.Component<IfICanProps> {
    public constructor(props: IfICanProps)
}

export default IfICan;
