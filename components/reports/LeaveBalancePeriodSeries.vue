<template>
    <div class="px-[20px]">
        <form @submit.prevent="balancePeriodSeriesExecute()" class="space-y-2 pb-[20px]">
            <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                <div class="col-span-4 md:col-span-3 lg:col-span-2">
                    <InputLabel :size="'sm'" value="Employee"/>
                    <SingleSelectPaginated
                        :key="employeeOptionsKey"
                        :disabled="disableActions"
                        drop-shadow
                        value-persist
                        :selection-max-viewable-line="10"
                        :label="'Select Employee'"
                        :size="'md'"
                        :icon="'mdi:badge-account-outline'"
                        :payload="employeeOptions"
                        @valueChange="selectedEmployeeChanged"/>
                </div>
                <div class="col-span-4 md:col-span-3 lg:col-span-2">
                    <InputLabel :size="'sm'" value="Leave Type"/>
                    <SingleSelectPaginated
                        :key="assignedLeaveTypeSelectionsOptionsKey"
                        :disabled="disableActions || !employeeOptions.selected"
                        drop-shadow
                        value-persist
                        :selection-max-viewable-line="10"
                        :label="'Select Assigned Leave Type'"
                        :icon="'tdesign:component-checkbox'"
                        :size="'md'"
                        :payload="assignedLeaveTypeSelectionsOptions"
                        @valueChange="selectedLeaveTypeChanged"/>
                </div>
                <div class="col-span-2 sm:col-span-1">
                    <InputLabel :size="'sm'" value="Up to date"/>
                    <InputWithIcon
                        :disabled="disableActions"
                        high-light-all-text-on-focus
                        v-model="uptoDate"
                        :override="{font_family_class: 'font-sans'}"
                        :icon="'mdi:calendar-cursor-outline'"
                        :id="`up_to_date`"
                        :size="'md'"/>
                </div>
                <div class="flex flex-col">
                    <div class="flex-none h-[1.25rem]"></div>
                    <div class="grow">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                    </div>
                </div>
            </div>
        </form>

        <div class="space-y-2">
            <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                <UnorderedList
                    v-if="balancePeriodSeriesPending"
                    :icon="'eos-icons:loading'"
                    :size="'md'"
                    :label="'Please wait...'"/>
                <Label
                    v-if="!balancePeriodSeriesPending && balancePeriodSeriesSuccessful && !disableActions && upToDateMessage.show"
                    invert :size="'md'" :type="'info'" :label="upToDateMessage.message" />
                <Label
                    v-if="!balancePeriodSeriesPending && !balancePeriodSeriesSuccessful"
                    invert :size="'md'" :type="'danger'" :label="balancePeriodSeriesMessage" />
            </div>

            <div v-if="!balancePeriodSeriesPending && showBalancePeriodSeries" class="space-y-2 overflow-x-scroll">

                <div v-for="periodSeries in balancePeriodSeries">

                    <table class="period-series-table">
                        <tbody>
                        <tr class="font-semibold">
                            <td class="px-[2px]">Period</td>
                            <td class="px-[2px]" v-for="yearMonthSeries in periodSeries.value">{{yearMonthSeries.period}}</td>
                        </tr>
                        <tr class="">
                            <td class="px-[2px] font-semibold">Year</td>
                            <td class="px-[2px]" v-for="yearMonthSeries in periodSeries.value">{{yearMonthSeries.year}}</td>
                        </tr>
                        <tr class="">
                            <td class="px-[2px] font-semibold">Month</td>
                            <td class="px-[2px]" v-for="yearMonthSeries in periodSeries.value">{{yearMonthSeries.month_readable}}</td>
                        </tr>
                        <tr>
                            <td>
                                <div class="employment-series-header flex flex-col">
                                    <div class="px-[2px] font-semibold">Employment Type</div>
                                    <div class="px-[2px] font-semibold">Eligible</div>
                                    <div class="px-[2px] font-semibold">Calendar Day</div>
                                    <div class="px-[2px] font-semibold">Running Balance</div>
                                </div>
                            </td>
                            <td v-for="yearMonthSeries in periodSeries.value" class="">
                                <div class="employment-series-grid flex">
                                    <div class="w-full" v-for="employmentSeries in yearMonthSeries.value">
                                        <div class="px-[2px]">{{employmentSeries.type.text}}</div>
                                        <div class="px-[2px]">
                                            <Label shade :size="'sm'" :type="employmentSeries.eligible ? 'success' : 'default'" :label="employmentSeries.eligible ? 'Eligible' : 'Ineligible'" />
                                        </div>
                                        <div class="date-series-grid flex font-sans">
                                            <div class="w-full" v-for="dateSeries in employmentSeries.value">
                                                <div>{{ordinal(dateSeries.day)}}</div>
                                                <div>{{dateSeries.running_balance}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {SelectDataType} from "@/public/js/types/form";
import type {LeaveBalancePeriodSeriesT} from "@/public/js/types/leave";
import {storeToRefs} from "pinia";

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const ordinal = nuxtApp.$ordinal as (num: number | string) => string;
const {$themeStore} = useNuxtApp();
const $moment = nuxtApp.$moment;
const {render} = dateTimePicker();
const clientReadyState = useClientReadyState();
const common = useCommon();
const coreStore = useCoreStore();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

const {
    lining: liningColor,
    thread: threadColor,
} = storeToRefs($themeStore);

watch(updatedAssociatedCompanyFlag, async (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        rebuildSelections();
        reset();
        showBalancePeriodSeries.value = false;
    }
})

