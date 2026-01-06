
import type {NumericEnumInterface, StringEnumInterface} from "@/public/js/common/type";

export const  SUBSCRIPTION_PLAN: NumericEnumInterface = {
    STANDARD : 100,
    BUSINESS : 500,
}

export const  SUBSCRIPTION_PLAN_NAME: StringEnumInterface = {
    [SUBSCRIPTION_PLAN.STANDARD as number] : 'Standard',
    [SUBSCRIPTION_PLAN.BUSINESS as number] : 'Business',
}

export const  SUBSCRIPTION_MODULE: NumericEnumInterface = {
    EMPLOYEE_PORTAL : 50,
    HR_PAYROLL : 100,
    INVENTORY : 200,
    FINANCE_ACCOUNTING : 300,
}

export const SUBSCRIPTION_MODULE_NAME: StringEnumInterface = {
    [SUBSCRIPTION_MODULE.EMPLOYEE_PORTAL as number] : 'Employee Portal',
    [SUBSCRIPTION_MODULE.HR_PAYROLL as number] : 'HR & Payroll',
    [SUBSCRIPTION_MODULE.INVENTORY as number] : 'Inventory',
    [SUBSCRIPTION_MODULE.FINANCE_ACCOUNTING as number] : 'Finance & Accounting',
}

export const SUBSCRIPTION_MODULE_ROUTE_NAME: StringEnumInterface = {
    [SUBSCRIPTION_MODULE.EMPLOYEE_PORTAL as number] : 'employee-portal',
    [SUBSCRIPTION_MODULE.HR_PAYROLL as number] : 'hr-payroll',
    [SUBSCRIPTION_MODULE.INVENTORY as number] : 'inventory',
    [SUBSCRIPTION_MODULE.FINANCE_ACCOUNTING as number] : 'finance-accounting',
}