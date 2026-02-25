<template>
    <div>
        <DefaultWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <form @submit.prevent="departmentsExecute" class="space-y-2 p-[20px]">

                    <BreadCrumbs prefix-company :size="`sm`" />

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

                <DialogModal
                    :max-width="'410px'"
                    :show="creatingOrEditing"
                    :closeable="false"
                >
                    <template #title>
                        {{createEditModalTitle}}
                    </template>
                    <template #content>
                        <div ref='contentContainer' class="py-4">
                            <div v-if="loadingOverlay" :style="loadingOverlayDimensionStyle" class="absolute tint-background z-50">
                                <div class="h-full flex items-center justify-center">
                                    <UnorderedList :size="'lg'" :icon="'eos-icons:loading'">Please wait...</UnorderedList>
                                </div>
                            </div>
                            <div>
                                <table class="w-full border-separate border-spacing-y-2">
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <RadioGroup
                                                    :selections="departmentOptions.selection"
                                                    :radio-key="`department_org_type`"
                                                    v-model="departmentOptions.selected" />
                                            </td>
                                        </tr>
                                        <tr v-if="departmentOptions.selected == 1">
                                            <td><InputLabel :size="'md'" value="Parent Department" /></td>
                                            <td class="my-2">
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
                            <div class="space-x-2 inline-flex items-center">
                                <Button :variant="'outline'" :disabled="createEditModalDisableActions" @click="closeModal" :label="'Cancel'" />
                                <Button :disabled="createEditModalDisableActions" :icon="createEditModalActionIcon" @click="createEditModalSubmit" :label="createEditModalActionLabel" />
                            </div>
                            <div class="space-x-2 inline-flex">
                                <div class="space-x-2 inline-flex items-center">
                                    <UnorderedList
                                        v-if="createEditModalSubmitPending"
                                        :icon="'eos-icons:loading'"
                                        :size="'md'"
                                        :label="'Please wait...'"/>
                                </div>
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="px-[20px] space-y-2">

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button
                            class="inline-block"
                            :icon="'mdi:plus'"
                            :size="'sm'"
                            :disabled="disableActions"
                            @click="create"/>

                        <div v-if="departmentsSuccessful" class="scaffold-border px-2 font-[National_Park]">
                            <span><span class="font-semibold">{{allSelectedComputed.length}}</span> Selected</span>
                        </div>

                        <Button
                            v-if="departmentsSuccessful"
                            :variant="'outline'"
                            :size="'sm'"
                            :icon="'mdi:delete-outline'"
                            :disabled="disableActions"
                            :label="'Bulk delete'"
                            @click="confirmDeleteSelected()" />
                    </div>

                    <div v-if="!departmentsSuccessful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="departmentsMessage" />
                    </div>

                    <DataTable
                        v-if="departmentsSuccessful"
                        :key="departmentsKey"
                        :sup-headers="departmentsSupHeaders"
                        :headers="departmentsHeaders"
                        :size="'lg'"
                        :border-appearance="true"
                        :stripped="false"
                        :rows="departmentsData"
                        :disabled="disableDataTable"
                        v-model="selectedDepartments"
                        :sub-row-slug="'sub_departments'"
                        :sub-row-settings="{
                            type: DATATABLE_SUBROW_TYPE.TITLED,
                            containerPaddingTop: 0.75,
                            containerPaddingBottom: 1.75,
                            titleSize: 'sm',
                            rowVerticalLine: true,
                            verticalBorderType: 'dashed',
                            horizontalBorderType: 'dashed',
                        }"
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
                        <template v-slot:cell.department_head_number="{cell,slot}">
                            <div class="p-[3px]">
                                <span v-if="cell.head">{{`${cell.head?.number}`}}</span>
                            </div>
                        </template>
                        <template v-slot:cell.department_head_full_name="{cell,slot}">
                            <div class="p-[3px]">
                                <span v-if="cell.head">{{`${cell.head?.full_name}`}}</span>
                            </div>
                        </template>
                        <template v-slot:cell.department_head_designation="{cell,slot}">
                            <div class="p-[3px]">
                                <span v-if="cell.head && cell.head?.designation">{{`${cell.head?.designation?.name}`}}</span>
                            </div>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="mdi:info-variant" :class="[slot.iconSizeClass]" /><div :class="[slot.titleSizeClass]">Sub-Departments</div>
                            </div>
                            <DepartmentSubRow
                                :rows="cell[slot.slug]"
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
import type {TableHeaderT, TableRowT, TableSupHeaderT} from "@/public/js/types/data";
import type {EnumOption, EnumSelection} from "@/public/js/common/type";
import {storeToRefs} from "pinia";

