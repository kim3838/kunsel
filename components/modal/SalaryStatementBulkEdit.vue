<template>
    <div>
        <slot />

        <DialogModal
            :show="showBulkUpdateErrors"
            :closeable="false"
            @close="closeModal">
            <template #title>
            </template>

            <template #content>
                <div>
                    <fieldset class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-header">Bulk Edit Errors</legend>

                        <DataTable
                            :headers="bulkUpdateErrorsHeaders"
                            :size="'md'"
                            :rows="bulkUpdateErrors"
                            selection>
                            <template v-slot:cell.error="{cell, slot}">
                                <Label invert :size="slot.labelSize" :type="'danger'" :label="cell.error" />
                            </template>
                        </DataTable>
                    </fieldset>
                </div>
            </template>

            <template #footer>
                <div class="flex space-x-2 justify-between">
                    <div class="space-x-2 inline-flex">

                    </div>
                    <div class="space-x-2 inline-flex items-center">
                        <Button
                            :variant="`outline`"
                            :disabled="disableActions"
                            @click="closeModal" :label="'Close'" />
                    </div>
                </div>
            </template>
        </DialogModal>

        <DialogModal
            :max-width="'460px'"
            :show="editing"
            :closeable="false"
            @close="closeModal">
            <template #title>
            </template>

            <template #content>
                <div>
                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">

                        <fieldset class="neutral-border px-2 pb-2 space-y-2">
                            <legend class="text-lbase">Is paid</legend>

                            <div class="flex flex-row gap-10">
                                <div>
                                    <InputLabel :size="'sm'" value="Keep current"/>
                                    <RadioGroup
                                        :disabled="disableActions"
                                        :selections="isPaidKeepCurrentSelection"
                                        :size="'md'"
                                        :orientation="'horizontal'"
                                        :radio-key="'is-paid-keep-current'"
                                        v-model="isPaidKeepCurrent" />
                                </div>
                                <div class="w-full" v-show="!isPaidKeepCurrentComputed">
                                    <InputLabel :size="'sm'" value="Is paid"/>
                                    <RadioGroup
                                        :disabled="disableActions"
                                        :selections="isPaidSelection"
                                        :size="'md'"
                                        :orientation="'horizontal'"
                                        :radio-key="'is-paid'"
                                        v-model="isPaid" />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </template>

            <template #footer>
                <div class="flex space-x-2 justify-between">
                    <div class="space-x-2 inline-flex">
                        <div class="space-x-2 inline-flex items-center">
                            <UnorderedList
                                v-if="pending"
                                :icon="'eos-icons:loading'"
                                :size="'md'"
                                :label="'Please wait...'"/>
                        </div>
                    </div>
                    <div class="space-x-2 inline-flex items-center">
                        <Button
                            :variant="`outline`"
                            :disabled="disableActions"
                            @click="closeModal" :label="'Cancel'" />

                        <Button
                            :disabled="disableActions"
                            @click="bulkUpdate"
                            :label="`Update all`"/>
                    </div>
                </div>
            </template>
        </DialogModal>
    </div>
</template>

<script setup lang="ts">
import type {StringEnumInterface} from "@/public/js/common/type";
import type {TableHeaderT} from "@/public/js/types/data";
import {storeToRefs} from "pinia";

const {$authStore} = useNuxtApp();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
} = storeToRefs($authStore);

const emit = defineEmits(['completed']);

const props = defineProps({
    selectedSalaryStatementIds:{
        type: Array as PropType<number[]>,
        default: () => {
            return [];
        }
    }
});

const isPaidKeepCurrentComputed = computed(() => {return isPaidKeepCurrent.value == 1;})
const isPaidKeepCurrent = ref(1);
const isPaidKeepCurrentSelection = reactive([{text : 'Yes', value: 1}, {text : 'No', value: 0},]);

const isPaidComputed = computed(() => {return isPaid.value == 1;})
const isPaid = ref(1);
const isPaidSelection = reactive([{text : 'Yes', value: 1}, {text : 'No', value: 0},]);

const disableActions = computed(() => {
    return pending.value;
});

const editing = ref(false);

const pending = ref(false);

const bulkEdit = () => {
    editing.value = true;
}

const formBody = computed(() => {

    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,

        keep_is_paid: isPaidKeepCurrentComputed.value,
        is_paid: isPaidComputed.value,

        salary_statement_identifiers: props.selectedSalaryStatementIds
    };
});

const bulkUpdate = async () => {

    pending.value = true;

    await laraFetch('/api/salary-statements', {
        method: 'PATCH',
        body: formBody.value,
    }, {
        onRequestError: () => {
            pending.value = false;
        },
        onResponse: () => {
            pending.value = false;
        },
        onSuccessResponse: (request, options, response) => {

            bulkUpdateErrors.value = _get(response, '_data.values.batch_update_errors', []);
            const hasErrors = bulkUpdateErrors.value.length > 0;
            const resetModalOnClose = !hasErrors;

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: hasErrors ? `Bulk update complete with errors.` : `Bulk update complete.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            if(hasErrors){
                showBulkUpdateErrors.value = true;
            }

            closeModal(resetModalOnClose);
            emit('completed');
        }
    });
}

const showBulkUpdateErrors = ref(false);
const bulkUpdateErrorsHeaders = reactive<TableHeaderT[]>([
    { text: 'Error', value: 'error', alignData: 'left'},
]);
const bulkUpdateErrors = ref([]);

const reset = () => {
    isPaidKeepCurrent.value = 1;
    isPaid.value = 0;

    showBulkUpdateErrors.value = false;
    bulkUpdateErrors.value = [];
}
const closeModal = (resetModal = true) => {
    if(resetModal){
        reset();
    }
    editing.value = false;
};

defineExpose({
    bulkEdit
});
</script>

<style scoped>

</style>