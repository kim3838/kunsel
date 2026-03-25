<template>
    <div class="space-y-6">
        <div v-if="isDefault" class="space-x-12 space-y-6">
            <table class="inline-flex border-separate">
                <tbody>
                <tr>
                    <td class="">Status:</td>
                    <td class="pl-2">
                        <div class="flex items-center">
                            <Label :size="'md'" :type="payrollStatusShade" shade :label="payroll.status?.text" />
                        </div>
                    </td>
                </tr>
                <tr><td class="">Payroll month:</td>  <td class="pl-2 label-value">{{`${payroll.year} ${payroll.month_readable}`}}</td></tr>
                <tr><td class="">Sequence:</td>       <td class="pl-2 label-value">{{`${payroll.pay_frequency?.text} ${payroll.frequency_sequence?.text || ''}`}}</td></tr>
                <tr><td class="">Period:</td>         <td class="pl-2 label-value">{{payroll.date_range_readable}}</td></tr>
                </tbody>
            </table>

            <table class="inline-flex border-separate">
                <tbody>
                <tr><td class="">Employee:</td><td class="pl-2 label-value">({{salaryStatement?.employee_number}}) {{salaryStatement?.employee_full_name}}</td></tr>
                <tr><td class="">Department:</td><td class="pl-2 label-value">{{salaryStatement?.employee_department?.name}}</td></tr>
                <tr><td class="">Designation:</td><td class="pl-2 label-value">{{salaryStatement?.employee_designation?.name}}</td></tr>
                <tr>
                    <td class="">Statement Type:</td>
                    <td class="pl-2">
                        <div class="flex items-center">
                            <Label :size="'md'" :type="'clear'" shade :label="salaryStatement?.type?.text" />
                        </div>
                    </td>
                </tr>
                <tr><td class="">Paid:</td><td class="pl-2 label-value">{{salaryStatement?.is_paid ? 'Yes' : 'No'}}</td></tr>
                </tbody>
            </table>

            <table class="inline-flex border-separate">
                <tbody>
                <tr><td class="">Days:</td>                 <td class="pl-2 label-value">{{salaryStatement.total_days}}</td></tr>
                <tr><td class="">Day offs:</td>             <td class="pl-2 label-value">{{salaryStatement.total_day_offs}}</td></tr>
                <tr><td class="">Work days:</td>            <td class="pl-2 label-value">{{salaryStatement.total_working_days}}</td></tr>
                <tr><td class="">Working rest days:</td>    <td class="pl-2 label-value">{{salaryStatement.total_working_rest_days}}</td></tr>
                </tbody>
            </table>

            <table class="inline-flex border-separate">
                <tbody>
                <tr><td class="">Regular work days:</td>    <td class="pl-2 label-value">{{salaryStatement.total_regular_work_days}}</td></tr>
                <tr><td class="">Legal holidays:</td>       <td class="pl-2 label-value">{{salaryStatement.total_legal_holidays}}</td></tr>
                <tr><td class="">Double holidays:</td>      <td class="pl-2 label-value">{{salaryStatement.total_double_holidays}}</td></tr>
                <tr><td class="">Special holidays:</td>     <td class="pl-2 label-value">{{salaryStatement.total_special_holidays}}</td></tr>
                </tbody>
            </table>

            <table class="inline-flex border-separate">
                <tbody>
                <tr><td class="">Full presents:</td>                    <td class="pl-2 label-value">{{salaryStatement.total_full_present}}</td></tr>
                <tr><td class="">Presents with irregularities:</td>     <td class="pl-2 label-value">{{salaryStatement.total_present_with_irregularity}}</td></tr>
                <tr><td class="">Leave with pay:</td>                   <td class="pl-2 label-value">{{salaryStatement.total_leave_with_pay}}</td></tr>
                <tr><td class="">Leave without pay:</td>                <td class="pl-2 label-value">{{salaryStatement.total_leave_without_pay}}</td></tr>
                <tr><td class="">Absent:</td>                           <td class="pl-2 label-value">{{salaryStatement.total_absent}}</td></tr>
                </tbody>
            </table>
        </div>
        <div v-if="isAdminOverview" class="flex flex-row flex-wrap gap-x-6 gap-y-2 items-center">
            <div>
                <InputLabel :size="'sm'" value="Status"/>
                <div class="flex items-center">
                    <Label :size="'md'" :type="payrollStatusShade" shade :label="payroll.status?.text" />
                </div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Remarks"/>
                <div class="label-value text-base font-data font-medium">{{payroll.remarks || '--'}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Payroll month"/>
                <div class="label-value text-base font-data font-medium">{{`${payroll.year} ${payroll.month_readable}`}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Sequence"/>
                <div class="label-value text-base font-data font-medium">{{`${payroll.pay_frequency?.text} ${payroll.frequency_sequence?.text || ''}`}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Period"/>
                <div class="label-value text-base font-data font-medium">{{payroll.date_range_readable}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Total employer contr. share"/>
                <div class="flex items-center">
                    <Label :size="'md'" :type="'clear'" shade :label="payroll.total_employer_contribution_share_formatted" />
                </div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Total tax withheld"/>
                <div class="flex items-center">
                    <Label :size="'md'" :type="'clear'" shade :label="payroll.total_withholding_tax_formatted" />
                </div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Total tax refund"/>
                <div class="flex items-center">
                    <Label :size="'md'" :type="'clear'" shade :label="payroll.total_tax_refund_formatted" />
                </div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Total net due"/>
                <div class="flex items-center">
                    <Label :size="'md'" :type="'clear'" shade :label="payroll.total_net_formatted" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {PayrollT, SalaryStatementT} from "@/public/js/types/payroll";
import type {LabelTypeT} from "@/public/js/types/theme";

const props = defineProps({
    type: {
        type: Number,
        default: PAYROLL_SUB_INFO_TYPE.DEFAULT,
    },
    payroll: {
        type: Object as PropType<Partial<PayrollT>>,
        default: () => ({}),
    },
    salaryStatement: {
        type: Object as PropType<Partial<SalaryStatementT>>,
        default: () => ({}),
    }
});

const isDefault = computed(() => props.type === PAYROLL_SUB_INFO_TYPE.DEFAULT);
const isAdminOverview = computed(() => props.type === PAYROLL_SUB_INFO_TYPE.ADMIN_OVERVIEW);

const payrollStatusShade = computed<LabelTypeT>(() => {
    return {
        [PAYROLL_STATUS.DRAFT as number]: 'clear',
        [PAYROLL_STATUS.WORKFLOW_IN_PROGRESS as number]: 'info',
        [PAYROLL_STATUS.COMPLETED as number]: 'success',
    }[props.payroll.status?.value] as LabelTypeT;
})
</script>

<style scoped>

</style>