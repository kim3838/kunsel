
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const  FORMULABLE: NumericEnumInterface = {
    EARNINGS : 100,
    DEDUCTIONS : 200,
    TAXABLE_INCOME : 300,
    NON_TAXABLE_INCOME : 400,
    INCOME_TAX : 500,
    NET_INCOME : 600
}

export const  FORMULABLE_NAME: StringEnumInterface = {
    [FORMULABLE.EARNINGS as number] : 'Earnings',
    [FORMULABLE.DEDUCTIONS as number] : 'Deductions',
    [FORMULABLE.TAXABLE_INCOME as number] : 'Taxable Income',
    [FORMULABLE.NON_TAXABLE_INCOME as number] : 'Non-Taxable Income',
    [FORMULABLE.INCOME_TAX as number] : 'Income Tax',
    [FORMULABLE.NET_INCOME as number] : 'Net Income'
}

export const FORMULABLE_MODEL_MAP_KEY: StringEnumInterface = {
    [FORMULABLE.EARNINGS as number]: 'compensation',
    [FORMULABLE.DEDUCTIONS as number]: 'deduction',
    [FORMULABLE.INCOME_TAX as number]: 'income_tax',
};

export const  COMPENSATION: NumericEnumInterface = {
    BASIC_PAY : 100,
    REGULAR_ALLOWANCE : 101,
    OVERTIME : 110,
    BENEFIT : 120,
    LEAVE_PAY : 200,
    HOLIDAY_PAY : 300,
}

export const  COMPENSATION_NAME: StringEnumInterface = {
    [COMPENSATION.BASIC_PAY as number] : 'Basic Pay',
    [COMPENSATION.OVERTIME as number] : 'Overtime',
    [COMPENSATION.BENEFIT as number] : 'Benefit',
    [COMPENSATION.REGULAR_ALLOWANCE as number] : 'Regular Allowance',
    [COMPENSATION.LEAVE_PAY as number] : 'Leave Pay',
    [COMPENSATION.HOLIDAY_PAY as number] : 'Holiday Pay',

}

export const  DEDUCTION: NumericEnumInterface = {
    DEDUCTION : 200,
    CONTRIBUTION : 210
}

export const  DEDUCTION_NAME: StringEnumInterface = {
    [DEDUCTION.DEDUCTION as number] : 'Deduction',
    [DEDUCTION.CONTRIBUTION as number] : 'Contribution',
}

export const  INCOME_TAX: NumericEnumInterface = {
    COMPENSATION_TAX : 300
}

export const  INCOME_TAX_NAME: StringEnumInterface = {
    [INCOME_TAX.COMPENSATION_TAX as number] : 'Compensation Tax',
}
export const PAY_PERIOD: NumericEnumInterface ={
    HOURLY : 50,
    DAILY : 100,
    SEMI_MONTHLY : 300,
    MONTHLY : 400
}

export const PAY_PERIOD_NAME: StringEnumInterface = {
    [PAY_PERIOD.HOURLY as number]: 'Hourly',
    [PAY_PERIOD.DAILY as number]: 'Daily',
    [PAY_PERIOD.SEMI_MONTHLY as number]: 'Semimonthly',
    [PAY_PERIOD.MONTHLY as number]: 'Monthly'
};

export const PAY_TYPE: NumericEnumInterface ={
    BY_ATTENDANCE : 100,
    FIXED : 200,
}

export const PAY_TYPE_NAME: StringEnumInterface = {
    [PAY_TYPE.BY_ATTENDANCE as number]: 'By attendance',
    [PAY_TYPE.FIXED as number]: 'Fixed',
};

export const PAY_FREQUENCY_CODES: string[] = [
    'WEEKLY',
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

export const AMOUNTABLE_PAYROLL_COMPONENT_START: NumericEnumInterface ={
    NOT_SPECIFIED : 0,
    EMPLOYMENT_START_DATE : 100,
    CUSTOM_DATE : 200,
}

export const AMOUNTABLE_PAYROLL_COMPONENT_START_NAME: StringEnumInterface = {
    [AMOUNTABLE_PAYROLL_COMPONENT_START.NOT_SPECIFIED as number]: 'Not specified',
    [AMOUNTABLE_PAYROLL_COMPONENT_START.EMPLOYMENT_START_DATE as number]: 'Employment start date',
    [AMOUNTABLE_PAYROLL_COMPONENT_START.CUSTOM_DATE as number]: 'Custom date',
};

export const AMOUNTABLE_PAYROLL_COMPONENT_END: NumericEnumInterface ={
    NOT_SPECIFIED : 0,
    CUSTOM_DATE : 100,
}

export const AMOUNTABLE_PAYROLL_COMPONENT_END_NAME: StringEnumInterface = {
    [AMOUNTABLE_PAYROLL_COMPONENT_END.NOT_SPECIFIED as number]: 'Not specified',
    [AMOUNTABLE_PAYROLL_COMPONENT_END.CUSTOM_DATE as number]: 'Custom date',
};