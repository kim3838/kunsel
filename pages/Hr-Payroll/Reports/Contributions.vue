<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-lg">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
                        <div>
                            <InputLabel :size="'sm'" value="Search payroll" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.payroll_search.keyword" class="w-full" placeholder="Search payroll" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Search employee" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.employee_search.keyword" class="w-full" placeholder="Search employee" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" for="month" value="From month" />
                            <InputWithIcon
                                glint
                                :icon="'mdi:calendar-cursor-outline'"
                                :size="'md'"
                                :id="'from_month'"
                                v-model="formStore.filters.fromMonthLabel"
                                readonly />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" for="month" value="To month" />
                            <InputWithIcon
                                glint
                                :icon="'mdi:calendar-cursor-outline'"
                                :size="'md'"
                                :id="'to_month'"
                                v-model="formStore.filters.toMonthLabel"
                                readonly />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Pay Frequency" />
                            <MultiSelect
                                :key="payFrequencyOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :selection-max-viewable-line="15"
                                :size="'md'"
                                :options="payFrequencyOptions"
                            />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Frequency Sequence" />
                            <MultiSelect
                                :key="payFrequencySequenceOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :selection-max-viewable-line="15"
                                :size="'md'"
                                :options="payFrequencySequenceOptions"
                            />
                        </div>
                        <div class="col-span-2">
                            <InputLabel :size="'sm'" value="Filter payrolls" />
                            <MultiSelectPaginated
                                :key="payrollSelectionsOptionsKey"
                                :selection-max-viewable-line="20"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :size="'md'"
                                :label="'Filter payroll(s)'"
                                :payload="payrollSelectionsOptions"
                            />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Filter employees" />
                            <MultiSelectPaginated
                                :key="employeeOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :size="'md'"
                                :label="'Filter employee(s)'"
                                :payload="employeeOptions"
                            />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Employee Group" />
                            <MultiSelect :key="employeeGroupOptionsKey" glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="employeeGroupOptions" :disabled="disableActions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <Button v-if="contributions.successful" class="w-min" type="button" :disabled="disableActions" :size="'md'" :variant="'flat'" :icon="'ri:file-download-line'" @click="exportCsv" :override="{font_family_class: 'font-[Prociono]'}" :label="'Export .csv'"></Button>
                    </div>
                </form>

                <div class="px-[20px] space-y-2">
                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                            <Label v-if="!contributions.successful" invert :size="'md'" :type="'danger'" :label="contributions.message" />
                        </div>
                    </div>

                    <DataTable
                        v-if="contributions.successful"
                        :key="contributionsKey"
                        :sup-headers="contributionsSupHeaders"
                        :headers="contributionsHeaders"
                        :size="'lg'"
                        :rows="contributions.data"
                        v-model="selectedContributions"
                        selection>
                        <template v-slot:cell.payroll_number="{cell,slot}">
                            <div class="px-[3px] font-medium">{{cell.payroll.number}}</div>
                        </template>
                        <template v-slot:cell.payroll_year="{cell,slot}">
                            <div class="px-[3px]">{{cell.payroll.year}}</div>
                        </template>
                        <template v-slot:cell.payroll_month_readable="{cell,slot}">
                            <div class="px-[3px]">{{cell.payroll.month_readable}}</div>
                        </template>
                        <template v-slot:cell.employee_number="{cell,slot}">
                            <div class="px-[3px]">{{cell.employee.number}}</div>
                        </template>
                        <template v-slot:cell.employee_full_name="{cell,slot}">
                            <div class="px-[3px]">{{cell.employee.full_name}}</div>
                        </template>
                        <template v-slot:cell.type="{cell,slot}">
                            <div class="p-[3px]">{{cell.type.text}}</div>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="contributions.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="contributions.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableSupHeaderT} from "@/public/js/types/data";
