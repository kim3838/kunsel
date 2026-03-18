
import type {EnumOption} from "@/public/js/common/type";

export type PayrollT = {
    id: number,
    ulid: string,
    company_id: number,
    number: string,
    year: number,
    month: number,
    month_readable: string,
    pay_frequency: EnumOption,
    frequency_sequence: EnumOption | null,
    start_date: string,
    end_date: string,
    remarks: string,
    status: EnumOption,
    total_net?: string,
    total_withholding_tax?: string,
    total_employer_contribution_share?: string,
    date_range_readable: string,
}

export type PayrollInquiryT = {
    summary: string,
    year: number,
    month: number,
    month_readable: string,
    pay_frequency: EnumOption,
    pay_frequency_readable: string,
    frequency_sequence: null|EnumOption,
    frequency_sequence_readable: string,
    start: string,
    end: string,
    date_range_readable: string,
    remarks: string,
}

export type SalaryStatementT = {
    id: number,
    ulid: string,
    payroll_id: number,
    employee_id: number,
    payroll: PayrollT,

    employee_number: string,
    employee_full_name: string,
    type: EnumOption,
    is_paid: boolean,

    total_days: number,
    total_day_offs: number,
    total_working_days: number,
    total_regular_work_days: number,
    total_working_rest_days: number,
    total_special_holidays: number,
    total_legal_holidays: number,
    total_double_holidays: number,
    total_legal_and_double_holidays: number,
    total_present: number,
    total_full_present: number,
    total_present_with_irregularity: number,
    total_leaves: number,
    total_leave_without_pay: number,
    total_leave_with_pay: number,
    total_absent: number,

    taxable: string,
    nontaxable: string,
    contribution: string,
    withholding_tax: string,
    deduction: string,
    net: string,
}

export type SalaryStatementManualAddDetailT = {
    component_sub_type: string,
    component_name: string,
    amount: number
}