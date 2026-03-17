<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
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
                        <Button v-if="salaryStatements.successful" class="w-min" type="button" :disabled="disableActions" :size="'md'" :variant="'outline'" :icon="'bi:filetype-csv'" @click="exportCsv" :override="{font_family_class: 'font-[Prociono]'}" :label="'Export .csv'"></Button>
                        <div class="h-8 flex flex-row items-center scaffold-border px-2">
                            <label class="flex items-center">
                                <Checkbox
                                    :disabled="disableActions"
                                    name="show-statement-dates"
                                    v-model="showPayrollColumns"
                                    :size="'md'"
                                    :label="'Show payroll columns'" />
                            </label>
                        </div>
                        <div class="h-8 flex flex-row items-center scaffold-border px-2">
                            <label class="flex items-center">
                                <Checkbox
                                    :disabled="disableActions"
                                    name="show-days-total"
                                    v-model="showDaysTotalColumns"
                                    :size="'md'"
                                    :label="'Show days total columns'" />
                            </label>
                        </div>
                        <div class="h-8 flex flex-row items-center scaffold-border px-2">
                            <label class="flex items-center">
                                <Checkbox
                                    :disabled="disableActions"
                                    name="show-statement-dates"
                                    v-model="showSalaryStatementDetails"
                                    :size="'md'"
                                    :label="'Show statement sub-details'" />
                            </label>
                        </div>
                    </div>
                </form>

                <SalaryStatementManualAddDetails
                    v-model:show-manual-add-details="showManualAddDetails"
                    v-model:salary-statement-payload="stagedSalaryStatement"
                    @resolved="manualAddDetailsResolved"
                />

                <div class="px-[20px] space-y-2">
                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                            <div v-if="salaryStatements.successful" class="scaffold-border px-2 font-[National_Park]">
                                <span><span class="font-semibold">{{selectedSalaryStatements.length}}</span> Selected</span>
                            </div>
                            <Button
                                v-if="salaryStatements.successful"
                                :variant="'outline'"
                                :size="'sm'"
                                :icon="'tdesign:close'"
                                :disabled="disableActions"
                                :label="'Clear selection'"
                                @click="selectedSalaryStatements = []" />
                            <Button
                                v-if="salaryStatements.successful"
                                :variant="'outline'"
                                :size="'sm'"
                                :icon="'mdi:delete-outline'"
                                :disabled="disableActions"
                                :label="'Bulk delete'"
                                @click="confirmDeleteSelected()"/>
                            <SalaryStatementBulkEdit v-if="salaryStatements.successful" ref="salaryStatementBulkEdit" v-model:selected-salary-statement-ids="selectedSalaryStatements" @completed="bulkEditCompleted">
                                <Button
                                    :disabled="disableActions || selectedSalaryStatements.length == 0"
                                    :variant="`outline`"
                                    :size="'sm'"
                                    :label="`Bulk edit${selectedSalaryStatements.length ? ' ' + selectedSalaryStatements.length : ``}`"
                                    @click="bulkEdit" />
                            </SalaryStatementBulkEdit>
                            <Label v-if="!salaryStatements.successful" invert :size="'md'" :type="'danger'" :label="salaryStatements.message" />
                        </div>

                        <div v-if="!salaryStatementsPending" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                            <Label :size="'md'" :type="'clear'" shade :label="`Basic: ${totalBasicGross}`" />
                            <Label :size="'md'" :type="'clear'" shade :label="`Taxable: ${totalTaxable}`" />
                            <Label :size="'md'" :type="'clear'" shade :label="`Tax Withheld: ${totalTaxWithheld}`" />
                            <Label :size="'md'" :type="'clear'" shade :label="`Net: ${totalNet}`" />
                        </div>
                    </div>

                    <DataTable
                        v-if="salaryStatements.successful"
                        :key="salaryStatementsKey"
                        :sup-headers="salaryStatementsSupHeaders"
                        :headers="salaryStatementsHeaders"
                        :size="'lg'"
                        :rows="salaryStatements.data"
                        v-model="selectedSalaryStatements"
                        selection
                        :border-appearance="Boolean(salaryStatementSubRowExtensionSlug)"
                        :sub-row-slug="salaryStatementSubRowSlug"
                        :sub-row-extension-slug="salaryStatementSubRowExtensionSlug"
                        :sub-row-settings="{
                            type: DATATABLE_SUBROW_TYPE.TITLED,
                            containerPaddingTop: 0.75,
                            containerPaddingBottom: 1.75,
                            titleSize: 'md',
                            rowVerticalLine: true,
                            verticalBorderType: 'dashed'
                        }">
                        <template v-slot:cell.actions="{cell,slot: cellSlot}">
                            <div class="flex items-center">
                                <NavDrop
                                    class="z-10"
                                    :disabled="disableActions"
                                    :parent-icon="'ic:baseline-arrow-right'"
                                    in-horizontal-scrollable
                                    divider
                                    :size="`sm`"
                                    :drop-shadow-size="`xl`"
                                    :title="'Menu'"
                                    :drop-align="'top'"
                                    :drop-justify="'right'"
                                    :drop-options="[
                                        {type: 'link', icon: 'gg:row-first', title: 'Statement breakdown', to: `/hr-payroll/payroll/salary-statements/${cell.ulid}`},
                                        ...(cell.payroll.status.value == PAYROLL_STATUS.DRAFT ? [
                                            {type: 'action', icon: 'mdi:plus', title: 'Manual add payroll items', callback: () => {manualAddPayrollItems(cell);}}
                                        ] : [])
                                    ]">
                                    <template v-slot="{slot}">
                                        <div
                                            class="flex items-center pl-1 py-1 focus:outline-none">
                                            <span :class="[slot.headerFontClass, 'font-narrow-thin']">Menu</span>
                                            <Icon :class="[slot.dropDownIconClass]" :name="'ic:baseline-arrow-right'"/>
                                        </div>
                                    </template>
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.payroll_number="{cell,slot}">
                            <div class="px-[3px] font-medium" :title="cell.payroll?.number">{{wordClamp(cell.payroll?.number, showPayrollColumns ? 20 : 8)}}</div>
                        </template>
                        <template v-slot:cell.payroll_status="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell?.payroll.status?.text" />
                            </div>
                        </template>
                        <template v-slot:cell.year="{cell,slot}">
                            <div class="p-[3px]">{{cell.payroll.year}}</div>
                        </template>
                        <template v-slot:cell.month_readable="{cell,slot}">
                            <div class="p-[3px]">{{cell.payroll.month_readable}}</div>
                        </template>
                        <template v-slot:cell.pay_frequency="{cell,slot}">
                            <div class="p-[3px]">{{cell.payroll.pay_frequency?.text}}</div>
                        </template>
                        <template v-slot:cell.frequency_sequence="{cell,slot}">
                            <div class="p-[3px]">{{cell.payroll.frequency_sequence?.text}}</div>
                        </template>
                        <template v-slot:cell.date_range_readable="{cell,slot}">
                            <div class="p-[3px]">{{cell.payroll.date_range_readable}}</div>
                        </template>
                        <template v-slot:cell.employee_full_name="{cell,slot}">
                            <div class="px-[3px]" :title="cell.employee_full_name">{{wordClamp(cell.employee_full_name, 9)}}</div>
                        </template>
                        <template v-slot:cell.type="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="'clear'" shade :label="cell.type?.text" />
                            </div>
                        </template>
                        <template v-slot:cell.is_paid="{cell,slot}">
                            <div class="p-[3px]">{{cell.is_paid ? 'Yes' : 'No'}}</div>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="ic:outline-keyboard-arrow-right" :class="[slot.iconSizeClass, slot.iconHolderClass]" /><div :class="[slot.titleSizeClass]">Statement dates</div>
                            </div>
                            <div :style="{'max-height': `270px`, 'overflow-y': 'scroll'}">
                                <SalaryStatementAttendanceSubRow
                                    :rows="cell[slot.slug]"
                                ></SalaryStatementAttendanceSubRow>
                            </div>
                        </template>
                        <template v-slot:sub_row_extension_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="ic:outline-keyboard-arrow-right" :class="[slot.iconSizeClass, slot.iconHolderClass]" /><div :class="[slot.titleSizeClass]">Statement details</div>
                            </div>
                            <div :style="{'max-height': slot.extensionSlugContentMaxHeight, 'overflow-y': 'scroll'}">
                                <SalaryStatementDetailSubRow
                                    v-if="cell[slot.slug].length"
                                    :rows="cell[slot.extensionSlug]"
                                ></SalaryStatementDetailSubRow>
                            </div>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="salaryStatements.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="salaryStatements.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {DateTimePickerPayloadT} from "@/public/js/datetimepicker/type";
