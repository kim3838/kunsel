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
                        <div class="flex flex-col">
                            <div class="flex-none h-[1.25rem]"></div>
                            <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        </div>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <div class="h-8 flex flex-row items-center scaffold-border px-2">
                            <label class="flex items-center">
                                <Checkbox
                                    :disabled="disableActions"
                                    name="show-statement-dates"
                                    v-model="showPayrollInfo"
                                    :size="'md'"
                                    :label="'Show payroll info.'" />
                            </label>
                        </div>
                        <div class="h-8 flex flex-row items-center scaffold-border px-2">
                            <label class="flex items-center">
                                <Checkbox
                                    :disabled="disableActions"
                                    name="show-days-total"
                                    v-model="showDaysTotal"
                                    :size="'md'"
                                    :label="'Show days total'" />
                            </label>
                        </div>
                        <div class="h-8 flex flex-row items-center scaffold-border px-2">
                            <label class="flex items-center">
                                <Checkbox
                                    :disabled="disableActions"
                                    name="show-statement-dates"
                                    v-model="showSalaryStatementDetails"
                                    :size="'md'"
                                    :label="'Show statement details'" />
                            </label>
                        </div>
                    </div>

                    <div>
                        <PageInformation :pagination="salaryStatements.meta.pagination" :pending="disableDataTable"/>
                        <div class="flex items-center gap-2">
                            <Pagination :size="'lg'" :pagination="salaryStatements.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                        </div>
                    </div>
                </form>

                <div class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
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
                        <Label v-if="!salaryStatements.successful" invert :size="'md'" :type="'danger'" :label="salaryStatements.message" />
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
                                {type: 'link', icon: 'ix:open-external', title: 'Statement breakdown', to: `/hr-payroll/payroll/salary-statements/${cell.ulid}`},
                            ]">
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.payroll_number="{cell,slot}">
                            <div class="px-[3px]" :title="cell.payroll?.number">{{wordClamp(cell.payroll?.number, showPayrollInfo ? 20 : 4)}}</div>
                        </template>
                        <template v-slot:cell.payroll_status="{cell,slot}">
                            <div class="p-[3px]">{{cell.payroll.status?.text}}</div>
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
                            <div class="px-[3px]" :title="cell.employee_full_name">{{wordClamp(cell.employee_full_name, 16)}}</div>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="ic:outline-keyboard-arrow-right" :class="[slot.iconSizeClass, slot.iconHolderClass]" /><div :class="[slot.titleSizeClass]">Statement dates</div>
                            </div>
                            <SalaryStatementAttendanceSubRow
                                :rows="cell[slot.slug]"
                            ></SalaryStatementAttendanceSubRow>
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
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableSupHeaderT} from "@/public/js/types/data";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Salary Statements`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const wordClamp = nuxtApp.$wordClamp as (text: string, length: number) => string;
const common = useCommon();
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

const showPayrollInfo = ref(true);
const showDaysTotal = ref(false);

const salaryStatementsSupHeaders = computed<TableSupHeaderT[]>(() => {
    return [
        {text: ''},
        {text: ''},

        ...(showPayrollInfo.value ? [
            {text: 'Payroll', colspan: 7, alignHeader: 'center'},
        ] : [
            {text: 'Payroll', colspan: 1, alignHeader: 'center'},
        ]),

        {text: 'Employee', colspan: 2, alignHeader: 'center'},

        ...(showDaysTotal.value ? [
            {text: 'Calendar days', colspan: 3, alignHeader: 'center'},
            {text: '', colspan: 1, alignHeader: 'center'},
            {text: 'Work days split', colspan: 3, alignHeader: 'center'},

            {text: 'Employee record', colspan: 4, alignHeader: 'center'},
        ] : []),

        {text: 'Totals', colspan: 6, alignHeader: 'center'},
    ] as TableSupHeaderT[];
});

const salaryStatementsHeaders = computed<TableHeaderT[]>(() => {
    return [
        { text: '#', value: 'row_number'},
        { text: '', value: 'actions'},

        ...(showPayrollInfo.value ? [
            { text: '#', value: 'payroll_number', alignData: 'left'},
            { text: 'Status', value: 'payroll_status'},
            { text: 'Year', value: 'year'},
            { text: 'Month', value: 'month_readable'},
            { text: 'Frequency', value: 'pay_frequency'},
            { text: 'Sequence', value: 'frequency_sequence'},
            { text: 'Payroll date', value: 'date_range_readable'},
        ] : [
            { text: '#', value: 'payroll_number', alignData: 'left'},
        ]),

        { text: '#', value: 'employee_number', alignData: 'left'},
        { text: 'Name', value: 'employee_full_name'},

        ...(showDaysTotal.value ? [
            { text: 'Days', value: 'total_days', isNumeric: true, alignData: 'right', alignHeader: 'right'},
            { text: 'Day offs', value: 'total_day_offs', isNumeric: true, alignData: 'right', alignHeader: 'right'},
            { text: 'Work days', value: 'total_working_days', isNumeric: true, alignData: 'right', alignHeader: 'right'},

            { text: 'WRD', value: 'total_working_rest_days', isNumeric: true, alignData: 'right', alignHeader: 'right'},

            { text: 'Regular', value: 'total_regular_work_days', isNumeric: true, alignData: 'right', alignHeader: 'right'},
            { text: 'Legal', value: 'total_legal_holidays', isNumeric: true, alignData: 'right', alignHeader: 'right'},
            { text: 'Special', value: 'total_special_holidays', isNumeric: true, alignData: 'right', alignHeader: 'right'},

            { text: 'Present', value: 'total_present', isNumeric: true, alignData: 'right', alignHeader: 'right'},
            { text: 'LWP', value: 'total_leave_with_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
            { text: 'LWOP', value: 'total_leave_without_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
            { text: 'Absent', value: 'total_absent', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        ] : []),

        { text: 'Taxable', value: 'taxable', isNumeric: true, minWidth: '75px', alignData: 'right', alignHeader: 'right'},
        { text: 'Nontaxable', value: 'nontaxable', isNumeric: true, minWidth: '75px', alignData: 'right', alignHeader: 'right'},
        { text: 'Contribution', value: 'contribution', isNumeric: true, minWidth: '75px', alignData: 'right', alignHeader: 'right'},
        { text: 'Withholding Tax', value: 'withholding_tax', isNumeric: true, minWidth: '75px', alignData: 'right', alignHeader: 'right'},
        { text: 'Deduction', value: 'deduction', isNumeric: true, minWidth: '75px', alignData: 'right', alignHeader: 'right'},
        { text: 'Net', value: 'net', isNumeric: true, minWidth: '75px', alignData: 'right', alignHeader: 'right'}
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
    'successful': true,
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
            salaryStatements.data = _get(response, '_data.values.data', []);
            salaryStatements.meta = _get(response, '_data.values.meta', {
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
</script>

<style scoped>

</style>