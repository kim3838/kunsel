<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-xl">

                <DialogModal
                    :show="resolvedUserModal"
                    :closeable="false">
                    <template #title>
                        {{resolvedUserModalTitle}}
                    </template>
                    <template #content>

                        <div class="mt-4 space-y-2">

                            <table class="border-separate font-data">
                                <tbody>
                                    <tr><td>Username:</td><td class="pl-2">{{resolvedUser.username}}</td></tr>
                                    <tr><td>Email:</td><td class="pl-2">{{resolvedUser.email}}</td></tr>
                                </tbody>
                            </table>

                            <div class="mt-4 text-sm">
                                An email will be sent to the user regarding their account registration and login credentials.
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex space-x-2 justify-between">
                            <div class="space-x-2 inline-flex items-center">
                                <Button :icon="'ic:sharp-keyboard-arrow-left'" :variant="'outline'" @click="navigateTo({path: `/admin/associated-users`, replace: true})" :label="'Back to users'" />
                                <Button v-if="creatingAssociatedUser" :variant="'outline'" @click="manageCompanyAssignment" :label="'Manage company assignment'" />
                            </div>
                        </div>
                    </template>
                </DialogModal>

                <div class="flex px-[20px] pt-[20px] mb-2" :class="disableActions ? 'pointer-events-none' : ''">
                    <NuxtLink
                        :to="`/admin/associated-users`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="'ic:sharp-keyboard-arrow-left'" :label="''"></Button>
                    </NuxtLink>
                </div>

                <div v-if="!associatedUserSuccessful" class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="associatedUserMessage" />
                    </div>
                </div>

                <div v-if="associatedUserSuccessful" class="px-[20px] space-y-2">

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
                        <div>
                            <InputLabel :size="'sm'" value="Role"/>
                            <MultiSelect :toggleable="false" :selection-max-viewable-line="10" :disabled="disableActions" drop-shadow :size="'md'" :options="roleOptions"/>
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
                            :sup-headers="userCompanyAssignmentSupHeaders"
                            :headers="userCompanyAssignmentHeaders"
                            :size="'lg'"
                            :stripped="true"
                            :rows="userCompanyAssignmentData">
                            <template v-slot:cell.company_assignment_type="{cell, slot, scrollReference}">
                                <div class="mx-0.5 flex items-center h-[32px]">
                                    <SingleSelectWrapper
                                        :disabled="!isAdminInCompany(cell.company_id) || disableActions"
                                        in-horizontal-scrollable
                                        drop-shadow
                                        :scroll-reference="scrollReference"
                                        :none-selected-label="'Not Assigned'"
                                        :label="'Select Company Assignment'"
                                        :icon="companyAssignmentIcon(cell.company_assignment_type)"
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

import type {TableHeaderT, TableSupHeaderT} from "@/public/js/types/data";
import type {UserCompanyAssignmentSyncT, UserCompanyAssignmentT, UserFormT, UserT} from "@/public/js/types/user";
import type {EnumSelection} from "@/public/js/common/type";

