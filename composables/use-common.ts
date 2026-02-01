//@ts-nocheck

import type {EnumSelection} from "@/public/js/common/type";
import type {PaletteName} from "@/public/js/types/theme";

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
            payroll_component: {
                names: [],
                types: [],
            }
        }
    });
}

export const timezoneSelectionsState = () => {
    return useState('timezone_selections', () => []);
}

export const themeTypeState = () => {
    return useState('theme_type', () => 'light');
}

export const useCommon = () => {
    const {sessionDomain} = useRuntimeConfig().public;
    const payrollComponentPaySelections = payrollComponentPaySelectionsState();
    const timezoneSelections = timezoneSelectionsState();
    const companyOrganizationSelections = companyOrganizationSelectionsState();
    const themeType = themeTypeState();

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

    const fetchPayrollComponentTypeSelections = async () => {
        const {$authStore} = useNuxtApp();

        await laraFetch("/api/employee-payroll-component-type-selections", {
            method: 'GET',
            params: {
                filters: {
                    'company_id': $authStore.selectedAssociatedCompanyId,
                }
            }
        }, {
            onSuccessResponse: async (request, options, response) => {
                companyOrganizationSelections.value.payroll_component.types = _get(response, '_data.values.selection', []);
            }
        });
    }

    const fetchPayrollComponentNameSelections = async () => {
        const {$authStore} = useNuxtApp();

        await laraFetch("/api/employee-payroll-component-name-selections", {
            method: 'GET',
            params: {
                filters: {
                    'company_id': $authStore.selectedAssociatedCompanyId,
                }
            }
        }, {
            onSuccessResponse: async (request, options, response) => {
                companyOrganizationSelections.value.payroll_component.names = _get(response, '_data.values.selection', []);
            }
        });
    }

    const fetchOrganizationSelections = async () => {

        if(useAuth().isAuthenticated.value){
            companyOrganizationSelections.value = {
                employee_groups: [],
                departments: [],
                designations: [],
                payroll_component: {
                    names: [],
                    types: [],
                }
            };
            await fetchEmployeeGroupSelections();
            await fetchDepartmentSelections();
            await fetchDesignationSelections();
            await fetchPayrollComponentTypeSelections();
            await fetchPayrollComponentNameSelections();
        }
    }

    const rebuildSelectionsOnSelectedCompanyChanged = (
        payload,
        key,
        selectionType,
        staticSelection: EnumSelection = [],
        payloadFetch = {}
    ) => {
        const {$authStore} = useNuxtApp();

        if(selectionType == SELECT.MULTI_PAGINATED){
            if(_isEmpty(payloadFetch)){
                payload.fetch.filters.company_id = $authStore.selectedAssociatedCompanyId;
            } else {
                payload.fetch = {
                    url: payload.fetch.url,
                    ...payloadFetch
                };
            }

            payload.fetch.filters.search.keyword = '';
            payload.selected = [];
        }

        if(selectionType == SELECT.SINGLE_PAGINATED){
            if(_isEmpty(payloadFetch)){
                payload.fetch.filters.company_id = $authStore.selectedAssociatedCompanyId;
            } else {
                payload.fetch = {
                    url: payload.fetch.url,
                    ...payloadFetch
                };
            }

            payload.fetch.filters.search.keyword = '';
            payload.selected = null;
        }

        if(selectionType == SELECT.MULTI_STATIC){
            payload.search = '';
            payload.selection = staticSelection;
            payload.selected = [];
        }

        if(selectionType == SELECT.SINGLE_STATIC){
            payload.search = '';
            payload.selection = staticSelection;
            payload.selected = null;
        }

        key.value += 1;
    }

    const resetCommon = async () => {
        payrollComponentPaySelections.value = {
            pay_period: [],
            pay_type: [],
            pay_frequency: [],
        };
        timezoneSelections.value = [];
        companyOrganizationSelections.value = {
            employee_groups: [],
            departments: [],
            designations: [],
            payroll_component: {
                names: [],
                types: [],
            }
        };
    }

    const setStoredThemeType = async () => {

        const storedTheme = useCookie<PaletteName>('pt',{
            domain: sessionDomain,
            sameSite: 'lax',
        });

        if(storedTheme.value !== undefined){

            themeType.value = storedTheme.value.split('-')[0] == 'dark' ? 'dark' : 'light';
        }
    }

    return {
        ssrFetchPayrollComponentPaySelections,
        ssrFetchTimezoneSelections,
        fetchCommon,
        fetchEmployeeGroupSelections,
        fetchDepartmentSelections,
        fetchDesignationSelections,
        fetchPayrollComponentTypeSelections,
        fetchPayrollComponentNameSelections,
        fetchOrganizationSelections,
        rebuildSelectionsOnSelectedCompanyChanged,
        payrollComponentPaySelections,
        timezoneSelections,
        companyOrganizationSelections,
        resetCommon,
        setStoredThemeType,
    };
}