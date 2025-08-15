
export interface Sequenceable {
    order: number
}

export interface TableHeaderT {
    value: string;
    text: string;
    minWidth?: string;
    width?: string;
    alignHeader?: 'left' | 'center' | 'right';
    alignData?: 'left' | 'center' | 'right';
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