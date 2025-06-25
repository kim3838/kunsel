<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl scaffold-border-left-bottom-right">
                <div>
                    <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                        <div class="grid gap-2 grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                            <div class="block">
                                <InputLabel :size="'sm'" value="Search"/>
                                <Input :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search something" type="text" autocomplete="off"/>
                            </div>
                            <div class="block">
                                <InputLabel :size="'sm'" value="_" class="text-transparent"/>
                                <Button type="button" :variant="'flat'" @click="filters.search.keyword += '.';" :size="'md'" :icon="'ic:sharp-join-left'" :label="'Concat &quot;.&quot;'"></Button>
                            </div>
                        </div>

                        <div class="grid gap-2 grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                            <div class="block">
                                <InputLabel :size="'sm'" value="Code"/>
                                <Input :size="'md'" readonly v-model="filters.code" class="w-full" placeholder="Search something" type="text" autocomplete="off"/>
                            </div>
                            <div class="block">
                                <InputLabel :size="'sm'" value="_" class="text-transparent"/>
                                <Button type="button" :variant="'flat'" @click="filters.code += '.';" :size="'md'" :icon="'ic:sharp-join-left'" :label="'Concat &quot;.&quot;'"></Button>
                            </div>
                        </div>

                        <div class="grid gap-2 grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                            <div class="bloc">
                                <InputLabel :size="'sm'" value="Date Added: From"/>
                                <InputWithIcon :icon="'ion:calendar-number-sharp'" :id="'datetimefrom'" readonly v-model="filters.datetimeFrom" :size="'md'" class="w-full" />
                            </div>
                            <div class="block">
                                <InputLabel :size="'sm'" value="Date Added: To"/>
                                <InputWithIcon :icon="'ion:calendar-number-sharp'" :id="'datetimeto'" readonly v-model="filters.datetimeTo" :size="'md'" class="w-full" />
                            </div>
                        </div>

                        <div class="grid gap-2 grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                            <Button class="w-min" ref="submitButton" type="submit" :disabled="pending" :size="'md'" :icon="pending ? 'eos-icons:loading' : 'mdi:data'" :label="pending ? 'Loading' : 'Process'"></Button>
                        </div>

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
                        </div>
                    </form>

                    <FansyFrame>
                        <template v-slot:content>
                            <DataTable
                                class="mt-0.5"
                                :headers="prototypeHeaders"
                                :size="'lg'"
                                :rows="prototypes.data"
                                :no-data-label="pending ? 'Loading' : 'No Prototype Found'"
                                v-model="selectedPrototypes"
                                manual-sortable
                                @manualSorted="manualSorted"
                                selection>
                                <template v-slot:cell.datetime_added="{cell, slot}">
                                    <InputWithIcon
                                        :icon="'ion:calendar-number-sharp'"
                                        :id="`datetime_added-` + cell.id"
                                        v-model="cell.datetime_added"
                                        readonly
                                        :override="{font_size: slot.datepickerFontSize}"
                                        in-cell
                                        :size="slot.inputSize"
                                        class="w-full" />
                                </template>
                                <template v-slot:cell.actions="{cell, slot, scrollReference}">
                                    <div class="h-full mx-0.5 space-x-0.5 w-full flex items-center">
                                        <Button type="button" :size="slot.buttonSize" :label="'Details'"></Button>
                                        <Button type="button" :size="slot.buttonSize" :label="'Approve'"></Button>
                                        <Button type="button" :size="slot.buttonSize" :label="'Deny'"></Button>
                                    </div>
                                </template>
                            </DataTable>
                        </template>
                    </FansyFrame>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableMeta, TableHeaderT, TableRowT} from "@/public/js/types/data";
const {$moment} = useNuxtApp();
const clientReadyState = useClientReadyState();
definePageMeta({
    middleware: ['auth', 'verified'],
    validate: async(route) => {
        const nuxtApp = useNuxtApp()
        console.log({"Server side rendering": import.meta.server});
        console.log({"Client side rendering": import.meta.client});

        console.log({"Initial client load": nuxtApp.isHydrating && nuxtApp.payload.serverRendered});

        return true;
    }
});

useLayout().setNavigationMode('solid', 'Prototypes/index.vue');

let prototypes = reactive<{
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
let prototypeHeaders = reactive<TableHeaderT[]>([
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
let filters = reactive<{
    page: number,
    perPage: number,
    search: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    },
    code: string,
    datetimeFrom: string,
    datetimeTo: string,
}>({
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
    set(payload: { key: 'page' | 'perPage', value: number }) {
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
let execute = async () => {
    pending.value = true;
    clearTimeout(filters.search.callback);

    await laraFetch("/api/v1/prototypes", {
        method: 'GET',
        params: paramsComputed.value
    },{
        onRequestError: () => {
            pending.value = false;
        },
        onResponse: () => {
            pending.value = false;
        },
        onSuccessResponse: (request, options, response) => {
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
}

watch(pending, async (newPending, oldPending) => {
    if (!newPending) {
        await nextTick();
        //Focus Submit Button
        //@ts-ignore
        submitButton.value.$refs.button.focus();
        //Focus Search Input
        //@ts-ignore
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
        selectedCallback: (payload: {value: string}) => {
            filters.datetimeFrom = payload.value;
        }
    }, {
        id: 'datetimeto',
        type: 'datetime',
        selectedCallback: (payload: {value: string}) => {
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
            selectedCallback: (payload: {value: string}) => {
                record.datetime_added = payload.value;
            }
        }
    });

    let dateTimePickers = filtersDateTimePickers.value.concat(dataDateTimePickers);

    render(dateTimePickers);
}

function manualSorted(){
    renderDateTimePickers();
}

//Render date time pickers on navigate
onMounted(async () => {
    await nextTick(() => {
        render(filtersDateTimePickers.value);
    });
});

//Render date time pickers on load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            render(filtersDateTimePickers.value);
        });
    }
})
</script>