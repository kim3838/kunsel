<template>
    <div :class="[compact ? '' : 'px-[20px]']">
        <form @submit.prevent="paginate(1, clearSelectionOnFormSubmit)" class="space-y-2" :class="[compact ? '' : 'pb-[20px]']">
            <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                <div>
                    <InputLabel :size="'sm'" value="User Status" />
                    <MultiSelect :disabled="disableActions" glint drop-shadow :selection-max-viewable-line="5" :size="'md'" :options="userStatusOptions" :icon="'tdesign:component-checkbox'"/>
                </div>
                <div>
                    <InputLabel :size="'sm'" value="User Search" />
                    <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.userSearch.keyword" class="w-full" placeholder="Search" type="text"/>
                </div>
                <div>
                    <InputLabel :size="'sm'" value="Employee Search" />
                    <Input :disabled="disableActions" :size="'md'" ref="searchInput" v-model="filters.employeeSearch.keyword" class="w-full" placeholder="Search" type="text"/>
                </div>
                <div v-if="compact" class="flex flex-col">
                    <div class="flex-none h-[1rem]"></div>
                    <div class="grow">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                    </div>
                </div>
            </div>

            <div v-if="!compact" class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
            </div>

            <div>
                <PageInformation :pagination="users.meta.pagination" :pending="disableDataTable"/>
                <div class="flex items-center gap-2">
                    <Pagination
                        :size="'lg'"
                        :pagination="users.meta.pagination"
                        :pending="disableDataTable"
                        v-model="pageComputed"/>
                    <UnorderedList
                        v-if="disableActions"
                        :icon="'eos-icons:loading'"
                        :size="'md'"
                        :label="'Please wait...'"/>
                </div>
            </div>
        </form>

        <div class="flex flex-row flex-wrap gap-2 items-center min-h-8" :class="[compact ? 'mt-2' : '']">
            <div v-if="users.successful" class="scaffold-border px-2 font-[National_Park]">
                <span><span class="font-semibold">{{proxySelectedUsers.length}}</span> {{selectedLabel}}</span>
            </div>
            <Button
                v-if="users.successful"
                :variant="'outline'"
                :size="'sm'"
                :icon="'tdesign:close'"
                :disabled="disableActions"
                :label="clearSelectionLabel"
                @click="proxySelectedUsers = []" />
            <label v-if="users.successful" class="scaffold-border">
                <Checkbox
                    :disabled="disableActions"
                    @valueChanged="selectedFlagInteracted"
                    class="px-[0.3rem]"
                    v-model="showOnlySelected"
                    :size="'md'"
                    :label="showOnlySelectedLabel" />
            </label>
            <slot v-if="users.successful" name="selection-actions"></slot>
            <Label v-if="!users.successful" invert :size="'md'" :type="'danger'" :label="users.message" />
        </div>

        <DataTable
            v-if="users.successful"
            class="mt-2"
            :headers="usersHeaders"
            :size="'lg'"
            :rows="users.data"
            :disabled="disableDataTable"
            :show-no-data="false"
            :pending="proxyPending"
            v-model="proxySelectedUsers"
            selection
            :single-select="singleSelect">
            <template v-slot:cell.status="{cell,slot}">
                <div class="p-[3px]">{{cell.status?.text}}</div>
            </template>
            <template v-slot:cell.company_assignment_type="{cell,slot}">
                <div class="px-[3px]">
                    <span v-if="cell.company_assignment_type?.value">{{cell.company_assignment_type?.text}}</span>
                </div>
            </template>
            <template v-slot:cell.account_roles_summary="{cell,slot}">
                <div class="p-[3px] flex items-center gap-1">
                    <div>{{cell.account_roles_summary?.value}}</div>
                    <div v-if="cell.account_roles_summary?.extender" class="text-xs font-sans">{{cell.account_roles_summary?.extender}}</div>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT} from "@/public/js/types/data";
import {storeToRefs} from "pinia";

const {isAuthenticated} = useAuth();
const nuxtApp = useNuxtApp();
const common = useCommon();
const {
    updatedAssociatedCompanyFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAssociatedCompanyAccountId,
    selectedAssociatedCompanyId
} = storeToRefs(nuxtApp.$authStore);

const props = defineProps({
    selected: {
        type: Array,
        default: () => {
            return [];
        }
    },
    pending: {
        type: Boolean,
    },
    disableActions: {
        type: Boolean,
        default: false,
    },
    compact: {
        type: Boolean,
        default: false,
    },
    clearSelectionOnFormSubmit: {
        type: Boolean,
        default: true,
    },
    selectedLabel: {
        type: String,
        default: 'Selected'
    },
    clearSelectionLabel: {
        type: String,
        default: 'Clear selection'
    },
    showOnlySelectedLabel: {
        type: String,
        default: 'Show only selected'
    },
    filters: {
        type: Object,
        default: function () {
            return {}
        }
    },
    singleSelect: {
        type: Boolean,
        default: false,
    }
});

