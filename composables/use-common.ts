//@ts-nocheck

export const payrollComponentPaySelectionsState = () => {
    return useState('payroll_component_pay_selections', () => {
        return {
            pay_period: [],
            pay_type: [],
        }
    });
}

export const companyOrganizationSelectionsState = () => {
    return useState('organization', () => {
        return {
            employee_groups: [],
            departments: [],
            designations: [],
        }
    });
}

export const timezoneSelectionsState = () => {
    return useState('timezone_selections', () => []);
}

export const useCommon = () => {
    const payrollComponentPaySelections = payrollComponentPaySelectionsState();
    const timezoneSelections = timezoneSelectionsState();
    const companyOrganizationSelections = companyOrganizationSelectionsState();

    const ssrFetchPayrollComponentPaySelections = async () => {

        await laraSsrUseFetch('/api/payroll-component-pay-selections', {
            method: 'GET',
        }, {
            onSuccessResponse: async (request, options, response) => {

                payrollComponentPaySelections.value.pay_period = _get(response, '_data.values.pay_period', []);
                payrollComponentPaySelections.value.pay_type = _get(response, '_data.values.pay_type', []);
            },
        });
    }

    const ssrFetchTimezoneSelections = async () => {

        await laraSsrUseFetch('/api/timezone-selections', {
            method: 'GET',
        }, {
            onSuccessResponse: async (request, options, response) => {

                timezoneSelections.value = _get(response, '_data.values.selection', []);
            },
        });
    }

    const fetchCommon = async () => {

        await laraFetch('/api/payroll-component-pay-selections', {
            method: 'GET',
        }, {
            onSuccessResponse: async (request, options, response) => {

                payrollComponentPaySelections.value.pay_period = _get(response, '_data.values.pay_period', []);
                payrollComponentPaySelections.value.pay_type = _get(response, '_data.values.pay_type', []);
            },
        });

        await laraFetch('/api/timezone-selections', {
            method: 'GET',
        }, {
            onSuccessResponse: async (request, options, response) => {

                timezoneSelections.value = _get(response, '_data.values.selection', []);
            },
        });
    }

    const fetchEmployeeGroupSelections = async () => {
        const {$authStore} = useNuxtApp();

        await laraFetch("/api/employee-group-selections", {
            method: 'GET',
            params: {
                filters: {
                    'company_id': $authStore.selectedAssociatedCompanyId,
                }
            }
        }, {
            onSuccessResponse: async (request, options, response) => {
                companyOrganizationSelections.value.employee_groups = _get(response, '_data.values.selection', []);
            }
        });
    };

    const fetchDepartmentSelections = async () => {
        const {$authStore} = useNuxtApp();

        await laraFetch("/api/department-selections", {
            method: 'GET',
            params: {
                filters: {
                    'company_id': $authStore.selectedAssociatedCompanyId,
                }
            }
        }, {
            onSuccessResponse: async (request, options, response) => {
                companyOrganizationSelections.value.departments = _get(response, '_data.values.selection', []);
            }
        });
    };

    const fetchDesignationSelections = async () => {
        const {$authStore} = useNuxtApp();

        await laraFetch("/api/designation-selections", {
            method: 'GET',
            params: {
                filters: {
                    'company_id': $authStore.selectedAssociatedCompanyId,
                }
            }
        }, {
            onSuccessResponse: async (request, options, response) => {
                companyOrganizationSelections.value.designations = _get(response, '_data.values.selection', []);
            }
        });
    }

    const fetchOrganizationSelections = async () => {

        if(useAuth().isAuthenticated.value){
            await fetchEmployeeGroupSelections();
            await fetchDepartmentSelections();
            await fetchDesignationSelections();
        }
    }

    const resetCommon = async () => {
        payrollComponentPaySelections.value = {
            pay_period: [],
            pay_type: [],
            pay_frequency: [],
        };
        timezoneSelections.value = [];
        companyOrganizationSelections.value = {
            departments: [],
            designations: [],
        };
    }

    return {
        ssrFetchPayrollComponentPaySelections,
        ssrFetchTimezoneSelections,
        fetchCommon,
        fetchDepartmentSelections,
        fetchDesignationSelections,
        fetchOrganizationSelections,
        payrollComponentPaySelections,
        timezoneSelections,
        companyOrganizationSelections,
        resetCommon
    };
}