<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Type" />
                            <MultiSelect :disabled="disableActions" glint drop-shadow :size="'md'" :options="shiftTypeOptions" :icon="'tdesign:component-checkbox'"/>
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
                                v-model="showSchedulesPerShift"
                                :size="'md'"
                                :label="'Show Schedules Per Shift'" />
                        </label>
                    </div>

                    <div>
                        <PageInformation :pagination="shifts.meta.pagination" :pending="disableDataTable" />
                        <Pagination :size="'lg'" :pagination="shifts.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </form>

                <div class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <NuxtLink
                            v-if="!disableActions"
                            :to="`/hr-payroll/policies/shifts/create-shift`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                        </NuxtLink>
                        <Button v-if="shifts.successful && !disableActions" :variant="'outline'" :icon="'mdi:delete-outline'" class="inline-block" :size="'sm'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected"/>
                    </div>

                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <div v-if="shifts.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedShifts.length}}</span> Selected</span>
                        </div>
                        <Button v-if="shifts.successful" :variant="'outline'" :size="'sm'" :icon="'tdesign:close'" :disabled="disableActions" :label="'Clear selection'" @click="selectedShifts = []" />
                        <Label v-if="!shifts.successful" invert :size="'md'" :type="'danger'" :label="shifts.message" />
                    </div>

                    <DataTable
                        v-if="shifts.successful"
                        :key="shiftsKey"
                        :headers="shiftsHeaders"
                        :size="'lg'"
                        :rows="shifts.data"
                        :disabled="disableDataTable"
                        v-model="selectedShifts"
                        :sub-row-slug="shiftSubRowSlug"
                        :sub-row-settings="{
                            type: DATATABLE_SUBROW_TYPE.TITLED,
                            containerPaddingTop: 0.25,
                            containerPaddingBottom: 0.75,
                            titleSize: 'md',
                            rowVerticalLine: true,
                            verticalBorderType: 'dashed',
                            horizontalBorderType: 'dashed',
                        }"
                        :stripped="true"
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
                                        {type: 'link',icon: 'mdi:pen',title: 'Edit',to: `/hr-payroll/policies/shifts/${cell.ulid}`},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.type="{cell,slot}">
                            <div class="p-[3px]">{{cell.type.text}}</div>
                        </template>
                        <template v-slot:cell.holiday_policy="{cell,slot}">
                            <div class="p-[3px]">{{cell.holiday_policy.text}}</div>
                        </template>
                        <template v-slot:cell.is_default="{cell, slot, scrollReference}">
                            <div class="flex justify-center">
                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.is_default" ></NonModelCheckBox>
                            </div>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="mdi:info-variant" :class="[slot.iconSizeClass]" /><div :class="[slot.titleSizeClass]">Shift Schedules</div>
                            </div>

                            <ShiftSubRow
                                :rows="cell[slot.slug]"
                                :disabled="disableDataTable"
                            ></ShiftSubRow>
                        </template>
                    </DataTable>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Shifts`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        paginate();
    }
})

const showSchedulesPerShift = ref(false);
const shiftSubRowSlug = ref('');

watch(() => {return showSchedulesPerShift.value;}, (show) => {
    if(show){
        shiftSubRowSlug.value = 'schedules';
        paginate(1, true)
    } else {
        shiftSubRowSlug.value = '';
        paginate(1, true)
    }
})

const shiftsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', minWidth: '33px'},
    { text: 'Code', value: 'code'},
    { text: 'Name', value: 'name'},
    { text: 'Type', value: 'type'},
    { text: 'Holiday Policy', value: 'holiday_policy'},
    { text: 'Work Start Grace', value: 'work_start_grace_time', alignData: 'left'},
    { text: 'Require Lunch Out/In', value: 'require_lunch_time_in_and_out'},
    { text: 'Lunch Start Grace', value: 'lunch_start_grace_time', alignData: 'left'},
    { text: 'Max Overtime Hours', value: 'max_overtime', alignData: 'left'},
]);

const shiftsKey = ref(0);
const shifts = reactive<DataTableT>({
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

const noShiftRecords = computed(() => {
    return shifts.meta.pagination.total === 0;
})

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

const shiftTypeOptions = reactive({
    search: '',
    selection: [
        {text : 'Regular', value: SHIFT_TYPE.REGULAR},
        {text : 'Graveyard', value: SHIFT_TYPE.GRAVEYARD},
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
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: filters.search.keyword,
            type: shiftTypeOptions.selected,
        }
    };
});
const shiftsPending = ref(false);
const selectedShifts = ref([]);

const shiftsExecute = async () => {

    if(import.meta.server){return;}

    shiftsPending.value = true;

    await laraFetch("/api/shifts", {
        method: 'GET',
        params: paramsComputed.value
    },{
        onRequestError: () => {
            shiftsPending.value = false;
        },
        onResponse: (request, options, response) => {
            shiftsPending.value = false;
            shifts.successful = _get(response, '_data.successful', false);
            shifts.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            shifts.data = _get(response, '_data.values.data', []);
            shifts.meta = _get(response, '_data.values.meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
            shiftsKey.value += 1;
        }
    }, false);
}

await shiftsExecute();

const disableActions = computed(() => {
    return shiftsPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return shiftsPending.value || deleting.value || companyAssociationPendingState().value;
});

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedShifts.value = [];
    }

    if(filters.page === page){
        shiftsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const deleting = ref(false);
const confirmDeleteSelected = () => {

    const selectedIds = selectedShifts.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected shift to delete.`,
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
        message: `Confirm delete selected shift${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedShifts.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/shifts", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            shift_ids: selectedIds,
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
                message: `Shift${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedShifts.value = [];
    await shiftsExecute();
}
</script>

<style scoped>

</style>