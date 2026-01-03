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
                        <td><InputLabel :size="'md'" value="Type" /></td>
                        <td>
                            <SingleSelect
                                :searchable="false"
                                drop-shadow
                                :selection-max-viewable-line="4"
                                :size="'md'"
                                :label="'Select Deduction Type'"
                                :options="deductionTypeOptions"/>
                        </td>
                    </tr>
                    <tr>
                        <td><InputLabel :size="'md'" value="Code" /></td>
                        <td><Input v-model="deductionCode" type="text" /></td>
                    </tr>
                    <tr>
                        <td><InputLabel :size="'md'" value="Name" /></td>
                        <td><Input v-model="deductionName" type="text" /></td>
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
                                :options="deductionFormulaOptions"
                                @value-change=""/>
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
                    <Button :variant="'outline'" :icon="'mdi:cancel'" :disabled="disableActions" @click="closeModal" :label="'Cancel'" />
                    <Button :disabled="disableActions" :icon="actionIcon" @click="submit" :label="actionLabel" />
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
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
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

await laraUseFetch("/api/enum-selections/deduction", {
    lazy: false,
    method: 'GET',
}, {
    onSuccessResponse: async (request, options, response) => {
        compensationSelection.value = _get(response, '_data.values.data', []);
    }
}, true);

const deductionTypeOptions = reactive({
    search: '',
    data: compensationSelection.value,
    selection: compensationSelection.value,
    selected: null
});

const deductionCode = ref('');
const deductionName = ref('');

const assignable = reactive({
    selection: [
        {text : 'Assignable', value: 1}
    ],
    selected: 1
});

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        deductionFormulaExecute();
    }
})

const deductionFormulaOptions = reactive({
    search: '',
    selection: [],
    selected: null
})

const deductionFormulaPending = ref(false)
const deductionFormulaExecute = async () => {

    if(import.meta.server){return;}

    deductionFormulaPending.value = true;

    await laraFetch("/api/company-formula-selections", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
                'formulable_type': FORMULABLE.DEDUCTIONS
            }
        }
    }, {
        onRequestError: () => {
            deductionFormulaPending.value = false;
        },
        onResponse: () => {
            deductionFormulaPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            deductionFormulaOptions.selection = _get(response, '_data.values.selection', []);
        }
    });
}
await deductionFormulaExecute();

const deductionFormulaSettings = ref<CompanyFormulaT[]>([]);
const deductionFormulaSettingsPending = ref(false)
const deductionFormulaSettingsExecute = async (companyFormulaId: null | number | string = '') => {

    if (companyFormulaId == null) return;
    deductionFormulaSettingsPending.value = true;

    await laraFetch(`/api/company-formula/${companyFormulaId}`, {
        method: 'GET',
    }, {
        onRequestError: () => {
            deductionFormulaSettingsPending.value = false;
        },
        onResponse: () => {
            deductionFormulaSettingsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            deductionFormulaSettings.value = _get(response, '_data.values.company_formula.settings', []);
        }
    });
}

const form = computed(() => {
    return {
        'company_id': selectedAssociatedCompanyId.value,
        'code': deductionCode.value,
        'name': deductionName.value,
        'assignable': assignable.selected,
        'type': deductionTypeOptions.selected,
        'company_formula_id': deductionFormulaOptions.selected,
    }
});

watch(() => props.editPayload, (editPayload) => {

    if(Boolean(props.editPayload.id)){

        deductionCode.value = _get(editPayload, 'code', '');
        deductionName.value = _get(editPayload, 'name', '');
        assignable.selected = Number(_get(editPayload, 'assignable', true));
        deductionTypeOptions.selected = _get(editPayload, 'type.value', null);
        deductionFormulaOptions.selected = _get(editPayload, 'company_formula_id', null);
    }

})

const closeModal = () => {
    emit('update:creatingOrEditing', false);
    emit('update:editPayload', {});
    reset();
};

const disableActions = computed(() => {
    return submitPending.value || deductionFormulaSettingsPending.value || deductionFormulaPending.value;
});
const actionIcon = computed(() => {
    return Boolean(props.editPayload.id) ? 'ic:sharp-save' : 'mdi:plus';
});
const actionLabel = computed(() => {
    return Boolean(props.editPayload.id) ? 'Save' : 'Create';
});
const submitAction = computed(() => {
    return Boolean(props.editPayload.id) ? 'PATCH' : 'POST';
});
const submitPath = computed(() => {
    return Boolean(props.editPayload.id) ? `/api/deduction/${props.editPayload.id}` : `/api/deduction`;
});
const title = computed(() => {
    return Boolean(props.editPayload.id) ? 'Edit deduction' : 'Create deduction';
});

const submitPending = ref(false);
const reset = () => {
    deductionCode.value = '';
    deductionName.value = '';
    assignable.selected = 1;
    deductionTypeOptions.selected = null;
    deductionFormulaOptions.selected = null;

    deductionFormulaSettings.value = [];
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