//@ts-nocheck

export const payrollComponentPaySelectionsState = () => {
    return useState('payroll_component_pay_selections', () => {
        return {
            pay_period: [],
            pay_type: [],
        }
    });
}

export const timezoneSelectionsState = () => {
    return useState('timezone_selections', () => []);
}

export const useCommon = () => {
    const payrollComponentPaySelections = payrollComponentPaySelectionsState();
    const timezoneSelections = timezoneSelectionsState();

    const ssrFetchCommon = async () => {

        await laraSsrUseFetch('/api/payroll-component-pay-selections', {
            method: 'GET',
        }, {
            onSuccessResponse: async (request, options, response) => {

                payrollComponentPaySelections.value.pay_period = _get(response, '_data.values.pay_period', []);
                payrollComponentPaySelections.value.pay_type = _get(response, '_data.values.pay_type', []);
            },
        });

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

    const resetCommon = async () => {
        payrollComponentPaySelections.value = {
            pay_period: [],
            pay_type: [],
            pay_frequency: [],
        };
        timezoneSelections.value = [];
    }

    return {
        ssrFetchCommon,
        fetchCommon,
        payrollComponentPaySelections,
        timezoneSelections,
        resetCommon
    };
}