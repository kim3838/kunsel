
export interface Validatable {
    validation_errors: string[],
}

export interface Sequenceable {
    order: number
}

export interface TableRowPayloadShadeT {
    cell: string | string[],
    value: string
}

export interface TableRowPayloadT {
    label_shade?: TableRowPayloadShadeT
}

export interface TableSupHeaderT {
    value?: string;
    text: string;
    minWidth?: string;
    width?: string;
    maxWidth?: string;
    colspan?: number;
    alignHeader?: 'left' | 'center' | 'right';
    justifyHeader?: 'top' | 'middle' | 'bottom';
    alignData?: 'left' | 'center' | 'right';
    justifyData?: 'top' | 'middle' | 'bottom';
}

export interface TableSupRowT {
    [key: string]: any;
    _payload?: TableRowPayloadT;
}


export interface TableHeaderT {
    value: string;
    text: string;
    minWidth?: string;
    width?: string;
    maxWidth?: string;
    alignHeader?: 'left' | 'center' | 'right';
    justifyHeader?: 'top' | 'middle' | 'bottom';
    alignData?: 'left' | 'center' | 'right';
    justifyData?: 'top' | 'middle' | 'bottom';
}

export interface TableRowT {
    id?: string | number;
    [key: string]: any;
    _payload?: TableRowPayloadT;
}

export type TableCellStyleT = {
    'background-color'?: string
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

export type DataTableSelectionActionT = {
    action: number
    value: number[]
}