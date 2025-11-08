
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const  SUBSCRIPTION_MODULE: NumericEnumInterface = {
    HR_PAYROLL : 100,
    INVENTORY : 100,
    FINANCE_ACCOUNTING : 100,
}

export const  SUBSCRIPTION_MODULE_NAME: StringEnumInterface = {
    [SUBSCRIPTION_MODULE.HR_PAYROLL as number] : 'HR & Payroll',
    [SUBSCRIPTION_MODULE.INVENTORY as number] : 'Inventory',
    [SUBSCRIPTION_MODULE.FINANCE_ACCOUNTING as number] : 'Finance & Accounting',
}