<template>
    <div>
        <span class="tw-space-x-0.5">
            <Button
                :disabled="pagination.current_page === 1 || pending || pagination.total === 0"
                @click="firstPage.handler()"
                :variant="'outline'"
                :size="buttonSize"
                :icon="'ic:sharp-first-page'"
                :label="firstPage.label" />
            <Button
                :disabled="pagination.current_page === 1 || pending || pagination.total === 0"
                @click="previousPage.handler()"
                :variant="'outline'"
                :size="buttonSize"
                :icon="'ic:sharp-keyboard-double-arrow-left'"
                :label="previousPage.label" />
            <Button
                :disabled="pagination.current_page === pagination.total_pages || pending || pagination.total === 0"
                @click="nextPage.handler()"
                :variant="'outline'"
                :size="buttonSize"
                :icon="'ic:sharp-keyboard-double-arrow-right'"
                :label="nextPage.label" />
            <Button
                :disabled="pagination.current_page === pagination.total_pages || pending || pagination.total === 0"
                @click="lastPage.handler()"
                :variant="'outline'"
                :size="buttonSize"
                :icon="'ic:sharp-last-page'"
                :label="lastPage.label" />
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
        type: Object,
        default: function () {
            return {
                label: '',
                handler: ()=>{}
            }
        }
    },

    previousPage: {
        type: Object,
        default: function () {
            return {
                label: '',
                handler: ()=>{}
            }
        }
    },

    nextPage: {
        type: Object,
        default: function () {
            return {
                label: '',
                handler: ()=>{}
            }
        }
    },

    lastPage: {
        type: Object,
        default: function () {
            return {
                label: '',
                handler: ()=>{}
            }
        }
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