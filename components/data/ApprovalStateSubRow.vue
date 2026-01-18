<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="approversHeaders"
            :disabled="disabled"
            :size="'md'"
            :rows="rows">
            <template v-slot:cell.status="{cell,slot}">
                <div class="p-[3px]">{{cell.status?.text}}</div>
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
    { text: 'Username', value: 'approver', alignData: 'left'},
    { text: 'Remarks', value: 'remarks', alignData: 'left'},
    { text: 'Approval status', value: 'status', alignData: 'left'},
]);
</script>

<style scoped>

</style>