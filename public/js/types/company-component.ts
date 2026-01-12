
import type {ConditionT, EnumOption} from "@/public/js/common/type";
import type {SequenceableTableRow} from "@/public/js/types/data";

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

export type SalaryStatementModuleT = SequenceableTableRow & {
    id: string | number,
    company_id: string | number,
    formulable_type: EnumOption,
    name: string,
    reference: string,
    conditions: ConditionT[]
}

export type BasicSalaryStatementModuleT = SequenceableTableRow & {
    id: string | number,
    company_id: string | number,
    formulable_type: string,
    name: string,
}