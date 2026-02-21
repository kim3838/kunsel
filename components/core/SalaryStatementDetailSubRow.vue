<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="detailHeaders"
            :disabled="disabled"
            :size="'md'"
            :stripped="true"
            :rows="rows">
            <template v-slot:cell.formulable_type="{cell,slot}">
                <div class="p-[3px]">{{cell.formulable_type?.text}}</div>
            </template>
            <template v-slot:cell.component_type="{cell,slot}">
                <div class="p-[3px]">{{cell.component_type?.text}}</div>
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

const detailHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'formulable_type'},
    { text: 'Payroll component', value: 'component_type'},
    { text: 'Payroll item', value: 'component_name'},
    { text: 'Taxable', value: 'taxable', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Nontaxable', value: 'nontaxable', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Contribution', value: 'contribution', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Withholding Tax', value: 'withholding_tax', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Deduction', value: 'deduction', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Net', value: 'net', isNumeric: true, alignData: 'right', alignHeader: 'right'},
]);
</script>

<style scoped>

</style>