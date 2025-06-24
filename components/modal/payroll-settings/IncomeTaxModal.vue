<template>
    <DialogModal
        :max-width="'410px'"
        :show="creatingOrEditing"
        :closeable="false"
    >
        <template #title>
            {{title}}
        </template>
        <template #content>
            <div>
                <table class="w-full border-separate border-spacing-2">
                    <tbody>
                    <tr>
                        <td><InputLabel :size="'md'" value="Name" /></td>
                        <td><Input v-model="incomeTaxName" placeholder="Enter income tax" type="text" /></td>
                    </tr>
                    <tr>
                        <td><InputLabel :size="'md'" value="Type" /></td>
                        <td>
                            <SingleSelect
                                :searchable="false"
                                drop-shadow
                                :selection-max-viewable-line="4"
                                :size="'md'"
                                :label="'Select Income Tax Type'"
                                :options="incomeTaxTypeSingleSelect"/>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <RadioGroup
                                :selections="assignable.selection"
                                v-model="assignable.selected" />
                        </td>
                    </tr>
                    <tr>
                        <td><InputLabel :size="'md'" value="Formula" /></td>
                        <td>
                            <SingleSelect
                                :searchable="false"
                                drop-shadow
                                :selection-max-viewable-line="6"
                                :size="'md'"
                                :label="'Select Income Tax Formula'"
                                :options="incomeTaxFormulaOptions"
                                @value-change="incomeTaxFormulaSettingsExecute"/>
                        </td>
                    </tr>
                    <tr v-if="!_isEmpty(incomeTaxFormulaSettings)">
                        <td><InputLabel :size="'md'" value="Formula settings" /></td>
                        <td class="text-sm font-sub-data">
                            <table class="border-separate">
                                <tbody>
                                <tr v-for="(setting, key) in incomeTaxFormulaSettings">
                                    <td>{{ setting.label }}</td><td class="pl-1">{{ setting.readable }}</td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </template>
        <template #footer>
            <div class="flex space-x-2 justify-between">
                <div class="space-x-2 inline-flex">
                    <div class="space-x-2 inline-flex items-center">
                        <UnorderedList
                            v-if="disableActions"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                    </div>
                </div>
                <div class="space-x-2 inline-flex items-center">
                    <Button :disabled="disableActions" @click="submit" :label="actionLabel" />
                    <Button :variant="'outline'" :icon="'mdi:cancel'" :disabled="disableActions" @click="closeModal" :label="'Cancel'" />
                </div>
            </div>
        </template>
    </DialogModal>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {CompanyFormulaT} from "public/js/types/company-component";
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);

const props = defineProps({
    creatingOrEditing: {
        type: Boolean,
        default: false,
    },
    editPayload: {
        type: Object,
        default: () => {
            return {};
        }
    }
});

const emit = defineEmits(['update:creatingOrEditing', 'update:editPayload','resolved']);

const incomeTaxSelection = ref([]);

await laraUseFetch("/api/enum-selections/income_tax", {
    lazy: false,
    method: 'GET',
}, {
    onSuccessResponse: async (request, options, response) => {
        incomeTaxSelection.value = _get(response, '_data.values.data', []);
    }
}, true);

const incomeTaxTypeSingleSelect = reactive({
    search: '',
    data: incomeTaxSelection.value,
    selection: incomeTaxSelection.value,
    selected: null
});

const incomeTaxName = ref('');

const assignable = reactive({
    selection: [
        {text : 'Assignable', value: 1},
        {text : 'Global', value: 0},
    ],
    selected: 1
});

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value){
        incomeTaxFormulaExecute();
    }
})

const incomeTaxFormulaOptions = reactive({
    search: '',
    data: [],
    selection: [],
    selected: null
})

const incomeTaxFormulaPending = ref(false)
const incomeTaxFormulaExecute = async () => {
    incomeTaxFormulaPending.value = true;

    await laraFetch("/api/company-formula-selections", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompany.value,
                'formulable_type': FORMULABLE.INCOME_TAX
            }
        }
    }, {
        onRequestError: () => {
            incomeTaxFormulaPending.value = false;
        },
        onResponse: () => {
            incomeTaxFormulaPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            const selection = _get(response, '_data.values.selection', []);
            incomeTaxFormulaOptions.data = selection
            incomeTaxFormulaOptions.selection = selection;
        }
    });
}
await incomeTaxFormulaExecute();

const incomeTaxFormulaSettings = ref<CompanyFormulaT[]>([]);
const incomeTaxFormulaSettingsPending = ref(false)
const incomeTaxFormulaSettingsExecute = async (companyFormulaId: null | number | string = '') => {

    if (_isNull(companyFormulaId)) return;
    incomeTaxFormulaSettingsPending.value = true;

    await laraFetch(`/api/company-formula/${companyFormulaId}`, {
        method: 'GET',
    }, {
        onRequestError: () => {
            incomeTaxFormulaSettingsPending.value = false;
        },
        onResponse: () => {
            incomeTaxFormulaSettingsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            incomeTaxFormulaSettings.value = _get(response, '_data.values.company_formula.settings', []);
        }
    });
}

const form = computed(() => {
    return {
        'company_id': selectedAssociatedCompany.value,
        'name': incomeTaxName.value,
        'assignable': assignable.selected,
        'type': incomeTaxTypeSingleSelect.selected,
        'company_formula_id': incomeTaxFormulaOptions.selected,
    }
});

watch(() => props.editPayload, (editPayload) => {

    if(Boolean(props.editPayload.id)){

        incomeTaxName.value = _get(editPayload, 'name', '');
        assignable.selected = Number(_get(editPayload, 'assignable', true));
        incomeTaxTypeSingleSelect.selected = _get(editPayload, 'type.value', null);
        incomeTaxFormulaOptions.selected = _get(editPayload, 'company_formula_id', null);
    }

})

const closeModal = () => {
    emit('update:creatingOrEditing', false);
    emit('update:editPayload', {});
    reset();
};

const disableActions = computed(() => {
    return submitPending.value || incomeTaxFormulaSettingsPending.value || incomeTaxFormulaPending.value;
});
const actionLabel = computed(() => {
    return Boolean(props.editPayload.id) ? 'Update' : 'Create';
});
const submitAction = computed(() => {
    return Boolean(props.editPayload.id) ? 'PATCH' : 'POST';
});
const submitPath = computed(() => {
    return Boolean(props.editPayload.id) ? `/api/income-tax/${props.editPayload.id}` : `/api/income-tax`;
});
const title = computed(() => {
    return Boolean(props.editPayload.id) ? 'Edit income tax' : 'Create income tax';
});

const submitPending = ref(false);
const reset = () => {
    incomeTaxName.value = '';
    assignable.selected = 1;
    incomeTaxTypeSingleSelect.selected = null;
    incomeTaxFormulaOptions.selected = null;

    incomeTaxFormulaSettings.value = [];
}
const submit = async() => {
    submitPending.value = true;

    await laraFetch(submitPath.value, {
        method: submitAction.value,
        body: form.value,
    }, {
        onRequestError: () => {
            submitPending.value = false;
        },
        onResponse: () => {
            submitPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            reset();
            emit('resolved');
        },
    });
}
</script>

<style scoped>

</style>