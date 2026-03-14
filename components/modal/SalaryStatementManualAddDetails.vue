<template>
    <div>
        <DialogModal
            :show="showManualAddDetails"
            :closeable="false">
            <template #title>
                Manual add payroll items
            </template>
            <template #content>

                <div class="space-y-2">

                    <div>
                        <div class="text-base">
                            Payroll #: {{payrollNumber}}
                        </div>
                        <div class="text-base subtitle-color">
                            {{employeeNumberAndName}}
                        </div>
                    </div>

                    <div class="mb-2 flex items-center min-h-8">
                        <Button class="w-min" :disabled="disableActions" :variant="'outline'" :size="'sm'" :icon="'mdi:plus'" :label="'Add payroll item'" @click="addManualDetail"></Button>
                    </div>

                    <DataTable
                        :headers="headers"
                        :disabled="disableActions"
                        :size="'lg'"
                        :stripped="true"
                        :rows="manualDetails">
                        <template v-slot:cell.actions="{cell,slot, headerIndex, rowIndex}">
                            <div class="h-[32px] mx-0.5 space-x-0.5 w-full flex items-center">
                                <Button
                                    class="w-min"
                                    :variant="'outline'"
                                    :size="slot.buttonSize"
                                    :disabled="disableActions"
                                    :icon="'mdi:delete-forever'"
                                    @click="deleteManualDetail(rowIndex, cell.id)"/>
                            </div>
                        </template>
                        <template v-slot:cell.component_sub_type="{cell, slot, scrollReference, rowIndex}">
                            <div class="mx-0.5 flex items-center h-[32px]">
                                <SingleSelectWrapper
                                    :key="componentTypeOptionsKey"
                                    in-horizontal-scrollable
                                    drop-shadow
                                    :custom-identifier="rowIndex"
                                    :scroll-reference="scrollReference"
                                    :label="'Select component sub type'"
                                    :icon="'tdesign:component-checkbox'"
                                    value-persist
                                    :size="slot.selectSize"
                                    v-model="cell.component_sub_type"
                                    :options="componentTypeOptions"
                                />
                            </div>
                        </template>
                        <template v-slot:cell.component_name="{cell,slot}">
                            <div class="mx-0.5 flex items-center">
                                <Input class="w-full" v-model="cell.component_name" :size="slot.inputSize" />
                            </div>
                        </template>
                        <template v-slot:cell.amount="{cell,slot}">
                            <div class="mx-0.5 flex items-center">
                                <Input class="w-full" :type="'number'" type-strict high-light-all-text-on-focus v-model="cell.amount" :size="slot.inputSize" />
                            </div>
                        </template>
                    </DataTable>

                    <div class="text-sm subtitle-color">
                        Existing manual payroll entries will be removed.
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="flex space-x-2 justify-between">
                    <div class="space-x-2 inline-flex">
                        <div class="space-x-2 inline-flex items-center">
                            <UnorderedList
                                v-if="disableActions"
                                :icon="'eos-icons:loading'"
                                :size="'md'"
                                :label="'Please wait...'"/>
                        </div>
                    </div>
                    <div class="space-x-2 inline-flex items-center">
                        <Button
                            :variant=" 'outline'"
                            @click="close"
                            :label="'Cancel'" />
                        <Button
                            class="w-min"
                            :variant="'default'"
                            :size="'md'"
                            :icon="`mdi:auto-fix`"
                            :disabled="disableActions"
                            :label="`Submit & Recompute statement`"
                            @click="submit"/>
                    </div>
                </div>
            </template>
        </DialogModal>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT} from "@/public/js/types/data";
import type {StringEnumInterface} from "@/public/js/common/type";
import type {PayrollT, SalaryStatementManualAddDetailT} from "@/public/js/types/payroll";
import {storeToRefs} from "pinia";

const {$authStore} = useNuxtApp();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number|string) => {
    text: string,
    value: number|string
};
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
} = storeToRefs($authStore);

const props = defineProps({
    showManualAddDetails: {
        type: Boolean,
        default: false,
    },
    refetchPayrollOnResolve: {
        type: Object as PropType<Partial<PayrollT>>,
        default: () => ({}),
    },
    salaryStatementPayload: {
        type: Object,
        default: () => {
            return {};
        }
    },
});

const emit = defineEmits([
    'update:showManualAddDetails',
    'update:salaryStatementPayload',
    'resolved',
    'cancelled',
]);

const payrollNumber = ref('');
const employeeNumberAndName = ref('');

watch(() => props.showManualAddDetails, (show) => {

    if(show){
        payrollNumber.value = props.salaryStatementPayload.payroll.number;
        employeeNumberAndName.value = `(${props.salaryStatementPayload.employee_number}) ${props.salaryStatementPayload.employee_full_name}`;
        addManualDetail();
    }
})

const headers = reactive<TableHeaderT[]>([
    {text: '', value: 'actions', minWidth: '41.38px', width: '41.38px', maxWidth: '41.38px'},
    {text: '', value: 'component_sub_type', minWidth: '240px'},
    {text: 'Name', value: 'component_name', minWidth: '110px', alignData: 'left'},
    {text: 'Amount', value: 'amount', minWidth: '110px', alignData: 'right'},
]);

const manualDetails = ref<SalaryStatementManualAddDetailT[]>([]);

const deleteManualDetail = (index: number, id: string | number | undefined) => {
    manualDetails.value.splice(index, 1);
}

const addManualDetail = () => {

    manualDetails.value.push({
        component_sub_type: FORMULABLE_COMPONENT_SUB_TYPE.MANUAL_DEDUCTION as string,
        component_name: '',
        amount: 0
    });
}

const componentTypeOptionsKey = shallowRef(0);
const componentTypeOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(FORMULABLE_COMPONENT_SUB_TYPE_NAME, FORMULABLE_COMPONENT_SUB_TYPE.MANUAL_EARNING as string),
        $enumerableOption(FORMULABLE_COMPONENT_SUB_TYPE_NAME, FORMULABLE_COMPONENT_SUB_TYPE.MANUAL_DEDUCTION as string),
    ]
});

const pending = ref(false);

const disableActions = computed(() => {
    return pending.value;
});

const form = computed(()=>{
    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        ...(props.refetchPayrollOnResolve.ulid
            ? { refetch_payroll_ulid: props.refetchPayrollOnResolve.ulid }
            : {}),
        manual_add_details: manualDetails.value.map((detail: SalaryStatementManualAddDetailT) => {return{
            component_sub_type: detail.component_sub_type,
            component_name: detail.component_name,
            amount: detail.amount,
        }}),
    }
})

const submit = async() => {

    pending.value = true;

    await laraFetch(`/api/salary-statement-manual-add-details/${props.salaryStatementPayload.ulid}`, {
        method: `POST`,
        body: form.value,
    }, {
        onRequestError: () => {
            pending.value = false;
        },
        onResponse: () => {
            pending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            let payroll = _get(response, '_data.values.payroll', {}) as PayrollT;

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `Salary statement updated.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            emit('update:showManualAddDetails', false);
            emit('update:salaryStatementPayload', {});
            emit('resolved', {payroll: payroll});
            reset();
        },
    });
}

const reset = () => {
    componentTypeOptionsKey.value++;
    manualDetails.value = [];
    employeeNumberAndName.value = '';
}

const close = () => {
    emit('update:showManualAddDetails', false);
    emit('update:salaryStatementPayload', {});
    emit('cancelled');
    reset();
}
</script>


<style scoped>

</style>