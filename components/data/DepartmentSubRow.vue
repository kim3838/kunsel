<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="departmentsHeaders"
            v-model="selectedDepartments"
            :disabled="disabled"
            :size="'md'"
            :rows="rows"
            selection
            @selectionChanged="selectionChanged">
            <template v-slot:cell.actions="{cell, slot, scrollReference, checkboxCellReference}">
                <div class="flex items-center">
                    <NavDrop
                        class="z-10"
                        :disabled="disabled"
                        :parent-icon="'ic:baseline-arrow-right'"
                        in-sub-row
                        :checkbox-cell-reference="checkboxCellReference"
                        :size="`xs`"
                        :drop-shadow-size="`lg`"
                        :title="'Menu'"
                        :drop-align="'top'"
                        :drop-justify="'right'"
                        :drop-options="[
                            {type: 'action',icon: 'mdi:pen',title: 'Edit',callback: () => edit(cell),},
                        ]">
                    </NavDrop>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {DataTableSelectionActionT, TableHeaderT, TableRowT} from "@/public/js/types/data";

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

const selectedDepartments = ref([]);
const departmentsHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions'},
    { text: '', value: 'name', alignData: 'left'},
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