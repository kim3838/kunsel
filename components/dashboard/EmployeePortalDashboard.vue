<template>
    <div>
        <div class="flex items-center justify-between">
            <BreadCrumbs prefix-company :size="`sm`" :extender="[{name: `Employee Portal Dashboard`}]" />
            <div class="text-base min-h-8 flex items-center">{{dateTimeNowFormatted}}</div>
        </div>

        <div class="space-y-4 mt-6">

            <div>
                <div class="grid grid-cols-1 gap-y-6 gap-x-0 lg:grid-cols-2 lg:gap-y-0 lg:gap-x-6">

                    <!-- PF -->
                    <div class="space-y-2">
                        <div v-if="employeePendingOrNotSuccessful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                            <UnorderedList v-if="employeePending" :icon="'eos-icons:loading'" :size="'md'" :label="'Loading info...'"/>
                            <Label v-else-if="!employeeSuccessful" invert :size="'md'" :type="'danger'" :label="employeeMessage" />
                        </div>

                        <div v-if="!employeePendingOrNotSuccessful" class="flex flex-col lg:flex-row lg:items-center gap-2">
                            <div>
                                <div class="text-sm font-sans">{{ _get(employee, 'number', '--') }}</div>
                                <span class="text-lg font-medium font-header cursor-pointer hover:underline">{{userCompanyEmployee?.full_name}}</span>
                                <div class="text-sm subtitle-color">
                                    {{ _get(employee, 'designation.name', '--') }}&nbsp;~&nbsp;{{ _get(employee, 'department.name', '--') }}
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-1">
                                <div class="flex-none w-[68px] h-[68px] bg-gray-200">

                                </div>
                                <div class="flex flex-col">
                                    <div class="p-1 pr-4 rounded-sm flex items-center gap-2">
                                        <Label :size="'md'" :type="employee?._payload?.label_shade?.value as LabelTypeT" shade :label="_get(employee, 'current_employment_profile.status.text', '')" />
                                        <div>{{employee.current_employment_profile?.employment_type?.text}}</div>
                                    </div>
                                    <div class="pl-1 text-xs subtitle-color" v-if="employee.current_employment_profile?.is_active">{{ _get(employee, 'current_employment_profile.readable_date_range', '') }}</div>
                                </div>
                                <Button :variant="'outline'" :size="'xs'" :icon="'ic:sharp-restart-alt'" :disabled="employeePending" :label="'Refresh'" @click="fetchEmployee()" />
                            </div>
                        </div>

                        <div v-if="!employeePendingOrNotSuccessful" class="flex flex-wrap gap-6">
                            <div>
                                <InputLabel :size="'xs'" value="Payroll group" />
                                <div class="text-sm font-sans">{{ _get(employee, 'payroll_group.type.text', '--') }}</div>
                            </div>
                            <div>
                                <InputLabel :size="'xs'" value="Contact" />
                                <span class="text-sm font-sans" v-if="_isEmpty(_compact([employee.contact?.office_email, employee.contact?.personal_email, employee.contact?.office_phone, employee.contact?.personal_phone]))">--</span>
                                <div class="text-sm font-sans" v-else :class="index == 0 ? 'inline-block' : 'block'" v-for="(contact, index) in _compact([employee.contact?.office_email, employee.contact?.personal_email, employee.contact?.office_phone, employee.contact?.personal_phone])">{{contact}}</div>
                            </div>
                            <div>
                                <InputLabel :size="'xs'" value="Manager" />
                                <div class="text-sm font-sans">{{ _get(employee, 'manager.full_name', '--') }}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- UR -->
                <div class="lining-shadow rounded-sm grow tint-background">
                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">My Requests</div>

                    <div class="px-4 py-4 max-h-[408px] overflow-y-auto">

                        <UserFiledRequest/>
                    </div>
                </div>

                <!-- AP -->
                <div class="lining-shadow rounded-sm grow tint-background">
                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-header px-4 py-2">Awaiting my approval</div>

                    <div class="px-4 py-4 max-h-[408px] overflow-y-auto">
                        <UserAwaitingApproval/>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div class="flex flex-col gap-4">

                    <!-- CS -->
                    <div class="lining-shadow rounded-sm grow tint-background">
                        <div class="lining-shadow rounded-t-sm px-4 py-2 flex flex-row items-center justify-between">
                            <div>
                                <div class="text-lg font-medium font-header">Current Shift</div>
                                <div v-if="!employeePending && employeeHasCurrentShiftAssigned" class="text-sm subtitle-color">{{ _get(employee, 'current_shift.shift_assignment.readable_date_range', '') }}</div>
                            </div>

                            <UnorderedList
                                v-if="!employeePending && employeeHasCurrentShiftAssigned"
                                class="cursor-pointer subtitle-color"
                                @click="toggleShowEmployeeHasCurrentShiftAssigned"
                                :icon="showEmployeeHasCurrentShiftAssigned ? 'ic:outline-keyboard-arrow-left' : 'ic:outline-keyboard-arrow-down'"
                                :label="'Show schedule'"
                                :size="'sm'"/>
                        </div>

                        <div class="px-4 py-4">
                            <div v-if="!employeePending && employeeHasCurrentShiftAssigned" class="flex flex-col gap-2">
                                <div class="flex flex-row gap-6 flex-wrap">
                                    <div>
                                        <div class="text-xs">Code</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'current_shift.shift.code', '') }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs">Type</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'current_shift.shift.type.text', '') }}</div>
                                    </div>
                                    <div class="col-span-2">
                                        <div class="text-xs">Name</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'current_shift.shift.name', '') }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs">Work Start Grace</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'current_shift.shift.work_start_grace_time_readable', '') }}</div>
                                    </div>
                                    <div v-if="employeeCurrentShiftRequiresLunchOutAndIn">
                                        <div class="text-xs">Lunch Start Grace</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'current_shift.shift.lunch_start_grace_time_readable', '') }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs">Overtime Max Duration</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'current_shift.shift.max_overtime_readable', '') }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs">Holiday policy</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'current_shift.shift.holiday_policy.text', '') }}</div>
                                    </div>
                                </div>

                                <div v-if="showEmployeeHasCurrentShiftAssigned">
                                    <DataTable
                                        :headers="shiftSchedulesHeaders"
                                        :size="'md'"
                                        :stripped="true"
                                        :landscape="true"
                                        :rows="employee.current_shift.shift_schedules">
                                        <template v-slot:cell.is_rest_day="{cell, slot, scrollReference}">
                                            <div class="flex justify-center">
                                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.is_rest_day"></NonModelCheckBox>
                                            </div>
                                        </template>
                                        <template v-slot:cell.is_day_off="{cell, slot, scrollReference}">
                                            <div class="flex justify-center">
                                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.is_day_off"></NonModelCheckBox>
                                            </div>
                                        </template>
                                        <template v-slot:cell.is_flexible="{cell, slot, scrollReference}">
                                            <div class="flex justify-center">
                                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.is_flexible"></NonModelCheckBox>
                                            </div>
                                        </template>
                                        <template v-slot:cell.total_work_hours_with_breaks="{cell, slot, scrollReference}">
                                            <div class="p-[3px]" v-if="cell.is_flexible">
                                                {{cell.total_work_hours_with_breaks}}
                                            </div>
                                        </template>
                                        <template v-slot:cell.total_lunch_break_hours="{cell, slot, scrollReference}">
                                            <div class="p-[3px]" v-if="cell.is_flexible">
                                                {{cell.total_lunch_break_hours}}
                                            </div>
                                        </template>
                                    </DataTable>
                                </div>
                            </div>
                            <div v-else-if="!employeeHasCurrentShiftAssigned && !employeePending">
                                No current shift assigned
                            </div>
                            <UnorderedList v-if="employeePending" :icon="'eos-icons:loading'" :size="'md'" :label="'Loading shift details...'"/>
                        </div>
                    </div>

                    <!-- US -->
                    <div class="lining-shadow rounded-sm grow tint-background">
                        <div class="lining-shadow rounded-t-sm px-4 py-2 flex flex-row items-center justify-between">
                            <div>
                                <div class="text-lg font-medium font-header">Upcoming Shift</div>
                                <div v-if="!employeePending && employeeHasUpcomingShiftAssigned" class="text-sm subtitle-color">{{ _get(employee, 'upcoming_shift.shift_assignment.readable_date_range', '') }}</div>
                            </div>

                            <UnorderedList
                                v-if="!employeePending && employeeHasUpcomingShiftAssigned"
                                class="cursor-pointer subtitle-color"
                                @click="toggleShowEmployeeHasUpcomingShiftAssigned"
                                :icon="showEmployeeHasUpcomingShiftAssigned ? 'ic:outline-keyboard-arrow-left' : 'ic:outline-keyboard-arrow-down'"
                                :label="'Show schedule'"
                                :size="'sm'"/>
                        </div>

                        <div class="px-4 py-4">
                            <div v-if="!employeePending && employeeHasUpcomingShiftAssigned" class="flex flex-col gap-2">
                                <div class="flex flex-row flex-wrap gap-6">
                                    <div>
                                        <div class="text-xs">Code</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'upcoming_shift.shift.code', '') }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs">Type</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'upcoming_shift.shift.type.text', '') }}</div>
                                    </div>
                                    <div class="col-span-2">
                                        <div class="text-xs">Name</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'upcoming_shift.shift.name', '') }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs">Work Start Grace</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'upcoming_shift.shift.work_start_grace_time_readable', '') }}</div>
                                    </div>
                                    <div v-if="employeeUpcomingShiftRequiresLunchOutAndIn">
                                        <div class="text-xs">Lunch Start Grace</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'upcoming_shift.shift.lunch_start_grace_time_readable', '') }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs">Overtime Max Duration</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'upcoming_shift.shift.max_overtime_readable', '') }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs">Holiday policy</div>
                                        <div class="text-sm font-sans">{{ _get(employee, 'upcoming_shift.shift.holiday_policy.text', '') }}</div>
                                    </div>
                                </div>

                                <div v-if="showEmployeeHasUpcomingShiftAssigned">
                                    <DataTable
                                        :headers="shiftSchedulesHeaders"
                                        :size="'md'"
                                        :stripped="true"
                                        :landscape="true"
                                        :rows="employee.upcoming_shift.shift_schedules">
                                        <template v-slot:cell.is_rest_day="{cell, slot, scrollReference}">
                                            <div class="flex justify-center">
                                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.is_rest_day"></NonModelCheckBox>
                                            </div>
                                        </template>
                                        <template v-slot:cell.is_day_off="{cell, slot, scrollReference}">
                                            <div class="flex justify-center">
                                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.is_day_off"></NonModelCheckBox>
                                            </div>
                                        </template>
                                        <template v-slot:cell.is_flexible="{cell, slot, scrollReference}">
                                            <div class="flex justify-center">
                                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.is_flexible"></NonModelCheckBox>
                                            </div>
                                        </template>
                                        <template v-slot:cell.total_work_hours_with_breaks="{cell, slot, scrollReference}">
                                            <div class="p-[3px]" v-if="cell.is_flexible">
                                                {{cell.total_work_hours_with_breaks}}
                                            </div>
                                        </template>
                                        <template v-slot:cell.total_lunch_break_hours="{cell, slot, scrollReference}">
                                            <div class="p-[3px]" v-if="cell.is_flexible">
                                                {{cell.total_lunch_break_hours}}
                                            </div>
                                        </template>
                                    </DataTable>
                                </div>
                            </div>
                            <div v-else-if="!employeeHasUpcomingShiftAssigned && !employeePending">
                                No upcoming shift assigned
                            </div>
                            <UnorderedList v-if="employeePending" :icon="'eos-icons:loading'" :size="'md'" :label="'Loading shift details...'"/>
                        </div>
                    </div>
                </div>

                <div class="flex-none">
                    <div class="flex flex-col gap-4">
                        <!-- LC -->
                        <div class="lining-shadow rounded-sm grow tint-background">
                            <div class="lining-shadow rounded-t-sm px-4 py-2 flex justify-between items-center">
                                <div class="text-lg font-medium font-header">Leave Credits</div>
                                <div class="flex items-center">
                                    <Button :variant="'outline'" :withBorder="false" :size="'xs'" :icon="'ic:sharp-restart-alt'" :disabled="leaveBalanceByTypePending" :label="'Reload'" @click="leaveBalanceByTypeExecute()" />
                                </div>
                            </div>

                            <div class="px-4 py-4">
                                <div v-if="!leaveBalanceByTypePending" class="flex flex-row flex-wrap gap-6">
                                    <div v-if="leaveBalanceByTypes.length > 0" v-for="(leaveBalanceByType, index) in leaveBalanceByTypes" :key="index">
                                        <div class="text-sm">{{leaveBalanceByType.name}}</div>
                                        <div class="text-base font-sans">{{leaveBalanceByType.running_balance}}</div>
                                    </div>
                                    <div v-else>
                                        No leave type assigned
                                    </div>
                                </div>
                                <div v-else>
                                    <UnorderedList :icon="'eos-icons:loading'" :size="'md'" :label="'Loading leave balance...'"/>
                                </div>
                            </div>
                        </div>

                        <!-- PR -->
                        <div v-if="false" class="lining-shadow rounded-sm grow tint-background">
                            <div class="lining-shadow rounded-t-sm px-4 py-2 flex justify-between items-center">
                                <div class="text-lg font-medium font-header">Payroll</div>
                            </div>

                            <div class="px-4 py-4">
                                <div v-if="true" class="grid grid-cols-1 gap-2">
                                    <span class="text-sm font-serif">work in progress...</span>
                                </div>
                                <div v-else>
                                    <UnorderedList :icon="'eos-icons:loading'" :size="'md'" :label="'Loading payroll info...'"/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import { useDateFormat, useNow } from '@vueuse/core'
