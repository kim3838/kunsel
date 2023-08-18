<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div class="tw-m-2 tw-p-2 tw-border tw-border-light">
                    <div class="tw-space-y-2">
                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <FormInputLabel :size="'md'" value="Search" />
                                <FormInput :size="'md'" ref="locationInput" v-model="search" class="tw-w-full" placeholder="Enter username" type="text" autocomplete="off" />
                            </div>
                        </div>

                        <div class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-5 xl:tw-grid-cols-6 2xl:tw-grid-cols-8">
                            <div class="tw-block tw-border tw-border-neutral-200">
                                <Button ref="submitButton" @click="refresh" :disabled="pending" :size="'md'"><span class="tw-font-semibold">Refresh</span></Button>
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
import {ref, watch, nextTick} from 'vue';
const {$coreStore} = useNuxtApp();

definePageMeta({
    layout: false,
    middleware: 'auth'
});

let search = ref('Search...');
let searchCallback = ref(1);
let jsonResponse = ref({});
let locationInput = ref(null);
let submitButton = ref(null);

const {pending, refresh} = csrFetch("/api/v1/request", {
    method: 'GET',
    params: {
        filters: {
            search: search,
            date: '2022-07'
        }
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

watch(search, (searchInput) => {
    clearTimeout(searchCallback.value);
    searchCallback.value = setTimeout(function(){
        refresh();
    }, 1500);
});

dateTimePicker();

</script>