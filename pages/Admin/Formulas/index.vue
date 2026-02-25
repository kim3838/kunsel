<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Formulable Type" />
                            <MultiSelect :disabled="disableActions" glint drop-shadow :selection-max-viewable-line="10" :size="'md'" :options="formulableOptions" :icon="'ri:formula'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Earning Component" />
                            <MultiSelect :disabled="disableActions" glint drop-shadow :selection-max-viewable-line="10" :size="'md'" :options="earningComponentOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Deduction Component" />
                            <MultiSelect :disabled="disableActions" glint drop-shadow :selection-max-viewable-line="10" :size="'md'" :options="deductionComponentOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Income Tax Component" />
                            <MultiSelect :disabled="disableActions" glint drop-shadow :selection-max-viewable-line="10" :size="'md'" :options="incomeTaxComponentOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Aggregation" />
                            <MultiSelect :disabled="disableActions" glint drop-shadow :selection-max-viewable-line="10" :size="'md'" :options="aggregationOptions" />
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                    </div>
                </form>

                <div class="px-[20px] space-y-2">
                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <NuxtLink
                            v-else
                            :to="`/admin/formulas/create-formula`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                        </NuxtLink>
                        <Button v-if="!disableActions" :variant="'outline'" :icon="'mdi:delete-outline'" class="inline-block" :size="'sm'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected"/>
                    </div>

                    <div v-if="!formulas.successful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="formulas.message" />
                    </div>

                    <DataTable
                        v-if="formulas.successful"
                        :headers="formulasHeaders"
                        :size="'lg'"
                        :rows="formulas.data"
                        :disabled="disableDataTable"
                        v-model="selectedFormulas"
                        selection>
                        <template v-slot:cell.actions="{cell,slot}">
                            <div class="flex items-center">
                                <NavDrop
                                    class="z-10"
                                    :disabled="disableActions"
                                    :parent-icon="'ic:baseline-arrow-right'"
                                    in-horizontal-scrollable
                                    :size="`sm`"
                                    :drop-shadow-size="`lg`"
                                    :title="'Menu'"
                                    :drop-align="'top'"
                                    :drop-justify="'right'"
                                    :drop-options="[
                                        {type: 'link',icon: 'mdi:pen',title: 'Edit',to: `/admin/formulas/${cell.ulid}`},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.formulable_type="{cell,slot}">
                            <div class="p-[3px]">{{cell.formulable_type?.text}}</div>
                        </template>
                        <template v-slot:cell.component_type="{cell,slot}">
                            <div class="p-[3px]">{{cell.component_type?.text}}</div>
                        </template>
                        <template v-slot:cell.aggregation="{cell, slot, scrollReference}">
                            <div class="flex justify-center">
                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.aggregation"></NonModelCheckBox>
                            </div>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="formulas.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="formulas.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT} from "@/public/js/types/data";
import type {StringEnumInterface} from "@/public/js/common/type";

useHead({titleTemplate: (titleChunk) => {return `Formulas`}});
definePageMeta({middleware: ['auth', 'super-admin']});
useLayout().setNavigationMode('solid');

const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};

const formulasHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions', alignData: 'left'},
    { text: 'Name', value: 'name', alignData: 'left'},
    { text: 'Formulable Type', value: 'formulable_type', alignData: 'left'},
    { text: 'Component', value: 'component_type', alignData: 'left'},
    { text: 'Aggregation', value: 'aggregation', alignData: 'left'},
]);