import type {LabelTypeT} from "@/public/js/types/theme";
import type {TableHeaderT, TableRowT} from "@/public/js/types/data";
import type {EmployeeT} from "@/public/js/types/employee";
import type {LeaveRunningBalanceByTypeT} from "@/public/js/types/leave";

const {isAuthenticated, userIsSuperAdmin} = useAuth();
const user = userState();
const userCompanyEmployee = userCompanyEmployeeState();
const nuxtApp = useNuxtApp();
const cosmetic = useCosmetic();
const userIsEmployeeOfSelectedCompany = userIsEmployeeOfSelectedCompanyState();
const userIsAdminOfSelectedCompany = userIsAdminOfSelectedCompanyState();
const {
    updatedAssociatedCompanyFlag,
    updatedAssociatedAccountSubscriptionFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAccountSubscription,
    selectedAccountSubscriptionValue,
    selectedAssociatedCompany,
    selectedAssociatedCompanyId,
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && userIsEmployeeOfSelectedCompany.value && selectedAssociatedCompanyId.value){
        fetchEmployee();
        leaveBalanceByTypeExecute();
    }
});

const dateTimeNowFormatted = useDateFormat(useNow(), 'dddd MMM DD, YYYY HH:mm:ss')

const employee = ref<Partial<EmployeeT & TableRowT>>({});
const employeeSuccessful = ref(true);
const employeeMessage = ref('');
const employeePending = ref(false);