useHead({titleTemplate: (titleChunk) => {return `Users`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-in-any-company']});
useLayout().setNavigationMode('solid');

const route = useRoute();
const user = userState();
const {persistAccount} = useAccount();
const {fetchAssociatedCompanies, storeAssociatedCompanies} = useAssociation();
const {timezoneSelections} = useCommon();
const associatedUser = ref<UserT | null>(null);
const associatedUserSuccessful = ref(true);
const associatedUserMessage = ref('');

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

const roleOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: number[]
}>({
    search: '',
    selection: [],
    selected: []
});
const fetchAssociatedRoles = async() => {

    await laraFetch('/api/role-selections', {
        method: 'GET',
        params: {
            filters: {
                account_ids: [persistAccount.value]
            }
        }
    }, {
        onSuccessResponse: async (request, options, response) => {
            roleOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchAssociatedRoles();

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
const userAssociatedCompanyOptions = reactive({
    search: '',
    selection: [],
    selected: []
});
const userAssociatedCompanies = computed(() => {
    return _map(userAssociatedCompanyOptions.selection, 'value');
});
const isAdminInCompany = (companyId: Number | String) => _some(authUserAssociatedCompanies.value, id => id == companyId);

const companyAssignmentIcon = (companyAssignmentType: number | null = null) => {
    if(companyAssignmentType == null){
        return 'tdesign:close-rectangle';
    }

    return {
        [COMPANY_ASSIGNMENT_TYPE.DEFAULT as number]: 'tdesign:user-checked',
        [COMPANY_ASSIGNMENT_TYPE.ADMIN as number]: 'tdesign:secured'
    }[companyAssignmentType];
}

// Fetch User Information
const fetchAssociatedUser = async () => {

    if(import.meta.server || route.params.id === 'create-user'){return;}

    await laraFetch(`/api/user/${route.params.id}`, {
        method: 'GET',
        params: {
            account_id: persistAccount.value
        }
    }, {
        onResponse: (request, options, response) => {
            associatedUserSuccessful.value = _get(response, '_data.successful', false);
            associatedUserMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            associatedUser.value = _get(response, '_data.values.user', null) as UserT;
            username.value = _get(response, '_data.values.user.username', '');
            email.value = _get(response, '_data.values.user.email', '');
            emailVerifiedAt.value = _get(response, '_data.values.user.email_verified_at', '');
            userStatusOptions.selected = _get(response, '_data.values.user.status.value', userStatusOptions.selected);
            timezoneOptions.selected = _get(response, '_data.values.user.timezone', null);
            roleOptions.selected = _get(response, '_data.values.user.roles', []);
        },
    }, false);
};
await fetchAssociatedUser();

// Fetch Authenticated User Associated Companies
const fetchAuthUserAssociatedCompanies = async() => {

    if(import.meta.server){return;}

    await laraFetch("/api/associated-company-selections", {
        method: 'GET',
        params: {
            filters: {
                user_id: user?.value?.id,
                assignment_types: [COMPANY_ASSIGNMENT_TYPE.ADMIN],
            }
        }
    }, {
        onSuccessResponse: async (request, options, response) => {
            authUserAssociatedCompanyOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchAuthUserAssociatedCompanies();

// Fetch User Associated Companies
const fetchUserAssociatedCompanies = async() => {

    if(import.meta.server || route.params.id === 'create-user' || associatedUser.value == null){return;}

    await laraFetch("/api/associated-company-selections", {
        method: 'GET',
        params: {
            filters: {
                user_id: associatedUser.value.id,
                assignment_types: [COMPANY_ASSIGNMENT_TYPE.DEFAULT, COMPANY_ASSIGNMENT_TYPE.ADMIN],
            }
        }
    }, {
        onSuccessResponse: async (request, options, response) => {
            userAssociatedCompanyOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchUserAssociatedCompanies();

const userCompanyAssignmentSupHeaders = reactive<TableSupHeaderT[]>([
    {text: '', colspan: 3, alignHeader: 'left'},
    {text: 'Employee', colspan: 3, alignHeader: 'left'},
]);
const userCompanyAssignmentHeaders = reactive<TableHeaderT[]>([
    { text: 'Company', value: 'company_name', alignData: 'left'},
    { text: 'Code', value: 'company_code', alignData: 'left'},
    { text: 'Company Assignment', value: 'company_assignment_type', alignData: 'left'},
    { text: 'Is Employee', value: 'is_employee', alignData: 'left'},
    { text: 'Employee #', value: 'employee_number', alignData: 'left'},
    { text: 'Name', value: 'employee_full_name', alignData: 'left'},
]);
const userCompanyAssignmentData  = ref<UserCompanyAssignmentT[]>([]);
// Fetch User Company Assignment
const fetchUserCompanyAssignment = async () => {

    if(import.meta.server || route.params.id === 'create-user' || associatedUser.value == null){return;}

    await laraFetch(`/api/user-company-assignment`, {
        method: 'GET',
        params: {
            filters: {
                user_id: associatedUser.value.id,
                associated_companies: _uniq(authUserAssociatedCompanies.value.concat(userAssociatedCompanies.value)),
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
    return !creatingAssociatedUser.value ? `/api/user/${associatedUser.value?.id}` : `/api/user`;
});

const userFormBody = computed(() => {
    let formBody: UserFormT = {
        account_id: persistAccount.value,
        status: userStatusOptions.selected as number,
        timezone: timezoneOptions.selected,
        role_ids: roleOptions.selected
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
    const form = {
        account_id: persistAccount.value
    };

    const assignments: UserCompanyAssignmentSyncT = {};

    userCompanyAssignmentData.value.forEach((assignment) => {
        if (assignment.company_assignment_type !== null) {
            assignments[assignment.company_id] = {
                'assignment_type': assignment.company_assignment_type
            };
        }
    });

    return {
        ...form,
        assignments: assignments
    };

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

    await laraFetch(`/api/user-company-assignment-sync/${userId}`, {
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
            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `User updated`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });

            await fetchAssociatedCompanies();
            await storeAssociatedCompanies();
        },
    });
}

const createUserFormPending = ref(false);
const createUserFormSubmitLabel = computed(() => {
    return (createUserFormPending.value) ? 'Please wait' : 'Create';
});
const createUserFormBody = computed(() => {
    return {
        account_id: persistAccount.value,
        name: username.value,
        email: email.value,
        password: password.value,
        password_confirmation: confirmPassword.value,
        status: userStatusOptions.selected,
        timezone: timezoneOptions.selected,
        role_ids: roleOptions.selected
    };
});

const createUserFormSubmit = async() => {

    createUserFormPending.value = true;

    await laraFetch(`/api/user`, {
        method: 'POST',
        body: createUserFormBody.value,
    }, {
        onRequestError: () => {
            createUserFormPending.value = false;
        },
        onResponse: () => {
            createUserFormPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            createUserFormPending.value = true;

            resolvedUser.value = _get(response, '_data.values.user', {}) as UserT;
            resolvedUserModal.value = true;
        },
    });
}

const resolvedUserModal = ref(false);
const resolvedUser = ref<Partial<UserT>>({});
const resolvedUserModalTitle = computed(() => {
    return `User ${creatingAssociatedUser.value ? 'Created' : 'Updated'}`;
})

const manageCompanyAssignment = async () => {
    const userUlid = _get(resolvedUser.value, 'ulid', null);
    await navigateTo({path: `/admin/associated-users/${userUlid}`, replace: true})
}
</script>

<style scoped>

</style>