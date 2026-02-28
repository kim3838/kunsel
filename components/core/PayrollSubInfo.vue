<template>
    <div class="mt-6 space-y-6">
        <div v-if="isDefault" class="flex flex-row flex-wrap gap-6 items-center">
            <div>
                <InputLabel :size="'sm'" value="Status"/>
                <div class="label-value text-base font-sans">{{payroll.status?.text}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Payroll month"/>
                <div class="label-value text-base font-sans">{{`${payroll.year} ${payroll.month_readable}`}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Payroll sequence"/>
                <div class="label-value text-base font-sans">{{`${payroll.pay_frequency?.text} ${payroll.frequency_sequence?.text || ''}`}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Coverage"/>
                <div class="label-value text-base font-sans">{{payroll.date_range_readable}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Employee"/>
                <div class="label-value text-base font-sans">{{salaryStatement?.employee_number}} {{salaryStatement?.employee_full_name}}</div>
            </div>
        </div>
        <div v-if="isDefault" class="flex flex-row flex-wrap gap-6 items-center">
            <div>
                <InputLabel :size="'sm'" value="Days"/>
                <div class="label-value text-base font-sans">{{salaryStatement.total_days}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Day offs"/>
                <div class="label-value text-base font-sans">{{salaryStatement.total_day_offs}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Work days"/>
                <div class="label-value text-base font-sans">{{salaryStatement.total_working_days}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Working rest days"/>
                <div class="label-value text-base font-sans">{{salaryStatement.total_working_rest_days}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Regular work days"/>
                <div class="label-value text-base font-sans">{{salaryStatement.total_regular_work_days}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Legal holidays"/>
                <div class="label-value text-base font-sans">{{salaryStatement.total_legal_holidays}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Double holidays"/>
                <div class="label-value text-base font-sans">{{salaryStatement.total_double_holidays}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Special holidays"/>
                <div class="label-value text-base font-sans">{{salaryStatement.total_special_holidays}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Full presents"/>
                <div class="label-value text-base font-sans">{{salaryStatement.total_full_present}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Presents with irregulartities"/>
                <div class="label-value text-base font-sans">{{salaryStatement.total_present_with_irregularity}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Leave with pay"/>
                <div class="label-value text-base font-sans">{{salaryStatement.total_leave_with_pay}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Leave without pay"/>
                <div class="label-value text-base font-sans">{{salaryStatement.total_leave_without_pay}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Absent"/>
                <div class="label-value text-base font-sans">{{salaryStatement.total_absent}}</div>
            </div>
        </div>
        <div v-if="isAdminOverview" class="flex flex-row flex-wrap gap-x-6 gap-y-2 items-center">
            <div>
                <InputLabel :size="'sm'" value="Status"/>
                <div class="label-value text-base font-sans">{{payroll.status?.text}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Remarks"/>
                <div class="label-value text-base font-sans">{{payroll.remarks || '--'}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Payroll month"/>
                <div class="label-value text-base font-sans">{{`${payroll.year} ${payroll.month_readable}`}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Payroll sequence"/>
                <div class="label-value text-base font-sans">{{`${payroll.pay_frequency?.text} ${payroll.frequency_sequence?.text || ''}`}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Coverage"/>
                <div class="label-value text-base font-sans">{{payroll.date_range_readable}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Total employer contribution share"/>
                <div class="label-value text-base text-right font-medium font-sans">{{payroll.total_employer_contribution_share}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Total tax withheld"/>
                <div class="label-value text-base text-right font-medium font-sans">{{payroll.total_tax_withheld}}</div>
            </div>
            <div>
                <InputLabel :size="'sm'" value="Total net due"/>
                <div class="label-value text-base text-right font-medium font-sans">{{payroll.total_net}}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {PayrollT, SalaryStatementT} from "~/public/js/types/payroll";

const props = defineProps({
    type: {
        type: Number,
        default: PAYROLL_SUB_INFO_TYPE.DEFAULT,
    },
    payroll: {
        type: Object as PropType<PayrollT>,
        default: () => {
            return {};
        }
    },
    salaryStatement: {
        type: Object as PropType<SalaryStatementT>,
        default: () => {
            return {};
        }
    }
});

const isDefault = computed(() => props.type === PAYROLL_SUB_INFO_TYPE.DEFAULT);
const isAdminOverview = computed(() => props.type === PAYROLL_SUB_INFO_TYPE.ADMIN_OVERVIEW);
</script>

<style scoped>

</style>