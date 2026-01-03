
import type {EnumOption} from "@/public/js/common/type";
import type {SequenceableTableRow, TableRowT} from "@/public/js/types/data";

export type CompanyPayrollComponent = {
    id: string | number,
    name: string,
    type: EnumOption,
    assignable: boolean,
    formula: string | null,
}

export type SequenceablePayrollComponent = CompanyPayrollComponent & SequenceableTableRow;

export type EmployeePayrollComponentT = TableRowT & {
    id: number,
    employee_id: number,
    payroll_componentable_type: string,
    payroll_componentable_id: number,
    formulable_type: EnumOption,
    payroll_componentable: {
        name: string,
        type: EnumOption
    },
    amount: string,
    currency: string,
    pay_period: EnumOption,
    pay_type: EnumOption,
    pay_frequency_id: number,
    pay_frequency: EnumOption,
    amountable_start?: EnumOption,
    start_date?: string,
    amountable_end?: EnumOption,
    end_date?: string,
}