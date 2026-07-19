<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-md">

                <DialogModal
                    :show="showModalAsGroupAssignment || showModalAsCreatingOrEditing"
                    :content-padding="'0'">
                    <template #title>
                    </template>
                    <template #content>
                        <div class="px-3 pt-4 pb-2.5">
                            <div class="mx-auto max-w-screen-lg space-y-4">

                                <div class="lining-shadow rounded-sm tint-background">

                                    <div class="neutral-border-bottom rounded-t-sm text-lg font-medium font-header px-4 py-2">Group</div>

                                    <div class="p-4">

                                        <div class="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                                            <div>
                                                <InputLabel :size="'sm'" value="Name"/>
                                                <Input
                                                    :disabled="disableActions"
                                                    v-model="groupName"
                                                    :size="'md'" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="lining-shadow rounded-sm tint-background">

                                    <div class="neutral-border-bottom rounded-t-sm text-lg font-medium font-header px-4 py-2">{{employeeListTitle}}</div>

                                    <div class="p-4 max-h-[400px] overflow-y-scroll">

                                        <Suspense>
                                            <EmployeeSelection
                                                ref="employeeSelectionReference"
                                                compact
                                                :clear-selection-on-form-submit="false"
                                                :selected-label="'Employees Selected'"
                                                :show-only-selected-label="'Show only assigned employees'"
                                                :disable-actions="disableActions"
                                                v-model:pending="employeeSelectionPending"
                                                v-model:selected="selectedModalEmployees"/>

                                            <template #fallback>
                                                <div>
                                                    <UnorderedList
                                                        :icon="'eos-icons:loading'"
                                                        :size="'md'"
                                                        :label="'Loading employee selections...'"/>
                                                </div>
                                            </template>
                                        </Suspense>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="mx-auto max-w-screen-xl">
                            <div class="flex space-x-2 justify-between">
                                <div class="space-x-2 inline-flex">
                                    <div class="space-x-2 inline-flex items-center">
                                    </div>
                                </div>
                                <div class="space-x-2 inline-flex items-center">
                                    <Button
                                        v-if="assigningGroup"
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'md'"
                                        :disabled="disableEmployeeModalSelectionActions"
                                        :label="'Cancel'"
                                        @click="closeGroupAssignmentModal"/>
                                    <Button
                                        v-if="assigningGroup"
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="submitGroupAssignmentIcon"
                                        :disabled="disableEmployeeModalSelectionActions"
                                        :label="submitGroupAssignmentLabel"
                                        @click="submitGroupAssignment"/>
                                    <Button
                                        v-if="creatingOrEditingGroup"
                                        class="w-min"
                                        :variant=" 'outline'"
                                        :size="'md'"
                                        :disabled="disableEmployeeModalSelectionActions"
                                        :label="'Cancel'"
                                        @click="closeCreateEditForm"/>
                                    <Button
                                        v-if="creatingOrEditingGroup"
                                        class="w-min"
                                        :variant="'default'"
                                        :size="'md'"
                                        :icon="submitCreateEditGroupIcon"
                                        :disabled="disableEmployeeModalSelectionActions"
                                        :label="submitCreateEditGroupLabel"
                                        @click="submitCreateEdit"/>
                                </div>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

                    <div class="lining-shadow rounded-sm tint-background space-y-2 p-[20px]">

                        <form @submit.prevent="paginate(1, true)" class="space-y-2">

                            <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
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

                        <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[disableActions ? 'pointer-events-none' : '']">
                            <Button v-if="employeeGroups.successful" @click="put(null)" class="w-min" :disabled="disableActions" :size="'sm'" :icon="'mdi:plus'"></Button>
                            <div v-if="employeeGroups.successful" class="scaffold-border px-2 font-[National_Park]">
                                <span><span class="font-semibold">{{selectedEmployeeGroups.length}}</span> Selected</span>
                            </div>
                            <Button v-if="employeeGroups.successful" :variant="'outline'" :size="'sm'" :icon="'ph:backspace'" :disabled="disableActions" :label="'Clear selection'" @click="selectedEmployeeGroups = []" />
                            <Button v-if="employeeGroups.successful" :variant="'outline'" :size="'sm'" :icon="'ph:trash-simple'" :disabled="disableActions" :label="'Bulk delete'" @click="confirmDeleteSelected()" />
                            <Button v-if="employeeGroups.successful" @click="assignGroups" class="inline-block" :size="'sm'" :icon="'mdi:plus'" :disabled="disableActions" :variant="'outline'" :label="'Bulk assign'" />
                            <Button v-if="employeeGroups.successful" @click="confirmGroupAssignmentBatchDetach" class="inline-block" :size="'sm'" :icon="'ph:trash-simple'" :disabled="disableActions" :variant="'outline'" :label="'Bulk remove'" />
                            <Label v-if="!employeeGroups.successful" invert :size="'md'" :type="'danger'" :label="employeeGroups.message" />
                        </div>

                        <DataTable
                            v-if="employeeGroups.successful"
                            :headers="employeeGroupsHeaders"
                            :size="'lg'"
                            :rows="employeeGroups.data"
                            :disabled="disableDataTable"
                            v-model="selectedEmployeeGroups"
                            selection>
                            <template v-slot:cell.actions="{cell,slot: cellSlot}">
                                <div class="text-base h-[32px] px-2 gap-0.5 flex items-center justify-center cursor-pointer accent-hover" @click="put(cell)">
                                    <span class="font-narrow-thin">Edit</span>
                                    <Icon class="h-5 w-5" :name="'gg:external'"/>
                                </div>
                            </template>
                            <template v-slot:cell.groupables_count="{cell,slot}">
                                <div class="p-[3px] font-sans">{{cell.groupables_count}}</div>
                            </template>
                        </DataTable>

                        <div>
                            <PageInformation :pagination="employeeGroups.meta.pagination" :pending="disableDataTable"/>
                            <Pagination :size="'lg'" :pagination="employeeGroups.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                        </div>

                    </div>
                </div>
            </div>
        </DefaultWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT} from "@/public/js/types/data";
