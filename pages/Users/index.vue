<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div class="tw-m-2 tw-p-2 tw-border tw-border-light">
                    <div>
                        <form @submit.prevent="paginate(1, true)" class="tw-space-y-0.5">
                            <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                                <div class="tw-block">
                                    <InputLabel :size="'md'" value="Search"/>
                                    <Input :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="tw-w-full" placeholder="Search something" type="text" autocomplete="off"/>
                                </div>
                                <div class="tw-block">
                                    <InputLabel :size="'md'" value="_" class="tw-text-transparent"/>
                                    <Button type="button" :variant="'outline'" @click="filters.search.keyword += '.';" :size="'md'" :icon="'ic:sharp-join-left'" :label="'Concat &quot;.&quot;'"></Button>
                                </div>
                            </div>

                            <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                                <div class="tw-block">
                                    <InputLabel :size="'md'" value="Code"/>
                                    <Input :size="'md'" readonly v-model="filters.code" class="tw-w-full" placeholder="Search something" type="text" autocomplete="off"/>
                                </div>
                                <div class="tw-block">
                                    <InputLabel :size="'md'" value="_" class="tw-text-transparent"/>
                                    <Button type="button" :variant="'outline'" @click="filters.code += '.';" :size="'md'" :icon="'ic:sharp-join-left'" :label="'Concat &quot;.&quot;'"></Button>
                                </div>
                            </div>

                            <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                                <div class="tw-bloc">
                                    <InputLabel :size="'md'" value="Date Added: From"/>
                                    <Input id="datetimefrom" readonly v-model="filters.datetimeFrom" :size="'md'" class="tw-w-full" type="text"/>
                                </div>
                                <div class="tw-block">
                                    <InputLabel :size="'md'" value="Date Added: To"/>
                                    <Input id="datetimeto" readonly v-model="filters.datetimeTo" :size="'md'" class="tw-w-full" type="text"/>
                                </div>
                            </div>

                            <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                                <div class="tw-block">
                                    <Button :variant="'outline'" ref="submitButton" type="submit" @click="paginate(1, true)" :disabled="pending" :size="'md'" :icon="'ic:sharp-refresh'" :label="'Refresh'"></Button>
                                </div>
                            </div>
                        </form>

                        <div>
                            <PageInformation
                                v-if="users.meta.pagination.total > 0"
                                :pagination="users.meta.pagination"
                                :no-record-label="'No User Found'"/>
                            <Pagination
                                :size="'lg'"
                                :pagination="users.meta.pagination"
                                :pending="pending"
                                v-model="pageComputed"
                            />
                            <DataTable
                                class="tw-mt-0.5"
                                :headers="usersHeaders"
                                :size="'lg'"
                                :rows="users.data"
                                :no-data-label="pending ? 'Loading' : 'No User Found'"
                                v-model="selectedUsers"
                                selection>
                                <template v-slot:cell.datetime_added="{cell, slot}">
                                    <Input :id="`datetime_added-` + cell.id" v-model="cell.datetime_added" readonly :size="slot.inputSize" class="tw-w-full" type="text" />
                                </template>
                                <template v-slot:cell.actions="{cell, slot, scrollReference}">
                                    <div class="tw-h-full tw-space-x-0.5 tw-w-full tw-flex tw-items-center">
                                        <Button type="button" :variant="'outline'" :size="slot.buttonSize" :label="'Details'" :icon="'streamline:interface-file-clipboard-text-edition-form-task-checklist-edit-clipboard'"></Button>
                                        <Button type="button" :variant="'outline'" :size="slot.buttonSize" :label="'Approve'" :icon="'streamline:interface-file-clipboard-check-checkmark-edit-task-edition-checklist-check-success-clipboard-form'"></Button>
                                        <Button type="button" :variant="'outline'" :size="slot.buttonSize" :label="'Deny'" :icon="'streamline:interface-file-clipboard-block-edit-task-edition-block-clipboard-form'"></Button>
                                    </div>
                                </template>
                            </DataTable>
                        </div>

                        <div class="tw-border tw-border-neutral-200">
                            <pre class="tw-text-sm">{{ users.data }}</pre>
                        </div>
                        <div class="tw-border tw-border-neutral-200">
                            <pre class="tw-text-sm">{{ users.meta }}</pre>
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<style>

