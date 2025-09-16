<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/admin/companies`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <form @submit.prevent="formSubmit" class="px-[20px] space-y-2">

                    <div class="text-lg font-header">Company</div>

                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        <div>
                            <InputLabel :size="'sm'" value="Account"/>
                            <SingleSelect :icon="'mdi:checkbook'" value-persist drop-shadow :size="'md'" :options="accountOptions"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Code"/>
                            <Input :size="'md'" v-model="companyCode" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Name"/>
                            <Input :size="'md'" v-model="companyName" type="text"/>
                        </div>
                    </div>
                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        <div>
                            <InputLabel :size="'sm'" value="Country"/>
                            <SingleSelect value-persist drop-shadow :size="'md'" :options="countryOptions"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Currency"/>
                            <SingleSelect value-persist drop-shadow :size="'md'" :options="currencyOptions"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Timezone"/>
                            <SingleSelect :icon="'stash:globe-timezone-solid'" value-persist drop-shadow :size="'md'" :options="timezoneOptions"/>
                        </div>
                    </div>

                    <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="submitLabel"></Button>
                </form>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">

const {fetchAssociatedCompanies, storeAssociatedCompanies} = useAssociation();
useLayout().setNavigationMode('solid', 'Companies/[id].vue');

const route = useRoute();
const user = userState();
const company = ref(null);
const creatingAccount = computed(() => {
    return route.params.id === 'create-company';
});
const companyCode = ref('');
const companyName = ref('');

definePageMeta({
    middleware: ['auth', 'super-admin',
        async (to) => {

            if(import.meta.server || to.params.id === 'create-company'){return true;}

            const {data, error} = await laraUseFetch(`/api/company-check/${to.params.id}`, {method: 'GET',}, {}, false);

            if(_isEmpty(data.value) && !_isEmpty(error.value)){
                let responseCode = _get(error.value, 'data.code', null);

                throw createError({ statusCode: responseCode, statusMessage: useCoreStore().servicePayloadMessage, fatal: true});
            }
        }
    ]
});

const accountOptions = reactive({
    search: '',
    selection: [],
    selected: null
});
const countryOptions = reactive({
    search: '',
    selection: [],
    selected: null
});
const currencyOptions = reactive({
    search: '',
    selection: [],
    selected: null
});
const timezoneOptions = reactive({
    search: '',
    selection: [],
    selected: null
});
const fetchAccounts = async() => {

    await laraFetch("/api/account-selections", {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            accountOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
const fetchCountries = async() => {

    await laraFetch("/api/country-selections", {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            countryOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchCountries();
const fetchCurrencies = async() => {

    await laraFetch("/api/currency-selections", {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            currencyOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchCurrencies();
await fetchAccounts();
const fetchTimezones = async() => {

    await laraFetch("/api/timezone-selections", {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            timezoneOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchTimezones();

//Fetch Company Information
const fetchCompany = async () => {
    if(route.params.id === 'create-company'){return;}

    await laraFetch(`/api/company/${route.params.id}`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            company.value = _get(response, '_data.values.company', null);
            accountOptions.selected = _get(response, '_data.values.company.account_id', null);
            companyCode.value = _get(response, '_data.values.company.code', '');
            companyName.value = _get(response, '_data.values.company.name', '');
            countryOptions.selected = _get(response, '_data.values.company.country_id', null);
            currencyOptions.selected = _get(response, '_data.values.company.currency', null);
            timezoneOptions.selected = _get(response, '_data.values.company.timezone', null);
        },
    });
};

await fetchCompany();

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
    return !creatingAccount.value ? `/api/company/${company.value.id}` : `/api/company`;
});
const formBody = computed(() => {

    return {
        account_id: accountOptions.selected,
        code: companyCode.value,
        name: companyName.value,
        country_id: countryOptions.selected,
        currency: currencyOptions.selected,
        timezone: timezoneOptions.selected,
    };
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
            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `Company updated`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            await fetchAssociatedCompanies();
            await storeAssociatedCompanies();
        },
    });
}
</script>

<style scoped>

</style>