<template>
    <div class="font-data">
        <div class="text-lg font-header">
            {{requestNumber}}
        </div>
        <div>
            {{attendanceDate}} {{attendanceWeekday}} Overtime
        </div>
        <div class="text-sm">
            Attendance of: {{attendanceEmployeeNumber}} {{attendanceEmployeeFullName}}
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
                        <InputLabel :size="'sm'" value="Is Flexible"/>
                        <div class="text-base">{{scheduleIsFlexible}}</div>
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

const scheduleWorkPeriod = ref('');
const shiftWorkStartGrace = ref('');
const scheduleTotalDuration = ref('');
const attendanceWeekday = ref('');
const scheduleIsFlexible = ref('');
const overtimeMaxDuration = ref('');
const attendanceDate = ref('');

const attendanceEmployeeNumber = ref('');
const attendanceEmployeeFullName = ref('');

const attendanceFirstIn = ref('');
const attendanceLastOut = ref('');

const requestNumber = ref('');
const adjustmentStatusSummary = ref(REQUEST_APPROVAL_STATUS.NOT_SPECIFIED);
const adjustmentAttendanceFirstIn = ref('');
const adjustmentAttendanceLastOut = ref('');
const overtimeStart = ref('');
const overtimeEnd = ref('');
const overtimeDuration = ref('');
const remarks = ref('');

requestNumber.value = _get(props.overtimeRequestPayload, 'number', '');

attendanceDate.value = _get(props.overtimeRequestPayload, 'attendance.date', '');
attendanceEmployeeNumber.value = _get(props.overtimeRequestPayload, 'attendance.employee.number', '');
attendanceEmployeeFullName.value = _get(props.overtimeRequestPayload, 'attendance.employee.full_name', '');

let shiftIsFlexible = _get(props.overtimeRequestPayload, 'attendance.shift_schedule.is_flexible', false) as boolean;

scheduleWorkPeriod.value = _get(props.overtimeRequestPayload, 'attendance.shift_schedule.work_start', '') + ' - ' + _get(props.overtimeRequestPayload, 'attendance.shift_schedule.work_end', '') + '(' + _get(props.overtimeRequestPayload, 'attendance.shift_schedule.timezone', '')  + ')';
shiftWorkStartGrace.value = _get(props.overtimeRequestPayload, 'attendance.shift.work_start_grace_time_readable', 'Not found');

scheduleTotalDuration.value = _get(props.overtimeRequestPayload, 'attendance.shift_schedule.total_work_hours_with_breaks', '');
overtimeMaxDuration.value = _get(props.overtimeRequestPayload, 'attendance.shift.max_overtime_readable', '');
scheduleIsFlexible.value = shiftIsFlexible ? 'Yes' : 'No';

attendanceWeekday.value = _get(props.overtimeRequestPayload, 'attendance.shift_schedule.week_day_name', '');

attendanceFirstIn.value = _get(props.overtimeRequestPayload, 'attendance.first_in', '');

attendanceLastOut.value = _get(props.overtimeRequestPayload, 'attendance.last_out', '');

adjustmentStatusSummary.value = _get(props.overtimeRequestPayload, 'status_summary.value', REQUEST_APPROVAL_STATUS.NOT_SPECIFIED);
adjustmentAttendanceFirstIn.value = _get(props.overtimeRequestPayload, 'first_in', '');

adjustmentAttendanceLastOut.value = _get(props.overtimeRequestPayload, 'last_out', '');
overtimeStart.value = _get(props.overtimeRequestPayload, 'start', '');
overtimeEnd.value = _get(props.overtimeRequestPayload, 'end', '');
overtimeDuration.value = _get(props.overtimeRequestPayload, 'duration_readable', '');
remarks.value = _get(props.overtimeRequestPayload, 'remarks', '');
</script>

<style scoped>

</style>