<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">

                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div>
                            <InputLabel :size="'sm'" value="Account" />
                            <SingleSelect :disabled="disableActions" glint drop-shadow :selection-max-viewable-line="5" value-persist :size="'md'" :options="accountOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Search" />
                            <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.search.keyword" class="w-full" placeholder="Search" type="text"/>
                        </div>
                    </div>

                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                    </div>

                    <div>
                        <PageInformation :pagination="roles.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="roles.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </form>

                <div class="px-[20px]">
                    <div class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <UnorderedList v-if="disableActions" :icon="'eos-icons:loading'" :size="'md'" :label="'Please wait...'"/>
                        <NuxtLink
                            v-else
                            :to="`/admin/roles/create-role`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="disableActions ? 'Please wait' : ''"></Button>
                        </NuxtLink>
                        <Button v-if="!disableActions" :variant="'outline'" :icon="'mdi:delete-outline'" class="inline-block" :size="'sm'" :disabled="disableActions" :label="'Delete selected'" @click="confirmDeleteSelected"/>
                    </div>

                    <div v-if="!roles.successful" class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="roles.message" />
                    </div>

                    <DataTable
                        v-if="roles.successful"
                        :headers="rolesHeaders"
                        :size="'lg'"
                        :rows="roles.data"
                        :disabled="disableDataTable"
                        v-model="selectedRoles"
                        selection>
                        <template v-slot:cell.actions="{cell,slot}">
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
                                        {type: 'link',icon: 'mdi:pen',title: 'Edit',to: `/admin/roles/${cell.ulid}`},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT} from "@/public/js/types/data";
import type {EnumSelection} from "@/public/js/common/type";

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Roles`}});
definePageMeta({middleware: ['auth', 'admin-in-any-company']});
useLayout().setNavigationMode('solid');

const rolesHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions'},
    { text: 'Name', value: 'name', alignData: 'left'},
]);

const roles = reactive<DataTableT>({
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
    'successful': true,
    'message': ''
});
const accountOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: string | number | null
}>({
    search: '',
    selection: [],
    selected: null
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
    perPage: 25,
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
        account_id: accountOptions.selected,
        filters: {
            'search': filters.search.keyword,
            'account_id': accountOptions.selected
        }
    };
});

const fetchAccounts = async() => {

    await laraFetch("/api/account-selections", {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            accountOptions.selection = _get(response, '_data.values.selection', []);

            accountOptions.selected = accountOptions.selection[0]?.value ?? null;
        }
    })
}
await fetchAccounts();

const rolesPending = ref(false);
const selectedRoles = ref([]);
const rolesExecute = async () => {

    if(import.meta.server){return;}

    rolesPending.value = true;

    await laraFetch("/api/roles", {
        method: 'GET',
        params: paramsComputed.value
    },{
        onRequestError: () => {
            rolesPending.value = false;
        },
        onResponse: (request, options, response) => {
            rolesPending.value = false;
            roles.successful = _get(response, '_data.successful', false);
            roles.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            roles.data = _get(response, '_data.values.data', []);
            roles.meta = _get(response, '_data.values.meta', {
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
await rolesExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.search.callback);

    if(clearSelection){
        selectedRoles.value = [];
    }

    if(filters.page === page){
        rolesExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const disableActions = computed(() => {
    return rolesPending.value || deleting.value;
});
const disableDataTable = computed(() => {
    return rolesPending.value || deleting.value;
});

const deleting = ref(false);
const confirmDeleteSelected = () => {

    const selectedIds = selectedRoles.value;

    if(selectedIds.length == 0){

        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: `Validation Error`,
            message: `No selected role to delete.`,
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
        message: `Confirm delete selected role${selectedIds.length > 1 ? 's' : ''}?`,
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

    selectedIds = selectedRoles.value;

    if(_isEmpty(selectedIds)){
        return;
    }

    deleting.value = true;

    await laraFetch("/api/roles", {
        method: 'DELETE',
        body: {
            account_id: accountOptions.selected,
            role_ids: selectedIds,
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
                message: `Role${selectedIds.length > 1 ? 's' : ''} deleted successfully.`,
                action: {
                    callback: () => {},
                    label: 'Okay'
                }
            });
        }
    });

    selectedRoles.value = [];
    await rolesExecute();
}
</script>

<style scoped>

</style>