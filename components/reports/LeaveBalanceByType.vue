<template>
    <div class="space-y-2 px-[20px]">
        <form @submit.prevent="paginate(1, true)" class="space-y-2 pb-[20px]">
            <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ">
                <div>
                    <InputLabel :size="'sm'" value="Search" />
                    <Input :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" :disabled="disableActions" type="text"/>
                </div>
                <div>
                    <InputLabel :size="'sm'" value="Employee Status" />
                    <MultiSelect :key="employmentStatusOptionsKey" glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="employmentStatusOptions" :disabled="disableActions" :icon="'tdesign:component-checkbox'"/>
                </div>
                <div>
                    <InputLabel :size="'sm'" value="Employee Group" />
                    <MultiSelect :key="employeeGroupOptionsKey" glint drop-shadow :selection-max-viewable-line="15" :size="'md'" :options="employeeGroupOptions" :disabled="disableActions" :icon="'tdesign:component-checkbox'"/>
                </div>
                <div class="col-span-2">
                    <InputLabel :size="'sm'" value="Leave Types" />
                    <MultiSelectPaginated
                        :key="leaveTypeSelectionsOptionsKey"
                        :icon="'tdesign:component-checkbox'"
                        :disabled="disableActions"
                        glint
                        drop-shadow
                        :size="'md'"
                        :label="'Filter Leave Type(s)'"
                        :payload="leaveTypeSelectionsOptions"
                    />
                </div>
            </div>

            <div class="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
                <div>
                    <InputLabel :size="'sm'" value="Balance Date"/>
                    <InputWithIcon
                        :disabled="disableActions"
                        high-light-all-text-on-focus
                        v-model="balanceDate"
                        :override="{font_family_class: 'font-sans'}"
                        :icon="'mdi:calendar-cursor-outline'"
                        :id="`balance_date`"
                        :size="'md'"/>
                </div>
            </div>

            <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
            </div>

            <div>
                <PageInformation :pagination="leaveBalanceByTypes.meta.pagination" :pending="disableDataTable"/>
                <div class="flex items-center gap-2">
                    <Pagination
                        :size="'lg'"
                        :pagination="leaveBalanceByTypes.meta.pagination"
                        :pending="disableDataTable"
                        v-model="pageComputed"/>
                    <UnorderedList
                        v-if="disableActions"
                        :icon="'eos-icons:loading'"
                        :size="'md'"
                        :label="'Please wait...'"/>
                </div>
            </div>
        </form>

        <DataTable
            :sup-headers="leaveBalanceByTypeSupHeaders"
            :headers="leaveBalanceByTypeHeaders"
            :size="'lg'"
            :rows="leaveBalanceByTypes.data"
            :disabled="disableDataTable">
            <template v-slot:cell.employee_number="{cell,slot}">
                <div class="p-[3px]">{{cell.employee.number}}</div>
            </template>
            <template v-slot:cell.employee_full_name="{cell,slot}">
                <div class="p-[3px]">{{cell.employee.full_name}}</div>
            </template>
            <template v-slot:cell.current_employment_profile="{cell,slot}">
                <div class="flex space-x-1 px-[0.3rem] items-center">
                    <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.current_employment_profile.status.text" />
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {DataTableMeta, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption} from "@/public/js/common/type";
import type {LabelTypeT} from "@/public/js/types/theme";
import {storeToRefs} from "pinia";

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {render} = dateTimePicker();
const clientReadyState = useClientReadyState();
const $moment = nuxtApp.$moment;
const common = useCommon();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        rebuildSelections();
        paginate(1, true);
    }
});

