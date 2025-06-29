<template>
    <div id="table-division" ref="dataTableScroll">
        <!-- Disabled Layer -->
        <div v-if="disabled" class="absolute disabled-overlay opacity-25 z-30"></div>

        <table ref="tableReference" class="border-collapse font-data">
            <thead>
                <tr>
                    <td v-if="selection" style="padding:3px 0.5rem;">
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
                        :style="{'min-width': header.width}"
                        style="padding:0.25rem;"
                        :class="[
                            headerFontClass,
                            cellAlignClass(header?.alignHeader),
                        ]">
                        <span>{{header.text}}</span>
                    </td>
                </tr>
            </thead>
            <tbody ref="tableBody">
                <!-- Table cell height: sm = 25px, md = 29px, lg = 33px, xl = 37px -->
                <tr v-for="(row, rowIndex) in rows" :key="row.id">
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
                        :class="[bodyFontClass, cellAlignClass(header?.alignData)]">
                        <slot
                            :name="`cell.${header.value}`"
                            :scrollReference="dataTableScroll"
                            :slot="{buttonSize: buttonSize, inputSize: inputSize, datepickerFontSize: datepickerFontSize, selectSize: selectSize, checkBoxSize: checkBoxSize}"
                            :cell="row"
                            :headerIndex="headerIndex"
                            :rowIndex="rowIndex">
                            <div class="p-[3px]">{{row[header.value]}}</div>
                        </slot>
                    </td>
                </tr>
                <tr v-if="!rows.length">
                    <td colspan="100%" class="text-center font-semibold" :class="[bodyFontClass]">
                        {{noDataLabel}}
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
import type {TableHeaderT, TableRowT} from "@/public/js/types/data";
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    secondary: secondaryColor,
    neutral: neutralColor,
    lining: liningColor,
    thread: threadColor,
    shade: shadeColor,
    tint: tintColor,
} = storeToRefs($themeStore);

const liningColor70 = computed(() => {
    return liningColor.value + hexAlpha.value['70'];
});

const liningColor10 = computed(() => {
    return liningColor.value + hexAlpha.value['10'];
});

const props = defineProps({
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
    manualSortable: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    }
});

const dataTableScroll = ref(null);

const emit = defineEmits(["update:modelValue", "manualSorted"]);

const dataTableReference = useTemplateRef('dataTableScroll');
const tableReference = useTemplateRef('tableReference');
const { width: dataTableReferenceWidth, height: dataTableReferenceHeight } = useElementSize(dataTableReference)
const { width: tableReferenceWidth, height: tableReferenceHeight } = useElementSize(tableReference)

const dataTableReferenceWidthComputed = computed(() => {
    let width = dataTableReferenceWidth.value > tableReferenceWidth.value ? tableReferenceWidth.value : dataTableReferenceWidth.value;

    return width + 'px';
})
const dataTableReferenceHeightComputed = computed(() => {

    let height = dataTableReferenceHeight.value > tableReferenceHeight.value ? tableReferenceHeight.value : dataTableReferenceHeight.value;

    return height + 'px';
});
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
})

function cellAlignClass(align: 'left' | 'center' | 'right' | undefined = undefined){

    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };

    return alignmentClasses[align as keyof typeof alignmentClasses] ?? 'text-left';
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
    } else {
        props.modelValue.push(row.id);
    }
}

function toggleCheck(){
    if (checkedAllCurrentSelection()){
        let clearedCurrentRows = _remove(props.modelValue, function(id) {
            let inCurrentRowIds = currentRowIds.value.indexOf(id as string | number) >= 0;
            return !inCurrentRowIds;
        });

        emit('update:modelValue', clearedCurrentRows);
    } else {
        let merged = _uniq(props.modelValue.concat(currentRowIds.value));

        emit('update:modelValue', merged);
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

const inputSize = computed(() => {
    return {
        'sm': '2xs',
        'md': 'xs',
        'lg': 'sm',
        'xl': 'md',
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

</script>

<style lang="scss" scoped>

#table-division{
    overflow-y: hidden;
}

$tableBorder: v-bind(liningColor);
$cellBorder: v-bind(liningColor70);

table{
    white-space: nowrap;
    border: 1px solid $tableBorder;
}

thead tr td:not(:last-child){
    border-bottom: 0;
    border-left: 0;
    border-right: 1px solid $cellBorder;
    border-top: 0;
}

tbody tr td:not(:last-child){
    border-bottom: 0;
    border-left: 0;
    border-right: 1px solid $cellBorder;
    border-top: 1px solid $cellBorder;
}

tbody tr td:last-child{
    border-bottom: 0;
    border-left: 0;
    border-right: 0;
    border-top: 1px solid $cellBorder;
}

tbody tr:nth-of-type(2n+1){
    background-color: v-bind(shadeColor);
}

tbody tr:not(:nth-of-type(2n+1)),
thead{
    background-color: v-bind(tintColor);
}

.sortable-ghost {
    color: transparent !important;
    background-color: v-bind(neutralColor) !important;
}

.disabled-overlay {
    background-color: v-bind(secondaryColor) !important;
    height: v-bind(dataTableReferenceHeightComputed);
    width: v-bind(dataTableReferenceWidthComputed);
}
</style>