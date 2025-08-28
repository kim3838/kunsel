<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl p-[20px] space-y-4">

                <RadioGroup
                    :selections="formulableSelection"
                    :size="'md'"
                    :orientation="'horizontal'"
                    :radio-key="`formulable_type`"
                    v-model="formulableSelected" />

                <fieldset v-if="formulableSelected == FORMULABLE.EARNINGS" class="neutral-border px-2 pb-2 space-y-4">
                    <legend class="text-lg font-medium font-header">Earnings</legend>

                    <DataTable
                        :headers="formulaSettingsHeaders"
                        :size="'lg'"
                        :rows="earningsFormulaSettings"
                        selection
                        :stripped="false"
                        :sub-row-slug="'sub_row'"
                        :sub-row-settings="{
                            type: DATATABLE_SUBROW_TYPE.TITLED,
                            containerPaddingTop: 1.00,
                            containerPaddingBottom: 2.75,
                            titleSize: 'md',
                            rowVerticalLine: true,
                            verticalBorderType: 'dashed',
                            horizontalBorderType: 'dashed',
                        }">
                        <template v-slot:cell.formulable_type="{cell,slot}">
                            <div class="p-[3px]">{{cell.formulable_type.text}}</div>
                        </template>
                        <template v-slot:cell.formulable_component_type="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell._payload.label_shade.value" shade :label="_get(cell, 'formulable_component_type.text', 'Not Specified')" />
                            </div>
                        </template>
                        <template v-slot:cell.formula_is_interpolation="{cell, slot, scrollReference}">
                            <div class="flex justify-center">
                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.formula_is_interpolation" ></NonModelCheckBox>
                            </div>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="mdi:info-variant" :class="[slot.iconSizeClass]" /><div :class="[slot.titleSizeClass]">Settings Information</div>
                            </div>
                            <component v-if="cell.formula_name == 'Standard-Overtime'" :is="StandardOvertimeSettings" :settings="cell.sub_row.settings" />
                            <component v-else-if="cell.formula_name == 'Standard-Salary'" :is="StandardSalarySettings" :settings="cell.sub_row.settings" />
                            <component v-else :is="FormulaSettingsCaster" :settings="cell.sub_row.settings" />
                        </template>
                    </DataTable>
                </fieldset>

                <fieldset v-if="formulableSelected == FORMULABLE.DEDUCTIONS" class="neutral-border px-2 pb-2 space-y-4">
                    <legend class="text-lg font-medium font-header">Deductions</legend>

                    <DataTable
                        :headers="formulaSettingsHeaders"
                        :size="'lg'"
                        :rows="deductionsFormulaSettings"
                        selection
                        :stripped="false"
                        :sub-row-slug="'sub_row'"
                        :sub-row-settings="{
                            type: DATATABLE_SUBROW_TYPE.TITLED,
                            containerPaddingTop: 1.00,
                            containerPaddingBottom: 2.75,
                            titleSize: 'md',
                            rowVerticalLine: true,
                            verticalBorderType: 'dashed',
                            horizontalBorderType: 'dashed',
                        }">
                        <template v-slot:cell.formulable_type="{cell,slot}">
                            <div class="p-[3px]">{{cell.formulable_type.text}}</div>
                        </template>
                        <template v-slot:cell.formulable_component_type="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell._payload.label_shade.value" shade :label="_get(cell, 'formulable_component_type.text', 'Not Specified')" />
                            </div>
                        </template>
                        <template v-slot:cell.formula_is_interpolation="{cell, slot, scrollReference}">
                            <div class="flex justify-center">
                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.formula_is_interpolation" ></NonModelCheckBox>
                            </div>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="mdi:info-variant" :class="[slot.iconSizeClass]" /><div :class="[slot.titleSizeClass]">Settings Information</div>
                            </div>
                            <component :is="FormulaSettingsCaster" :settings="cell.sub_row.settings" />
                        </template>
                    </DataTable>
                </fieldset>

                <fieldset v-if="formulableSelected == FORMULABLE.INCOME_TAX" class="neutral-border px-2 pb-2 space-y-4">
                    <legend class="text-lg font-medium font-header">Income Tax</legend>

                    <DataTable
                        :headers="formulaSettingsHeaders"
                        :size="'lg'"
                        :rows="taxFormulaSettings"
                        selection
                        :stripped="false"
                        :sub-row-slug="'sub_row'"
                        :sub-row-settings="{
                            type: DATATABLE_SUBROW_TYPE.TITLED,
                            containerPaddingTop: 1.00,
                            containerPaddingBottom: 2.75,
                            titleSize: 'md',
                            rowVerticalLine: true,
                            verticalBorderType: 'dashed',
                            horizontalBorderType: 'dashed',
                        }">
                        <template v-slot:cell.formulable_type="{cell,slot}">
                            <div class="p-[3px]">{{cell.formulable_type.text}}</div>
                        </template>
                        <template v-slot:cell.formulable_component_type="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell._payload.label_shade.value" shade :label="_get(cell, 'formulable_component_type.text', 'Not Specified')" />
                            </div>
                        </template>
                        <template v-slot:cell.formula_is_interpolation="{cell, slot, scrollReference}">
                            <div class="flex justify-center">
                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.formula_is_interpolation" ></NonModelCheckBox>
                            </div>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="mdi:info-variant" :class="[slot.iconSizeClass]" /><div :class="[slot.titleSizeClass]">Settings Information</div>
                            </div>
                            <component :is="FormulaSettingsCaster" :settings="cell.sub_row.settings" />
                        </template>
                    </DataTable>
                </fieldset>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TableHeaderT} from "@/public/js/types/data";
