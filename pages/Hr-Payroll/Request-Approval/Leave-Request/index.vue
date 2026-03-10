<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Requested by" />
                            <MultiSelectPaginated
                                :key="companyUserSelectionsOptionsKey"
                                :icon="'tdesign:component-checkbox'"
                                :disabled="disableActions"
                                glint
                                drop-shadow
                                :size="'md'"
                                :label="'Filter requested by'"
                                :payload="companyUserSelectionsOptions"
                            />
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Status" />
                            <MultiSelect :disabled="disableActions" glint drop-shadow :size="'md'" :options="requestApprovalStatusOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Request # Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search Number" type="text"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Employee Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="employeeSearchInput" v-model="filters.employeeSearch.keyword" class="w-full" placeholder="Search Employee" type="text"/>
                        </div>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <div class="h-8 flex flex-row items-center scaffold-border px-2">
                            <label class="flex items-center">
                                <Checkbox
                                    :disabled="disableActions"
                                    name="show-approval-sequence"
                                    v-model="showApprovalStates"
                                    :size="'md'"
                                    :label="'Show approval sequence'" />
                            </label>
                        </div>
                    </div>
                </form>

                <ViewRequestable
                    v-model:view-requestable="showRequestable"
                    v-model:requestable-payload="requestablePayload"/>

                <DialogModal
                    :show="creatingOrEditing"
                    :closeable="false">
                    <template #title>
                    </template>
                    <template #content>
                        <div ref='modalContentContainer'>
                            <div class="pt-2 mx-auto max-w-screen-lg flex flex-col-reverse md:flex-row gap-4">
                                <fieldset v-if="showClaimabilityPerDate" class="md:basis-4/12 neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Leave Date Inquiries</legend>

                                    <div v-if="modalInquireLeaveDatePending" class="inline-flex items-center">
                                        <UnorderedList v-if="modalDisableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                                    </div>
                                    <div v-else class="max-h-[135px] md:max-h-[270px] overflow-y-auto space-y-2">
                                        <div class="text-base font-medium font-header">Claimability does not include ineligibility, claim limit and leave balance.</div>

                                        <div class="subtitle-color">Total claimable: {{dateInquiryClaimableCount}}</div>

                                        <table class="border-separate font-sans">
                                            <tbody>
                                            <tr v-for="dateInquiry in dateInquiries">
                                                <td>{{dateInquiry.date}}</td>
                                                <td class="pl-2">
                                                    <Label :size="'md'" invert :type="dateInquiry.is_claimable ? `default` : `danger`" :label="dateInquiry.message" />
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </fieldset>
                                <div v-else class="md:basis-4/12 flex justify-center items-center text-center font-header px-4">
                                    Select employee, assigned shift, leave type and date of leave
                                </div>

                                <fieldset class="md:basis-8/12 neutral-border px-2 pb-2 space-y-2">
                                    <legend class="text-lg font-header">Create leave request</legend>

                                    <div class="grid gap-2 grid-cols-4">
                                        <div class="col-span-4 lg:col-span-2">
                                            <InputLabel :size="'sm'" value="Employee (Number, Full Name)"/>
                                            <SingleSelectPaginated
                                                :key="employeeOptionsKey"
                                                :disabled="modalDisableActions"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select Employee'"
                                                :size="'md'"
                                                :icon="'mdi:badge-account-outline'"
                                                :payload="employeeOptions"
                                                @valueChange="selectedEmployeeChanged"/>
                                        </div>
                                        <div class="hidden lg:block"></div>
                                        <div  class="col-span-4 md:col-span-3 lg:col-span-2">
                                            <InputLabel :size="'sm'" value="Assigned Shift"/>
                                            <SingleSelectPaginated
                                                :key="assignedShiftSelectionsOptionsKey"
                                                :disabled="modalDisableActions || !employeeOptions.selected"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select Assigned Shift'"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :size="'md'"
                                                :payload="assignedShiftSelectionsOptions"
                                                @valueChange="selectedShiftChanged"/>
                                        </div>
                                        <div class="col-span-4 md:col-span-3 lg:col-span-2">
                                            <InputLabel :size="'sm'" value="Assigned Leave Type"/>
                                            <SingleSelectPaginated
                                                :key="assignedLeaveTypeSelectionsOptionsKey"
                                                :disabled="modalDisableActions || !employeeOptions.selected || !assignedShiftSelectionsOptions.selected"
                                                drop-shadow
                                                value-persist
                                                :selection-max-viewable-line="10"
                                                :label="'Select Assigned Leave Type'"
                                                :icon="'tdesign:component-checkbox'"
                                                :size="'md'"
                                                :payload="assignedLeaveTypeSelectionsOptions"
                                                @valueChange="selectedLeaveTypeChanged"/>
                                        </div>
                                    </div>

                                    <div class="grid gap-2 grid-cols-3">
                                        <div>
                                            <InputLabel :size="'sm'" value="Leave Date From"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions || !assignedLeaveTypeSelectionsOptions.selected"
                                                high-light-all-text-on-focus
                                                v-model="leaveDateFrom"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`leave_date_from`"
                                                :size="'md'" />
                                        </div>
                                        <div>
                                            <InputLabel :size="'sm'" value="Leave Date To"/>
                                            <InputWithIcon
                                                :disabled="modalDisableActions || !assignedLeaveTypeSelectionsOptions.selected"
                                                high-light-all-text-on-focus
                                                v-model="leaveDateTo"
                                                :override="{font_family_class: 'font-sans'}"
                                                :icon="'mdi:calendar-cursor-outline'"
                                                :id="`leave_date_to`"
                                                :size="'md'" />
                                        </div>
                                    </div>

                                    <div class="grid gap-2 grid-cols-4">
                                        <div class="col-span-full md:col-span-2">
                                            <InputLabel :size="'sm'" value="Remarks"/>
                                            <Input
                                                :disabled="modalDisableActions"
                                                :size="'md'"
                                                v-model="remarks"/>
                                        </div>
                                        <div class="col-span-full subtitle-color">Leave claim automatically skips attendance, existing leaves, out of shift sched. and day offs</div>
                                    </div>

                                    <div v-if="$coreStore.hasNonPromptableServicePayloadMessage" class="block">
                                        <Label invert :size="'sm'" :type="'danger'" :label="$coreStore.servicePayloadMessage" />
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="mx-auto max-w-screen-lg">
                            <div class="flex space-x-2 justify-between">
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
                                        :variant="'outline'"
                                        :size="'md'"
                                        :disabled="modalDisableActions || !assignedLeaveTypeSelectionsOptions.selected"
                                        :label="`Inquire Leave Dates`"
                                        @click="modalInquireLeaveDates"/>
                                    <Button
                                        v-if="dateInquiryHasAtLeastOneClaimableLeave"
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="modalSubmitButtonIcon"
                                        :disabled="modalDisableActions || !assignedLeaveTypeSelectionsOptions.selected"
                                        :label="modalSaveButtonLabel"
                                        @click="submit"/>
                                </div>
                                <div class="space-x-2 inline-flex items-center">
                                    <div class="space-x-2 inline-flex items-center">
                                        <UnorderedList
                                            v-if="modalSubmitPending"
                                            :icon="'eos-icons:loading'"
                                            :size="'md'"
                                            :label="'Please wait...'"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="px-[20px] space-y-2">
                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                        <Button v-if="leaveRequests.successful" @click="create()" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:plus'"></Button>
                        <div v-if="leaveRequests.successful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedLeaveRequests.length}}</span> Selected</span>
                        </div>
                        <Button v-if="leaveRequests.successful" :variant="'outline'" :size="'sm'" :icon="'mdi:delete-outline'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected()" />
                        <Button
                            v-if="leaveRequests.successful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'tdesign:close'"
                            :disabled="disableActions"
                            :label="'Clear selection'"
                            @click="selectedLeaveRequests = []" />
                        <Label v-if="!leaveRequests.successful" invert :size="'md'" :type="'danger'" :label="leaveRequests.message" />
                    </div>

                    <DataTable
                        v-if="leaveRequests.successful"
                        :key="leaveRequestsKey"
                        :sup-headers="leaveRequestsSupHeaders"
                        :headers="leaveRequestsHeaders"
                        :size="'lg'"
                        :rows="leaveRequests.data"
                        :disabled="disableDataTable"
                        v-model="selectedLeaveRequests"
                        selection
                        :border-appearance="showApprovalStates"
                        :stripped="!showApprovalStates"
                        :sub-row-slug="leaveRequestSubRowSlug"
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
                                        {type: 'action', title: 'No action',callback: () => {}},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.number="{cell,slot}">
                            <div class="p-[3px] hover:underline cursor-pointer" @click="viewRequestable(cell)">{{cell.number}}</div>
                        </template>
                        <template v-slot:cell.status_summary="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status_summary?.text" />
                            </div>
                        </template>
                        <template v-slot:cell.requested_by="{cell,slot}">
                            <div class="p-[3px]">{{cell.requested_by?.username}}</div>
                        </template>
                        <template v-slot:cell.employee_number="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee?.number}}</div>
                        </template>
                        <template v-slot:cell.employee_full_name="{cell,slot}">
                            <div class="p-[3px]">{{cell.employee?.full_name}}</div>
                        </template>
                        <template v-slot:cell.code="{cell,slot}">
                            <div class="p-[3px]">{{cell.leave_type?.code}}</div>
                        </template>
                        <template v-slot:cell.name="{cell,slot}">
                            <div class="p-[3px]">{{cell.leave_type?.name}}</div>
                        </template>
                        <template v-slot:cell.type="{cell,slot}">
                            <div class="p-[3px]">{{cell.leave_type?.type?.text}}</div>
                        </template>
                        <template v-slot:cell.is_paid="{cell,slot}">
                            <div class="p-[3px]">{{cell.leave_type?.is_paid ? 'Yes' : 'No'}}</div>
                        </template>
                        <template v-slot:cell.date_from="{cell,slot}">
                            <div class="p-[3px]">{{cell.date_from_readable}}</div>
                        </template>
                        <template v-slot:cell.date_to="{cell,slot}">
                            <div class="p-[3px]">{{cell.date_to_readable}}</div>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="mdi:info-variant" :class="[slot.iconSizeClass]" /><div :class="[slot.titleSizeClass]">Approval Sequence</div>
                            </div>
                            <ApprovalStateSubRow
                                :rows="cell[slot.slug]"
                                :disabled="disableDataTable"
                            ></ApprovalStateSubRow>
                        </template>
                    </DataTable>

                    <div>
                        <PageInformation :pagination="leaveRequests.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="leaveRequests.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection, StringEnumInterface} from "@/public/js/common/type";
