
import type {EnumOption} from "@/public/js/common/type";
import type {DepartmentT, DesignationT} from "@/public/js/types/organization";

export type AttendanceEmployeeT = {
    number: string,
    full_name: string,
    department: DepartmentT,
    designation: DesignationT,
}
export type AttendanceShiftT = {
    code: string,
    name: string,
    type: EnumOption,
    work_start_grace_time: number,
    work_start_grace_time_readable: string,
    require_lunch_time_in_and_out: number,
    lunch_start_grace_time: number,
    lunch_start_grace_time_readable: string,
    max_overtime: string,
    max_overtime_readable: string,
}
export type AttendanceShiftScheduleT = {
    week_day: EnumOption,
    week_day_name: string,
    is_rest_day: boolean,
    is_day_off: boolean,
    is_flexible: boolean,
    timezone: string,
    work_start: string,
    work_end: string,
    total_work_hours_with_breaks: string,
    has_lunch_break: number,
    lunch_break_start: string,
    lunch_break_end: string,
    total_lunch_break_hours: string,
}
export type AttendanceShiftAssignmentT = {
    start_date: string,
    stated_shift_end_date: number,
    end_date: string | null,
    readable: string,
}
export type AttendanceT = {
    id: string | number,
    ulid: string,
    employee_id: string | number,
    date: string,
    first_in: string,
    lunch_out?: string | null,
    lunch_in?: string | null,
    last_out: string,
    status: EnumOption,
    employee: AttendanceEmployeeT,
    shift: AttendanceShiftT,
    shift_schedule: AttendanceShiftScheduleT,
    shift_assignment: AttendanceShiftAssignmentT,
}