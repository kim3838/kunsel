<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="approversHeaders"
            :disabled="disabled"
            :size="'md'"
            :rows="rows">
            <template v-slot:cell.type="{cell,slot}">
                <div class="px-[3px]">{{cell.type?.text}}</div>
            </template>
            <template v-slot:cell.company_assignment_type="{cell,slot}">
                <div class="px-[3px]">
                    <span v-if="cell.company_assignment_type?.value">{{cell.company_assignment_type?.text}}</span>
                </div>
            </template>
            <template v-slot:cell.account_roles_summary="{cell,slot}">
                <div class="p-[3px] flex items-center gap-1">
                    <div>{{cell.account_roles_summary?.value}}</div>
                    <div v-if="cell.account_roles_summary?.extender" class="text-xs font-sans">{{cell.account_roles_summary?.extender}}</div>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT, TableRowT} from "@/public/js/types/data";

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

const emit = defineEmits(['proxyEdit', 'syncSelected']);

const rowsIsEmpty = computed(() => props.rows.length === 0);

const approversHeaders = reactive<TableHeaderT[]>([
    { text: 'Order', value: 'order', alignData: 'left'},
    { text: 'Type', value: 'type', alignData: 'left'},
    { text: 'Username', value: 'approver_username', alignData: 'left'},
    { text: 'Employee #', value: 'company_employee_number', alignData: 'left'},
    { text: 'Name', value: 'company_employee_full_name', alignData: 'left'},
    { text: 'Company Assignment', value: 'company_assignment_type', alignData: 'left'},
    { text: 'Account roles', value: 'account_roles_summary', alignData: 'left'},
]);
</script>

<style scoped>

</style>