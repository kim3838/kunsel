<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <DialogModal
                    :max-width="'840px'"
                    :show="resolvedLeaveTypeModal"
                    :closeable="false">
                    <template #title>
                        {{resolvedLeaveTypeModalTitle}}
                    </template>
                    <template #content>

                        <div class="mt-4 space-y-2">

                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="font-header">Leave Type</legend>
                                <table class="border-separate font-data">
                                    <tbody>
                                    <tr><td class="font-semibold">Code</td><td class="pl-2">{{ _get(resolvedLeaveType, 'code', null) }}</td></tr>
                                    <tr><td class="font-semibold">Name</td><td class="pl-2">{{ _get(resolvedLeaveType, 'name', null) }}</td></tr>
                                    <tr><td class="font-semibold">Type</td><td class="pl-2">{{ _get(resolvedLeaveType, 'type.text', null) }}</td></tr>
                                    <tr><td class="font-semibold">Paid</td><td class="pl-2">{{ _get(resolvedLeaveType, 'is_paid', false) ? 'Yes' : 'No' }}</td></tr>
                                    <tr><td class="font-semibold">Monetizable</td><td class="pl-2">{{ _get(resolvedLeaveType, 'monetizable', false) ? 'Yes' : 'No' }}</td></tr>

                                    <tr><td class="font-semibold">Eligibility Employment Types</td><td class="pl-2">{{ _get(resolvedLeaveType, 'eligibility_employment_types_readable', null) }}</td></tr>
                                    <tr><td class="font-semibold">Balance upon eligibility</td><td class="pl-2">{{ _get(resolvedLeaveType, 'initial_balance_upon_eligibility', null) }}</td></tr>

                                    <tr><td class="font-semibold">Period</td><td class="pl-2">{{ _get(resolvedLeaveType, 'period_type.text', null) }}</td></tr>
                                    <tr><td class="font-semibold"></td><td class="pl-2">{{ _get(resolvedLeaveType, 'period_readable', null) }}</td></tr>

                                    <tr><td class="font-semibold">Usage Limit</td><td class="pl-2">{{ _get(resolvedLeaveType, 'limit_usage_value_readable', null) }}</td></tr>

                                    <tr><td class="font-semibold">Carry Over</td><td class="pl-2">{{ _get(resolvedLeaveType, 'carry_over_readable', null) }}</td></tr>
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div class="space-x-2 inline-flex items-center">
                                <Button :icon="'ic:sharp-keyboard-arrow-left'" @click="navigateTo({path: `/policies/leave-types`, replace: true})" :label="'Back to leave types'" />
                                <Button v-if="!creatingLeaveType" @click="resetResolved" :label="'Close'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/policies/leave-types`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <div class="px-[20px] space-y-6">

                    <div v-if="false">
                        <span class="font-semibold">Code:</span> {{leaveTypeCode}}<br>
                        <span class="font-semibold">Name:</span> {{leaveTypeName}}<br>
                        <span class="font-semibold">Type Options:</span> {{leaveTypeOptions}}<br>
                        <span class="font-semibold">Is Paid:</span> {{leaveTypeIsPaid}}<br>
                        <span class="font-semibold">Is Monetizable:</span> {{leaveTypeIsMonetizable}}<br>
                        <br>
                        <span class="font-semibold">Limit Usage:</span> {{leaveTypeLimitUsage}}<br>
                        <span class="font-semibold">Usage Limit Type Options:</span> {{leaveTypeLimitUsageSpanTypeOptions}}<br>
                        <span class="font-semibold">Limit Usage Span Value:</span> {{leaveTypeLimitUsageSpanValue}}<br>
                        <span class="font-semibold">Limit Usage Value:</span> {{leaveTypeLimitUsageValue}}<br>
                        <br>
                        <span class="font-semibold">Eligibility Employment Types:</span> {{leaveTypeEligibilityEmploymentTypes}}<br>
                        <span class="font-semibold">Initial Balance Upon Eligibility:</span> {{leaveTypeInitialBalanceUponEligibility}}<br>
                        <br>
                        <span class="font-semibold">Leave Period Type Options:</span> {{leaveTypePeriodTypeOptions}}<br>
                        <span class="font-semibold">Interval Span Type Options:</span> {{leaveTypePeriodIntervalSpanTypeOptions}}<br>
                        <span class="font-semibold">Interval Span Value:</span> {{leaveTypePeriodIntervalSpanValue}}<br>
                        <span class="font-semibold">Calendar Span Value:</span> {{leaveTypePeriodCalendarSpanValue}}<br>
                        <br>
                        <span class="font-semibold">Carry Over Balance:</span> {{leaveTypeCarryOverBalancePerPeriodValue}}<br>
                        <span class="font-semibold">Carry Over Balance Type:</span> {{leaveTypeCarryOverBalanceTypeValue}}<br>
                        <span class="font-semibold">Carry Over Balance Value:</span> {{leaveTypeCarryOverBalanceValue}}<br>
                    </div>

                    <fieldset class="neutral-border px-2  pb-2 space-y-2">
                        <legend class="text-lg font-header">Leave Type Information</legend>

                        <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            <div>
                                <InputLabel :size="'sm'" value="Type"/>
                                <SingleSelect :disabled="disableActions" value-persist drop-shadow :size="'md'" :options="leaveTypeOptions"/>
                            </div>
                            <div>
                                <InputLabel :size="'sm'" value="Code"/>
                                <Input :disabled="disableActions" :size="'md'" v-model="leaveTypeCode"/>
                            </div>
                            <div class="col-span-full lg:col-span-3">
                                <InputLabel :size="'sm'" value="Name"/>
                                <Input :disabled="disableActions" :size="'md'" v-model="leaveTypeName"/>
                            </div>
                        </div>

                        <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            <div class="flex flex-col">
                                <InputLabel :size="'sm'" value="Is paid?"/>
                                <RadioGroup
                                    :selections="leaveTypeIsPaidSelection"
                                    :size="'md'"
                                    :orientation="'horizontal'"
                                    :radio-key="'leave_type_is_paid'"
                                    v-model="leaveTypeIsPaid" />
                            </div>
                            <div class="flex flex-col">
                                <InputLabel :size="'sm'" value="Is monetizable?"/>
                                <RadioGroup
                                    :selections="leaveTypeIsMonetizableSelection"
                                    :size="'md'"
                                    :orientation="'horizontal'"
                                    :radio-key="'leave_type_is_monetizable'"
                                    v-model="leaveTypeIsMonetizable" />
                            </div>
                        </div>
                    </fieldset>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <fieldset class="neutral-border px-2  pb-2 space-y-2">
                            <legend class="text-lg font-header">Eligibility</legend>

                            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4">
                                <div class="col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3">
                                    <InputLabel :size="'sm'" value="Eligibility Employment types"/>
                                    <MultiSelect :searchable="false" drop-shadow :size="'md'" :options="leaveTypeEligibilityEmploymentTypes"/>
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Balance upon eligibility"/>
                                    <Input :disabled="disableActions" :size="'md'" v-model="leaveTypeInitialBalanceUponEligibility" high-light-all-text-on-focus type-strict :type="'number'"/>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset class="neutral-border px-2  pb-2 space-y-2">
                            <legend class="text-lg font-header">Period</legend>

                            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4">
                                <div>
                                    <InputLabel :size="'sm'" value="Period type"/>
                                    <SingleSelect :disabled="disableActions" value-persist drop-shadow :size="'md'" :options="leaveTypePeriodTypeOptions" @valueChange="leaveTypePeriodTypeChanged"/>
                                </div>
                                <div v-if="leaveTypePeriodTypeOptions.selected == LEAVE_PERIOD_TYPE.INTERVAL">
                                    <InputLabel :size="'sm'" value="Interval span"/>
                                    <Input :disabled="disableActions" :size="'md'" v-model="leaveTypePeriodIntervalSpanValue" high-light-all-text-on-focus type-strict :type="'number'"/>
                                </div>
                                <div v-if="leaveTypePeriodTypeOptions.selected == LEAVE_PERIOD_TYPE.INTERVAL">
                                    <InputLabel :size="'sm'" value="Interval span range"/>
                                    <SingleSelect :disabled="disableActions" value-persist drop-shadow :size="'md'" :options="leaveTypePeriodIntervalSpanTypeOptions"/>
                                </div>
                                <div v-if="leaveTypePeriodTypeOptions.selected == LEAVE_PERIOD_TYPE.CALENDAR_YEAR" class="flex flex-col">
                                    <div class="flex-none h-[1rem]"></div>
                                    <SingleSelect :disabled="disableActions" value-persist drop-shadow :size="'md'" v-model="leaveTypePeriodCalendarSpanValue" :options="leaveTypePeriodCalendarSpanOptions"/>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <fieldset class="neutral-border px-2  pb-2 space-y-2">
                            <legend class="text-lg font-header">Usage Limit</legend>

                            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4">
                                <div class="flex flex-col">
                                    <InputLabel :size="'sm'" value="Limit usage?"/>
                                    <RadioGroup
                                        :selections="leaveTypeLimitUsageSelection"
                                        :size="'md'"
                                        :orientation="'horizontal'"
                                        :radio-key="'leave_type_limit_usage'"
                                        v-model="leaveTypeLimitUsage" />
                                </div>
                                <div v-if="leaveTypeLimitUsage == 1">
                                    <InputLabel :size="'sm'" value="Limit usage value"/>
                                    <Input :disabled="disableActions" :size="'md'" v-model="leaveTypeLimitUsageValue" high-light-all-text-on-focus type-strict :type="'number'"/>
                                </div>
                                <div v-if="leaveTypeLimitUsage == 1">
                                    <InputLabel :size="'sm'" value="Limit span"/>
                                    <Input :disabled="disableActions" :size="'md'" v-model="leaveTypeLimitUsageSpanValue" high-light-all-text-on-focus type-strict :type="'number'"/>
                                </div>
                                <div v-if="leaveTypeLimitUsage == 1">
                                    <InputLabel :size="'sm'" value="Limit span range"/>
                                    <SingleSelect :disabled="disableActions" value-persist drop-shadow :size="'md'" :options="leaveTypeLimitUsageSpanTypeOptions"/>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset class="neutral-border px-2  pb-2 space-y-2">
                            <legend class="text-lg font-header">Carry Over</legend>

                            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4">
                                <div class="flex flex-col">
                                    <InputLabel :size="'sm'" value="Carry over balance"/>
                                    <RadioGroup
                                        :selections="leaveTypeCarryOverBalancePerPeriodSelection"
                                        :size="'md'"
                                        :orientation="'horizontal'"
                                        :radio-key="'leave_type_carry_over_balance_per_new_period'"
                                        v-model="leaveTypeCarryOverBalancePerPeriodValue" />
                                </div>
                                <div v-if="leaveTypeCarryOverBalancePerPeriodValue == 1" class="flex flex-col">
                                    <InputLabel :size="'sm'" value="Carry over type"/>
                                    <RadioGroup
                                        :selections="leaveTypeCarryOverBalanceTypeSelection"
                                        :size="'md'"
                                        :orientation="'horizontal'"
                                        :radio-key="'leave_type_carry_over_balance_type'"
                                        v-model="leaveTypeCarryOverBalanceTypeValue" />
                                </div>
                                <div v-if="leaveTypeCarryOverBalancePerPeriodValue == 1 && leaveTypeCarryOverBalanceTypeValue == LEAVE_CARRY_OVER_TYPE.LIMIT">
                                    <InputLabel :size="'sm'" value="Carry over limit"/>
                                    <Input :disabled="disableActions" :size="'md'" v-model="leaveTypeCarryOverBalanceValue" high-light-all-text-on-focus type-strict :type="'number'"/>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div>
                        <div>
                            <p class="text-lg font-header">Balance Per Period</p>
                        </div>

                        <div class="mb-2 flex items-center min-h-8">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="''" @click="addBalancePerPeriod"></Button>
                        </div>

                        <DataTable
                            :headers="leaveTypeBalancePerPeriodHeaders"
                            :disabled="disableActions"
                            :size="'lg'"
                            :stripped="false"
                            :rows="leaveTypeBalancePerPeriods">
                            <template v-slot:cell.actions="{cell,slot, headerIndex, rowIndex}">
                                <div class="h-[32px] mx-0.5 space-x-0.5 w-full flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="slot.buttonSize"
                                        :disabled="disableActions"
                                        :icon="'mdi:delete-forever'"
                                        @click="deleteBalancePerPeriod(rowIndex, cell.id)"/>
                                </div>
                            </template>
                            <template v-slot:cell.from_period="{cell, slot, scrollReference}">
                                <div class="mx-0.5">
                                    <Input type-strict :type="'number'" v-model="cell.from_period" :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.and_so_on="{cell, slot, scrollReference}">
                                <div class="flex justify-center">
                                    <Checkbox :size="slot.checkBoxSize" @change="toggleBalancePerPeriodAsAndSoOn(cell)" v-model="cell.and_so_on" />
                                </div>
                            </template>
                            <template v-slot:cell.to_period="{cell, slot, scrollReference}">
                                <div v-if="!cell.and_so_on" class="mx-0.5">
                                    <Input type-strict :type="'number'" v-model="cell.to_period" :size="slot.inputSize" />
                                </div>
                            </template>
                            <template v-slot:cell.balance="{cell, slot, scrollReference}">
                                <div class="mx-0.5">
                                    <Input type-strict :type="'number'" v-model="cell.balance" :size="slot.inputSize" />
                                </div>
                            </template>
                        </DataTable>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2">
                        <Button class="w-min" ref="submitButton" type="submit" @click="formSubmit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="submitLabel"></Button>
                    </div>
                </div>

            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT, TableRowT} from "@/public/js/types/data";
