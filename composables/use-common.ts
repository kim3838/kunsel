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
            pay_frequencies: [],
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
    const debugEnabled = true;
    const {sessionDomain} = useRuntimeConfig().public;
    const payrollComponentPaySelections = payrollComponentPaySelectionsState();
    const timezoneSelections = timezoneSelectionsState();
    const companyOrganizationSelections = companyOrganizationSelectionsState();
    const themeType = themeTypeState();

    const ssrFetchPayrollComponentPaySelections = async () => {
        if(debugEnabled){console.log('3.0 SSR FETCH');}

        await callOnce(async () => {
            if(debugEnabled){console.log('3.1 ONCE');}

            const storedCompanyId = useCookie<PaletteName>('pc',{
                domain: sessionDomain,
                sameSite: 'lax',
            });

            const params = {
                filters: {}
            };

            if(storedCompanyId.value !== undefined){

                params.filters.company_id = storedCompanyId.value;
            }

            await laraSsrUseFetch('/api/payroll-component-pay-selections', {
                method: 'GET',
                params: params
            }, {
                onSuccessResponse: async (request, options, response) => {
                    if(debugEnabled){console.log('3.2 SSR FETCH RESPONSE');}

                    payrollComponentPaySelections.value.pay_period = _get(response, '_data.values.pay_period', []);
                    payrollComponentPaySelections.value.pay_type = _get(response, '_data.values.pay_type', []);
                },
            });
        });
    }

    const ssrFetchTimezoneSelections = async () => {
        if(debugEnabled){console.log('4.0 SSR FETCH');}

        await callOnce(async () => {
            if(debugEnabled){console.log('4.1 ONCE');}

            await laraSsrUseFetch('/api/timezone-selections', {
                method: 'GET',
            }, {
                onSuccessResponse: async (request, options, response) => {
                    if(debugEnabled){console.log('4.2 SSR FETCH RESPONSE');}

                    timezoneSelections.value = _get(response, '_data.values.selection', []);
                },
            });
        });
    }

    const fetchCommon = async () => {

        const storedCompanyId = useCookie<PaletteName>('pc',{
            domain: sessionDomain,
            sameSite: 'lax',
        });

        const params = {
            filters: {}
        };

        if(storedCompanyId.value !== undefined){

            params.filters.company_id = storedCompanyId.value;
        }

        await laraFetch('/api/payroll-component-pay-selections', {
            method: 'GET',
            params: params
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

    const fetchPayFrequencySelections = async () => {
        const {$authStore} = useNuxtApp();

        await laraFetch("/api/pay-frequency-selections", {
            method: 'GET',
            params: {
                filters: {
                    'company_id': $authStore.selectedAssociatedCompanyId,
                }
            }
        }, {
            onSuccessResponse: async (request, options, response) => {
                companyOrganizationSelections.value.pay_frequencies = _get(response, '_data.values.selection', []);
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
        const {$authStore} = useNuxtApp();

        if(useAuth().isAuthenticated.value){
            companyOrganizationSelections.value = {
                employee_groups: [],
                departments: [],
                designations: [],
                pay_frequencies: [],
                payroll_component: {
                    names: [],
                    types: [],
                }
            };

            await laraFetch("/api/organization-selections", {
                method: 'GET',
                params: {
                    filters: {
                        'company_id': $authStore.selectedAssociatedCompanyId,
                    }
                }
            }, {
                onSuccessResponse: async (request, options, response) => {
                    companyOrganizationSelections.value.employee_groups = _get(response, '_data.values.employee_groups', []);
                    companyOrganizationSelections.value.departments = _get(response, '_data.values.departments', []);
                    companyOrganizationSelections.value.designations = _get(response, '_data.values.designations', []);
                    companyOrganizationSelections.value.pay_frequencies = _get(response, '_data.values.pay_frequencies', []);
                    companyOrganizationSelections.value.payroll_component.types = _get(response, '_data.values.payroll_component.type', []);
                    companyOrganizationSelections.value.payroll_component.names = _get(response, '_data.values.payroll_component.names', []);
                }
            });
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
        };
        timezoneSelections.value = [];
        companyOrganizationSelections.value = {
            employee_groups: [],
            departments: [],
            designations: [],
            pay_frequency: [],
            payroll_component: {
                names: [],
                types: [],
            }
        };
    }

    const setStoredThemeType = () => {

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
        fetchPayFrequencySelections,
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