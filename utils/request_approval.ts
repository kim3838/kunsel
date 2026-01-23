
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const APPROVAL_ACTION: NumericEnumInterface = {
    NOT_SPECIFIED: 0,
    DECLINE: 100,
    APPROVE: 200
}

export const APPROVAL_ACTION_NAME: StringEnumInterface = {
    [APPROVAL_ACTION.NOT_SPECIFIED as number]: 'Not Specified',
    [APPROVAL_ACTION.DECLINE as number]: 'Decline',
    [APPROVAL_ACTION.APPROVE as number]: 'Approve',
}

export const APPROVAL_ACTION_NAME_PAST_TENSE: StringEnumInterface = {
    [APPROVAL_ACTION.NOT_SPECIFIED as number]: 'Not Specified',
    [APPROVAL_ACTION.DECLINE as number]: 'Declined',
    [APPROVAL_ACTION.APPROVE as number]: 'Approved',
}

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