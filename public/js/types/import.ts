
import type {Validatable} from "@/public/js/types/data";

export interface ImportRow extends Validatable{
    id: number,
    row: number,
    isEditing?: boolean,
}

export type EmployeePreImportT = {
    number: string,
    family_name: string,
    given_name: string,
} & ImportRow;

export type EmploymentProfilePreImportT = {
    employee_number: string,
    employment_type: string,
    start_date: string,
    end_of_service_type: string,
    end_date: string,
} & ImportRow;

export type EmployeePayrollComponentPreImportT = {
    employee_number: string,
    payroll_component_code: string,
    payroll_component_is_amountable: boolean,
    amount: number,
    pay_period: string,
    pay_type: string,
    pay_frequency: string,
} & ImportRow;

export type AttendancePreImportT = {
    employee_id: int,
    shift_id: int,
    employee_number: string,
    shift_code: string,
    date: string,
    require_lunch_time_in_and_out: boolean,
    is_flexible: boolean,
    first_in: string,
    lunch_out: string | null,
    lunch_in: string | null,
    last_out: string,
} & ImportRow;

export type OvertimePreImportT = {
    employee_id: int,
    shift_id: int,
    employee_number: string,
    shift_code: string,
    attendance_date: string,
    overtime_start: string,
    overtime_end: string,
} & ImportRow;