
import moment from "moment";

export interface DateRangePickerOptions {
    startDate: moment.Moment;
    endDate: moment.Moment;
    selectedYear: undefined | number | string;
    selectedMonth: number;
}

export interface DateTimePickerPayloadT{
    value: string;
    label?: string;
}

export interface DateTimePickerOptionsT {
    id: string;
    type: string;
    selectedCallback: (payload: DateTimePickerPayloadT) => void;
}