<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <div class="flex px-[20px] pt-[20px] mb-2">
                    <NuxtLink
                        :to="`/admin/roles`">
                        <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                    </NuxtLink>
                </div>

                <div v-if="!roleSuccessful" class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="roleMessage" />
                    </div>
                </div>

                <div v-if="roleSuccessful" class="px-[20px] space-y-2">

                    <div class="text-lg font-header">Role</div>

                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        <div>
                            <InputLabel :size="'sm'" value="Account"/>
                            <SingleSelect :disabled="!creatingRole" :icon="'mdi:checkbook'" value-persist drop-shadow :size="'md'" :options="accountOptions"/>
                        </div>
                        
                        <div class="col-span-2">
                            <InputLabel :size="'sm'" value="Name"/>
                            <Input :size="'md'" v-model="roleName" type="text"/>
                        </div>
                    </div>

                    <div class="text-lg font-header">Permissions</div>

                    <Suspense>
                        <Permissions :role-permissions="rolePermissions" />
                        <template #fallback>
                            <div class="flex items-center min-h-8">
                                <UnorderedList
                                    :icon="'eos-icons:loading'"
                                    :size="'md'"
                                    :label="'Loading Permissions...'"/>
                            </div>
                        </template>
                    </Suspense>

                    <Button class="w-min" ref="submitButton" type="submit" @click="formSubmit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="submitLabel"></Button>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">

import type {RolePermissionT, RoleT} from "@/public/js/types/role_permission";
import type {SelectDataType} from "@/public/js/types/form";
import type {EnumSelection} from "@/public/js/common/type";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Roles`}});
definePageMeta({middleware: ['auth', 'admin-in-any-company']});
useLayout().setNavigationMode('solid');

const user = userState();
const {persistAccount, storePersistAccount} = useAccount();
const route = useRoute();
const role = ref<Partial<RoleT>>({});
const rolePermissions = ref<RolePermissionT>({});
const selectedPermissionIds = computed(() => {
    return Object.values(rolePermissions.value)
        .filter(permission => permission.value === true)
        .map(permission => permission.id)
})
const roleSuccessful = ref(true);
const roleMessage = ref('');
const creatingRole = computed(() => {
    return route.params.id === 'create-role';
});
const roleName = ref('');

const accountOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: string | number | null
}>({
    search: '',
    selection: [],
    selected: null
});

const fetchAssociatedAccounts = async() => {

    await laraFetch("/api/associated-account-selections", {
        method: 'GET',
        params: {
            filters: {
                user_id: user?.value?.id,
                assignment_type: [COMPANY_ASSIGNMENT_TYPE.ADMIN],
            }
        }
    }, {
        onSuccessResponse: async (request, options, response) => {
            accountOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchAssociatedAccounts();

//Fetch Role Information
const fetchRole = async () => {

    if(import.meta.server) return;

    if(route.params.id === 'create-role'){

        await laraFetch(`/api/role-permission-template`, {
            method: 'GET',
        }, {
            onSuccessResponse: async (request, options, response) => {
                rolePermissions.value = _get(response, '_data.values.role_permissions', {}) as RolePermissionT;
            },
        }, false);

        if(accountOptions.selection.map((item: SelectDataType) => item.value).indexOf(persistAccount.value as number) >= 0){
            accountOptions.selected = persistAccount.value as number;
        } else {
            accountOptions.selected = accountOptions.selection[0]?.value ?? null;
            storePersistAccount(accountOptions.selected as number);
        }

        return;
    }

    await laraFetch(`/api/role/${route.params.id}`, {
        method: 'GET',
    }, {
        onResponse: (request, options, response) => {
            roleSuccessful.value = _get(response, '_data.successful', false);
            roleMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            role.value = _get(response, '_data.values.role', {}) as RoleT;
            accountOptions.selected = _get(response, '_data.values.role.account_id', null);
            roleName.value = _get(response, '_data.values.role.name', '');
            rolePermissions.value = _get(response, '_data.values.role_permissions', {}) as RolePermissionT;
        },
    }, false);
};

await fetchRole();

const formPending = ref(false);
const disableActions = computed(() => {
    return formPending.value
});

const submitLabel = computed(() => {
    return formPending.value ? 'Please wait' : (!creatingRole.value ? 'Save' : 'Submit');
});
const submitAction = computed(() => {
    return !creatingRole.value ? 'PATCH' : 'POST';
});
const submitPath = computed(() => {
    return !creatingRole.value ? `/api/role/${role.value.ulid}` : `/api/role`;
});
const formBody = computed(() => {

    return {
        account_id: accountOptions.selected,
        name: roleName.value,
        permission_ids: selectedPermissionIds.value,
    };
});

const formSubmit = async() => {
    formPending.value = true;

    await laraFetch(submitPath.value, {
        method: submitAction.value,
        body: formBody.value,
    }, {
        onRequestError: () => {
            formPending.value = false;
        },
        onResponse: () => {
            formPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {
            useNuxtApp().$promptStore.setPrompt({
                resetable: false,
                icon: null,
                title: `Request successful`,
                message: `Role ${creatingRole.value ? 'Created' : 'Updated'}`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        },
    });
}
</script>

<style scoped>

</style>