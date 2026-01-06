<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <DialogModal
                    :max-width="'700px'"
                    :show="resolvedShiftModal"
                    :closeable="false">
                    <template #title>
                        {{resolvedShiftModalTitle}}
                    </template>
                    <template #content>

                        <div class="mt-4 space-y-2">

                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="font-header">Shift</legend>
                                <table class="border-separate font-data">
                                    <tbody>
                                        <tr><td class="font-semibold">Code</td><td class="pl-2">{{ _get(resolvedShift, 'code', null) }}</td></tr>
                                        <tr><td class="font-semibold">Name</td><td class="pl-2">{{ _get(resolvedShift, 'name', null) }}</td></tr>
                                        <tr><td class="font-semibold">Type</td><td class="pl-2">{{ _get(resolvedShift, 'type.text', null) }}</td></tr>
                                        <tr><td class="font-semibold">Holiday Policy</td><td class="pl-2">{{ _get(resolvedShift, 'holiday_policy.text', null) }}</td></tr>
                                        <tr><td class="font-semibold">Work Start Grace</td><td class="pl-2">{{ _get(resolvedShift, 'work_start_grace_time_readable', null) }}</td></tr>
                                        <tr><td class="font-semibold">Requires Lunch out/in</td><td class="pl-2">{{ _get(resolvedShift, 'require_lunch_time_in_and_out', false) ? 'Yes' : 'No' }}</td></tr>
                                        <tr v-if="_get(resolvedShift, 'require_lunch_time_in_and_out', false)">
                                            <td class="font-semibold">Lunch Start Grace</td><td class="pl-2">{{ _get(resolvedShift, 'lunch_start_grace_time_readable', null) }}</td>
                                        </tr>
                                        <tr><td class="font-semibold">Max Overtime</td><td class="pl-2">{{ _get(resolvedShift, 'max_overtime_readable', null) }}</td></tr>
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div class="space-x-2 inline-flex items-center">
                                <Button :icon="'ic:sharp-keyboard-arrow-left'" @click="navigateTo({path: `/hr-payroll/policies/shifts`, replace: true})" :label="'Back to shifts'" />
                                <Button v-if="!creatingShift" @click="resetResolved" :label="'Close'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/hr-payroll/policies/shifts`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <div v-if="!shiftSuccessful" class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="shiftMessage" />
                    </div>
                </div>

                <div v-if="shiftSuccessful" class="px-[20px] space-y-2">

                    <div class="text-lg font-header">Shift information</div>

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        <div>
                            <InputLabel :size="'sm'" value="Type"/>
                            <SingleSelect :disabled="disableActions" value-persist drop-shadow :size="'md'" :options="shiftTypeOptions" @valueChange="shiftTypeChanged"/>
                        </div>
                        <div class="col-span-full md:col-span-2">
                            <InputLabel :size="'sm'" value="Code"/>
                            <Input :disabled="disableActions" :size="'md'" v-model="shiftCode"/>
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        <div class="col-span-full lg:col-span-4">
                            <InputLabel :size="'sm'" value="Name"/>
                            <Input :disabled="disableActions" :size="'md'" v-model="shiftName"/>
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        <div>
                            <InputLabel :size="'sm'" value="Holiday Policy"/>
                            <SingleSelect :disabled="disableActions" value-persist drop-shadow :size="'md'" :options="shiftHolidayPolicyOptions"/>
                        </div>
                        <div class="col-span-3 md:col-span-2">
                            <InputLabel :size="'sm'" value="Except Holidays"/>
                            <MultiSelectPaginated
                                :key="exceptHolidayOptionsKey"
                                :disabled="disableActions"
                                drop-shadow
                                :selection-max-viewable-line="10"
                                :label="'Select Holiday to Exclude'"
                                :size="'md'"
                                :icon="'tdesign:component-checkbox'"
                                :payload="exceptHolidayOptions"/>
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        <div>
                            <InputLabel :size="'sm'" value="Work Start Grace Time"/>
                            <Input :disabled="disableActions" :size="'md'" v-model="shiftWorkStartGraceTime" high-light-all-text-on-focus type-strict :type="'number'"/>
                        </div>
                        <div class="flex flex-col">
                            <InputLabel :size="'sm'" value="Require Lunch Time in and Out"/>
                            <RadioGroup
                                :selections="shiftRequireLunchTimeInAndOutSelection"
                                :size="'md'"
                                :orientation="'horizontal'"
                                :radio-key="'shift_require_lunch_time_in_and_out'"
                                v-model="shiftRequireLunchTimeInAndOut" />
                        </div>
                        <div v-if="shiftRequireLunchTimeInAndOut == 1">
                            <InputLabel :size="'sm'" value="Lunch Start Grace Time"/>
                            <Input :disabled="disableActions" :size="'md'" v-model="shiftLunchStartGraceTime" high-light-all-text-on-focus type-strict :type="'number'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Max Overtime Hours"/>
                            <Input :disabled="disableActions" :size="'md'" v-model="shiftMaxOvertime" high-light-all-text-on-focus type-strict :type="'number'"/>
                        </div>
                    </div>

                    <div class="mt-8">
                        <p class="text-lg font-header">Schedules</p>
                    </div>

                    <DataTable
                        :headers="shiftScheduleHeaders"
                        :disabled="disableActions"
                        :size="'xl'"
                        :stripped="false"
                        :rows="shiftSchedules">
                        <template v-slot:cell.week_day_name="{cell, slot, scrollReference}">
                            <div class="text-base h-[34px]">
                                <div class="h-full flex items-center px-2">
                                    {{cell.week_day_name}}
                                </div>
                            </div>
                        </template>
                        <template v-slot:cell.is_rest_day="{cell, slot, scrollReference}">
                            <div class="flex justify-center">
                                <Checkbox :size="slot.checkBoxSize" v-model="cell.is_rest_day" />
                            </div>
                        </template>
                        <template v-slot:cell.is_day_off="{cell, slot, scrollReference}">
                            <div class="flex justify-center">
                                <Checkbox @change="isDayOffChanged(cell)" :size="slot.checkBoxSize" v-model="cell.is_day_off" />
                            </div>
                        </template>
                        <template v-slot:cell.is_flexible="{cell, slot, scrollReference}">
                            <div class="flex justify-center">
                                <Checkbox @change="isFlexibleChanged(cell)" :disabled="cell.is_day_off || shiftTypeIsOvernight" :size="slot.checkBoxSize" v-model="cell.is_flexible" />
                            </div>
                        </template>
                        <template v-slot:cell.timezone="{cell, slot, scrollReference}">
                            <div class="text-base h-[34px]">
                                <div class="h-full flex items-center px-2">
                                    {{cell.timezone}}
                                </div>
                            </div>
                        </template>
                        <template v-slot:cell.work_start="{cell, slot, scrollReference}">
                            <div class="mx-[1px]">
                                <Input @change="workTimeChanged(cell)" :disabled="cell.is_day_off || cell.is_flexible" :type="'time'" v-model="cell.work_start" :size="slot.inputSize" />
                            </div>
                        </template>
                        <template v-slot:cell.work_end="{cell, slot, scrollReference}">
                            <div class="mx-[1px]">
                                <Input @change="workTimeChanged(cell)" :disabled="cell.is_day_off || cell.is_flexible" :type="'time'" v-model="cell.work_end" :size="slot.inputSize" />
                            </div>
                        </template>
                        <template v-slot:cell.total_work_hours_with_breaks="{cell, slot, scrollReference}">
                            <div class="mx-[1px]">
                                <Input :disabled="cell.is_day_off || !cell.is_flexible" time-blur high-light-all-text-on-focus :type="'text'" v-model="cell.total_work_hours_with_breaks" :size="slot.inputSize" />
                            </div>
                        </template>
                        <template v-slot:cell.lunch_setting="{cell, slot, scrollReference}">
                            <div class="mx-[1px]">
                                <RadioGroup
                                    v-if="!cell.is_day_off"
                                    class="px-2"
                                    :disabled="cell.is_day_off"
                                    :selections="lunchSelection"
                                    :size="slot.radioGroupSize"
                                    :orientation="'horizontal'"
                                    :radio-key="cell.week_day"
                                    @change="hasLunchBreakChanged(cell)"
                                    v-model="cell.has_lunch_break" />
                            </div>
                        </template>
                        <template v-slot:cell.lunch_break_start="{cell, slot, scrollReference}">
                            <div class="mx-[1px]">
                                <Input @change="lunchBreakTimeChanged(cell)" :disabled="cell.is_day_off || cell.has_lunch_break == 0" :type="'time'" v-model="cell.lunch_break_start" :size="slot.inputSize" />
                            </div>
                        </template>
                        <template v-slot:cell.lunch_break_end="{cell, slot, scrollReference}">
                            <div class="mx-[1px]">
                                <Input @change="lunchBreakTimeChanged(cell)" :disabled="cell.is_day_off || cell.has_lunch_break == 0" :type="'time'" v-model="cell.lunch_break_end" :size="slot.inputSize" />
                            </div>
                        </template>
                        <template v-slot:cell.total_lunch_break_hours="{cell, slot, scrollReference}">
                            <div class="mx-[1px]">
                                <Input :disabled="true" :type="'text'" v-model="cell.total_lunch_break_hours" :size="slot.inputSize" />
                            </div>
                        </template>
                        <template v-slot:cell.actions="{cell,slot}">
                            <div v-if="!cell.is_day_off" class="text-base h-[34px]">
                                <div class="h-full flex items-center px-2 cursor-pointer accent-hover" @click="copyToAll(cell)">
                                    <Icon size="1.5rem" :name="'ph:copy-light'"/>
                                    <span class="text-base">Copy to all</span>
                                </div>
                            </div>
                        </template>
                    </DataTable>

                    <div class="flex flex-row flex-wrap gap-2">
                        <Button class="w-min" ref="submitButton" type="submit" @click="formSubmit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="submitLabel"></Button>
                    </div>
                </div>

            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT} from "@/public/js/types/data";
