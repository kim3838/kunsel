//@ts-nocheck

export const payrollComponentPaySelectionsState = () => {
    return useState('payroll_component_pay_selections', () => {
        return {
            pay_period: [],
            pay_type: [],
            pay_frequency: [],
        }
    });
}

export const useCommon = () => {
    const payrollComponentPaySelections = payrollComponentPaySelectionsState();

    const ssrFetchCommon = async () => {
        await laraSsrUseFetch('/api/payroll-component-pay-selections', {
            method: 'GET',
        }, {
            onSuccessResponse: async (request, options, response) => {

                payrollComponentPaySelections.value.pay_period = _get(response, '_data.values.pay_period', []);
                payrollComponentPaySelections.value.pay_type = _get(response, '_data.values.pay_type', []);
                payrollComponentPaySelections.value.pay_frequency = _get(response, '_data.values.pay_frequency', []);
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
                payrollComponentPaySelections.value.pay_frequency = _get(response, '_data.values.pay_frequency', []);
            },
        });
    }

    const resetCommon = async () => {
        payrollComponentPaySelections.value = {
            pay_period: [],
            pay_type: [],
            pay_frequency: [],
        };
    }

    return {
        ssrFetchCommon,
        fetchCommon,
        payrollComponentPaySelections,
        resetCommon
    };
}