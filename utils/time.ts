
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const  WEEK_DAY: NumericEnumInterface = {
    SUNDAY : 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
}

export const WEEK_DAY_NAMES: StringEnumInterface = {
    [WEEK_DAY.SUNDAY as number]: 'Sunday',
    [WEEK_DAY.MONDAY as number]: 'Monday',
    [WEEK_DAY.TUESDAY as number]: 'Tuesday',
    [WEEK_DAY.WEDNESDAY as number]: 'Wednesday',
    [WEEK_DAY.THURSDAY as number]: 'Thursday',
    [WEEK_DAY.FRIDAY as number]: 'Friday',
    [WEEK_DAY.SATURDAY as number]: 'Saturday',
}

export const  MONTH: NumericEnumInterface = {
    JANUARY : 1,
    FEBRUARY: 2,
    MARCH: 3,
    APRIL: 4,
    MAY: 5,
    JUNE: 6,
    JULY: 7,
    AUGUST: 8,
    SEPTEMBER: 9,
    OCTOBER: 10,
    NOVEMBER: 11,
    DECEMBER: 12,
}

export const MONTH_NAMES: StringEnumInterface = {
    [MONTH.JANUARY as number]: 'January',
    [MONTH.FEBRUARY as number]: 'February',
    [MONTH.MARCH as number]: 'March',
    [MONTH.APRIL as number]: 'April',
    [MONTH.MAY as number]: 'May',
    [MONTH.JUNE as number]: 'June',
    [MONTH.JULY as number]: 'July',
    [MONTH.AUGUST as number]: 'August',
    [MONTH.SEPTEMBER as number]: 'September',
    [MONTH.OCTOBER as number]: 'October',
    [MONTH.NOVEMBER as number]: 'November',
    [MONTH.DECEMBER as number]: 'December',
}