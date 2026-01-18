
import type {SequenceableTableRow} from "@/public/js/types/data";
import type {EnumOption} from "@/public/js/common/type";

export type ApprovalSettingApproverT = SequenceableTableRow & {
    id?: number | null,
    approval_setting_id: number | null,
    type?: EnumOption,
    type_value: number,
    approver_id: number | null,
    approver_username?: string,

    company_id?: number,
    company_name?: string,
    company_assignment_type?: EnumOption,
    is_employee?: boolean,
    company_employee_number?: string,
    company_employee_full_name?: string,

    account_roles_summary?: {
        value: string,
        extender: string
    },
}

export type ApprovalSettingT = {
    id: string | number,
    company_id: string | number,
    request_title: string,
    approvers: ApprovalSettingApproverT[],
}