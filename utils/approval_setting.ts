
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