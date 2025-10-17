
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