</style>

<script setup lang="ts">
import {ref, reactive, watch, nextTick, onMounted} from 'vue';
const {$coreStore, $moment} = useNuxtApp();

definePageMeta({
    layout: false,
    middleware: 'auth'
});

let users = reactive({
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
let usersHeaders = reactive([
    { text: '#', value: 'row_number'},
    { text: 'ID', value: 'id'},
    { text: 'NAME', value: 'name'},
    { text: 'CODE', alignHeader: 'center', value: 'code'},
    { text: 'TYPE', value: 'type'},
    { text: 'CATEGORY', alignData: 'right', value: 'category'},
    { text: 'CAPACITY', alignData: 'left', value: 'capacity'},
    { text: 'DATE ADDED', alignData: 'left', value: 'datetime_added'},
    { text: 'ACTIONS', alignData: 'left', value: 'actions'},
    // { text: 'DATE CREATED', alignData: 'left', value: 'created_at'},
    // { text: 'DATE UPDATED', alignData: 'left', value: 'updated_at'},
]);
let filters = reactive({
    page: 1,
    perPage: 10,
    search: {
        keyword: '',
        callback: 1
    },
    code: 'PRTY',
    datetimeFrom: $moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    datetimeTo: $moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
});

let selectedUsers = ref([]);
let searchInput = ref(null);
let submitButton = ref(null);

let pageComputed = computed({
    get() {
        return {
            page: filters.page,
            perPage: filters.perPage,
        }
    },
    set(payload) {
        filters[payload.key] = payload.value;
    }
});
let paramsComputed = computed(() => {
    return {
        page: filters.page,
        perPage: filters.perPage,
        filters: {
            search: filters.search.keyword,
            code: filters.code,
            datetimeFrom: filters.datetimeFrom,
            datetimeTo: filters.datetimeTo
        }
    };
});

const {pending, execute} = csrFetch("/api/v1/prototypes", {
    method: 'GET',
    params: paramsComputed,
    onRequest(){
        clearTimeout(filters.search.callback);
        $coreStore.resetServiceError();
    },
    onResponse({request, response, options}) {
        //Todo: Response composable handler
        if (response._data.code >= 500 && response._data.code < 600) {
            $coreStore.setServiceError({
                prompt: true,
                icon: 'ic:sharp-error-outline',
                title: 'Something Went Wrong',
                payload: response._data
            });
        } else {
            users.data = _get(response, '_data.values.data', []);
            users.meta = _get(response, '_data.values.meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
            renderDateTimePickers();
        }
    }
});

watch(pending, async (newPending, oldPending) => {
    if (!newPending) {
        await nextTick();
        //Focus Submit Button
        submitButton.value.$refs.button.focus();
        //Focus Search Input
        searchInput.value.$refs.input.focus();
    }
});

//Todo: Filter data watcher composable
watch(() => {return filters.code;}, () => {paginate(1, true);});
watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});
watch(() => {return filters.datetimeFrom;}, () => {paginate(1, true);});
watch(() => {return filters.datetimeTo;}, () => {paginate(1, true);});
watch(() => {
    return filters.search.keyword;
}, (keyword) => {
    clearTimeout(filters.search.callback);

    filters.search.callback = setTimeout(() => {
        paginate(1, true);
    }, 1500);
});

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    filters.page = page;

    if(clearSelection){
        selectedUsers.value = [];
    }
    execute();
}

let filtersDateTimePickers = ref([
    {
        id: 'datetimefrom',
        type: 'datetime',
        selectedCallback: (payload) => {
            filters.datetimeFrom = payload.value;
        }
    }, {
        id: 'datetimeto',
        type: 'datetime',
        selectedCallback: (payload) => {
            filters.datetimeTo = payload.value;
        }
    }
]);

const {render} = dateTimePicker();

function renderDateTimePickers(){
    let dataDateTimePickers = users.data.map(record => {
        return {
            id: `datetime_added-` + record.id,
            type: 'datetime',
            selectedCallback: (payload) => {
                record.datetime_added = payload.value;
            }
        }
    });

    let dateTimePickers = filtersDateTimePickers.value.concat(dataDateTimePickers);

    render(dateTimePickers);
}

onMounted(async () => {
    render(filtersDateTimePickers.value);
});
</script>