import type {SelectDataType} from "@/public/js/types/form";
import type {DateTimePickerOptionsT} from "@/public/js/datetimepicker/type";
import type {LabelTypeT} from "@/public/js/types/theme";
import type {RequestablePayloadT} from "@/public/js/types/request-approval";
import type {LeaveDateInquiryT} from "@/public/js/types/leave";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Leave Requests`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const $moment = nuxtApp.$moment;
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};
const {render} = dateTimePicker();
const clientReadyState = useClientReadyState();
const common = useCommon();
const coreStore = useCoreStore();
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
            employeeOptions, employeeOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }

    if(_isEmpty(selection) || selection.indexOf('assigned_shift') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            assignedShiftSelectionsOptions, assignedShiftSelectionsOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }

    if(_isEmpty(selection) || selection.indexOf('assigned_leave_type') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            assignedLeaveTypeSelectionsOptions, assignedLeaveTypeSelectionsOptionsKey, SELECT.SINGLE_PAGINATED
        );
    }

    if(_isEmpty(selection) || selection.indexOf('company_user') >= 0){
        common.rebuildSelectionsOnSelectedCompanyChanged(
            companyUserSelectionsOptions, companyUserSelectionsOptionsKey, SELECT.MULTI_PAGINATED, [], {
                query_params: {
                    account_id: selectedAssociatedCompanyAccountId.value,
                    company_id: selectedAssociatedCompanyId.value,
                },
                filters: {
                    account_id: selectedAssociatedCompanyAccountId.value,
                    associated_companies: [selectedAssociatedCompanyId.value],
                    search: {
                        keyword: '',
                        callback: 1
                    }
                }
            }
        );
    }
}

const showApprovalStates = ref(false);
const leaveRequestSubRowSlug = ref('');

watch(() => {return showApprovalStates.value;}, (show) => {
    if(show){
        leaveRequestSubRowSlug.value = 'approval_states';
        paginate(1, true)
    } else {
        leaveRequestSubRowSlug.value = '';
        paginate(1, true)
    }
})

const leaveRequestsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},

    {text: ''},
    {text: ''},

    {text: 'Requested by', colspan: 3,  alignHeader: 'left'},

    {text: 'Employee', colspan: 2,  alignHeader: 'left'},

    {text: 'Leave', colspan: 6,  alignHeader: 'left'},
]);

const leaveRequestsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'actions', minWidth: '33px'},

    { text: 'Request #', value: 'number', isNumeric: true},
    { text: 'Status', value: 'status_summary'},

    { text: '', value: 'requested_by', minWidth: '33px'},
    { text: '', value: 'date_requested_diff', minWidth: '33px'},
    { text: 'Remarks', value: 'remarks', minWidth: '33px'},

    { text: '#', value: 'employee_number', minWidth: '33px'},
    { text: 'Name', value: 'employee_full_name', minWidth: '33px'},

    { text: 'Code', value: 'code', minWidth: '33px'},
    { text: 'Name', value: 'name', minWidth: '33px'},
    { text: 'Type', value: 'type', minWidth: '33px'},
    { text: 'Is Paid', value: 'is_paid', minWidth: '33px'},
    { text: 'From', value: 'date_from', alignData: 'left'},
    { text: 'To', value: 'date_to', alignData: 'left'},
]);

const leaveRequestsKey = shallowRef(0);
const leaveRequests = reactive<DataTableT>({
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
    },
    employeeSearch: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    },
    dateFrom: string,
    dateTo: string,
}>({
    page: 1,
    perPage: 15,
    search: {
        keyword: '',
        callback: 1
    },
    employeeSearch: {
        keyword: '',
        callback: 1
    },
    dateFrom: $moment().startOf('day').format('YYYY-MM-DD'),
    dateTo: $moment().endOf('day').format('YYYY-MM-DD'),
});

const requestApprovalStatusOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(REQUEST_APPROVAL_STATUS_NAME, REQUEST_APPROVAL_STATUS.PENDING as number),
        $enumerableOption(REQUEST_APPROVAL_STATUS_NAME, REQUEST_APPROVAL_STATUS.DECLINED as number),
        $enumerableOption(REQUEST_APPROVAL_STATUS_NAME, REQUEST_APPROVAL_STATUS.APPROVED as number),
    ],
    selected: []
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

//Multi select options of Requested by
const companyUserSelectionsOptionsKey = shallowRef(0);
const companyUserSelectionsOptions = reactive({
    fetch: {
        url: '/api/company-user-selections',
        query_params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
        },
        filters: {
            account_id: selectedAssociatedCompanyAccountId.value,
            associated_companies: [selectedAssociatedCompanyId.value],
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: [],
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
            employee_search: filters.employeeSearch.keyword,
            requested_by_ids: companyUserSelectionsOptions.selected,
            statuses: requestApprovalStatusOptions.selected,
        }
    };
});
const leaveRequestsPending = ref(false)
const selectedLeaveRequests = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return leaveRequestsPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return leaveRequestsPending.value || companyAssociationPendingState().value;
});
const leaveRequestsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    leaveRequestsPending.value = true;

    await laraFetch(`/api/leave-requests`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            leaveRequestsPending.value = false;
        },
        onResponse: (request, options, response) => {
            leaveRequestsPending.value = false;
            leaveRequests.successful = _get(response, '_data.successful', false);
            leaveRequests.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            leaveRequests.data = _get(response, '_data.values.data', []).map((leaveRequest: TableRowT) => {

                let statusSummary = _get(leaveRequest, 'status_summary.value', 0);

                let shade = 'default';

                if(statusSummary == REQUEST_APPROVAL_STATUS.DECLINED){
                    shade = 'danger';
                } else if(statusSummary == REQUEST_APPROVAL_STATUS.APPROVED){
                    shade = 'success';
                }

                return {
                    ...leaveRequest,
                    _payload: {
                        'label_shade': {
                            'cell': ['status_summary'],
                            'value': shade
                        }
                    }
                };
            });
            leaveRequests.meta = _get(response, '_data.values.meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
            leaveRequestsKey.value += 1;
        }
    }, false);
}
leaveRequestsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedLeaveRequests.value = [];
    }

    if(filters.page === page){
        leaveRequestsExecute();
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
            filters.dateFrom = payload.value;
        }
    }, {
        id: 'date_to',
        type: 'date',
        selectedCallback: (payload: {value: string}) => {
            filters.dateTo = payload.value;
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

const confirmDeleteSelected = () => {

    const selectedIds = selectedLeaveRequests.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected leave request to delete.`,
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
        message: `Confirm delete selected leave request${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedLeaveRequests.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/leave-requests", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            leave_request_ids: selectedIds,
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
                message: `Leave request${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedLeaveRequests.value = [];
    await leaveRequestsExecute();
}

