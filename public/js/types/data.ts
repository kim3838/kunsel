
export interface Validatable {
    validation_errors: string[],
}

export interface Sequenceable {
    order: number
}

export interface TableSupHeaderT {
    text: string;
    colspan?: number;
    alignHeader?: 'left' | 'center' | 'right';
}

export interface TableHeaderT {
    value: string;
    text: string;
    minWidth?: string;
    width?: string;
    alignHeader?: 'left' | 'center' | 'right';
    alignData?: 'left' | 'center' | 'right';
}

export type TableCellStyleT = {
    'background-color'?: string
}

export interface TableRowPayloadShadeT {
    cell: string | string[],
    value: string
}

export interface TableRowPayloadT {
    label_shade?: TableRowPayloadShadeT
}

export interface TableRowT {
    id: string | number;
    [key: string]: any;
    _payload?: TableRowPayloadT;
}

export type MetaPaginationT = {
    total: number,
    count: number,
    per_page: number,
    current_page: number,
    total_pages: number
}

export type DataTableMeta = {
    pagination: MetaPaginationT
}

export type SequenceableTableRow = Sequenceable & TableRowT;

export type DatePickerT = {
    id: string,
    type: string,
    selectedCallback: (payload: string) => void;
}