<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div class="tw-m-2 tw-p-2 tw-border tw-border-light">
                    <div class="tw-space-y-2">
                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <FormInputLabel :size="'md'" value="Search" />
                                <FormInput :size="'md'" ref="locationInput" readonly v-model="filters.search.keyword" class="tw-w-full" placeholder="Search something" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <FormInputLabel :size="'md'" value="_" class="tw-text-transparent" />
                                <Button @click="filters.search.keyword += '.';" :size="'md'"><span class="tw-font-semibold">Concat "."</span></Button>
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <FormInputLabel :size="'md'" value="Code" />
                                <FormInput :size="'md'" readonly v-model="filters.code" class="tw-w-full" placeholder="Search something" type="text" autocomplete="off" />
                            </div>
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <FormInputLabel :size="'md'" value="_" class="tw-text-transparent" />
                                <Button @click="filters.code += '.';" :size="'md'"><span class="tw-font-semibold">Concat "."</span></Button>
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <FormInputLabel :size="'md'" value="Date and Time" />
                                <FormInput id="bootstrapDateTimePicker" readonly v-model="filters.datetime" :size="'md'" class="tw-w-full" type="text" />
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <Button ref="submitButton" @click="execute" :disabled="pending" :size="'md'"><span class="tw-font-semibold">Refresh</span></Button>
                            </div>
                        </div>

                        <div class="tw-border tw-border-neutral-200">
                            <pre class="tw-text-sm">{{ jsonResponse }}</pre>
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<style>

</style>

<script setup lang="ts">
import {ref, reactive, watch, nextTick} from 'vue';
const {$coreStore, $moment} = useNuxtApp();

definePageMeta({
    layout: false,
    middleware: 'auth'
});

let jsonResponse = ref({});
let locationInput = ref(null);
let submitButton = ref(null);

let filters = reactive({
    search: {
        keyword: 'Search...',
        callback: 1
    },
    code: 'PRTY',
    datetime: $moment().format('YYYY-MM-DD HH:mm:ss')
});

let filtersComputed = computed(() => {
    return {
        search: filters.search.keyword,
        code: filters.code,
        datetime: filters.datetime
    };
});

const {pending, execute} = csrFetch("/api/v1/request", {
    method: 'GET',
    params: {
        filters: filtersComputed
    },
    onResponse({request, response, options}) {
        if(response._data.code >= 500 && response._data.code < 600){
            $coreStore.setServiceError({
                prompt: true,
                icon: 'ic:sharp-error-outline',
                title: 'Something Went Wrong',
                payload: response._data
            });
            jsonResponse.value = "Something Went Wrong.";
        } else {
            jsonResponse.value = response._data;
        }
    }
});

watch(pending, async (newPending, oldPending) => {
    if(!newPending){
        await nextTick();
        submitButton.value.$refs.button.focus();
    } else {
        jsonResponse.value = "Fetching data...";
    }
});

watch(()=>{
    return filters.code;
}, () => {execute();});

watch(() => {
    return filters.search.keyword;
}, (keyword) => {
    clearTimeout(filters.search.callback);

    filters.search.callback = setTimeout(()=>{
        execute();
    }, 1500);
});

dateTimePicker();

</script>