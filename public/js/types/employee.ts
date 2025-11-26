
export type EmployeePayrollComponentFormT = {
    employee_id: string | number | null,
    company_id: string | number | null,
    formulable_type: string | number,
    payroll_componentable_type: string,
    payroll_componentable_id: string | number,
    amount?: string | number,
    currency?: string | number | null,
    pay_period?: string | number | null,
    pay_type?: string | number | null,
    pay_frequency_id?: string | number | null,
    amountable_start?: string | number | null,
    amountable_end?: string | number | null,
    start_date?: string | number | null,
    end_date?: string | number | null,
}

export type EmploymentProfileFormT = {
    employee_id: string | number | null,
    company_id: string | number | null,
    status: string | number | null,
    employment_type: string | number | null,
    start_date: string | number | null,
    end_of_service_type?: string | number | null,
    end_date?: string | number | null,
}