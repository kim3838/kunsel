<template>
    <div>
        <DialogModal
            :show="viewRequestable"
            :max-width="'680px'"
            :closeable="false">
            <template #title>

            </template>
            <template #content>
                <div ref='modalContentContainer'>

                    <div v-if="pending">
                        <UnorderedList
                            v-if="pending"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                    </div>
                    <div v-else-if="!pending && requestable.successful">
                        <AttendanceAdjustmentRequest
                            v-if="requestableType == REQUESTABLE_TYPE.ATTENDANCE_ADJUSTMENT_REQUEST"
                            v-model:attendance-adjustment-request-payload="requestable.data"/>
                        <OvertimeRequest
                            v-if="requestableType == REQUESTABLE_TYPE.OVERTIME_REQUEST"
                            v-model:overtime-request-payload="requestable.data"/>
                        <LeaveRequest
                            v-if="requestableType == REQUESTABLE_TYPE.LEAVE_REQUEST"
                            v-model:leave-request-payload="requestable.data"/>
                        <PayrollRequest
                            v-if="requestableType == REQUESTABLE_TYPE.PAYROLL_REQUEST"
                            v-model:payroll-request-payload="requestable.data"/>
                    </div>

                    <Label v-if="!requestable.successful" invert :size="'md'" :type="'danger'" :label="requestable.message" />
                </div>
            </template>
            <template #footer>
                <div class="mx-auto max-w-screen-xl">
                    <div class="flex space-x-2 justify-between">
                        <div class="space-x-2 inline-flex items-center">

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
                                v-if="requestableIsApprovable && approvalStatePayloadIsStillTheCurrentApprovalState"
                                class="w-min"
                                :variant=" 'default'"
                                :size="'md'"
                                :disabled="pending"
                                :label="'Approve'"
                                @click="emitApplyApprovalWorkFlowFromViewable(APPROVAL_ACTION.APPROVE as number)"/>
                            <Button
                                v-if="requestableIsApprovable && approvalStatePayloadIsStillTheCurrentApprovalState"
                                class="w-min"
                                :variant=" 'default'"
                                :size="'md'"
                                :disabled="pending"
                                :label="'Decline'"
                                @click="emitApplyApprovalWorkFlowFromViewable(APPROVAL_ACTION.DECLINE as number)"/>
                        </div>
                    </div>
                </div>
            </template>
        </DialogModal>
    </div>
</template>

<script setup lang="ts">
import type {ApprovalStateT, ApprovalStateWorkFlowPayloadT, RequestablePayloadT, RequestableT} from "@/public/js/types/request-approval";
import {storeToRefs} from "pinia";

const nuxtApp = useNuxtApp();

const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
} = storeToRefs(nuxtApp.$authStore);

const props = defineProps({
    viewRequestable: {
        type: Boolean,
        default: false,
    },
    approvalStatePayload: {
        type: Object as PropType<ApprovalStateT>,
        default: () => {
            return {};
        }
    },
    requestablePayload: {
        type: Object as PropType<Partial<RequestablePayloadT>>,
        default: () => {
            return {};
        }
    },
    requestableIsApprovable: {
        type: Boolean,
        default: false,
    },
});

const pending = ref(false);
const requestable = reactive<{
    data: Partial<RequestableT>,
    successful: boolean,
    message: string
}>({
    'data': {},
    'successful': true,
    'message': ''
})

watch(() => props.viewRequestable, (newValue) => {

    if(newValue){
        fetchRequestable();
    }
})

const requestableType = computed(() => {

    let type = props.requestablePayload.type || props.approvalStatePayload?.requestable?.type;

    return {
        attendance_adjustment_request: REQUESTABLE_TYPE.ATTENDANCE_ADJUSTMENT_REQUEST,
        overtime_request: REQUESTABLE_TYPE.OVERTIME_REQUEST,
        leave_request: REQUESTABLE_TYPE.LEAVE_REQUEST,
        payroll_request: REQUESTABLE_TYPE.PAYROLL_REQUEST,
    }[type];
});

const approvalStatePayloadIsStillTheCurrentApprovalState = ref(false);
const preSelectedApprovalStates = ref<ApprovalStateWorkFlowPayloadT[]>([]);

const fetchRequestable = async () => {

    let requestablePayload: RequestableT = props.approvalStatePayload?.requestable || props.requestablePayload;

    let path = {
        attendance_adjustment_request: 'attendance-adjustment-request',
        overtime_request: 'overtime-request',
        leave_request: 'leave-request',
        payroll_request: 'payroll-request',
    }[requestablePayload.type];

    pending.value = true;

    await laraFetch(`/api/${path}/${requestablePayload.number}`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            filters: {
                company_id: selectedAssociatedCompanyId.value,
                request_numbers: [requestablePayload.number]
            }
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
            requestable.data = _get(response, '_data.values', {}) as RequestableT;

            const fetchedRequestableCurrentApprovalState = requestable.data.approval_states?.find(
                (approvalState) =>
                    approvalState.current_state_flag == 1 &&
                    approvalState.id == props.approvalStatePayload?.id
            ) as ApprovalStateT;

            if(!_isEmpty(fetchedRequestableCurrentApprovalState)){

                preSelectedApprovalStates.value = [{
                    id: fetchedRequestableCurrentApprovalState.id,
                    order: fetchedRequestableCurrentApprovalState.order,
                    number: fetchedRequestableCurrentApprovalState.requestable.number
                }];

                approvalStatePayloadIsStillTheCurrentApprovalState.value = true;
            }
        }
    }, false);
}

const emit = defineEmits(['update:viewRequestable', 'update:requestableIsSelectable', 'applyApprovalWorkFlowFromViewable']);

const closeModal = () => {
    emit('update:viewRequestable', false);
    emit('update:requestableIsSelectable', false);
    reset();
}

const emitApplyApprovalWorkFlowFromViewable = (action: number) => {
    emit('applyApprovalWorkFlowFromViewable', action, [...preSelectedApprovalStates.value])
    closeModal();
}

const reset = () => {
    pending.value = false;
    approvalStatePayloadIsStillTheCurrentApprovalState.value = false;
    preSelectedApprovalStates.value = [];
    requestable.successful = true;
    requestable.message = '';
    requestable.data = {};
}
</script>

<style scoped>

</style>