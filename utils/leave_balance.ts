
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const LEAVE_BALANCE_TAB: NumericEnumInterface = {
    PERIOD_SERIES : 0,
    BALANCE_BY_TYPE : 1,
}

export const LEAVE_BALANCE_TAB_NAME: StringEnumInterface = {
    [LEAVE_BALANCE_TAB.PERIOD_SERIES as number]: 'Period Series',
    [LEAVE_BALANCE_TAB.BALANCE_BY_TYPE as number]: 'Balance by Type',
}