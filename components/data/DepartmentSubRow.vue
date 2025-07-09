<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            class="mt-1"
            :headers="departmentsHeaders"
            v-model="selectedDepartments"
            :disabled="disabled"
            :size="'md'"
            :rows="rows"
            selection
            @selectionChanged="selectionChanged">
            <template v-slot:cell.actions="{cell, slot, scrollReference}">
                <Button class="mx-0.5" :variant="'outline'" type="button" :size="slot.buttonSize" :icon="'mdi:pen'" @click="edit(cell)"></Button>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT, TableRowT} from "public/js/types/data";

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

const selectionChanged = (selectionPayload) => {
    emit('syncSelected', selectionPayload);
}
</script>

<style scoped>

</style>