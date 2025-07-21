<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="associationsHeaders"
            v-model="selectedAssociations"
            :disabled="disabled"
            :size="'md'"
            :rows="rows"
            @selectionChanged="selectionChanged">
            <template v-slot:cell.assignment="{cell,slot}">
                <div class="p-[3px]">{{cell.assignment.text}}</div>
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

const selectedAssociations = ref([]);
const associationsHeaders = reactive<TableHeaderT[]>([
    { text: 'Company', value: 'name', alignData: 'left'},
    { text: 'Assignment', value: 'assignment', alignData: 'left'},
    { text: 'Employed as', value: 'employee', alignData: 'left'},
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