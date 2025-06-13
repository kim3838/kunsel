

export type CompanyFormulaT = {
    key: string,
    type: string,
    label: string,
    order: number,
    value: string | number| null,
    value_type: string,
};

export type PayPeriodSettingT = {
    id: string | number,
    company_id: string | number,
    days_to_pay_after_cut_off: string | number,
    preset_name?: string,
    time_period_preset_reference: string,
    monthly_pay_period: string,
    semimonthly_pay_period: string,
}

export type PayPeriodPresetSelectionT = {
    value: string,
    text: string | number,
    monthly_period: string,
    semimonthly_period: string,
}