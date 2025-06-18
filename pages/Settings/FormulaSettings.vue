<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <FansyFrame>
                    <template v-slot:content>
                        <DataTable
                            :headers="formulaSettingsHeaders"
                            :size="'lg'"
                            :rows="formulaSettingsData"
                            selection>
                            <template v-slot:cell.formulable_type="{cell,slot}">
                                <div class="p-[3px]">{{cell.formulable_type.text}}</div>
                            </template>
                            <template v-slot:cell.formulable_component_type="{cell,slot}">
                                <div class="p-[3px]">{{_get(cell, 'formulable_component_type.text', null)}}</div>
                            </template>
                            <template v-slot:cell.formula_is_interpolation="{cell, slot, scrollReference}">
                                <div class="flex justify-center">
                                    <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.formula_is_interpolation" ></NonModelCheckBox>
                                </div>
                            </template>
                            <template v-slot:cell.settings="{cell}">
                                <table class="border-separate text-sm font-sub-data">
                                    <tbody>
                                    <tr v-for="(setting, key) in cell.settings">
                                        <td>{{ setting.label }}</td><td class="pl-1">{{ setting.readable }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </template>
                        </DataTable>
                    </template>
                </FansyFrame>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TableHeaderT} from "@/public/js/types/data";

definePageMeta({middleware: ['auth', 'company-admin']});
useLayout().setNavigationMode('solid', 'FormulaSettings.vue');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value){
        formulaSettingsExecute();
    }
});

const formulaSettingsHeaders = reactive<TableHeaderT[]>([
    { text: 'Type', value: 'formulable_type', alignData: 'left'},
    { text: 'Component', value: 'formulable_component_type', alignData: 'left'},
    { text: 'Formula', value: 'formula_name'},
    { text: 'Settings', value: 'settings'},
]);

const formulaSettingsData = ref([]);
const formulaSettingsPending = ref(false)

const formulaSettingsExecute = async() =>{

    if(!selectedAssociatedCompany.value){
        return;
    }

    formulaSettingsPending.value = true;

    await laraFetch(`/api/company-formulas`, {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompany.value
            }
        }
    }, {
        onRequestError: () => {
            formulaSettingsPending.value = false;
        },
        onResponse: () => {
            formulaSettingsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            formulaSettingsData.value = _get(response, '_data.values.formula_settings', []);
        }
    }, false);
}
await formulaSettingsExecute();
</script>

<style scoped>

</style>