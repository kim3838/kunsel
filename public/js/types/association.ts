
import type {Enum, EnumOption} from "@/public/js/common/type";

export interface AssignedCompanyPayloadT {
    ulid: string,
    assignment_type?: Enum,
    is_employee?: boolean,
    currency: string,
    timezone: string,
    account: {
        id: number,
        ulid: string,
        subscriptions: EnumOption[]
    }
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

export type SelectedAccountSubscriptionT = string | number | null;

export interface AccountSubscriptionT {
    selection: EnumOption[];
    selected: SelectedAccountSubscriptionT,
}

export interface StoreAccountSubscriptionT extends AccountSubscriptionT {
    search: string;
}