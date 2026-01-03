<template>
    <div :class="[compact ? '' : 'px-[20px]']">
        <form @submit.prevent="paginate(1, clearSelectionOnFormSubmit)" class="space-y-2" :class="[compact ? '' : 'pb-[20px]']">
            <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                <div>
                    <InputLabel :size="'sm'" value="Search" />
                    <Input :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" :disabled="disableActions" type="text"/>
                </div>

                <div v-if="compact" class="flex flex-col">
                    <div class="flex-none h-[1rem]"></div>
                    <div class="grow">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                    </div>
                </div>
            </div>

            <div v-if="!compact" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
            </div>

            <div>
                <PageInformation :pagination="leaveTypes.meta.pagination" :pending="disableDataTable"/>
                <div class="flex items-center gap-2">
                    <Pagination
                        :size="'lg'"
                        :pagination="leaveTypes.meta.pagination"
                        :pending="disableDataTable"
                        v-model="pageComputed"/>
                    <UnorderedList
                        v-if="disableActions"
                        :icon="'eos-icons:loading'"
                        :size="'md'"
                        :label="'Please wait...'"/>
                </div>
            </div>
        </form>

        <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
            <div v-if="leaveTypes.successful" class="scaffold-border px-2 font-[National_Park]">
                <span><span class="font-semibold">{{proxySelectedLeaveTypes.length}}</span> Selected</span>
            </div>
            <Button
                v-if="leaveTypes.successful"
                :variant="'outline'"
                :size="'sm'"
                :icon="'tdesign:close'"
                :disabled="disableActions"
                :label="'Clear selection'"
                @click="proxySelectedLeaveTypes = []" />

            <slot v-if="leaveTypes.successful" name="selection-actions"></slot>
            <Label v-if="!leaveTypes.successful" invert :size="'md'" :type="'danger'" :label="leaveTypes.message" />
        </div>

        <DataTable
            v-if="leaveTypes.successful"
            class="mt-2"
            :sup-headers="leaveTypesSupHeaders"
            :headers="leaveTypesHeaders"
            :size="'lg'"
            :rows="leaveTypes.data"
            :disabled="disableDataTable"
            :pending="proxyPending"
            v-model="proxySelectedLeaveTypes"
            selection>
            <template v-slot:cell.type="{cell,slot}">
                <div class="p-[3px]">{{cell.type.text}}</div>
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
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableSupHeaderT} from "@/public/js/types/data";

import {storeToRefs} from "pinia";

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

const props = defineProps({
    selected: {
        type: Array,
        default: () => {
            return [];
        }
    },
    pending: {
        type: Boolean,
    },
    disableActions: {
        type: Boolean,
        default: false,
    },
    compact: {
        type: Boolean,
        default: false,
    },
    clearSelectionOnFormSubmit: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(["update:selected", "update:pending"]);
const proxySelectedLeaveTypes = computed({
    get() {
        return props.selected;
    },
    set(newValue) {
        emit("update:selected", newValue);
    }
});
const proxyPending = computed({
    get() {
        return props.pending;
    },
    set(newValue) {
        emit("update:pending", newValue);
    }
});

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        paginate(1, true);
    }
})

const leaveTypesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: 'Leave Type', colspan: 5,  alignHeader: 'left'},
    {text: 'Eligibility', colspan: 2,  alignHeader: 'left'},
    {text: 'Period', colspan: 2,  alignHeader: 'left'},
    {text: 'Limit', colspan: 1,  alignHeader: 'left'},
    {text: 'Carry Over', colspan: 2,  alignHeader: 'left'},
]);

const leaveTypesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: 'Code', value: 'code'},
    { text: 'Name', value: 'name'},
    { text: 'Type', value: 'type'},
    { text: 'Is Paid', value: 'is_paid'},
    { text: 'Monetizable', value: 'monetizable', alignData: 'left'},

    { text: 'Employment Profiles', value: 'eligibility_employment_types_readable', alignData: 'left'},
    { text: 'Balance upon eligibility', value: 'initial_balance_upon_eligibility', alignData: 'right'},

    { text: '', value: 'period_type', alignData: 'left'},
    { text: '', value: 'period_readable', alignData: 'left'},

    { text: '', value: 'limit_usage_value_readable', alignData: 'left'},

    { text: '', value: 'carry_over_readable', alignData: 'left'},
]);

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
    perPage: 10,
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
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: filters.search.keyword,
        }
    };
});
const leaveTypesPending = ref(false)

const disableActions = computed(() => {
    return leaveTypesPending.value || props.disableActions || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return leaveTypesPending.value || props.disableActions || companyAssociationPendingState().value;
});
const leaveTypesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    leaveTypesPending.value = true;
    emit("update:pending", true);

    await laraFetch(`/api/leave-types`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            leaveTypesPending.value = false;
            emit("update:pending", false);
        },
        onResponse: (request, options, response) => {
            leaveTypesPending.value = false;
            emit("update:pending", false);
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
        }
    }, false);
}
await leaveTypesExecute();

const paginate = async (page: number = 1, clearSelection: boolean = false) => {
    clearTimeout(filters.search.callback);

    if(clearSelection){
        emit("update:selected", []);
    }

    if(filters.page === page){
        await leaveTypesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

defineExpose({
    paginate,
});
</script>

<style scoped>

</style>