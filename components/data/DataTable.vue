<template>
    <div id="table-division" ref="dataTableScroll">
        <!-- Disabled Layer -->
        <div v-show="disableableLayer && disabled" class="absolute disabled-overlay opacity-25 z-30" :style="[disabledLayerStyle]"></div>

        <table ref="tableReference" class="font-data">
            <thead class="table-header-background">
                <tr v-if="supHeaders.length > 0">
                    <td v-if="selection"></td>
                    <td v-if="manualSortable"></td>
                    <td v-for="header in supHeaders"
                        :style="{'min-width': header.minWidth, 'width': header.width, 'max-width': header.maxWidth}"
                        style="padding:0.25rem;"
                        :class="[
                            headerFontClass,
                            cellAlignClass(header?.alignHeader),
                            cellJustifyClass(header?.justifyHeader)
                        ]"
                        :colspan="header?.colspan ?? 1">
                        {{header?.text}}
                    </td>
                </tr>
                <tr v-for="(row, rowIndex) in supRows">
                    <td v-if="selection"></td>
                    <td v-if="manualSortable"></td>
                    <td v-for="(header, headerIndex) in supHeaders"
                        class="whitespace-pre"
                        :style="cellStyle(row, header)"
                        :class="[
                            bodyFontClass,
                            cellAlignClass(header?.alignData),
                            cellJustifyClass(header?.justifyData)
                        ]"
                        :colspan="header?.colspan ?? 1">
                        <slot
                            :name="`sup.header.cell.${header.value}`"
                            :cell="row"
                            :headerIndex="headerIndex">
                            <div class="p-[3px]">{{row[header?.value]}}</div>
                        </slot>
                    </td>
                </tr>

                <tr>
                    <td v-if="selection" style="padding:3px 0.5rem;" ref="checkboxCell">
                        <NonModelCheckBox :disabled="disabled" :size="checkBoxSize" :checked="checkedAllCurrentSelection()" @click="toggleCheck()" />
                    </td>
                    <td v-if="manualSortable" :class="[headerFontClass]">
                        <div class="flex px-[3px]" >
                            <Icon name="mi:sort"></Icon>
                        </div>
                    </td>
                    <td
                        v-for="header in headers"
                        :key="header.value"
                        :style="{'min-width': header.minWidth, 'width': header.width, 'max-width': header.maxWidth}"
                        style="padding:0.25rem;"
                        :class="[
                            headerFontClass,
                            cellAlignClass(header?.alignHeader),
                            cellJustifyClass(header?.justifyHeader),
                        ]">
                        <span>{{header.text}}</span>
                    </td>
                </tr>
            </thead>
            <tbody ref="tableBody">
                <!-- Table cell height: sm = 23px, md = 27px(29px w/ xs menu), lg = 31px(33px w/ sm menu), xl = 35px(37px w/ md menu) -->
                <template v-for="(row, rowIndex) in rows" :key="row.id">
                    <tr :class="[rowBackgroundClass(rowIndex), disabled ? 'pointer-events-none' : '']" >
                        <td v-if="selection" style="padding:0 0.5rem;">
                            <NonModelCheckBox
                                :size="checkBoxSize"
                                :value="row.id"
                                :selected="props.modelValue"
                                @click="checkRow(row)"/>
                        </td>
                        <td v-if="manualSortable" :class="[bodyFontClass]">
                            <div class="flex px-[3px]" >
                                <Icon class="handleOrder cursor-grab active:cursor-grabbing" name="carbon:caret-sort"></Icon>
                            </div>
                        </td>
                        <td
                            v-for="(header, headerIndex) in headers" :key="row.id"
                            class="whitespace-pre"
                            :style="cellStyle(row, header)"
                            :class="[bodyFontClass, cellClass(header), cellAlignClass(header?.alignData), cellJustifyClass(header?.justifyData)]">
                            <slot
                                :name="`cell.${header.value}`"
                                :scrollReference="dataTableScroll"
                                :checkboxCellReference="checkboxCellReference"
                                :slot="{
                                    buttonSize: buttonSize,
                                    inputSize: inputSize,
                                    unorderedListSize: unorderedListSize,
                                    labelSize: labelSize,
                                    datepickerFontSize: datepickerFontSize,
                                    selectSize: selectSize,
                                    checkBoxSize: checkBoxSize,
                                    radioGroupSize: radioGroupSize
                                }"
                                :cell="row"
                                :headerIndex="headerIndex"
                                :rowIndex="rowIndex">
                                <div class="p-[3px]">{{row[header.value]}}</div>
                            </slot>
                        </td>
                    </tr>

                    <DataTableSubRow
                        v-if="subRowSlug && row[subRowSlug]"
                        :slug="subRowSlug"
                        :row-index="rowIndex"
                        :row="row"
                        :rows="rows"
                        :type="subRowSettings.type"
                        :container-padding-top="subRowSettings.containerPaddingTop"
                        :container-padding-bottom="subRowSettings.containerPaddingBottom"
                        :title-size="subRowSettings.titleSize"
                        :row-vertical-line="subRowSettings.rowVerticalLine"
                        :vertical-border-type="subRowSettings.verticalBorderType"
                        :horizontal-border-type="subRowSettings.horizontalBorderType">
                        <template v-slot="{rowIndex, cell, slot}">
                            <slot
                                :name="'sub_row_slot'"
                                :slot="slot"
                                :cell="row"
                                :rowIndex="rowIndex"
                            ></slot>
                        </template>
                    </DataTableSubRow>
                </template>
                <tr v-if="!rows.length && props.showNoData">
                    <td colspan="100%" class="text-center" :class="[bodyFontClass]">
                        {{noDataLabel}}
                    </td>
                </tr><tr v-if="!rows.length && props.showPending && props.pending">
                    <td colspan="100%" class="text-center" :class="[bodyFontClass]">
                        {{pendingLabel}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import {useSortable} from '@vueuse/integrations/useSortable';
import {moveArrayElement} from '@vueuse/integrations/useSortable'
import {storeToRefs} from 'pinia';
import type {
    TableCellStyleT,
    TableHeaderT,
    TableRowPayloadShadeT,
    TableRowT,
    TableSupHeaderT,
    TableSupRowT
} from "@/public/js/types/data";
import type {CommonColorsT} from "@/stores/theme";
import type {LabelTypesT} from "@/public/js/types/theme";
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    common: commonColor,
    secondary: secondaryColor,
    neutral: neutralColor,
    lining: liningColor,
    thread: threadColor,
    shade: shadeColor,
    tint: tintColor,
} = storeToRefs($themeStore);

