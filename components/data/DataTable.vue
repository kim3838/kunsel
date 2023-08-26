<template>
    <div id="table-division">
        <table class="tw-border-collapse">
            <thead>
                <tr>
                    <td v-if="selection" style="padding:3px 0.45rem 3px 0.45rem;">
                        <Checkbox :size="'md'" />
                    </td>
                    <td
                        v-for="header in headers" :key="header.value"
                        :class="[headerFontClass, cellAlignClass(header?.alignHeader)]">
                        <span>{{header.text}}</span>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows" :key="row.id" >
                    <td v-if="selection" style="padding:3px 0.45rem 3px 0.45rem;">
                        <Checkbox :size="'md'" />
                    </td>
                    <td
                        v-for="(header, index) in headers" :key="row.id"
                        :class="[bodyFontClass, cellAlignClass(header?.alignData)]">
                        <slot
                            :name="`cell.${header.value}`"
                            :cell="row"
                            :index="index">
                            {{row[header.value]}}
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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

function cellAlignClass(align = null){
    return {
        [null]: 'tw-text-left',
        'left': 'tw-text-left',
        'center': 'tw-text-center',
        'right': 'tw-text-right',
    }[align];
}

const headerFontClass = computed(() => {
    return {
        'sm': 'tw-font-semibold tw-text-sm',
        'md': 'tw-font-semibold tw-text-base',
        'lg': 'tw-font-semibold tw-text-lg',
    }[props.size];
});

const bodyFontClass = computed(() => {
    return {
        'sm': 'tw-text-xs',
        'md': 'tw-text-sm',
        'lg': 'tw-text-base',
    }[props.size];
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
    padding: 4px 3px 3px 3px;
    border-bottom: 0;
    border-left: 0;
    border-right: 1px solid $cellBorder;
    border-top: 0;
}

tbody tr td:not(:last-child){
    padding: 4px 3px 3px 3px;
    border-bottom: 0;
    border-left: 0;
    border-right: 1px solid $cellBorder;
    border-top: 1px solid $cellBorder;
}

tbody tr td:last-child{
    padding: 3px;
    border-bottom: 0;
    border-left: 0;
    border-right: 0;
    border-top: 1px solid $cellBorder;
}

tbody tr:nth-of-type(2n+1){
    background-color: rgba(229, 229, 229, 0.4);
}
</style>