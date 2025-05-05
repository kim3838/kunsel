<template>
    <div>
        <div class="font-medium text-lg font-header">
            Employee Compensations
        </div>
        <div class="space-x-1">
            <Button class="inline-block" :size="'sm'" :label="'Create'"/>
            <Button class="inline-block" :size="'sm'" :label="'Delete selected'"/>
        </div>
        <div>
            <DataTable
                :headers="companyCompensationsHeaders"
                :size="'lg'"
                :rows="companyCompensationsData"
                v-model="selectedCompanyCompensations"
                manual-sortable
                @manualSorted="manualSorted"
                selection>
                <template v-slot:cell.type="{cell,slot}">
                    <div class="p-[3px]">{{cell.type.label}}</div>
                </template>
                <template v-slot:cell.assignable="{cell, slot, scrollReference}">
                    <div class="flex justify-center">
                        <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.assignable" ></NonModelCheckBox>
                    </div>
                </template>
                <template v-slot:cell.global="{cell, slot, scrollReference}">
                    <div class="flex justify-center">
                        <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="!cell.assignable" ></NonModelCheckBox>
                    </div>
                </template>
                <template v-slot:cell.actions="{cell, slot, scrollReference}">
                    <Button class="mx-0.5" type="button" :size="slot.buttonSize" :label="'Edit'"></Button>
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import dataPayload from '@/public/data/payload.js';

const companyCompensationsHeaders = reactive([
    { text: 'Order', value: 'order', alignData: 'center'},
    { text: 'Name', value: 'name'},
    { text: 'Type', value: 'type'},
    { text: 'Assignable', value: 'assignable'},
    { text: 'Global', value: 'global'},
    { text: 'Formula', value: 'formula'},
    { text: 'Date from', value: 'start_date'},
    { text: 'Date to', value: 'end_date'},
    { text: '', alignData: 'left', value: 'actions'},
]);

const companyCompensationsData = ref(dataPayload['companyCompensations']);
const selectedCompanyCompensations = ref([]);

function manualSorted(oldIndex, newIndex, row){
    useNuxtApp().$orderSequenceable(companyCompensationsData.value);
}
</script>

<style scoped>

</style>