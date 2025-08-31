<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <DialogModal
                    :max-width="'410px'"
                    :show="creatingOrEditing"
                    :closeable="false"
                >
                    <template #title>
                        {{createEditModalTitle}}
                    </template>
                    <template #content>
                        <div>
                            <table class="w-full border-separate border-spacing-2">
                                <tbody>
                                <tr>
                                    <td><InputLabel :size="'md'" value="Designation" /></td>
                                    <td><Input v-model="designationName" placeholder="Enter designation name" type="text" /></td>
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
                                        v-if="createEditModalDisableActions"
                                        :icon="'eos-icons:loading'"
                                        :size="'md'"
                                        :label="'Please wait...'"/>
                                </div>
                            </div>
                            <div class="space-x-2 inline-flex items-center">
                                <Button :variant="'outline'" :icon="'mdi:cancel'" :disabled="createEditModalDisableActions" @click="closeModal" :label="'Cancel'" />
                                <Button :disabled="createEditModalDisableActions" :icon="createEditModalActionIcon" @click="createEditModalSubmit" :label="createEditModalActionLabel" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="space-y-2 p-[20px]">
                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button class="inline-block" :icon="'mdi:plus'" :size="'sm'" :disabled="disableActions"  @click="create"/>
                        <Button :variant="'outline'" :icon="'mdi:delete-outline'" class="inline-block" :size="'sm'" :disabled="disableActions" @click="deleteSelected"/>
                        <Button :variant="'outline'" :icon="'ic:sharp-restart-alt'" class="inline-block" :size="'sm'" :disabled="disableActions" @click="designationsExecute"/>
                    </div>
                </div>

                <div class="px-[20px]">
                    <UnorderedList
                        v-if="disableActions"
                        :icon="'eos-icons:loading'"
                        :size="'md'"
                        :label="'Please wait...'"/>
                    <DataTable
                        :headers="designationsHeaders"
                        :size="'lg'"
                        :rows="designationsData"
                        :disabled="disableDataTable"
                        v-model="selectedDesignations"
                        selection>
                        <template v-slot:cell.actions="{cell, slot, scrollReference}">
                            <div class="flex items-center">
                                <NavDrop
                                    class="z-10"
                                    :disabled="disableActions"
                                    :parent-icon="'ic:baseline-arrow-right'"
                                    in-horizontal-scrollable
                                    :size="`sm`"
                                    :drop-shadow-size="`lg`"
                                    :title="'Menu'"
                                    :drop-align="'top'"
                                    :drop-justify="'right'"
                                    :drop-options="[
                                        {type: 'action',icon: 'mdi:pen',title: 'Edit',callback: () => edit(cell),},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {TableHeaderT, TableRowT} from "@/public/js/types/data";
import {storeToRefs} from "pinia";

definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid', 'designations.vue');

const {isAuthenticated} = useAuth();
const {fetchDesignationSelections} = useCommon();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        designationsExecute();
    }
})

const designationsHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions'},
    { text: 'Designation', value: 'name', alignData: 'left'},
]);

const designationsData = ref([]);
const designationsPending = ref(false);
const selectedDesignations = ref([]);

const designationsExecute = async () => {

    if(import.meta.server){return;}

    designationsPending.value = true;

    await laraFetch("/api/designations", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
            }
        }
    },{
        onRequestError: () => {
            designationsPending.value = false;
        },
        onResponse: () => {
            designationsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            designationsData.value = _get(response, '_data.values.designations', []);
        }
    });
}
await designationsExecute();

const disableActions = computed(() => {
    return designationsPending.value || creatingOrEditing.value || deleting.value;
});
const disableDataTable = computed(() => {
    return designationsPending.value || deleting.value;
});

const creatingOrEditing = ref(false);
const deleting = ref(false);
const editPayload = ref({});

const createEditModalResolved = async () => {
    creatingOrEditing.value = false;
    editPayload.value = {};
    await designationsExecute();
}

const create = () => {
    creatingOrEditing.value = true;
    editPayload.value = {};
};

const edit = (cell: TableRowT) => {
    creatingOrEditing.value = true;
    editPayload.value = cell;
}

const deleteSelected = async () => {

    const selectedIds = selectedDesignations.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    let batchDelete: Promise<any>[] = [];

    selectedIds.forEach((id) => {
        batchDelete.push(
            new Promise((resolve, reject) => {
                laraFetch(`/api/designation/${id}`, {
                    method: 'DELETE',
                    body: {
                        'company_id': selectedAssociatedCompanyId.value,
                    }
                },{
                    onRequestError: (request, options, error) => {
                        reject(error);
                    },
                    onResponse: (request, options, response) => {
                        resolve(response);
                    }
                })
            })
        );
    });

    await Promise.all(batchDelete);
    selectedDesignations.value = [];
    await designationsExecute();

    deleting.value = false;
}

//Modal
const designationName = ref('');

const createEditModalForm = computed(() => {
    return {
        'company_id': selectedAssociatedCompanyId.value,
        'name': designationName.value,
    }
});

watch(editPayload, (editPayload) => {
    if(Boolean(editPayload.id)){
        designationName.value = _get(editPayload, 'name', '');
    }
});

const closeModal = () => {
    creatingOrEditing.value = false;
    editPayload.value = {};
    createEditModalReset();
};

const createEditModalReset = () => {
    designationName.value = '';
};

const createEditModalSubmitPending = ref(false);
const createEditModalDisableActions = computed(() => {
    return createEditModalSubmitPending.value;
});
const createEditModalActionIcon = computed(() => {
    return Boolean(editPayload.value.id) ? 'mdi:pen' : 'mdi:plus';
});
const createEditModalActionLabel = computed(() => {
    return Boolean(editPayload.value.id) ? 'Update' : 'Create';
});
const createEditModalSubmitAction = computed(() => {
    return Boolean(editPayload.value.id) ? 'PATCH' : 'POST';
});
const createEditModalSubmitPath = computed(() => {
    return Boolean(editPayload.value.id) ? `/api/designation/${editPayload.value.id}` : `/api/designation`;
});
const createEditModalTitle = computed(() => {
    return Boolean(editPayload.value.id) ? 'Edit designation' : 'Create designation';
});

const createEditModalSubmit = async() => {
    createEditModalSubmitPending.value = true;

    await laraFetch(createEditModalSubmitPath.value, {
        method: createEditModalSubmitAction.value,
        body: createEditModalForm.value,
    }, {
        onRequestError: () => {
            createEditModalSubmitPending.value = false;
        },
        onResponse: () => {
            createEditModalSubmitPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            createEditModalReset();
            await createEditModalResolved();
            await fetchDesignationSelections();
        },
    });
}
</script>

<style scoped>

</style>