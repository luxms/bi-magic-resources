/**
 * CalendarUtils
 *
 */
interface IDateDetails {
    year: number;
    month: number;
    day?: number;
}
export declare class DateUtils {
    static isYear: (p: string) => boolean;
    static isQuarter: (p: string) => boolean;
    static isMonth: (p: string) => boolean;
    static isWeek: (p: string) => boolean;
    static isDay: (p: string) => boolean;
    static makeMonth: (year: number, month: number) => string;
    static makeDay: (year: number, month: number, day: number) => string;
    static makeDayFromDate: (d: Date) => string;
    static split(p: string): IDateDetails;
    static make(d: Partial<IDateDetails>): string;
    static addMonths(p: string, amount: number): string;
    /**
     *
     * @param year
     * @param month
     * @param day
     * @return dayOfWeek - number from 1 (Monday) to 7 (Sunday)
     */
    static getDayOfWeek(year: number, month: number, day: number): number;
    static getDaysInMonth(year: number, month: number): number;
    static getWeeksOfMonth: (year: number, month: number) => (string | null)[][];
    static isLeapYear: (year: number) => boolean;
}
export {};
