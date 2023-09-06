<template>
    <div>
        <div class="tw-text-sm">{{pageInformation}}</div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
const {$ordinal} = useNuxtApp();

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
    noRecordLabel: {
        type: String,
        default: 'No Record Found',
    },
});

const currentPage = computed(() => props.pagination.current_page);
const perPage = computed(() => props.pagination.per_page);
const totalPages = computed(() => props.pagination.total_pages);
const totalRow = computed(() => props.pagination.total);

const pageInfo = computed(() => {
    return "Page " + currentPage.value + " of " + totalPages.value;
});

const showingFirstRowOf = computed(() => {
    return ((currentPage.value > 1
        ? (((currentPage.value - 1) * perPage.value) + 1)
        : currentPage.value));
});

const showingLastRowOf = computed(() => {
    let totalIsGreaterOrEqualToPerPage = currentPage.value > 1
        ? (currentPage.value === totalPages.value ? (totalRow.value) : (currentPage.value * perPage.value))
        : (currentPage.value + perPage.value) - 1;

    return totalRow.value < perPage.value ? totalRow.value : totalIsGreaterOrEqualToPerPage;
});

const showing = computed(() => {
    return showingFirstRowOf.value == showingLastRowOf.value
        ? $ordinal(showingFirstRowOf.value) + " of " + totalRow.value
        : showingFirstRowOf.value + "-" + showingLastRowOf.value + " of " + totalRow.value;
});

const pageInformation = computed(() => {
    return totalRow.value == 0
        ? props.noRecordLabel
        : pageInfo.value + ", Showing " + showing.value + " Result" + (totalRow.value > 1 ? 's' : '');
});
</script>