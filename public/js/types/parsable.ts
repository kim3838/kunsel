
export type Parsables = 'text' | 'date' | 'number' | 'array';

export type CastedDateValueT = {
    day: string | number | null,
    base: string,
    time: string | number[] | null,
    year: string | number | null,
    month: string | number | null,
};

export interface ParsableValueInterface {
    key: string,
    type: Parsables,
    label: string,
    order: number,
    readable: string,
}

export type CastedParsableValuePayloadT =
    | (ParsableValueInterface & { type: 'date'; value: CastedDateValueT })
    | (ParsableValueInterface & { type: 'text'; value: string })
    | (ParsableValueInterface & { type: 'number'; value: string | number })
    | (ParsableValueInterface & { type: 'array'; value: CastedParsableValuePayloadT[] });

export type ParsedParsableValuePayloadT = ParsableValueInterface & {
    value: string | number | null,
}

export type ParsableT =
    | (ParsableValueInterface & { type: 'array', value: CastedParsableValuePayloadT[] | ParsedParsableValuePayloadT[] })
    | (ParsableValueInterface & { type: 'text' | 'date' | 'number', value: CastedParsableValuePayloadT | ParsedParsableValuePayloadT });