const stagedLeaveRequest = ref<{
    'id': string | number | null,
    'ulid': string | null,
}>({
    'id': null,
    'ulid': null,
});

const creatingOrEditing = ref(false);
const editPayload = ref({});

const create = () => {
    editPayload.value = {};
    creatingOrEditing.value = true;
}

const renderDatePickers = () => {

    let leaveDateRangePickers: DateTimePickerOptionsT[] = [
        {
            id: 'leave_date_from',
            type: 'date',
            selectedCallback: (payload: {value: string}) => {
                leaveDateFrom.value = payload.value;
            }
        },{
            id: 'leave_date_to',
            type: 'date',
            selectedCallback: (payload: {value: string}) => {
                leaveDateTo.value = payload.value;
            }
        },
    ];

    let filtersAndLeaveDateRangePickers = filtersDateTimePickers.value.concat(leaveDateRangePickers);

    render(filtersAndLeaveDateRangePickers);
}

const creatingLeaveRequest = computed(() => {
    return stagedLeaveRequest.value.id == null;
});

watch(creatingOrEditing, (creatingOrEditing)=>{
    if(creatingOrEditing){
        loadEditable();
    }
});

const leaveDateFrom = ref('');
const leaveDateTo = ref('');
const remarks = ref('');

const showClaimabilityPerDate = ref(false);
const dateInquiries = ref<LeaveDateInquiryT[]>([]);
const submitResults = ref([]);
const dateInquiryClaimableCount = computed(() => {
    return dateInquiries.value.filter((dateInquiry) => {
        return dateInquiry.is_claimable;
    }).length;
})
const dateInquiryHasAtLeastOneClaimableLeave = computed(() => {
    return dateInquiries.value.some((dateInquiry) => {
        return dateInquiry.is_claimable;
    });
})

