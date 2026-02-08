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
                    </div>

                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                    </div>

                    <div>
                        <PageInformation :pagination="jsonPresets.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="jsonPresets.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </form>

                <div class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <NuxtLink
                            v-else
                            :to="`/admin/jsonpresets/create-jsonpreset`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                        </NuxtLink>
                        <Button v-if="!disableActions" :variant="'outline'" :icon="'mdi:delete-outline'" class="inline-block" :size="'sm'" :disabled="disableActions" @click="deleteSelected"/>
                    </div>

                    <div v-if="!jsonPresets.successful" class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="jsonPresets.message" />
                    </div>

                    <DataTable
                        v-if="jsonPresets.successful"
                        :headers="jsonPresetsHeaders"
                        :size="'lg'"
                        :rows="jsonPresets.data"
                        :disabled="disableDataTable"
                        v-model="selectedJsonPresets"
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
                                        {type: 'link',icon: 'mdi:pen',title: 'Edit',to: `/admin/jsonpresets/${cell.id}`},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT} from "@/public/js/types/data";

useHead({titleTemplate: (titleChunk) => {return `Json Presets`}});
definePageMeta({middleware: ['auth', 'super-admin']});
useLayout().setNavigationMode('solid');

const jsonPresetsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', alignData: 'left'},
    { text: 'Key', value: 'key', alignData: 'left'},
    { text: 'Path', value: 'path', alignData: 'left'},
]);

const jsonPresets = reactive<DataTableT>({
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
        }
    };
});

const jsonPresetsPending = ref(false);
const selectedJsonPresets = ref([]);
const jsonPresetsExecute = async () => {

    if(import.meta.server){return;}

    jsonPresetsPending.value = true;

    await laraFetch("/api/json-presets", {
        method: 'GET',
        params: paramsComputed.value
    },{
        onRequestError: () => {
            jsonPresetsPending.value = false;
        },
        onResponse: (request, options, response) => {
            jsonPresetsPending.value = false;
            jsonPresets.successful = _get(response, '_data.successful', false);
            jsonPresets.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            jsonPresets.data = _get(response, '_data.values.data', []);
            jsonPresets.meta = _get(response, '_data.values.meta', {
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
await jsonPresetsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedJsonPresets.value = [];
    }

    if(filters.page === page){
        jsonPresetsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const disableActions = computed(() => {
    return jsonPresetsPending.value || deleting.value;
});
const disableDataTable = computed(() => {
    return jsonPresetsPending.value || deleting.value;
});

const deleting = ref(false);
const deleteSelected = async () => {

    const selectedIds = selectedJsonPresets.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    let batchDelete: Promise<any>[] = [];

    selectedIds.forEach((id) => {
        batchDelete.push(
            new Promise((resolve, reject) => {
                laraFetch(`/api/json-preset/${id}`, {
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
    selectedJsonPresets.value = [];
    await jsonPresetsExecute();

    deleting.value = false;
}
</script>

<style scoped>

</style>