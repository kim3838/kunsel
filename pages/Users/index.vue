<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div class="tw-m-2 tw-p-2 tw-border tw-border-light">
                    <div class="tw-space-y-2">
                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'md'" value="Search"/>
                                <Input :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="tw-w-full" placeholder="Search something" type="text" autocomplete="off"/>
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'md'" value="_" class="tw-text-transparent"/>
                                <Button @click="filters.search.keyword += '.';" :size="'md'" :icon="'ic:sharp-join-left'" :label="'Concat &quot;.&quot;'"></Button>
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'md'" value="Code"/>
                                <Input :size="'md'" readonly v-model="filters.code" class="tw-w-full" placeholder="Search something" type="text" autocomplete="off"/>
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'md'" value="_" class="tw-text-transparent"/>
                                <Button @click="filters.code += '.';" :size="'md'" :icon="'ic:sharp-join-left'" :label="'Concat &quot;.&quot;'"></Button>
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'md'" value="Date Added: From"/>
                                <Input id="datetimefrom" readonly v-model="filters.datetimeFrom" :size="'md'" class="tw-w-full" type="text"/>
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'md'" value="Date Added: To"/>
                                <Input id="datetimeto" readonly v-model="filters.datetimeTo" :size="'md'" class="tw-w-full" type="text"/>
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'md'" value="Date Picker"/>
                                <Input id="date" readonly v-model="filters.date" :size="'md'" class="tw-w-full" type="text"/>
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <InputLabel :size="'md'" value="Month Picker"/>
                                <Input id="month" readonly v-model="filters.month.label" :size="'md'" class="tw-w-full" type="text"/>
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <Button ref="submitButton" @click="paginate(1, true)" :disabled="pending" :size="'md'" :icon="'ic:sharp-refresh'" :label="'Refresh'"></Button>
                            </div>
                        </div>

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
                                :headers="usersHeaders"
                                :size="'lg'"
                                :rows="users.data"
                                :no-data-label="pending ? 'Loading' : 'No User Found'"
                                v-model="selectedUsers"
                                selection>
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
import {ref, reactive, watch, nextTick} from 'vue';
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
    { text: 'DATE CREATED', alignData: 'left', value: 'created_at'},
    { text: 'DATE UPDATED', alignData: 'left', value: 'updated_at'},
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
    date: $moment().format('YYYY-MM-DD'),
    month: {
        value: $moment().format('YYYY-MM'),
        label: $moment().format('YYYY MMMM')
    }
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
        }
    }
});

watch(pending, async (newPending, oldPending) => {
    if (!newPending) {
        await nextTick();
        submitButton.value.$refs.button.focus();
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

dateTimePicker([
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
    }, {
        id: 'date',
        type: 'date',
        selectedCallback: (payload) => {
            filters.date = payload.value;
        }
    }, {
        id: 'month',
        type: 'month',
        selectedCallback: (payload) => {
            filters.month.value = payload.value;
            filters.month.label = payload.label;
        }
    }
]);

</script>