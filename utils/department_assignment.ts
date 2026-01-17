
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const DEPARTMENT_EMPLOYEE_ASSIGNMENT: NumericEnumInterface = {
    DEFAULT : 0,
    HEAD: 100
}

export const DEPARTMENT_EMPLOYEE_ASSIGNMENT_NAME: StringEnumInterface = {
    [DEPARTMENT_EMPLOYEE_ASSIGNMENT.DEFAULT as number]: 'Default',
    [DEPARTMENT_EMPLOYEE_ASSIGNMENT.HEAD as number]: 'Department Head',
}