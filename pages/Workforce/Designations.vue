<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="space-y-2 p-[20px]">
                    <div class="space-x-1">
                        <Button class="inline-block" :icon="'mdi:plus'" :size="'sm'" :label="'Create'" :disabled="disableActions" @click=""/>
                    </div>
                </div>

                <FansyFrame>
                    <template v-slot:content>
                        <UnorderedList
                            v-if="disableActions"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                        <DataTable
                            :headers="designationsHeaders"
                            :size="'lg'"
                            :rows="designationsData"
                            :disabled="disableDataTable"
                            v-model="selectedDesignations"
                            selection>
                        </DataTable>
                    </template>
                </FansyFrame>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT} from "@/public/js/types/data";

definePageMeta({middleware: ['auth', 'company-admin']});
useLayout().setNavigationMode('solid', 'designations.vue');

const designationsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'view'},
    { text: 'Department', value: 'department', alignData: 'left'},
    { text: 'Name', value: 'name', alignData: 'left'},
]);

const designationsData = ref([]);
const designationsPending = ref(false);
const selectedDesignations = ref([]);

const disableActions = computed(() => {
    return designationsPending.value;
});
const disableDataTable = computed(() => {
    return designationsPending.value;
})
</script>

<style scoped>

</style>