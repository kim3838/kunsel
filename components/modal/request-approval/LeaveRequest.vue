<template>
    <div class="font-data">
        <div class="text-lg font-medium font-header">
            {{requestNumber}}
        </div>
        <div class="text-base">
            Leave request
        </div>
        <div class="text-base">
            Requested by: {{requestByUsername}} {{requestByEmployeeNumberComputed}} {{requestByEmployeeFullName}}
        </div>

        <fieldset class="mt-4 neutral-border px-2 pb-2 space-y-2">
            <legend class="text-lg font-header">Leave</legend>

            <div class="grid gap-2">
                <div class="grid grid-cols-2 gap-y-2 lg:gap-y-0 lg:grid-cols-3 gap-x-2">
                    <div>
                        <InputLabel :size="'sm'" value="Employee"/>
                        <div class="text-base">({{employeeNumber}}) {{employeeFullName}}</div>
                    </div>
                    <div>
                        <InputLabel :size="'sm'" value="Leave"/>
                        <div class="text-base">({{leaveTypeCode}}) {{leaveTypeName}}</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-y-2 lg:gap-y-0 lg:grid-cols-3 gap-x-2">
                    <div>
                        <InputLabel :size="'sm'" value="Leave date"/>
                        <div class="text-base">{{leaveDates}}</div>
                    </div>
                </div>
                <div class="col-span-full">
                    <InputLabel :size="'sm'" value="Remarks"/>
                    <div class="text-base">{{remarks}}</div>
                </div>
            </div>
        </fieldset>

        <fieldset v-if="statusSummary == REQUEST_APPROVAL_STATUS.APPROVED" class="mt-4 neutral-border px-2 pb-2 space-y-2">
            <legend class="text-lg font-header">Results</legend>

            <DataTable
                :headers="resultsHeaders"
                :size="'md'"
                :rows="results"
                selection>
                <template v-slot:cell.successful="{cell,slot}">
                    <div class="p-[3px]">{{cell.successful ? `Yes` : `No`}}</div>
                </template>
            </DataTable>
        </fieldset>
    </div>
</template>

<script setup lang="ts">

import type {TableHeaderT} from "@/public/js/types/data";

const props = defineProps({
    leaveRequestPayload: {
        type: Object,
        default: () => {
            return {};
        }
    }
});

const requestNumber = ref('');
const requestByUsername = ref('');
const requestByEmployeeNumber = ref('');
const requestByEmployeeFullName = ref('');
const statusSummary = ref(REQUEST_APPROVAL_STATUS.NOT_SPECIFIED);

const employeeNumber = ref('');
const employeeFullName = ref('');
const leaveTypeCode = ref('');
const leaveTypeName = ref('');

const leaveStart = ref('');
const leaveEnd = ref('');
const leaveDates = computed(() => {

    if (leaveStart.value !== '' && leaveStart.value == leaveEnd.value){
        return leaveStart.value;
    } else if (leaveStart.value !== '' && leaveEnd.value !== '') {
        return leaveStart.value + ' to ' + leaveEnd.value;
    }
})
const remarks = ref('');
const results = ref([]);

requestNumber.value = _get(props.leaveRequestPayload, 'number', '');
requestByUsername.value = _get(props.leaveRequestPayload, 'requested_by.username', '');
requestByEmployeeNumber.value = _get(props.leaveRequestPayload, 'requested_by.company_employee_number', null);
const requestByEmployeeNumberComputed = computed(() => {
    return requestByEmployeeNumber.value ? `(${requestByEmployeeNumber.value})` : '';
})
requestByEmployeeFullName.value = _get(props.leaveRequestPayload, 'requested_by.company_employee_full_name', '');
statusSummary.value = _get(props.leaveRequestPayload, 'status_summary.value', REQUEST_APPROVAL_STATUS.NOT_SPECIFIED);

employeeNumber.value = _get(props.leaveRequestPayload, 'employee.number', '');
employeeFullName.value = _get(props.leaveRequestPayload, 'employee.full_name', '');

leaveTypeCode.value = _get(props.leaveRequestPayload, 'leave_type.code', '');
leaveTypeName.value = _get(props.leaveRequestPayload, 'leave_type.name', '');

leaveStart.value = _get(props.leaveRequestPayload, 'date_from_readable', '');
leaveEnd.value = _get(props.leaveRequestPayload, 'date_to_readable', '');
remarks.value = _get(props.leaveRequestPayload, 'remarks', '');

results.value = _get(props.leaveRequestPayload, 'results', []);

const resultsHeaders = reactive<TableHeaderT[]>([
    { text: 'Date', value: 'date', alignData: 'left'},
    { text: 'Is successful', value: 'successful', alignData: 'left'},
    { text: 'Remarks', value: 'remarks', alignData: 'left'},
]);
</script>

<style scoped>

</style>