<template>
    <div>
        <span class="tw-space-x-0.5">
            <Button
                :disabled="pagination.current_page === 1 || pending || pagination.total === 0"
                @click="firstPage()"
                :variant="'outline'"
                :size="buttonSize"
                :icon="'ic:sharp-first-page'"
                :label="'First Page'" />
            <Button
                :disabled="pagination.current_page === 1 || pending || pagination.total === 0"
                @click="previousPage()"
                :variant="'outline'"
                :size="buttonSize"
                :icon="'ic:sharp-keyboard-double-arrow-left'"
                :label="'Previous Page'" />
            <Button
                :disabled="pagination.current_page === pagination.total_pages || pending || pagination.total === 0"
                @click="nextPage()"
                :variant="'outline'"
                :size="buttonSize"
                :icon="'ic:sharp-keyboard-double-arrow-right'"
                :label="'Next Page'" />
            <Button
                :disabled="pagination.current_page === pagination.total_pages || pending || pagination.total === 0"
                @click="lastPage()"
                :variant="'outline'"
                :size="buttonSize"
                :icon="'ic:sharp-last-page'"
                :label="'Last Page'" />
        </span>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';

const props = defineProps({
    pagination: {
        type: Object,
        default: function () {
            return {
                total: 0,
                count: 0,
                per_page: 0,
                current_page: 0,
                total_pages: 0
            }
        }
    },

    pending: Boolean,

    size: {
        type: String,
        default: 'md',
    },

    firstPage: {
        type: Function,
        default: ()=>{}
    },

    previousPage: {
        type: Function,
        default: ()=>{}
    },

    nextPage: {
        type: Function,
        default: ()=>{}
    },

    lastPage: {
        type: Function,
        default: ()=>{}
    }
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
</script>