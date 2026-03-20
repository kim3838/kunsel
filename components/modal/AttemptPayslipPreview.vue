<template>
    <div>
        <DialogModal
            :show="show"
            :closeable="proxyShow">
            <template #title>
                Preview payslip
            </template>
            <template #content>

                <div class="space-y-2">

                    <div v-if="!attemptPayslipPreviewPending && attemptPayslipPreviewSuccessful" class="text-base">
                        Link is only available for 10 seconds.
                    </div>

                    <div class="flex justify-center">
                        <UnorderedList
                            v-if="attemptPayslipPreviewPending"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                        <NuxtLink v-else-if="attemptPayslipPreviewSuccessful" class="inline-flex" :to="signed" target="_blank" rel="noopener noreferrer">
                            <div class="text-base h-[32px] px-2 gap-0.5 flex items-center justify-center cursor-pointer accent-hover">
                                <span class="font-narrow-thin">View</span>
                                <Icon class="h-5 w-5" :name="'gg:external'"/>
                            </div>
                        </NuxtLink>
                    </div>

                    <div v-if="!attemptPayslipPreviewPending && attemptPayslipPreviewSuccessful">
                        Password is:
                        <ol class="list-inside list-decimal">
                            <li>last name in lower case without space</li>
                            <li>followed by employee number in lower case</li>
                            <li>followed by date of birth in this format: YYYYMMDD</li>
                        </ol>
                    </div>

                    <div v-if="!attemptPayslipPreviewPending && !attemptPayslipPreviewSuccessful">
                        <Label invert :size="'md'" :type="'danger'" :label="attemptPayslipPreviewsMessage" />
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="flex space-x-2 justify-between">
                    <div class="space-x-2 inline-flex">
                        <div class="space-x-2 inline-flex items-center">

                        </div>
                    </div>
                    <div class="space-x-2 inline-flex items-center">
                        <Button
                            :disabled="attemptPayslipPreviewPending"
                            :variant=" 'outline'"
                            @click="close"
                            :label="'Close'" />
                    </div>
                </div>
            </template>
        </DialogModal>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

const {$authStore} = useNuxtApp();
const nuxtApp = useNuxtApp();
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId,
} = storeToRefs($authStore);

const proxyShow = defineModel('show', {type: Boolean, default: false});
const proxySalaryStatementUlid = defineModel('salaryStatementUlid', {type: String, default: ''});

const signed = ref('');

watch(() => proxyShow.value, (start) => {

    if(start){
        attemptPayslipPreview();
    }
})

const attemptPayslipPreviewPending = ref(false);
const attemptPayslipPreviewSuccessful = ref(false);
const attemptPayslipPreviewsMessage = ref('');
const attemptPayslipPreview = async () => {

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value){
        return;
    }

    signed.value = '';
    attemptPayslipPreviewPending.value = true;

    await laraFetch(`/api/payslip-preview/${proxySalaryStatementUlid.value}`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
        }
    }, {
        onRequestError: () => {
            attemptPayslipPreviewPending.value = false;
        },
        onResponse: (request, options, response) => {
            attemptPayslipPreviewPending.value = false;
            attemptPayslipPreviewSuccessful.value = _get(response, '_data.successful', false);
            attemptPayslipPreviewsMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {

            signed.value = _get(response, '_data.values.signed', '');
        }
    }, false);
}

const close = () => {
    proxyShow.value = false;
    proxySalaryStatementUlid.value = '';
    attemptPayslipPreviewPending.value = false;
    attemptPayslipPreviewSuccessful.value = false;
    attemptPayslipPreviewsMessage.value = '';
    signed.value = '';
}
</script>


<style scoped>

</style>