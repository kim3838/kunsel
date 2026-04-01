<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-lg">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search Employee" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Employee Group" />
                            <MultiSelect :key="employeeGroupOptionsKey" glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="employeeGroupOptions" :disabled="disableActions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Department" />
                            <MultiSelect :key="departmentOptionsKey" glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="departmentOptions" :disabled="disableActions" :icon="'ic:baseline-all-inbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Designation" />
                            <MultiSelect :key="designationOptionsKey" glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="designationOptions" :disabled="disableActions" :icon="'ic:baseline-inbox'"/>
                        </div>

                        <div class="flex flex-col">
                            <div class="flex-none h-[1.25rem]"></div>
                            <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        </div>
                    </div>
                </form>

                <DialogModal
                    :show="creatingOrEditing"
                    :max-width="'780px'"
                    :closeable="false">
                    <template #title>
                        {{creatingExternalTaxHistory ? 'Create external tax consolidation' : 'Edit external tax consolidation'}}
                    </template>
                    <template #content>
                        <div ref='modalContentContainer' class="space-y-4">

                            <div class="text-base">
                                Employee's external tax summary
                            </div>

                            <div>
                                <div class="flex items-center flex-wrap text-sm">
                                    <Icon class="h-6 w-6" :name="'mdi:info-variant'"/>
                                    Total taxable and taxable from bonus must be separate.
                                </div>
                                <div class="flex items-center flex-wrap text-sm">
                                    <Icon class="h-6 w-6" :name="'mdi:info-variant'"/>
                                    If the previous employer issued a full tax refund, Total tax withheld should remain 0.
                                </div>
                                <div class="flex items-center flex-wrap text-sm">
                                    <Icon class="h-6 w-6" :name="'mdi:info-variant'"/>
                                    Total nontaxable bonus should be (the total of all bonus including 13th month pay) from previous employers.
                                </div>
                            </div>

                            <div class="lining-shadow rounded-sm tint-background">

                                <div class="p-4 space-y-2">
                                    <div class="grid gap-2 grid-cols-4">
                                        <div class="col-span-2">
                                            <InputLabel :size="'sm'" value="Employee (Number, Full Name)"/>
                                            <SingleSelectPaginated
                                                ref="employeeSingleSelectPaginated"
                                                :key="employeeOptionsKey"
                                                :disabled="modalDisableActions"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select Employee'"
                                                :size="'md'"
                                                :icon="'mdi:badge-account-outline'"
                                                :payload="employeeOptions"/>
                                        </div>
                                        <div class="col-span-2">
                                            <InputLabel :size="'sm'" value="Year"/>
                                            <Input
                                                :disabled="modalDisableActions"
                                                :size="'md'"
                                                v-model="year"
                                                high-light-all-text-on-focus type-strict
                                                :type="'number'"/>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Total taxable"/>
                                            <Input
                                                :disabled="modalDisableActions"
                                                :size="'md'"
                                                v-model="totalTaxable"
                                                high-light-all-text-on-focus type-strict
                                                :type="'number'"/>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Total nontaxable bonus"/>
                                            <Input
                                                :disabled="modalDisableActions"
                                                :size="'md'"
                                                v-model="totalNontaxableBonus"
                                                high-light-all-text-on-focus type-strict
                                                :type="'number'"/>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Total taxable from bonus"/>
                                            <Input
                                                :disabled="modalDisableActions"
                                                :size="'md'"
                                                v-model="totalTaxableFromBonus"
                                                high-light-all-text-on-focus type-strict
                                                :type="'number'"/>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Total tax withheld"/>
                                            <Input
                                                :disabled="modalDisableActions"
                                                :size="'md'"
                                                v-model="totalTaxWithheld"
                                                high-light-all-text-on-focus type-strict
                                                :type="'number'"/>
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Remarks"/>
                                            <Input
                                                :disabled="modalDisableActions"
                                                :size="'md'"
                                                v-model="remarks"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="mx-auto max-w-screen-xl">
                            <div class="flex space-x-2 justify-between">
                                <div class="space-x-2 inline-flex">
                                    <div class="space-x-2 inline-flex items-center">
                                        <UnorderedList
                                            v-if="modalDisableActions"
                                            :icon="'eos-icons:loading'"
                                            :size="'md'"
                                            :label="'Please wait...'"/>
                                    </div>
                                </div>
                                <div class="space-x-2 inline-flex items-center">
                                    <Button
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'md'"
                                        :disabled="modalDisableActions"
                                        :label="'Cancel'"
                                        @click="closeModal"/>
                                    <Button
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="modalSubmitButtonIcon"
                                        :disabled="modalDisableActions"
                                        :label="modalSaveButtonLabel"
                                        @click="modalSubmit"/>
                                </div>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="px-[20px] space-y-2">

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                        <Button v-if="externalTaxHistories.successful" @click="put(null)" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:plus'"></Button>
                        <div v-if="externalTaxHistories.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedExternalTaxHistories.length}}</span> Selected</span>
                        </div>
                        <Button
                            v-if="externalTaxHistories.successful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'ph:backspace'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedExternalTaxHistories = []" />
                        <Button v-if="externalTaxHistories.successful" :variant="'outline'" :size="'sm'" :icon="'ph:trash-simple'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected()" />
                        <Label v-if="!externalTaxHistories.successful" invert :size="'md'" :type="'danger'" :label="externalTaxHistories.message" />
                    </div>

                    <DataTable
                        v-if="externalTaxHistories.successful"
                        :sup-headers="externalTaxHistoriesSupHeaders"
                        :headers="externalTaxHistoriesHeaders"
                        :size="'lg'"
                        :rows="externalTaxHistories.data"
                        :disabled="disableDataTable"
                        v-model="selectedExternalTaxHistories"
                        selection>
                        <template v-slot:cell.actions="{cell,slot: cellSlot}">
                            <div class="text-base h-[32px] px-2 gap-0.5 flex items-center justify-center cursor-pointer accent-hover" @click="put(cell)">
                                <span class="font-narrow-thin">Edit</span>
                                <Icon class="h-5 w-5" :name="'gg:external'"/>
                            </div>
                        </template>
                        <template v-slot:cell.employee_number="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee.number}}</div>
                        </template>
                        <template v-slot:cell.employee_full_name="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee.full_name}}</div>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="externalTaxHistories.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="externalTaxHistories.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {DateTimePickerOptionsT} from "@/public/js/datetimepicker/type";
