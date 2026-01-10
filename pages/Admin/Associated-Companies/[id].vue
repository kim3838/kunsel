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

                <div v-if="!companySuccessful" class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="companyMessage" />
                    </div>
                </div>

                <form v-if="companySuccessful" @submit.prevent="formSubmit" class="px-[20px] space-y-2">

                    <div class="text-lg font-header">Company</div>

                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        <div>
                            <InputLabel :size="'sm'" value="Account"/>
                            <SingleSelect :disabled="!creatingCompany" value-persist drop-shadow :size="'md'" :options="accountOptions"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Company Code"/>
                            <Input :size="'md'" v-model="companyCode" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Short Name"/>
                            <Input :size="'md'" v-model="companyShortName" type="text"/>
                        </div>
                        <div class="col-span-2">
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

import type {EnumSelection} from "@/public/js/common/type";
import type {SelectDataType} from "@/public/js/types/form";
import type {CompanyT} from "@/public/js/types/company";

const {fetchAssociatedCompanies, storeAssociatedCompanies} = useAssociation();
const {timezoneSelections} = useCommon();

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Companies`}});
definePageMeta({middleware: ['auth', 'admin-in-any-company']});
useLayout().setNavigationMode('solid');

const user = userState();
const {persistAccount, storePersistAccount} = useAccount();
const route = useRoute();
const company = ref<Partial<CompanyT>>({});
const companySuccessful = ref(true);
const companyMessage = ref('');
const creatingCompany = computed(() => {
    return route.params.id === 'create-company';
});
const companyCode = ref('');
const companyShortName = ref('');
const companyName = ref('');

const accountOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: string | number | null
}>({
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
    selection: timezoneSelections.value,
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
            accountOptions.selection = _get(response, '_data.values.selection', []);

            if(accountOptions.selection.map((item: SelectDataType) => item.value).indexOf(persistAccount.value as number) >= 0){
                accountOptions.selected = persistAccount.value as number;
            } else {
                accountOptions.selected = accountOptions.selection[0]?.value ?? null;
                storePersistAccount(accountOptions.selected as number);
            }
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

//Fetch Company Information
const fetchCompany = async () => {

    if(import.meta.server || route.params.id === 'create-company'){return;}

    await laraFetch(`/api/associated-company/${route.params.id}`, {
        method: 'GET',
        params: {
            account_id: accountOptions.selected
        }
    }, {
        onResponse: (request, options, response) => {
            companySuccessful.value = _get(response, '_data.successful', false);
            companyMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            company.value = _get(response, '_data.values.company', {}) as CompanyT;
            accountOptions.selected = _get(response, '_data.values.company.account_id', null);
            companyCode.value = _get(response, '_data.values.company.code', '');
            companyShortName.value = _get(response, '_data.values.company.short_name', '');
            companyName.value = _get(response, '_data.values.company.name', '');
            countryOptions.selected = _get(response, '_data.values.company.country_id', null);
            currencyOptions.selected = _get(response, '_data.values.company.currency', null);
            timezoneOptions.selected = _get(response, '_data.values.company.timezone', null);
        },
    }, false);
};

await fetchCompany();

const formPending = ref(false);
const disableActions = computed(() => {
    return formPending.value
});

const submitLabel = computed(() => {
    return formPending.value ? 'Please wait' : (!creatingCompany.value ? 'Save' : 'Submit');
});
const submitAction = computed(() => {
    return !creatingCompany.value ? 'PATCH' : 'POST';
});
const submitPath = computed(() => {
    return !creatingCompany.value ? `/api/associated-company/${company.value.id}` : `/api/company`;
});
const formBody = computed(() => {

    return {
        account_id: accountOptions.selected,
        code: companyCode.value,
        short_name: companyShortName.value,
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
                message: `Company ${!creatingCompany.value ? 'updated' : 'created'}`,
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