<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/hr-payroll/workforce/attendance`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <div v-if="!attendanceSuccessful" class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="attendanceMessage" />
                    </div>
                </div>

                <div v-if="attendanceSuccessful" class="px-[20px] space-y-6">

                    <div>
                        <div class="font-medium text-lg font-header">{{title}}</div>
                        <div class="text-sm">{{subTitle}}</div>
                    </div>

                    <div class="space-y-2">
                        <div class="text-lg font-medium font-header">Schedule</div>

                        <DataTable
                            :headers="scheduleHeaders"
                            :disabled="disableActions"
                            :size="'md'"
                            :stripped="true"
                            :rows="scheduleData"></DataTable>
                    </div>

                    <div class="space-y-2">
                        <div class="text-lg font-medium font-header">Attendance</div>

                        <DataTable
                            :headers="attendanceHeaders"
                            :disabled="disableActions"
                            :size="'md'"
                            :stripped="true"
                            :rows="attendanceData"></DataTable>
                    </div>

                    <div class="space-y-2">
                        <div class="text-lg font-medium font-header">Attendance Breakdown</div>

                        <DataTable
                            :sup-headers="attendanceBreakdownSupHeaders"
                            :headers="attendanceBreakdownHeaders"
                            :disabled="disableActions"
                            :size="'md'"
                            :stripped="true"
                            :rows="attendanceBreakdown">
                            <template v-slot:cell.split_type="{cell,slot}">
                                <div class="p-[3px]">{{cell.split_type.text}}</div>
                            </template>
                            <template v-slot:cell.date="{cell, slot, scrollReference}">
                                <div class="p-[3px] font-sans">
                                    {{cell.date}}
                                </div>
                            </template>
                            <template v-slot:cell.split_start="{cell, slot, scrollReference}">
                                <div class="p-[3px] font-sans">
                                    {{cell.split_start}}
                                </div>
                            </template>
                            <template v-slot:cell.split_end="{cell, slot, scrollReference}">
                                <div class="p-[3px] font-sans">
                                    {{cell.split_end}}
                                </div>
                            </template>
                            <template v-slot:cell.split_duration="{cell, slot, scrollReference}">
                                <div class="p-[3px] font-sans">
                                    {{cell.split_duration}}
                                </div>
                            </template>
                            <template v-slot:cell.work_hour="{cell,slot}">
                                <div class="p-[3px]">{{cell.work_hour_type?.text}}</div>
                            </template>
                            <template v-slot:cell.hourly_rate="{cell,slot}">
                                <div class="p-[3px]">{{cell.hourly_rate_type?.text}}</div>
                            </template>
                            <template v-slot:cell.hourly_rate_multiplier="{cell,slot}">
                                <div class="p-[3px] font-sans">{{cell.hourly_rate_multiplier}}</div>
                            </template>
                            <template v-slot:cell.actual_start="{cell,slot}">
                                <div class="p-[3px] font-sans">{{cell.actual_start}}</div>
                            </template>
                            <template v-slot:cell.actual_end="{cell,slot}">
                                <div class="p-[3px] font-sans">{{cell.actual_end}}</div>
                            </template>
                            <template v-slot:cell.grace_before_start_applied="{cell,slot}">
                                <div class="p-[3px] font-sans">{{cell.grace_before_start_applied}}</div>
                            </template>
                            <template v-slot:cell.grace_after_start_applied="{cell,slot}">
                                <div class="p-[3px] font-sans">{{cell.grace_after_start_applied}}</div>
                            </template>
                            <template v-slot:cell.actual_present_start="{cell,slot}">
                                <div class="p-[3px] font-sans">{{cell.actual_present_start}}</div>
                            </template>
                            <template v-slot:cell.actual_present_end="{cell,slot}">
                                <div class="p-[3px] font-sans">{{cell.actual_present_end}}</div>
                            </template>
                            <template v-slot:cell.actual_present="{cell,slot}">
                                <div class="p-[3px] font-sans">{{cell.actual_present}}</div>
                            </template>
                            <template v-slot:cell.late="{cell,slot}">
                                <div v-if="!shiftIsFlexible" class="p-[3px] font-sans">{{cell.late}}</div>
                            </template>
                            <template v-slot:cell.undertime="{cell,slot}">
                                <div v-if="shiftIsFlexible" class="p-[3px] font-sans">{{cell.flexible_undertime}}</div>
                                <div v-else class="p-[3px] font-sans">{{cell.undertime}}</div>
                            </template>
                        </DataTable>
                    </div>
                </div>

            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";

import {storeToRefs} from "pinia";
import type {AttendanceT} from "@/public/js/types/attendance";

useHead({titleTemplate: (titleChunk) => {return `Attendance`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');
const route = useRoute();
const {isAuthenticated} = useAuth();
const {$authStore, $associationStore, $moment} = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs($associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
    selectedAssociatedCompany
} = storeToRefs($authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        navigateTo("/hr-payroll/workforce/attendance", {replace: true});
    }
});

const title = computed(() => {
    return `${attendance.value.date} ${attendance.value.shift_schedule.week_day_name}`;
});
const subTitle = computed(() => {
    return `${attendance.value.employee.number} ${attendance.value.employee.full_name}`;
});

const attendance = ref<AttendanceT>({} as AttendanceT);
const attendanceSuccessful = ref(true);
const attendanceMessage = ref('');
const attendanceBreakdown = ref<TableRowT[]>([]);

const scheduleWorkPeriod = computed(() => {

    if(_isEmpty(attendance.value)){return 'Not found.';}

    return _get(attendance.value, 'shift_schedule.work_start', '') + ' - ' + _get(attendance.value, 'shift_schedule.work_end', '') + '(' + _get(attendance.value, 'shift_schedule.timezone', '')  + ')';
});
const shiftRequiresLunchOutAndIn = computed(() => {

    if(_isEmpty(attendance.value)){return false;}

    return _get(attendance.value, 'shift.require_lunch_time_in_and_out', false);

});
const shiftIsFlexible = computed(() => {

    if(_isEmpty(attendance.value)){return false;}

    return _get(attendance.value, 'shift_schedule.is_flexible', false);
});
const shiftScheduleHasLunchBreak = computed(() => {

    if(_isEmpty(attendance.value)){return false;}

    return _get(attendance.value, 'shift_schedule.has_lunch_break', false);
});
const attendanceShiftRequiresLunchOutAndIn = computed(() => {
    return shiftRequiresLunchOutAndIn.value && !shiftIsFlexible.value && shiftScheduleHasLunchBreak.value;
})
const scheduleLunchPeriod = computed(() => {

    if(_isEmpty(attendance.value)){return 'Not found.';}

    return shiftScheduleHasLunchBreak.value
        ? (_get(attendance.value, 'shift_schedule.lunch_break_start', '') + ' - ' + _get(attendance.value, 'shift_schedule.lunch_break_end', ''))
        : '';
});
const scheduleTotalDuration = computed(() => {

    if(_isEmpty(attendance.value)){return 'Not found.';}

    return _get(attendance.value, 'shift_schedule.total_work_hours_with_breaks', '');
});
const scheduleIsFlexible = computed(() => {
    return shiftIsFlexible.value ? 'Yes' : 'No';
})

const disableActions = computed(() => {
    return false;
});

const shiftSupHeaders = reactive<TableSupHeaderT[]>([
    {text: 'Shift', colspan: 2, value: 'shift'},
]);
const shiftHeaders = reactive<TableHeaderT[]>([
    { text: 'Code', value: 'code', alignData: 'left'},
    { text: 'Name', value: 'name', alignData: 'left'},
]);
const shiftData = computed<TableRowT[]>(() => {
    return [
        {
            id: 1,
            code: attendance.value.shift.code,
            name: attendance.value.shift.name,
        }
    ]
});

const scheduleHeaders = reactive<TableHeaderT[]>([
    { text: 'Week Day', value: 'week_day_name', alignData: 'left'},
    { text: 'Work Period', value: 'work_period', alignData: 'left'},
    { text: 'Lunch Period', value: 'lunch_period', alignData: 'left'},
    { text: 'Total Duration', value: 'total_duration', alignData: 'left'},
    { text: 'Is Flexible', value: 'is_flexible', alignData: 'left'},
    { text: 'Work Start Grace', value: 'work_start_grace', alignData: 'left'},
    { text: 'Lunch Start Grace', value: 'lunch_start_grace', alignData: 'left'},
    { text: 'Max Overtime', value: 'overtime', alignData: 'left'},
]);
const scheduleData = computed<TableRowT[]>(() => {
    return [
        {
            id: 1,
            week_day_name: attendance.value.shift_schedule.week_day_name,
            work_period: scheduleWorkPeriod.value,
            lunch_period: scheduleLunchPeriod.value,
            total_duration: scheduleTotalDuration.value,
            is_flexible: scheduleIsFlexible.value,
            work_start_grace: attendance.value.shift.work_start_grace_time_readable,
            lunch_start_grace: attendance.value.shift.lunch_start_grace_time_readable,
            overtime: attendance.value.shift.max_overtime_readable,
        }
    ]
});

const attendanceHeaders = computed<TableHeaderT[]>(() => {

    let headers: TableHeaderT[] = [
        { text: 'First In', value: 'first_in', alignData: 'left'},
    ];

    if(attendanceShiftRequiresLunchOutAndIn.value){
        headers = headers.concat([
            { text: 'Lunch Out', value: 'lunch_out', alignData: 'left'},
            { text: 'Lunch In', value: 'lunch_in', alignData: 'left'},
        ]);
    }

    headers = headers.concat([
        { text: 'Last Out', value: 'last_out', alignData: 'left'},
        { text: 'Status', value: 'status', alignData: 'left'},
    ]);

    return headers;
});

const attendanceData = computed<TableRowT[]>(() => {
    return [
        {
            id: 1,
            first_in: attendance.value.first_in,
            lunch_out: attendance.value.lunch_out,
            lunch_in: attendance.value.lunch_in,
            last_out: attendance.value.last_out,
            status: attendance.value.status.text,
        }
    ]
});

const attendanceBreakdownSupHeaders = reactive<TableSupHeaderT[]>([
    {text: 'Split', colspan: 5, value: 'split'},
    {text: 'Work Hour', colspan: 2, value: 'work_hour'},
    {text: 'Attendance', colspan: 2, value: 'attendance'},
    {text: 'Grace', colspan: 2, value: 'attendance'},
    {text: 'Present', colspan: 3, value: 'attendance'},
    {text: 'Irregularities', colspan: 2, value: 'attendance'},
]);

const attendanceBreakdownHeaders = reactive<TableHeaderT[]>([
    { text: 'Type', value: 'split_type', alignData: 'left'},
    { text: 'Date', value: 'date', alignData: 'left'},
    { text: 'Start', value: 'split_start', alignData: 'left'},
    { text: 'End', value: 'split_end', alignData: 'left'},
    { text: 'Duration', value: 'split_duration', alignData: 'left'},

    { text: 'Work Hour', value: 'work_hour', alignData: 'left'},
    { text: 'Hourly Rate Type', value: 'hourly_rate', alignData: 'left'},

    { text: 'Actual Start', value: 'actual_start', alignData: 'left'},
    { text: 'Actual End', value: 'actual_end', alignData: 'left'},

    { text: 'Before Start', value: 'grace_before_start_applied', alignData: 'left'},
    { text: 'After Start', value: 'grace_after_start_applied', alignData: 'left'},

    { text: 'Actual Present Start', value: 'actual_present_start', alignData: 'left'},
    { text: 'Actual Present End', value: 'actual_present_end', alignData: 'left'},
    { text: 'Actual Present', value: 'actual_present', alignData: 'left'},

    { text: 'Late', value: 'late', alignData: 'left'},
    { text: 'Undertime', value: 'undertime', alignData: 'left'},
]);

const fetchAttendance = async () => {

    if(import.meta.server){return;}

    await laraFetch(`/api/attendance/${route.params.id}`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value
        }
    }, {
        onResponse: (request, options, response) => {
            attendanceSuccessful.value = _get(response, '_data.successful', false);
            attendanceMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            attendance.value = _get(response, '_data.values.attendance', {}) as AttendanceT;
            attendanceBreakdown.value = _get(response, '_data.values.details', []);
        },
    }, false);
};

await fetchAttendance();
</script>

<style scoped>

</style>