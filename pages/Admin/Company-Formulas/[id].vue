<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/admin/companies`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <DialogModal
                    :max-width="'440px'"
                    :show="addFormulaModal"
                    :closeable="false">
                    <template #title>
                    </template>
                    <template #content>

                        <div class="mt-4 space-y-2">

                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="text-lg font-header">Add Formula(s)</legend>

                                <MultiSelectPaginated
                                    ref="formulaMultiSelect"
                                    :icon="'ri:formula'"
                                    :disabled="disableActions"
                                    drop-shadow
                                    :size="'md'"
                                    :label="'Select Formula'"
                                    :payload="formulaOptions"
                                />
                            </fieldset>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div></div>
                            <div class="space-x-2 inline-flex items-center">
                                <Button :variant="'outline'" :icon="'mdi:cancel'" @click="addFormulaModal = false" :label="'Cancel'" />
                                <Button :icon="'mdi:plus'" @click="confirmAddUpdateFormula" :label="'Add/Update'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <DialogModal
                    :max-width="'1240px'"
                    :show="viewFormulaSettingsModal"
                    @close="viewFormulaSettingsModalClosed"
                    :closeable="true">
                    <template #title>
                    </template>
                    <template #content>

                        <div class="mt-4 space-y-2">

                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="text-lg font-header">Formula Settings</legend>

                                <FormulaSettingsCaster :description-whitespace="'pre-line'" :settings="_get(viewFormulaSettingsModalValue, 'sub_row.settings', null)" />
                            </fieldset>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div></div>
                            <div class="space-x-2 inline-flex items-center">
                                <Button :variant="'outline'" @click="closeFormulaSettingsModal" :label="'Close'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="px-[20px]">
                    <div class="mb-2 text-lg font-header">{{`${companyCode} ${companyName}`}}</div>

                    <div class="mb-2 flex gap-2 items-center min-h-8">
                        <UnorderedList
                            v-if="disableActions"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                        <Button v-else :variant="'outline'" class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : 'Add Formula(s)'" @click="addFormula"></Button>
                        <Button :variant="'outline'" class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:baseline-cloud-sync'" :label="submitLabel" @click="confirmFormSubmit"></Button>
                    </div>

                    <DataTable
                        :headers="formulaSettingsHeaders"
                        :disabled="disableActions"
                        :size="'lg'"
                        :rows="formulaSettingsData"
                        selection
                        :stripped="false">
                        <template v-slot:cell.actions="{cell,slot, headerIndex, rowIndex}">
                            <div class="h-full mx-0.5 space-x-0.5 w-full flex items-center">
                                <Button type="button" :variant="'outline'" :icon="'mdi:delete-forever'" :size="slot.buttonSize" @click="deleteRow(rowIndex)"/>
                                <Button type="button" :variant="'outline'" :icon="'ic:baseline-cloud-sync'" :size="slot.buttonSize" @click="cell.sub_row.settings = cell.default_settings"></Button>
                                <Button type="button" :variant="'outline'" :icon="'ri:formula'" :size="slot.buttonSize" @click="viewFormulaSettings(cell)"></Button>
                            </div>
                        </template>
                        <template v-slot:cell.formulable_type="{cell,slot}">
                            <div class="p-[3px]">{{cell.formulable_type.text}}</div>
                        </template>
                        <template v-slot:cell.formulable_component_type="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell._payload.label_shade.value" shade :label="_get(cell, 'formulable_component_type.text', 'Non-component')" />
                            </div>
                        </template>
                        <template v-slot:cell.formula_is_interpolation="{cell, slot, scrollReference}">
                            <div class="flex justify-center">
                                <NonModelCheckBox disabled :size="slot.checkBoxSize" :checked="cell.formula_is_interpolation" ></NonModelCheckBox>
                            </div>
                        </template>
                    </DataTable>

                    <div v-if="false">
                        formulaSettingsData: {{formulaSettingsData}}<br>
                    </div>
                </div>

            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {CompanyFormulaSetting} from "@/public/js/types/formula";
import type {TableHeaderT} from "@/public/js/types/data";
import type {MultiSelectPaginatedInstance} from "@/public/js/types/component-instance";

useLayout().setNavigationMode('solid');
const route = useRoute();
const company = ref(null);

const companyCode = ref('');
const companyName = ref('');

definePageMeta({
    middleware: ['auth', 'super-admin',
        async (to) => {

            if(import.meta.server || to.params.id === 'create-company'){return true;}

            const {data, error} = await laraUseFetch(`/api/company-check/${to.params.id}`, {method: 'GET',}, {}, false);

            if(_isEmpty(data.value) && !_isEmpty(error.value)){
                let responseCode = _get(error.value, 'data.code', null);

                throw createError({ statusCode: responseCode, statusMessage: useCoreStore().servicePayloadMessage, fatal: true});
            }
        }
    ]
});

//Fetch Company Information
const fetchCompany = async () => {
    if(route.params.id === 'create-company'){return;}

    await laraFetch(`/api/company/${route.params.id}`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            company.value = _get(response, '_data.values.company', null);
            companyCode.value = _get(response, '_data.values.company.code', '');
            companyName.value = _get(response, '_data.values.company.name', '');
        },
    });
};
await fetchCompany();

const formulaShade = (formulableType, componentType) => {
    let shadeValue = 'default';

    if(_includes([FORMULABLE.EARNINGS], formulableType)){
        shadeValue = {
            [COMPENSATION.BASIC_SALARY]: 'success',
            [COMPENSATION.OVERTIME]: 'success',
            [COMPENSATION.BENEFIT]: 'success',
            [COMPENSATION.REGULAR_ALLOWANCE]: 'success',
        }[componentType] || 'default';
    } else if(_includes([FORMULABLE.DEDUCTIONS], formulableType)) {
        shadeValue = {
            [DEDUCTION.DEDUCTION]: 'danger',
            [DEDUCTION.CONTRIBUTION]: 'warning',
        }[componentType] || 'default';
    } else if(_includes([FORMULABLE.INCOME_TAX], formulableType)) {
        shadeValue = {
            [INCOME_TAX.COMPENSATION_TAX]: 'caution',
        }[componentType] || 'default';
    }

    return shadeValue;
};

const formulaSettingsHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions'},
    { text: 'Formula', value: 'formula_name'},
    { text: 'Type', value: 'formulable_type', alignData: 'left'},
    { text: 'Component', value: 'formulable_component_type', alignData: 'left'},
    { text: 'Interpolation', value: 'formula_is_interpolation', alignData: 'left'},
]);
const formulaSettingsPending = ref(false)
const formulaSettingsData = ref<CompanyFormulaSetting[]>([]);
const formulaSettingsExecute = async() =>{

    if(import.meta.server){
        return;
    }

    formulaSettingsPending.value = true;

    await laraFetch(`/api/company-formulas`, {
        method: 'GET',
        params: {
            filters: {
                'company_ulid': route.params.id,
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
            let formulaSettings = _get(response, '_data.values.formula_settings', []);

            formulaSettingsData.value = formulaSettings.map((item: CompanyFormulaSetting) => {

                let shade = formulaShade(item.formulable_type.value, item.formulable_component_type?.value);

                return {
                    ...item,
                    _payload: {
                        'label_shade': {
                            'cell': ['formulable_type', 'formulable_component_type'],
                            'value': shade
                        }
                    }
                };
            });
        }
    });
}
await formulaSettingsExecute();

const formPending = ref(false);
const disableActions = computed(() => {
    return formulaSettingsPending.value || formPending.value || addFormulaPending.value
});

const submitLabel = computed(() => {
    return formPending.value ? 'Please wait' : 'Sync Formula(s)';
});
const submitAction = computed(() => {
    return 'POST';
});
const submitPath = computed(() => {
    return `/api/company-formula-assignment-sync/${company.value.id}`;
});
const formBody = computed(() => {
    const formulaAssignments = {};

    formulaSettingsData.value.forEach((formulaSetting: CompanyFormulaSetting) => {
        formulaAssignments[formulaSetting.formula_id] = {
            'settings': formulaSetting.sub_row.settings
        };
    });

    return formulaAssignments;
});

const confirmFormSubmit = () => {
    useNuxtApp().$promptStore.setPrompt({
        resetable: true,
        icon: null,
        title: 'Confirm formula sync?',
        message: null,
        action: {
            callback: async () => {
                await formSubmit();
            },
            label: 'Confirm'
        }
    });
};
const formSubmit = async() => {
    formPending.value = true;

    await laraFetch(submitPath.value, {
        method: submitAction.value,
        body: formBody.value,
    }, {
        onRequestError: () => {
            formPending.value = false;
        },
        onResponse: () => {
            formPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            await formulaSettingsExecute();
        },
    });
}

const formulaMultiSelectReference = useTemplateRef<MultiSelectPaginatedInstance>('formulaMultiSelect');
const formulaOptions = reactive({
    fetch: {
        url: '/api/formula-selections',
        filters: {
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: [],
});

const addFormulaPending = ref(false);
const confirmAddUpdateFormula = async () => {

    addFormulaModal.value = false;

    if(_isEmpty(formulaOptions.selected)){
        return;
    }

    addFormulaPending.value = true;

    await laraFetch(`/api/company-formula-assignment-sync-without-detaching/${company.value.id}`, {
        method: 'POST',
        body: {
            'formula_ulids': formulaOptions.selected
        },
    }, {
        onRequestError: () => {
            addFormulaPending.value = false;
        },
        onResponse: () => {
            addFormulaPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            formulaMultiSelectReference.value?.clearSelected();

            await formulaSettingsExecute();
        },
    });
};

const addFormulaModal = ref(false);

const addFormula = async () => {
    addFormulaModal.value = true;
}

const viewFormulaSettingsModal = ref(false);
const viewFormulaSettingsModalValue = ref(null);
const viewFormulaSettings = async (cell) => {
    viewFormulaSettingsModalValue.value = cell;
    viewFormulaSettingsModal.value = true;
}
const closeFormulaSettingsModal = () => {
    viewFormulaSettingsModal.value = false;
    viewFormulaSettingsModalValue.value = null
};
const viewFormulaSettingsModalClosed = () => {
    closeFormulaSettingsModal();
}
const deleteRow = async (rowIndex) => {
    formulaSettingsData.value.splice(rowIndex, 1);
}
</script>

<style scoped>

</style>