<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="attendancesHeaders"
            :disabled="disabled"
            :size="'lg'"
            :stripped="true"
            :rows="rowsProxy"
            :border-appearance="borderAppearance"
            :sub-row-slug="subRowSlug"
            :sub-row-extension-slug="subRowExtensionSlug"
            :sub-row-settings="{
                type: DATATABLE_SUBROW_TYPE.TITLED,
                containerPaddingTop: 0.50,
                containerPaddingBottom: 1.50,
                titleSize: 'md',
                rowVerticalLine: true,
                verticalBorderType: 'dashed'
            }">
            <template v-slot:cell.status="{cell,slot}">
                <div class="flex space-x-1 px-[0.3rem] items-center">
                    <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.status?.text" />
                </div>
            </template>
            <template v-slot:cell.day_type="{cell,slot}">
                <div class="p-[3px]">{{cell.day_type?.text}}</div>
            </template>
            <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                <div class="inline-flex items-center scaffold-border pr-2">
                    <Icon name="ic:outline-keyboard-arrow-right" :class="[slot.iconSizeClass, slot.iconHolderClass]" /><div :class="[slot.titleSizeClass]">Pay splits</div>
                </div>
                <SalaryStatementAttendanceDetailPaySplitSubRow
                    :rows="cell[slot.slug]"
                ></SalaryStatementAttendanceDetailPaySplitSubRow>
            </template>
            <template v-slot:sub_row_extension_slot="{rowIndex, cell, slot}">
                <div class="inline-flex items-center scaffold-border pr-2">
                    <Icon name="ic:outline-keyboard-arrow-right" :class="[slot.iconSizeClass, slot.iconHolderClass]" /><div :class="[slot.titleSizeClass]">Payroll item totals</div>
                </div>
                <div :style="{'max-height': slot.extensionSlugContentMaxHeight, 'overflow-y': 'scroll'}">

                    <SalaryStatementAttendanceDetailPayrollItemSubRow
                        v-if="cell[slot.slug].length"
                        :rows="cell[slot.extensionSlug]"
                    ></SalaryStatementAttendanceDetailPayrollItemSubRow>
                </div>
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
    subRowSlug: {
        type: String,
        default: null
    },
    subRowExtensionSlug: {
        type: String,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const borderAppearance = ref(Boolean(props.subRowSlug));

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
    { text: '#', value: 'row_number', alignHeader: 'center', alignData: 'center', minWidth: '30px'},
    { text: 'Date', value: 'date'},
    { text: '', value: 'week_day_name'},
    { text: 'Status', value: 'status'},
    { text: 'Day Type', value: 'day_type'},
]);
</script>

<style scoped>

</style>