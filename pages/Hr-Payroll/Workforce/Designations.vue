<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-lg">

                <form @submit.prevent="designationsExecute" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" type="text"/>
                        </div>
                        <div class="flex flex-col">
                            <div class="flex-none h-[1.25rem]"></div>
                            <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        </div>
                    </div>
                </form>

                <DialogModal
                    :max-width="'410px'"
                    :show="creatingOrEditing"
                    :closeable="false"
                >
                    <template #title>
                        {{createEditModalTitle}}
                    </template>
                    <template #content>
                        <div class="py-4">
                            <table class="w-full border-separate">
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
                                <Button :variant="'outline'" :disabled="createEditModalDisableActions" @click="closeModal" :label="'Cancel'" />
                                <Button :disabled="createEditModalDisableActions" :icon="createEditModalActionIcon" @click="createEditModalSubmit" :label="createEditModalActionLabel" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="px-[20px] space-y-2">
                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                        <Button
                            v-if="designationsSuccessful"
                            class="inline-block"
                            :icon="'mdi:plus'"
                            :size="'sm'"
                            :disabled="disableActions"
                            @click="create"/>
                        <div v-if="designationsSuccessful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{selectedDesignations.length}}</span> Selected</span>
                        </div>
                        <Button
                            v-if="designationsSuccessful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'ph:trash-simple'"
                            :disabled="disableActions"
                            :label="'Bulk delete'"
                            @click="confirmDeleteSelected()" />
                        <div v-if="!designationsSuccessful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                            <Label invert :size="'md'" :type="'danger'" :label="designationsMessage" />
                        </div>
                    </div>



                    <DataTable
                        v-if="designationsSuccessful"
                        :headers="designationsHeaders"
                        :size="'lg'"
                        :rows="designationsData"
                        :disabled="disableDataTable"
                        v-model="selectedDesignations"
                        selection>
                        <template v-slot:cell.actions="{cell, slot, scrollReference}">
                            <div class="text-base h-[32px] px-2 gap-0.5 flex items-center justify-center cursor-pointer accent-hover" @click="edit(cell)">
                                <span class="font-narrow-thin">Edit</span>
                                <Icon class="h-5 w-5" :name="'gg:external'"/>
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

useHead({titleTemplate: (titleChunk) => {return `Designations`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const {fetchDesignationSelections} = useCommon();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        designationsExecute();
    }
})

const designationsHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions', minWidth: '33px'},
    { text: 'Designation', value: 'name', alignData: 'left', minWidth: '244px'},
]);

const designationsData = ref([]);
const designationsSuccessful = ref(true);
const designationsMessage = ref('');
const designationsPending = ref(false);
const selectedDesignations = ref([]);

let filters = reactive<{
    page: number,
    perPage: number,
    search: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    }
}>({
    page: 1,
    perPage: 25,
    search: {
        keyword: '',
        callback: 1
    }
});

const designationsExecute = async () => {

    if(import.meta.server){return;}

    designationsPending.value = true;

    await laraFetch("/api/designations", {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
                'search' : filters.search.keyword,
            }
        }
    },{
        onRequestError: () => {
            designationsPending.value = false;
        },
        onResponse: (request, options, response) => {
            designationsPending.value = false;
            designationsSuccessful.value = _get(response, '_data.successful', false);
            designationsMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            designationsData.value = _get(response, '_data.values.designations', []);
        }
    }, false);
}
designationsExecute();

const disableActions = computed(() => {
    return designationsPending.value || creatingOrEditing.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return designationsPending.value || deleting.value || companyAssociationPendingState().value;
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

const confirmDeleteSelected = () => {

    const selectedIds = selectedDesignations.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected designation to delete.`,
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });

        return false;
    }

    useNuxtApp().$promptStore.setPrompt({
        resetable: true,
        icon: null,
        title: 'Confirm Action',
        message: `Confirm delete selected designation${selectedIds.length > 1 ? 's' : ''}?`,
        action: {
            callback: async () => {
                await deleteSelected();
            },
            label: 'Yes'
        }
    });
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
                        account_id: selectedAssociatedCompanyAccountId.value,
                        company_id: selectedAssociatedCompanyId.value,
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
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        name: designationName.value,
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
    return Boolean(editPayload.value.id) ? 'ic:sharp-save' : 'mdi:plus';
});
const createEditModalActionLabel = computed(() => {
    return Boolean(editPayload.value.id) ? 'Save' : 'Create';
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