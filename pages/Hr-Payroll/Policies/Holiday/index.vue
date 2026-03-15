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

                        <div class="flex flex-col">
                            <div class="flex-none h-[1.25rem]"></div>
                            <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        </div>
                    </div>
                </form>

                <DialogModal
                    :show="showModalAsCreatingOrEditing"
                    :max-width="'568px'">
                    <template #title>
                        {{creatingHoliday ? 'Create Holiday' : 'Holiday'}}
                    </template>
                    <template #content>
                        <div class="pt-4 mx-auto max-w-screen-md grid gap-2 grid-cols-5">

                            <div class="col-span-full grid gap-2 grid-cols-2 sm:grid-cols-3">
                                <div>
                                    <InputLabel :size="'sm'" value="Date"/>
                                    <InputWithIcon
                                        :disabled="disableModalActions"
                                        high-light-all-text-on-focus
                                        @valueChanged="holidayDateChanged"
                                        :override="{font_family_class: 'font-sans'}"
                                        :icon="'mdi:calendar-cursor-outline'"
                                        :id="`holiday-date`" v-model="holidayEditable.date" :size="'md'" />
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Effective Date"/>
                                    <InputWithIcon
                                        :disabled="disableModalActions"
                                        high-light-all-text-on-focus
                                        @valueChanged="effectiveDateChanged"
                                        :override="{font_family_class: 'font-sans'}"
                                        :icon="'mdi:calendar-cursor-outline'"
                                        :id="`effective-date`" v-model="holidayEditable.effective_date" :size="'md'" />
                                </div>
                                <div>
                                    <InputLabel :size="'sm'" value="Active"/>
                                    <RadioGroup
                                        :disabled="disableModalActions"
                                        :selections="holidayActiveSelection"
                                        :size="'md'"
                                        :orientation="radioGroupOrientation"
                                        :radio-key="'holiday-active'"
                                        v-model="holidayEditable.active" />
                                </div>
                            </div>

                            <div class="col-span-full sm:col-span-3">
                                <div>
                                    <InputLabel :size="'sm'" value="Name"/>
                                    <Input :disabled="disableModalActions" :size="'md'" v-model="holidayEditable.name"/>
                                </div>
                            </div>

                            <div class="col-span-full">
                                <InputLabel :size="'sm'" value="Type"/>
                                <RadioGroup
                                    :disabled="disableModalActions"
                                    :selections="holidayTypeOptions"
                                    :size="'md'"
                                    :orientation="radioGroupOrientation"
                                    :radio-key="'holiday-type'"
                                    v-model="holidayEditable.type" />
                            </div>

                            <div v-if="holidayEditable.type == HOLIDAY.LEGAL || holidayEditable.type == HOLIDAY.DOUBLE" class="col-span-full">

                                <InputLabel :size="'sm'" value="Forfeit holiday pay on non-attendance, if not paid on a workday preceding a holiday."/>
                                <label class="flex items-center">
                                    <Checkbox
                                        :disabled="disableActions"
                                        name="holiday-pay-forfeiture"
                                        v-model="holidayEditable.holiday_pay_forfeiture"
                                        :size="'md'"
                                        :label="'Holiday pay forfeiture'" />
                                </label>
                            </div>

                            <div class="col-span-full grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5">
                                <div>
                                    <InputLabel :size="'sm'" value="Recurring"/>
                                    <RadioGroup
                                        :disabled="disableModalActions"
                                        :selections="holidayRecurringSelection"
                                        :size="'md'"
                                        :orientation="radioGroupOrientation"
                                        :radio-key="'holiday-recurring'"
                                        v-model="holidayEditable.recurring" />
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="mx-auto max-w-screen-xl">
                            <div class="flex space-x-2 justify-between">
                                <div class="space-x-2 inline-flex">
                                    <div class="space-x-2 inline-flex items-center">
                                    </div>
                                </div>
                                <div class="space-x-2 inline-flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'md'"
                                        :disabled="disableModalActions"
                                        :label="'Cancel'"
                                        @click="closeCreateEditForm"/>
                                    <Button
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="submitCreateEditHolidayIcon"
                                        :disabled="disableModalActions"
                                        :label="submitCreateEditHolidayLabel"
                                        @click="submitCreateEdit"/>
                                </div>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="px-[20px] space-y-2">

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                        <Button v-if="holidays.successful" @click="put(null)" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:plus'"></Button>
                        <div v-if="holidays.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedHolidays.length}}</span> Selected</span>
                        </div>
                        <Button v-if="holidays.successful" :variant="'outline'" :size="'sm'" :icon="'mdi:delete-outline'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected()" />
                        <Button v-if="holidays.successful" :variant="'outline'" :size="'sm'" :icon="'tdesign:close'" :disabled="disableActions" :label="'Clear selection'" @click="selectedHolidays = []" />
                        <Label v-if="!holidays.successful" invert :size="'md'" :type="'danger'" :label="holidays.message" />
                    </div>

                    <DataTable
                        v-if="holidays.successful"
                        :headers="holidaysHeaders"
                        :size="'lg'"
                        :rows="holidays.data"
                        :disabled="disableDataTable"
                        v-model="selectedHolidays"
                        selection>
                        <template v-slot:cell.actions="{cell,slot: cellSlot}">
                            <div class="text-base h-[32px] px-2 gap-0.5 flex items-center justify-center cursor-pointer accent-hover" @click="put(cell)">
                                <span class="font-narrow-thin">Edit</span>
                                <Icon class="h-5 w-5" :name="'gg:external'"/>
                            </div>
                        </template>
                        <template v-slot:cell.type="{cell,slot}">
                            <div class="p-[3px]">{{cell.type.text}}</div>
                        </template>
                        <template v-slot:cell.holiday_pay_forfeiture="{cell, slot, scrollReference}">
                            <div v-if="[HOLIDAY.LEGAL, HOLIDAY.DOUBLE].indexOf(parseInt(cell.type.value)) >= 0" class="flex justify-center">
                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="Boolean(cell.holiday_pay_forfeiture)"></NonModelCheckBox>
                            </div>
                            <div v-else class="p-[3px]"></div>
                        </template>
                        <template v-slot:cell.date="{cell,slot}">
                            <div class="p-[3px]">{{cell.date_readable}}</div>
                        </template>
                        <template v-slot:cell.recurring="{cell, slot, scrollReference}">
                            <div class="flex justify-center">
                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="Boolean(cell.recurring)"></NonModelCheckBox>
                            </div>
                        </template>
                        <template v-slot:cell.active="{cell, slot, scrollReference}">
                            <div class="flex justify-center">
                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="Boolean(cell.active)"></NonModelCheckBox>
                            </div>
                        </template>
                        <template v-slot:cell.effective_date="{cell,slot}">
                            <div class="p-[3px]">{{cell.effective_date_readable}}</div>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="holidays.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="holidays.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Holidays`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const moment = nuxtApp.$moment;
const {render} = dateTimePicker();
const {screenWidthBreakpoint, width: screenWidth} = useScreen();
const clientReadyState = useClientReadyState();
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
});

const holidaysHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', minWidth: '33px'},
    { text: 'Name', value: 'name', alignData: 'left'},
    { text: 'Type', value: 'type', alignData: 'left'},
    { text: 'Holiday Pay Forfeiture', value: 'holiday_pay_forfeiture', alignData: 'left'},
    { text: 'Date', value: 'date', alignData: 'left', alignHeader: 'center', minWidth: '144px'},
    { text: 'Recurring', value: 'recurring', alignData: 'left', alignHeader: 'center', minWidth: '144px'},
    { text: 'Active', value: 'active', alignData: 'left', alignHeader: 'center', minWidth: '144px'},
    { text: 'Effective Date', value: 'effective_date', alignData: 'left', minWidth: '144px'},
]);

const holidays = reactive<DataTableT>({
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
    'successful': false,
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
    perPage: 15,
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
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: filters.search.keyword,
        }
    };
});
const attendancesPending = ref(false)
const selectedHolidays = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return attendancesPending.value || createEditPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableModalActions = computed(() => {
    return disableActions.value || companyAssociationPendingState().value;
})
const disableDataTable = computed(() => {
    return attendancesPending.value || companyAssociationPendingState().value;
});
const holidaysExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    attendancesPending.value = true;

    await laraFetch(`/api/holidays`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            attendancesPending.value = false;
        },
        onResponse: (request, options, response) => {
            attendancesPending.value = false;
            holidays.successful = _get(response, '_data.successful', false);
            holidays.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            holidays.data = _get(response, '_data.values.data', [])
            holidays.meta = _get(response, '_data.values.meta', {
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
holidaysExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedHolidays.value = [];
    }

    if(filters.page === page){
        holidaysExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const confirmDeleteSelected = () => {

    const selectedIds = selectedHolidays.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected holiday to delete.`,
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
        message: `Confirm delete selected holiday${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedHolidays.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/holidays", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            holiday_ids: selectedIds,
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
                message: `Holiday${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedHolidays.value = [];
    await holidaysExecute();
}

