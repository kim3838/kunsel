<template>
    <div id="table-division">
        <table class="tw-border-collapse">
            <thead>
                <tr>
                    <td v-for="header in headers" :key="header.value" v-text="header.text"></td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows" :key="row.id" >
                    <td v-for="header in headers" :key="row.id" v-text="row[header.value]"></td>
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
});
</script>

<style scoped>

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

table{
    white-space: nowrap;
}

thead{
    border-bottom: 0;
    border-left: 1px solid rgba(212, 212, 212, 1);
    border-right: 1px solid rgba(212, 212, 212, 1);
    border-top: 1px solid rgba(212, 212, 212, 1);
}

thead tr td{
    border-bottom: 0;
    border-left: 0;
    border-right: 1px solid rgba(212, 212, 212, 1);
    border-top: 1px solid rgba(212, 212, 212, 1);
}

tbody{
    border-bottom: 1px solid rgba(212, 212, 212, 1);
    border-left: 1px solid rgba(212, 212, 212, 1);
    border-right: 0;
    border-top: 1px solid rgba(212, 212, 212, 1);
}

tbody tr td{
    border-bottom: 0;
    border-left: 0;
    border-right: 1px solid rgba(212, 212, 212, 1);
    border-top: 1px solid rgba(212, 212, 212, 1);
}

tbody tr:nth-of-type(2n+1){
    background-color: rgba(229, 229, 229, 0.5);
}
</style>