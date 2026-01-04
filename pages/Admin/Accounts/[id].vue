<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <DialogModal
                    :max-width="'840px'"
                    :show="resolvedAccountModal"
                    :closeable="false">
                    <template #title>
                        {{resolvedAccountModalTitle}}
                    </template>
                    <template #content>

                        <div class="mt-4 space-y-2">

                            <table class="border-separate font-sans">
                                <tbody>
                                <tr><td>Number:</td><td class="pl-2">{{resolvedAccount.number}}</td></tr>
                                <tr><td>Email:</td><td class="pl-2">{{resolvedAccount.email}}</td></tr>
                                <tr><td>Date registered:</td><td class="pl-2">{{resolvedAccount.date_registered}}</td></tr>
                                <tr><td colspan="2">Subscriptions:</td></tr>
                                <tr><td colspan="2">
                                    <div v-for="subscription in resolvedAccount.subscriptions" class="flex flex-row gap-4">
                                        <UnorderedList
                                            :icon="'ic:sharp-radio-button-checked'"
                                            :label="subscription.module.text" />

                                        <div class="font-serif">{{subscription.plan.text}}</div>
                                    </div>
                                </td></tr>
                                </tbody>
                            </table>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div class="space-x-2 inline-flex items-center">
                                <Button :icon="'ic:sharp-keyboard-arrow-left'" @click="navigateTo({path: `/admin/accounts`, replace: true})" :label="'Back to accounts'" />
                                <Button v-if="!creatingAccount" @click="resetResolved" :label="'Close'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/admin/accounts`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <div v-if="!accountSuccessful" class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="accountMessage" />
                    </div>
                </div>

                <div v-if="accountSuccessful" class="px-[20px] space-y-2">

                    <div class="text-lg font-header">Account</div>

                    <div class="grid gap-2 grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                        <div v-show="!creatingAccount">
                            <InputLabel :size="'sm'" value="Account number"/>
                            <Input :disabled="!creatingAccount" :size="'md'" v-model="accountNumber" type="text"/>
                        </div>
                        <div class="col-span-2">
                            <InputLabel :size="'sm'" value="Email"/>
                            <Input :disabled="disableActions" :size="'md'" v-model="accountEmail" type="email"/>
                        </div>
                    </div>

                    <div>
                        <div>
                            <p class="text-lg font-header">Subscriptions</p>
                        </div>

                        <div class="mb-2 flex items-center min-h-8">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="''" @click="addSubscription"></Button>
                        </div>

                        <DataTable
                            :headers="accountSubscriptionHeaders"
                            :size="'lg'"
                            :rows="accountSubscriptions">
                            <template v-slot:cell.actions="{cell,slot, headerIndex, rowIndex}">
                                <div class="h-[32px] mx-0.5 space-x-0.5 w-full flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="slot.buttonSize"
                                        :disabled="disableActions"
                                        :icon="'mdi:delete-forever'"
                                        @click="deleteSubscription(rowIndex, cell.id)"/>
                                </div>
                            </template>
                            <template v-slot:cell.module="{cell, slot, scrollReference}">
                                <div class="mx-0.5 flex items-center h-[32px]">
                                    <SingleSelectWrapper
                                        :disabled="disableActions"
                                        in-horizontal-scrollable
                                        drop-shadow
                                        :scroll-reference="scrollReference"
                                        :label="'Select Module'"
                                        :icon="`flowbite:swatchbook-outline`"
                                        value-persist
                                        :size="slot.selectSize"
                                        v-model="cell.module"
                                        :options="subscriptionOptions"
                                    />
                                </div>
                            </template>
                            <template v-slot:cell.plan="{cell, slot, scrollReference}">
                                <div class="mx-0.5 flex items-center h-[32px]">
                                    <SingleSelectWrapper
                                        :disabled="disableActions"
                                        in-horizontal-scrollable
                                        drop-shadow
                                        :scroll-reference="scrollReference"
                                        :label="'Select Module Plan'"
                                        value-persist
                                        :size="slot.selectSize"
                                        v-model="cell.plan"
                                        :options="subscriptionPlanOptions"
                                    />
                                </div>
                            </template>
                        </DataTable>
                    </div>

                    <Button class="w-min" ref="submitButton" type="submit" @click="formSubmit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="submitLabel"></Button>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {AccountSubscriptionFormT, AccountT} from "@/public/js/types/account";
