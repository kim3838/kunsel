<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <DialogModal
                    :max-width="'1240px'"
                    :show="resolvedFormulaModal"
                    :closeable="false">
                    <template #title>
                        {{resolvedFormulaModalTitle}}
                    </template>
                    <template #content>

                        <div class="mt-4 space-y-2">

                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="font-header">Formula</legend>

                                <table class="border-separate font-data">
                                    <tbody>
                                    <tr><td class="font-semibold">Name</td><td class="pl-2">{{ _get(resolvedFormula, 'name', null) }}</td></tr>
                                    <tr><td class="font-semibold">Formulable Type</td><td class="pl-2">{{ _get(resolvedFormula, 'formulable_type.text', null) }}</td></tr>
                                    <tr><td class="font-semibold">Component Type</td><td class="pl-2">{{ _get(resolvedFormula, 'component_type.text', null) }}</td></tr>
                                    <tr><td class="font-semibold">Aggregation</td><td class="pl-2"><NonModelCheckBox disabled :checked="_get(resolvedFormula, 'aggregation', false)"></NonModelCheckBox></td></tr>
                                    </tbody>
                                </table>
                            </fieldset>

                            <fieldset class="neutral-border px-2 pb-2 space-y-2">
                                <legend class="font-header">Default Settings</legend>

                                <FormulaSettingsCaster :description-whitespace="'pre-line'" :settings="_get(resolvedFormula, 'default_settings', null)" />
                            </fieldset>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div class="space-x-2 inline-flex items-center">
                                <Button :icon="'ic:sharp-keyboard-arrow-left'" @click="navigateTo({path: `/admin/formulas`, replace: true});" :label="'Back to formulas'" />
                                <Button v-if="!creatingFormula" @click="resetResolved" :label="'Close'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/admin/formulas`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <div v-if="!formulaSuccessful" class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="formulaMessage" />
                    </div>
                </div>

                <form v-if="formulaSuccessful" @submit.prevent="formSubmit" class="px-[20px] space-y-2">

                    <fieldset class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-header">Formula Information</legend>

                        <div class="grid gap-2 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            <div class="sm:col-span-2">
                                <InputLabel :size="'sm'" value="Name"/>
                                <Input :size="'md'" v-model="formulaName" :disabled="disableActions" type="text"/>
                            </div>
                            <div class="hidden sm:block lg:hidden"></div>
                            <div>
                                <InputLabel :size="'sm'" value="Formulable Type"/>
                                <SingleSelect :icon="'ri:formula'" drop-shadow :size="'md'" :disabled="disableActions" :options="formulableOptions"/>
                            </div>
                            <div v-if="selectedFormulableOptionsIsEarnings">
                                <InputLabel :size="'sm'" value="Component Type"/>
                                <SingleSelect drop-shadow :size="'md'" :disabled="disableActions" :options="earningComponentOptions"/>
                            </div>
                            <div v-else-if="selectedFormulableOptionsIsDeductions">
                                <InputLabel :size="'sm'" value="Component Type"/>
                                <SingleSelect drop-shadow :size="'md'" :disabled="disableActions" :options="deductionComponentOptions"/>
                            </div>
                            <div v-else-if="selectedFormulableOptionsIsIncomeTax">
                                <InputLabel :size="'sm'" value="Component Type"/>
                                <SingleSelect drop-shadow :size="'md'" :disabled="disableActions" :options="incomeTaxComponentOptions"/>
                            </div>
                            <div class="flex flex-col">
                                <div class="flex-none h-[1.25rem]"></div>
                                <div class="grow">
                                    <div class="h-full w-min scaffold-border flex items-center">
                                        <label>
                                            <Checkbox
                                                class="px-[0.3rem] "
                                                :disabled="disableActions"
                                                name="aggregation"
                                                v-model="aggregation"
                                                :size="'md'"
                                                :label="'Aggregation'" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-header">Formula Settings</legend>

                        <Button :type="'button'" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:delete-outline'" :label="'Clear settings'" @click="formulaSettings = null"></Button>

                        <FormulaSettingsCaster :description-whitespace="'pre-line'" :settings="formulaSettings" />
                    </fieldset>

                    <fieldset class="neutral-border px-2 pb-2 space-y-2">
                        <legend class="text-lg font-header">Replace Formula Settings by Json Preset</legend>

                        <div class="grid gap-2 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            <div class="sm:col-span-2">
                                <SingleSelectPaginated
                                    :icon="'qlementine-icons:preset-16'"
                                    :disabled="disableActions"
                                    drop-shadow
                                    :size="'md'"
                                    :label="'Select Json Preset'"
                                    :payload="jsonPresetOptions"
                                    @valueChange="selectedJsonPresetChanged"
                                />
                            </div>
                            <div class="flex items-center min-h-8">
                                <UnorderedList
                                    v-if="jsonPresetPending"
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Please wait...'"/>
                            </div>
                        </div>

                        <FormulaSettingsCaster :description-whitespace="'pre-line'" :settings="jsonPresetData" />
                    </fieldset>

                    <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="submitLabel"></Button>
                </form>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {SelectDataType} from "@/public/js/types/form";
