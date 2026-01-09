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
                        <div>
                            <InputLabel :size="'sm'" value="Employee Status" />
                            <MultiSelect :key="employmentStatusOptionsKey" :disabled="disableActions" glint drop-shadow :selection-max-viewable-line="5" :size="'md'" :options="employmentStatusOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Employment Type"/>
                            <MultiSelect :key="employmentTypeOptionsKey" :disabled="disableActions" glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="employmentTypeOptions" :icon="'tdesign:component-checkbox'"/>
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
                    </div>

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <RadioGroup
                            class="scaffold-border px-2"
                            :disabled="disableActions"
                            :selections="viewMode.selection"
                            :size="'md'"
                            :orientation="'horizontal'"
                            v-model="viewMode.selected" />
                    </div>

                    <div>
                        <PageInformation :pagination="employees.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="employees.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </form>

                <!-- Employment Profiles -->
                <DialogModal
                    :max-width="'960px'"
                    :show="employmentProfilesModal"
                    :closeable="false">
                    <template #title>
                        {{employmentProfilesModalTitle}}
                    </template>
                    <template #content>
                        <div ref='employmentProfilesContentContainer' :class="[employmentProfilesLoadingOverlay ? '' : 'pt-4 space-y-4 ']" class="min-h-[100px]">
                            <div v-if="employmentProfilesLoadingOverlay" :style="employmentProfilesLoadingOverlayDimensionStyle" class="absolute tint-background  z-50">
                                <div class="h-full flex items-center justify-center">
                                    <UnorderedList :size="'lg'" :icon="'eos-icons:loading'">Loading Employment Profiles...</UnorderedList>
                                </div>
                            </div>
                            <div v-else>
                                Changes are autosaved.
                            </div>

                            <EmploymentProfiles
                                v-show="!(employmentProfilesLoadingOverlay)"
                                isolated
                                ref="employeeEmploymentProfile"
                                v-model:creating-or-editing="employmentProfileCreatingOrEditing"
                                v-model:employment-profiles-pending="employmentProfilesPending"
                                v-model:employment-profiles-data="employmentProfileData"
                                v-model:child-component-employee-payload="stagedEmployee"
                                v-model:disable-actions="disableActions"
                                @resolved="employmentProfileModalResolved"
                            />
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div></div>
                            <div class="space-x-2 inline-flex items-center">
                                <Button :variant="'outline'" @click="closeEmploymentProfilesModal" :label="'Close'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <!-- Payroll Components -->
                <DialogModal
                    :max-width="'1280px'"
                    :show="payrollComponentsModal"
                    :closeable="false">
                    <template #title>
                        {{payrollComponentsModalTitle}}
                    </template>
                    <template #content>
                        <div ref='payrollComponentsContentContainer' :class="[payrollComponentsLoadingOverlay ? '' : 'pt-4 space-y-4 ']" class="min-h-[100px]">
                            <div v-if="payrollComponentsLoadingOverlay" :style="payrollComponentsLoadingOverlayDimensionStyle" class="absolute tint-background  z-50">
                                <div class="h-full flex items-center justify-center">
                                    <UnorderedList :size="'lg'" :icon="'eos-icons:loading'">Loading Payroll Components...</UnorderedList>
                                </div>
                            </div>
                            <div v-else>
                                Changes are autosaved.
                            </div>

                            <EmployeePayrollComponent
                                v-show="!(payrollComponentsLoadingOverlay)"
                                isolated
                                ref="employeePayrollComponent"
                                v-model:creating-or-editing="employeePayrollComponentCreatingOrEditing"
                                v-model:payroll-components-pending="employeePayrollComponentsPending"
                                v-model:child-component-employee-payload="stagedEmployee"
                                v-model:employee-compensation-data="employeeCompensationData"
                                v-model:employee-deduction-data="employeeDeductionData"
                                v-model:employee-income-tax-data="employeeIncomeTaxData"
                                v-model:disable-actions="disableActions"
                            />
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div></div>
                            <div class="space-x-2 inline-flex items-center">
                                <Button :variant="'outline'" @click="closePayrollComponentsModal" :label="'Close'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="px-[20px]">

                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <NuxtLink
                            v-else
                            :to="`/hr-payroll/workforce/employees/create-employee`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                        </NuxtLink>
                    </div>

                    <div v-if="!employees.successful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="employees.message" />
                    </div>

                    <div v-if="employees.successful && viewMode.selected == DATA_VIEW_MODE.FLEX" class="flex flex-row flex-wrap gap-4">

                        <div v-for="employee in employees.data" :key="employee.id" class="flex-grow scaffold-border p-4 space-y-2">
                            <div>
                                <div class="mb-2 flex justify-between min-h-8">
                                    <div>
                                        <div class="text-xs">Family name,(Middle), Given</div>
                                        <NuxtLink
                                            :to="`/hr-payroll/workforce/employees/${employee.ulid}`">
                                            <span class="text-lg font-header cursor-pointer hover:underline">{{employee.full_name}}</span>
                                        </NuxtLink>
                                    </div>

                                    <NuxtLink
                                        v-if="false"
                                        :to="`/hr-payroll/workforce/employees/${employee.ulid}`">
                                        <Button type="button" :variant="'outline'" :icon="'mdi:checkbook'" :size="'sm'"  :label="'info'"></Button>
                                    </NuxtLink>
                                </div>

                                <table class="border-separate font-sans">
                                    <tbody>
                                        <tr><td class="">Number:</td><td class="pl-2 font-semibold">{{ _get(employee, 'number', null) }}</td></tr>
                                        <tr>
                                            <td class="flex justify-start">Contact:</td>
                                            <td class="pl-2">
                                                <span v-if="_isEmpty(_compact([employee.contact?.office_email, employee.contact?.personal_email, employee.contact?.office_phone, employee.contact?.personal_phone]))">None</span>
                                                <div v-else class="text-sm" :class="index == 0 ? 'inline-block' : 'block'" v-for="(contact, index) in _compact([employee.contact?.office_email, employee.contact?.personal_email, employee.contact?.office_phone, employee.contact?.personal_phone])">{{contact}}</div>
                                            </td>
                                        </tr>
                                        <tr><td class="">Department:</td><td class="pl-2">{{ _get(employee, 'department.name', null) }}</td></tr>
                                        <tr><td class="">Designation:</td><td class="pl-2">{{ _get(employee, 'designation.name', null) }}</td></tr>
                                        <tr>
                                            <td class="">Manager:</td>
                                            <td class="pl-2">
                                                <NuxtLink
                                                    :to="`/hr-payroll/workforce/employees/${_get(employee, 'manager.ulid', null)}`">
                                                    <span class="cursor-pointer hover:underline">{{ _get(employee, 'manager.full_name', null) }}</span>
                                                </NuxtLink>
                                            </td>
                                        </tr>
                                        <tr><td class="">Gender:</td><td class="pl-2">{{ _get(employee, 'gender.text', null) }}</td></tr>
                                        <tr><td class="">Marital Status:</td><td class="pl-2">{{ _get(employee, 'marital_status.text', null) }}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div v-if="noEmployeeRecords">
                            No Record Found.
                        </div>
                    </div>

                    <DataTable
                        v-if="employees.successful && viewMode.selected == DATA_VIEW_MODE.LIST"
                        :sup-headers="employeesSupHeaders"
                        :headers="employeesHeaders"
                        :size="'lg'"
                        :rows="employees.data"
                        :disabled="disableDataTable"
                        v-model="selectedEmployees"
                        selection>
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
                                        {type: 'link', icon: 'ix:open-external', title: 'Details',to: `/hr-payroll/workforce/employees/${cell.ulid}`},
                                        {type: 'action', title: 'Employment Profiles',callback: () => {showEmploymentProfilesModal(cell);}},
                                        {type: 'action', title: 'Payroll Components',callback: () => {showPayrollComponentsModal(cell);}},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.current_employment_profile="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.current_employment_profile.status.text" />
                            </div>
                        </template>
                        <template v-slot:cell.current_employment_type="{cell,slot}">
                            <div class="px-[3px]">{{cell.current_employment_profile?.employment_type?.text}}</div>
                        </template>
                        <template v-slot:cell.gender="{cell,slot}">
                            <div class="p-[3px]">{{cell.gender.text}}</div>
                        </template>
                        <template v-slot:cell.marital_status="{cell,slot}">
                            <div class="p-[3px]">{{cell.marital_status.text}}</div>
                        </template>
                        <template v-slot:cell.department="{cell,slot}">
                            <div class="p-[3px]">{{cell.department?.name}}</div>
                        </template>
                        <template v-slot:cell.designation="{cell,slot}">
                            <div class="p-[3px]">{{cell.designation?.name}}</div>
                        </template>
                        <template v-slot:cell.manager="{cell,slot}">
                            <div class="p-[3px]">{{cell.manager?.full_name}}</div>
                        </template>
                        <template v-slot:cell.office_email="{cell,slot}">
                            <div class="p-[3px]">
                                {{cell.contact?.office_email}}
                            </div>
                        </template>
                        <template v-slot:cell.personal_email="{cell,slot}">
                            <div class="p-[3px]">
                                {{cell.contact?.personal_email}}
                            </div>
                        </template>
                        <template v-slot:cell.office_phone="{cell,slot}">
                            <div class="p-[3px]">
                                {{cell.contact?.office_phone}}
                            </div>
                        </template>
                        <template v-slot:cell.personal_phone="{cell,slot}">
                            <div class="p-[3px]">
                                {{cell.contact?.personal_phone}}
                            </div>
                        </template>
                        <template v-slot:cell.user_name="{cell,slot}">
                            <div class="p-[3px]">
                                {{cell.user?.username}}
                            </div>
                        </template>
                        <template v-slot:cell.user_email="{cell,slot}">
                            <div class="p-[3px]">
                                {{cell.user?.email}}
                            </div>
                        </template>
                        <template v-slot:cell.user_status="{cell,slot}">
                            <div class="p-[3px]">{{cell.user?.status?.text}}</div>
                        </template>
                        <template v-slot:cell.email_verified_at="{cell,slot}">
                            <div class="p-[3px]">{{cell.user.email_verified_at != null ? `Verified` : ``}}</div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {TableSupHeaderT, TableHeaderT, TableRowT, DataTableT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import type {LabelTypeT} from "@/public/js/types/theme";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Employees`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
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

    if(_isEmpty(selection) || selection.indexOf('employment_status') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employmentStatusOptions, employmentStatusOptionsKey, SELECT.MULTI_STATIC, employmentStatusOptions.selection
        );
    }

    if(_isEmpty(selection) || selection.indexOf('employment_type') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employmentTypeOptions, employmentTypeOptionsKey, SELECT.MULTI_STATIC, employmentTypeOptions.selection
        );
    }

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
}

const employmentStatusOptionsKey = shallowRef(0);
const employmentStatusOptions = reactive({
    search: '',
    selection: [
        {text : 'Active', value: USER_STATUS.ACTIVE} as EnumOption,
        {text : 'Inactive', value: USER_STATUS.INACTIVE} as EnumOption,
    ],
    selected: []
});
const employmentTypeOptionsKey = shallowRef(0);
const employmentTypeOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: number[]
}>({
    search: '',
    selection: [
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.OJT as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.INTERN as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.PROBATIONARY as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.FULL_TIME as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.PART_TIME as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.CONTRACT as number),
        $enumerableOption(EMPLOYMENT_TYPE_NAME, EMPLOYMENT_TYPE.NOT_SPECIFIED as number),
    ],
    selected: []
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

const employeesSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},
    {text: 'Employee', colspan: 2, alignHeader: 'left'},
    {text: 'Employment', colspan: 2, alignHeader: 'left'},
    {text: '', colspan: 3},
    {text: 'Contact', colspan: 4, alignHeader: 'left'},
    {text: 'User', colspan: 4, alignHeader: 'left'},
]);

const employeesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions'},
    { text: 'Employee #', value: 'number', alignData: 'left'},
    { text: 'Name', value: 'full_name'},
    { text: 'Status', value: 'current_employment_profile'},
    { text: 'Type', value: 'current_employment_type'},
    { text: 'Department', value: 'department'},
    { text: 'Designation', value: 'designation'},
    { text: 'Manager', value: 'manager'},
    { text: 'Email 1', value: 'office_email'},
    { text: 'Email 2', value: 'personal_email'},
    { text: 'Phone 1', value: 'office_phone'},
    { text: 'Phone 2', value: 'personal_phone'},
    { text: 'Username', value: 'user_name'},
    { text: 'Email', value: 'user_email'},
    { text: 'Status', value: 'user_status'},
    { text: 'Email Verified', value: 'user_email_verified_at'},
]);

const employees = reactive<DataTableT>({
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
const noEmployeeRecords = computed(() => {
    return employees.meta.pagination.total === 0;
})
const viewMode = reactive<{
    selection: EnumSelection;
    selected: number | null;
}>({
    selection: [
        {text : 'Flex', value: DATA_VIEW_MODE.FLEX} as EnumOption,
        {text : 'List', value: DATA_VIEW_MODE.LIST} as EnumOption,
    ],
    selected: DATA_VIEW_MODE.LIST as number
});
watch(() => viewMode.selected,async viewModeType => {
    await nextTick();
    selectedEmployees.value = [];
    paginate(1, true);
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
            employment_status: employmentStatusOptions.selected,
            employment_type: employmentTypeOptions.selected,
            assigned_employee_group_ids: employeeGroupOptions.selected,
            department_ids: departmentOptions.selected,
            designation_ids: designationOptions.selected,
        }
    };
});
const employeesPending = ref(false)
const selectedEmployees = ref([]);

const disableActions = computed(() => {
    return employeesPending.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return employeesPending.value || companyAssociationPendingState().value;
});
const employeesExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    employeesPending.value = true;

    await laraFetch(`/api/employees`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            employeesPending.value = false;
        },
        onResponse: (request, options, response) => {
            employeesPending.value = false;
            employees.successful = _get(response, '_data.successful', false);
            employees.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            employees.data = _get(response, '_data.values.data', []).map((employee: TableRowT) => {

                let shade = _get(employee, 'current_employment_profile.is_active', false)
                    ? 'success'
                    : 'default';

                return {
                    ...employee,
                    _payload: {
                        'label_shade': {
                            'cell': ['current_employment_profile', 'current_employment_type'],
                            'value': shade
                        }
                    }
                };
            });
            employees.meta = _get(response, '_data.values.meta', {
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
await employeesExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedEmployees.value = [];
    }

    if(filters.page === page){
        employeesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

/**
 * Staged employee for isolated components usage
 *
 **/
const stagedEmployee = ref<{
    'id': string | number | null,
    'ulid': string | null,
}>({
    'id': null,
    'ulid': null,
});

/**
 * Isolated component
 *
 * Employee Payroll Components Modal
 **/
const payrollComponentsLoadingOverlay = computed(()=>{
    return employeePayrollComponentsPending.value;
});
const {
    width: payrollComponentsContentContainerWidth,
    height: payrollComponentsContentContainerHeight
} = useElementSize(useTemplateRef('payrollComponentsContentContainer'));
const payrollComponentsLoadingOverlayDimensionStyle = computed(() => {
    return {
        width: `${payrollComponentsContentContainerWidth.value}px`,
        height: `${payrollComponentsContentContainerHeight.value}px`
    };
});
const employeePayrollComponentsPending = ref(false);
const employeePayrollComponentCreatingOrEditing = ref(false);
const employeeCompensationData = ref([]);
const employeeDeductionData = ref([]);
const employeeIncomeTaxData = ref([]);

const payrollComponentsModal = ref(false);
const payrollComponentsModalTitle = ref('');
const closePayrollComponentsModal = () => {
    payrollComponentsModal.value = false;
    payrollComponentsModalTitle.value = '';

    stagedEmployee.value = {
        'id': null,
        'ulid': null,
    };
    employeePayrollComponentsPending.value = false;
};
const showPayrollComponentsModal = async(cell: TableRowT)=> {

    await laraFetch(`/api/employee-payroll-components-gate`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value
        }
    }, {
        onSuccessResponse: async (request, options, response) => {

            employeePayrollComponentsPending.value = true;

            stagedEmployee.value = {
                'id': _get(cell, 'id', null),
                'ulid': _get(cell, 'ulid', null),
            };

            payrollComponentsModalTitle.value = `${cell.number} ${cell.full_name}`;
            payrollComponentsModal.value = true;
        }
    }, true);
};

/**
 * Isolated component
 *
 * Employee Employment Profile
 **/
const employmentProfilesLoadingOverlay = computed(()=>{
    return employmentProfilesPending.value;
});
const {
    width: employmentProfilesContentContainerWidth,
    height: employmentProfilesContentContainerHeight
} = useElementSize(useTemplateRef('employmentProfilesContentContainer'));
const employmentProfilesLoadingOverlayDimensionStyle = computed(() => {
    return {
        width: `${employmentProfilesContentContainerWidth.value}px`,
        height: `${employmentProfilesContentContainerHeight.value}px`
    };
});
const employmentProfilesPending = ref(false);
const employmentProfileCreatingOrEditing = ref(false);
const employmentProfileData = ref([]);

const employmentProfileModalResolved = (data) => {
    employeesExecute();
}

const employmentProfilesModal = ref(false);
const employmentProfilesModalTitle = ref('');
const closeEmploymentProfilesModal = () => {
    employmentProfilesModal.value = false;
    employmentProfilesModalTitle.value = '';

    stagedEmployee.value = {
        'id': null,
        'ulid': null,
    };
    employmentProfilesPending.value = false;
};
const showEmploymentProfilesModal = async (cell: TableRowT)=> {

    await laraFetch(`/api/employment-profiles-gate`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value
        }
    }, {
        onSuccessResponse: async (request, options, response) => {

            employmentProfilesPending.value = true;

            stagedEmployee.value = {
                'id': _get(cell, 'id', null),
                'ulid': _get(cell, 'ulid', null),
            };

            employmentProfilesModalTitle.value = `${cell.number} ${cell.full_name}`;
            employmentProfilesModal.value = true;
        }
    }, true);
};
</script>


<style scoped>

</style>