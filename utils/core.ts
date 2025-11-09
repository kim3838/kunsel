
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const  SUBSCRIPTION_MODULE: NumericEnumInterface = {
    HR_PAYROLL : 100,
    INVENTORY : 200,
    FINANCE_ACCOUNTING : 300,
}

export const  SUBSCRIPTION_MODULE_NAME: StringEnumInterface = {
    [SUBSCRIPTION_MODULE.HR_PAYROLL as number] : 'HR & Payroll',
    [SUBSCRIPTION_MODULE.INVENTORY as number] : 'Inventory',
    [SUBSCRIPTION_MODULE.FINANCE_ACCOUNTING as number] : 'Finance & Accounting',
}