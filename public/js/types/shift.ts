

export type ShiftT = {
    id: string | number,
    ulid: string,
    company_id: string | number,
    code: string,
    name: string,
    type: number,
}

export type ShiftSchedulePatchableT = {
    week_day_name?: string,
}

export type ShiftScheduleT = ShiftSchedulePatchableT & {
    week_day: number,
    is_rest_day: boolean,
    is_day_off: boolean,
    is_flexible: boolean,
    timezone: string | null,
    work_start: string | null,
    work_end: string | null,
    total_work_hours_with_breaks: string | null,
    has_lunch_break: number,
    lunch_break_start: string | null,
    lunch_break_end: string | null,
    total_lunch_break_hours: string | null,
}