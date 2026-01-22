<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <form @submit.prevent="designationsExecute" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" type="text"/>
                        </div>
                    </div>

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <RadioGroup
                            class="scaffold-border px-2"
                            :disabled="disableActions"
                            :selections="viewMode.selection"
                            :radio-key="`view_mode`"
                            :size="'md'"
                            :orientation="'horizontal'"
                            v-model="viewMode.selected" />
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
                                <Button :variant="'outline'" :disabled="createEditModalDisableActions" @click="closeModal" :label="'Cancel'" />
                                <Button :disabled="createEditModalDisableActions" :icon="createEditModalActionIcon" @click="createEditModalSubmit" :label="createEditModalActionLabel" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="px-[20px]">

                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button
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
                            :icon="'mdi:delete-outline'"
                            :disabled="disableActions"
                            :label="'Delete selected'"
                            @click="confirmDeleteSelected()" />
                    </div>

                    <div v-if="!designationsSuccessful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="designationsMessage" />
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
import type {EnumOption, EnumSelection} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Designations`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
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
    { text: 'Designation', value: 'name', alignData: 'left'},
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

const viewMode = reactive<{
    selection: EnumSelection;
    selected: number | null;
}>({
    selection: [
        {text : 'Flex', value: DATA_VIEW_MODE.FLEX} as EnumOption,
        {text : 'List', value: DATA_VIEW_MODE.LIST} as EnumOption,
    ],
    selected: DATA_VIEW_MODE.LIST as number
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
await designationsExecute();

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