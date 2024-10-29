<template>
    <div id="table-division" ref="dataTableScroll">
        <table class="tw-border-collapse tw-font-data">
            <thead>
                <tr>
                    <td v-if="selection" style="padding:3px 0.5rem;">
                        <NonModelCheckBox :size="checkBoxSize" :checked="checkedAllCurrentSelection()" @click="toggleCheck()" />
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
            <tbody>
                <!-- Table cell height: sm = 25px, md = 29px, lg = 33px, xl = 37px -->
                <tr v-for="row in rows" :key="row.id">
                    <td v-if="selection" style="padding:0 0.5rem;">
                        <NonModelCheckBox
                            :size="checkBoxSize"
                            :value="row.id"
                            :selected="props.modelValue"
                            @click="checkRow(row)"/>
                    </td>
                    <td
                        v-for="(header, index) in headers" :key="row.id"
                        :class="[bodyFontClass, cellAlignClass(header?.alignData)]">
                        <slot
                            :name="`cell.${header.value}`"
                            :scrollReference="dataTableScroll"
                            :slot="{buttonSize: buttonSize, inputSize: inputSize, datepickerFontSize: datepickerFontSize, selectSize: selectSize}"
                            :cell="row"
                            :index="index">
                            <div class="tw-p-[3px]">{{row[header.value]}}</div>
                        </slot>
                    </td>
                </tr>
                <tr v-if="!rows.length">
                    <td colspan="100%" class="tw-text-center tw-font-semibold" :class="[bodyFontClass]">
                        {{noDataLabel}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    lining: liningColor,
    thread: threadColor,
    shade: shadeColor
} = storeToRefs($themeStore);

const liningColor70 = computed(() => {
    return liningColor.value + hexAlpha.value['70'];
});

const liningColor10 = computed(() => {
    return liningColor.value + hexAlpha.value['10'];
});

const props = defineProps({
    headers: {
        type: Array,
        default: () => [],
    },
    rows: {
        type: Array,
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
    }
});

let dataTableScroll = ref(null);

const emit = defineEmits(["update:modelValue"]);

function cellAlignClass(align = null){
    return {
        [null]: 'tw-text-left',
        'left': 'tw-text-left',
        'center': 'tw-text-center',
        'right': 'tw-text-right',
    }[align];
}

function checkedAllCurrentSelection(): boolean {
    let result = false;

    if(currentRowIds.value.length){
        result = _difference(currentRowIds.value, props.modelValue).length <= 0
    }

    return result;
}

function isRowSelected(row): boolean{
    return props.modelValue.indexOf(row.id) >= 0;
}

function checkRow(row: any): void{
    if(isRowSelected(row)){
        _remove(props.modelValue, (value) => value == row.id);
    } else {
        props.modelValue.push(row.id);
    }
}

function toggleCheck(){
    if (checkedAllCurrentSelection()){
        let clearedCurrentRows = _remove(props.modelValue, function(id) {
            let inCurrentRowIds = currentRowIds.value.indexOf(id) >= 0;
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
        'sm': 'tw-font-semibold tw-text-sm',
        'md': 'tw-font-semibold tw-text-base',
        'lg': 'tw-font-semibold tw-text-base',
        'xl': 'tw-font-semibold tw-text-base',
    }[props.size];
});

const bodyFontClass = computed(() => {
    return {
        'sm': 'tw-text-xs',
        'md': 'tw-text-sm',
        'lg': 'tw-text-base',
        'xl': 'tw-text-lg',
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
        'sm': 'tw-text-xs',
        'md': 'tw-text-sm',
        'lg': 'tw-text-sm',
        'xl': 'tw-text-lg',
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
</style>