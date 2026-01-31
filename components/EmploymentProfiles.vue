<template>
    <div>
        <EmploymentProfileModal
            v-model:creatingOrEditing="proxyCreatingOrEditing"
            v-model:employeePayload="employeePayload"
            v-model:editPayloadIndex="editIndex"
            v-model:editPayload="editPayload"
            @resolved="employmentProfileModalResolved"
        ></EmploymentProfileModal>

        <div class="lining-shadow rounded-sm tint-background space-y-2">

            <div class="lining-shadow rounded-t-sm text-lg px-4 py-2">Employment Profile</div>

            <div class="p-4">

                <div v-if="false">
                    <span class="font-semibold">Employee Payload:</span> {{childComponentEmployeePayload}}<br>
                    <span class="font-semibold">Employee Ulid:</span> {{employeeUlid}}<br>
                    <span class="font-semibold">Edit Payload Index:</span> {{editIndex}}<br>
                    <span class="font-semibold">Props Disable Actions:</span> {{props.disableActions}}<br>
                    <span class="font-semibold">Employment Profiles:</span> {{employmentProfilesData}}<br>
                    <span class="font-semibold">Employment Profiles[1]:</span> {{employmentProfilesData[1]}}<br>
                    <span class="font-semibold">Selected Employment Profiles:</span> {{selectedEmploymentProfiles}}<br>
                </div>

                <div class="grid grid-cols-1 md:gap-2 lg:grid-cols-1">
                    <div class="space-y-2">
                        <div v-if="employmentProfilesSuccessful" class="inline-flex gap-2 items-center">
                            <Button
                                class="w-min"
                                :variant=" 'outline'"
                                :size="'sm'"
                                :disabled="disableActions"
                                :icon="'mdi:plus'"
                                @click="createOrEdit()"/>
                            <Button
                                v-if="!creatingEmployee"
                                class="w-min"
                                :variant="'outline'"
                                :size="'sm'"
                                :icon="'mdi:delete-outline'"
                                :disabled="disableActions"
                                @click="deleteSelected()" />
                            <Button
                                v-if="!creatingEmployee"
                                class="w-min"
                                :variant="'outline'"
                                :size="'sm'"
                                :icon="'ic:sharp-restart-alt'"
                                :disabled="disableActions"
                                @click="employmentProfileExecute" />
                            <UnorderedList
                                v-if="disableActions"
                                :icon="'eos-icons:loading'"
                                :size="'md'"
                                :label="'Please wait...'"/>
                        </div>

                        <div v-if="!employmentProfilesSuccessful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                            <Label invert :size="'md'" :type="'danger'" :label="employmentProfilesMessage" />
                        </div>

                        <DataTable
                            v-if="employmentProfilesSuccessful"
                            :headers="employmentProfileHeaders"
                            :size="'lg'"
                            :rows="employmentProfilesData"
                            :disabled="disableDataTable"
                            v-model="selectedEmploymentProfiles"
                            selection>
                            <template v-slot:cell.action="{cell,slot, headerIndex, rowIndex}">
                                <div class="h-[32px] mx-0.5 space-x-0.5 w-full flex items-center">
                                    <Button
                                        v-if="creatingEmployee"
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="slot.buttonSize"
                                        :disabled="disableActions"
                                        :icon="'mdi:delete-forever'"
                                        @click="deleteRow(rowIndex)"/>
                                    <Button
                                        class="w-min"
                                        :variant="'outline'"
                                        :size="slot.buttonSize"
                                        :disabled="disableActions"
                                        :icon="'mdi:pen'"
                                        @click="createOrEdit(cell, rowIndex)"/>
                                </div>
                            </template>
                            <template v-slot:cell.status="{cell, slot, scrollReference}">
                                <div class="p-[3px]">{{cell.status.text}}</div>
                            </template>
                            <template v-slot:cell.employment_type="{cell, slot, scrollReference}">
                                <div class="p-[3px]">{{cell.employment_type.text}}</div>
                            </template>
                            <template v-slot:cell.end_of_service_type="{cell, slot, scrollReference}">
                                <div class="p-[3px]">{{cell.end_of_service_type?.text}}</div>
                            </template>
                        </DataTable>
                    </div>

                    <div class="lg:col-span-1 px-2 pb-2 space-y-2">

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {TableHeaderT} from "@/public/js/types/data";

const nuxtApp = useNuxtApp();
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

const props = defineProps({
    creatingOrEditing: {
        type: Boolean,
        default: false,
    },
    childComponentEmployeePayload: {
        type: Object,
        default: () => {
            return {};
        }
    },
    employmentProfilesPending: {
        type: Boolean,
        default: false,
    },
    employmentProfilesData: {
        type: Array,
        default: () => {
            return [];
        }
    },
    disableActions: {
        type: Boolean,
        default: false,
    },

    isolated: {
        type: Boolean,
        default: false,
    },
});

