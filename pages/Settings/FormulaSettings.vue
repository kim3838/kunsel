<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl p-[20px]">
                <DataTable
                    :headers="formulaSettingsHeaders"
                    :size="'lg'"
                    :rows="formulaSettingsData"
                    selection
                    :sub-row-slug="'settings'"
                    :sub-row-settings="{
                        type: DATATABLE_SUBROW_TYPE.TITLED,
                        containerPaddingTop: 0.25,
                        containerPaddingBottom: 0.75,
                        titleSize: 'md',
                        rowVerticalLine: true,
                        verticalBorderType: 'dashed',
                        horizontalBorderType: 'dashed',
                    }">
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
                    <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                        <div class="inline-flex items-center scaffold-border pr-2">
                            <Icon name="mdi:info-variant" :class="[slot.iconSizeClass]" /><div :class="[slot.titleSizeClass]">Settings</div>
                        </div>
                        <component v-if="cell.formula_name == 'Standard-Overtime'" :is="StandardOvertimeSettings" :settings="cell.settings" />
                        <component v-else-if="cell.formula_name == 'Standard-Salary'" :is="StandardSalarySettings" :settings="cell.settings" />
                        <component v-else :is="FormulaSettingsSubrow" :settings="cell.settings" />
                    </template>
                </DataTable>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TableHeaderT} from "@/public/js/types/data";

definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid', 'FormulaSettings.vue');

const StandardOvertimeSettings = resolveComponent('StandardOvertimeSettings');
const StandardSalarySettings = resolveComponent('StandardSalarySettings');
const FormulaSettingsSubrow = resolveComponent('FormulaSettingsSubrow');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompany.value){
        formulaSettingsExecute();
    }
});

const formulaSettingsHeaders = reactive<TableHeaderT[]>([
    { text: 'Type', value: 'formulable_type', alignData: 'left'},
    { text: 'Component', value: 'formulable_component_type', alignData: 'left'},
    { text: 'Formula', value: 'formula_name'},
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