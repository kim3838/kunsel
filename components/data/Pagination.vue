<template>
    <div>
        <div class="tw-space-x-0.5">
            <Button
                :disabled="pagination.current_page === 1 || pending || pagination.total === 0"
                @click="firstPageHandler()"
                :variant="'outline'"
                :size="buttonSize"
                :icon="'ic:sharp-first-page'"
                :label="firstPage.label" />
            <Button
                :disabled="pagination.current_page === 1 || pending || pagination.total === 0"
                @click="previousPageHandler()"
                :variant="'outline'"
                :size="buttonSize"
                :icon="'ic:sharp-keyboard-double-arrow-left'"
                :label="previousPage.label" />
            <Button
                :disabled="pagination.current_page === pagination.total_pages || pending || pagination.total === 0"
                @click="nextPageHandler()"
                :variant="'outline'"
                :size="buttonSize"
                :icon="'ic:sharp-keyboard-double-arrow-right'"
                :label="nextPage.label" />
            <Button
                :disabled="pagination.current_page === pagination.total_pages || pending || pagination.total === 0"
                @click="lastPageHandler()"
                :variant="'outline'"
                :size="buttonSize"
                :icon="'ic:sharp-last-page'"
                :label="lastPage.label" />
            <SingleSelect
                class="tw-absolute tw-inline-block"
                :size="selectSize"
                :searchable="false"
                :value-persist="true"
                :width="'150px'"
                :icon="'mdi:book-open-page-variant'"
                :label="'Per Page'"
                :options="perPage"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';

const props = defineProps({

    modelValue: {
        type: Object,
        default: function () {
            return {
                page: 1,
                perPage: 10
            }
        }
    },

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
                label: 'First Page'
            }
        }
    },

    previousPage: {
        type: Object,
        default: function () {
            return {
                label: ''
            }
        }
    },

    nextPage: {
        type: Object,
        default: function () {
            return {
                label: ''
            }
        }
    },

    lastPage: {
        type: Object,
        default: function () {
            return {
                label: ''
            }
        }
    }
});

const buttonSize = computed(() => {
    return {
        'sm': '2xs',
        'md': 'xs',
        'lg': 'sm',
        'xl': 'md',
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

const emit = defineEmits(["update:modelValue"]);

let perPage = reactive({
    search: '',
    data: [
        {text : '10 per page', value: 10},
        {text : '25 per page', value: 25},
        {text : '100 per page', value: 100},
    ],
    selection: [
        {text : '10 per page', value: 10},
        {text : '25 per page', value: 25},
        {text : '100 per page', value: 100},
    ],
    selected: props.modelValue?.perPage
});

watch(() => {
    return perPage.selected;
}, (newPerPage) => {
    emit("update:modelValue", {
        'key': 'perPage',
        'value': newPerPage
    });
});

function firstPageHandler(){
    emit("update:modelValue", {
        'key': 'page',
        'value': 1
    });
}

function previousPageHandler(){
    let previousPage = props.modelValue.page - 1;

    emit("update:modelValue", {
        'key': 'page',
        'value': previousPage
    });
}

function nextPageHandler(){
    let nextPage = props.modelValue.page + 1;

    emit("update:modelValue", {
        'key': 'page',
        'value': nextPage
    });
}

function lastPageHandler(){
    emit("update:modelValue", {
        'key': 'page',
        'value': props.pagination.total_pages
    });
}
</script>