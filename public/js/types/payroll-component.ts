
import type {EnumOption} from "@/public/js/common/type";
import type {SequenceableTableRow} from "@/public/js/types/data";

export type CompanyPayrollComponent = {
    id: string | number,
    name: string,
    type: EnumOption,
    assignable: boolean,
    formula: string | null,
}

export type SequenceablePayrollComponent = CompanyPayrollComponent & SequenceableTableRow;