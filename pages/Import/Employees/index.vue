<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div class="col-span-3">
                            <InputWithIcon ref="fileToImport" :size="'md'" class="mt-2" :icon="'ic:baseline-file-open'" type="file" />
                        </div>
                    </div>
                    <div class="space-x-1">
                        <NuxtLink :to="`${baseURL}/api/employee-import-template`">
                            <Button class="inline-block" :icon="'ic:baseline-download'" :size="'sm'" :disabled="disableActions" :label="'CSV Template'"/>
                        </NuxtLink>
                        <Button class="inline-block" :icon="'ic:baseline-upload'" :size="'sm'" :disabled="disableActions" :label="uploadLabel"  @click="upload"/>
                    </div>

                    <UnorderedList
                        v-if="disableActions"
                        :icon="'eos-icons:loading'"
                        :size="'md'"
                        :label="'Please wait...'"/>

                    <div v-if="hasValidationError" class="pt-4 space-y-2">
                        <div class="font-header">
                            <p class="font-medium text-lg">Errors</p>
                        </div>
                        <DataTable
                            :headers="validationErrorHeaders"
                            :size="'lg'"
                            :rows="validationErrorsData"
                            :disabled="disableActions"
                            :selection="false">
                            <template v-slot:cell.column="{cell, slot, scrollReference}">
                                <div class="p-[3px]">
                                    {{cell.attribute}}
                                </div>
                            </template>
                            <template v-slot:cell.errors="{cell, slot, scrollReference}">
                                <div class="p-[3px]">
                                    <UnorderedList v-for="error in cell.errors" :key="error" :label="error" />
                                </div>
                            </template>
                            <template v-slot:cell.values="{cell, slot, scrollReference}">
                                <div class="p-[3px]">
                                    {{cell.values[cell.attribute]}}
                                </div>
                            </template>
                        </DataTable>
                    </div>

                    <div v-if="importSuccessful" class="pt-4 space-y-2">
                        <div class="font-header">
                            <p class="font-medium text-lg">Successfully imported {{importedEmployeesCount}} employee records</p>
                        </div>
                        <DataTable
                            :headers="importedEmployeeHeaders"
                            :size="'lg'"
                            :rows="importedEmployeesData"
                            :disabled="disableActions"
                            :selection="false">
                        </DataTable>
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
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const coreStore = useCoreStore();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);

const pending = ref(false);
const fileToImport = ref(null);

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

const validationErrorHeaders = reactive<TableHeaderT[]>([
    { text: 'Row', value: 'row', alignData: 'left'},
    { text: 'Column', value: 'column', alignData: 'left'},
    { text: 'Value', value: 'values', alignData: 'left'},
    { text: 'Errors', value: 'errors', alignData: 'left'},
]);

const validationErrorsData = ref([]);
const hasValidationError = computed(() => {
    return validationErrorsData.value.length > 0;
});

const importedEmployeeHeaders = reactive<TableHeaderT[]>([
    { text: 'Number', value: 'number', alignData: 'left'},
    { text: 'Family name', value: 'family_name', alignData: 'left'},
    { text: 'Given name', value: 'given_name', alignData: 'left'}
]);
const importedEmployeesData = ref([]);
const importSuccessful = computed(() => {
    return importedEmployeesCount.value > 0;
});
const importedEmployeesCount = computed(() => {
    return importedEmployeesData.value.length;
})

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value){
        validationErrorsData.value = [];
        importedEmployeesData.value = [];
    }
})

const upload = async () => {

    let file = fileToImport.value.$refs.input.files[0];

    if (file) {
        pending.value = true;
        validationErrorsData.value = [];
        importedEmployeesData.value = [];

        const formData = new FormData();
        formData.append('file', file);
        formData.append('company_id', selectedAssociatedCompany.value);

        await laraFetch("/api/employee-pre-import", {
            method: 'POST',
            body: formData,
        },{
            onRequestError: (request, options, error) => {
                pending.value = false;

                coreStore.setServiceError({
                    prompt: true,
                    icon: 'mdi:information-variant-circle-outline',
                    title: 'Request failed',
                    payload: {
                        message: 'Re-attach the file if its edited.'
                    }
                });

                setTimeout(() => {

                }, 10);
            },
            onResponse: () => {
                pending.value = false;
            },
            onUnprocessableContentResponse: async (request, options, response) => {
                validationErrorsData.value = _get(response, '_data.errors', []);

                coreStore.setServiceError({
                    prompt: true,
                    icon: 'mdi:information-variant-circle-outline',
                    title: 'Request failed',
                    payload: {
                        message: _get(response, '_data.message', 'Validation failed.')
                    }
                });
            },
            onSuccessResponse: async (request, options, response) => {
                importedEmployeesData.value = _get(response, '_data.values.employees', []);
            }
        }, true);


    } else {
        coreStore.setServiceError({
            prompt: true,
            icon: 'mdi:information-variant-circle-outline',
            title: 'Request failed',
            payload: {
                message: 'File not found.'
            }
        });
    }
}
</script>

<style scoped>

</style>