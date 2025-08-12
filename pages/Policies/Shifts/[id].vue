<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <DialogModal
                    :max-width="'580px'"
                    :show="resolvedShiftModal"
                    :closeable="false">
                    <template #title>
                        {{resolvedShiftModalTitle}}
                    </template>
                    <template #content>

                        <div class="mt-4 space-y-2">

                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="font-semibold">Shift</legend>
                                <table class="border-separate font-data">
                                    <tbody>
                                        <tr><td class="font-semibold">Code</td><td class="pl-2">{{ _get(resolvedShift, 'code', null) }}</td></tr>
                                        <tr><td class="font-semibold">Name</td><td class="pl-2">{{ _get(resolvedShift, 'name', null) }}</td></tr>
                                        <tr><td class="font-semibold">Type</td><td class="pl-2">{{ _get(resolvedShift, 'type.text', null) }}</td></tr>
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div class="space-x-2 inline-flex items-center">
                                <Button :icon="'ic:sharp-keyboard-arrow-left'" @click="navigateTo({path: `/policies/shifts`, replace: true})" :label="'Back to shifts'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/policies/shifts`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <div class="px-[20px] space-y-2">

                    <div>
                        <p class="font-medium text-lg">Shift information</p>
                    </div>

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        <div>
                            <InputLabel :size="'sm'" value="Type"/>
                            <SingleSelect :disabled="disableActions" value-persist drop-shadow :size="'md'" :options="shiftTypeOptions" @valueChange="shiftTypeChanged"/>
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        <div>
                            <InputLabel :size="'sm'" value="Code"/>
                            <Input :disabled="disableActions" :size="'md'" v-model="shiftCode" type="text"/>
                        </div>
                        <div class="col-span-full lg:col-span-4">
                            <InputLabel :size="'sm'" value="Name"/>
                            <Input :disabled="disableActions" :size="'md'" v-model="shiftName" type="text"/>
                        </div>

                    </div>

                    <div class="mt-8">
                        <p class="font-medium text-lg">Schedules</p>
                    </div>

                    <DataTable
                        :headers="shiftScheduleHeaders"
                        :disabled="disableActions"
                        :size="'xl'"
                        :stripped="false"
                        :rows="shiftSchedules">
                        <template v-slot:cell.week_day_name="{cell, slot, scrollReference}">
                            <div class="text-base h-[34px]">
                                <div class="h-full flex items-center p-[3px]">
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
                                <div class="h-full flex items-center p-[3px]">
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
                            <div class="flex justify-center mx-[1px]">
                                <Button v-if="!cell.is_day_off" @click="copyToAll(cell)" type="button" :variant="'default'" :icon="'ic:baseline-copy-all'" :size="slot.buttonSize" :label="'Copy to all'"></Button>
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

import {storeToRefs} from "pinia";


useLayout().setNavigationMode('solid');
const route = useRoute();
const {timezoneSelections} = useCommon();
const {isAuthenticated} = useAuth();
const {$authStore, $associationStore, $moment} = useNuxtApp();
const timeDifference = useNuxtApp().$timeDifference as (start: string | null, end: string | null) => string | null;
const clientReadyState = useClientReadyState();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs($associationStore);
const {
    selectedAssociatedCompany,
    selectedAssociatedCompanyPayload
} = storeToRefs($authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompany.value){
        navigateTo("/policies/shifts", {replace: true});
    }
});

const shift = ref<ShiftT | null>(null);
const creatingShift = computed(() => {
    return route.params.id === 'create-shift';
});

definePageMeta({
    middleware: ['auth', 'admin-of-selected-company'],
    validate: async (route) => {

        if (import.meta.server) return true;

        let create = route.params.id === 'create-shift';

        if(create){return true;}

        await laraUseFetch(`/api/shift-check/${route.params.id}`, {
            lazy: false,
            method: 'GET'
        }, {
            onSuccessResponse: async (request, options, response) => {
                shift.value = _get(response, '_data.values.shift', null);
            }
        });

        return !_isEmpty(shift.value);
    }
});

const shiftCode = ref('');
const shiftName = ref('');
const shiftTypeOptions = reactive({
    search: '',
    selection: [
        {text : 'Regular', value: SHIFT_TYPE.REGULAR},
        {text : 'Graveyard', value: SHIFT_TYPE.GRAVEYARD},
    ],
    selected: SHIFT_TYPE.REGULAR
});
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
const timezoneSelectionOptions = reactive({
    search: '',
    selection: timezoneSelections.value,
});

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
                'company_id': selectedAssociatedCompany.value,
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
    }, {
        onSuccessResponse: async (request, options, response) => {
            shift.value = _get(response, '_data.values.shift', null);
            shiftSchedules.value = _get(response, '_data.values.shift_schedules', []);

            shiftCode.value = _get(response, '_data.values.shift.code', '');
            shiftName.value = _get(response, '_data.values.shift.name', '');
            shiftTypeOptions.selected = _get(response, '_data.values.shift.type.value', null);
            shiftIsDefault.selected = _get(response, '_data.values.shift.is_default', false) ? 1 : 0;
        },
    });
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
        cell.timezone = selectedAssociatedCompanyPayload.value?.timezone ?? null;
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
        cell.work_end = shiftTypeIsRegular.value ? '23:59' : '06:00';
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
                shiftSchedule.timezone = selectedAssociatedCompanyPayload.value?.timezone ?? null;
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
                shiftSchedule.timezone = selectedAssociatedCompanyPayload.value?.timezone ?? null;
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
        'company_id': selectedAssociatedCompany.value,
        'code': shiftCode.value,
        'name': shiftName.value,
        'type': shiftTypeOptions.selected,
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
            resolvedShiftModal.value = true;
        },
    });
}

const resolvedShiftModal = ref(false);
const resolvedShift = ref({});
const resolvedShiftModalTitle = computed(() => {
    return `Shift ${creatingShift.value ? 'Created' : 'Updated'}`;
})
</script>

<style scoped>

</style>