const rebuildSelections = (selection: string[] = []) => {

    if(_isEmpty(selection) || selection.indexOf('employee') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employeeOptions, employeeOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }

    if(_isEmpty(selection) || selection.indexOf('assigned_leave_type') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            assignedLeaveTypeSelectionsOptions, assignedLeaveTypeSelectionsOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }
}

const reset = () => {
    employeeOptions.selected = null;
    employeeOptionsKey.value++;
    assignedLeaveTypeSelectionsOptions.fetch.filters.employee_id = null;
    assignedLeaveTypeSelectionsOptions.selected = null;
    assignedLeaveTypeSelectionsOptionsKey.value++;
    upToDateMessage.show = false;
    upToDateMessage.message = '';
}

const employeeOptionsKey = shallowRef(0);
const employeeOptions = reactive({
    fetch: {
        url: '/api/employee-selections',
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: null,
});

const assignedLeaveTypeSelectionsOptionsKey = shallowRef(0);
const assignedLeaveTypeSelectionsOptions = reactive({
    fetch: {
        url: '/api/leave-type-assignment-selections',
        filters: {
            employee_id: employeeOptions.selected as number | null,
            company_id: selectedAssociatedCompanyId.value,
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: null,
});

const showBalancePeriodSeries = ref(false);
const uptoDate = ref($moment().format("YYYY-MM-DD"));
const upToDateMessage = reactive({
    show: false,
    message: ''
});

const selectedEmployeeChanged = (selectedEmployee: SelectDataType) => {

    showBalancePeriodSeries.value = false;
    upToDateMessage.show = false;
    upToDateMessage.message = '';

    if(selectedEmployee){

        assignedLeaveTypeSelectionsOptions.fetch.filters.employee_id = selectedEmployee.value as number;
        assignedLeaveTypeSelectionsOptions.selected = null;
        assignedLeaveTypeSelectionsOptionsKey.value++;
    } else {

        assignedLeaveTypeSelectionsOptions.fetch.filters.employee_id = null;
        assignedLeaveTypeSelectionsOptions.selected = null;
        assignedLeaveTypeSelectionsOptionsKey.value++;
    }
}
const selectedLeaveTypeChanged = () => {

    showBalancePeriodSeries.value = false;
    upToDateMessage.show = false;
    upToDateMessage.message = '';
}

const balancePeriodSeriesPending = ref(false);

const disableActions = computed(() => {
    return balancePeriodSeriesPending.value || companyAssociationPendingState().value;
});

const balancePeriodSeries = ref<LeaveBalancePeriodSeriesT[]>([]);
const balancePeriodSeriesSuccessful = ref(true);
const balancePeriodSeriesMessage = ref('');

const balancePeriodSeriesExecute = async () => {

    showBalancePeriodSeries.value = false;
    upToDateMessage.show = false;
    upToDateMessage.message = '';

    balancePeriodSeriesPending.value = true;
    let leaveBalancePeriodSeriesMinimumDateSuccessResponse = false;

    await laraFetch(`/api/leave-running-balance-period-series-minimum-date`, {
        method: 'POST',
        body: {
            company_id: selectedAssociatedCompanyId.value,
            employee_id: employeeOptions.selected,
            leave_type_id: assignedLeaveTypeSelectionsOptions.selected,
            date: uptoDate.value,
        }
    }, {
        onSuccessResponse: async (request, options, response) => {
            let minimumDate = _get(response, '_data.values.minimum_date', uptoDate.value);

            if(uptoDate.value !== minimumDate){
                upToDateMessage.show = true;
                upToDateMessage.message = 'Up to date adjusted to minimum date.';

                uptoDate.value = minimumDate;
                renderUpToDatePicker();
            }

            leaveBalancePeriodSeriesMinimumDateSuccessResponse = true;
        }
    }, true);

    if(!leaveBalancePeriodSeriesMinimumDateSuccessResponse){

        balancePeriodSeriesPending.value = false;

        coreStore.setServiceError({
            prompt: false,
            payload: {
                message: 'Minimum date not found'
            }
        });

        return;

    } else {

        await laraFetch(`/api/leave-running-balance-period-series`, {
            method: 'GET',
            params: {
                account_id: selectedAssociatedCompanyAccountId.value,
                company_id: selectedAssociatedCompanyId.value,
                employee_id: employeeOptions.selected,
                leave_type_id: assignedLeaveTypeSelectionsOptions.selected,
                up_to_date: uptoDate.value,
            }
        }, {
            onRequestError: () => {
                balancePeriodSeriesPending.value = false;
            },
            onResponse: (request, options, response) => {
                balancePeriodSeriesPending.value = false;
                balancePeriodSeriesSuccessful.value = _get(response, '_data.successful', false);
                balancePeriodSeriesMessage.value = _get(response, '_data.message', '');
            },
            onUnprocessableContentResponse: () => {
                balancePeriodSeriesPending.value = false;
            },
            onSuccessResponse: async (request, options, response) => {
                balancePeriodSeries.value = _get(response, '_data.values.balance_period_series', []);
                showBalancePeriodSeries.value = true;
            }
        }, false);

    }
}

let datePickers = ref([
    {
        id: 'up_to_date',
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            uptoDate.value = payload.value;
        }
    },
]);

const renderUpToDatePicker = () => {
    render(datePickers.value);
}

//Render date time pickers on navigate
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(() => {
            renderUpToDatePicker();
        });
    });
}

//Render date time pickers on load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            renderUpToDatePicker();
        });
    }
})
</script>

<style lang="scss" scoped>
$tableBorder: v-bind(liningColor);
$cellBorder: v-bind(threadColor);

table{
    white-space: nowrap;
    box-sizing: border-box;
    border-top: 0;
}

.period-series-table>thead>tr>td,
.period-series-table>tbody>tr>td {
    border: 1px solid $cellBorder;
}


.employment-series-header>div:not(:last-child){
    border-bottom: 1px solid $cellBorder;
}
.employment-series-grid>div>div:nth-child(1){
    border-bottom: 1px solid $cellBorder;
}
.employment-series-grid>div:not(:first-child){
    border-left: 1px solid $cellBorder;
}


.date-series-grid{
    border-top: 1px solid $cellBorder;
}
.date-series-grid>div:not(:first-child){
    border-left: 1px solid $cellBorder;
}
.date-series-grid>div>div:not(:first-child){
    border-top: 1px solid $cellBorder;
}
.date-series-grid>div>div{
    padding-left: 4px;
    padding-right: 4px;
}
</style>