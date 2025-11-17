
export interface SelectValueInterface {
    value: number | string
}

export type SelectDataType = SelectValueInterface & {
    text: string,
}

export type SelectSelectedT = number | string;

export type SelectSearchPoolT = (string | number)[];

export type SelectionOffsetT = {
    origin: number | null;
    left: number;
};

export type SingleSelectSelectionOffsetT = {
    origin: number | null;
    left: string;
};

export type SelectionArrayT = {
    text: string;
    value: string;
    [key: string]: any;
};

export type SelectionOptionsT = {
    search: string;
    selection: SelectionArrayT[];
    selected: string | null;
};