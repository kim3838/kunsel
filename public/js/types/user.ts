
export type UserT = {
    id: string | number,
    ulid: string,
    username: string,
    email: string,
    timezone: string,
}

export type UserFormT = {
    status: string | number,
    timezone: string | null,
    name?: string,
    email?: string,
    password?: string,
    password_confirmation?: string,
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