import type {DateTimePickerPayloadT} from "@/public/js/datetimepicker/type";
import type {StringEnumInterface} from "@/public/js/common/type";
import { withQuery } from 'ufo';
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Contributions`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const {render} = dateTimePicker();
const clientReadyState = useClientReadyState();
const formStore = nuxtApp.$formStore;
const common = useCommon();
const {
    fromMonthValueComputed,
    toMonthValueComputed,
} = storeToRefs(nuxtApp.$formStore);
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        rebuildSelections();
        paginate();
    }
});

const rebuildSelections = (selection: string[] = []) => {

    if(_isEmpty(selection) || selection.indexOf('payroll') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            payrollSelectionsOptions, payrollSelectionsOptionsKey, SELECT.MULTI_PAGINATED
        );
    }

    if(_isEmpty(selection) || selection.indexOf('employee') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employeeOptions, employeeOptionsKey, SELECT.MULTI_PAGINATED
        );
    }

    if(_isEmpty(selection) || selection.indexOf('employee_group') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employeeGroupOptions, employeeGroupOptionsKey, SELECT.MULTI_STATIC, companyOrganizationSelections.value.employee_groups
        );
    }
}

const payFrequencySelections = [
    $enumerableOption(PAY_FREQUENCY_NAME, PAY_FREQUENCY_TYPE.SEMIMONTHLY as number),
    $enumerableOption(PAY_FREQUENCY_NAME, PAY_FREQUENCY_TYPE.MONTHLY as number),
];

const payFrequencyOptionsKey = shallowRef(0);
const payFrequencyOptions = reactive({
    search: '',
    selection: payFrequencySelections,
    selected: []
});

const payFrequencySequenceSelections = [
    $enumerableOption(PAY_FREQUENCY_SEQUENCE_NAME, PAY_FREQUENCY_SEQUENCE_TYPE.FIRST_HALF as number),
    $enumerableOption(PAY_FREQUENCY_SEQUENCE_NAME, PAY_FREQUENCY_SEQUENCE_TYPE.SECOND_HALF as number),
];

const payFrequencySequenceOptionsKey = shallowRef(0);
const payFrequencySequenceOptions = reactive({
    search: '',
    selection: payFrequencySequenceSelections,
    selected: []
});

const payrollSelectionsOptionsKey = shallowRef(0);
const payrollSelectionsOptions = reactive({
    fetch: {
        url: '/api/payroll-selections',
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: [],
});

const employeeOptionsKey = shallowRef(0);
const employeeOptions = reactive({
    fetch: {
        url: '/api/employee-selections',
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: [],
});

const companyOrganizationSelections = companyOrganizationSelectionsState();
const employeeGroupOptionsKey = shallowRef(0);
const employeeGroupOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.employee_groups,
    selected: []
});

const contributionsSupHeaders = computed<TableSupHeaderT[]>(() => {
    return [
        {text: ''},
        {text: '', colspan: 3},

        {text: 'Employee', colspan: 2},

        {text: 'Employee', colspan: 2},

        {text: 'Employer Share', colspan: 1},

    ] as TableSupHeaderT[];
});

const contributionsHeaders = computed<TableHeaderT[]>(() => {
    return [
        { text: '#', value: 'row_number'},

        { text: 'Payroll #', value: 'payroll_number', alignData: 'left'},
        { text: 'Year', value: 'payroll_year'},
        { text: 'Month', value: 'payroll_month_readable'},

        { text: '#', value: 'employee_number', alignData: 'left'},
        { text: 'Name', value: 'employee_full_name'},

        { text: 'Type', value: 'component_name', alignData: 'left'},
        { text: 'Amount', value: 'employee_contribution', alignData: 'left', isNumeric: true, alignData: 'right'},

        { text: 'Amount', value: 'employer_share', alignData: 'left', isNumeric: true, alignData: 'right'},

    ] as TableHeaderT[];
});


const contributions = reactive<DataTableT>({
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
    payroll_search: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    },
    employee_search: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    },
}>({
    page: 1,
    perPage: 25,
    payroll_search: {
        keyword: '',
        callback: 1
    },
    employee_search: {
        keyword: '',
        callback: 1
    },
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

watch(fromMonthValueComputed, (newValue) => {
    paginate(1);
})

watch(toMonthValueComputed, (newValue) => {
    paginate(1);
})

let paramsComputed = computed(() => {
    return {
        page: filters.page,
        perPage: filters.perPage,
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_ids: [selectedAssociatedCompanyId.value],
            payroll_ids: payrollSelectionsOptions.selected,
            employee_ids: employeeOptions.selected,
            assigned_employee_group_ids: employeeGroupOptions.selected,
            payroll_search: filters.payroll_search.keyword,
            employee_search: filters.employee_search.keyword,

            payroll_from_month: formStore.filters.fromMonthValue,
            payroll_to_month: formStore.filters.toMonthValue,
            payroll_pay_frequencies: payFrequencyOptions.selected,
            payroll_frequency_sequences: payFrequencySequenceOptions.selected,
        }
    };
});

const contributionsKey = shallowRef(0);
const contributionsPending = ref(false)
const deleting = ref(false);
const selectedContributions = ref([]);

const disableActions = computed(() => {
    return contributionsPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return contributionsPending.value || companyAssociationPendingState().value;
});

const contributionsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value){
        return;
    }

    contributionsPending.value = true;

    await laraFetch(`/api/contributions`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            contributionsPending.value = false;
        },
        onResponse: (request, options, response) => {
            contributionsPending.value = false;
            contributions.successful = _get(response, '_data.successful', false);
            contributions.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {

            contributions.data = _get(response, '_data.values.data', [])
            contributions.meta = _get(response, '_data.values.meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
            contributionsKey.value += 1;
        }
    }, false);
}
contributionsExecute();

const exportCsv = async () => {

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value){
        return;
    }

    let params = {
        filters: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_ids: [selectedAssociatedCompanyId.value],
            payroll_ids: payrollSelectionsOptions.selected,
            employee_ids: employeeOptions.selected,
            assigned_employee_group_ids: employeeGroupOptions.selected,
            payroll_search: filters.payroll_search.keyword,
            employee_search: filters.employee_search.keyword,

            payroll_from_month: formStore.filters.fromMonthValue,
            payroll_to_month: formStore.filters.toMonthValue,
            payroll_pay_frequencies: payFrequencyOptions.selected,
            payroll_frequency_sequences: payFrequencySequenceOptions.selected,
        },
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
    }

    const urlWithParams = withQuery('/api/contributions-export', params)

    await laraBlobFetch({
        path: urlWithParams,
        filename: 'download.csv',
        action: 'download'
    }, {
        onResponse: () => {},
        onSuccessResponse: () => {}
    });
}

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.payroll_search.callback);
    clearTimeout(filters.employee_search.callback);

    if(clearSelection){
        selectedContributions.value = [];
    }

    if(filters.page === page){
        contributionsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

let datePickers = ref([
    {
        id: 'from_month',
        type: 'month',
        selectedCallback: (payload: DateTimePickerPayloadT) => {

            formStore.setFormFilterValue({
                key: 'fromMonthValue',
                value: payload.value
            });
            formStore.setFormFilterValue({
                key: 'fromMonthLabel',
                value: payload.label as string
            });
        }
    },
    {
        id: 'to_month',
        type: 'month',
        selectedCallback: (payload: DateTimePickerPayloadT) => {

            formStore.setFormFilterValue({
                key: 'toMonthValue',
                value: payload.value
            });
            formStore.setFormFilterValue({
                key: 'toMonthLabel',
                value: payload.label as string
            });
        }
    },
]);

const renderDatePickers = () => {
    render(datePickers.value);
}

//Render date time pickers on navigate
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(() => {
            renderDatePickers();
        });
    });
}

//Render date time pickers on load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            renderDatePickers();
        });
    }
})

</script>

<style scoped>

</style>