import type {TableHeaderT} from "@/public/js/types/data";
import type {StringEnumInterface} from "@/public/js/common/type";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Accounts`}});
definePageMeta({middleware: ['auth', 'super-admin']});
useLayout().setNavigationMode('solid');

const route = useRoute();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const account = ref<Partial<AccountT>>({});
const accountSuccessful = ref(true);
const accountMessage = ref('');
const creatingAccount = computed(() => {
    return route.params.id === 'create-account';
});
const accountNumber = ref('');
const accountEmail = ref('');
const accountSubscriptions = ref<AccountSubscriptionFormT[]>([]);
const splicedAccountSubscriptions = ref<number[]>([]);
const accountSubscriptionHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions', minWidth: '41.38px', width: '41.38px', maxWidth: '41.38px'},
    { text: 'Module', value: 'module', minWidth: '230px', alignData: 'left'},
    { text: 'Plan', value: 'plan', minWidth: '140px', alignData: 'left'},
]);
const subscriptionOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(SUBSCRIPTION_MODULE_NAME, SUBSCRIPTION_MODULE.EMPLOYEE_PORTAL as number),
        $enumerableOption(SUBSCRIPTION_MODULE_NAME, SUBSCRIPTION_MODULE.HR_PAYROLL as number),
        $enumerableOption(SUBSCRIPTION_MODULE_NAME, SUBSCRIPTION_MODULE.INVENTORY as number),
        $enumerableOption(SUBSCRIPTION_MODULE_NAME, SUBSCRIPTION_MODULE.FINANCE_ACCOUNTING as number),
    ]
});
const subscriptionPlanOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(SUBSCRIPTION_PLAN_NAME, SUBSCRIPTION_PLAN.STANDARD as number),
        $enumerableOption(SUBSCRIPTION_PLAN_NAME, SUBSCRIPTION_PLAN.BUSINESS as number),
    ]
});

const addSubscription = () => {

    if(creatingAccount.value){
        accountSubscriptions.value.push({
            account_id: null,
            module: null,
            plan: SUBSCRIPTION_PLAN.STANDARD as number,
        });
    } else {
        accountSubscriptions.value.push({
            account_id: account.value.id as number,
            module: null,
            plan: SUBSCRIPTION_PLAN.STANDARD as number,
        });
    }


}
const deleteSubscription = (index: number, id: string | number | undefined) => {
    accountSubscriptions.value.splice(index, 1);

    if(id){
        let splicedId = id as number;
        splicedAccountSubscriptions.value.push(splicedId);
    }
}

//Fetch Account Information
const fetchAccount = async () => {
    if(route.params.id === 'create-account'){return;}

    await laraFetch(`/api/account/${route.params.id}`, {
        method: 'GET',
    }, {
        onResponse: (request, options, response) => {
            accountSuccessful.value = _get(response, '_data.successful', false);
            accountMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            account.value = _get(response, '_data.values.account', {}) as AccountT;
            accountNumber.value = _get(response, '_data.values.account.number', '');
            accountEmail.value = _get(response, '_data.values.account.email', '');

            splicedAccountSubscriptions.value = [];
            accountSubscriptions.value = _get(response, '_data.values.subscriptions', []) as AccountSubscriptionFormT[];
        },
    }, false);
};

await fetchAccount();

const formPending = ref(false);
const disableActions = computed(() => {
    return formPending.value
});

const submitLabel = computed(() => {
    return formPending.value ? 'Please wait' : (!creatingAccount.value ? 'Save' : 'Submit');
});
const submitAction = computed(() => {
    return !creatingAccount.value ? 'PATCH' : 'POST';
});
const submitPath = computed(() => {
    return !creatingAccount.value ? `/api/account/${account.value.id}` : `/api/account`;
});
const formBody = computed(() => {

    return {
        'email': accountEmail.value,
        'spliced_subscriptions' : splicedAccountSubscriptions.value,
        'subscriptions': accountSubscriptions.value,
    }
});

const formSubmit = async() => {

    formPending.value = true;

    await laraFetch(submitPath.value, {
        method: submitAction.value,
        body: formBody.value,
    }, {
        onResponse: () => {
            formPending.value = false;
        },
        onNotAcceptableResponse: async (request, response, options) => {
            formPending.value = false;
        },
        onUnprocessableContentResponse: async (request, response, options) => {
            formPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            resolvedAccount.value = _get(response, '_data.values.account', null) as AccountT;
            resolvedAccountModal.value = true;
        },
    });
}

const resolvedAccountModal = ref(false);
const resolvedAccount = ref<Partial<AccountT>>({});
const resolvedAccountModalTitle = computed(() => {
    return `Account ${creatingAccount.value ? 'Created' : 'Updated'}`;
})

const resetResolved = async () => {
    await fetchAccount();
    resolvedAccountModal.value = false;
    resolvedAccount.value = {};
}
</script>

<style scoped>

</style>