import type {StringEnumInterface} from "@/public/js/common/type";

useHead({titleTemplate: (titleChunk) => {return `Formulas`}});
definePageMeta({middleware: ['auth', 'super-admin']});
useLayout().setNavigationMode('solid');

const route = useRoute();
const formula = ref(null);
const formulaSuccessful = ref(true);
const formulaMessage = ref('');
const creatingFormula = computed(() => {
    return route.params.id === 'create-formula';
});
const formulaName = ref<string | null>('');
const aggregation = ref<boolean | null>(false);
const formulaSettings = ref<any[] | null>([]);
const nuxtApp = useNuxtApp();
const $enumerableOption = nuxtApp.$enumerableOption as (enumerable: StringEnumInterface, value: number) => {
    text: string,
    value: number
};

const formulableOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.EARNINGS as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.DEDUCTIONS as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.TAXABLE_INCOME as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.NON_TAXABLE_INCOME as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.INCOME_TAX as number),
        $enumerableOption(FORMULABLE_NAME, FORMULABLE.NET_INCOME as number),
    ],
    selected: null
});
const selectedFormulableOptionsIsEarnings = computed(() => {
    return formulableOptions.selected == FORMULABLE.EARNINGS;
});
const selectedFormulableOptionsIsDeductions = computed(() => {
    return formulableOptions.selected == FORMULABLE.DEDUCTIONS;
});
const selectedFormulableOptionsIsIncomeTax = computed(() => {
    return formulableOptions.selected == FORMULABLE.INCOME_TAX;
});
const earningComponentOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(COMPENSATION_NAME, COMPENSATION.BASIC_PAY as number),
        $enumerableOption(COMPENSATION_NAME, COMPENSATION.OVERTIME as number),
        $enumerableOption(COMPENSATION_NAME, COMPENSATION.STATUTORY_BENEFIT as number),
        $enumerableOption(COMPENSATION_NAME, COMPENSATION.REGULAR_ALLOWANCE as number),
        $enumerableOption(COMPENSATION_NAME, COMPENSATION.LEAVE_PAY as number),
        $enumerableOption(COMPENSATION_NAME, COMPENSATION.HOLIDAY_PAY as number),
    ],
    selected: null
});
const deductionComponentOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(DEDUCTION_NAME, DEDUCTION.DEDUCTION as number),
        $enumerableOption(DEDUCTION_NAME, DEDUCTION.STATUTORY_CONTRIBUTION as number),
    ],
    selected: null
});
const incomeTaxComponentOptions = reactive({
    search: '',
    selection: [
        $enumerableOption(INCOME_TAX_NAME, INCOME_TAX.COMPENSATION_TAX as number),
    ],
    selected: null
});

