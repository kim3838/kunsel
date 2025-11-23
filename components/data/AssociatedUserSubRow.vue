<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :sup-headers="associationsSupHeaders"
            :headers="associationsHeaders"
            v-model="selectedAssociations"
            :disabled="disabled"
            :size="'sm'"
            :rows="rows"
            :stripped="false"
            @selectionChanged="selectionChanged">
            <template v-slot:cell.assignment="{cell,slot}">
                <div class="p-[3px]">{{cell.assignment.text}}</div>
            </template>
            <template v-slot:cell.is_employee="{cell, slot, scrollReference}">
                <div class="flex justify-center">
                    <NonModelCheckBox v-if="cell.is_employee" disabled :size="slot.checkBoxSize" :checked="cell.is_employee"></NonModelCheckBox>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {DataTableSelectionActionT, TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";

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

const selectedAssociations = ref([]);
const associationsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: '', colspan: 2, alignHeader: 'left'},
    {text: 'Employee', colspan: 3, alignHeader: 'left'},
]);
const associationsHeaders = reactive<TableHeaderT[]>([
    { text: 'Company', value: 'name', alignData: 'left'},
    { text: 'Assignment', value: 'assignment', alignData: 'left'},
    { text: 'Is Employee?', value: 'is_employee', alignData: 'left'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left'},
]);

const edit = (cell: TableRowT) => {
    emit('proxyEdit', cell);
}

const selectionChanged = (selectionPayload: DataTableSelectionActionT) => {
    emit('syncSelected', selectionPayload);
}
</script>

<style scoped>

</style>