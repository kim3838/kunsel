
import type {ParsableT} from "@/utils/parsable";

export type PayFrequencyT = {
    id: number,
    ulid: string,
    company_id: number,
    code: string,
    order: number,
    type: number,
    time_period_preset_id: string | number | null,
    period: ParsableT | ParsableT[] | null,
    cutoff_type: number | null,
    cutoff_value: number | null,
    days_span: number | null
}