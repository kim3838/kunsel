<template>
    <div>
        <div class="text-lg font-header">
            {{requestNumber}}
        </div>
        <div>
            {{attendanceDate}} {{attendanceWeekday}} Attendance Adjustment
        </div>
        <div class="text-sm">
            Attendance of: {{attendanceEmployeeNumber}} {{attendanceEmployeeFullName}}
        </div>

        <fieldset class="neutral-border px-2 pb-2 space-y-2">
            <legend class="text-lg font-header">Schedule</legend>

            <div class="grid gap-2">
                <div class="grid grid-cols-2 gap-y-2 lg:gap-y-0 lg:grid-cols-3 gap-x-2">
                    <div>
                        <InputLabel :size="'sm'" value="Work Period"/>
                        <div class="text-base">{{scheduleWorkPeriod}}</div>
                    </div>
                    <div>
                        <InputLabel :size="'sm'" value="Work Start Grace"/>
                        <div class="text-base">{{shiftWorkStartGrace}}</div>
                    </div>
                </div>
                <div v-if="attendanceShiftRequiresLunchOutAndIn" class="grid grid-cols-2 gap-y-2 lg:gap-y-0 lg:grid-cols-3 gap-x-2">
                    <div >
                        <InputLabel :size="'sm'" value="Lunch Period"/>
                        <div class="text-base">{{scheduleLunchPeriod}}</div>
                    </div>
                    <div>
                        <InputLabel :size="'sm'" value="Lunch Start Grace"/>
                        <div class="text-base">{{shiftLunchStartGrace}}</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-y-2 lg:gap-y-0 lg:grid-cols-3 gap-x-2">
                    <div>
                        <InputLabel :size="'sm'" value="Total Duration"/>
                        <div class="text-base">{{scheduleTotalDuration}}</div>
                    </div>
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
                    <InputLabel :size="'sm'" value="First In"/>
                    <div class="text-base">{{attendanceFirstIn}}</div>
                </div>
                <div v-if="attendanceShiftRequiresLunchOutAndIn" class="col-span-4 md:col-span-2">
                    <InputLabel :size="'sm'" value="Lunch Out"/>
                    <div class="text-base">{{attendanceLunchOut}}</div>
                </div>
                <div v-if="attendanceShiftRequiresLunchOutAndIn" class="col-span-4 md:col-span-2">
                    <InputLabel :size="'sm'" value="Lunch In"/>
                    <div class="text-base">{{attendanceLunchIn}}</div>
                </div>
                <div class="col-span-4 md:col-span-2">
                    <InputLabel :size="'sm'" value="Last Out"/>
                    <div class="text-base">{{attendanceLastOut}}</div>
                </div>
            </div>
        </fieldset>

        <fieldset class="neutral-border px-2 pb-2 space-y-2 body-background">
            <legend class="text-lg font-header">Adjustment</legend>

            <div class="grid gap-2 grid-cols-8 lg:grid-cols-8">
                <div class="col-span-4 md:col-span-2">
                    <InputLabel :size="'sm'" value="First In"/>
                    <div class="text-base">{{adjustmentAttendanceFirstIn}}</div>
                </div>
                <div v-if="attendanceShiftRequiresLunchOutAndIn" class="col-span-4 md:col-span-2">
                    <InputLabel :size="'sm'" value="Lunch Out"/>
                    <div class="text-base">{{adjustmentAttendanceLunchOut}}</div>
                </div>
                <div v-if="attendanceShiftRequiresLunchOutAndIn" class="col-span-4 md:col-span-2">
                    <InputLabel :size="'sm'" value="Lunch In"/>
                    <div class="text-base">{{adjustmentAttendanceLunchIn}}</div>
                </div>
                <div class="col-span-4 md:col-span-2">
                    <InputLabel :size="'sm'" value="Last Out"/>
                    <div class="text-base">{{adjustmentAttendanceLastOut}}</div>
                </div>
                <div class="col-span-full">
                    <InputLabel :size="'sm'" value="Reason"/>
                    <div class="text-base">{{reason}}</div>
                    <InputLabel :size="'sm'" value="Remarks"/>
                    <div class="text-base">{{remarks}}</div>
                </div>
            </div>
        </fieldset>

    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    attendanceAdjustmentPayload: {
        type: Object,
        default: () => {
            return {};
        }
    }
});

