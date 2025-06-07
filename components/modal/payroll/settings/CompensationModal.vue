<template>
    <DialogModal
        :max-width="'410px'"
        :show="creatingOrEditing"
        :closeable="false"
    >
        <template #title>
            Create compensation
        </template>
        <template #content>
            <div>
                <table class="w-full border-separate border-spacing-2">
                    <tbody>
                    <tr>
                        <td><InputLabel :size="'md'" value="Name" /></td>
                        <td><Input v-model="compensationName" placeholder="Enter compensation name" type="text" /></td>
                    </tr>
                    <tr>
                        <td><InputLabel :size="'md'" value="Type" /></td>
                        <td>
                            <SingleSelect
                                :searchable="false"
                                drop-shadow
                                :selection-max-viewable-line="4"
                                :size="'md'"
                                :label="'Select Compensation Type'"
                                :options="compensationTypeSingleSelect"/>
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
                                :label="'Select Compensation Formula'"
                                :options="compensationFormulaOptions"
                                @value-change="compensationFormulaSettingsExecute"/>
                        </td>
                    </tr>
                    <tr v-if="!_isEmpty(compensationFormulaSettings)">
                        <td><InputLabel :size="'md'" value="Formula settings" /></td>
                        <td class="text-sm font-sub-data">
                            <table class="border-separate">
                                <tbody>
                                <tr v-for="(setting, key) in compensationFormulaSettings">
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
                    <Button :disabled="disableActions" @click="closeModal" :label="'Cancel'" />
                </div>
            </div>
        </template>
    </DialogModal>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {CompanyFormulaT} from "@/public/js/types/company-component";
const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
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

const compensationSelection = ref([]);

await laraUseFetch("/api/enum/selections/compensation", {
    lazy: false,
    method: 'GET',
}, {
    onSuccessResponse: async (request, options, response) => {
        compensationSelection.value = _get(response, '_data.values.data', []);
    }
}, true);

const compensationTypeSingleSelect = reactive({
    search: '',
    data: compensationSelection.value,
    selection: compensationSelection.value,
    selected: null
});

const compensationName = ref('');

const assignable = reactive({
    selection: [
        {text : 'Assignable', value: 1},
        {text : 'Global', value: 0},
    ],
    selected: 1
});

watch(selectedAssociatedCompany, (newValue) => {
    if(isAuthenticated.value){
        compensationFormulaExecute();
    }
})

const compensationFormulaOptions = reactive({
    search: '',
    data: [],
    selection: [],
    selected: null
})

const compensationFormulaPending = ref(false)
const compensationFormulaExecute = async () => {
    compensationFormulaPending.value = true;

    await laraFetch("/api/company-formula-selections", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompany.value,
                'formulable_type': FORMULABLE.EARNINGS
            }
        }
    }, {
        onRequestError: () => {
            compensationFormulaPending.value = false;
        },
        onResponse: () => {
            compensationFormulaPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            const selection = _get(response, '_data.values.selection', []);
            compensationFormulaOptions.data = selection
            compensationFormulaOptions.selection = selection;
        }
    });
}
await compensationFormulaExecute();

const compensationFormulaSettings = ref<CompanyFormulaT[]>([]);
const compensationFormulaSettingsPending = ref(false)
const compensationFormulaSettingsExecute = async (companyFormulaId: null | number | string = '') => {

    if (_isNull(companyFormulaId)) return;
    compensationFormulaSettingsPending.value = true;

    await laraFetch(`/api/company-formula/${companyFormulaId}`, {
        method: 'GET',
    }, {
        onRequestError: () => {
            compensationFormulaSettingsPending.value = false;
        },
        onResponse: () => {
            compensationFormulaSettingsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            compensationFormulaSettings.value = _get(response, '_data.values.company_formula.settings', []);
        }
    });
}

const form = computed(() => {
    return {
        'company_id': selectedAssociatedCompany.value,
        'name': compensationName.value,
        'assignable': assignable.selected,
        'type': compensationTypeSingleSelect.selected,
        'company_formula_id': compensationFormulaOptions.selected,
    }
});

watch(() => props.editPayload, (editPayload) => {

    if(Boolean(props.editPayload.id)){

        compensationName.value = _get(editPayload, 'name', '');
        assignable.selected = Number(_get(editPayload, 'assignable', true));
        compensationTypeSingleSelect.selected = _get(editPayload, 'type.value', null);
        compensationFormulaOptions.selected = _get(editPayload, 'company_formula_id', null);
    }

})

const closeModal = () => {
    emit('update:creatingOrEditing', false);
    emit('update:editPayload', {});
    reset();
};

const disableActions = computed(() => {
    return submitPending.value || compensationFormulaSettingsPending.value || compensationFormulaPending.value;
});
const actionLabel = computed(() => {
    return Boolean(props.editPayload.id) ? 'Update' : 'Create';
});
const submitAction = computed(() => {
    return Boolean(props.editPayload.id) ? 'PATCH' : 'POST';
});
const submitPath = computed(() => {
    return Boolean(props.editPayload.id) ? `/api/compensation/${props.editPayload.id}` : `/api/compensation`;
});

const submitPending = ref(false);
const reset = () => {
    compensationName.value = '';
    assignable.selected = 1;
    compensationTypeSingleSelect.selected = null;
    compensationFormulaOptions.selected = null;

    compensationFormulaSettings.value = [];
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