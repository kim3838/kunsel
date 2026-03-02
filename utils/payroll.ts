
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const PAY_FREQUENCY_CODES: string[] = [
    'SEMI_MONTHLY',
    'MONTHLY',
]

export const CUT_OFF_TYPE: NumericEnumInterface ={
    WEEKLY : 100,
}

export const CUT_OFF_NAME: StringEnumInterface = {
    [CUT_OFF_TYPE.WEEKLY as number]: 'Weekly',
};

export const PAY_FREQUENCY_TYPE: NumericEnumInterface ={
    WEEKLY : 200,
    SEMI_MONTHLY : 300,
    MONTHLY : 400
}

export const PAY_FREQUENCY_NAME: StringEnumInterface = {
    [PAY_FREQUENCY_TYPE.WEEKLY as number]: 'Weekly',
    [PAY_FREQUENCY_TYPE.SEMI_MONTHLY as number]: 'Semimonthly',
    [PAY_FREQUENCY_TYPE.MONTHLY as number]: 'Monthly'
};

export const PAY_FREQUENCY_SEQUENCE_TYPE: NumericEnumInterface ={
    FIRST_HALF : 100,
    SECOND_HALF : 200,
}

export const PAY_FREQUENCY_SEQUENCE_NAME: StringEnumInterface = {
    [PAY_FREQUENCY_SEQUENCE_TYPE.FIRST_HALF as number]: '1st half',
    [PAY_FREQUENCY_SEQUENCE_TYPE.SECOND_HALF as number]: '2nd half',
};

export const PAYROLL_STATUS: NumericEnumInterface ={
    DRAFT : 100,
}

export const PAYROLL_STATUS_NAME: StringEnumInterface = {
    [PAYROLL_STATUS.DRAFT as number]: 'Draft',
};

export const  PAYROLL_SUB_INFO_TYPE: NumericEnumInterface = {
    DEFAULT : 0,
    ADMIN_OVERVIEW: 100,
}