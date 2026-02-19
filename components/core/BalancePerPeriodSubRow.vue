<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="headers"
            v-model="selected"
            :disabled="disabled"
            :size="'md'"
            :rows="rows"
            :stripped="true">
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

const selected = ref([]);
const headers = reactive<TableHeaderT[]>([
    { text: 'From Period', value: 'from_period', alignData: 'left'},
    { text: 'To Period', value: 'to_period', alignData: 'left'},
    { text: 'Balance', value: 'balance', alignData: 'right'},
]);

</script>

<style scoped>

</style>