const jsonPresetPending = ref(false);
const jsonPresetData = ref([]);
const jsonPresetOptions = reactive({
    fetch: {
        url: '/api/model-selections/json_preset',
        filters: {
            search: {
                keyword: '',
                callback: 1
            }
        }
    },
    selected: null,
});

const selectedJsonPresetChanged = async (selectedJsonPreset: SelectDataType) => {
    jsonPresetData.value = [];

    if(selectedJsonPreset == null){
        return;
    }

    jsonPresetPending.value = true;

    await laraFetch(`/api/json-preset/${selectedJsonPreset.value}`, {
        method: 'GET',
    }, {
        onRequestError: () => {
            jsonPresetPending.value = false;
        },
        onResponse: () => {
            jsonPresetPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            jsonPresetData.value = _get(response, '_data.values.json_preset.json_value', []);
        },
    });
}

//Fetch Formula Information
const fetchFormula = async () => {
    if(import.meta.server || route.params.id === 'create-formula'){return;}

    await laraFetch(`/api/formula/${route.params.id}`, {
        method: 'GET',
    }, {
        onResponse: (request, options, response) => {
            formulaSuccessful.value = _get(response, '_data.successful', false);
            formulaMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            formula.value = _get(response, '_data.values.formula', null);
            formulaName.value = _get(response, '_data.values.formula.name', null);
            aggregation.value = _get(response, '_data.values.formula.aggregation', false);
            formulaSettings.value = _get(response, '_data.values.formula.default_settings', []);
            formulableOptions.selected = _get(response, '_data.values.formula.formulable_type', null);

            if(selectedFormulableOptionsIsEarnings.value){
                earningComponentOptions.selected = _get(response, '_data.values.formula.component_type', null);
            } else if (selectedFormulableOptionsIsDeductions){
                deductionComponentOptions.selected = _get(response, '_data.values.formula.component_type', null);
            } else if (selectedFormulableOptionsIsIncomeTax){
                incomeTaxComponentOptions.selected = _get(response, '_data.values.formula.component_type', null);
            }
        },
    }, false);
};

await fetchFormula();

const formPending = ref(false);
const disableActions = computed(() => {
    return formPending.value || jsonPresetPending.value;
});

const submitLabel = computed(() => {
    return formPending.value ? 'Please wait' : (!creatingFormula.value ? 'Save' : 'Submit');
});
const submitAction = computed(() => {
    return !creatingFormula.value ? 'PATCH' : 'POST';
});
const submitPath = computed(() => {
    return !creatingFormula.value ? `/api/formula/${formula.value.id}` : `/api/formula`;
});
const formBody = computed(() => {

    let defaultSettings = jsonPresetData.value.length > 0 ? jsonPresetData.value : formulaSettings.value;

    let formTemp: {
        name: string | null,
        formulable_type: number | null,
        component_type?: number | null,
        aggregation: boolean | null,
        default_settings: any[] | null,
    } = {
        name: formulaName.value,
        formulable_type: formulableOptions.selected,
        aggregation: aggregation.value,
        default_settings: defaultSettings,
    };

    if(selectedFormulableOptionsIsEarnings.value){
        formTemp['component_type'] = earningComponentOptions.selected;
    } else if (selectedFormulableOptionsIsDeductions.value){
        formTemp['component_type'] = deductionComponentOptions.selected;
    } else if (selectedFormulableOptionsIsIncomeTax.value){
        formTemp['component_type'] = incomeTaxComponentOptions.selected;
    } else {
        formTemp['component_type'] = null;
    }

    return formTemp;
});

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
            resolvedFormula.value = _get(response, '_data.values.formula', null);
            resolvedFormulaModal.value = true;
        },
    });
}

const resolvedFormulaModal = ref(false);
const resolvedFormula = ref<{} | null>({});
const resolvedFormulaModalTitle = computed(() => {
    return `Formula ${creatingFormula.value ? 'Created' : 'Updated'}`;
})
const resetResolved = () => {
    resolvedFormulaModal.value = false;
    resolvedFormula.value = {};
}
</script>

<style scoped>

</style>