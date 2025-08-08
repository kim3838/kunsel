<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="associationsHeaders"
            v-model="selectedAssociations"
            :disabled="disabled"
            :size="'md'"
            :rows="rows"
            :stripped="true">
            <template v-slot:cell.week_day="{cell,slot}">
                <div class="p-[3px]">{{cell.week_day.text}}</div>
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

const selectedAssociations = ref([]);
const associationsHeaders = reactive<TableHeaderT[]>([
    { text: 'Weekday', value: 'week_day', alignData: 'left'},
    { text: 'Day Off', value: 'is_day_off', alignData: 'left'},
    { text: 'Flexible', value: 'is_flexible', alignData: 'left'},
    { text: 'Work Start', value: 'work_start', alignData: 'left'},
    { text: 'Work End', value: 'work_end', alignData: 'left'},
    { text: 'Total Work Hours w/ Breaks', value: 'total_work_hours_with_breaks', alignData: 'left'},
    { text: 'Lunch Break Start', value: 'lunch_break_start', alignData: 'left'},
    { text: 'Lunch Break End', value: 'lunch_break_end', alignData: 'left'},
    { text: 'Total Lunch Break Hours', value: 'total_lunch_break_hours', alignData: 'left'},
]);

</script>

<style scoped>

</style>