const resetEditable = () => {
    stagedLeaveRequest.value = {
        'id': null,
        'ulid': null,
    };
    editPayload.value = {};

    employeeOptions.selected = null;
    employeeOptionsKey.value++;
    assignedShiftSelectionsOptions.selected = null;
    assignedShiftSelectionsOptionsKey.value++;
    assignedLeaveTypeSelectionsOptions.selected = null;
    assignedLeaveTypeSelectionsOptionsKey.value++;

    leaveDateFrom.value = '';
    leaveDateTo.value = '';
    remarks.value = '';

    dateInquiries.value = [];
    showClaimabilityPerDate.value = false;
}

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

const selectedEmployeeChanged = (selectedEmployee: SelectDataType) => {

    if(selectedEmployee){
        assignedShiftSelectionsOptions.fetch.filters.employee_id = selectedEmployee.value as number;
        assignedShiftSelectionsOptions.selected = null;
        assignedShiftSelectionsOptionsKey.value++;

        assignedLeaveTypeSelectionsOptions.fetch.filters.employee_id = selectedEmployee.value as number;
        assignedLeaveTypeSelectionsOptions.selected = null;
        assignedLeaveTypeSelectionsOptionsKey.value++;

    } else {
        assignedShiftSelectionsOptions.fetch.filters.employee_id = null;
        assignedShiftSelectionsOptions.selected = null;
        assignedShiftSelectionsOptionsKey.value++;

        assignedLeaveTypeSelectionsOptions.fetch.filters.employee_id = null;
        assignedLeaveTypeSelectionsOptions.selected = null;
        assignedLeaveTypeSelectionsOptionsKey.value++;
    }

    dateInquiries.value = [];
    showClaimabilityPerDate.value = false;
}
const selectedShiftChanged = async (selectedShift: SelectDataType) => {

    dateInquiries.value = [];
    showClaimabilityPerDate.value = false;
}