useHead({titleTemplate: (titleChunk) => {return `Departments`}});
definePageMeta({middleware: ['auth', 'admin-of-selected-company']});
useLayout().setNavigationMode('solid');

const {isAuthenticated} = useAuth();
const {fetchDepartmentSelections} = useCommon();
const nuxtApp = useNuxtApp();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, async (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        await departmentsExecute();
        await parentDepartmentSelectionExecute();
    }
})

const departmentsSupHeaders = reactive<TableSupHeaderT[]>([
    {text: ''},
    {text: ''},

    {text: 'Department Head', colspan: 3,  alignHeader: 'left'},
]);

const departmentsHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions', minWidth: '33px'},
    { text: 'Department Name', value: 'name', alignData: 'left', minWidth: '144px'},
    { text: '#', value: 'department_head_number', alignData: 'left', minWidth: '75px'},
    { text: 'Name', value: 'department_head_full_name', alignData: 'left', minWidth: '144px'},
    { text: 'Designation', value: 'department_head_designation', alignData: 'left', minWidth: '144px'},
]);

const departmentsKey = shallowRef(0);
const departmentsData = ref([]);
const departmentsSuccessful = ref(true);
const departmentsMessage = ref('');
const departmentsPending = ref(false);
const selectedDepartments = ref<number[]>([]);
const selectedSubDepartments = ref<number[]>([]);

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

const syncSelectedSubDepartments = (selectionPayload: {action: number, value: number[]}) => {
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

    await laraFetch("/api/departments", {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            filters: {
                'company_id': selectedAssociatedCompanyId.value,
                'search' : filters.search.keyword,
                'is_parent': true
            }
        }
    },{
        onRequestError: () => {
            departmentsPending.value = false;
        },
        onResponse: (request, options, response) => {
            departmentsPending.value = false;
            departmentsSuccessful.value = _get(response, '_data.successful', false);
            departmentsMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            departmentsData.value = _get(response, '_data.values.departments', []);
            departmentsKey.value += 1;
        }
    }, false);
}
departmentsExecute();

const disableActions = computed(() => {
    return departmentsPending.value || creatingOrEditing.value || deleting.value || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return departmentsPending.value || deleting.value || companyAssociationPendingState().value;
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

const allSelectedComputed = computed(() => {
    return selectedDepartments.value.concat(selectedSubDepartments.value);
})

const confirmDeleteSelected = () => {

    const selectedIds = allSelectedComputed.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected department to delete.`,
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
        message: `Confirm delete selected department${selectedIds.length > 1 ? 's' : ''}?`,
        action: {
            callback: async () => {
                await deleteSelected();
            },
            label: 'Yes'
        }
    });
}

const deleteSelected = async () => {

    const selectedIds = allSelectedComputed.value;

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
parentDepartmentSelectionExecute();

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
    let formTemp:{
        account_id: number,
        company_id: string | number | null,
        name: string,
        parent_id?: number | null
    } = {
        account_id: selectedAssociatedCompanyAccountId.value as number,
        company_id: selectedAssociatedCompanyId.value,
        name: departmentName.value,
    };

    if(departmentOptions.selected == 1){
        formTemp = {...formTemp, parent_id: parentDepartmentSelectionOption.selected}
    }

    return formTemp;
});

watch(editPayload, async (editPayload) => {

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
    return Boolean(editPayload.value.id) ? 'ic:sharp-save' : 'mdi:plus';
});
const createEditModalActionLabel = computed(() => {
    return Boolean(editPayload.value.id) ? 'Save' : 'Create';
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
            await fetchDepartmentSelections();
        },
    });
}
</script>

<style scoped>

</style>