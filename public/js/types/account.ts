
import type {EnumOption} from "@/public/js/common/type";
import type {TableRowT} from "@/public/js/types/data";

export type AccountSubscriptionT = {
    id: number,
    module: EnumOption,
    plan: EnumOption,
    date_subscribed: string,
}

export type AccountSubscriptionFormT = {
    id?: number,
    account_id: number | null,
    module: number | null,
    plan: number | null,
}

export type AccountT = TableRowT & {
    id: number,
    ulid: string,
    number: string,
    email: string,
    date_registered: string,
    subscriptions: AccountSubscriptionT[]
}