const radioGroupOrientation = computed(() => {
    return screenWidth.value >= screenWidthBreakpoint['sm'] ? 'horizontal' : 'vertical';
})

const holidayEditable = reactive<{
    name: string,
    type: number,
    holiday_pay_forfeiture: boolean,
    date: string,
    recurring: number,
    active: number,
    effective_date: string,
}>({
    name: '',
    type: HOLIDAY.SPECIAL as number,
    holiday_pay_forfeiture: true,
    date: moment().format('YYYY-MM-DD'),
    recurring: 1,
    active: 1,
    effective_date: moment().format('YYYY-MM-DD'),
});
const holidayTypeOptions = reactive([
    $enumerableOption(HOLIDAY_NAME, HOLIDAY.SPECIAL as number),
    $enumerableOption(HOLIDAY_NAME, HOLIDAY.LEGAL as number),
    $enumerableOption(HOLIDAY_NAME, HOLIDAY.DOUBLE as number),
]);
const holidayDateChanged = (value: string) => {
    let dateValid = moment(value.trim(), "YYYY-MM-DD", true).isValid();

    if(!dateValid){
        holidayEditable.date = moment().format("YYYY-MM-DD")
    }
}
const holidayRecurringSelection = reactive([
    {text : 'Yes', value: 1},
    {text : 'No', value: 0},
]);
const holidayActiveSelection = reactive([
    {text : 'Yes', value: 1},
    {text : 'No', value: 0},
]);
const effectiveDateChanged = (value: string) => {
    let dateValid = moment(value.trim(), "YYYY-MM-DD", true).isValid();

    if(!dateValid){
        holidayEditable.effective_date = moment().format("YYYY-MM-DD")
    }
}