import type {CompanyFormulaSetting} from "@/public/js/types/formula";

definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid', 'FormulaSettings.vue');

const StandardOvertimeSettings = resolveComponent('StandardOvertimeSettings');
const StandardSalarySettings = resolveComponent('StandardSalarySettings');
const FormulaSettingsCaster = resolveComponent('FormulaSettingsCaster');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        formulaSettingsExecute();
    }
});

const formulaSettingsHeaders = reactive<TableHeaderT[]>([
    { text: 'Type', value: 'formulable_type', alignData: 'left'},
    { text: 'Component', value: 'formulable_component_type', alignData: 'left'},
    { text: 'Formula', value: 'formula_name'},
]);

const formulableSelected = ref(FORMULABLE.EARNINGS);
const formulableSelection = reactive([
    {text : FORMULABLE_NAME[FORMULABLE.EARNINGS], value: FORMULABLE.EARNINGS},
    {text : FORMULABLE_NAME[FORMULABLE.DEDUCTIONS], value: FORMULABLE.DEDUCTIONS},
    {text : FORMULABLE_NAME[FORMULABLE.INCOME_TAX], value: FORMULABLE.INCOME_TAX},
]);

const formulaSettingsData = ref<CompanyFormulaSetting[]>([]);
const earningsFormulaSettings = ref<CompanyFormulaSetting[]>([]);
const deductionsFormulaSettings = ref<CompanyFormulaSetting[]>([]);
const taxFormulaSettings = ref<CompanyFormulaSetting[]>([]);
const formulaSettingsPending = ref(false)

const formulaSettingsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    formulaSettingsPending.value = true;

    await laraFetch(`/api/company-formulas`, {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
                'formula_interpolation': [0]
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

            earningsFormulaSettings.value = _filter(formulaSettingsData.value, (item: CompanyFormulaSetting) => {
                return _includes([FORMULABLE.EARNINGS], item.formulable_type.value);
            }).map((item: CompanyFormulaSetting) => {

                let shadeValue = _some([
                    COMPENSATION.BASIC_SALARY,
                    COMPENSATION.OVERTIME,
                    COMPENSATION.BENEFIT,
                    COMPENSATION.REGULAR_ALLOWANCE
                ],value => value == item.formulable_component_type?.value) ? 'success' : 'default'

                return {
                    ...item,
                    _payload: {
                        'label_shade': {
                            'cell': ['formulable_type', 'formulable_component_type'],
                            'value': shadeValue
                        }
                    }
                };
            });

            deductionsFormulaSettings.value = _filter(formulaSettingsData.value, (item: CompanyFormulaSetting) => {
                return _includes([FORMULABLE.DEDUCTIONS], item.formulable_type.value);
            }).map((item: CompanyFormulaSetting) => {

                let shadeValue = {
                    [DEDUCTION.DEDUCTION]: 'danger',
                    [DEDUCTION.CONTRIBUTION]: 'warning',
                }[item.formulable_component_type?.value] || 'default';

                return {
                    ...item,
                    _payload: {
                        'label_shade': {
                            'cell': ['formulable_type', 'formulable_component_type'],
                            'value': shadeValue
                        }
                    }
                };
            });

            taxFormulaSettings.value = _filter(formulaSettingsData.value, (item: CompanyFormulaSetting) => {
                return _includes([FORMULABLE.INCOME_TAX], item.formulable_type.value);
            }).map((item: CompanyFormulaSetting) => {

                let shadeValue = {
                    [INCOME_TAX.COMPENSATION_TAX]: 'caution',
                }[item.formulable_component_type?.value] || 'default';

                return {
                    ...item,
                    _payload: {
                        'label_shade': {
                            'cell': ['formulable_type', 'formulable_component_type'],
                            'value': shadeValue
                        }
                    }
                };
            });
        }
    });
}
await formulaSettingsExecute();
</script>

<style scoped>

</style>