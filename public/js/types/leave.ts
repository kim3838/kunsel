
import type {EnumOption} from "@/public/js/common/type";

export type LeaveTypeT = {
    id: string | number,
    ulid: string,
    company_id: string | number,
    code: string,
    name: string,
    type: EnumOption,
    is_paid: boolean,
    monetizable: boolean,

    limit_usage: boolean,
    limit_usage_span_type: EnumOption,
    limit_usage_span_value: number,
    limit_usage_value: number

    eligibility_employment_types: number[] | null,
    initial_balance_upon_eligibility: number,

    period_type: EnumOption,
    period_interval_span_type: EnumOption | null,
    period_interval_span_value: number,
    period_calendar_span_value: number,

    carry_over_balance_per_new_period: boolean,
    carry_over_balance_type: EnumOption | null,
    carry_over_balance_value: number,
}

export type LeaveTypeBalancePerPeriodT = {
    id?: number,
    leave_type_id: number | null,
    from_period: number,
    and_so_on: boolean,
    to_period: number | null,
    balance: number,
}

export type LeaveBalanceDateSeriesT = {
    day: number,
    running_balance: number,
}

export type LeaveBalanceEmploymentSeriesT = {
    type: EnumOption,
    eligible: boolean,
    value: LeaveBalanceDateSeriesT[]
}

export type LeaveBalanceYearMonthSeriesT = {
    period: number,
    year: number,
    month: number,
    month_readable: string,
    value: LeaveBalanceEmploymentSeriesT[],
}

export type LeaveBalancePeriodSeriesT = {
    period: number,
    value: LeaveBalanceYearMonthSeriesT[],
}