const emit = defineEmits(["update:selected", "update:pending"]);
const proxySelectedUsers = computed({
    get() {
        return props.selected;
    },
    set(newValue) {
        emit("update:selected", newValue);
    }
});
const proxyPending = computed({
    get() {
        return props.pending;
    },
    set(newValue) {
        emit("update:pending", newValue);
    }
});

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && selectedAssociatedCompanyId.value){
        paginate(1, true);
    }
})

const userStatusOptions = reactive({
    search: '',
    selection: [
        {text : 'Active', value: USER_STATUS.ACTIVE},
        {text : 'Inactive', value: USER_STATUS.INACTIVE},
    ],
    selected: []
});

const usersHeaders = reactive<TableHeaderT[]>([
    {text: 'User Status', value: 'status', alignData: 'left'},
    {text: 'Username', value: 'username', alignData: 'left'},
    {text: 'Employee #', value: 'company_employee_number', alignData: 'left'},
    {text: 'Name', value: 'company_employee_full_name', alignData: 'left'},
    {text: 'Company Assignment', value: 'company_assignment_type', alignData: 'left'},
    {text: 'Account roles', value: 'account_roles_summary', alignData: 'left'},
]);

const users = reactive<DataTableT>({
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
const clearData = () => {
    users.data = [];
    users.meta = {
        pagination: {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 0,
            total_pages: 0
        }
    };
};

let filters = reactive<{
    page: number,
    perPage: number,
    userSearch: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    },
    employeeSearch: {
        keyword: string,
        callback: ReturnType<typeof setTimeout> | number
    },
}>({
    page: 1,
    perPage: 10,
    userSearch: {
        keyword: '',
        callback: 1
    },
    employeeSearch: {
        keyword: '',
        callback: 1
    },
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

let filterSelectedComputed = computed(() => {
    return {
        pre_selected_user_ids: proxySelectedUsers.value
    }
});
const showOnlySelected = ref(false);
const clearFlags = () => {
    showOnlySelected.value = false;
}

const selectedFlagInteracted = async () => {

    if(showOnlySelected.value && proxySelectedUsers.value.length == 0){
        useNuxtApp().$promptStore.setPrompt({
            resetable: false,
            icon: null,
            title: null,
            message: 'No selected.',
            action: {
                callback: () => {
                    showOnlySelected.value = false
                },
                label: 'Okay'
            }
        });

        return;
    }

    await nextTick();
    await paginate(1, false);
}

let paramsComputed = computed(() => {
    return {
        page: filters.page,
        perPage: filters.perPage,
        account_id: selectedAssociatedCompanyAccountId.value,
        company_id: selectedAssociatedCompanyId.value,
        filters: {
            ...props.filters,
            ...(showOnlySelected.value ? filterSelectedComputed.value : {}),
            account_id: selectedAssociatedCompanyAccountId.value,
            associated_companies: [selectedAssociatedCompanyId.value],
            user_search: filters.userSearch.keyword,
            employee_search: filters.employeeSearch.keyword,
            status: userStatusOptions.selected
        }
    };
});
const usersPending = ref(false)

const disableActions = computed(() => {
    return usersPending.value || props.disableActions || companyAssociationPendingState().value;
});
const disableDataTable = computed(() => {
    return usersPending.value || props.disableActions || companyAssociationPendingState().value;
});
const usersExecute = async() =>{

    if(import.meta.server || !selectedAssociatedCompanyAccountId.value || !selectedAssociatedCompanyId.value){
        return;
    }

    usersPending.value = true;
    emit("update:pending", true);

    await laraFetch(`/api/company-users`, {
        method: 'GET',
        params: paramsComputed.value
    }, {
        onRequestError: () => {
            usersPending.value = false;
            emit("update:pending", false);
        },
        onResponse: (request, options, response) => {
            usersPending.value = false;
            emit("update:pending", false);
            users.successful = _get(response, '_data.successful', false);
            users.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            users.data = _get(response, '_data.values.data', []);
            users.meta = _get(response, '_data.values.meta', {
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
await usersExecute();

const paginate = async (page: number = 1, clearSelection: boolean = false) => {
    clearTimeout(filters.userSearch.callback);
    clearTimeout(filters.employeeSearch.callback);

    if(clearSelection){
        emit("update:selected", []);
    }

    if(filters.page === page){
        await usersExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const getSelectedData = () => {
    return users.data.filter((user) => {
        return proxySelectedUsers.value.includes(user.id);
    });
}

const reset = async () => {
    clearFlags();
    clearData();
    await paginate(1, true);
}
defineExpose({
    paginate,
    clearFlags,
    clearData,
    reset,
    getSelectedData
});
</script>

<style scoped>

</style>