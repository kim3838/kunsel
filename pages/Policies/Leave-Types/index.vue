<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Type" />
                            <MultiSelect :disabled="disableActions" glint drop-shadow :size="'md'" :options="leaveTypeOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <RadioGroup
                            class="scaffold-border px-2"
                            :disabled="disableActions"
                            :selections="viewMode.selection"
                            :size="'md'"
                            :orientation="'horizontal'"
                            v-model="viewMode.selected" />
                        <label class="flex items-center">
                            <Checkbox
                                :disabled="disableActions"
                                name="remember"
                                v-model="showBalancePerPeriod"
                                :size="'md'"
                                :label="'Show Balance Per Period'" />
                        </label>
                    </div>

                    <div>
                        <PageInformation :pagination="leaveTypes.meta.pagination" :pending="disableDataTable" />
                        <Pagination :size="'lg'" :pagination="leaveTypes.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </form>

                <div class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <NuxtLink
                            v-if="!disableActions"
                            :to="`/policies/leave-types/create-leave-type`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                        </NuxtLink>
                        <Button v-if="leaveTypes.successful && !disableActions" :variant="'outline'" :icon="'mdi:delete-outline'" class="inline-block" :size="'sm'" :disabled="disableActions" :label="'Delete selected'" @click="confirmDeleteSelected"/>
                    </div>

                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <div v-if="leaveTypes.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedLeaveTypes.length}}</span> Selected</span>
                        </div>
                        <Button v-if="leaveTypes.successful" :variant="'outline'" :size="'sm'" :icon="'tdesign:close'" :disabled="disableActions" :label="'Clear selection'" @click="selectedLeaveTypes = []" />
                        <Label v-if="!leaveTypes.successful" invert :size="'md'" :type="'danger'" :label="leaveTypes.message" />
                    </div>

                    <DataTable
                        v-if="leaveTypes.successful"
                        :key="leaveTypesKey"
                        :sup-headers="leaveTypesSupHeaders"
                        :headers="leaveTypesHeaders"
                        :size="'lg'"
                        :rows="leaveTypes.data"
                        :disabled="disableDataTable"
                        v-model="selectedLeaveTypes"
                        :sub-row-slug="leaveTypeSubRowSlug"
                        :sub-row-settings="{
                            type: DATATABLE_SUBROW_TYPE.TITLED,
                            containerPaddingTop: 0.25,
                            containerPaddingBottom: 0.75,
                            titleSize: 'md',
                            rowVerticalLine: true,
                            verticalBorderType: 'dashed',
                            horizontalBorderType: 'dashed',
                        }"
                        :stripped="false"
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
                                        {type: 'link',icon: 'mdi:pen',title: 'Edit',to: `/policies/leave-types/${cell.ulid}`},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.type="{cell,slot}">
                            <div class="p-[3px]">{{cell.type?.text}}</div>
                        </template>
                        <template v-slot:cell.is_paid="{cell,slot}">
                            <div class="p-[3px]">{{cell.is_paid ? 'Yes' : 'No'}}</div>
                        </template>
                        <template v-slot:cell.monetizable="{cell,slot}">
                            <div class="p-[3px]">{{cell.monetizable ? 'Yes' : 'No'}}</div>
                        </template>
                        <template v-slot:cell.period_type="{cell,slot}">
                            <div class="p-[3px]">{{cell.period_type?.text}}</div>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="mdi:info-variant" :class="[slot.iconSizeClass]" /><div :class="[slot.titleSizeClass]">Balance Per Period</div>
                            </div>

                            <BalancePerPeriodSubRow
                                :rows="cell[slot.slug]"
                                :disabled="disableDataTable"
                            ></BalancePerPeriodSubRow>
                        </template>
                    </DataTable>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Leave Types`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        paginate();
    }
})

const showBalancePerPeriod = ref(false);
const leaveTypeSubRowSlug = ref('');

watch(() => {return showBalancePerPeriod.value;}, (show) => {
    if(show){
        leaveTypeSubRowSlug.value = 'balance_per_period';
        paginate(1, true)
    } else {
        leaveTypeSubRowSlug.value = '';
        paginate(1, true)
    }
})

const leaveTypesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: 'Leave Type', colspan: 4,  alignHeader: 'left'},
    {text: 'Eligibility', colspan: 2,  alignHeader: 'left'},
    {text: 'Period', colspan: 2,  alignHeader: 'left'},
    {text: 'Limit', colspan: 1,  alignHeader: 'left'},
    {text: 'Carry Over', colspan: 2,  alignHeader: 'left'},
]);

const leaveTypesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions'},
    { text: 'Code', value: 'code'},
    { text: 'Name', value: 'name'},
    { text: 'Type', value: 'type'},
    { text: 'Is Paid', value: 'is_paid'},

    { text: 'Employment Profiles', value: 'eligibility_employment_types_readable', alignData: 'left'},
    { text: 'Balance upon eligibility', value: 'initial_balance_upon_eligibility', alignData: 'right'},

    { text: '', value: 'period_type', alignData: 'left'},
    { text: '', value: 'period_readable', alignData: 'left'},

    { text: '', value: 'limit_usage_value_readable', alignData: 'left'},

    { text: '', value: 'carry_over_readable', alignData: 'left'},
]);

const leaveTypesKey = ref(0);
const leaveTypes = reactive<DataTableT>({
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

const viewMode = reactive<{
    selection: EnumSelection;
    selected: number | null;
}>({
    selection: [
        {text : 'Flex', value: DATA_VIEW_MODE.FLEX} as EnumOption,
        {text : 'List', value: DATA_VIEW_MODE.LIST} as EnumOption,
    ],
    selected: DATA_VIEW_MODE.LIST as number
});

const leaveTypeOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(LEAVE_TYPE_NAME, LEAVE_TYPE.VACATION as number),
        $enumerableOption(LEAVE_TYPE_NAME, LEAVE_TYPE.SICK as number),
        $enumerableOption(LEAVE_TYPE_NAME, LEAVE_TYPE.EMERGENCY as number),
    ],
    selected: []
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
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: filters.search.keyword,
            type: leaveTypeOptions.selected,
        }
    };
});
const leaveTypesPending = ref(false);
const selectedLeaveTypes = ref([]);
const deleting = ref(false);

const leaveTypesExecute = async () => {

    if(import.meta.server){return;}

    leaveTypesPending.value = true;

    await laraFetch("/api/leave-types", {
        method: 'GET',
        params: paramsComputed.value
    },{
        onRequestError: () => {
            leaveTypesPending.value = false;
        },
        onResponse: (request, options, response) => {
            leaveTypesPending.value = false;
            leaveTypes.successful = _get(response, '_data.successful', false);
            leaveTypes.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            leaveTypes.data = _get(response, '_data.values.data', []);
            leaveTypes.meta = _get(response, '_data.values.meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
            leaveTypesKey.value += 1;
        }
    }, false);
}

await leaveTypesExecute();

const disableActions = computed(() => {
    return leaveTypesPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return leaveTypesPending.value || deleting.value || companyAssociationPendingState().value;
});

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedLeaveTypes.value = [];
    }

    if(filters.page === page){
        leaveTypesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const confirmDeleteSelected = () => {

    const selectedIds = selectedLeaveTypes.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected leave type to delete.`,
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
        message: `Confirm delete selected leave type${selectedIds.length > 1 ? 's' : ''}?`,
        action: {
            callback: async () => {
                await deleteSelected();
            },
            label: 'Yes'
        }
    });
}
const deleteSelected = async () => {

    let selectedIds: number[] = [];

    selectedIds = selectedLeaveTypes.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/leave-types", {
        method: 'DELETE',
        body: {
            company_id: selectedAssociatedCompanyId.value,
            leave_type_ids: selectedIds,
        },
    },{
        onRequestError: (request, options, error) => {
            deleting.value = false;
        },
        onResponse: () => {
            deleting.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `Leave type${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedLeaveTypes.value = [];
    await leaveTypesExecute();
}
</script>

<style scoped>

</style>