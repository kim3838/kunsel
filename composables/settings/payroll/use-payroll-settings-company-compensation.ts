
import type {Enum} from "@/public/js/common/type";

export interface Sequenceable {
    order: number
}

export type companyPayrollComponent = Sequenceable & {
    id: number,
    name: string,
    type: Enum,
    assignable: boolean,
    formula: string | null,
}