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
                        <div ref='contentContainer'>
                            <div v-if="loadingOverlay" :style="loadingOverlayDimensionStyle" class="absolute tint-background  z-50">
                                <div class="h-full flex items-center justify-center">
                                    <UnorderedList :size="'lg'" :icon="'eos-icons:loading'">Please wait...</UnorderedList>
                                </div>
                            </div>
                            <div v-if="false">
                                <span class="font-semibold">Department options:</span> {{departmentOptions}}<br>
                                <span class="font-semibold">departmentOptions.selected:</span> {{departmentOptions.selected + 1}}<br>
                                <span class="font-semibold">Department Name:</span> {{departmentName}}<br>
                                <span class="font-semibold">Parent Department Selection Option:</span> {{parentDepartmentSelectionOption}}<br>
                                <span class="font-semibold">Create | Edit Form:</span> {{createEditModalForm}}<br>
                            </div>
                            <div>
                                <table class="w-full border-separate border-spacing-2">
                                    <tbody>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <RadioGroup :selections="departmentOptions.selection" v-model="departmentOptions.selected" />
                                        </td>
                                    </tr>
                                    <tr v-if="departmentOptions.selected == 1">
                                        <td><InputLabel :size="'md'" value="Parent Department" /></td>
                                        <td>
                                            <SingleSelect
                                                :searchable="false"
                                                drop-shadow
                                                :selection-max-viewable-line="6"
                                                :size="'md'"
                                                :label="'Select'"
                                                :options="parentDepartmentSelectionOption"
                                                @value-change=""/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><InputLabel :size="'md'" value="Department" /></td>
                                        <td><Input v-model="departmentName" placeholder="Enter department name" type="text" /></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div class="space-x-2 inline-flex">
                                <div class="space-x-2 inline-flex items-center">
                                    <UnorderedList
                                        v-if="createEditModalSubmitPending"
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
                        <Button :variant="'outline'" :icon="'ic:sharp-restart-alt'" class="inline-block" :size="'sm'" :disabled="disableActions" @click="departmentsExecute"/>
                    </div>
                </div>

                <div class="px-[20px]">
                    <UnorderedList
                        v-if="disableActions"
                        :icon="'eos-icons:loading'"
                        :size="'md'"
                        :label="'Please wait...'"/>

                    <DataTable
                        :headers="departmentsHeaders"
                        :size="'lg'"
                        :rows="departmentsData"
                        :disabled="disableDataTable"
                        v-model="selectedDepartments"
                        :sub-row-slug="'details'"
                        :sub-row-settings="{
                            type: DATATABLE_SUBROW_TYPE.TITLED,
                            containerPaddingTop: 0.25,
                            containerPaddingBottom: 0.75,
                            titleSize: 'sm',
                            rowVerticalLine: true,
                            verticalBorderType: 'dashed',
                            horizontalBorderType: 'dashed',
                        }"
                        selection>
                        <template v-slot:cell.actions="{cell, slot, scrollReference}">
                            <Button class="mx-0.5" type="button" :size="slot.buttonSize" :icon="'mdi:pen'" @click="edit(cell)" :label="'Edit'"></Button>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="mdi:info-variant" :class="[slot.iconSizeClass]" /><div :class="[slot.titleSizeClass]">Sub-Departments</div>
                            </div>
                            <DepartmentSubRow
                                :rows="cell[slot.slug].sub_departments"
                                @proxy-edit="edit"
                                @sync-selected="syncSelectedSubDepartments"
                                :disabled="disableDataTable"
                            ></DepartmentSubRow>
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
useLayout().setNavigationMode('solid', 'Departments.vue');

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, async (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        await departmentsExecute();
        await parentDepartmentSelectionExecute();
    }
})

const departmentsHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions'},
    { text: 'Name', value: 'name', alignData: 'left'},
]);

const departmentsData = ref([]);
const departmentsPending = ref(false);
const selectedDepartments = ref([]);
const selectedSubDepartments = ref([]);

const syncSelectedSubDepartments = (selectionPayload) => {
    if(selectionPayload.action == SELECTION_ACTION.REMOVE){
        selectedSubDepartments.value = _difference(selectedSubDepartments.value, selectionPayload.value);
    }

    if(selectionPayload.action == SELECTION_ACTION.ADD){
        selectedSubDepartments.value = _uniq(selectedSubDepartments.value.concat(selectionPayload.value));
    }
}

