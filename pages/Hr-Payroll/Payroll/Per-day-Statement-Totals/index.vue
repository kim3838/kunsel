<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Date From"/>
                            <InputWithIcon :icon="'mdi:calendar-today-outline'" :id="'date_from'" readonly v-model="formStore.filters.attendanceDateFrom" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" :disabled="disableActions" />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Date To"/>
                            <InputWithIcon :icon="'mdi:calendar-outline'" :id="'date_to'" readonly v-model="formStore.filters.attendanceDateTo" :size="'md'" class="w-full" :override="{font_family_class: 'font-sans'}" :disabled="disableActions" />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Status" />
                            <MultiSelect
                                :key="dayStatusOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :selection-max-viewable-line="15"
                                :size="'md'"
                                :label="'Filter Status'"
                                :options="dayStatusOptions"
                            />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Day Type" />
                            <MultiSelect
                                :key="dayTypeOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :selection-max-viewable-line="15"
                                :size="'md'"
                                :label="'Filter Day Type'"
                                :options="dayTypeOptions"
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

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Formulable Type" />
                            <MultiSelect
                                :key="formulableTypeOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :selection-max-viewable-line="5"
                                :size="'md'"
                                :label="'Filter Formulable Type'"
                                :options="formulableTypeOptions"
                            />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Payroll Component Type" />
                            <MultiSelect
                                :key="payrollComponentTypeOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :selection-max-viewable-line="20"
                                :size="'md'"
                                :label="'Filter Component Type'"
                                :options="payrollComponentTypeOptions"
                            />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Payroll Item" />
                            <MultiSelect
                                :key="payrollComponentNameOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :selection-max-viewable-line="20"
                                :size="'md'"
                                :label="'Filter Payroll Item'"
                                :options="payrollComponentNameOptions"
                            />
                        </div>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <Button v-if="perDayStatements.successful" class="w-min" type="button" :disabled="disableActions" :size="'md'" :variant="'outline'" :icon="'ri:file-download-line'" @click="exportCsv"  :override="{font_family_class: 'font-[Prociono]'}" :label="'Export .csv'"></Button>
                    </div>
                </form>

                <div class="px-[20px] space-y-2">
                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">

                        <div v-if="!perDayStatements.successful" class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                            <Label invert :size="'md'" :type="'danger'" :label="perDayStatements.message" />
                        </div>

                        <div v-if="!perDayStatementsPending" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                            <Label :size="'md'" :type="'clear'" shade :label="`Regular pay: ${totalRegularPay}`" />
                            <Label :size="'md'" :type="'clear'" shade :label="`Night diff. pay: ${totalNightDiffPay}`" />
                            <Label :size="'md'" :type="'clear'" shade :label="`Rest day pay: ${totalRestDayPay}`" />
                            <Label :size="'md'" :type="'clear'" shade :label="`Total: ${grandTotal}`" />
                        </div>
                    </div>

                    <DataTable
                        v-if="perDayStatements.successful"
                        :key="perDayStatementsKey"
                        :sup-headers="perDayStatementsSupHeaders"
                        :headers="perDayStatementsHeaders"
                        :size="'lg'"
                        :rows="perDayStatements.data"
                        v-model="selectedPerDayStatements"
                        selection>
                        <template v-slot:cell.employee_full_name="{cell,slot}">
                            <div class="px-[3px]" :title="cell.employee_full_name">{{wordClamp(cell.employee_full_name, 16)}}</div>
                        </template>
                        <template v-slot:cell.date_readable="{cell,slot}">
                            <div class="p-[3px] font-medium">{{cell.date_readable}}</div>
                        </template>
                        <template v-slot:cell.status="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status?.text" />
                            </div>
                        </template>
                        <template v-slot:cell.day_type="{cell,slot}">
                            <div class="p-[3px]">{{cell.day_type?.text}}</div>
                        </template>
                        <template v-slot:cell.formulable_type="{cell,slot}">
                            <div class="p-[3px]">{{cell.formulable_type?.text}}</div>
                        </template>
                        <template v-slot:cell.component_type="{cell,slot}">
                            <div class="p-[3px]">{{cell.component_type?.text}}</div>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="perDayStatements.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="perDayStatements.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {LabelTypeT} from "@/public/js/types/theme";