import type {ShiftT, ShiftScheduleT} from "@/public/js/types/shift";
import type {StringEnumInterface} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Shifts`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');
const route = useRoute();
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const timeDifference = nuxtApp.$timeDifference as (start: string | null, end: string | null) => string | null;
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId,
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        navigateTo("/hr-payroll/policies/shifts", {replace: true});
    }
});

const shift = ref<ShiftT | null>(null);
const shiftSuccessful = ref(true);
const shiftMessage = ref('');
const creatingShift = computed(() => {
    return route.params.id === 'create-shift';
});

const shiftCode = ref('');
const shiftName = ref('');
const shiftTypeOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(SHIFT_TYPE_NAME, SHIFT_TYPE.REGULAR as number),
        $enumerableOption(SHIFT_TYPE_NAME, SHIFT_TYPE.GRAVEYARD as number),
    ],
    selected: SHIFT_TYPE.REGULAR
});
const shiftHolidayPolicyOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(SHIFT_HOLIDAY_POLICY_NAME, SHIFT_HOLIDAY_POLICY.DAY_OFF as number),
        $enumerableOption(SHIFT_HOLIDAY_POLICY_NAME, SHIFT_HOLIDAY_POLICY.ATTENDANCE_REQUIRED as number),
    ],
    selected: SHIFT_HOLIDAY_POLICY.DAY_OFF
});
const exceptHolidayOptionsKey = shallowRef(0);
const exceptHolidayOptions = reactive({
    fetch: {
        url: '/api/holiday-selections',
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: [],
})
const shiftWorkStartGraceTime = ref('0');
const shiftRequireLunchTimeInAndOut = ref(0);
const shiftRequireLunchTimeInAndOutSelection = reactive([
    {text : 'Yes', value: 1},
    {text : 'No', value: 0},
]);

const shiftLunchStartGraceTime = ref('0');
const shiftMaxOvertime = ref('0');

const shiftType = computed(() => {
    return shiftTypeOptions.selected;
});
const shiftTypeIsRegular = computed(() => {
    return shiftType.value == SHIFT_TYPE.REGULAR;
});
const shiftTypeIsOvernight = computed(() => {
    return shiftType.value == SHIFT_TYPE.GRAVEYARD;
});
const shiftIsDefault = reactive<{
    selection: Array<{text: string, value: number}>;
    selected: number | null;
}>({
    selection: [
        {text : 'Yes', value: 1},
        {text : 'No', value: 0},
    ],
    selected: 0
});
const lunchSelection = reactive([
    {text : 'Yes', value: 1},
    {text : 'No', value: 0},
]);

const shiftScheduleHeaders = reactive<TableHeaderT[]>([
    { text: 'Weekday', value: 'week_day_name', alignData: 'left'},
    { text: 'Rest Day', value: 'is_rest_day', alignData: 'left'},
    { text: 'Day Off', value: 'is_day_off', alignData: 'left'},
    { text: 'Flexible', value: 'is_flexible', alignData: 'left'},
    { text: 'Timezone', value: 'timezone', alignData: 'left'},
    { text: 'Work Start', value: 'work_start', alignData: 'left'},
    { text: 'Work End', value: 'work_end', alignData: 'left'},
    { text: 'Total', value: 'total_work_hours_with_breaks', alignData: 'left', width: '4rem', minWidth: '4rem',},
    { text: 'Has Lunch', value: 'lunch_setting', alignData: 'left'},
    { text: 'Lunch Start', value: 'lunch_break_start', alignData: 'left'},
    { text: 'Lunch End', value: 'lunch_break_end', alignData: 'left'},
    { text: 'Total Lunch', value: 'total_lunch_break_hours', alignData: 'left', width: '5rem', minWidth: '5rem',},
    { text: '', value: 'actions', alignData: 'left'},
]);
const shiftSchedules = ref<ShiftScheduleT[]>([]);

const fetchShift = async () => {

    if(import.meta.server){return;}

    if(route.params.id === 'create-shift'){

        await laraFetch(`/api/shift-schedules-preset`, {
            method: 'GET',
            params: {
                'company_id': selectedAssociatedCompanyId.value,
            }
        }, {
            onSuccessResponse: async (request, options, response) => {
                shiftSchedules.value = _get(response, '_data.values.shift_schedules_preset', []);
            },
        });

        return;
    }

    await laraFetch(`/api/shift/${route.params.id}`, {
        method: 'GET',
        params: {
            company_id: selectedAssociatedCompanyId.value
        }
    }, {
        onResponse: (request, options, response) => {
            shiftSuccessful.value = _get(response, '_data.successful', false);
            shiftMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            shift.value = _get(response, '_data.values.shift', null);
            shiftSchedules.value = _get(response, '_data.values.shift_schedules', []);

            shiftCode.value = _get(response, '_data.values.shift.code', '');
            shiftName.value = _get(response, '_data.values.shift.name', '');
            shiftTypeOptions.selected = _get(response, '_data.values.shift.type.value', null);
            shiftHolidayPolicyOptions.selected = _get(response, '_data.values.shift.holiday_policy.value', null);
            exceptHolidayOptions.selected = _get(response, '_data.values.shift.except_holidays', []);
            exceptHolidayOptionsKey.value++;
            shiftWorkStartGraceTime.value = _get(response, '_data.values.shift.work_start_grace_time', 0);
            shiftRequireLunchTimeInAndOut.value = _get(response, '_data.values.shift.require_lunch_time_in_and_out', 0);
            shiftLunchStartGraceTime.value = _get(response, '_data.values.shift.lunch_start_grace_time', 0);
            shiftMaxOvertime.value = _get(response, '_data.values.shift.max_overtime', 0);

            shiftIsDefault.selected = _get(response, '_data.values.shift.is_default', false) ? 1 : 0;
        },
    }, false);
};

await fetchShift();

const isDayOffChanged = (cell: ShiftScheduleT) => {

    if(cell.is_day_off){
        cell.is_flexible = false;
        cell.timezone = null;
        cell.work_start = null;
        cell.work_end = null;
        cell.total_work_hours_with_breaks = null;
        cell.has_lunch_break = 0;
        cell.lunch_break_start = null;
        cell.lunch_break_end = null;
        cell.total_lunch_break_hours = null;
    } else {
        cell.is_flexible = false;
        cell.timezone = selectedAssociatedCompany.value?.payload.timezone ?? null;
        cell.work_start = shiftTypeIsRegular.value ? '09:00' : '22:00';
        cell.work_end = shiftTypeIsRegular.value ? '17:00' : '06:00';
        cell.total_work_hours_with_breaks = timeDifference(cell.work_start, cell.work_end);
        cell.has_lunch_break = 0;
        cell.lunch_break_start = null;
        cell.lunch_break_end = null;
        cell.total_lunch_break_hours = null;
    }
};
const isFlexibleChanged = (cell: ShiftScheduleT) => {

    if(cell.is_flexible){
        cell.work_start = shiftTypeIsRegular.value ? '00:00' : '22:00';
        cell.work_end = shiftTypeIsRegular.value ? '00:00' : '06:00';
        cell.total_work_hours_with_breaks = '08:00';
    } else {
        cell.work_start = shiftTypeIsRegular.value ? '09:00' : '22:00';
        cell.work_end = shiftTypeIsRegular.value ? '17:00' : '06:00';
        cell.total_work_hours_with_breaks = timeDifference(cell.work_start, cell.work_end);
    }
};
const workTimeChanged = (cell: ShiftScheduleT) => {

    cell.total_work_hours_with_breaks = timeDifference(cell.work_start, cell.work_end);
};
const hasLunchBreakChanged = (cell: ShiftScheduleT) => {

    if(cell.has_lunch_break == 1){
        cell.lunch_break_start = shiftTypeIsRegular.value ? '12:00' : '01:00';
        cell.lunch_break_end = shiftTypeIsRegular.value ? '13:00' : '02:00';
        cell.total_lunch_break_hours = timeDifference(cell.lunch_break_start, cell.lunch_break_end);
    } else {
        cell.lunch_break_start = null;
        cell.lunch_break_end = null;
        cell.total_lunch_break_hours = null;
    }
};
const lunchBreakTimeChanged = (cell: ShiftScheduleT) => {

    if(cell.lunch_break_start == null && cell.lunch_break_end == null){
        return
    }

    if(cell.lunch_break_start == null && cell.lunch_break_end){
        cell.lunch_break_start = cell.lunch_break_end;
    }

    if(cell.lunch_break_start && cell.lunch_break_end == null){
        cell.lunch_break_end = cell.lunch_break_start;
    }

    cell.total_lunch_break_hours = timeDifference(cell.lunch_break_start, cell.lunch_break_end);
};

const copyToAll = (cell: ShiftScheduleT) => {

    shiftSchedules.value.forEach((shiftSchedule) => {
        if(cell.week_day != shiftSchedule.week_day && !shiftSchedule.is_day_off){
            shiftSchedule.is_flexible = cell.is_flexible;
            shiftSchedule.timezone = cell.timezone;
            shiftSchedule.work_start = cell.work_start;
            shiftSchedule.work_end = cell.work_end;
            shiftSchedule.total_work_hours_with_breaks = cell.is_flexible ? cell.total_work_hours_with_breaks : timeDifference(cell.work_start, cell.work_end);
            shiftSchedule.has_lunch_break = cell.has_lunch_break;
            shiftSchedule.lunch_break_start = cell.lunch_break_start;
            shiftSchedule.lunch_break_end = cell.lunch_break_end;
            shiftSchedule.total_lunch_break_hours = timeDifference(cell.lunch_break_start, cell.lunch_break_end);
        }
    })
};

const shiftTypeChanged = (value: number) => {

    if(value == SHIFT_TYPE.REGULAR){
        shiftSchedules.value.forEach((shiftSchedule) => {
            if (!shiftSchedule.is_day_off) {
                shiftSchedule.is_flexible = false;
                shiftSchedule.timezone = selectedAssociatedCompany.value?.payload.timezone ?? null;
                shiftSchedule.work_start = '09:00';
                shiftSchedule.work_end = '17:00';
                shiftSchedule.total_work_hours_with_breaks = timeDifference(shiftSchedule.work_start, shiftSchedule.work_end);
                shiftSchedule.has_lunch_break = 1;
                shiftSchedule.lunch_break_start = '12:00';
                shiftSchedule.lunch_break_end = '13:00';
                shiftSchedule.total_lunch_break_hours = timeDifference(shiftSchedule.lunch_break_start, shiftSchedule.lunch_break_end);
            }
        })
    }

    if(value == SHIFT_TYPE.GRAVEYARD){
        shiftSchedules.value.forEach((shiftSchedule) => {
            if (!shiftSchedule.is_day_off) {
                shiftSchedule.is_flexible = false;
                shiftSchedule.timezone = selectedAssociatedCompany.value?.payload.timezone ?? null;
                shiftSchedule.work_start = '22:00';
                shiftSchedule.work_end = '06:00';
                shiftSchedule.total_work_hours_with_breaks = timeDifference(shiftSchedule.work_start, shiftSchedule.work_end);
                shiftSchedule.has_lunch_break = 1;
                shiftSchedule.lunch_break_start = '01:00';
                shiftSchedule.lunch_break_end = '02:00';
                shiftSchedule.total_lunch_break_hours = timeDifference(shiftSchedule.lunch_break_start, shiftSchedule.lunch_break_end);
            }
        })
    }
}

const formPending = ref(false);
const disableActions = computed(() => {
    return formPending.value
});

const submitLabel = computed(() => {
    return formPending.value ? 'Please wait' : (!creatingShift.value ? 'Save' : 'Submit');
});
const submitAction = computed(() => {
    return !creatingShift.value ? 'PATCH' : 'POST';
});
const submitPath = computed(() => {
    return !creatingShift.value ? `/api/shift/${shift.value.id}` : `/api/shift`;
});
const formBody = computed(() => {

    return{
        'company_id': selectedAssociatedCompanyId.value,
        'code': shiftCode.value,
        'name': shiftName.value,
        'type': shiftTypeOptions.selected,
        'holiday_policy': shiftHolidayPolicyOptions.selected,
        'except_holidays' : exceptHolidayOptions.selected,
        'work_start_grace_time': shiftWorkStartGraceTime.value,
        'require_lunch_time_in_and_out': shiftRequireLunchTimeInAndOut.value,
        ...(shiftRequireLunchTimeInAndOut.value == 1 ? {
            'lunch_start_grace_time': shiftLunchStartGraceTime.value
        }: {}),
        'max_overtime': shiftMaxOvertime.value,
        'shift_schedules': shiftSchedules.value,
    };
});

const formSubmit = async() => {

    await nextTick();

    formPending.value = true;

    await laraFetch(submitPath.value, {
        method: submitAction.value,
        body: formBody.value,
    }, {
        onRequestError: () => {
            formPending.value = false;
        },
        onResponse: () => {
            formPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            resolvedShift.value = _get(response, '_data.values.shift', null);
            shiftWorkStartGraceTime.value = resolvedShift.value.work_start_grace_time;
            shiftLunchStartGraceTime.value = resolvedShift.value.lunch_start_grace_time;
            shiftMaxOvertime.value = resolvedShift.value.max_overtime;
            resolvedShiftModal.value = true;
        },
    });
}

const resolvedShiftModal = ref(false);
const resolvedShift = ref({});
const resolvedShiftModalTitle = computed(() => {
    return `Shift ${creatingShift.value ? 'Created' : 'Updated'}`;
})
const resetResolved = () => {
    resolvedShiftModal.value = false;
    resolvedShift.value = {};
}
</script>

<style scoped>

</style>