const departmentsExecute = async () => {

    if(import.meta.server){return;}

    departmentsPending.value = true;
    departmentsData.value = [];

    await laraFetch("/api/departments", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
                'is_parent': true
            }
        }
    },{
        onRequestError: () => {
            departmentsPending.value = false;
        },
        onResponse: () => {
            departmentsPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            departmentsData.value = _get(response, '_data.values.departments', []);
        }
    });
}
await departmentsExecute();

const disableActions = computed(() => {
    return departmentsPending.value || creatingOrEditing.value || deleting.value;
});
const disableDataTable = computed(() => {
    return departmentsPending.value || deleting.value;
});

const creatingOrEditing = ref(false);
const deleting = ref(false);
const editPayload = ref({});

const createEditModalResolved = async () => {
    creatingOrEditing.value = false;
    editPayload.value = {};
    await departmentsExecute();
}

const create = () => {
    editPayload.value = {};
    creatingOrEditing.value = true;
};

const edit = (cell: TableRowT) => {
    editPayload.value = cell;
    creatingOrEditing.value = true;
}

const deleteSelected = async () => {

    const selectedIds = selectedDepartments.value.concat(selectedSubDepartments.value);

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    let batchDelete: Promise<any>[] = [];

    selectedIds.forEach((id) => {
        batchDelete.push(
            new Promise((resolve, reject) => {
                laraFetch(`/api/department/${id}`, {
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
    selectedDepartments.value = [];
    selectedSubDepartments.value = [];
    await departmentsExecute();

    deleting.value = false;
}

//Modal
const departmentName = ref('');
const departmentOptions = reactive({
    selection: [
        {text : 'Parent department', value: 0},
        {text : 'Sub-department', value: 1},
    ],
    selected: 0
});
const parentDepartmentSelectionOption = reactive({
    search: '',
    selection: [],
    selected: null
});

const parentDepartmentSelectionPending = ref(false);
const parentDepartmentSelectionExecute = async () => {

    if(import.meta.server){return;}

    parentDepartmentSelectionPending.value = true;

    await laraFetch("/api/department-selections", {
        method: 'GET',
        params: {
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
                'is_parent': true,
                ...(
                    _get(editPayload.value, 'id', null) != null && {
                        except: _castArray(_get(editPayload.value, 'id'))
                    }
                )
            }
        }
    }, {
        onRequestError: () => {
            parentDepartmentSelectionPending.value = false;
        },
        onResponse: () => {
            parentDepartmentSelectionPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            parentDepartmentSelectionOption.selection = _get(response, '_data.values.selection', []);
        }
    });
}
await parentDepartmentSelectionExecute();

const loadingOverlay = computed(()=>{
    return parentDepartmentSelectionPending.value;
});
const {width: contentContainerWidth, height: contentContainerHeight} = useElementSize(useTemplateRef('contentContainer'));
const loadingOverlayDimensionStyle = computed(() => {
    return {
        width: `${contentContainerWidth.value}px`,
        height: `${contentContainerHeight.value}px`
    };
});

const createEditModalForm = computed(() => {
    let formTemp:{company_id: string | number | null, name: string, parent_id?: number | null} = {
        company_id: selectedAssociatedCompanyId.value,
        name: departmentName.value,
    };

    if(Boolean(parseInt(departmentOptions.selected))){
        formTemp = {...formTemp, parent_id: parentDepartmentSelectionOption.selected}
    }

    return formTemp;
});

watch(editPayload, async (editPayload) => {
    console.log({'WATCH editPayload': editPayload});
    if(Boolean(editPayload.id)){
        departmentName.value = _get(editPayload, 'name', '');
        let parent_id = _get(editPayload, 'parent_id', null);
        departmentOptions.selected = Boolean(parent_id) ? 1 : 0;

        parentDepartmentSelectionOption.selected = parent_id;
    }

    await parentDepartmentSelectionExecute();
});

const closeModal = () => {
    creatingOrEditing.value = false;
    editPayload.value = {};
    createEditModalReset();
};

const createEditModalReset = () => {
    departmentName.value = '';
    departmentOptions.selected = 0;
    parentDepartmentSelectionOption.selected = null;
};

const createEditModalSubmitPending = ref(false);
const createEditModalDisableActions = computed(() => {
    return createEditModalSubmitPending.value  || loadingOverlay.value
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
    return Boolean(editPayload.value.id) ? `/api/department/${editPayload.value.id}` : `/api/department`;
});
const createEditModalTitle = computed(() => {
    return Boolean(editPayload.value.id) ? 'Edit department' : 'Create department';
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
        },
    });
}
</script>

<style scoped>

</style>