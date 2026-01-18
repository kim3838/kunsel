
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