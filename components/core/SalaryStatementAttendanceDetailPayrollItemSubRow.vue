<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="salaryStatementAttendancePayrollItemHeaders"
            :disabled="disabled"
            :size="'md'"
            :stripped="true"
            :rows="rows">
            <template v-slot:cell.formulable_type="{cell,slot}">
                <div class="p-[3px]">{{cell.formulable_type.text}}</div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT, TableRowT} from "@/public/js/types/data";

const nuxtApp = useNuxtApp();

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

const salaryStatementAttendancePayrollItemHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number', alignHeader: 'center', alignData: 'center', minWidth: '26px'},
    { text: '', value: 'formulable_type'},
    { text: 'Payroll item', value: 'component_name'},

    { text: 'RP', value: 'regular_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'NSDP', value: 'night_differential_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'RDP', value: 'rest_day_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Total', value: 'total', isNumeric: true, alignData: 'right', alignHeader: 'right'},
]);

</script>

<style scoped>

</style>