import type {SingleSelectPaginatedInstance} from "@/public/js/types/component-instance";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `External Tax Histories`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
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

    if(_isEmpty(selection) || selection.indexOf('employee_group') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employeeGroupOptions, employeeGroupOptionsKey, SELECT.MULTI_STATIC, companyOrganizationSelections.value.employee_groups
        );
    }

    if(_isEmpty(selection) || selection.indexOf('department') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            departmentOptions, departmentOptionsKey, SELECT.MULTI_STATIC, companyOrganizationSelections.value.departments
        );
    }

    if(_isEmpty(selection) || selection.indexOf('designation') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            designationOptions, designationOptionsKey, SELECT.MULTI_STATIC, companyOrganizationSelections.value.designations
        );
    }

    if(_isEmpty(selection) || selection.indexOf('employee') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employeeOptions, employeeOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }
}

const externalTaxHistoriesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: 'Employee', colspan: 2,  alignHeader: 'left'},
    
    {text: 'Total External Tax History', colspan: 5,  alignHeader: 'left'},
    
    {text: '', colspan: 1,  alignHeader: 'left'},
]);

const externalTaxHistoriesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', minWidth: '33px'},
    { text: '#', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left', minWidth: '140px'},

    { text: 'Year', value: 'year', alignData: 'left', isNumeric: true},
    { text: 'Taxable', value: 'total_taxable', alignData: 'right', isNumeric: true},
    { text: 'Nontaxable Bonus', value: 'total_nontaxable_bonus', alignData: 'right', isNumeric: true},
    { text: 'Taxable from Bonus', value: 'total_taxable_from_bonus', alignData: 'right', isNumeric: true},
    { text: 'Tax Withheld', value: 'total_tax_withheld', alignData: 'right', isNumeric: true},

    { text: 'Remarks', value: 'remarks', alignData: 'left', minWidth: '80px'},
]);

const externalTaxHistories = reactive<DataTableT>({
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

//Employee Organization
const companyOrganizationSelections = companyOrganizationSelectionsState();
const employeeGroupOptionsKey = shallowRef(0);
const employeeGroupOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.employee_groups,
    selected: []
});
const departmentOptionsKey = shallowRef(0);
const departmentOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.departments,
    selected: []
});
const designationOptionsKey = shallowRef(0);
const designationOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.designations,
    selected: []
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
            assigned_employee_group_ids: employeeGroupOptions.selected,
            department_ids: departmentOptions.selected,
            designation_ids: designationOptions.selected,
        }
    };
});