const selectedLeaveTypeChanged = () => {
    dateInquiries.value = [];
    showClaimabilityPerDate.value = false;
}

watch(leaveDateFrom, () => {
    dateInquiries.value = [];
    showClaimabilityPerDate.value = false;
});

watch(leaveDateTo, () => {
    dateInquiries.value = [];
    showClaimabilityPerDate.value = false;
});

const assignedShiftSelectionsOptionsKey = shallowRef(0);
const assignedShiftSelectionsOptions = reactive({
    fetch: {
        url: '/api/shift-assignment-selections',
        filters: {
            employee_id: employeeOptions.selected as number | null,
            company_id: selectedAssociatedCompanyId.value,
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: null,
});

const assignedLeaveTypeSelectionsOptionsKey = shallowRef(0);
const assignedLeaveTypeSelectionsOptions = reactive({
    fetch: {
        url: '/api/leave-type-assignment-selections',
        filters: {
            employee_id: employeeOptions.selected as number | null,
            company_id: selectedAssociatedCompanyId.value,
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: null,
});

const loadEditable = () => {

    coreStore.resetServiceError();

    stagedLeaveRequest.value = {
        'id': _get(editPayload.value, 'id', null),
        'ulid': _get(editPayload.value, 'ulid', null),
    };

    const dateFrom = process.env.NODE_ENV === 'development' ? '2026-01-01' : '';
    const dateTo = process.env.NODE_ENV === 'development' ? '2027-12-10' : '';

    leaveDateFrom.value = nuxtApp.$moment(dateFrom).format("YYYY-MM-DD");
    leaveDateTo.value = nuxtApp.$moment(dateTo).format("YYYY-MM-DD");

    renderDatePickers();
}

const closeModal = () => {
    creatingOrEditing.value = false;
    resetEditable();
};

const modalDisableActions = computed(()=>{
    return modalLoading.value || modalSubmitPending.value || modalInquireLeaveDatePending.value;
});

const modalLoading = ref(false);
const modalSubmitPending = ref(false);
const modalInquireLeaveDatePending = ref(false);

const modalSubmitButtonIcon = computed(()=>{
    const ICON = {
        CREATE: 'mdi:plus',
        EDIT: 'ic:sharp-save'
    } as const;

    const isEditMode = !creatingLeaveRequest.value;

    return isEditMode ? ICON.EDIT : ICON.CREATE;
});
const modalSaveButtonLabel = computed(()=>{
    const LABEL = {
        CREATE: `Submit Request`,
        EDIT: `Save`
    } as const;

    const isEditMode = !creatingLeaveRequest.value;

    return isEditMode ? LABEL.EDIT : LABEL.CREATE;
});

const modalSubmitPath = computed(() => {
    if(!creatingLeaveRequest.value){
        return `/api/leave-request/${stagedLeaveRequest.value.id}`;
    } else {
        return `/api/leave-request`
    }
});
const modalSubmitAction = computed(() => {
    if(!creatingLeaveRequest.value){
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
        shift_id: assignedShiftSelectionsOptions.selected,
        leave_type_id: assignedLeaveTypeSelectionsOptions.selected,
        date_from: leaveDateFrom.value,
        date_to: leaveDateTo.value,
        remarks: remarks.value,
    }
})

const modalInquireLeaveDates = async() => {
    showClaimabilityPerDate.value = true;
    modalInquireLeaveDatePending.value = true;
    dateInquiries.value = [];
    submitResults.value = [];

    await laraFetch(`/api/leave-date-range-inquire`, {
        method: `POST`,
        body: modalForm.value,
    }, {
        onRequestError: () => {
            modalInquireLeaveDatePending.value = false;
        },
        onResponse: () => {
            modalInquireLeaveDatePending.value = false;
        },
        onNotAcceptableResponse: () => {
            showClaimabilityPerDate.value = false;
        },
        onUnprocessableContentResponse: () => {
            showClaimabilityPerDate.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            showClaimabilityPerDate.value = true;
            dateInquiries.value = _get(response, '_data.values.dates', []);
        },
    });
}

const submit = async() => {
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
                message: 'Leave request created.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            closeModal();
            await leaveRequestsExecute();
        },
    });
}

const showRequestable = ref(false);
const requestablePayload = ref<Partial<RequestablePayloadT>>({
    type: '',
    id: -1,
    number: '',
});

const viewRequestable = async (row: TableRowT) => {

    requestablePayload.value = {
        type: 'leave_request',
        id: row.id,
        number: row.number,
    } as RequestablePayloadT;
    showRequestable.value = true;
}
</script>

<style scoped>

</style>