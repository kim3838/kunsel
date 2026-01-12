
import type {EnumOption} from "@/public/js/common/type";

export type ShiftT = {
    id: string | number,
    ulid: string,
    company_id: string | number,
    code: string,
    name: string,
    type: EnumOption,
    holiday_policy: EnumOption,
    except_holidays: number[] | null,
    work_start_grace_time: number,
    require_lunch_time_in_and_out: boolean,
    lunch_start_grace_time: number,
    max_overtime: string | number
}

export type ShiftScheduleT = {
    week_day: EnumOption,
    week_day_name?: string,
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