const scheduleWorkPeriod = ref('');
const shiftWorkStartGrace = ref('');
const scheduleLunchPeriod = ref('');
const shiftLunchStartGrace = ref('');
const scheduleTotalDuration = ref('');
const attendanceWeekday = ref('');
const scheduleIsFlexible = ref('');
const overtimeMaxDuration = ref('');
const attendanceShiftRequiresLunchOutAndIn = ref(false);
const attendanceDate = ref('');

const attendanceEmployeeNumber = ref('');
const attendanceEmployeeFullName = ref('');

const attendanceFirstIn = ref('');
const attendanceLunchOut = ref('');
const attendanceLunchIn = ref('');
const attendanceLastOut = ref('');

const requestNumber = ref('');
const adjustmentAttendanceFirstIn = ref('');
const adjustmentAttendanceLunchOut = ref('');
const adjustmentAttendanceLunchIn = ref('');
const adjustmentAttendanceLastOut = ref('');
const remarks = ref('');

requestNumber.value = _get(props.attendanceAdjustmentPayload, 'number', '');

attendanceDate.value = _get(props.attendanceAdjustmentPayload, 'attendance.date', '');
attendanceEmployeeNumber.value = _get(props.attendanceAdjustmentPayload, 'attendance.employee.number', '');
attendanceEmployeeFullName.value = _get(props.attendanceAdjustmentPayload, 'attendance.employee.full_name', '');

let shiftRequiresLunchOutAndIn = _get(props.attendanceAdjustmentPayload, 'attendance.shift.require_lunch_time_in_and_out', false) as boolean;
let shiftIsFlexible = _get(props.attendanceAdjustmentPayload, 'attendance.shift_schedule.is_flexible', false) as boolean;
let shiftHasLunchBreak = _get(props.attendanceAdjustmentPayload, 'attendance.shift_schedule.has_lunch_break', false) as boolean;

attendanceShiftRequiresLunchOutAndIn.value = shiftRequiresLunchOutAndIn && !shiftIsFlexible && shiftHasLunchBreak;

scheduleWorkPeriod.value = _get(props.attendanceAdjustmentPayload, 'attendance.shift_schedule.work_start', '') + ' - ' + _get(props.attendanceAdjustmentPayload, 'attendance.shift_schedule.work_end', '') + '(' + _get(props.attendanceAdjustmentPayload, 'attendance.shift_schedule.timezone', '')  + ')';
shiftWorkStartGrace.value = _get(props.attendanceAdjustmentPayload, 'attendance.shift.work_start_grace_time_readable', 'Not found');

scheduleLunchPeriod.value = attendanceShiftRequiresLunchOutAndIn.value ? (_get(props.attendanceAdjustmentPayload, 'attendance.shift_schedule.lunch_break_start', '') + ' - ' + _get(props.attendanceAdjustmentPayload, 'attendance.shift_schedule.lunch_break_end', '')) : '';
shiftLunchStartGrace.value = _get(props.attendanceAdjustmentPayload, 'attendance.shift.lunch_start_grace_time_readable', 'Not found');

scheduleTotalDuration.value = _get(props.attendanceAdjustmentPayload, 'attendance.shift_schedule.total_work_hours_with_breaks', '');
overtimeMaxDuration.value = _get(props.attendanceAdjustmentPayload, 'attendance.shift.max_overtime_readable', '');
scheduleIsFlexible.value = shiftIsFlexible ? 'Yes' : 'No';

attendanceWeekday.value = _get(props.attendanceAdjustmentPayload, 'attendance.shift_schedule.week_day_name', '');

attendanceFirstIn.value = _get(props.attendanceAdjustmentPayload, 'attendance.first_in', '');

if(attendanceShiftRequiresLunchOutAndIn.value){
    attendanceLunchOut.value = _get(props.attendanceAdjustmentPayload, 'attendance.lunch_out', '');
    attendanceLunchIn.value = _get(props.attendanceAdjustmentPayload, 'attendance.lunch_in', '');
}

attendanceLastOut.value = _get(props.attendanceAdjustmentPayload, 'attendance.last_out', '');

adjustmentAttendanceFirstIn.value = _get(props.attendanceAdjustmentPayload, 'first_in', '');

if(attendanceShiftRequiresLunchOutAndIn.value){
    adjustmentAttendanceLunchOut.value = _get(props.attendanceAdjustmentPayload, 'lunch_out', '');
    adjustmentAttendanceLunchIn.value = _get(props.attendanceAdjustmentPayload, 'lunch_in', '');
}

adjustmentAttendanceLastOut.value = _get(props.attendanceAdjustmentPayload, 'last_out', '');
remarks.value = _get(props.attendanceAdjustmentPayload, 'remarks', '');
</script>

<style scoped>

</style>