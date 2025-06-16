
import moment from "moment";

export interface MomentPlugin {
    $moment: typeof moment;
}

declare module '#app' {
    interface NuxtApp extends MomentPlugin {}
}

declare module 'vue' {
    interface ComponentCustomProperties extends MomentPlugin {}
}

export type Enum = {
    label: string,
    value: number
}

export interface ErrorPayloadInterface {
    message: string | null,
    [key: string]: any;
}

export type ServiceErrorT = {
    prompt: boolean,
    icon: string | null,
    title: string | null,
    payload: ErrorPayloadInterface | null
}

export type SessionAgentT = {
    is_desktop: boolean,
    platform: string,
    browser: string
}

export type BrowserSessionT = {
    agent: SessionAgentT,
    ip_address: string,
    is_current_device: boolean,
    last_active: string
}

export type StoreFormT = {
    filters: {
        date: string,
        dateTime: string,
        monthValue: string,
        monthLabel: string,
    }
}

export type PromptT = {
    icon: string | null;
    title: string | null;
    message: string | null;
    messageList?: string[];
    action: {
        callback: (() => void) | null;
        label: string;
    };
};

export type ConditionT = {
    subject: string,
    operator: string,
    value: string | number | null,
}