const externalTaxHistoriesPending = ref(false)
const selectedExternalTaxHistories = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return externalTaxHistoriesPending.value || createEditPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return externalTaxHistoriesPending.value || companyAssociationPendingState().value;
});
const externalTaxHistoriesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    externalTaxHistoriesPending.value = true;

    await laraFetch(`/api/external-tax-histories`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            externalTaxHistoriesPending.value = false;
        },
        onResponse: (request, options, response) => {
            externalTaxHistoriesPending.value = false;
            externalTaxHistories.successful = _get(response, '_data.successful', false);
            externalTaxHistories.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            externalTaxHistories.data = _get(response, '_data.values.data', [])
            externalTaxHistories.meta = _get(response, '_data.values.meta', {
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
externalTaxHistoriesExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedExternalTaxHistories.value = [];
    }

    if(filters.page === page){
        externalTaxHistoriesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const confirmDeleteSelected = () => {

    const selectedIds = selectedExternalTaxHistories.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected tax history to delete.`,
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
        message: `Confirm delete selected tax histor${selectedIds.length > 1 ? 'ies' : 'y'}?`,
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

    selectedIds = selectedExternalTaxHistories.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/external-tax-histories", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            external_tax_history_ids: selectedIds,
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
                message: `Tax histor${selectedIds.length > 1 ? 'ies' : 'y'} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedExternalTaxHistories.value = [];
    await externalTaxHistoriesExecute();
}

const stagedExternalTaxHistory = ref<{
    'id': string | number | null,
    'ulid': string | null,
}>({
    'id': null,
    'ulid': null,
});

const creatingOrEditing = ref(false);
const createEditPending = ref(false);
const editPayload = ref({});

const put = async (row: TableRowT | null = null) => {

    creatingOrEditing.value = true;

    if(row){
        editPayload.value = row;

        stagedExternalTaxHistory.value = {
            'id': _get(editPayload.value, 'id', null),
            'ulid': _get(editPayload.value, 'ulid', null),
        };
        
        employeeOptions.selected = _get(editPayload.value, 'employee_id', null);
        employeeOptionsKey.value++;

        year.value = _get(editPayload.value, 'year', '');
        totalTaxable.value = _get(editPayload.value, 'total_taxable', 0);
        totalNontaxableBonus.value = _get(editPayload.value, 'total_nontaxable_bonus', 0);
        totalTaxableFromBonus.value = _get(editPayload.value, 'total_taxable_from_bonus', 0);
        totalTaxWithheld.value = _get(editPayload.value, 'total_tax_withheld', 0);

        remarks.value = _get(editPayload.value, 'remarks', '');

    } else {

        year.value = nuxtApp.$moment().format("YYYY");
        totalTaxable.value = 0;
        totalNontaxableBonus.value = 0;
        totalTaxableFromBonus.value = 0;
        totalTaxWithheld.value = 0;

        remarks.value = '';
    }
}

const creatingExternalTaxHistory = computed(() => {
    return stagedExternalTaxHistory.value.id == null;
});

const year = ref(nuxtApp.$moment().format("YYYY"));
const totalTaxable = ref(0);
const totalNontaxableBonus = ref(0);
const totalTaxableFromBonus = ref(0);
const totalTaxWithheld = ref(0);
const remarks = ref('');

const resetEditable = () => {
    stagedExternalTaxHistory.value = {
        'id': null,
        'ulid': null,
    };
    editPayload.value = {};
    employeeOptions.selected = null;
    employeeOptionsKey.value++;

    year.value = nuxtApp.$moment().format("YYYY");
    totalTaxable.value = 0;
    totalNontaxableBonus.value = 0;
    totalTaxableFromBonus.value = 0;
    totalTaxWithheld.value = 0;

    remarks.value = '';
}

const employeeSingleSelectPaginatedReference = useTemplateRef<SingleSelectPaginatedInstance>('employeeSingleSelectPaginated');
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
    selected: null,
});

const closeModal = () => {
    creatingOrEditing.value = false;
    resetEditable();
};

const modalDisableActions = computed(()=>{
    return  modalLoading.value
        || modalSubmitPending.value
        || employeeSingleSelectPaginatedReference.value?.pending;
});
const modalLoading = ref(false);
const modalSubmitPending = ref(false);

const modalSubmitButtonIcon = computed(()=>{
    const ICON = {
        CREATE: 'mdi:plus',
        EDIT: 'ic:sharp-save'
    } as const;

    const isEditMode = !creatingExternalTaxHistory.value;

    return isEditMode ? ICON.EDIT : ICON.CREATE;
});
const modalSaveButtonLabel = computed(()=>{
    const LABEL = {
        CREATE: `Create`,
        EDIT: `Save`
    } as const;

    const isEditMode = !creatingExternalTaxHistory.value;

    return isEditMode ? LABEL.EDIT : LABEL.CREATE;
});

const modalSubmitPath = computed(() => {
    if(!creatingExternalTaxHistory.value){
        return `/api/external-tax-history/${stagedExternalTaxHistory.value.ulid}`;
    } else {
        return `/api/external-tax-history`
    }
});
const modalSubmitAction = computed(() => {
    if(!creatingExternalTaxHistory.value){
        return `PATCH`;
    } else {
        return `POST`;
    }
});
const modalForm = computed(()=>{
    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        employee_id: employeeOptions.selected,
        year: year.value,
        total_taxable: totalTaxable.value,
        total_nontaxable_bonus: totalNontaxableBonus.value,
        total_taxable_from_bonus: totalTaxableFromBonus.value,
        total_tax_withheld: totalTaxWithheld.value,
        remarks: remarks.value,
    }
})
const modalSubmit = async() => {
    modalSubmitPending.value = true;

    await laraFetch(modalSubmitPath.value, {
        method: modalSubmitAction.value,
        body: modalForm.value,
    }, {
        onRequestError: () => {
            modalSubmitPending.value = false;
        },
        onResponse: () => {
            modalSubmitPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `Tax history ${creatingExternalTaxHistory.value ? 'created' : 'updated'}.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            closeModal();
            await externalTaxHistoriesExecute();
        },
    });
}
</script>

<style scoped>

</style>