import type {StringEnumInterface} from "@/public/js/common/type";
import type {LabelTypeT} from "@/public/js/types/theme";
import type {SalaryStatementT} from "@/public/js/types/payroll";
import { withQuery } from 'ufo';
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Salary Statements`}});
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

const showPayrollColumns = ref(true);
const showDaysTotalColumns = ref(false);

const {headerSupFields, headerFields, daysTotalHeaderSupFields, daysTotalHeaderFields} = useSalaryStatement();

const salaryStatementsSupHeaders = computed<TableSupHeaderT[]>(() => {
    return [
        {text: ''},
        {text: ''},

        ...(showPayrollColumns.value ? [
            {text: 'Payroll', colspan: 7, alignHeader: 'center'},
        ] : [
            {text: '', colspan: 1, alignHeader: 'center'},
        ]),

        {text: 'Employee', colspan: 2},
        {text: 'Statement', colspan: 2},

        ...(showDaysTotalColumns.value ? daysTotalHeaderSupFields.value : []),

        ...headerSupFields.value,

    ] as TableSupHeaderT[];
});

const salaryStatementsHeaders = computed<TableHeaderT[]>(() => {
    return [
        { text: '#', value: 'row_number'},
        { text: '', value: 'actions'},

        ...(showPayrollColumns.value ? [
            { text: '#', value: 'payroll_number', alignData: 'left'},
            { text: 'Status', value: 'payroll_status'},

            { text: 'Year', value: 'year'},
            { text: 'Month', value: 'month_readable'},

            { text: 'Freq.', value: 'pay_frequency'},
            { text: 'Seq.', value: 'frequency_sequence'},

            { text: 'Period', value: 'date_range_readable'},
        ] : [
            { text: 'Payroll #', value: 'payroll_number', alignData: 'left'},
        ]),

        { text: '#', value: 'employee_number', alignData: 'left'},
        { text: 'Name', value: 'employee_full_name'},
        { text: 'Type', value: 'type', alignData: 'left'},
        { text: 'Is Paid', value: 'is_paid', alignData: 'left'},

        ...(showDaysTotalColumns.value ? daysTotalHeaderFields.value : []),

        ...headerFields.value,
    ] as TableHeaderT[];
});


const salaryStatements = reactive<DataTableT>({
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
const totalBasicGross = ref(0);
const totalTaxable = ref(0);
const totalTaxWithheld = ref(0);
const totalNet = ref(0);

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

const showSalaryStatementDetails = ref(false);
const salaryStatementSubRowSlug = ref('');
const salaryStatementSubRowExtensionSlug = ref('');

watch(() => {return showSalaryStatementDetails.value;}, (show) => {
    if(show){
        salaryStatementSubRowSlug.value = 'statement_attendances';
        salaryStatementSubRowExtensionSlug.value = 'statement_details';
        salaryStatementsExecute()
    } else {
        salaryStatementSubRowSlug.value = '';
        salaryStatementSubRowExtensionSlug.value = '';
        salaryStatementsExecute()
    }
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

const salaryStatementsKey = shallowRef(0);
const salaryStatementsPending = ref(false)
const deleting = ref(false);
const selectedSalaryStatements = ref([]);

const disableActions = computed(() => {
    return salaryStatementsPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return salaryStatementsPending.value || companyAssociationPendingState().value;
});

const salaryStatementsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value|| !selectedAssociatedCompanyId.value){
        return;
    }

    totalBasicGross.value = 0;
    totalTaxable.value = 0;
    totalTaxWithheld.value = 0;
    totalNet.value = 0;
    salaryStatementsPending.value = true;

    await laraFetch(`/api/salary-statements`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            salaryStatementsPending.value = false;
        },
        onResponse: (request, options, response) => {
            salaryStatementsPending.value = false;
            salaryStatements.successful = _get(response, '_data.successful', false);
            salaryStatements.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {

            let salaryStatementTotalsResponse = _get(response, '_data.values.salary_statement_totals', {});

            totalBasicGross.value = _get(salaryStatementTotalsResponse, 'basic_gross', 0);
            totalTaxable.value = _get(salaryStatementTotalsResponse, 'taxable', 0);
            totalTaxWithheld.value = _get(salaryStatementTotalsResponse, 'withholding_tax', 0);
            totalNet.value = _get(salaryStatementTotalsResponse, 'net', 0);

            let salaryStatementsResponse = _get(response, '_data.values.salary_statements', {});

            salaryStatements.data = _get(salaryStatementsResponse, 'data', []).map((salaryStatement: TableRowT) => {

                let statusSummary = _get(salaryStatement, 'payroll.status.value', 0);

                let shade = 'clear';

                if(statusSummary == PAYROLL_STATUS.DRAFT){
                    shade = 'clear';
                } else if(statusSummary == PAYROLL_STATUS.WORKFLOW_IN_PROGRESS){
                    shade = 'info';
                } else if(statusSummary == PAYROLL_STATUS.COMPLETED){
                    shade = 'success';
                }

                return {
                    ...salaryStatement,
                    _payload: {
                        'label_shade': {
                            'cell': ['payroll_number', 'payroll_status', 'year', 'month_readable'],
                            'value': shade
                        }
                    }
                };
            });
            salaryStatements.meta = _get(salaryStatementsResponse, 'meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
            salaryStatementsKey.value += 1;
        }
    }, false);
}
salaryStatementsExecute();

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

    const urlWithParams = withQuery('/api/salary-statements-export', params)

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
        selectedSalaryStatements.value = [];
    }

    if(filters.page === page){
        salaryStatementsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

/**
 * Bulk edit
 *
 **/
const salaryStatementBulkEditReference = useTemplateRef('salaryStatementBulkEdit');
const bulkEdit = () => {
    salaryStatementBulkEditReference.value?.bulkEdit();
}
const bulkEditCompleted = () => {
    paginate();
}

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

const confirmDeleteSelected = () => {

    const selectedIds = selectedSalaryStatements.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected salary statement to delete.`,
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
        message: `Confirm delete salary statement${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedSalaryStatements.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/salary-statements", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            salary_statement_ids: selectedIds,
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
                message: `Salary statement${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedSalaryStatements.value = [];
    await salaryStatementsExecute();
}

const stagedSalaryStatement = ref<SalaryStatementT>({} as SalaryStatementT);

const showManualAddDetails = ref(false);
const manualAddPayrollItems = (salaryStatement: TableRowT) => {
    stagedSalaryStatement.value = salaryStatement as SalaryStatementT;
    showManualAddDetails.value = true;
}
const manualAddDetailsResolved = () => {
    salaryStatementsExecute();
}

</script>

<style scoped>

</style>