<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="attendancesHeaders"
            :disabled="disabled"
            :size="'md'"
            :stripped="true"
            :rows="rowsProxy">
            <template v-slot:cell.status="{cell,slot}">
                <div class="flex space-x-1 px-[0.3rem] items-center">
                    <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status?.text" />
                </div>
            </template>
            <template v-slot:cell.date_readable="{cell,slot}">
                <div class="p-[3px]">{{cell.date_readable}}</div>
            </template>
            <template v-slot:cell.day_type="{cell,slot}">
                <div class="p-[3px]">{{cell.day_type?.text}}</div>
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

const rowsProxy = computed({
    get() {
        return props.rows.map((salaryStatementAttendance: TableRowT) => {

            let dayStatus = _get(salaryStatementAttendance, 'status.value', 0);
            let dayType = _get(salaryStatementAttendance, 'day_type.value', 0);

            let shade = 'clear';

            if([
                SALARY_STATEMENT_ATTENDANCE_DAY_TYPE.DAY_OFF,
            ].indexOf(dayType) >= 0){
                shade = 'default';
            }

            return {
                ...salaryStatementAttendance,
                _payload: {
                    'label_shade': {
                        'cell': ['status', 'day_type'],
                        'value': shade
                    }
                }
            };
        });
    },
    set(newValue) {

    }
});

const emit = defineEmits(['proxyEdit', 'syncSelected']);

const rowsIsEmpty = computed(() => props.rows.length === 0);

const attendancesHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: 'Date', value: 'date_readable'},
    { text: '', value: 'week_day_name'},
    { text: 'Status', value: 'status'},
    { text: 'Day Type', value: 'day_type'},
]);
</script>

<style scoped>

</style>