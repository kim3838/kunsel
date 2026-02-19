<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="componentValueHeaders"
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
import type {LabelTypeT} from "@/public/js/types/theme";

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

const componentValueHeaders = reactive<TableHeaderT[]>([
    { text: 'Regular pay', value: 'regular_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Rest day pay', value: 'rest_day_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'NSD pay', value: 'night_differential_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Total', value: 'total', isNumeric: true, alignData: 'right', alignHeader: 'right'},
]);
</script>

<style scoped>

</style>