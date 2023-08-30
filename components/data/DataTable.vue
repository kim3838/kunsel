<template>
    <div id="table-division">
        <table class="tw-border-collapse">
            <thead>
                <tr>
                    <td v-if="selection" style="padding:3px 0.5rem;">
                        <Checkbox :checked="headerCheckStatus()" @click="toggleCheck()" :size="'md'" />
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
                    <td v-if="selection" style="padding:3px 0.5rem;">
                        <Checkbox :size="'md'" :checked="isRowSelected(row)" @click="checkRow(row)"/>
                    </td>
                    <td
                        v-for="(header, index) in headers" :key="row.id"
                        :class="[bodyFontClass, cellAlignClass(header?.alignData)]">
                        <slot
                            :name="`cell.${header.value}`"
                            :slot="{buttonSize: buttonSize, inputSize: inputSize}"
                            :cell="row"
                            :index="index">
                            <div class="tw-p-[3px]">{{row[header.value]}}</div>
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';

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
    selection: Boolean
});

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
    return _difference(currentRowIds.value, props.modelValue).length <= 0;
}

function headerCheckStatus(): string{
    return checkedAllCurrentSelection();
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
        'lg': 'tw-font-semibold tw-text-lg',
        'xl': 'tw-font-semibold tw-text-xl',
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
        [null]: '',
        'sm': '2xs',
        'md': 'xs',
        'lg': 'sm',
        'xl': 'md',
    }[props.size]
});

const inputSize = computed(() => {
    return {
        [null]: '',
        'sm': '2xs',
        'md': 'xs',
        'lg': 'sm',
        'xl': 'md',
    }[props.size]
});

</script>

<style lang="scss" scoped>

#table-division{
    overflow-x: auto;
    scrollbar-color: rgba(0, 0, 0, 0.12) rgb(243 244 246);
    scrollbar-width: thin;
}

#table-division::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

/* Track */
#table-division::-webkit-scrollbar-track {
    background: rgb(243 244 246);
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.12);
}

/* Handle */
#table-division::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.12);
}

/* Handle on hover */
#table-division::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.22);
}

$tableBorder: #b4b4b4;
$cellBorder: rgba(212, 212, 212, 1);

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
    background-color: rgba(229, 229, 229, 0.4);
}
</style>