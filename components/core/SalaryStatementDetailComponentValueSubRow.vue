<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :sup-headers="componentValueSupHeaders"
            :headers="componentValueHeaders"
            :disabled="disabled"
            :size="'md'"
            :stripped="true"
            :rows="rows">
            <template v-slot:cell.employee_share_regular="{cell,slot}">
                <div class="p-[3px]">{{cell.employee_share?.regular}}</div>
            </template>
            <template v-slot:cell.employee_share_mpf="{cell,slot}">
                <div class="p-[3px]">{{cell.employee_share?.mpf}}</div>
            </template>
            <template v-slot:cell.employee_share_total="{cell,slot}">
                <div class="p-[3px]">{{cell.employee_share?.total}}</div>
            </template>
            <template v-slot:cell.employer_share_regular="{cell,slot}">
                <div class="p-[3px]">{{cell.employer_share?.regular}}</div>
            </template>
            <template v-slot:cell.employer_share_mpf="{cell,slot}">
                <div class="p-[3px]">{{cell.employer_share?.mpf}}</div>
            </template>
            <template v-slot:cell.employer_share_ec="{cell,slot}">
                <div class="p-[3px]">{{cell.employer_share?.ec}}</div>
            </template>
            <template v-slot:cell.employer_share_total="{cell,slot}">
                <div class="p-[3px]">{{cell.employer_share?.total}}</div>
            </template>

            <template v-slot:cell.gross="{cell,slot}">
                <div class="p-[3px]">{{cell.gross}}</div>
            </template>
            <template v-slot:cell.deduction="{cell,slot}">
                <div class="p-[3px]">{{cell.deduction}}</div>
            </template>

            <template v-slot:cell.13th_month_is_prorated="{cell,slot}">
                <div class="p-[3px]">{{cell['13th_month_is_prorated'] ? 'Yes' : 'No'}}</div>
            </template>
            <template v-slot:cell.13th_month_is_projected="{cell,slot}">
                <div class="p-[3px]">{{cell['13th_month_is_projected'] ? 'Yes' : 'No'}}</div>
            </template>

            <template v-slot:cell.net="{cell,slot}">
                <div class="p-[3px]">{{cell.net}}</div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";

const nuxtApp = useNuxtApp();

