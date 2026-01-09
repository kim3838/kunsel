
import type {EnumOption} from "@/public/js/common/type";
import type {UserT} from "@/public/js/types/user";

export type EmployeeT = {
    id: string | number,
    ulid: string,
    user_id: string | number,
    department_id: string | number | null,
    designation_id: string | number | null,
    manager_id: string | number | null,
    number: string,
    given_name: string,
    middle_name: string | null,
    family_name: string,
    birth_date: string,
    gender: EnumOption,
    marital_status: EnumOption,
    full_name: string,
    contact: EmployeeContactT,
    employment_profiles: EmploymentProfileT[],
    user: UserT
}

export type EmployeeContactT = {
    id: string | number,
    employee_id: string | number,
    office_email: string,
    office_phone: string,
    personal_email: string,
    personal_phone: string,
}

export type EmploymentProfileT = {
    id: string | number,
    status: EnumOption,
    employee_id: string | number,
    employment_type: EnumOption,
    start_date: string | null,
    end_of_service_type: EnumOption,
    end_date: string | null,
}

export type EmployeePayrollComponentFormT = {
    employee_id: string | number | null,
    account_id: undefined | number,
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
    account_id: undefined | number,
    company_id: string | number | null,
    status: string | number | null,
    employment_type: string | number | null,
    start_date: string | number | null,
    end_of_service_type?: string | number | null,
    end_date?: string | number | null,
}