import type {StringEnumInterface} from "@/public/js/common/type";
import { withQuery } from 'ufo';
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Per day Statements`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const wordClamp = nuxtApp.$wordClamp as (text: string, length: number) => string;
const {render} = dateTimePicker();
const common = useCommon();
const clientReadyState = useClientReadyState();
const formStore = nuxtApp.$formStore;
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

    if(_isEmpty(selection) || selection.indexOf('formulable_type') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            formulableTypeOptions, formulableTypeOptionsKey, SELECT.MULTI_STATIC, formulableSelections
        );
    }

    if(_isEmpty(selection) || selection.indexOf('day_status') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            dayStatusOptions, dayStatusOptionsKey, SELECT.MULTI_STATIC, dayStatusSelections
        );
    }

    if(_isEmpty(selection) || selection.indexOf('day_type') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            dayTypeOptions, dayTypeOptionsKey, SELECT.MULTI_STATIC, dayTypeSelections
        );
    }

    if(_isEmpty(selection) || selection.indexOf('payroll_component_type') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            payrollComponentTypeOptions, payrollComponentTypeOptionsKey, SELECT.MULTI_STATIC, companyOrganizationSelections.value.payroll_component.types
        );
    }

    if(_isEmpty(selection) || selection.indexOf('payroll_component_name') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            payrollComponentNameOptions, payrollComponentNameOptionsKey, SELECT.MULTI_STATIC, companyOrganizationSelections.value.payroll_component.names
        );
    }
}

const dayStatusSelections = [
    $enumerableOption(SALARY_STATEMENT_ATTENDANCE_STATUS_NAME, SALARY_STATEMENT_ATTENDANCE_STATUS.FULL_PRESENT as number),
    $enumerableOption(SALARY_STATEMENT_ATTENDANCE_STATUS_NAME, SALARY_STATEMENT_ATTENDANCE_STATUS.PRESENT_WITH_IRREGULARITIES as number),
    $enumerableOption(SALARY_STATEMENT_ATTENDANCE_STATUS_NAME, SALARY_STATEMENT_ATTENDANCE_STATUS.DAY_OFF as number),
    $enumerableOption(SALARY_STATEMENT_ATTENDANCE_STATUS_NAME, SALARY_STATEMENT_ATTENDANCE_STATUS.LEAVE_WITHOUT_PAY as number),
    $enumerableOption(SALARY_STATEMENT_ATTENDANCE_STATUS_NAME, SALARY_STATEMENT_ATTENDANCE_STATUS.LEAVE_WITH_PAY as number),
    $enumerableOption(SALARY_STATEMENT_ATTENDANCE_STATUS_NAME, SALARY_STATEMENT_ATTENDANCE_STATUS.ABSENT as number),
];

const dayStatusOptionsKey = shallowRef(0);
const dayStatusOptions = reactive({
    search: '',
    selection: dayStatusSelections,
    selected: []
});

const dayTypeSelections = [
    $enumerableOption(SALARY_STATEMENT_ATTENDANCE_DAY_TYPE_NAME, SALARY_STATEMENT_ATTENDANCE_DAY_TYPE.WORKING_DAY as number),
    $enumerableOption(SALARY_STATEMENT_ATTENDANCE_DAY_TYPE_NAME, SALARY_STATEMENT_ATTENDANCE_DAY_TYPE.DAY_OFF as number),
    $enumerableOption(SALARY_STATEMENT_ATTENDANCE_DAY_TYPE_NAME, SALARY_STATEMENT_ATTENDANCE_DAY_TYPE.SPECIAL_HOLIDAY as number),
    $enumerableOption(SALARY_STATEMENT_ATTENDANCE_DAY_TYPE_NAME, SALARY_STATEMENT_ATTENDANCE_DAY_TYPE.LEGAL_HOLIDAY as number),
    $enumerableOption(SALARY_STATEMENT_ATTENDANCE_DAY_TYPE_NAME, SALARY_STATEMENT_ATTENDANCE_DAY_TYPE.DOUBLE_HOLIDAY as number),
];

const dayTypeOptionsKey = shallowRef(0);
const dayTypeOptions = reactive({
    search: '',
    selection: dayTypeSelections,
    selected: []
});

const companyOrganizationSelections = companyOrganizationSelectionsState();

const formulableSelections = [
    $enumerableOption(FORMULABLE_NAME, FORMULABLE.EARNINGS as number),
    $enumerableOption(FORMULABLE_NAME, FORMULABLE.DEDUCTIONS as number),
    $enumerableOption(FORMULABLE_NAME, FORMULABLE.INCOME_TAX as number),
];

const formulableTypeOptionsKey = shallowRef(0);
const formulableTypeOptions = reactive({
    search: '',
    selection: formulableSelections,
    selected: []
});

const payrollComponentTypeOptionsKey = shallowRef(0);
const payrollComponentTypeOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.payroll_component.types,
    selected: []
});

const payrollComponentNameOptionsKey = shallowRef(0);
const payrollComponentNameOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.payroll_component.names,
    selected: []
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

const employeeGroupOptionsKey = shallowRef(0);
const employeeGroupOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.employee_groups,
    selected: []
});

const perDayStatementsSupHeaders = computed<TableSupHeaderT[]>(() => {
    return [
        {text: ''},

        {text: 'Employee', colspan: 2, alignHeader: 'center'},

        {text: '', colspan: 4, alignHeader: 'center'},

        {text: 'Pay Items', colspan: 3, alignHeader: 'center'},

        {text: '', colspan: 4, alignHeader: 'center'},

    ] as TableSupHeaderT[];
});

const perDayStatementsHeaders = computed<TableHeaderT[]>(() => {
    return [
        { text: '#', value: 'row_number'},

        { text: '#', value: 'employee_number', alignData: 'left'},
        { text: 'Name', value: 'employee_full_name'},

        { text: 'Date', value: 'date_readable'},
        { text: '', value: 'week_day_name'},
        { text: 'Status', value: 'status'},
        { text: 'Day Type', value: 'day_type'},

        { text: 'Formulable', value: 'formulable_type'},
        { text: 'Component', value: 'component_type'},
        { text: 'Payroll item', value: 'component_name'},

        { text: 'Regular', value: 'regular_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        { text: 'Night diff', value: 'night_differential_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        { text: 'Rest day', value: 'rest_day_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        { text: 'Total', value: 'total', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    ] as TableHeaderT[];
});


const perDayStatements = reactive<DataTableT>({
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
}>({
    page: 1,
    perPage: 25,
});
const totalRegularPay = ref(0);
const totalNightDiffPay = ref(0);
const totalRestDayPay = ref(0);
const grandTotal = ref(0);

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
            account_id: selectedAssociatedCompanyAccountId.value,
            company_ids: [selectedAssociatedCompanyId.value],
            employee_ids: employeeOptions.selected,
            assigned_employee_group_ids: employeeGroupOptions.selected,
            date_from: formStore.filters.attendanceDateFrom,
            date_to: formStore.filters.attendanceDateTo,
            statement_date_statuses: dayStatusOptions.selected,
            statement_date_day_types: dayTypeOptions.selected,
            payroll_componentable_morph_to_type: payrollComponentTypeOptions.selected,
            payroll_componentable_component_sub_types: payrollComponentNameOptions.selected,
            formulable_types: formulableTypeOptions.selected,
        }
    };
});

const perDayStatementsKey = shallowRef(0);
const perDayStatementsPending = ref(false)
const deleting = ref(false);
const selectedPerDayStatements = ref([]);

const disableActions = computed(() => {
    return perDayStatementsPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return perDayStatementsPending.value || companyAssociationPendingState().value;
});

const perDayStatementsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value){
        return;
    }

    totalRegularPay.value = 0;
    totalNightDiffPay.value = 0;
    totalRestDayPay.value = 0;
    grandTotal.value = 0;
    perDayStatementsPending.value = true;

    await laraFetch(`/api/per-day-salary-statement-totals`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            perDayStatementsPending.value = false;
        },
        onResponse: (request, options, response) => {
            perDayStatementsPending.value = false;
            perDayStatements.successful = _get(response, '_data.successful', false);
            perDayStatements.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {

            let perDayStatementTotalsResponse = _get(response, '_data.values.per_day_statement_totals', {});

            totalRegularPay.value = _get(perDayStatementTotalsResponse, 'regular_pay', 0);
            totalNightDiffPay.value = _get(perDayStatementTotalsResponse, 'night_differential_pay', 0);
            totalRestDayPay.value = _get(perDayStatementTotalsResponse, 'rest_day_pay', 0);
            grandTotal.value = _get(perDayStatementTotalsResponse, 'total', 0);

            let perDayStatementsResponse = _get(response, '_data.values.per_day_statements', {});

            perDayStatements.data = _get(perDayStatementsResponse, 'data', []).map((perDayStatement: TableRowT) => {

                let dayStatus = _get(perDayStatement, 'status.value', 0);
                let dayType = _get(perDayStatement, 'day_type.value', 0);

                let shade = 'clear';

                if([
                    SALARY_STATEMENT_ATTENDANCE_DAY_TYPE.DAY_OFF,
                ].indexOf(dayType) >= 0){
                    shade = 'default';
                }

                return {
                    ...perDayStatement,
                    _payload: {
                        'label_shade': {
                            'cell': [
                                'date',
                                'week_day_name',
                                'status',
                                'day_type',
                                'formulable_type',
                                'component_type',
                                'component_name',
                                'regular_pay',
                                'night_differential_pay',
                                'rest_day_pay',
                                'total',
                            ],
                            'value': shade
                        }
                    }
                };
            });
            perDayStatements.meta = _get(perDayStatementsResponse, 'meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
            perDayStatementsKey.value += 1;
        }
    }, false);
}
perDayStatementsExecute();

const exportCsv = async () => {

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value){
        return;
    }

    let params = {
        filters: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_ids: [selectedAssociatedCompanyId.value],
            employee_ids: employeeOptions.selected,
            assigned_employee_group_ids: employeeGroupOptions.selected,
            date_from: formStore.filters.attendanceDateFrom,
            date_to: formStore.filters.attendanceDateTo,
            statement_date_statuses: dayStatusOptions.selected,
            statement_date_day_types: dayTypeOptions.selected,
            payroll_componentable_morph_to_type: payrollComponentTypeOptions.selected,
            payroll_componentable_component_sub_types: payrollComponentNameOptions.selected,
            formulable_types: formulableTypeOptions.selected,
        },
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
    }

    const urlWithParams = withQuery('/api/per-day-salary-statement-totals-export', params)

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

    if(clearSelection){
        selectedPerDayStatements.value = [];
    }

    if(filters.page === page){
        perDayStatementsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});


let filtersDateTimePickers = ref([
    {
        id: 'date_from',
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            formStore.setFormFilterValue({
                key: 'attendanceDateFrom',
                value: payload.value
            });
        }
    }, {
        id: 'date_to',
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            formStore.setFormFilterValue({
                key: 'attendanceDateTo',
                value: payload.value
            });
        }
    }
]);

//Render date time pickers on navigate
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(() => {
            render(filtersDateTimePickers.value);
        });
    });
}

//Render date time pickers on load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            render(filtersDateTimePickers.value);
        });
    }
})
</script>

<style scoped>

</style>