<template>
    <div>
        <BreadCrumbs prefix-company :size="`sm`" :extender="[{name: `Hr & Payroll Dashboard`}]" />

        <div class="space-y-4 mt-6">

            <div class="flex flex-row flex-wrap gap-4">

                <div class="flex-auto lining-shadow rounded-sm tint-background p-4 min-w-max flex flex-col items-start gap-2">
                    <div class="flex flex-col items-start justify-start gap-2">
                        <div class="font-header text-lg">Recent payroll</div>

                        <div class="flex flex-row gap-1 items-start">
                            <Label v-if="recentPayroll.payroll" :size="'md'" :type="recentPayroll?._payload?.label_shade?.value as LabelTypeT" shade :label="recentPayroll.payroll?.status?.text" />
                            <Label v-else :size="'md'" :type="'clear'" shade :label="'Not found'" />

                            <div>
                                <div>{{recentPayroll.summary}}</div>
                                <div class="text-sm subtitle-color font-numeric">{{recentPayroll.date_range_readable}}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex-auto lining-shadow rounded-sm tint-background p-4 min-w-max flex flex-col items-start gap-2">
                    <div class="flex flex-col items-start justify-start gap-2">
                        <div class="font-header text-lg">Current payroll</div>

                        <div class="flex flex-row gap-1 items-start">
                            <Label v-if="currentPayroll.payroll" :size="'md'" :type="currentPayroll?._payload?.label_shade?.value as LabelTypeT" shade :label="currentPayroll.payroll?.status?.text" />
                            <Label v-else :size="'md'" :type="'clear'" shade :label="'Not found'" />

                            <div>
                                <div>{{currentPayroll.summary}}</div>
                                <div class="text-sm subtitle-color font-numeric">{{currentPayroll.date_range_readable}}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-for="request in totalPendingRequestsMap" class="flex-auto lining-shadow rounded-sm tint-background p-4 min-w-12 min-h-20 flex flex-col items-center justify-center">
                    <div>
                        <div class="font-header text-lg">{{request.title}}</div>
                        <div class="text-sm subtitle-color text-center">{{request.subtitle}}</div>
                    </div>
                    <UnorderedList
                        v-if="pendingApprovalStateTotalsPending"
                        :icon="'eos-icons:loading'"
                        :size="'lg'"
                        :label="''"/>
                    <div v-else class="text-2xl font-medium font-numeric">{{request.count}}</div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <!-- UR -->
                <div class="lining-shadow rounded-sm grow tint-background">
                    <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                        <div class="font-header text-lg">My Requests</div>
                    </div>

                    <div class="p-4 max-h-[408px] overflow-y-auto">

                        <UserFiledRequest/>
                    </div>
                </div>

                <!-- AP -->
                <div class="lining-shadow rounded-sm grow tint-background">
                    <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                        <div class="font-header text-lg">Awaiting my approval</div>
                    </div>

                    <div class="p-4 max-h-[408px] overflow-y-auto">
                        <UserAwaitingApproval @workflowUpdated="pendingApprovalStateTotalsExecute"/>
                    </div>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4">

                <div class="basis-full md:basis-1/2 lg:basis-4/11">

                    <!-- LT UL -->
                    <LeaveTodayAndUpcoming class="flex flex-col gap-4"/>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {PayrollInquiryT} from "@/public/js/types/payroll";
import type {TableRowT} from "@/public/js/types/data";
import type {LabelTypeT} from "@/public/js/types/theme";
import {useLocalStorage} from "@vueuse/core";

const {isAuthenticated, userIsSuperAdmin} = useAuth();
const user = userState();
const userCompanyEmployee = userCompanyEmployeeState();
const nuxtApp = useNuxtApp();
const userIsEmployeeOfSelectedCompany = userIsEmployeeOfSelectedCompanyState();
const userIsAdminOfSelectedCompany = userIsAdminOfSelectedCompanyState();
const {
    updatedAssociatedCompanyFlag,
    updatedAssociatedAccountSubscriptionFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAccountSubscription,
    selectedAccountSubscriptionValue,
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompany,
    selectedAssociatedCompanyId,
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && userIsAdminOfSelectedCompany.value && selectedAssociatedCompanyId.value){
        pendingApprovalStateTotalsExecute();
        payrollInquiriesExecute();
    }
});

const totalPendingRequestsMap = computed(() => {

    return [
        {
            title: 'Payroll workflow in progress',
            subtitle: 'Pending payroll approval',
            count: totalPendingPayroll.value,
        },
        {
            title: 'Attendance adjust request',
            subtitle: 'Pending attendance adjust approval',
            count: totalPendingAttendanceAdjustment.value,
        },
        {
            title: 'Overtime request',
            subtitle: 'Pending overtime approval',
            count: totalPendingOvertime.value,
        },
        {
            title: 'Leave request',
            subtitle: 'Pending leave approval',
            count: totalPendingLeave.value,
        }
    ];
})
const totalPendingAttendanceAdjustment = ref(0);
const totalPendingOvertime = ref(0);
const totalPendingLeave = ref(0);
const totalPendingPayroll = ref(0);

