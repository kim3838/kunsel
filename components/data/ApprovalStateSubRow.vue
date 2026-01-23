<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="approversHeaders"
            :disabled="disabled"
            :size="'md'"
            :stripped="false"
            :rows="rowsProxy">
            <template v-slot:cell.status="{cell,slot}">
                <div class="flex space-x-1 px-[0.3rem] items-center">
                    <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status?.text" />
                </div>
            </template>

            <template v-slot:cell.user_status="{cell,slot}">
                <div class="p-[3px]">{{cell.approver.status?.text}}</div>
            </template>
            <template v-slot:cell.username="{cell,slot}">
                <div class="p-[3px]">{{cell.approver.username}}</div>
            </template>
            <template v-slot:cell.company_employee_number="{cell,slot}">
                <div class="p-[3px]">{{cell.approver.company_employee_number}}</div>
            </template>
            <template v-slot:cell.company_employee_full_name="{cell,slot}">
                <div class="p-[3px]">{{cell.approver.company_employee_full_name}}</div>
            </template>
            <template v-slot:cell.company_assignment_type="{cell,slot}">
                <div class="px-[3px]">
                    <span v-if="cell.approver.company_assignment_type?.value">{{cell.approver.company_assignment_type?.text}}</span>
                </div>
            </template>
            <template v-slot:cell.approved_by_username="{cell,slot}">
                <div class="p-[3px]">{{cell.approved_by.username}}</div>
            </template>
            <template v-slot:cell.approved_at_diff="{cell,slot}">
                <div class="p-[3px]">{{cell.approved_by.approved_at_diff}}</div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT, TableRowT} from "@/public/js/types/data";
import type {LabelTypeT} from "@/public/js/types/theme";

const props = defineProps({
    rows: {
        type: Array as PropType<TableRowT[]>,
        default: () => [],
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const rowsProxy = computed({
    get() {
        return props.rows.map((approvalState: TableRowT) => {

            let statusSummary = _get(approvalState, 'status.value', 0);

            let shade = 'default';

            if(statusSummary == REQUEST_APPROVAL_STATUS.DECLINED){
                shade = 'danger';
            } else if(statusSummary == REQUEST_APPROVAL_STATUS.APPROVED){
                shade = 'success';
            }

            return {
                ...approvalState,
                _payload: {
                    'label_shade': {
                        'cell': ['status'],
                        'value': shade
                    }
                }
            };
        });
    },
    set(newValue) {

    }
});

const emit = defineEmits(['proxyEdit', 'syncSelected']);

const rowsIsEmpty = computed(() => props.rows.length === 0);

const approversHeaders = reactive<TableHeaderT[]>([
    { text: 'Order', value: 'order'},
    { text: 'Status', value: 'status'},
    { text: '', value: 'current_state_message', minWidth: '54.11px'},

    { text: 'User Status', value: 'user_status'},
    { text: 'Approver', value: 'username'},
    { text: '#', value: 'company_employee_number', minWidth: '33.5px'},
    { text: '', value: 'company_employee_full_name', minWidth: '33.5px'},
    { text: 'Company Assignment', value: 'company_assignment_type'},

    { text: 'Approved By', value: 'approved_by_username'},
    { text: '', value: 'approved_at_diff', minWidth: '33.5px'},
    { text: 'Remarks', value: 'remarks'},
]);
</script>

<style scoped>

</style>