<template>
    <div class="space-y-2" :class="[compact ? '' : 'px-[20px]']">
        <form @submit.prevent="paginate(1, true)" class="space-y-2" :class="[compact ? '' : 'pb-[20px]']">
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
                <PageInformation :pagination="shifts.meta.pagination" :pending="shiftsPending"/>
                <div class="flex items-center gap-2">
                    <Pagination
                        :size="'lg'"
                        :pagination="shifts.meta.pagination"
                        :pending="shiftsPending"
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
            <div class="scaffold-border px-2 font-[National_Park]">
                <span><span class="font-semibold">{{proxySelectedShifts.length}}</span> Selected</span>
            </div>
            <Button
                :variant="'outline'"
                :size="'sm'"
                :icon="'tdesign:close'"
                :disabled="disableActions"
                :label="'Clear selection'"
                :override="{font_family: 'National Park'}"
                @click="proxySelectedShifts = []" />

            <slot name="selection-actions"></slot>
        </div>

        <DataTable
            :headers="shiftsHeaders"
            :size="'lg'"
            :rows="shifts.data"
            :disabled="disableDataTable"
            v-model="proxySelectedShifts"
            selection>
            <template v-slot:cell.type="{cell,slot}">
                <div class="p-[3px]">{{cell.type.text}}</div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {DataTableMeta, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";

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
    disableActions: {
        type: Boolean,
        default: false,
    },
    compact: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:selected"]);
const proxySelectedShifts = computed({
    get() {
        return props.selected;
    },
    set(newValue) {
        emit("update:selected", newValue);
    }
});

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        paginate(1, true);
    }
})

const shiftsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: 'Code', value: 'code'},
    { text: 'Name', value: 'name'},
    { text: 'Type', value: 'type'}
]);

const shifts = reactive<{
    data: TableRowT[];
    meta: DataTableMeta
}>({
    'data': [],
    'meta': {
        pagination: {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 0,
            total_pages: 0
        }
    }
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
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: filters.search.keyword,
        }
    };
});
const shiftsPending = ref(false)

const disableActions = computed(() => {
    return shiftsPending.value || props.disableActions
});
const disableDataTable = computed(() => {
    return shiftsPending.value || props.disableActions
});
const shiftsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    shiftsPending.value = true;

    await laraFetch(`/api/shifts`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            shiftsPending.value = false;
        },
        onResponse: () => {
            shiftsPending.value = false;
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
        }
    }, false);
}
await shiftsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        emit("update:selected", []);
    }

    if(filters.page === page){
        shiftsExecute();
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