import type {EmployeeSelectionInstance} from "@/public/js/types/component-instance";
import type {EnumOption, EnumSelection} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Employee Groups`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const {fetchEmployeeGroupSelections} = useCommon();
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
        paginate();
    }
});

const employeeGroupsHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions', minWidth: '33px'},
    { text: 'Group', value: 'name', alignData: 'left'},
    { text: 'Groupables Count', value: 'groupables_count', alignData: 'right'},
]);

const employeeGroups = reactive<DataTableT>({
    'data': [],
    'meta': {
        pagination: {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 0,
            total_pages: 0
        }
    },
    'successful': false,
    'message': ''
});
let filters = reactive<{
    page: number,
    perPage: number,
    search: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    }
}>({
    page: 1,
    perPage: 10,
    search: {
        keyword: '',
        callback: 1
    }
});

let pageComputed = computed({
    get() {
        return {
            page: filters.page,
            perPage: filters.perPage,
        }
    },
    set(payload: { key: 'page' | 'perPage', value: number }) {
        filters[payload.key] = payload.value;
    }
});
let paramsComputed = computed(() => {
    return {
        page: filters.page,
        perPage: filters.perPage,
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            company_id: selectedAssociatedCompanyId.value,
            search: filters.search.keyword,
        }
    };
});
const employeeGroupsPending = ref(false)
const selectedEmployeeGroups = ref([]);
const deleting = ref(false);

const disableActions = computed(() => {
    return employeeGroupsPending.value || groupAssignmentPending.value || createEditPending.value || deleting.value || companyAssociationPendingState().value;
});
const disableEmployeeModalSelectionActions = computed(() => {
    return disableActions.value || employeeSelectionPending.value || employeeSelectionReferencePending.value || companyAssociationPendingState().value;
})
const disableDataTable = computed(() => {
    return employeeGroupsPending.value || companyAssociationPendingState().value;
});
const employeeGroupsExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyId.value){
        return;
    }

    employeeGroupsPending.value = true;

    await laraFetch(`/api/employee-groups`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            employeeGroupsPending.value = false;
        },
        onResponse: (request, options, response) => {
            employeeGroupsPending.value = false;
            employeeGroups.successful = _get(response, '_data.successful', false);
            employeeGroups.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            employeeGroups.data = _get(response, '_data.values.data', [])
            employeeGroups.meta = _get(response, '_data.values.meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
        }
    }, false);
}
employeeGroupsExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedEmployeeGroups.value = [];
    }

    if(filters.page === page){
        employeeGroupsExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const groupName = ref('');

const confirmDeleteSelected = () => {

    const selectedIds = selectedEmployeeGroups.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected group to delete.`,
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
        message: `Confirm delete selected group${selectedIds.length > 1 ? 's' : ''}?`,
        action: {
            callback: async () => {
                await deleteSelected();
            },
            label: 'Yes'
        }
    });
}
const deleteSelected = async () => {

    let selectedIds: number[] = [];

    selectedIds = selectedEmployeeGroups.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/employee-groups", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            group_ids: selectedIds,
        },
    },{
        onRequestError: (request, options, error) => {
            deleting.value = false;
        },
        onResponse: () => {
            deleting.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `Group${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedEmployeeGroups.value = [];
    await employeeGroupsExecute();
    await fetchEmployeeGroupSelections();
    employeeSelectionReference.value?.rebuildSelections(['employee_group']);
}

const employeeSelectionReference = useTemplateRef<EmployeeSelectionInstance>('employeeSelectionReference');
const employeeSelectionReferencePending = computed(() => {
    return !Boolean(employeeSelectionReference.value);
});

const assigningGroup = ref(false);
const creatingOrEditingGroup = ref(false);

const showModalAsGroupAssignment = computed(() => {
    return assigningGroup.value;
})

const showModalAsCreatingOrEditing = computed(() => {
    return creatingOrEditingGroup.value;
})

const employeeSelectionPending = ref(false);
const selectedModalEmployees = ref([]);

const groupAssignmentPending = ref(false);
const resetGroupAssignment = () => {
    assigningGroup.value = false;
    selectedModalEmployees.value = [];
    employeeSelectionReference.value?.reset();
};
const closeGroupAssignmentModal = () => {
    resetGroupAssignment();
};
const assignGroups = () => {
    if(selectedEmployeeGroups.value.length == 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: 'Validation Error',
            message: 'Please select at least one group to assign to employee(s).',
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });
        return;
    }

    assigningGroup.value = true;
    creatingOrEditingGroup.value = false;
};

const submitGroupAssignmentIcon = computed(() => {
    return groupAssignmentPending.value ? 'eos-icons:loading' : 'mdi:plus';
});

const submitGroupAssignmentLabel = computed(() => {
    return groupAssignmentPending.value ? 'Please wait' : 'Assign Groups';
});

const groupAssignmentForm = computed(() => {

    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        employees: selectedModalEmployees.value,
        group_ids: selectedEmployeeGroups.value
    };
});

const submitGroupAssignment = async () => {

    if(selectedModalEmployees.value.length == 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: 'Validation Error',
            message: 'Please select at least one employee to assign group(s) to.',
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });
        return;
    }

    groupAssignmentPending.value = true;

    await laraFetch("/api/employee-group-assignment-sync-without-detaching", {
        method: 'POST',
        body: groupAssignmentForm.value,
    },{
        onRequestError: (request, options, error) => {
            groupAssignmentPending.value = false;
        },
        onResponse: () => {
            groupAssignmentPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: 'Groups assigned successfully.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            resetGroupAssignment();
            await nextTick();
            await employeeGroupsExecute();
        }
    });

};
const confirmGroupAssignmentBatchDetach = () => {
    if(selectedEmployeeGroups.value.length == 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: 'Please select at least one group to clear from employees.',
            action: {
                callback: () => {},
                label: 'Okay'
            }
        });
        return;
    }

    useNuxtApp().$promptStore.setPrompt({
        resetable: true,
        icon: null,
        title: 'Confirm Action',
        message: 'Confirm clear selected groups from assigned employees',
        action: {
            callback: async () => {
                await submitGroupAssignmentBatchDetach();
            },
            label: 'Yes'
        }
    });
};

const groupAssignmentBatchDetachForm = computed(() => {

    return {
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        group_ids: selectedEmployeeGroups.value
    };
});
const submitGroupAssignmentBatchDetach = async () => {

    groupAssignmentPending.value = true;

    await laraFetch('/api/employee-group-assignment-detach', {
        method: 'POST',
        body: groupAssignmentBatchDetachForm.value,
    },{
        onRequestError: (request, options, error) => {
            groupAssignmentPending.value = false;
        },
        onResponse: () => {
            groupAssignmentPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: 'Groups cleared successfully.',
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            resetGroupAssignment();
            await nextTick();
            await employeeGroupsExecute();
        }
    });
};

const stagedEmployeeGroup = ref<{
    'id': string | number | null,
    'ulid': string | null,
}>({
    'id': null,
    'ulid': null,
});
const createEditPending = ref(false);
const creatingGroup = computed(() => {
    return stagedEmployeeGroup.value.id == null;
});

const resetCreatingOrEditing = () => {
    stagedEmployeeGroup.value = {
        'id': null,
        'ulid': null,
    };
    creatingOrEditingGroup.value = false;
    groupName.value = '';
    selectedModalEmployees.value = [];
    employeeSelectionReference.value?.reset();
};
const closeCreateEditForm = () => {
    resetCreatingOrEditing();
};

const put = async(row: TableRowT | null = null) => {

    if(row){
        stagedEmployeeGroup.value = {
            'id': row.id,
            'ulid': row.ulid,
        };

        groupName.value = row.name;
        selectedModalEmployees.value = row.employee_ids;
    }

    creatingOrEditingGroup.value = true;
    assigningGroup.value = false;
};

const submitCreateEditGroupIcon = computed(() => {
    return createEditPending.value ? 'eos-icons:loading' : creatingGroup.value ? 'mdi:plus' : 'ic:sharp-save';
});

const submitCreateEditGroupLabel = computed(() => {
    return createEditPending.value ? 'Please wait' : creatingGroup.value ? 'Create' : 'Save';
});

const submitCreateEditPath = computed(() => {
    return creatingGroup.value ? '/api/employee-group' : `/api/employee-group/${stagedEmployeeGroup.value.ulid}`;
});

const submitCreateEditForm = computed(() => {
    return {
        'account_id': selectedAssociatedCompanyAccountId.value,
        'company_id': selectedAssociatedCompanyId.value,
        'name': groupName.value,
        'employees': selectedModalEmployees.value ?? [],
    }
});

const employeeListTitle = computed(() => {
    if(assigningGroup.value || creatingGroup.value){
        return 'Select Employees'
    }

    return 'Employees';
});

const submitCreateEdit = async () => {

    createEditPending.value = true;

    await laraFetch(submitCreateEditPath.value, {
        method: creatingGroup.value ? 'POST' : 'PATCH',
        body: submitCreateEditForm.value,
    },{
        onRequestError: (request, options, error) => {
            createEditPending.value = false;
        },
        onResponse: () => {
            createEditPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `Group ${creatingGroup.value ? 'created' : 'updated'} successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            resetCreatingOrEditing();
            await nextTick();
            await employeeGroupsExecute();
            await fetchEmployeeGroupSelections();
            employeeSelectionReference.value?.rebuildSelections(['employee_group']);
        }
    });
};
</script>

<style scoped>

</style>