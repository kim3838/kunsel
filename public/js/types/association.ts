
import type {Enum} from "@/public/js/common/type";

export interface AssignedCompanyPayloadT {
    assignment_type?: Enum,
    currency: string,
    timezone: string
}

export type AssignedCompanyT = {
    text: string;
    value: number;
    payload: AssignedCompanyPayloadT,
}

export type SelectedCompanyT = string | number | null;

export interface AssociatedCompanyT {
    selection: AssignedCompanyT[];
    selected: SelectedCompanyT,
}

export interface StoreAssociatedCompanyT extends AssociatedCompanyT {
    search: string;
}