const pendingApprovalStateTotalsPending = ref(false);
const pendingApprovalStateTotalsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    totalPendingAttendanceAdjustment.value = 0;
    totalPendingOvertime.value = 0;
    totalPendingLeave.value = 0;
    totalPendingPayroll.value = 0;
    pendingApprovalStateTotalsPending.value = true;

    await laraFetch(`/api/pending-approval-state-totals`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            filters: {
                account_id: selectedAssociatedCompanyAccountId.value,
                associated_companies: [selectedAssociatedCompanyId.value],
                show_only_current_state: true
            }
        }
    }, {
        onRequestError: () => {
            pendingApprovalStateTotalsPending.value = false;
        },
        onResponse: (request, options, response) => {
            pendingApprovalStateTotalsPending.value = false;

        },
        onSuccessResponse: async (request, options, response) => {
            let pendingTotals = _get(response, '_data.values.totals', {});

            totalPendingAttendanceAdjustment.value = _get(pendingTotals, 'attendance_adjustment', 0);
            totalPendingOvertime.value = _get(pendingTotals, 'overtime', 0);
            totalPendingLeave.value = _get(pendingTotals, 'leave', 0);
            totalPendingPayroll.value = _get(pendingTotals, 'payroll', 0);
        }
    }, false);
}
pendingApprovalStateTotalsExecute();

const generateFrequency = useLocalStorage('generate-frequency', PAY_FREQUENCY_TYPE.MONTHLY)
const payFrequency = ref(generateFrequency.value);
const recentCount = ref(1);
const recentPayroll = ref<Partial<PayrollInquiryT>>({});
const currentPayroll = ref<Partial<PayrollInquiryT>>({});
const payrollInquiriesPending = ref(false)

const payrollInquiriesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    payrollInquiriesPending.value = true;

    await laraFetch(`/api/payroll-inquiry`, {
        method: 'GET',
        params: {
            company_id: selectedAssociatedCompanyId.value,
            recent_count: recentCount.value,
            filters: {
                pay_frequency_types: [payFrequency.value]
            }
        }
    }, {
        onRequestError: () => {
            payrollInquiriesPending.value = false;
        },
        onResponse: () => {
            payrollInquiriesPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            //@ts-ignore
            recentPayroll.value = _get(response, '_data.values.recent', []).map((payrollPayload: TableRowT) => {

                let statusSummary = _get(payrollPayload, 'payroll.status.value', 0);

                let shade = 'clear';

                if(statusSummary == PAYROLL_STATUS.DRAFT){
                    shade = 'clear';
                } else if(statusSummary == PAYROLL_STATUS.WORKFLOW_IN_PROGRESS){
                    shade = 'info';
                } else if(statusSummary == PAYROLL_STATUS.COMPLETED){
                    shade = 'success';
                } else if(statusSummary == PAYROLL_STATUS.GENERATING){
                    shade = 'caution';
                }

                let isSelectable = [PAYROLL_STATUS.DRAFT].indexOf(statusSummary) >= 0;

                return {
                    isSelectable: isSelectable || payrollPayload.payroll == null,
                    ...payrollPayload,
                    _payload: {
                        'label_shade': {
                            'cell': ['payroll_status'],
                            'value': shade
                        }
                    }
                };
            })[0];
            //@ts-ignore
            currentPayroll.value = _get(response, '_data.values.current', []).map((payrollPayload: TableRowT) => {

                let statusSummary = _get(payrollPayload, 'payroll.status.value', 0);

                let shade = 'clear';

                if(statusSummary == PAYROLL_STATUS.DRAFT){
                    shade = 'clear';
                } else if(statusSummary == PAYROLL_STATUS.WORKFLOW_IN_PROGRESS){
                    shade = 'info';
                } else if(statusSummary == PAYROLL_STATUS.COMPLETED){
                    shade = 'success';
                } else if(statusSummary == PAYROLL_STATUS.GENERATING){
                    shade = 'caution';
                }

                let isSelectable = [PAYROLL_STATUS.DRAFT].indexOf(statusSummary) >= 0;

                return {
                    isSelectable: isSelectable || payrollPayload.payroll == null,
                    ...payrollPayload,
                    _payload: {
                        'label_shade': {
                            'cell': ['payroll_status'],
                            'value': shade
                        }
                    }
                };
            })[0];
        }
    }, true);
}
await payrollInquiriesExecute();
</script>

<style scoped>

</style>