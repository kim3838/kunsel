<template>
    <div>
        <AdminWrapper>
            <div class="mx-auto max-w-screen-2xl">
                <form @submit.prevent="paginate(1, true)" class="space-y-2 p-[20px]">
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        <div class="col-span-full md:col-span-2">
                            <InputLabel :size="'sm'" value="Account" />
                            <MultiSelect :disabled="disableActions" glint drop-shadow :selection-max-viewable-line="5" :size="'md'" :options="accountOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                        <div>
                            <InputLabel :size="'sm'" value="Company" />
                            <MultiSelect :key="companyOptionsKey" :disabled="disableActions" glint drop-shadow :max-viewable-summary-count="1" :selection-max-viewable-line="5" :size="'md'" :options="companyOptions" :icon="'tdesign:component-checkbox'"/>
                        </div>
                    </div>
                    <div class="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
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
                    </div>

                    <div class="flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Button class="w-min" ref="submitButton" type="submit" :disabled="disableActions" :size="'md'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:data'" :label="disableActions ? 'Loading' : 'Load'"></Button>
                        <div class="h-8 flex flex-row items-center scaffold-border px-2">
                            <label class="flex items-center">
                                <Checkbox
                                    :disabled="disableActions"
                                    name="remember"
                                    v-model="showAssociatedCompanies"
                                    :size="'md'"
                                    :label="'Show associated companies'" />
                            </label>
                        </div>
                    </div>

                    <div>
                        <PageInformation :pagination="users.meta.pagination" :pending="disableDataTable"/>
                        <Pagination :size="'lg'" :pagination="users.meta.pagination" :pending="disableDataTable" v-model="pageComputed"/>
                    </div>
                </form>

                <div class="px-[20px]">
                    <div class="mb-2 flex items-center min-h-8">
                        <UnorderedList
                            v-if="disableActions"
                            :icon="'eos-icons:loading'"
                            :size="'md'"
                            :label="'Please wait...'"/>
                        <NuxtLink
                            v-else
                            :to="`/admin/users/create-user`">
                            <Button class="w-min" :disabled="disableActions" :size="'sm'" :icon="disableActions ? 'eos-icons:loading' : 'mdi:plus'" :label="''"></Button>
                        </NuxtLink>
                    </div>

                    <div v-if="!users.successful" class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                        <Label invert :size="'md'" :type="'danger'" :label="users.message" />
                    </div>

                    <DataTable
                        v-if="users.successful"
                        :key="usersKey"
                        :headers="usersHeaders"
                        :size="'lg'"
                        :rows="users.data"
                        :disabled="disableDataTable"
                        v-model="selectedUsers"
                        :border-appearance="Boolean($associationStore.associatedUserSubRowSlug)"
                        :sub-row-slug="$associationStore.associatedUserSubRowSlug"
                        :sub-row-settings="{
                            type: DATATABLE_SUBROW_TYPE.TITLED,
                            containerPaddingTop: 0.75,
                            containerPaddingBottom: 1.75,
                            titleSize: 'md',
                            rowVerticalLine: true,
                            verticalBorderType: 'dashed',
                            horizontalBorderType: 'dashed',
                        }"
                        :stripped="true"
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
                                        {type: 'link',icon: 'mdi:pen',title: 'Edit',to: `/admin/users/${cell.ulid}`},
                                    ]">
                                </NavDrop>
                            </div>
                        </template>
                        <template v-slot:cell.status="{cell,slot}">
                            <div class="p-[3px]">{{cell.status?.text}}</div>
                        </template>
                        <template v-slot:cell.email_verification="{cell,slot}">
                            <div class="flex space-x-1 px-[0.3rem] items-center">
                                <Label :size="slot.labelSize" :type="cell?._payload?.label_shade?.value as LabelTypeT" shade :label="cell.email_verified ? `Verified` : `Not verified`" />
                            </div>
                        </template>
                        <template v-slot:cell.associated_companies_summary="{cell,slot}">
                            <div class="p-[3px] flex items-center gap-1">
                                <div>{{cell.associated_companies_summary.value}}</div>
                                <div v-if="cell.associated_companies_summary.extender" class="text-xs font-sans">{{cell.associated_companies_summary.extender}}</div>
                            </div>
                        </template>
                        <template v-slot:cell.account_roles_summary="{cell,slot}">
                            <div class="p-[3px] flex items-center gap-1">
                                <div>{{cell.account_roles_summary?.value}}</div>
                                <div v-if="cell.account_roles_summary?.extender" class="text-xs font-sans">{{cell.account_roles_summary?.extender}}</div>
                            </div>
                        </template>
                        <template v-slot:sub_row_slot="{rowIndex, cell, slot}">
                            <div class="inline-flex items-center scaffold-border pr-2">
                                <Icon name="mdi:info-variant" :class="[slot.iconSizeClass]" /><div :class="[slot.titleSizeClass]">Associated Companies</div>
                            </div>

                            <AssociatedUserSubRow
                                :rows="cell[slot.slug]"
                                :disabled="disableDataTable"
                            ></AssociatedUserSubRow>
                        </template>
                    </DataTable>
                </div>
            </div>
        </AdminWrapper>
    </div>
</template>

