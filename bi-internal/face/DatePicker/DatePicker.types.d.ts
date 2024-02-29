import { CalendarProps } from "../Calendar/Calendar.types";
export interface DatePickerProps extends CalendarProps {
    className?: string;
    formatTitle?: (value: string) => string;
}
