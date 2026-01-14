
import type {EnumOption} from "@/public/js/common/type";

export type UserT = {
    id: string | number,
    ulid: string,
    username: string,
    email: string,
    timezone: string,
}

export type UserFormT = {
    account_id: string | number,
    status: string | number,
    timezone: string | null,
    name?: string,
    email?: string,
    password?: string,
    password_confirmation?: string,
    role_ids: number[]
}

export type UserCompanyAssignmentT = {
    id: string | number,
    user_id: string | number,
    company_id: string | number,
    company_code: string,
    company_assignment_type: number | null
    company_name: string,
    employee_id: string | number,
    employee_number: string,
    employee_full_name: string,
    is_employee: boolean,
}

export type UserCompanyAssignmentSyncT = {
    [key: string | number]: {
        assignment_type: string | number
    }
}

export type CompanyUserSelectionT = {
    account_roles_summary: {
        value: string,
        extender: string
    },
    associated_company: {
        assignment: EnumOption,
        employee_full_name: string
        employee_number: string,
        id: number,
        is_employee: boolean,
        name: string
    },
    email: string,
    email_verified_at: string,
    id: number,
    status: EnumOption,
    timezone: string,
    ulid: string,
    username: string,
}