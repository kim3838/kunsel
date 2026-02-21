<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="salaryStatementAttendanceDetailHeaders"
            :disabled="disabled"
            :size="'md'"
            :stripped="true"
            :rows="rows">
            <template v-slot:cell.split_type="{cell,slot}">
                <div class="p-[3px]">{{cell.split_type.text}}</div>
            </template>
            <template v-slot:cell.work_hour="{cell,slot}">
                <div class="p-[3px]">{{cell.work_hour_type?.text}}</div>
            </template>
            <template v-slot:cell.hourly_rate_type="{cell,slot}">
                <div class="p-[3px]">{{cell.hourly_rate_type?.text}}</div>
            </template>
            <template v-slot:cell.holiday_pay_forfeited="{cell,slot}">
                <div class="p-[3px]">{{cell.holiday_pay_forfeited ? 'Yes' : 'No'}}</div>
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

const salaryStatementAttendanceDetailHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: 'Date', value: 'date'},
    { text: 'Split', value: 'split_type'},
    { text: 'Start', value: 'split_start', alignData: 'left'},
    { text: 'End', value: 'split_end', alignData: 'left'},
    { text: 'Dur.', value: 'split_duration', alignData: 'left'},

    { text: 'WH', value: 'work_hour', alignData: 'left'},
    { text: 'HRT', value: 'hourly_rate_type', alignData: 'left'},

    { text: 'HR', value: 'hourly_rate', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'AP', value: 'actual_present', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'RP', value: 'regular_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'ALL', value: 'allowance', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'NSDP', value: 'night_differential_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'RDP', value: 'rest_day_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'LP', value: 'leave_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'HP', value: 'holiday_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},

    { text: 'HPF', value: 'holiday_pay_forfeited'},
]);

</script>

<style scoped>

</style>