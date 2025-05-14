
export interface SelectValueInterface {
    value: number
}

export type SelectDataType = SelectValueInterface & {
    text: string,
}

export type SelectSelectedT = number;

export type SelectSearchPoolT = number[];

export type SelectionOffsetT = {
    origin: number | null;
    left: number;
};

export type SingleSelectSelectionOffsetT = {
    origin: number | null;
    left: string;
};