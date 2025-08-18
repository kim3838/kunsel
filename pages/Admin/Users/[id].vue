<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/admin/users`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <div class="px-[20px] space-y-2">

                    <div class="text-lg font-header">User</div>

                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6">
                        <div>
                            <InputLabel :size="'sm'" value="Username"/>
                            <Input :disabled="!creatingAssociatedUser || disableActions" :size="'md'" v-model="username" type="text"/>
                        </div>
                        <div class="lg:col-span-2">
                            <InputLabel :size="'sm'" :value="emailLabelComputed.label" :class="emailLabelComputed.class"/>
                            <Input :disabled="!creatingAssociatedUser || disableActions" :size="'md'" v-model="email" type="email"/>
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-2 lg:grid-cols-5 xl:grid-cols-6">
                        <div v-if="creatingAssociatedUser">
                            <InputLabel :size="'sm'" :value="'Password'"/>
                            <Input :disabled="disableActions" :size="'md'" v-model="password" type="password"/>
                        </div>
                        <div v-if="creatingAssociatedUser">
                            <InputLabel :size="'sm'" :value="'Re-type Password'"/>
                            <Input :disabled="disableActions" :size="'md'" v-model="confirmPassword" type="password"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Status"/>
                            <SingleSelect :icon="'mdi:checkbook'" :disabled="disableActions" value-persist drop-shadow :size="'md'" :options="userStatusOptions"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Timezone"/>
                            <SingleSelect :icon="'stash:globe-timezone-solid'" :disabled="disableActions" value-persist drop-shadow :size="'md'" :options="timezoneOptions"/>
                        </div>
                    </div>

                    <div v-if="creatingAssociatedUser" class="grid gap-2 grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                        <Button class="w-min" :disabled="disableActions" @click="createUserFormSubmit" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="createUserFormSubmitLabel"></Button>
                    </div>

                    <div class="mt-4 space-y-2">
                        <div v-if="!creatingAssociatedUser" class="text-lg font-header">
                            Company Assignment
                        </div>

                        <DataTable
                            v-if="!creatingAssociatedUser"
                            :headers="userCompanyAssignmentHeaders"
                            :size="'lg'"
                            :rows="userCompanyAssignmentData">
                            <template v-slot:cell.company_assignment_type="{cell, slot, scrollReference}">
                                <div class="p-[1px]">
                                    <SingleSelectWrapper
                                        in-horizontal-scrollable
                                        drop-shadow
                                        :scroll-reference="scrollReference"
                                        :none-selected-label="'Not Assigned'"
                                        :label="'Select Company Assignment'"
                                        :icon="cell.company_assignment_type == null ? 'ic:baseline-assignment-late' : 'ic:baseline-assignment-ind'"
                                        value-persist
                                        :size="slot.selectSize"
                                        v-model="cell.company_assignment_type"
                                        :options="companyAssignmentTypeOptions"
                                    />
                                </div>
                            </template>
                            <template v-slot:cell.is_employee="{cell, slot}">
                                <div class="flex justify-center">
                                    <NonModelCheckBox v-if="cell.is_employee" disabled :size="slot.checkBoxSize" :checked="cell.is_employee" ></NonModelCheckBox>
                                </div>
                            </template>
                        </DataTable>
                    </div>

                    <div v-if="!creatingAssociatedUser" class="grid gap-2 grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                        <Button class="w-min" :disabled="disableActions" @click="userFormSubmit" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="userFormSubmitLabel"></Button>
                    </div>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">

import type {TableHeaderT} from "@/public/js/types/data";

useLayout().setNavigationMode('solid', 'Associated-Users/[id].vue');

const route = useRoute();
const user = userState();
const {fetchAssociatedCompanies, storeAssociatedCompanies} = useAssociation();
const {timezoneSelections} = useCommon();
const associatedUser = ref(null);

definePageMeta({
    middleware: ['auth', 'super-admin'],
    validate: async (route) => {

        if (import.meta.server) return true;

        let create = route.params.id === 'create-user';

        if(create){return true;}

        await laraFetch(`/api/user-check/${route.params.id}`, {
            method: 'GET'
        }, {
            onSuccessResponse: async (request, options, response) => {
                associatedUser.value = _get(response, '_data.values.user', null);
            }
        }, false);

        return !_isEmpty(associatedUser.value);
    }
});

const creatingAssociatedUser = computed(() => {
    return route.params.id === 'create-user';
});
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const userStatusOptions = reactive({
    search: '',
    selection: [
        {text : 'Active', value: USER_STATUS.ACTIVE},
        {text : 'Inactive', value: USER_STATUS.INACTIVE},
    ],
    selected: USER_STATUS.ACTIVE
});
const emailVerifiedAt = ref('');
const emailLabelComputed = computed(() => {

    let labelValue = creatingAssociatedUser.value ? 'Email' : (emailVerifiedAt.value ? 'Email Verified' : 'Email Not Verified');
    let labelClass = creatingAssociatedUser.value ? '' : (emailVerifiedAt.value ? 'text-green-500' : 'text-red-500');

    return {
        'class': labelClass,
        'label': labelValue
    };
});
const timezoneOptions = reactive({
    search: '',
    selection: timezoneSelections.value,
    selected: null
});

const companyAssignmentTypeOptions = reactive({
    search: '',
    selection: [
        {text : 'Not Assigned', value: null},
        {text : 'Default', value: COMPANY_ASSIGNMENT_TYPE.DEFAULT},
        {text : 'Admin', value: COMPANY_ASSIGNMENT_TYPE.ADMIN},
    ]
});

const authUserAssociatedCompanyOptions = reactive({
    search: '',
    selection: [],
    selected: []
});
const authUserAssociatedCompanies = computed(() => {
    return _map(authUserAssociatedCompanyOptions.selection, 'value');
});

// Fetch User Information
const fetchAssociatedUser = async () => {
    if(route.params.id === 'create-user'){return;}

    await laraFetch(`/api/user/${route.params.id}`, {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            associatedUser.value = _get(response, '_data.values.user', null);
            username.value = _get(response, '_data.values.user.username', '');
            email.value = _get(response, '_data.values.user.email', '');
            emailVerifiedAt.value = _get(response, '_data.values.user.email_verified_at', '');
            userStatusOptions.selected = _get(response, '_data.values.user.status.value', userStatusOptions.selected);
            timezoneOptions.selected = _get(response, '_data.values.user.timezone', null);
        },
    });
};
await fetchAssociatedUser();

// Fetch Authenticated User Associated Companies
const fetchAuthUserAssociatedCompanies = async() => {

    await laraFetch("/api/company-selections", {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            authUserAssociatedCompanyOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchAuthUserAssociatedCompanies();

const userCompanyAssignmentHeaders = reactive<TableHeaderT[]>([
    { text: 'Company', value: 'company_name', alignData: 'left'},
    { text: 'Code', value: 'company_code', alignData: 'left'},
    { text: 'Company Assignment', value: 'company_assignment_type', alignData: 'left'},
    { text: 'Is Employee', value: 'is_employee', alignData: 'left'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left'},
]);
const userCompanyAssignmentData  = ref([]);
// Fetch User Company Assignment
const fetchUserCompanyAssignment = async () => {
    if(route.params.id === 'create-user'){return;}

    await laraFetch(`/api/user-company-assignment/${route.params.id}`, {
        method: 'GET',
        params: {
            filters: {
                user_id: associatedUser.value.id,
                associated_companies: authUserAssociatedCompanies.value,
            }
        }
    }, {
        onSuccessResponse: async (request, options, response) => {
            userCompanyAssignmentData.value = _get(response, '_data.values.company_assignment', []);
        },
    });
};
await fetchUserCompanyAssignment();

const userFormPending = ref(false);
const userCompanyAssignmentFormPending = ref(false);

const disableActions = computed(() => {
    return userFormPending.value || userCompanyAssignmentFormPending.value || createUserFormPending.value
});

const userFormSubmitLabel = computed(() => {
    return (userFormPending.value || userCompanyAssignmentFormPending.value) ? 'Please wait' : (!creatingAssociatedUser.value ? 'Save' : 'Submit');
});
const userFormSubmitAction = computed(() => {
    return !creatingAssociatedUser.value ? 'PATCH' : 'POST';
});
const userFormSubmitPath = computed(() => {
    return !creatingAssociatedUser.value ? `/api/user/${associatedUser.value.id}` : `/api/user`;
});

const userFormBody = computed(() => {
    let formBody = {
        status: userStatusOptions.selected,
        timezone: timezoneOptions.selected,
    };

    if(creatingAssociatedUser.value){
        formBody = {
            ...formBody,
            name: username.value,
            email: email.value,
            password: password.value,
            password_confirmation: confirmPassword.value,
        }
    }

    return formBody;
});
const userCompanyAssignmentFormBody = computed(() => {
    const assignments = {};

    userCompanyAssignmentData.value.forEach((assignment) => {
        if (assignment.company_assignment_type !== null) {
            assignments[assignment.company_id] = {
                'assignment_type': assignment.company_assignment_type
            };
        }
    });

    return assignments;

});

const userFormSubmit = async() => {
    userFormPending.value = true;

    await laraFetch(userFormSubmitPath.value, {
        method: userFormSubmitAction.value,
        body: userFormBody.value,
    }, {
        onRequestError: () => {
            userFormPending.value = false;
        },
        onResponse: () => {
            userFormPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            const userId = _get(response, '_data.values.user.id', null);
            await userCompanyAssignmentFormSubmit(userId);
        },
    });
}

const userCompanyAssignmentFormSubmit = async(userId = null) => {

    if(!Boolean(userId)){return;}

    userCompanyAssignmentFormPending.value = true;

    await laraFetch(`/api/user-company-assignment/${userId}`, {
        method: 'POST',
        body: userCompanyAssignmentFormBody.value,
    }, {
        onRequestError: () => {
            userCompanyAssignmentFormPending.value = false;
        },
        onResponse: () => {
            userCompanyAssignmentFormPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            await fetchAssociatedCompanies();
            await storeAssociatedCompanies();
            await navigateTo({
                path: '/admin/users',
            });
        },
    });
}

const createUserFormPending = ref(false);
const createUserFormSubmitLabel = computed(() => {
    return (createUserFormPending.value) ? 'Please wait' : 'Create';
});
const createUserFormBody = computed(() => {
    return {
        'name': username.value,
        'email': email.value,
        'password': password.value,
        'password_confirmation': confirmPassword.value,
        'status': userStatusOptions.selected,
        'timezone': timezoneOptions.selected
    };
});

const createUserFormSubmit = async() => {

    userCompanyAssignmentFormPending.value = true;

    await laraFetch(`/api/user`, {
        method: 'POST',
        body: createUserFormBody.value,
    }, {
        onRequestError: () => {
            userCompanyAssignmentFormPending.value = false;
        },
        onResponse: () => {
            userCompanyAssignmentFormPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            const userUlid = _get(response, '_data.values.user.ulid', null);
            await navigateTo({path: `/admin/users/${userUlid}`, replace: true});
        },
    });
}


</script>

<style scoped>

</style>