import type {EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import type {LeaveTypeT, LeaveTypeBalancePerPeriodT} from "@/public/js/types/leave";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Leave Types`}});
useLayout().setNavigationMode('solid');
const route = useRoute();
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId,
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        navigateTo("/policies/leave-types", {replace: true});
    }
});

const leaveType = ref<LeaveTypeT | null>(null);
const creatingLeaveType = computed(() => {
    return route.params.id === 'create-leave-type';
});

definePageMeta({
    middleware: ['auth', 'admin-of-selected-company',
        async (to) => {

            if(import.meta.server || to.params.id === 'create-leave-type'){return true;}

            const {data, error} = await laraUseFetch(`/api/leave-type-check/${to.params.id}`, {method: 'GET',}, {}, false);

            if(_isEmpty(data.value) && !_isEmpty(error.value)){
                let responseCode = _get(error.value, 'data.code', null);

                throw createError({ statusCode: responseCode, statusMessage: useCoreStore().servicePayloadMessage, fatal: true});
            }
        }
    ]
});

const leaveTypeCode = ref('');
const leaveTypeName = ref('');
const leaveTypeOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: number | null
}>({
    search: '',
    selection: [
        $enumerableOption(LEAVE_TYPE_NAME, LEAVE_TYPE.VACATION as number),
        $enumerableOption(LEAVE_TYPE_NAME, LEAVE_TYPE.SICK as number),
        $enumerableOption(LEAVE_TYPE_NAME, LEAVE_TYPE.EMERGENCY as number),
    ],
    selected: LEAVE_TYPE.VACATION as number
});
const leaveTypeIsPaid = ref(0);
const leaveTypeIsPaidSelection = reactive([
    {text : 'Yes', value: 1},
    {text : 'No', value: 0},
]);
const leaveTypeIsMonetizable = ref(0);
const leaveTypeIsMonetizableSelection = reactive([
    {text : 'Yes', value: 1},
    {text : 'No', value: 0},
]);

const leaveTypeLimitUsage = ref(0);
const leaveTypeLimitUsageSelection = reactive([
    {text : 'Yes', value: 1},
    {text : 'No', value: 0},
]);
const leaveTypeLimitUsageSpanTypeOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: number | null
}>({
    search: '',
    selection: [
        $enumerableOption(LEAVE_USAGE_SPAN_TYPE_NAME, LEAVE_USAGE_SPAN_TYPE.YEAR as number),
        $enumerableOption(LEAVE_USAGE_SPAN_TYPE_NAME, LEAVE_USAGE_SPAN_TYPE.MONTH as number),
        $enumerableOption(LEAVE_USAGE_SPAN_TYPE_NAME, LEAVE_USAGE_SPAN_TYPE.DAY as number),
    ],
    selected: LEAVE_USAGE_SPAN_TYPE.YEAR as number
});
const leaveTypeLimitUsageSpanValue = ref(1);
const leaveTypeLimitUsageValue = ref(0);

const leaveTypeEligibilityEmploymentTypes = reactive<{
    search: string,
    selection: EnumSelection,
    selected: number[]
}>({
    search: '',
    selection: [
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.OJT as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.INTERN as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.PROBATIONARY as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.FULL_TIME as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.PART_TIME as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.CONTRACT as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.NOT_SPECIFIED as number),
    ],
    selected: []
});
const leaveTypeInitialBalanceUponEligibility = ref(0);

const leaveTypePeriodTypeOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: number | null
}>({
    search: '',
    selection: [
        $enumerableOption(LEAVE_PERIOD_TYPE_NAME, LEAVE_PERIOD_TYPE.CALENDAR_YEAR as number),
        $enumerableOption(LEAVE_PERIOD_TYPE_NAME, LEAVE_PERIOD_TYPE.INTERVAL as number),
    ],
    selected: LEAVE_PERIOD_TYPE.CALENDAR_YEAR as number
});
const leaveTypePeriodIntervalSpanValue = ref(1);
const leaveTypePeriodIntervalSpanTypeOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: number | null
}>({
    search: '',
    selection: [
        $enumerableOption(LEAVE_INTERVAL_SPAN_TYPE_NAME, LEAVE_INTERVAL_SPAN_TYPE.YEAR as number),
        $enumerableOption(LEAVE_INTERVAL_SPAN_TYPE_NAME, LEAVE_INTERVAL_SPAN_TYPE.MONTH as number),
        $enumerableOption(LEAVE_INTERVAL_SPAN_TYPE_NAME, LEAVE_INTERVAL_SPAN_TYPE.DAY as number),
    ],
    selected: LEAVE_INTERVAL_SPAN_TYPE.YEAR as number
});
const leaveTypePeriodCalendarSpanValue = ref(MONTH.JANUARY as number);
const leaveTypePeriodCalendarSpanOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(MONTH_NAMES, MONTH.JANUARY as number),
        $enumerableOption(MONTH_NAMES, MONTH.FEBRUARY as number),
        $enumerableOption(MONTH_NAMES, MONTH.MARCH as number),
        $enumerableOption(MONTH_NAMES, MONTH.APRIL as number),
        $enumerableOption(MONTH_NAMES, MONTH.MAY as number),
        $enumerableOption(MONTH_NAMES, MONTH.JUNE as number),
        $enumerableOption(MONTH_NAMES, MONTH.JULY as number),
        $enumerableOption(MONTH_NAMES, MONTH.AUGUST as number),
        $enumerableOption(MONTH_NAMES, MONTH.SEPTEMBER as number),
        $enumerableOption(MONTH_NAMES, MONTH.OCTOBER as number),
        $enumerableOption(MONTH_NAMES, MONTH.NOVEMBER as number),
        $enumerableOption(MONTH_NAMES, MONTH.DECEMBER as number),
    ]
});

const leaveTypeCarryOverBalancePerPeriodValue = ref(0);
const leaveTypeCarryOverBalancePerPeriodSelection = reactive([
    {text : 'Yes', value: 1},
    {text : 'No', value: 0},
]);

const leaveTypeCarryOverBalanceTypeValue = ref(LEAVE_CARRY_OVER_TYPE.ALL as number);
const leaveTypeCarryOverBalanceTypeSelection = reactive([
    $enumerableOption(LEAVE_CARRY_OVER_TYPE_NAME, LEAVE_CARRY_OVER_TYPE.ALL as number),
    $enumerableOption(LEAVE_CARRY_OVER_TYPE_NAME, LEAVE_CARRY_OVER_TYPE.LIMIT as number),
]);
const leaveTypeCarryOverBalanceValue = ref(0);

const leaveTypePeriodTypeChanged = (value: number) => {

    if(value == LEAVE_PERIOD_TYPE.CALENDAR_YEAR){
        leaveTypePeriodCalendarSpanValue.value = MONTH.JANUARY as number;
    }

    if(value == LEAVE_PERIOD_TYPE.INTERVAL){
        leaveTypePeriodIntervalSpanValue.value = 1;
        leaveTypePeriodIntervalSpanTypeOptions.selected = LEAVE_INTERVAL_SPAN_TYPE.YEAR as number;
    }
}

const leaveTypeBalancePerPeriodHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions', minWidth: '41.38px', width: '41.38px', maxWidth: '41.38px'},
    { text: 'From Period', value: 'from_period', alignData: 'left', minWidth: '100px', width: '100px', maxWidth: '100px'},
    { text: 'And so on', value: 'and_so_on', alignData: 'left'},
    { text: 'To Period', value: 'to_period', alignData: 'left', minWidth: '100px', width: '100px', maxWidth: '100px'},
    { text: 'Balance', value: 'balance', alignData: 'right', minWidth: '100px', width: '100px', maxWidth: '100px'},
]);
const leaveTypeBalancePerPeriods = ref<LeaveTypeBalancePerPeriodT[]>([]);
const splicedLeaveTypeBalancePerPeriods = ref<number[]>([]);
const toggleBalancePerPeriodAsAndSoOn = (cell: TableRowT) => {
    if(cell.and_so_on){
        cell.to_period = null;
    } else {
        cell.to_period = 0;
    }
}
const deleteBalancePerPeriod = (index: number, id: string | number | undefined) => {
    leaveTypeBalancePerPeriods.value.splice(index, 1);

    if(id){
        let splicedId = id as number;
        splicedLeaveTypeBalancePerPeriods.value.push(splicedId);
    }
}
const addBalancePerPeriod = () => {

    if(creatingLeaveType.value){
        leaveTypeBalancePerPeriods.value.push({
            leave_type_id: null,
            from_period: 0,
            and_so_on: true,
            to_period: null,
            balance: 0,
        })
    } else {
        leaveTypeBalancePerPeriods.value.push({
            leave_type_id: leaveType.value?.id as number,
            from_period: 0,
            and_so_on: true,
            to_period: null,
            balance: 0,
        })
    }
}

const fetchLeaveType = async () => {

    if(route.params.id === 'create-leave-type'){return;}

    if(import.meta.server){return;}

    await laraFetch(`/api/leave-type/${route.params.id}`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            leaveType.value = _get(response, '_data.values.leave_type', null);
            splicedLeaveTypeBalancePerPeriods.value = [];
            leaveTypeBalancePerPeriods.value = _get(response, '_data.values.leave_type_balance_per_period', []);

            leaveTypeCode.value = _get(response, '_data.values.leave_type.code', '');
            leaveTypeName.value = _get(response, '_data.values.leave_type.name', '');
            leaveTypeOptions.selected = _get(response, '_data.values.leave_type.type.value', null);
            leaveTypeIsPaid.value = _get(response, '_data.values.leave_type.is_paid', 0);
            leaveTypeIsMonetizable.value = _get(response, '_data.values.leave_type.monetizable', 0);

            leaveTypeLimitUsage.value = _get(response, '_data.values.leave_type.limit_usage', 0);

            if(leaveTypeLimitUsage.value){
                leaveTypeLimitUsageSpanTypeOptions.selected = _get(response, '_data.values.leave_type.limit_usage_span_type.value', null);
                leaveTypeLimitUsageSpanValue.value = _get(response, '_data.values.leave_type.limit_usage_span_value', 0);
                leaveTypeLimitUsageValue.value = _get(response, '_data.values.leave_type.limit_usage_value', 0);
            }

            leaveTypeEligibilityEmploymentTypes.selected = _get(response, '_data.values.leave_type.eligibility_employment_types', []);

            leaveTypePeriodTypeOptions.selected = _get(response, '_data.values.leave_type.period_type.value', null);
            leaveTypePeriodIntervalSpanValue.value = _get(response, '_data.values.leave_type.period_interval_span_value', 0);
            leaveTypePeriodIntervalSpanTypeOptions.selected = _get(response, '_data.values.leave_type.period_interval_span_type.value', null);
            leaveTypePeriodCalendarSpanValue.value = _get(response, '_data.values.leave_type.period_calendar_span_value', MONTH.JANUARY as number);

            leaveTypeInitialBalanceUponEligibility.value = _get(response, '_data.values.leave_type.initial_balance_upon_eligibility', 0);

            leaveTypeCarryOverBalancePerPeriodValue.value = _get(response, '_data.values.leave_type.carry_over_balance_per_new_period', 0);
            leaveTypeCarryOverBalanceTypeValue.value = _get(response, '_data.values.leave_type.carry_over_balance_type.value', LEAVE_CARRY_OVER_TYPE.ALL as number);
            leaveTypeCarryOverBalanceValue.value = _get(response, '_data.values.leave_type.carry_over_balance_value', 0);
        },
    });
};
await fetchLeaveType();

const formPending = ref(false);
const disableActions = computed(() => {
    return formPending.value
});

const submitLabel = computed(() => {
    return formPending.value ? 'Please wait' : (!creatingLeaveType.value ? 'Save' : 'Submit');
});
const leaveTypeSubmitAction = computed(() => {
    return !creatingLeaveType.value ? 'PATCH' : 'POST';
});
const leaveTypeSubmitPath = computed(() => {
    return !creatingLeaveType.value ? `/api/leave-type/${leaveType.value?.ulid}` : `/api/leave-type`;
});
const leaveTypeFormBody = computed(() => {

    return{
        'company_id': selectedAssociatedCompanyId.value,
        'code': leaveTypeCode.value,
        'name': leaveTypeName.value,
        'type': leaveTypeOptions.selected,
        'is_paid': leaveTypeIsPaid.value,
        'monetizable': leaveTypeIsMonetizable.value,

        'limit_usage': leaveTypeLimitUsage.value,
        'limit_usage_span_type': leaveTypeLimitUsageSpanTypeOptions.selected,
        'limit_usage_span_value': leaveTypeLimitUsage.value == 1 ? leaveTypeLimitUsageSpanValue.value : 0,
        'limit_usage_value': leaveTypeLimitUsage.value == 1 ? leaveTypeLimitUsageValue.value : 0,

        'eligibility_employment_types': leaveTypeEligibilityEmploymentTypes.selected,
        'initial_balance_upon_eligibility': leaveTypeInitialBalanceUponEligibility.value,

        'period_type': leaveTypePeriodTypeOptions.selected,
        'period_interval_span_type': leaveTypePeriodIntervalSpanTypeOptions.selected,
        'period_interval_span_value': leaveTypePeriodTypeOptions.selected == LEAVE_PERIOD_TYPE.INTERVAL
            ? leaveTypePeriodIntervalSpanValue.value
            : 0,
        'period_calendar_span_value': leaveTypePeriodCalendarSpanValue.value,

        'carry_over_balance_per_new_period': leaveTypeCarryOverBalancePerPeriodValue.value,
        'carry_over_balance_type': leaveTypeCarryOverBalanceTypeValue.value,
        'carry_over_balance_value': leaveTypeCarryOverBalancePerPeriodValue.value == 1 && leaveTypeCarryOverBalanceTypeValue.value == LEAVE_CARRY_OVER_TYPE.LIMIT
            ? leaveTypeCarryOverBalanceValue.value
            : 0,

        'spliced_leave_type_balance_per_period' : splicedLeaveTypeBalancePerPeriods.value,
        'leave_type_balance_per_period': leaveTypeBalancePerPeriods.value
    };
});

const formSubmit = async() => {

    await laraFetch(leaveTypeSubmitPath.value, {
        method: leaveTypeSubmitAction.value,
        body: leaveTypeFormBody.value,
    }, {
        onRequestError: () => {},
        onResponse: () => {},
        onNotAcceptableResponse: async (request, response, options) => {
            formPending.value = false;
        },
        onUnprocessableContentResponse: async (request, response, options) => {
            formPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            resolvedLeaveType.value = _get(response, '_data.values.leave_type', null) as LeaveTypeT;
            resolvedLeaveTypeModal.value = true;
        },
    });
}

const resolvedLeaveTypeModal = ref(false);
const resolvedLeaveType = ref({});
const resolvedLeaveTypeModalTitle = computed(() => {
    return `Leave Type ${creatingLeaveType.value ? 'Created' : 'Updated'}`;
})
const resetResolved = async () => {
    await fetchLeaveType();
    resolvedLeaveTypeModal.value = false;
    resolvedLeaveType.value = {};
}
</script>

<style scoped>

</style>