<script setup lang="ts">
import type {DataTableT, TableHeaderT, TableRowT} from "@/public/js/types/data";
import type {EnumSelection} from "@/public/js/common/type";
import type {LabelTypeT} from "@/public/js/types/theme";

useHead({titleTemplate: (titleChunk) => {return `Users`}});
definePageMeta({middleware: ['auth', 'super-admin']});
useLayout().setNavigationMode('solid');
const user = userState();
const {$associationStore} = useNuxtApp();
const usersHeaders = reactive<TableHeaderT[]>([
    { text: '', value: 'actions'},
    { text: 'Username', value: 'username', alignData: 'left'},
    { text: 'Status', value: 'status', alignData: 'left'},
    { text: 'Email', value: 'email', alignData: 'left'},
    { text: 'Email Verification', value: 'email_verification', alignData: 'left'},
    { text: 'Timezone', value: 'timezone', alignData: 'left'},
    { text: 'Created by', value: 'created_by', alignData: 'left'},
    { text: 'Associated', value: 'associated_companies_summary', alignData: 'left'},
    { text: 'Account roles', value: 'account_roles_summary', alignData: 'left'},
]);

const showAssociatedCompanies = ref(true);
showAssociatedCompanies.value = $associationStore.associatedUserSubRowSlug === 'associated_companies';

watch(() => {return showAssociatedCompanies.value;}, (show) => {
    if(show){
        $associationStore.associatedUserSubRowSlug = 'associated_companies';
        paginate(1, true)
    } else {
        $associationStore.associatedUserSubRowSlug = '';
        paginate(1, true)
    }
})

const usersKey = ref(0);
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

const accountOptions = reactive<{
    search: string,
    selection: EnumSelection,
    selected: number[]
}>({
    search: '',
    selection: [],
    selected: []
});

const fetchAccounts = async() => {

    await laraFetch("/api/account-selections", {
        method: 'GET',
    }, {
        onSuccessResponse: async (request, options, response) => {
            accountOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchAccounts();

watch(() => accountOptions.selected, async () => {
    await selectedAccountChanged()
},{ deep: true })

const selectedAccountChanged = async() => {

    usersPending.value = true;

    companyOptions.search = '';
    companyOptions.selected = [];

    await fetchCompanies();
    companyOptionsKey.value++;

    await usersExecute();
}

const companyOptionsKey = shallowRef(0);
const companyOptions = reactive({
    search: '',
    selection: [],
    selected: []
});
const fetchCompanies = async() => {

    await laraFetch("/api/company-selections", {
        method: 'GET',
        params: {
            filters: {
                account_ids: accountOptions.selected,
            }
        }
    }, {
        onSuccessResponse: async (request, options, response) => {
            companyOptions.selection = _get(response, '_data.values.selection', []);
        }
    })
}
await fetchCompanies();
const userStatusOptions = reactive({
    search: '',
    selection: [
        {text : 'Active', value: USER_STATUS.ACTIVE},
        {text : 'Inactive', value: USER_STATUS.INACTIVE},
    ],
    selected: []
});

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
    perPage: 25,
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
let paramsComputed = computed(() => {

    let baseFilters = {
        'account_ids': accountOptions.selected,
        'user_search': filters.userSearch.keyword,
        'employee_search': filters.employeeSearch.keyword,
        'companies': companyOptions.selected,
        'status': userStatusOptions.selected
    };

    return {
        page: filters.page,
        perPage: filters.perPage,
        filters: baseFilters
    };
});

const usersPending = ref(false);
const selectedUsers = ref([]);
const usersExecute = async () => {

    if(import.meta.server){return;}

    usersPending.value = true;

    await laraFetch("/api/users", {
        method: 'GET',
        params: paramsComputed.value
    },{
        onRequestError: () => {
            usersPending.value = false;
        },
        onResponse: (request, options, response) => {
            usersPending.value = false;
            users.successful = _get(response, '_data.successful', false);
            users.message = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            users.data = _get(response, '_data.values.data', []).map((user: TableRowT) => {

                let emailVerified = _get(user, 'email_verified', false);
                let emailVerificationShade = emailVerified ? 'info' : 'caution';

                return {
                    ...user,
                    _payload: {
                        'label_shade': {
                            'cell': ['email_verification'],
                            'value': emailVerificationShade
                        }
                    }
                };
            });
            users.meta = _get(response, '_data.values.meta', {
                pagination: {
                    total: 0,
                    count: 0,
                    per_page: 0,
                    current_page: 0,
                    total_pages: 0
                }
            });
            usersKey.value += 1;
        }
    }, false);
}
await usersExecute();

function paginate(page = 1, clearSelection = false){
    clearTimeout(filters.userSearch.callback);
    clearTimeout(filters.employeeSearch.callback);

    if(clearSelection){
        selectedUsers.value = [];
    }

    if(filters.page === page){
        usersExecute();
    } else {
        filters.page = page;
    }
}

watch(() => {return filters.page;}, () => {paginate(filters.page);});
watch(() => {return filters.perPage;}, () => {paginate(1);});

const disableActions = computed(() => {
    return usersPending.value;
});
const disableDataTable = computed(() => {
    return usersPending.value;
});
</script>

<style scoped>

</style>