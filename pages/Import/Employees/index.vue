<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div class="col-span-3">
                            <InputWithIcon :icon="'ic:baseline-file-present'" type="file" />
                        </div>
                    </div>
                    <div class="space-x-1">
                        <NuxtLink :to="`${baseURL}/api/employee-import-template`">
                            <Button class="inline-block" :icon="'ic:baseline-download'" :size="'sm'" :disabled="disableActions" :label="'CSV Template'"/>
                        </NuxtLink>
                        <Button class="inline-block" :icon="'ic:baseline-upload'" :size="'sm'" :disabled="disableActions" :label="uploadLabel"  @click="upload"/>
                        <Button class="inline-block" :icon="'ic:baseline-save'" :size="'sm'" :disabled="disableActions" :label="saveLabel"  @click="save"/>
                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT, TableRowT} from "@/public/js/types/data";
import {storeToRefs} from "pinia";

definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {baseURL} = useRuntimeConfig().public;

const pending = ref(false);

const uploadLabel = computed(() => {
    return "Upload";
})
const saveLabel = computed(() => {
    return "Save selected";
})

const disableActions = computed(() => {
    return pending.value;
});

const downloadTemplate = async () => {

    await laraBlobFetch(
        '/api/employee-import-template',
        'employee-import-template',
        'text/csv;charset=utf-8;',
        {
            onRequest: () => {},
            onResponse: () => {},
            onRequestError: () => {},
            onSuccessResponse: () => {},
        }
    );
}
const upload = () => {}
const save = () => {}
</script>

<style scoped>

</style>