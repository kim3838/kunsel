
import type {Enum} from "@/public/js/common/type";
import type {SequenceableTableRow} from "@/public/js/types/data";

export type CompanyPayrollComponent = {
    id: string | number,
    name: string,
    type: Enum,
    assignable: boolean,
    formula: string | null,
    start_date: string | null,
    end_date: string | null,
}

export type SequenceableCompanyPayrollComponent = CompanyPayrollComponent & SequenceableTableRow;