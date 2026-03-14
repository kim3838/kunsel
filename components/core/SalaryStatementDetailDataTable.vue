<template>
    <div>
        <DataTable
            v-if="!rowsIsEmpty"
            :headers="detailHeaders"
            :disabled="disabled"
            :size="'lg'"
            :stripped="true"
            :rows="rows"
            :border-appearance="false"
            :sub-row-slug="subRowSlug"
            :sub-row-settings="{
                type: DATATABLE_SUBROW_TYPE.TITLED,
                containerPaddingTop: 0.50,
                containerPaddingBottom: 1.50,
                titleSize: 'md',
                rowVerticalLine: true,
                verticalBorderType: 'dashed'
            }">
            <template v-slot:cell.formulable_type="{cell,slot}">
                <div class="p-[3px]">{{cell.formulable_type?.text}}</div>
            </template>
            <template v-slot:cell.component_type="{cell,slot}">
                <div class="p-[3px]">{{cell.component_type?.text}}</div>
            </template>
            <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                <div class="inline-flex items-center scaffold-border pr-2">
                    <Icon name="ic:outline-keyboard-arrow-right" :class="[slot.iconSizeClass, slot.iconHolderClass]" /><div :class="[slot.titleSizeClass]">Details</div>
                </div>
                <SalaryStatementDetailComponentValueSubRow
                    :component-value-type="cell.component_value_type"
                    :rows="cell[slot.slug]"
                ></SalaryStatementDetailComponentValueSubRow>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT, TableRowT} from "@/public/js/types/data";

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
    disabled: {
        type: Boolean,
        default: false,
    },
});

const borderAppearance = ref(Boolean(props.subRowSlug));

const rowsProxy = computed({
    get() {
        return props.rows.map((statementDetail: TableRowT) => {

            let shade = useCosmetic().formulableComponentShade(statementDetail.formulable_type.value, statementDetail.component_type?.value);

            return {
                ...statementDetail,
                _payload: {
                    'label_shade': {
                        'cell': ['component_type', 'component_name'],
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

const detailHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number', alignHeader: 'center', alignData: 'center', minWidth: '30px'},
    { text: 'Formulable', value: 'formulable_type'},
    { text: 'Component', value: 'component_type'},
    { text: 'Payroll item', value: 'component_name'},
    { text: 'Taxable', value: 'taxable', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Nontaxable', value: 'nontaxable', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Contribution', value: 'contribution', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Withholding Tax', value: 'withholding_tax', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Deduction', value: 'deduction', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    { text: 'Net', value: 'net', isNumeric: true, alignData: 'right', alignHeader: 'right'},
]);
</script>

<style scoped>

</style>