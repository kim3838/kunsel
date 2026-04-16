<template>
    <div class="flex">
        <EmployeeIdentificationModal
            v-model:creatingOrEditing="proxyCreatingOrEditing"
            v-model:employeePayload="employeePayload"
            v-model:editPayloadIndex="editIndex"
            v-model:editPayload="editPayload"
            @resolved="employeeIdentificationModalResolved"
        ></EmployeeIdentificationModal>

        <div class="flex-1 lining-shadow rounded-sm tint-background">

            <div v-if="!isolated" class="neutral-border-bottom rounded-t-sm text-lg font-medium font-header px-4 py-2">Identifications</div>

            <div class="p-4">

                <div v-if="false">
                    <span class="font-semibold">Employee Payload:</span> {{childComponentEmployeePayload}}<br>
                    <span class="font-semibold">Employee Ulid:</span> {{employeeUlid}}<br>
                    <span class="font-semibold">Edit Payload Index:</span> {{editIndex}}<br>
                    <span class="font-semibold">Props Disable Actions:</span> {{props.disableActions}}<br>
                    <span class="font-semibold">Employment Profiles:</span> {{employeeIdentificationsData}}<br>
                    <span class="font-semibold">Employment Profiles[1]:</span> {{employeeIdentificationsData[1]}}<br>
                    <span class="font-semibold">Selected Employment Profiles:</span> {{selectedEmployeeIdentificationsData}}<br>
                </div>

                <div class="grid grid-cols-1 md:gap-2 lg:grid-cols-1">
                    <div class="space-y-2">
                        <div v-if="employeeIdentificationsSuccessful" class="inline-flex gap-2 items-center">
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
                                :icon="'ph:trash-simple'"
                                :disabled="disableActions"
                                @click="deleteSelected()" />
                            <Button
                                v-if="!creatingEmployee"
                                class="w-min"
                                :variant="'outline'"
                                :size="'sm'"
                                :icon="'ic:sharp-restart-alt'"
                                :disabled="disableActions"
                                @click="employeeIdentificationsExecute" />
                            <UnorderedList
                                v-if="disableActions"
                                :icon="'eos-icons:loading'"
                                :size="'md'"
                                :label="'Please wait...'"/>
                        </div>

                        <div v-if="!employeeIdentificationsSuccessful" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                            <Label invert :size="'md'" :type="'danger'" :label="employeeIdentificationsMessage" />
                        </div>

                        <DataTable
                            v-if="employeeIdentificationsSuccessful"
                            :headers="employmentProfileHeaders"
                            :size="'lg'"
                            :rows="employeeIdentificationsData"
                            :disabled="disableDataTable"
                            v-model="selectedEmployeeIdentificationsData"
                            selection>
                            <template v-slot:cell.action="{cell,slot, headerIndex, rowIndex}">
                                <div class="h-[32px] w-full flex items-center gap-2" :class="disableActions ? 'pointer-events-none' : ''">
                                    <div
                                        v-if="creatingEmployee"
                                        class="text-base h-full px-1 gap-0.5 flex items-center justify-center cursor-pointer accent-hover"
                                        @click="deleteRow(rowIndex)">
                                        <span class="font-narrow-thin">Delete</span>
                                        <Icon class="h-5 w-5" :name="'mdi:delete-forever'"/>
                                    </div>

                                    <div
                                        class="text-base h-full px-1 gap-0.5 flex items-center justify-center cursor-pointer accent-hover"
                                        @click="createOrEdit(cell, rowIndex)">
                                        <span class="font-narrow-thin">Edit</span>
                                        <Icon class="h-5 w-5" :name="'gg:external'"/>
                                    </div>
                                </div>
                            </template>
                            <template v-slot:cell.type="{cell, slot, scrollReference}">
                                <div class="p-[3px]">{{cell.type.text}}</div>
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
    employeeIdentificationsPending: {
        type: Boolean,
        default: false,
    },
    employeeIdentificationsData: {
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
    'update:employeeIdentificationsPending',
    'update:employeeIdentificationsData',
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

    if(props.isolated && Boolean(employeePayload.id) && props.employeeIdentificationsPending){

        await employeeIdentificationsExecute();
        emit('update:employeeIdentificationsPending', false);
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
    { text: 'Type', value: 'type'},
    { text: 'Number', value: 'number'},
    { text: 'Readable number', value: 'readable_number'},
]);

