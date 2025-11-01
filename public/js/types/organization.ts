
export type DepartmentT = {
    id: number,
    company_id: number,
    parent_id?: number | null,
    name: string,
}

export type DesignationT = {
    id: number,
    company_id: number,
    name: string,
}