const employeePendingOrNotSuccessful = computed(() => employeePending.value || !employeeSuccessful.value)

const employeeHasCurrentShiftAssigned = ref(false);
const showEmployeeHasCurrentShiftAssigned = ref(false);
const toggleShowEmployeeHasCurrentShiftAssigned = () => {
    showEmployeeHasCurrentShiftAssigned.value = !showEmployeeHasCurrentShiftAssigned.value;
}

const employeeHasUpcomingShiftAssigned = ref(false);
const showEmployeeHasUpcomingShiftAssigned = ref(false);
const toggleShowEmployeeHasUpcomingShiftAssigned = () => {
    showEmployeeHasUpcomingShiftAssigned.value = !showEmployeeHasUpcomingShiftAssigned.value;
}

const employeeCurrentShiftRequiresLunchOutAndIn = ref(false);
const employeeUpcomingShiftRequiresLunchOutAndIn = ref(false);

const fetchEmployee = async (callback: (() => void) | null = null) => {

    if(import.meta.server || userCompanyEmployee.value == null){return;}

    employeeHasCurrentShiftAssigned.value = false;
    employeeHasUpcomingShiftAssigned.value = false;

    employeeCurrentShiftRequiresLunchOutAndIn.value = false;
    employeeUpcomingShiftRequiresLunchOutAndIn.value = false;

    employeePending.value = true;

    await laraFetch(`/api/employee-portal-employees`, {
        method: 'GET',
        params: {
            filters: {
                company_id: selectedAssociatedCompanyId.value,
                employee_ulids: [userCompanyEmployee.value?.ulid],
            }
        }
    }, {
        onResponse: (request, options, response) => {
            employeePending.value = false;
            employeeSuccessful.value = _get(response, '_data.successful', false);
            employeeMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            let employeesResponse = _get(response, '_data.values.data', []) as EmployeeT[];
            let _employee = employeesResponse[0] ?? {};

            employeeCurrentShiftRequiresLunchOutAndIn.value = _get(_employee, 'current_shift.shift.require_lunch_time_in_and_out', false);
            employeeUpcomingShiftRequiresLunchOutAndIn.value = _get(_employee, 'upcoming_shift.shift.require_lunch_time_in_and_out', false);

            employeeHasCurrentShiftAssigned.value = _get(_employee, 'has_current_shift', false);
            employeeHasUpcomingShiftAssigned.value = _get(_employee, 'has_upcoming_shift', false);

            let employmentProfileShade = _get(_employee, 'current_employment_profile.is_active', false)
                ? 'clear'
                : 'default';

            employee.value = {
                ..._employee,
                _payload: {
                    'label_shade': {
                        'cell': ['current_employment_profile', 'current_employment_type'],
                        'value': employmentProfileShade
                    }
                }
            } as EmployeeT & TableRowT;
        },
    }, false);
};