const typedCommonColor = commonColor as Ref<CommonColorsT>;

const liningColor70 = computed(() => {
    return liningColor.value + hexAlpha.value['70'];
});

const liningColor10 = computed(() => {
    return liningColor.value + hexAlpha.value['10'];
});

const props = defineProps({
    supHeaders: {
        type: Array as PropType<TableSupHeaderT[]>,
        default: () => [],
    },
    supRows: {
        type: Array as PropType<TableSupRowT[]>,
        default: () => [],
    },
    headers: {
        type: Array as PropType<TableHeaderT[]>,
        default: () => [],
    },
    rows: {
        type: Array as PropType<TableRowT[]>,
        default: () => [],
    },
    size: {
        type: String,
        default: 'md',
    },
    modelValue: {
        type: Array,
        default: () => [],
    },
    selection: Boolean,
    noDataLabel: {
        type: String,
        default: 'No Record',
    },
    showNoData: {
        type: Boolean,
        default: true,
    },
    pending: {
        type: Boolean,
        default: false,
    },
    showPending: {
        type: Boolean,
        default: true,
    },
    pendingLabel: {
        type: String,
        default: 'Loading...',
    },
    manualSortable: {
        type: Boolean,
        default: false,
    },
    disableableLayer: {
        type: Boolean,
        default: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    subRowSlug: {
        type: String,
        default: null,
    },
    subRowSettings: {
        type: Object,
        default: () => {
            return {
                type: DATATABLE_SUBROW_TYPE.TITLED,
                containerPaddingTop: 0.25,
                containerPaddingBottom: 0.75,
                titleSize: 'md',
                rowVerticalLine: true,
                verticalBorderType: 'dashed',
                horizontalBorderType: 'dashed',
            }
        }
    },
    stripped: {
        type: Boolean,
        default: true,
    },
});

const dataTableScroll = ref(null);
const checkboxCellReference = useTemplateRef('checkboxCell');
const emit = defineEmits(["update:modelValue", "manualSorted", "selectionChanged"]);

const dataTableReference = useTemplateRef('dataTableScroll');
const tableReference = useTemplateRef('tableReference');
const dataTableWidth = shallowRef('0px');
const dataTableHeight = shallowRef('0px');

watch(()=> props.disabled, disabled => {

    if(props.disableableLayer && disabled){

        const { width: dataTableReferenceWidth, height: dataTableReferenceHeight } = useElementSize(dataTableReference);
        const { width: tableReferenceWidth, height: tableReferenceHeight } = useElementSize(tableReference);

        dataTableWidth.value = `${dataTableReferenceWidth.value > tableReferenceWidth.value ? tableReferenceWidth.value : dataTableReferenceWidth.value}px`;
        dataTableHeight.value = `${dataTableReferenceHeight.value > tableReferenceHeight.value ? tableReferenceHeight.value : dataTableReferenceHeight.value}px`;
    }
});

const disabledLayerStyle = computed(() => {
    return {
        width: dataTableWidth.value,
        height: dataTableHeight.value,
    };
})

if(props.manualSortable){

    const tableBody = useTemplateRef('tableBody');
    const {option} = useSortable(tableBody, props.rows, {
        handle: '.handleOrder',
        animation: 200,
        disabled: !props.manualSortable,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        onUpdate: (event: { oldIndex: number; newIndex: number; [key: string]: any }) => {
            moveArrayElement(props.rows, event.oldIndex, event.newIndex, event);

            nextTick(() => {
                emit('manualSorted', event.oldIndex, event.newIndex, event)
            })
        }
    });

    useMutationObserver(dataTableScroll, () => {
        const elements = dataTableScroll.value?.querySelectorAll('[draggable="false"]') || [];
        elements.forEach(el => el.remove())
    }, {
        childList: true,
        subtree: true,
    });
}

function cellAlignClass(align: 'left' | 'center' | 'right' | undefined = undefined){

    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };

    return alignmentClasses[align as keyof typeof alignmentClasses] ?? 'text-left';
}

