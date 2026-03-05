<template>
    <div class="space-y-6">
        <div class="space-y-6">
            <div class="font-medium text-xl font-header">{{payroll.number}}</div>

            <PayrollSubInfo :type="PAYROLL_SUB_INFO_TYPE.ADMIN_OVERVIEW" :payroll="payroll"/>
        </div>

        <div v-if="salaryStatementsPending || !salaryStatements.successful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
            <UnorderedList v-if="salaryStatementsPending" :icon="'eos-icons:loading'" :size="'md'" :label="'Loading payroll statements...'"/>
            <Label v-else-if="!salaryStatements.successful" invert :size="'md'" :type="'danger'" :label="salaryStatements.message" />
        </div>
        <div v-else class="space-y-2">
            <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
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

            <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                <div class="scaffold-border px-2 font-[National_Park]">
                    <span><span class="font-semibold">{{selectedSalaryStatements.length}}</span> Selected</span>
                </div>
                <Button
                    :variant="'outline'"
                    :size="'sm'"
                    :icon="'tdesign:close'"
                    :disabled="disableActions"
                    :label="'Clear selection'"
                    @click="selectedSalaryStatements = []" />
                <Button
                    :variant="'outline'"
                    :size="'sm'"
                    :icon="'mdi:delete-outline'"
                    :disabled="disableActions"
                    :label="'Bulk delete'"
                    @click="confirmDeleteSelected()"/>
            </div>

            <DataTable
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
                <template v-slot:cell.employee_full_name="{cell,slot}">
                    <div class="px-[3px]" :title="cell.employee_full_name">{{wordClamp(cell.employee_full_name, 16)}}</div>
                </template>
                <template v-slot:cell.type="{cell,slot}">
                    <div class="p-[3px]">{{cell.type?.text}}</div>
                </template>
                <template v-slot:cell.is_paid="{cell,slot}">
                    <div class="p-[3px]">{{cell.is_paid ? 'Yes' : 'No'}}</div>
                </template>
                <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                    <div class="inline-flex items-center scaffold-border pr-2">
                        <Icon name="ic:outline-keyboard-arrow-right" :class="[slot.iconSizeClass, slot.iconHolderClass]" /><div :class="[slot.titleSizeClass]">Statement dates</div>
                    </div>
                    <div :style="{'max-height': `351px`, 'overflow-y': 'scroll'}">
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
</template>

<script setup lang="ts">

import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {PayrollT} from "@/public/js/types/payroll";
import {storeToRefs} from "pinia";

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const wordClamp = nuxtApp.$wordClamp as (text: string, length: number) => string;
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

const props = defineProps({
    payroll: {
        type: Object as PropType<PayrollT>,
        default: () => [],
    },
});

const showDaysTotalColumns = ref(false);

const {headerSupFields, headerFields, daysTotalHeaderSupFields, daysTotalHeaderFields} = useSalaryStatement();

const salaryStatementsSupHeaders = computed<TableSupHeaderT[]>(() => {
    return [
        {text: ''},
        {text: ''},
        {text: 'Employee', colspan: 2, alignHeader: 'left'},
        {text: 'Statement', colspan: 2, alignHeader: 'left'},

        ...(showDaysTotalColumns.value ? daysTotalHeaderSupFields.value : []),

        ...headerSupFields.value,
    ] as TableSupHeaderT[];
});

const salaryStatementsHeaders = computed<TableHeaderT[]>(() => {
    return [
        { text: '#', value: 'row_number'},
        { text: '', value: 'actions'},

        { text: '#', value: 'employee_number', alignData: 'left'},
        { text: 'Name', value: 'employee_full_name', alignData: 'left'},
        { text: 'Type', value: 'type', alignData: 'left'},
        { text: 'Is Paid', value: 'is_paid', alignData: 'left'},

        ...(showDaysTotalColumns.value ? daysTotalHeaderFields.value : []),

        ...headerFields.value,
    ] as TableHeaderT[];
});

const salaryStatementsKey = shallowRef(0);
const salaryStatementsPending = ref(false)
const deleting = ref(false);

const selectedSalaryStatements = ref([]);
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

const showSalaryStatementDetails = ref(false);
const salaryStatementSubRowSlug = ref('');
const salaryStatementSubRowExtensionSlug = ref('');

const disableActions = computed(() => {
    return salaryStatementsPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return salaryStatementsPending.value || companyAssociationPendingState().value;
});

watch(() => {return showSalaryStatementDetails.value;}, (show) => {
    if(show){
        salaryStatementSubRowSlug.value = 'statement_attendances';
        salaryStatementSubRowExtensionSlug.value = 'statement_details';
        paginatePayrollSalaryStatements()
    } else {
        salaryStatementSubRowSlug.value = '';
        salaryStatementSubRowExtensionSlug.value = '';
        paginatePayrollSalaryStatements()
    }
})

let paramsComputed = computed(() => {

    let payrollId = _get(props.payroll, 'id', null)
    let payrollCompanyId = _get(props.payroll, 'company_id', null)

    return {
        page: filters.page,
        perPage: filters.perPage,
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            company_ids: [payrollCompanyId],
            payroll_ids: [payrollId]
        }
    };
});
const paginatePayrollSalaryStatements = async() =>{

    let payrollId = _get(props.payroll, 'id', null)
    let payrollCompanyId = _get(props.payroll, 'company_id', null)

    if(!payrollId || !payrollCompanyId){
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

paginatePayrollSalaryStatements();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedSalaryStatements.value = [];
    }

    if(filters.page === page){
        paginatePayrollSalaryStatements();
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
    await paginatePayrollSalaryStatements();
}
</script>

<style scoped>

</style>