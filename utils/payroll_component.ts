export const  FORMULABLE = {
    EARNINGS : 0,
    DEDUCTIONS : 1,
    TAXABLE_INCOME : 2,
    NON_TAXABLE_INCOME : 3,
    INCOME_TAX : 4,
    NET_INCOME : 5
}

export const FORMULABLE_MODEL_MAP_KEY = {
    [FORMULABLE.EARNINGS]: 'compensation',
    [FORMULABLE.DEDUCTIONS]: 'deduction',
    [FORMULABLE.INCOME_TAX]: 'income_tax',
};

export const  COMPENSATIONS = {
    SALARY : 0,
    OVERTIME : 1,
    BENEFIT : 2,
    REGULAR_ALLOWANCE : 3
}

export const  DEDUCTIONS = {
    DEDUCTION : 0,
    CONTRIBUTION : 1
}

export const  INCOME_TAX = {
    WITHHOLDING_TAX : 0
}