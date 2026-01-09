
export type RoleT = {
    id: string | number,
    ulid: string,
}

export type RolePermissionT = {
    [key: string] : {
        id: number,
        value: boolean
    }
}

export type PermissionFormInputT = {
    name: string,
    value_key: string
}

export type PermissionGroupT = {
    name: string,
    permissions: PermissionFormInputT[]
}

export type PermissionSeriesFormT = {
    name: string,
    permission_group: PermissionGroupT[]
}