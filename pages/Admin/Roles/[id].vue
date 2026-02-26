<template>
    <div>
        <AdminWrapper>
            <div>
                <div ref="nav-extender" class="z-30 fixed nav-extender-container scaffold-border-bottom">

                    <div class="mx-auto max-w-screen-2xl space-y-2 p-[20px]">
                        <div class="flex">
                            <NuxtLink
                                :to="`/admin/roles`">
                                <Button class="w-min" :variant="`outline`" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'ic:sharp-keyboard-arrow-left'" :label="disableActions ? 'Please wait' : ''"></Button>
                            </NuxtLink>
                        </div>

                        <div v-if="!roleSuccessful">
                            <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                                <Label invert :size="'md'" :type="'danger'" :label="roleMessage" />
                            </div>
                        </div>

                        <div class="text-lg font-header">Role</div>

                        <div class="grid gap-2 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            <div>
                                <InputLabel :size="'sm'" value="Account"/>
                                <SingleSelect :disabled="!creatingRole" :icon="'mdi:checkbook'" value-persist drop-shadow :size="'md'" :options="accountOptions" @valueChange="selectedAccountChanged"/>
                            </div>

                            <div class="col-span-2">
                                <InputLabel :size="'sm'" value="Name"/>
                                <Input :size="'md'" v-model="roleName" type="text"/>
                            </div>

                            <div class="flex flex-col">
                                <div class="flex-none h-[1.25rem]"></div>
                                <Button class="w-min" ref="submitButton" type="submit" @click="formSubmit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="submitLabel"></Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mx-auto max-w-screen-2xl">
                    <div class="px-[20px] space-y-2 nav-extender-allocate">

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
                    </div>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {RolePermissionT, RoleT} from "@/public/js/types/role-permission";
import type {SelectDataType} from "@/public/js/types/form";
import type {EnumSelection} from "@/public/js/common/type";

useHead({titleTemplate: (titleChunk) => {return `Roles`}});
definePageMeta({middleware: ['auth', 'verified', 'admin-in-any-company']});
useLayout().setNavigationMode('solid');

const user = userState();
const {navigationBackground} = useLayout();
const navExtender = useTemplateRef('nav-extender');
const { height: navExtenderReferenceHeight} = useElementSize(navExtender);
const navExtenderAllocation = ref(0);
const navExtenderAllocationComputed = computed(() => {
    return `calc(${(navExtenderAllocation.value + 'px')} + 20px)`;
});
const {userIsSuperAdmin} = useAuth();
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

    let associatedAccountsApi = userIsSuperAdmin.value ? '/api/account-selections' : '/api/associated-account-selections';
    let associatedAccountsApiFilters = userIsSuperAdmin.value ? {} : {
        user_id: user?.value?.id,
        assignment_types: [COMPANY_ASSIGNMENT_TYPE.ADMIN],
    };

    await laraFetch(associatedAccountsApi, {
        method: 'GET',
        params: {
            filters: associatedAccountsApiFilters
        }
    }, {
        onSuccessResponse: async (request, options, response) => {
            accountOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchAssociatedAccounts();

const selectedAccountChanged = async (selectedAccount: SelectDataType) => {

    storePersistAccount(accountOptions.selected as number);
}

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

watch(navExtenderReferenceHeight, () => {
    navExtenderAllocation.value = navExtenderReferenceHeight.value;
});
onMounted(async () => {
    navExtenderAllocation.value = navExtenderReferenceHeight.value;
});
</script>

<style lang="scss" scoped>
.nav-extender-container{
    background-color: v-bind(navigationBackground) !important;
    left: 0;
    right: var(--scrollbar-width);
}
.nav-extender-allocate {
    padding-top: v-bind(navExtenderAllocationComputed);
}
</style>