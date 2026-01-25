<template>
    <div>
        <BreadCrumbs prefix-company :size="`sm`" :extender="[{name: `Employee Portal Dashboard`}]" />

        <div class="space-y-6 mt-6">

            <div>
                <div v-if="employeePending || !employeeSuccessful" class="mb-2 flex flex-row flex-wrap gap-2 items-center min-h-8">
                    <UnorderedList v-if="employeePending" :icon="'eos-icons:loading'" :size="'md'" :label="'Loading info...'"/>
                    <Label v-else-if="!employeeSuccessful" invert :size="'md'" :type="'danger'" :label="employeeMessage" />
                </div>
                <div v-else class="space-y-4">
                    <div class="flex items-center gap-4">
                        <div class="text-xl">{{userCompanyEmployee?.full_name}}</div>
                        <div class="flex items-center">
                            <div class="p-1 pr-4 rounded-sm flex items-center gap-1" :style="cosmetic.shadedStyle(employee?._payload?.label_shade?.value as LabelTypeT)">
                                <Label :size="'md'" :type="employee?._payload?.label_shade?.value as LabelTypeT" shade :label="_get(employee, 'current_employment_profile.status.text', '')" />
                                <div>{{employee.current_employment_profile?.employment_type?.text}}</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="flex flex-wrap gap-6 pt-4 scaffold-border-top">
                            <div>
                                <InputLabel :size="'xs'" value="Number" />
                                <div class="text-sm font-sans">{{ _get(employee, 'number', '--') }}</div>
                            </div>
                            <div>
                                <InputLabel :size="'xs'" value="Department" />
                                <div class="text-sm">{{ _get(employee, 'department.name', '--') }}</div>
                            </div>
                            <div>
                                <InputLabel :size="'xs'" value="Designation" />
                                <div class="text-sm">{{ _get(employee, 'designation.name', '--') }}</div>
                            </div>
                            <div>
                                <InputLabel :size="'xs'" value="Contact" />
                                <span v-if="_isEmpty(_compact([employee.contact?.office_email, employee.contact?.personal_email, employee.contact?.office_phone, employee.contact?.personal_phone]))">--</span>
                                <div class="text-sm" v-else :class="index == 0 ? 'inline-block' : 'block'" v-for="(contact, index) in _compact([employee.contact?.office_email, employee.contact?.personal_email, employee.contact?.office_phone, employee.contact?.personal_phone])">{{contact}}</div>
                            </div>
                            <div>
                                <InputLabel :size="'xs'" value="Manager" />
                                <div class="text-sm">{{ _get(employee, 'manager.full_name', '--') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div class="lining-shadow rounded-sm flex-grow tint-background">
                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-business px-4 py-2">My Shift</div>

                    <div class="px-4 py-4">

                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div class="lining-shadow rounded-sm flex-grow tint-background">
                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-business px-4 py-2">My Requests</div>

                    <div class="px-4 py-4 max-h-[408px] overflow-y-auto">

                        <UserFiledRequest/>
                    </div>
                </div>

                <div class="lining-shadow rounded-sm flex-grow tint-background">
                    <div class="lining-shadow rounded-t-sm text-lg font-medium font-business px-4 py-2">Awaiting my approval</div>

                    <div class="px-4 py-4 max-h-[408px] overflow-y-auto">
                        <UserAwaitingApproval/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import type {LabelTypeT} from "@/public/js/types/theme";
import type {TableRowT} from "@/public/js/types/data";
import type {EmployeeT} from "@/public/js/types/employee";

const {isAuthenticated, userIsSuperAdmin} = useAuth();
const user = userState();
const userCompanyEmployee = userCompanyEmployeeState();
const nuxtApp = useNuxtApp();
const cosmetic = useCosmetic();
const userIsEmployeeOfSelectedCompany = userIsEmployeeOfSelectedCompanyState();
const userIsAdminOfSelectedCompany = userIsAdminOfSelectedCompanyState();
const {
    updatedAssociatedCompanyFlag,
    updatedAssociatedAccountSubscriptionFlag
} = storeToRefs(nuxtApp.$associationStore);
const {
    selectedAccountSubscription,
    selectedAccountSubscriptionValue,
    selectedAssociatedCompany,
    selectedAssociatedCompanyId,
} = storeToRefs(nuxtApp.$authStore);

watch(updatedAssociatedCompanyFlag, (newValue) => {
    if(isAuthenticated.value && userIsEmployeeOfSelectedCompany.value && selectedAssociatedCompanyId.value){
        fetchEmployee();
    }
});

const employee = ref<Partial<EmployeeT & TableRowT>>({});
const employeeSuccessful = ref(true);
const employeeMessage = ref('');
const employeePending = ref(false);
const fetchEmployee = async (callback: (() => void) | null = null) => {

    if(import.meta.server || userCompanyEmployee.value == null){return;}

    employeePending.value = true;

    await laraFetch(`/api/employee-portal-employees`, {
        method: 'GET',
        params: {
            filters: {
                company_id: selectedAssociatedCompanyId.value,
                employee_ulids: [userCompanyEmployee.value?.ulid],
            }
        }
    }, {
        onResponse: (request, options, response) => {
            employeePending.value = false;
            employeeSuccessful.value = _get(response, '_data.successful', false);
            employeeMessage.value = _get(response, '_data.message', '');
        },
        onSuccessResponse: async (request, options, response) => {
            let employeesResponse = _get(response, '_data.values.data', []) as EmployeeT[];
            let _employee = employeesResponse[0] ?? {};

            let employmentProfileShade = _get(_employee, 'current_employment_profile.is_active', false)
                ? 'success'
                : 'default';

            employee.value = {
                ..._employee,
                _payload: {
                    'label_shade': {
                        'cell': ['current_employment_profile', 'current_employment_type'],
                        'value': employmentProfileShade
                    }
                }
            } as EmployeeT & TableRowT;
        },
    }, false);
};

fetchEmployee();
</script>

<style scoped>

</style>