const rebuildSelections = (selection: string[] = []) => {

    if(_isEmpty(selection) || selection.indexOf('employment_status') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employmentStatusOptions, employmentStatusOptionsKey, SELECT.MULTI_STATIC, employmentStatusOptions.selection
        );
    }

    if(_isEmpty(selection) || selection.indexOf('employee_group') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            employeeGroupOptions, employeeGroupOptionsKey, SELECT.MULTI_STATIC, companyOrganizationSelections.value.employee_groups
        );
    }

    if(_isEmpty(selection) || selection.indexOf('leave_type') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            leaveTypeSelectionsOptions, leaveTypeSelectionsOptionsKey, SELECT.MULTI_PAGINATED
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

const leaveTypeSelectionsOptionsKey = shallowRef(0);
const leaveTypeSelectionsOptions = reactive({
    fetch: {
        url: '/api/leave-type-selections',
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

//Employee Organization
const companyOrganizationSelections = companyOrganizationSelectionsState();
const employeeGroupOptionsKey = shallowRef(0);
const employeeGroupOptions = reactive({
    search: '',
    selection: companyOrganizationSelections.value.employee_groups,
    selected: []
});

const leaveTypeHeaders = ref([]);
const leaveBalanceByTypeSupHeaders = computed<TableSupHeaderT[]>(()=>{

    return [
        {text: 'Employee', colspan: 2, alignHeader: 'left'},
        {text: 'Employment', colspan: 1, alignHeader: 'left'},
        {text: 'Running Balance', colspan: leaveTypeHeaders.value.length},
    ];
})

const leaveBalanceByTypeHeaders = computed<TableHeaderT[]>(() => {

    let headers:TableHeaderT[] = [
        { text: 'Employee #', value: 'employee_number', alignData: 'left'},
        { text: 'Name', value: 'employee_full_name'},
        { text: 'Status', value: 'current_employment_profile'},
    ];

    let leaveTypes:TableHeaderT[] = leaveTypeHeaders.value.length > 0 ? leaveTypeHeaders.value.map((item: {code: string, ulid: string}) => {
        return {
            text: item.code,
            value: item.ulid,
            isNumeric: true
        }
    }) : [{
        text: `N/A`,
        value: ``,
    }];

    return headers.concat(leaveTypes);
});

const leaveBalanceByTypes = reactive<{
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
let filters = reactive<{
    page: number,
    perPage: number,
    search: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    }
}>({
    page: 1,
    perPage: 10,
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
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: filters.search.keyword,
            employment_status: employmentStatusOptions.selected,
            assigned_employee_group_ids: employeeGroupOptions.selected,
            leave_type_ids: leaveTypeSelectionsOptions.selected,
            date: balanceDate.value
        }
    };
});

const balanceDate = ref($moment().format("YYYY-MM-DD"));

const leaveBalanceByTypePending = ref(false);

const disableActions = computed(() => {
    return leaveBalanceByTypePending.value || companyAssociationPendingState().value;
});

const disableDataTable = computed(() => {
    return leaveBalanceByTypePending.value|| companyAssociationPendingState().value;
});

const leaveBalanceByTypeExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    leaveBalanceByTypePending.value = true;

    await laraFetch(`/api/leave-running-balance-by-type`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            leaveBalanceByTypePending.value = false;
        },
        onResponse: () => {
            leaveBalanceByTypePending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            leaveBalanceByTypes.data = _get(response, '_data.values.employees.data', []).map((employee: TableRowT) => {

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

            leaveBalanceByTypes.meta = _get(response, '_data.values.employees.meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
            leaveTypeHeaders.value = _get(response, '_data.values.leave_types', []);
        }
    }, false);
}
await leaveBalanceByTypeExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
    }

    if(filters.page === page){
        leaveBalanceByTypeExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

let datePickers = ref([
    {
        id: 'balance_date',
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            balanceDate.value = payload.value;
        }
    },
]);

const renderUpToDatePicker = () => {
    render(datePickers.value);
}

//Render date time pickers on navigate
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(() => {
            renderUpToDatePicker();
        });
    });
}

//Render date time pickers on load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            renderUpToDatePicker();
        });
    }
})
</script>

<style scoped>

</style>