function cellJustifyClass(justify: 'top' | 'middle' | 'bottom' | undefined = undefined){

    const justificationClasses = {
        top: 'align-top',
        middle: 'align-middle',
        bottom: 'align-bottom'
    };

    return justificationClasses[justify as keyof typeof justificationClasses] ?? 'align-middle';
}

function checkedAllCurrentSelection(): boolean {
    let result = false;

    if(currentRowIds.value.length){
        result = _difference(currentRowIds.value, props.modelValue).length <= 0
    }

    return result;
}

function isRowSelected(row: TableRowT): boolean{
    return props.modelValue.indexOf(row.id) >= 0;
}

function checkRow(row: TableRowT): void{
    if(isRowSelected(row)){
        _remove(props.modelValue, (value) => value == row.id);
        emit('selectionChanged', {action: SELECTION_ACTION.REMOVE, value: _castArray(row.id)});
    } else {

        emit('update:modelValue', props.modelValue.concat(row.id));

        nextTick(()=>{
            emit('selectionChanged', {action: SELECTION_ACTION.ADD, value: _castArray(props.modelValue)});
        });
    }
}

function toggleCheck(){
    if (checkedAllCurrentSelection()){
        let clearedCurrentRows = _remove(props.modelValue, function(id) {
            let inCurrentRowIds = currentRowIds.value.indexOf(id as string | number) >= 0;
            return !inCurrentRowIds;
        });

        emit('update:modelValue', clearedCurrentRows);
        nextTick(()=>{
            emit('selectionChanged', {action: SELECTION_ACTION.REMOVE, value: _castArray(currentRowIds.value)});
        });
    } else {
        let merged = _uniq(props.modelValue.concat(currentRowIds.value));

        emit('update:modelValue', merged);
        nextTick(()=>{
            emit('selectionChanged', {action: SELECTION_ACTION.ADD, value: _castArray(props.modelValue)});
        });
    }
}

