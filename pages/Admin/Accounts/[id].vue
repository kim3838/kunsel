<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/admin/accounts`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>
                <form @submit.prevent="formSubmit" class="px-[20px] space-y-2">
                    <div class="grid gap-2 grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Account number"/>
                            <Input :disabled="!creatingAccount" :size="'md'" v-model="accountNumber" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Type"/>
                            <SingleSelect value-persist drop-shadow :size="'md'" :options="accountPlanOptions"/>
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="submitLabel"></Button>
                    </div>
                </form>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
useLayout().setNavigationMode('solid', 'Accounts/[id].vue');

const route = useRoute();
const account = ref(null);
const creatingAccount = computed(() => {
    return route.params.id === 'create-account';
});
const accountNumber = ref('');

definePageMeta({
    middleware: ['auth', 'super-admin'],
    validate: async (route) => {

        if (import.meta.server) return true;

        let create = route.params.id === 'create-account';

        if(create){return true;}

        await laraFetch(`/api/account-check/${route.params.id}`, {
            method: 'GET'
        }, {
            onSuccessResponse: async (request, options, response) => {
                account.value = _get(response, '_data.values.account', null);
            }
        }, false);

        return !_isEmpty(account.value);
    }
});

const accountPlanOptions = reactive({
    search: '',
    selection: [
        {text : 'Standard', value: ACCOUNT_PLAN.STANDARD},
        {text : 'Business', value: ACCOUNT_PLAN.BUSINESS},
    ],
    selected: ACCOUNT_PLAN.STANDARD
});

//Fetch Account Information
const fetchAccount = async () => {
    if(route.params.id === 'create-account'){return;}

    await laraFetch(`/api/account/${route.params.id}`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            account.value = _get(response, '_data.values.account', null);
            accountNumber.value = _get(response, '_data.values.account.number', '');
            accountPlanOptions.selected = _get(response, '_data.values.account.plan.value', ACCOUNT_PLAN.STANDARD);
        },
    });
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
    let body = {
        'type': accountPlanOptions.selected,
    };

    if(creatingAccount.value){
        body = {...body, number: accountNumber.value}
    }

    return body
});

const formSubmit = async() => {
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
            await navigateTo({
                path: '/admin/accounts',
            });
        },
    });
}
</script>

<style scoped>

</style>