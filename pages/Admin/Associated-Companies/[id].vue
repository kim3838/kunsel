<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/admin/associated-companies`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <form @submit.prevent="formSubmit" class="px-[20px] space-y-2">
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        <div>
                            <InputLabel :size="'sm'" value="Account"/>
                            <SingleSelect value-persist drop-shadow :size="'md'" :options="associatedAccountOptions"/>
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
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="submitLabel"></Button>
                    </div>
                </form>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">

const {fetchAssociatedCompanies, storeAssociatedCompanies} = useAssociation();
useLayout().setNavigationMode('solid', 'Associated-Companies/[id].vue');

const route = useRoute();
const user = userState();
const company = ref(null);
const creatingAccount = computed(() => {
    return route.params.id === 'create-company';
});
const companyCode = ref('');
const companyName = ref('');

definePageMeta({
    middleware: ['auth', 'admin-in-any-company'],
    validate: async (route) => {

        if (import.meta.server) return true;

        let create = route.params.id === 'create-company';

        if(create){return true;}

        await laraUseFetch(`/api/company-check/${route.params.id}`, {
            lazy: false,
            method: 'GET'
        }, {
            onSuccessResponse: async (request, options, response) => {
                company.value = _get(response, '_data.values.company', null);
            }
        }, false);

        return !_isEmpty(company.value);
    }
});

const associatedAccountOptions = reactive({
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
const fetchAssociatedAccounts = async() => {

    await laraFetch("/api/associated-account-selections", {
        method: 'GET',
        params: {
            filters: {
                user_id: user?.value?.id,
                assignment_type: [COMPANY_ASSIGNMENT_TYPE.ADMIN],
            }
        }
    }, {
        onSuccessResponse: async (request, options, response) => {
            associatedAccountOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchAssociatedAccounts();
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
            associatedAccountOptions.selected = _get(response, '_data.values.company.account_id', null);
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
        account_id: associatedAccountOptions.selected,
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
            await fetchAssociatedCompanies();
            await storeAssociatedCompanies();
            await navigateTo({
                path: '/admin/associated-companies',
            });
        },
    });
}
</script>

<style scoped>

</style>