const currentRowIds = computed(() => {
    return props.rows.map(row => row.id);
});

const headerFontClass = computed(() => {
    return {
        'sm': 'font-semibold text-sm',
        'md': 'font-semibold text-base',
        'lg': 'font-semibold text-base',
        'xl': 'font-semibold text-base',
    }[props.size];
});

const bodyFontClass = computed(() => {
    return {
        'sm': 'text-xs',
        'md': 'text-sm',
        'lg': 'text-base',
        'xl': 'text-lg',
    }[props.size];
});

const cellClass = (header: TableHeaderT) => {
    return {
        'row_number': 'font-sans'
    }[header.value];
}

const buttonSize = computed(() => {
    return {
        'sm': '2xs',
        'md': 'xs',
        'lg': 'sm',
        'xl': 'md',
    }[props.size]
});

const checkBoxSize = computed(() => {
    return {
        'sm': 'md',
        'md': 'md',
        'lg': 'lg',
        'xl': 'lg',
    }[props.size]
});

const radioGroupSize = computed(() => {
    return {
        'sm': '2xs',
        'md': 'xs',
        'lg': 'sm',
        'xl': 'md',
    }[props.size]
});

const labelSize = computed(() => {
    return {
        'sm': 'sm',
        'md': 'sm',
        'lg': 'md',
        'xl': 'lg',
    }[props.size]
});

const inputSize = computed(() => {
    return {
        'sm': '2xs',
        'md': 'xs',
        'lg': 'sm',
        'xl': 'md',
    }[props.size]
});

const unorderedListSize = computed(() => {
    return {
        'sm': 'md',
        'md': 'md',
        'lg': 'lg',
        'xl': 'lg',
    }[props.size]
});

const datepickerFontSize = computed(() => {
    return {
        'sm': 'text-xs',
        'md': 'text-sm',
        'lg': 'text-sm',
        'xl': 'text-lg',
    }[props.size]
});

const selectSize = computed(() => {
    return {
        'sm': '2xs',
        'md': 'xs',
        'lg': 'sm',
        'xl': 'md',
    }[props.size]
});

const rowBackgroundClass = (rowIndex: number) => {

    if (!props.stripped) return 'table-default-background';

    return rowIndex % 2 === 0 ? 'table-row-odd-background' : 'table-row-even-background'
};

const cellStyle = (row, header) => {

    let rowPayload = row?._payload;

    let style: TableCellStyleT = {};

    if(rowPayload){

        let labelShade: (TableRowPayloadShadeT | boolean) = _get(rowPayload, 'label_shade', false);
        let shadeCell: (string | string[]) = _get(labelShade, 'cell', []);
        let shadeValue: (string | boolean) = _get(labelShade, 'value', false);
        const validShadeValue = (shadeValue as LabelTypesT) in typedCommonColor.value;

        if(validShadeValue && shadeCell == '*'){

            style['background-color'] = typedCommonColor.value[shadeValue as keyof CommonColorsT].secondary;

        } else if (validShadeValue && _includes(shadeCell, header.value)) {

            style['background-color'] = typedCommonColor.value[shadeValue as keyof CommonColorsT].secondary;
        }
    }

    return style;
};
</script>

<style lang="scss" scoped>

#table-division{
    overflow-y: hidden;
}

$tableBorder: v-bind(liningColor);
$cellBorder: v-bind(liningColor70);

table{
    white-space: nowrap;
    box-sizing: border-box;
    border-top: 0;
}

table thead tr td,
tbody tr td {
    border: 1px solid $cellBorder;
}

table thead tr,
tbody tr,
table thead tr td:nth-last-child(1),
tbody tr td:nth-last-child(1){
    border-right: 1px solid $cellBorder;
}

.table-row-odd-background {
    background-color: v-bind(shadeColor);
}

.table-default-background,
.table-row-even-background,
.table-header-background {
    background-color: v-bind(tintColor);
}

.sortable-ghost {
    color: transparent !important;
    background-color: v-bind(neutralColor) !important;
}

.disabled-overlay {
    background-color: transparent !important;
}
</style>