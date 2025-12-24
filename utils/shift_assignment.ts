
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const SHIFT_ASSIGNMENT_TAB: NumericEnumInterface = {
    LIST : 0,
    CREATE_SHIFT_ASSIGNMENTS : 1,
    MANAGE_ASSIGNED_SHIFTS : 2,
}

export const SHIFT_ASSIGNMENT_TAB_NAME: StringEnumInterface = {
    [SHIFT_ASSIGNMENT_TAB.LIST as number]: 'List',
    [SHIFT_ASSIGNMENT_TAB.CREATE_SHIFT_ASSIGNMENTS as number]: 'Create Shift Assignment',
    [SHIFT_ASSIGNMENT_TAB.MANAGE_ASSIGNED_SHIFTS as number]: 'Bulk Remove Assigned Shifts',
}