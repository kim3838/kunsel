
import type {Enum} from "@/public/js/common/type";

export type AssignedCompanyT = {
    text: string;
    value: number;
    assignment_type: Enum
}

export type SelectedCompanyT = string | number | null;

export interface AssociatedCompanyT {
    selection: AssignedCompanyT[],
    selected: SelectedCompanyT
}

export interface StoreAssociatedCompanyT extends AssociatedCompanyT {
    search: string;
    data: AssignedCompanyT[];
}