export const  FORMULABLE = {
    EARNINGS : 0,
    DEDUCTIONS : 1,
    TAXABLE_INCOME : 2,
    NON_TAXABLE_INCOME : 3,
    INCOME_TAX : 4,
    NET_INCOME : 5
}

export const  FORMULABLE_NAME = {
    [FORMULABLE.EARNINGS] : 'Earnings',
    [FORMULABLE.DEDUCTIONS] : 'Deductions',
    [FORMULABLE.TAXABLE_INCOME] : 'Taxable Income',
    [FORMULABLE.NON_TAXABLE_INCOME] : 'Non-Taxable Income',
    [FORMULABLE.INCOME_TAX] : 'Income Tax',
    [FORMULABLE.NET_INCOME] : 'Net Income'
}

export const FORMULABLE_MODEL_MAP_KEY = {
    [FORMULABLE.EARNINGS]: 'compensation',
    [FORMULABLE.DEDUCTIONS]: 'deduction',
    [FORMULABLE.INCOME_TAX]: 'income_tax',
};

export const  COMPENSATION = {
    BASIC_SALARY : 0,
    OVERTIME : 1,
    REGULAR_ALLOWANCE : 2,
    BENEFIT : 3,
}

export const  COMPENSATION_NAMES = {
    [COMPENSATION.BASIC_SALARY] : 'Basic Salary',
    [COMPENSATION.OVERTIME] : 'Overtime',
    [COMPENSATION.BENEFIT] : 'Benefit',
    [COMPENSATION.REGULAR_ALLOWANCE] : 'Regular Allowance',
}

export const  DEDUCTION = {
    DEDUCTION : 0,
    CONTRIBUTION : 1
}

export const  DEDUCTION_NAME = {
    [DEDUCTION.DEDUCTION] : 'Deduction',
    [DEDUCTION.CONTRIBUTION] : 'Contribution',
}

export const  INCOME_TAX = {
    COMPENSATION_TAX : 0
}

export const  INCOME_TAX_NAME = {
    [INCOME_TAX.COMPENSATION_TAX] : 'Compensation Tax',
}
export const PAY_PERIOD ={
    HOURLY : 0,
    DAILY : 1,
    SEMI_MONTHLY : 2,
    MONTHLY : 3
}

export const PAY_PERIOD_NAME = {
    [PAY_PERIOD.HOURLY]: 'Hourly',
    [PAY_PERIOD.DAILY]: 'Daily',
    [PAY_PERIOD.SEMI_MONTHLY]: 'Semimonthly',
    [PAY_PERIOD.MONTHLY]: 'Monthly'
};

export const PAY_FREQUENCY_TYPE ={
    DAILY : 0,
    WEEKLY : 1,
    SEMI_MONTHLY : 2,
    MONTHLY : 3
}

export const PAY_FREQUENCY_NAME = {
    [PAY_FREQUENCY_TYPE.DAILY]: 'Daily',
    [PAY_FREQUENCY_TYPE.WEEKLY]: 'Weekly',
    [PAY_FREQUENCY_TYPE.SEMI_MONTHLY]: 'Semimonthly',
    [PAY_FREQUENCY_TYPE.MONTHLY]: 'Monthly'
};
