<template>
    <div>
        <!--Confirm Dialog-->
        <DialogModal
            :show="createRequestableWorkFlow && !showResult"
            :max-width="'480px'"
            :closeable="false">
            <template #title>
                {{`Confirm ${APPROVAL_ACTION_NAME[requestableWorkFlowAction]}`}}
            </template>
            <template #content>
                <div ref='modalContentContainer'>

                    <div class="pt-2 mx-auto max-w-screen-xl space-y-4">

                        <form @submit.prevent="applyRequestableWorkflow()">
                            <div class="grid gap-2 grid-cols-4">
                                <div class="col-span-full">
                                    <InputLabel :size="'sm'" value="Remarks"/>
                                    <Input
                                        ref="remarksReference"
                                        :disabled="pending"
                                        :size="'md'"
                                        v-model="remarks"/>
                                </div>
                            </div>
                        </form>

                        <Label v-if="!requestable.successful" invert :size="'md'" :type="'danger'" :label="requestable.message" />
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="mx-auto max-w-screen-xl">
                    <div class="flex space-x-2 justify-between">
                        <div class="space-x-2 inline-flex items-center">
                            <UnorderedList v-if="pending" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        </div>

                        <div class="space-x-2 inline-flex items-center">
                            <Button
                                class="w-min"
                                :variant=" 'outline'"
                                :size="'md'"
                                :disabled="pending"
                                :label="'Close'"
                                @click="closeModal"/>
                            <Button
                                class="w-min"
                                :size="'md'"
                                :disabled="pending"
                                :label="'Confirm'"
                                @click="applyRequestableWorkflow()"/>
                        </div>
                    </div>
                </div>
            </template>
        </DialogModal>

        <!--Results Dialog-->
        <DialogModal
            :show="showResult"
            :closeable="false">
            <template #title>
            </template>
            <template #content>
                <div class="pt-2 mx-auto max-w-screen-xl space-y-4">
                    <fieldset class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-header">Results</legend>

                        <div class="max-h-[270px] overflow-y-auto">
                            <DataTable
                                :headers="resultsHeaders"
                                :size="'md'"
                                :rows="resultsData"
                                selection>
                                <template v-slot:cell.resolved="{cell,slot}">
                                    <div class="p-[3px]">{{cell.resolved ? `Yes` : `No`}}</div>
                                </template>
                                <template v-slot:cell.results="{cell,slot}">
                                    <div class="p-[3px]">{{cell.resolved ? APPROVAL_ACTION_NAME_PAST_TENSE[requestableWorkFlowAction] : cell.error as string}}</div>
                                </template>
                                <template v-slot:cell.result="{cell,slot}">
                                    <div class="px-[3px]">
                                        <Label
                                            :size="'sm'"
                                            invert
                                            :type="cell.resolved ? `success` : `danger`"
                                            :label="cell.resolved ? APPROVAL_ACTION_NAME_PAST_TENSE[requestableWorkFlowAction] : cell.error as string" />
                                    </div>
                                </template>
                            </DataTable>
                        </div>
                    </fieldset>
                </div>
            </template>
            <template #footer>
                <div class="mx-auto max-w-screen-xl">
                    <div class="flex space-x-2 justify-between">
                        <div class="space-x-2 inline-flex items-center">
                            <UnorderedList v-if="pending" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        </div>

                        <div class="space-x-2 inline-flex items-center">
                            <Button
                                class="w-min"
                                :variant=" 'outline'"
                                :size="'md'"
                                :disabled="pending"
                                :label="'Okay'"
                                @click="closeResultsModal"/>
                        </div>
                    </div>
                </div>
            </template>
        </DialogModal>
    </div>
</template>

<script setup lang="ts">
import type {ApprovalStateWorkFlowPayloadT} from "@/public/js/types/request-approval";
import type {TableHeaderT} from "@/public/js/types/data";
import {storeToRefs} from "pinia";

const nuxtApp = useNuxtApp();

const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
} = storeToRefs(nuxtApp.$authStore);

const props = defineProps({
    createRequestableWorkFlow: {
        type: Boolean,
        default: false,
    },
    requestableWorkFlowAction: {
        type: Number,
        default: APPROVAL_ACTION.NOT_SPECIFIED,
    },
    approvalStateWorkFlowPayload: {
        type: Array as PropType<ApprovalStateWorkFlowPayloadT[]>,
        default: () => {
            return [];
        }
    }
});

const pending = ref(false);
const requestable = reactive<{
    successful: boolean,
    message: string
}>({
    'successful': false,
    'message': ''
})
const remarks = ref('');
const remarksReference = useTemplateRef('remarksReference');

watch(() => props.createRequestableWorkFlow, async (newValue) => {
    if(newValue && remarksReference.value){

        await nextTick();
        //@ts-ignore
        remarksReference.value.$refs.input.focus();
    }
})

const applyRequestableWorkflow = async () => {

    let approvalStateWorkFlowPayload = props.approvalStateWorkFlowPayload;
    let requestableWorkFlowAction = props.requestableWorkFlowAction;

    pending.value = true;

    await laraFetch(`/api/approval-states-workflow`, {
        method: 'POST',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            remarks: remarks.value,
            action: requestableWorkFlowAction,
            approval_states: approvalStateWorkFlowPayload
        }
    }, {
        onRequestError: () => {
            pending.value = false;
        },
        onResponse: (request, options, response) => {
            pending.value = false;
            requestable.successful = _get(response, '_data.successful', false);
            requestable.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            resultsData.value = _get(response, '_data.values.results', []);
            showResult.value = true;
        }
    }, false);
}


const showResult = ref(false);
const resultsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'number', alignData: 'left'},
    { text: 'Successful', value: 'resolved', alignData: 'left'},
    { text: 'Result', value: 'result', alignData: 'left'},
]);
const resultsData = ref<{number: string, resolved: boolean, error: string | null}[]>([]);

const emit = defineEmits(['update:createRequestableWorkFlow', 'update:requestableWorkFlowAction', 'resolved']);

const closeModal = () => {
    emit('update:createRequestableWorkFlow', false);
    emit('update:requestableWorkFlowAction', APPROVAL_ACTION.NOT_SPECIFIED);
    reset();
}

const closeResultsModal = () => {
    closeModal();
    emit('resolved');
}

const reset = () => {
    pending.value = false;
    showResult.value = false;
    resultsData.value = [];
    remarks.value = '';
    requestable.successful = true;
    requestable.message = '';
}
</script>

<style scoped>

</style>