<template>
    <div class="space-x-0.5 flex w-max">
        <Button
            type="button"
            :disabled="pagination.current_page === 1 || pending || pagination.total === 0"
            @click="firstPageHandler()"
            :variant="'outline'"
            :size="buttonSize"
            :icon="'ic:sharp-first-page'"
            :label="firstPage.label" />
        <Button
            type="button"
            :disabled="pagination.current_page === 1 || pending || pagination.total === 0"
            @click="previousPageHandler()"
            :variant="'outline'"
            :size="buttonSize"
            :icon="'ic:baseline-arrow-left'"
            :label="previousPage.label" />
        <Button
            type="button"
            :disabled="pagination.current_page === pagination.total_pages || pending || pagination.total === 0"
            @click="nextPageHandler()"
            :variant="'outline'"
            :size="buttonSize"
            :icon="'ic:baseline-arrow-right'"
            :label="nextPage.label" />
        <Button
            type="button"
            :disabled="pagination.current_page === pagination.total_pages || pending || pagination.total === 0"
            @click="lastPageHandler()"
            :variant="'outline'"
            :size="buttonSize"
            :icon="'ic:sharp-last-page'"
            :label="lastPage.label" />
        <div>
            <SingleSelect
                drop-shadow
                :disabled="pending"
                :size="selectSize"
                :searchable="false"
                :value-persist="true"
                :selection-float="false"
                :width="perPageSelectWidth"
                :icon="'gis:layer'"
                :label="'Per Page'"
                :options="perPage"/>
        </div>
    </div>
</template>

<script setup lang="ts">
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
                label: ''
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

const perPageSelectWidth = computed(() => {
    return {
        'sm': '80px',
        'md': '90px',
        'lg': '110px',
        'xl': '140px',
    }[props.size]
});

const emit = defineEmits(["update:modelValue"]);

let perPage = reactive({
    search: '',
    selection: [
        {text : '5', value: 5},
        {text : '10', value: 10},
        {text : '15', value: 15},
        {text : '25', value: 25},
        {text : '50', value: 50},
        {text : '100', value: 100},
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