
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const LEAVE_TYPE_ASSIGNMENT_TAB: NumericEnumInterface = {
    LIST : 0,
    CREATE_LEAVE_TYPE_ASSIGNMENTS : 1,
    MANAGE_ASSIGNED_LEAVE_TYPES : 2,
}

export const LEAVE_TYPE_ASSIGNMENT_TAB_NAME: StringEnumInterface = {
    [LEAVE_TYPE_ASSIGNMENT_TAB.LIST as number]: 'List',
    [LEAVE_TYPE_ASSIGNMENT_TAB.CREATE_LEAVE_TYPE_ASSIGNMENTS as number]: 'Create Leave Type Assignments',
    [LEAVE_TYPE_ASSIGNMENT_TAB.MANAGE_ASSIGNED_LEAVE_TYPES as number]: 'Manage Assigned Leave Types',
}