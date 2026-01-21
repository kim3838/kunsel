
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const REQUESTABLE_TYPE: NumericEnumInterface = {
    ATTENDANCE_ADJUSTMENT_REQUEST : 100,
    OVERTIME_REQUEST: 200,
    LEAVE_REQUEST: 300
}

export const REQUESTABLE_TYPE_NAME: StringEnumInterface = {
    [REQUESTABLE_TYPE.ATTENDANCE_ADJUSTMENT_REQUEST as number]: 'Attendance Adjustment Request',
    [REQUESTABLE_TYPE.OVERTIME_REQUEST as number]: 'Overtime Request',
    [REQUESTABLE_TYPE.LEAVE_REQUEST as number]: 'Leave Request',
}