const formulas = reactive<DataTableT>({
    'data': [],
    'meta': {
        pagination: {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 0,
            total_pages: 0
        }
    },
    'successful': true,
    'message': ''
});
const formulableOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.EARNINGS as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.DEDUCTIONS as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.TAXABLE_INCOME as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.NON_TAXABLE_INCOME as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.INCOME_TAX as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.NET_INCOME as number),
    ],
    selected: []
});
const earningComponentOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(COMPENSATION_NAME, COMPENSATION.BASIC_PAY as number),
        $enumerableOption(COMPENSATION_NAME, COMPENSATION.OVERTIME as number),
        $enumerableOption(COMPENSATION_NAME, COMPENSATION.BENEFIT as number),
        $enumerableOption(COMPENSATION_NAME, COMPENSATION.REGULAR_ALLOWANCE as number),
        $enumerableOption(COMPENSATION_NAME, COMPENSATION.LEAVE_PAY as number),
        $enumerableOption(COMPENSATION_NAME, COMPENSATION.HOLIDAY_PAY as number),
    ],
    selected: []
});
const deductionComponentOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(DEDUCTION_NAME, DEDUCTION.DEDUCTION as number),
        $enumerableOption(DEDUCTION_NAME, DEDUCTION.STATUTORY_CONTRIBUTION as number),
    ],
    selected: []
});
const incomeTaxComponentOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(INCOME_TAX_NAME, INCOME_TAX.COMPENSATION_TAX as number),
    ],
    selected: []
});
const aggregationOptions = reactive({
    search: '',
    selection: [
        {text : 'Yes', value: 1},
        {text : 'No', value: 0},
    ],
    selected: []
});

let filters = reactive<{
    page: number,
    perPage: number,
    search: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    }
}>({
    page: 1,
    perPage: 25,
    search: {
        keyword: '',
        callback: 1
    }
});
let pageComputed = computed({
    get() {
        return {
            page: filters.page,
            perPage: filters.perPage,
        }
    },
    set(payload: { key: 'page' | 'perPage', value: number }) {
        filters[payload.key] = payload.value;
    }
});
let paramsComputed = computed(() => {
    return {
        page: filters.page,
        perPage: filters.perPage,
        filters: {
            'search': filters.search.keyword,
            'formulable_types': formulableOptions.selected,
            'earning_components': earningComponentOptions.selected,
            'deduction_components': deductionComponentOptions.selected,
            'income_tax_components': incomeTaxComponentOptions.selected,
            'aggregations': aggregationOptions.selected,
        }
    };
});

const formulasPending = ref(false);
const selectedFormulas = ref([]);
const formulasExecute = async () => {

    if(import.meta.server){return;}

    formulasPending.value = true;

    await laraFetch("/api/formulas", {
        method: 'GET',
        params: paramsComputed.value
    },{
        onRequestError: () => {
            formulasPending.value = false;
        },
        onResponse: (request, options, response) => {
            formulasPending.value = false;
            formulas.successful = _get(response, '_data.successful', false);
            formulas.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            formulas.data = _get(response, '_data.values.data', []);
            formulas.meta = _get(response, '_data.values.meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
        }
    }, false);
}
await formulasExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedFormulas.value = [];
    }

    if(filters.page === page){
        formulasExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const disableActions = computed(() => {
    return formulasPending.value || deleting.value;
});
const disableDataTable = computed(() => {
    return formulasPending.value || deleting.value;
});

const deleting = ref(false);
const confirmDeleteSelected = () => {

    const selectedIds = selectedFormulas.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected formula to delete.`,
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });

        return false;
    }

    useNuxtApp().$promptStore.setPrompt({
        resetable: true,
        icon: null,
        title: 'Confirm Action',
        message: `Confirm delete selected formula${selectedIds.length > 1 ? 's' : ''}?`,
        action: {
            callback: async () => {
                await deleteSelected();
            },
            label: 'Yes'
        }
    });
}
const deleteSelected = async () => {

    const selectedIds = selectedFormulas.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    let batchDelete: Promise<any>[] = [];

    selectedIds.forEach((id) => {
        batchDelete.push(
            new Promise((resolve, reject) => {
                laraFetch(`/api/formula/${id}`, {
                    method: 'DELETE'
                },{
                    onRequestError: (request, options, error) => {
                        reject(error);
                    },
                    onResponse: (request, options, response) => {
                        resolve(response);
                    }
                })
            })
        );
    });

    await Promise.all(batchDelete);
    selectedFormulas.value = [];
    await formulasExecute();

    deleting.value = false;
}
</script>

<style scoped>

</style>