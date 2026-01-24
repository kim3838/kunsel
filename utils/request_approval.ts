
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const APPROVER_TYPE: NumericEnumInterface = {
    SELECTED : 0,
    DEPARTMENT_HEAD: 100,
    MANAGER: 200
}

export const APPROVER_TYPE_NAME: StringEnumInterface = {
    [APPROVER_TYPE.SELECTED as number]: 'Selected',
    [APPROVER_TYPE.DEPARTMENT_HEAD as number]: 'Department Head',
    [APPROVER_TYPE.MANAGER as number]: 'Manager',
}

export const REQUEST_APPROVAL_STATUS: NumericEnumInterface = {
    PENDING : 0,
    DECLINED: 100,
    APPROVED: 200
}

export const REQUEST_APPROVAL_STATUS_NAME: StringEnumInterface = {
    [REQUEST_APPROVAL_STATUS.PENDING as number]: 'Pending',
    [REQUEST_APPROVAL_STATUS.DECLINED as number]: 'Declined',
    [REQUEST_APPROVAL_STATUS.APPROVED as number]: 'Approved',
}

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