const employeePayload = toRef(props, 'childComponentEmployeePayload');

const emit = defineEmits([
    'update:creatingOrEditing',
    'update:employmentProfilesPending',
    'update:employmentProfilesData',
    'resolved'
]);

const proxyCreatingOrEditing = computed({
    get() {
        return props.creatingOrEditing;
    },
    set(newValue) {
        emit("update:creatingOrEditing", newValue);
    }
});

watch(() => props.childComponentEmployeePayload, async (employeePayload) => {

    if(props.isolated && Boolean(employeePayload.id) && props.employmentProfilesPending){

        await employmentProfileExecute();
        emit('update:employmentProfilesPending', false);
    }
});

const creatingEmployee = computed(() => {
    return !Boolean(props.childComponentEmployeePayload.id);
});
const employeeId = computed(() => {
    return props.childComponentEmployeePayload.id;
});
const employeeUlid = computed(() => {
    return props.childComponentEmployeePayload.ulid;
});

const deleting = ref(false);
const editIndex = ref(-1);
const editPayload = ref({});

const createOrEdit = (attributes = {}, rowIndex = -1) => {
    proxyCreatingOrEditing.value = true;
    if(creatingEmployee.value){
        editIndex.value = rowIndex;
    }

    editPayload.value = attributes;
};

//DataTable
const employmentProfileHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'action'},
    { text: 'Status', value: 'status'},
    { text: 'Employment Type', value: 'employment_type'},
    { text: 'Start Date', value: 'start_date'},
    { text: 'End Of Service Type', value: 'end_of_service_type'},
    { text: 'End Date', value: 'end_date'},
]);

const employmentProfilesData = ref([]);
const employmentProfilesSuccessful = ref(true);
const employmentProfilesMessage = ref('');
const selectedEmploymentProfiles = ref([]);
const employmentProfilesPending = ref(false);
const employmentProfileExecute = async () => {

    if(import.meta.server || creatingEmployee.value){
        emit('update:employmentProfilesPending', false);
        return;
    }

    employmentProfilesPending.value = true;

    await laraFetch(`/api/employee-employment-profiles/${employeeId.value}`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
        }
    },{
        onRequestError: () => {
            employmentProfilesPending.value = false;
            emit('update:employmentProfilesPending', false);
        },
        onResponse: (request, options, response) => {
            employmentProfilesPending.value = false;
            emit('update:employmentProfilesPending', false);
            employmentProfilesSuccessful.value = _get(response, '_data.successful', false);
            employmentProfilesMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            employmentProfilesData.value = _get(response, '_data.values.employment_profiles', []);
            emit('update:employmentProfilesData', employmentProfilesData.value);
        }
    }, false);
}

if(!props.isolated && !creatingEmployee.value){
    await employmentProfileExecute();
}

const disableActions = computed(() => {
    return employmentProfilesPending.value || proxyCreatingOrEditing.value || deleting.value || props.disableActions;
});
const disableDataTable = computed(() => {
    return employmentProfilesPending.value || proxyCreatingOrEditing.value || deleting.value || props.disableActions;
});

const deleteSelected = async () => {

    let selectedIds: number[] = [];

    selectedIds = selectedEmploymentProfiles.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    let batchDelete: Promise<any>[] = [];

    selectedIds.forEach((id) => {
        batchDelete.push(
            new Promise((resolve, reject) => {
                laraFetch(`/api/employment-profile/${id}`, {
                    method: 'DELETE',
                    body:{
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
    selectedEmploymentProfiles.value = [];
    await employmentProfileExecute();

    emit('resolved', employmentProfilesData.value);

    deleting.value = false;
}

const deleteRow = async (rowIndex: number) => {
    employmentProfilesData.value.splice(rowIndex, 1);
    emit('update:employmentProfilesData', employmentProfilesData.value);
}

const employmentProfileModalResolved = (attributes, rowIndex = -1) => {

    if(!creatingEmployee.value){

        employmentProfileExecute();

        emit('resolved', employmentProfilesData.value);
    } else {

        if(_isEmpty(attributes)){
            return 0;
        }

        if(rowIndex >= 0){
            employmentProfilesData.value.splice(rowIndex, 1, attributes);
            emit('update:employmentProfilesData', employmentProfilesData.value);
        } else {
            employmentProfilesData.value.push(attributes);
            emit('update:employmentProfilesData', employmentProfilesData.value);
        }
    }
};

const reset = () => {
    proxyCreatingOrEditing.value = false;
    employmentProfilesData.value = [];
    selectedEmploymentProfiles.value = [];
    editIndex.value = -1;
    editPayload.value = {};
};

defineExpose({
    reset
});
</script>

<style scoped>

</style>