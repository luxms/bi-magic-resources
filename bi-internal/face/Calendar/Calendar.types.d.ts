export interface CalendarProps {
    value: string;
    min?: string;
    max?: string;
    isSelectable?: (p: string) => boolean;
    onChange?: (p: string) => any;
}