const employeeIdentificationsData = ref([]);
const employeeIdentificationsSuccessful = ref(true);
const employeeIdentificationsMessage = ref('');
const selectedEmployeeIdentificationsData = ref([]);
const employeeIdentificationsPending = ref(false);
const employeeIdentificationsExecute = async () => {

    if(import.meta.server || creatingEmployee.value){
        emit('update:employeeIdentificationsPending', false);
        return;
    }

    employeeIdentificationsPending.value = true;

    await laraFetch(`/api/employee-employee-identifications/${employeeId.value}`, {
        method: 'GET',
        params: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
        }
    },{
        onRequestError: () => {
            employeeIdentificationsPending.value = false;
            emit('update:employeeIdentificationsPending', false);
        },
        onResponse: (request, options, response) => {
            employeeIdentificationsPending.value = false;
            emit('update:employeeIdentificationsPending', false);
            employeeIdentificationsSuccessful.value = _get(response, '_data.successful', false);
            employeeIdentificationsMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            employeeIdentificationsData.value = _get(response, '_data.values.identifications', []);
            emit('update:employeeIdentificationsData', employeeIdentificationsData.value);
        }
    }, false);
}

if(!props.isolated && !creatingEmployee.value){
    await employeeIdentificationsExecute();
}

const disableActions = computed(() => {
    return employeeIdentificationsPending.value || proxyCreatingOrEditing.value || deleting.value || props.disableActions;
});
const disableDataTable = computed(() => {
    return employeeIdentificationsPending.value || proxyCreatingOrEditing.value || deleting.value || props.disableActions;
});

const deleteSelected = async () => {

    let selectedIds: number[] = [];

    selectedIds = selectedEmployeeIdentificationsData.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/employee-identifications", {
        method: 'DELETE',
        body: {
            account_id: selectedAssociatedCompanyAccountId.value,
            company_id: selectedAssociatedCompanyId.value,
            employee_identification_ids: selectedIds,
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
                message: `Employee identification${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedEmployeeIdentificationsData.value = [];
    await employeeIdentificationsExecute();

    emit('resolved', employeeIdentificationsData.value);

    deleting.value = false;
}

const deleteRow = async (rowIndex: number) => {
    employeeIdentificationsData.value.splice(rowIndex, 1);
    emit('update:employeeIdentificationsData', employeeIdentificationsData.value);
}

const employeeIdentificationModalResolved = (attributes, rowIndex = -1) => {

    if(!creatingEmployee.value){

        employeeIdentificationsExecute();

        emit('resolved', employeeIdentificationsData.value);
    } else {

        if(_isEmpty(attributes)){
            return 0;
        }

        let identificationTypeValue = attributes.type.value;

        if(rowIndex >= 0){

            let existingIdentificationType = employeeIdentificationsData.value.filter(identification => identification.type.value == identificationTypeValue);

            if(existingIdentificationType.length > 0){
                //Delete editing
                employeeIdentificationsData.value.splice(rowIndex, 1);
                //Remove all same identification types
                employeeIdentificationsData.value = employeeIdentificationsData.value.filter(identification => identification.type.value !== identificationTypeValue);
                //Add new identification as new record instead of patching existing record
                employeeIdentificationsData.value.push(attributes);

            } else {

                employeeIdentificationsData.value.splice(rowIndex, 1, attributes);
            }

            emit('update:employeeIdentificationsData', employeeIdentificationsData.value);

        } else {

            employeeIdentificationsData.value = employeeIdentificationsData.value.filter(identification => identification.type.value !== identificationTypeValue);

            employeeIdentificationsData.value.push(attributes);

            emit('update:employeeIdentificationsData', employeeIdentificationsData.value);
        }
    }
};

const reset = () => {
    proxyCreatingOrEditing.value = false;
    employeeIdentificationsData.value = [];
    selectedEmployeeIdentificationsData.value = [];
    editIndex.value = -1;
    editPayload.value = {};
};

defineExpose({
    reset
});
</script>

<style scoped>

</style>