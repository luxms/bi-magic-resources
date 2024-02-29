import React = require("../../defs/react");
import { DatePickerProps } from "./DatePicker.types";

declare class DatePicker extends React.Component<DatePickerProps> {
    public constructor(props: DatePickerProps);
    public render(): JSX.Element;
}
export default DatePicker;
