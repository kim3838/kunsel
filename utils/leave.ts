
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const  LEAVE_TYPE: NumericEnumInterface = {
    VACATION : 100,
    SICK : 200,
    EMERGENCY : 300,
}

export const LEAVE_TYPE_NAME: StringEnumInterface = {
    [LEAVE_TYPE.VACATION as number]: 'Vacation',
    [LEAVE_TYPE.SICK as number]: 'Sick',
    [LEAVE_TYPE.EMERGENCY as number]: 'Emergency',
};

export const  LEAVE_USAGE_SPAN_TYPE: NumericEnumInterface = {
    DAY : 100,
    MONTH : 200,
    YEAR : 300,
}

export const LEAVE_USAGE_SPAN_TYPE_NAME: StringEnumInterface = {
    [LEAVE_USAGE_SPAN_TYPE.DAY as number]: 'Day',
    [LEAVE_USAGE_SPAN_TYPE.MONTH as number]: 'Month',
    [LEAVE_USAGE_SPAN_TYPE.YEAR as number]: 'Year',
};

export const  LEAVE_PERIOD_TYPE: NumericEnumInterface = {
    INTERVAL : 100,
    CALENDAR_YEAR : 200,
}

export const LEAVE_PERIOD_TYPE_NAME: StringEnumInterface = {
    [LEAVE_PERIOD_TYPE.INTERVAL as number]: 'Interval',
    [LEAVE_PERIOD_TYPE.CALENDAR_YEAR as number]: 'Calendar year',
};

export const  LEAVE_INTERVAL_SPAN_TYPE: NumericEnumInterface = {
    DAY : 100,
    MONTH : 200,
    YEAR : 300,
}

export const LEAVE_INTERVAL_SPAN_TYPE_NAME: StringEnumInterface = {
    [LEAVE_INTERVAL_SPAN_TYPE.DAY as number]: 'Day',
    [LEAVE_INTERVAL_SPAN_TYPE.MONTH as number]: 'Month',
    [LEAVE_INTERVAL_SPAN_TYPE.YEAR as number]: 'Year',
};

export const  LEAVE_CARRY_OVER_TYPE: NumericEnumInterface = {
    ALL : 100,
    LIMIT : 200,
    PERCENTAGE : 300,
}

export const LEAVE_CARRY_OVER_TYPE_NAME: StringEnumInterface = {
    [LEAVE_CARRY_OVER_TYPE.ALL as number]: 'All',
    [LEAVE_CARRY_OVER_TYPE.LIMIT as number]: 'Limit',
    [LEAVE_CARRY_OVER_TYPE.PERCENTAGE as number]: 'Percentage',
};

export const  LEAVE_BALANCE_ADJUSTMENT_TYPE: NumericEnumInterface = {
    ADD : 100,
    DEDUCT : 200,
}

export const LEAVE_BALANCE_ADJUSTMENT_TYPE_NAME: StringEnumInterface = {
    [LEAVE_BALANCE_ADJUSTMENT_TYPE.ADD as number]: 'Add',
    [LEAVE_BALANCE_ADJUSTMENT_TYPE.DEDUCT as number]: 'Deduct',
};