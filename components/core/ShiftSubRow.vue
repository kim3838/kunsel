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
            <template v-slot:cell.is_rest_day="{cell, slot, scrollReference}">
                <div class="flex justify-center">
                    <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.is_rest_day"></NonModelCheckBox>
                </div>
            </template>
            <template v-slot:cell.is_day_off="{cell, slot, scrollReference}">
                <div class="flex justify-center">
                    <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.is_day_off"></NonModelCheckBox>
                </div>
            </template>
            <template v-slot:cell.is_flexible="{cell, slot, scrollReference}">
                <div class="flex justify-center">
                    <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.is_flexible"></NonModelCheckBox>
                </div>
            </template>
            <template v-slot:cell.total_work_hours_with_breaks="{cell, slot, scrollReference}">
                <div class="p-[3px]" v-if="cell.is_flexible">
                    {{cell.total_work_hours_with_breaks}}
                </div>
            </template>
            <template v-slot:cell.total_lunch_break_hours="{cell, slot, scrollReference}">
                <div class="p-[3px]" v-if="cell.is_flexible">
                    {{cell.total_lunch_break_hours}}
                </div>
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

const selected = ref([]);
const headers = reactive<TableHeaderT[]>([
    { text: 'Weekday', value: 'week_day_name', alignData: 'left'},
    { text: 'Rest Day', value: 'is_rest_day', alignData: 'left'},
    { text: 'Day Off', value: 'is_day_off', alignData: 'left'},
    //{ text: 'Flexible', value: 'is_flexible', alignData: 'left'},
    { text: 'Timezone', value: 'timezone', alignData: 'left'},
    { text: 'Start', value: 'work_start', alignData: 'right'},
    { text: 'End', value: 'work_end', alignData: 'right'},
    { text: 'Total', value: 'total_work_hours_with_breaks', alignData: 'right'},
    { text: 'Lunch Start', value: 'lunch_break_start', alignData: 'right'},
    { text: 'Lunch End', value: 'lunch_break_end', alignData: 'right'},
    { text: 'Total Lunch', value: 'total_lunch_break_hours', alignData: 'right'},
]);

</script>

<style scoped>

</style>