<template>
    <div class="tw-mx-auto tw-max-w-screen-2xl tw-flex tw-justify-center">
        <div class="tw-w-full">
            <form @submit.prevent="paginate(1, true)" class="tw-space-y-0.5 tw-my-4 tw-p-[1.5rem] neutral-border">
                <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                    <div class="tw-block">
                        <InputLabel :size="'md'" value="Search"/>
                        <Input :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="tw-w-full" placeholder="Search something" type="text" autocomplete="off"/>
                    </div>
                    <div class="tw-block">
                        <InputLabel :size="'md'" value="_" class="tw-text-transparent"/>
                        <Button type="button" :variant="'flat'" @click="filters.search.keyword += '.';" :size="'md'" :icon="'ic:sharp-join-left'" :label="'Concat &quot;.&quot;'"></Button>
                    </div>
                </div>

                <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                    <div class="tw-block">
                        <InputLabel :size="'md'" value="Code"/>
                        <Input :size="'md'" readonly v-model="filters.code" class="tw-w-full" placeholder="Search something" type="text" autocomplete="off"/>
                    </div>
                    <div class="tw-block">
                        <InputLabel :size="'md'" value="_" class="tw-text-transparent"/>
                        <Button type="button" :variant="'flat'" @click="filters.code += '.';" :size="'md'" :icon="'ic:sharp-join-left'" :label="'Concat &quot;.&quot;'"></Button>
                    </div>
                </div>

                <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                    <div class="tw-bloc">
                        <InputLabel :size="'md'" value="Date Added: From"/>
                        <InputWithIcon :icon="'ion:calendar-number-sharp'" :id="'datetimefrom'" readonly v-model="filters.datetimeFrom" :size="'md'" class="tw-w-full" :type="'text'"/>
                    </div>
                    <div class="tw-block">
                        <InputLabel :size="'md'" value="Date Added: To"/>
                        <InputWithIcon :icon="'ion:calendar-number-sharp'" :id="'datetimeto'" readonly v-model="filters.datetimeTo" :size="'md'" class="tw-w-full" :type="'text'"/>
                    </div>
                </div>

                <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                    <div class="tw-block">
                        <Button ref="submitButton" type="submit" :disabled="pending" :size="'md'" :icon="pending ? 'eos-icons:loading' : 'mdi:data'" :label="pending ? 'Loading' : 'Process'"></Button>
                    </div>
                </div>
            </form>

            <AccentFrame class="tw-mb-32">
                <template #content>
                    <div>
                        <PageInformation
                            v-if="prototypes.meta.pagination.total > 0"
                            :pagination="prototypes.meta.pagination"
                            :no-record-label="'No Record Found'"/>
                        <Pagination
                            :size="'lg'"
                            :pagination="prototypes.meta.pagination"
                            :pending="pending"
                            v-model="pageComputed"
                        />
                        <DataTable
                            class="tw-mt-0.5"
                            :headers="prototypeHeaders"
                            :size="'lg'"
                            :rows="prototypes.data"
                            :no-data-label="pending ? 'Loading' : 'No Prototype Found'"
                            v-model="selectedPrototypes"
                            selection>
                            <template v-slot:cell.datetime_added="{cell, slot}">
                                <InputWithIcon
                                    :icon="'ion:calendar-number-sharp'"
                                    :id="`datetime_added-` + cell.id"
                                    v-model="cell.datetime_added"
                                    readonly
                                    in-cell
                                    :size="slot.inputSize"
                                    class="tw-w-full"
                                    :type="'text'" />
                            </template>
                            <template v-slot:cell.actions="{cell, slot, scrollReference}">
                                <div class="tw-h-full tw-space-x-0.5 tw-w-full tw-flex tw-items-center">
                                    <Button type="button" :variant="'flat'" :size="slot.buttonSize" :label="'Details'" :icon="'ci:list-checklist-alt'"></Button>
                                    <Button type="button" :variant="'flat'" :size="slot.buttonSize" :label="'Approve'" :icon="'fe:check-circle'"></Button>
                                    <Button type="button" :variant="'flat'" :size="slot.buttonSize" :label="'Deny'" :icon="'icon-park-outline:reject'"></Button>
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </template>
            </AccentFrame>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, watch, nextTick, onMounted} from 'vue';
const {$moment} = useNuxtApp();
useLayout().setNavigationMode('solid');

definePageMeta({middleware: ['auth', 'verified']});

let prototypes = reactive({
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
let prototypeHeaders = reactive([
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

let selectedPrototypes = ref([]);
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

let pending = ref(false);
const {execute} = csrFetch("/api/v1/prototypes", {
    method: 'GET',
    params: paramsComputed,
    immediate: false,
},{
    onRequest: () => {
        pending.value = true;
        clearTimeout(filters.search.callback);
    },
    onRequestError: () => {
        pending.value = false;
    },
    onResponse: () => {
        pending.value = false;
    },
    onSuccessResponse: (request, response, options) => {
        prototypes.data = _get(response, '_data.values.data', []);
        prototypes.meta = _get(response, '_data.values.meta', {
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

    if(clearSelection){
        selectedPrototypes.value = [];
    }

    if(filters.page === page){
        execute();
    } else {
        filters.page = page;
    }
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
    let dataDateTimePickers = prototypes.data.map(record => {
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