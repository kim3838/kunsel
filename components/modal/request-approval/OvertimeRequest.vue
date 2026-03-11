<template>
    <div class="font-data">
        <div class="text-lg font-medium font-sans">
            {{requestNumber}}
        </div>
        <div class="text-lg">
            {{attendanceDate}} {{attendanceWeekday}} Overtime request
        </div>
        <div class="text-sm subtitle-color">
            Requested by: {{requestByUsername}} {{requestByEmployeeNumberComputed}} {{requestByEmployeeFullName}}
        </div>
        <div class="text-sm subtitle-color">
            Attendance of: ({{attendanceEmployeeNumber}}) {{attendanceEmployeeFullName}}
        </div>

        <fieldset class="mt-4 neutral-border px-2 pb-2 space-y-2">
            <legend class="text-lg font-header">Schedule</legend>

            <div class="grid gap-2">
                <div class="grid grid-cols-2 gap-y-2 lg:gap-y-0 lg:grid-cols-3 gap-x-2">
                    <div>
                        <InputLabel :size="'sm'" value="Work Period"/>
                        <div class="text-base">{{scheduleWorkPeriod}}</div>
                    </div>
                    <div>
                        <InputLabel :size="'sm'" value="Total Duration"/>
                        <div class="text-base">{{scheduleTotalDuration}}</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-y-2 lg:gap-y-0 lg:grid-cols-3 gap-x-2">
                    <div>
                        <InputLabel :size="'sm'" value="Overtime Max Duration"/>
                        <div class="text-base">{{overtimeMaxDuration}}</div>
                    </div>
                    <div>
                        <InputLabel :size="'sm'" value="Holiday policy"/>
                        <div class="text-base">{{holidayPolicy}}</div>
                    </div>
                </div>
            </div>
        </fieldset>

        <fieldset class="neutral-border px-2 pb-2 space-y-2">
            <legend class="text-lg font-header">Attendance</legend>

            <div class="grid gap-2 grid-cols-8 lg:grid-cols-8">
                <div class="col-span-4 md:col-span-2">
                    <InputLabel :size="'sm'" value="Last Out"/>
                    <div class="text-base">{{attendanceLastOut}}</div>
                </div>
            </div>
        </fieldset>

        <fieldset class="neutral-border px-2 pb-2 space-y-2 body-background">
            <legend class="text-lg font-header">Overtime</legend>

            <div class="grid gap-2 grid-cols-8 lg:grid-cols-8">
                <div class="col-span-4 md:col-span-2">
                    <InputLabel :size="'sm'" value="Start"/>
                    <div class="text-base">{{overtimeStart}}</div>
                </div>
                <div class="col-span-4 md:col-span-2">
                    <InputLabel :size="'sm'" value="End"/>
                    <div class="text-base">{{overtimeEnd}}</div>
                </div>
                <div class="col-span-4 md:col-span-2">
                    <InputLabel :size="'sm'" value="Total Duration"/>
                    <div class="text-base">{{overtimeDuration}}</div>
                </div>
                <div class="col-span-full">
                    <InputLabel :size="'sm'" value="Remarks"/>
                    <div class="text-base">{{remarks}}</div>
                </div>
            </div>
        </fieldset>

    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    overtimeRequestPayload: {
        type: Object,
        default: () => {
            return {};
        }
    }
});

const requestNumber = ref('');
const requestByUsername = ref('');
const requestByEmployeeNumber = ref('');
const requestByEmployeeFullName = ref('');
const statusSummary = ref(REQUEST_APPROVAL_STATUS.NOT_SPECIFIED);

const attendanceDate = ref('');
const attendanceWeekday = ref('');
const attendanceEmployeeNumber = ref('');
const attendanceEmployeeFullName = ref('');

const scheduleWorkPeriod = ref('');
const scheduleTotalDuration = ref('');
const overtimeMaxDuration = ref('');
const holidayPolicy = ref('');
const scheduleIsFlexible = ref('');

const attendanceLastOut = ref('');

const overtimeStart = ref('');
const overtimeEnd = ref('');
const overtimeDuration = ref('');
const remarks = ref('');

requestNumber.value = _get(props.overtimeRequestPayload, 'number', '');
requestByUsername.value = _get(props.overtimeRequestPayload, 'requested_by.username', '');
requestByEmployeeNumber.value = _get(props.overtimeRequestPayload, 'requested_by.company_employee_number', null);
const requestByEmployeeNumberComputed = computed(() => {
    return requestByEmployeeNumber.value ? `(${requestByEmployeeNumber.value})` : '';
})
requestByEmployeeFullName.value = _get(props.overtimeRequestPayload, 'requested_by.company_employee_full_name', '');
statusSummary.value = _get(props.overtimeRequestPayload, 'status_summary.value', REQUEST_APPROVAL_STATUS.NOT_SPECIFIED);

attendanceDate.value = _get(props.overtimeRequestPayload, 'attendance.date_readable', '');
attendanceWeekday.value = _get(props.overtimeRequestPayload, 'attendance.shift_schedule.week_day_name', '');
attendanceEmployeeNumber.value = _get(props.overtimeRequestPayload, 'attendance.employee.number', '');
attendanceEmployeeFullName.value = _get(props.overtimeRequestPayload, 'attendance.employee.full_name', '');

let shiftIsFlexible = _get(props.overtimeRequestPayload, 'attendance.shift_schedule.is_flexible', false) as boolean;

scheduleWorkPeriod.value = _get(props.overtimeRequestPayload, 'attendance.shift_schedule.work_start', '') + ' - ' + _get(props.overtimeRequestPayload, 'attendance.shift_schedule.work_end', '') + '(' + _get(props.overtimeRequestPayload, 'attendance.shift_schedule.timezone', '')  + ')';
scheduleTotalDuration.value = _get(props.overtimeRequestPayload, 'attendance.shift_schedule.total_work_hours_with_breaks', '');
overtimeMaxDuration.value = _get(props.overtimeRequestPayload, 'attendance.shift.max_overtime_readable', '');
holidayPolicy.value = _get(props.overtimeRequestPayload, 'attendance.shift.holiday_policy.text', 'Not found');
scheduleIsFlexible.value = shiftIsFlexible ? 'Yes' : 'No';

attendanceLastOut.value = _get(props.overtimeRequestPayload, 'attendance.last_out', '');

overtimeStart.value = _get(props.overtimeRequestPayload, 'start', '');
overtimeEnd.value = _get(props.overtimeRequestPayload, 'end', '');
overtimeDuration.value = _get(props.overtimeRequestPayload, 'duration_readable', '');

remarks.value = _get(props.overtimeRequestPayload, 'remarks', '');
</script>

<style scoped>

</style>