fetchEmployee();

const shiftSchedulesHeaders = computed<TableHeaderT[]>(() => {
    return [
        { text: 'Weekday', value: 'week_day_name', alignData: 'left'},
        { text: 'Rest Day', value: 'is_rest_day', alignHeader: 'center', alignData: 'left'},
        { text: 'Day Off', value: 'is_day_off', alignHeader: 'center', alignData: 'left'},
        //{ text: 'Flexible', value: 'is_flexible', alignHeader: 'center', alignData: 'left'},
        { text: 'Timezone', value: 'timezone', alignData: 'left'},
        { text: 'Start', value: 'work_start', alignHeader: 'right', alignData: 'right'},
        { text: 'End', value: 'work_end', alignHeader: 'right', alignData: 'right'},

        { text: 'Total', value: 'total_work_hours_with_breaks', alignHeader: 'right', alignData: 'right'},
        { text: 'Lunch Start', value: 'lunch_break_start', alignHeader: 'right', alignData: 'right'},
        { text: 'Lunch End', value: 'lunch_break_end', alignHeader: 'right', alignData: 'right'},
        { text: 'Total Lunch', value: 'total_lunch_break_hours', alignHeader: 'right', alignData: 'right'},
    ]
});

const leaveBalanceByTypes = ref<LeaveRunningBalanceByTypeT[]>([]);
const leaveBalanceByTypeSuccessful = ref(true);
const leaveBalanceByTypeMessage = ref('');
const leaveBalanceByTypePending = ref(false);

let paramsComputed = computed(() => {
    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            employee_ulid: userCompanyEmployee.value?.ulid,
            date: nuxtApp.$moment().format("YYYY-MM-DD")
        }
    };
});
const leaveBalanceByTypeExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    leaveBalanceByTypePending.value = true;

    await laraFetch(`/api/employee-portal-leave-running-balance-by-type`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            leaveBalanceByTypePending.value = false;
        },
        onResponse: (request, options, response) => {
            leaveBalanceByTypePending.value = false;
            leaveBalanceByTypeSuccessful.value = _get(response, '_data.successful', false);
            leaveBalanceByTypeMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            leaveBalanceByTypes.value = _get(response, '_data.values.leave_balance_by_types', []) as LeaveRunningBalanceByTypeT[];
        }
    }, false);
}
await leaveBalanceByTypeExecute();
</script>

<style scoped>

</style>