const datePickers = ref([
    {
        id: `holiday-date`,
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            holidayEditable.date = payload.value;
            holidayEditable.effective_date = payload.value;
        }
    },
    {
        id: `effective-date`,
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            holidayEditable.effective_date = payload.value;
        }
    },
]);

const stagedHoliday = ref<{
    'id': string | number | null,
    'ulid': string | null,
}>({
    'id': null,
    'ulid': null,
});

const creatingOrEditingHoliday = ref(false);
const showModalAsCreatingOrEditing = computed(() => {
    return creatingOrEditingHoliday.value;
})
const createEditPending = ref(false);
const creatingHoliday = computed(() => {
    return stagedHoliday.value.id == null;
});

const resetCreatingOrEditing = () => {
    stagedHoliday.value = {
        'id': null,
        'ulid': null,
    };

    holidayEditable.name = '';
    holidayEditable.type = HOLIDAY.SPECIAL as number;
    holidayEditable.holiday_pay_forfeiture = true;
    holidayEditable.date = moment().format('YYYY-MM-DD');
    holidayEditable.recurring = 1;
    holidayEditable.active = 1;
    holidayEditable.effective_date = moment().format('YYYY-MM-DD');
    creatingOrEditingHoliday.value = false;
};
const closeCreateEditForm = () => {
    resetCreatingOrEditing();
};

const put = async(row: TableRowT | null = null) => {

    creatingOrEditingHoliday.value = true;

    if(row){
        stagedHoliday.value = {
            'id': row.id as number,
            'ulid': row.ulid as string,
        };

        holidayEditable.name = row.name;
        holidayEditable.type = row.type.value;
        holidayEditable.holiday_pay_forfeiture = row.holiday_pay_forfeiture;
        holidayEditable.date = row.date;
        holidayEditable.recurring = row.recurring;
        holidayEditable.active = row.active;
        holidayEditable.effective_date = row.effective_date;
    }

    await render(datePickers.value);
};

const submitCreateEditHolidayIcon = computed(() => {
    return createEditPending.value ? 'eos-icons:loading' : creatingHoliday.value ? 'mdi:plus' : 'ic:sharp-save';
});

const submitCreateEditHolidayLabel = computed(() => {
    return createEditPending.value ? 'Please wait' : creatingHoliday.value ? 'Create' : 'Save';
});

const submitCreateEditPath = computed(() => {
    return creatingHoliday.value ? '/api/holiday' : `/api/holiday/${stagedHoliday.value.ulid}`;
});

const submitCreateEditForm = computed(() => {
    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        ...holidayEditable
    }
});

const submitCreateEdit = async () => {

    createEditPending.value = true;

    await laraFetch(submitCreateEditPath.value, {
        method: creatingHoliday.value ? 'POST' : 'PATCH',
        body: submitCreateEditForm.value,
    },{
        onRequestError: (request, options, error) => {
            createEditPending.value = false;
        },
        onResponse: () => {
            createEditPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `Holiday ${creatingHoliday.value ? 'created' : 'updated'} successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            resetCreatingOrEditing();
            await nextTick();
            await holidaysExecute();
        }
    });
};
</script>

<style scoped>

</style>