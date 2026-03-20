<template>
    <div class="space-y-6">
        <div v-if="isDefault" class="flex flex-row flex-wrap gap-6 items-center">
            <div>
                <InputLabel :size="'sm'" value="Status"/>
                <div class="flex items-center">
                    <Label :size="'md'" :type="payrollStatusShade" shade :label="payroll.status?.text" />
                </div>
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
                <InputLabel :size="'sm'" value="Employee"/>
                <div class="label-value text-base font-data font-medium">({{salaryStatement?.employee_number}}) {{salaryStatement?.employee_full_name}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Statement Type"/>
                <div class="flex items-center">
                    <Label :size="'md'" :type="'clear'" shade :label="salaryStatement?.type?.text" />
                </div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Paid"/>
                <div class="label-value text-base font-data font-medium">{{salaryStatement?.is_paid ? 'Yes' : 'No'}}</div>
            </div>
        </div>
        <div v-if="isDefault" class="flex flex-row flex-wrap gap-6 items-center">
            <div>
                <InputLabel :size="'sm'" value="Days"/>
                <div class="label-value text-base font-data font-medium">{{salaryStatement.total_days}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Day offs"/>
                <div class="label-value text-base font-data font-medium">{{salaryStatement.total_day_offs}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Work days"/>
                <div class="label-value text-base font-data font-medium">{{salaryStatement.total_working_days}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Working rest days"/>
                <div class="label-value text-base font-data font-medium">{{salaryStatement.total_working_rest_days}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Regular work days"/>
                <div class="label-value text-base font-data font-medium">{{salaryStatement.total_regular_work_days}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Legal holidays"/>
                <div class="label-value text-base font-data font-medium">{{salaryStatement.total_legal_and_double_holidays}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Special holidays"/>
                <div class="label-value text-base font-data font-medium">{{salaryStatement.total_special_holidays}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Full presents"/>
                <div class="label-value text-base font-data font-medium">{{salaryStatement.total_full_present}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Presents with irregularities"/>
                <div class="label-value text-base font-data font-medium">{{salaryStatement.total_present_with_irregularity}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Leave with pay"/>
                <div class="label-value text-base font-data font-medium">{{salaryStatement.total_leave_with_pay}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Leave without pay"/>
                <div class="label-value text-base font-data font-medium">{{salaryStatement.total_leave_without_pay}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Absent"/>
                <div class="label-value text-base font-data font-medium">{{salaryStatement.total_absent}}</div>
            </div>
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
                    <Label :size="'md'" :type="'clear'" shade :label="payroll.total_employer_contribution_share" />
                </div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Total tax withheld"/>
                <div class="flex items-center">
                    <Label :size="'md'" :type="'clear'" shade :label="payroll.total_withholding_tax" />
                </div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Total net due"/>
                <div class="flex items-center">
                    <Label :size="'md'" :type="'clear'" shade :label="payroll.total_net" />
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