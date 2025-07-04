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
                            :headers="departmentsHeaders"
                            :size="'lg'"
                            :rows="departmentsData"
                            :disabled="disableDataTable"
                            v-model="selectedDepartments"
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
useLayout().setNavigationMode('solid', 'Departments.vue');

const departmentsHeaders = reactive<TableHeaderT[]>([
    { text: '#', value: 'row_number'},
    { text: '', value: 'view'},
    { text: 'Name', value: 'name', alignData: 'left'},
    { text: 'Head', value: 'head'},
]);

const departmentsData = ref([]);
const departmentsPending = ref(false);
const selectedDepartments = ref([]);

const disableActions = computed(() => {
    return departmentsPending.value;
});
const disableDataTable = computed(() => {
    return departmentsPending.value;
})
</script>

<style scoped>

</style>