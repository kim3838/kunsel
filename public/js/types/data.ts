
export interface Sequenceable {
    order: number
}

export interface TableHeaderT {
    value: string;
    text: string;
    width?: string;
    alignHeader?: 'left' | 'center' | 'right';
    alignData?: 'left' | 'center' | 'right';
}

export interface TableRowT {
    id: string | number;
    [key: string]: any;
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