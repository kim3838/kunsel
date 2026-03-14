
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const  FORMULABLE: NumericEnumInterface = {
    EARNINGS : 100,
    DEDUCTIONS : 200,
    TAXABLE_INCOME : 300,
    NON_TAXABLE_INCOME : 400,
    INCOME_TAX : 500,
    NET_INCOME : 900
}

export const  FORMULABLE_NAME: StringEnumInterface = {
    [FORMULABLE.EARNINGS as number] : 'Earnings',
    [FORMULABLE.DEDUCTIONS as number] : 'Deductions',
    [FORMULABLE.TAXABLE_INCOME as number] : 'Taxable Income',
    [FORMULABLE.NON_TAXABLE_INCOME as number] : 'Non-Taxable Income',
    [FORMULABLE.INCOME_TAX as number] : 'Income Tax',
    [FORMULABLE.NET_INCOME as number] : 'Net Income'
}

export const  FORMULABLE_COMPONENT_SUB_TYPE: StringEnumInterface = {
    BASIC_PAY : '100.100.1',
    REGULAR_ALLOWANCE : '100.101.1',
    MEAL_ALLOWANCE : '100.101.2',
    TRANSPORTATION_ALLOWANCE : '100.101.4',
    OVERTIME : '100.110.1',
    STATUTORY_BENEFIT_13TH_MONTH : '100.120.1',
    NONSTATUTORY_BENEFIT_BONUS : '100.130.1',
    LEAVE_PAY : '100.200.1',
    MANUAL_EARNING : '100.400.1',
    HOLIDAY_PAY : '100.300.1',

    PH_SSS : '200.200.2',
    PH_PHILHEALTH : '200.200.3',
    PH_PAG_IBIG : '200.200.4',
    DEDUCTION : '200.210.1',
    MANUAL_DEDUCTION : '200.400.1',

    PH_WITHHOLDING_TAX_COMPENSATION : '500.300.2',
}

export const  FORMULABLE_COMPONENT_SUB_TYPE_NAME: StringEnumInterface = {
    [FORMULABLE_COMPONENT_SUB_TYPE.BASIC_PAY as string] : 'Basic pay',
    [FORMULABLE_COMPONENT_SUB_TYPE.REGULAR_ALLOWANCE as string] : 'Regular allowance',
    [FORMULABLE_COMPONENT_SUB_TYPE.MEAL_ALLOWANCE as string] : 'Meal allowance',
    [FORMULABLE_COMPONENT_SUB_TYPE.TRANSPORTATION_ALLOWANCE as string] : 'Transportation allowance',
    [FORMULABLE_COMPONENT_SUB_TYPE.OVERTIME as string] : 'Overtime',
    [FORMULABLE_COMPONENT_SUB_TYPE.STATUTORY_BENEFIT_13TH_MONTH as string] : '13th month pay',
    [FORMULABLE_COMPONENT_SUB_TYPE.NONSTATUTORY_BENEFIT_BONUS as string] : 'Bonus',
    [FORMULABLE_COMPONENT_SUB_TYPE.LEAVE_PAY as string] : 'Leave pay',
    [FORMULABLE_COMPONENT_SUB_TYPE.MANUAL_EARNING as string] : 'Manual earning',
    [FORMULABLE_COMPONENT_SUB_TYPE.HOLIDAY_PAY as string] : 'Holiday pay',

    [FORMULABLE_COMPONENT_SUB_TYPE.PH_SSS as string] : 'SSS contribution',
    [FORMULABLE_COMPONENT_SUB_TYPE.PH_PHILHEALTH as string] : 'Philhealth (PHIC)',
    [FORMULABLE_COMPONENT_SUB_TYPE.PH_PAG_IBIG as string] : 'Pag-IBIG (HDMF)',
    [FORMULABLE_COMPONENT_SUB_TYPE.DEDUCTION as string] : 'Deduction',
    [FORMULABLE_COMPONENT_SUB_TYPE.MANUAL_DEDUCTION as string] : 'Manual deduction',

    [FORMULABLE_COMPONENT_SUB_TYPE.PH_WITHHOLDING_TAX_COMPENSATION as string] : 'Compensation tax (WTC)',
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
    STATUTORY_BENEFIT : 120,
    LEAVE_PAY : 200,
    HOLIDAY_PAY : 300,
    MANUAL_EARNING : 400,
    TAX_ADJUSTMENT : 1000,
    THIRTEENTH_MONTH_ADJUSTMENT : 2000,
}

export const  COMPENSATION_NAME: StringEnumInterface = {
    [COMPENSATION.BASIC_PAY as number] : 'Basic Pay',
    [COMPENSATION.OVERTIME as number] : 'Overtime',
    [COMPENSATION.STATUTORY_BENEFIT as number] : 'Statutory Benefit',
    [COMPENSATION.REGULAR_ALLOWANCE as number] : 'Regular Allowance',
    [COMPENSATION.LEAVE_PAY as number] : 'Leave Pay',
    [COMPENSATION.HOLIDAY_PAY as number] : 'Holiday Pay',
    [COMPENSATION.MANUAL_EARNING as number] : 'Manual Earning',
    [COMPENSATION.TAX_ADJUSTMENT as number] : 'Tax Adjustment',
    [COMPENSATION.THIRTEENTH_MONTH_ADJUSTMENT as number] : '13th Month Adjustment',

}

export const  DEDUCTION: NumericEnumInterface = {
    STATUTORY_CONTRIBUTION : 200,
    DEDUCTION : 210,
    MANUAL_DEDUCTION : 400,
    TAX_ADJUSTMENT : 1000,
    THIRTEENTH_MONTH_ADJUSTMENT : 2000,
}

export const  DEDUCTION_NAME: StringEnumInterface = {
    [DEDUCTION.STATUTORY_CONTRIBUTION as number] : 'Statutory contribution',
    [DEDUCTION.DEDUCTION as number] : 'Deduction',
    [DEDUCTION.MANUAL_DEDUCTION as number] : 'Manual deduction',
    [DEDUCTION.TAX_ADJUSTMENT as number] : 'Tax adjustment',
    [DEDUCTION.THIRTEENTH_MONTH_ADJUSTMENT as number] : '13th month adjustment',
}

export const  INCOME_TAX: NumericEnumInterface = {
    WITHHOLDING_TAX : 300
}

export const  INCOME_TAX_NAME: StringEnumInterface = {
    [INCOME_TAX.WITHHOLDING_TAX as number] : 'Withholding tax',
}
export const PAY_PERIOD: NumericEnumInterface ={
    HOURLY : 50,
    DAILY : 100,
    SEMIMONTHLY : 300,
    MONTHLY : 400
}

export const PAY_PERIOD_NAME: StringEnumInterface = {
    [PAY_PERIOD.HOURLY as number]: 'Hourly',
    [PAY_PERIOD.DAILY as number]: 'Daily',
    [PAY_PERIOD.SEMIMONTHLY as number]: 'Semimonthly',
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