const props = defineProps({
    rows: {
        type: Array as PropType<TableRowT[]>,
        default: () => [],
    },
    componentValueType: {
        type: Number,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['proxyEdit', 'syncSelected']);

const rowsIsEmpty = computed(() => props.rows.length === 0);

const TYPE = SALARY_STATEMENT_DETAIL_COMPONENT_VALUE_TYPE;

const getSupHeaders = (componentValueType: number) => {

    let supHeaders:TableSupHeaderT[] = [];

    if([
        TYPE.PH_SSS, TYPE.PH_PHILHEALTH, TYPE.PH_PAG_IBIG, TYPE.PH_WITHHOLDING_TAX
    ].indexOf(componentValueType) >= 0){
        supHeaders = supHeaders.concat([
            {text: 'Period', colspan: 2, alignHeader: 'center'},
        ])
    }

    if([
        TYPE.PH_BASIC_PAY, TYPE.PH_OVERTIME
    ].indexOf(componentValueType) >= 0){
        supHeaders = supHeaders.concat([
            {text: 'Pay splits', colspan: 3, alignHeader: 'center'},
        ])
    }

    let employeeShareColSpan = {
        [TYPE.PH_SSS as number]: 3,
        [TYPE.PH_PHILHEALTH as number]: 1,
        [TYPE.PH_PAG_IBIG as number]: 1,
    }[componentValueType];

    let employerShareColSpan = {
        [TYPE.PH_SSS as number]: 4,
        [TYPE.PH_PHILHEALTH as number]: 1,
        [TYPE.PH_PAG_IBIG as number]: 1,
    }[componentValueType];

    if([
        TYPE.PH_SSS,TYPE.PH_PHILHEALTH,TYPE.PH_PAG_IBIG,
    ].indexOf(componentValueType) >= 0){
        supHeaders = supHeaders.concat([
            {text: 'Employee share', colspan: employeeShareColSpan, alignHeader: 'center'},
            {text: 'Employer share', colspan: employerShareColSpan, alignHeader: 'center'},
        ])
    }

    if([
        TYPE.PH_BASIC_PAY, TYPE.PH_REGULAR_ALLOWANCE, TYPE.PH_OVERTIME, TYPE.PH_LEAVE, TYPE.PH_HOLIDAY,
        TYPE.PH_SSS,TYPE.PH_PHILHEALTH,TYPE.PH_PAG_IBIG,
    ].indexOf(componentValueType) >= 0){
        supHeaders = supHeaders.concat([
            {text: '', colspan: 1, alignHeader: 'left'},
        ])
    }

    if([
        TYPE.PH_BONUS_13TH_MONTH
    ].indexOf(componentValueType) >= 0){
        supHeaders = supHeaders.concat([
            {text: '', colspan: 2, alignHeader: 'center'},
            {text: 'Basic gross', colspan: 3, alignHeader: 'center'},
            {text: '13th month', colspan: 1, alignHeader: 'center'},
        ])
    }

    if([
        TYPE.PH_BONUS_13TH_MONTH_POSITIVE_ADJUSTMENT,
        TYPE.PH_BONUS_13TH_MONTH_NEGATIVE_ADJUSTMENT,
    ].indexOf(componentValueType) >= 0){
        supHeaders = supHeaders.concat([
            {text: '', colspan: 2, alignHeader: 'center'},
            {text: 'Adjustment', colspan: 1, alignHeader: 'center'},
        ])
    }

    if([
        TYPE.NET
    ].indexOf(componentValueType) >= 0){
        supHeaders = supHeaders.concat([
            {text: 'Net summary', colspan: 3, alignHeader: 'center'},
        ])
    }

    return supHeaders;
};

const getHeaders = (componentValueType: number) => {

    let headers:TableHeaderT[] = [];

    if([
        TYPE.PH_SSS, TYPE.PH_PHILHEALTH, TYPE.PH_PAG_IBIG, TYPE.PH_WITHHOLDING_TAX
    ].indexOf(componentValueType) >= 0){
        headers = headers.concat([
            { text: 'Start', value: 'period_start', isNumeric: true, alignData: 'left', alignHeader: 'left'},
            { text: 'End', value: 'period_end', isNumeric: true, alignData: 'left', alignHeader: 'left'},
        ])
    }

    if([
        TYPE.PH_BASIC_PAY, TYPE.PH_OVERTIME
    ].indexOf(componentValueType) >= 0){
        headers = headers.concat([
            { text: 'Regular pay', value: 'regular_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
            { text: 'Rest day pay', value: 'rest_day_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
            { text: 'Night diff. pay', value: 'night_differential_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        ])
    }

    if([
        TYPE.PH_SSS,TYPE.PH_PHILHEALTH,TYPE.PH_PAG_IBIG,
    ].indexOf(componentValueType) >= 0){
        headers = headers.concat([
            { text: 'Regular', value: 'employee_share_regular', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        ])
    }

    if([
        TYPE.PH_SSS,
    ].indexOf(componentValueType) >= 0){
        headers = headers.concat([
            { text: 'MPF', value: 'employee_share_mpf', isNumeric: true, alignData: 'right', alignHeader: 'right'},
            { text: 'Total', value: 'employee_share_total', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        ])
    }

    if([
        TYPE.PH_SSS,TYPE.PH_PHILHEALTH,TYPE.PH_PAG_IBIG,
    ].indexOf(componentValueType) >= 0){
        headers = headers.concat([
            { text: 'Regular', value: 'employer_share_regular', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        ])
    }

    if([
        TYPE.PH_SSS,
    ].indexOf(componentValueType) >= 0){
        headers = headers.concat([
            { text: 'MPF', value: 'employer_share_mpf', isNumeric: true, alignData: 'right', alignHeader: 'right'},
            { text: 'EC', value: 'employer_share_ec', isNumeric: true, alignData: 'right', alignHeader: 'right'},
            { text: 'Total', value: 'employer_share_total', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        ])
    }

    if([
        TYPE.PH_BASIC_PAY, TYPE.PH_REGULAR_ALLOWANCE, TYPE.PH_OVERTIME, TYPE.PH_LEAVE, TYPE.PH_HOLIDAY,
        TYPE.PH_SSS,TYPE.PH_PHILHEALTH,TYPE.PH_PAG_IBIG,
    ].indexOf(componentValueType) >= 0){
        headers = headers.concat([
            { text: 'Total', value: 'total', isNumeric: true, alignData: 'right', alignHeader: 'center'}
        ])
    }

    if([
        TYPE.PH_BONUS_13TH_MONTH
    ].indexOf(componentValueType) >= 0){
        headers = headers.concat([
            { text: 'Prorated', value: '13th_month_is_prorated', alignData: 'left'},
            { text: 'Projected', value: '13th_month_is_projected', alignData: 'left'},
            { text: 'Actual', value: '13th_month_actual_basic_gross', isNumeric: true, alignData: 'right', alignHeader: 'center'},
            { text: 'Projected', value: '13th_month_projected_basic_gross', isNumeric: true, alignData: 'right', alignHeader: 'center'},
            { text: 'Total', value: '13th_month_total_basic_gross', isNumeric: true, alignData: 'right', alignHeader: 'center'},
            { text: 'Total / 12', value: '13th_month_amount', isNumeric: true, alignData: 'right', alignHeader: 'center'}
        ])
    }

    if([
        TYPE.PH_BONUS_13TH_MONTH_POSITIVE_ADJUSTMENT,
        TYPE.PH_BONUS_13TH_MONTH_NEGATIVE_ADJUSTMENT,
    ].indexOf(componentValueType) >= 0){
        headers = headers.concat([
            { text: 'Actual', value: '13th_month_actual', isNumeric: true, alignData: 'right', alignHeader: 'center'},
            { text: 'Projected', value: '13th_month_projected', isNumeric: true, alignData: 'right', alignHeader: 'center'},
            { text: '', value: '13th_month_adjustment', isNumeric: true, alignData: 'right', alignHeader: 'center'},
        ])
    }

    if([
        TYPE.NET
    ].indexOf(componentValueType) >= 0){
        headers = headers.concat([
            { text: 'Gross', value: 'gross', isNumeric: true, alignData: 'right', alignHeader: 'center'},
            { text: 'Deduction', value: 'deduction', isNumeric: true, alignData: 'right', alignHeader: 'center'},
            { text: 'Net', value: 'net', isNumeric: true, alignData: 'right', alignHeader: 'center'}
        ])
    }

    return headers
}

const componentValueSupHeaders = computed<TableSupHeaderT[]>(() => {
    return getSupHeaders(props.componentValueType);
});

const componentValueHeaders = computed<TableHeaderT[]>(() => {
    return getHeaders(props.componentValueType);
});

</script>

<style scoped>

</style>