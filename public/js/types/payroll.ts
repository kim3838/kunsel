
import type {EnumOption} from "@/public/js/common/type";

export type PayrollInquiryT = {
    summary: string,
    year: number,
    month: number,
    month_readable: string,
    pay_frequency: EnumOption,
    pay_frequency_readable: string,
    frequency_sequence: null|EnumOption,
    frequency_sequence_readable: string,
    start: string,
    end: string,
    date_range_readable: string,
    remarks: string,
}