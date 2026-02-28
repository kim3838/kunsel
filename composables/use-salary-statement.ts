export const useSalaryStatement = () => {

    const headerSupFields = ref([
        {text: 'Gross', colspan: 2,  alignHeader: 'center'},
        {text: 'Contribution', colspan: 1,  alignHeader: 'center'},
        {text: '', colspan: 2,  alignHeader: 'left'},
        {text: '', colspan: 3,  alignHeader: 'left'},
    ]);

    const headerFields = ref([
        { text: 'Basic', value: 'basic_gross', isNumeric: true, alignData: 'right'},
        { text: 'Other', value: 'other_gross', isNumeric: true, alignData: 'right'},

        { text: 'Employee', value: 'contribution', isNumeric: true, alignData: 'right'},

        { text: 'Taxable', value: 'taxable', isNumeric: true, alignData: 'right'},
        { text: 'Nontaxable', value: 'nontaxable', isNumeric: true, alignData: 'right'},

        { text: 'Withholding Tax', value: 'withholding_tax', isNumeric: true, alignData: 'right'},
        { text: 'Deduction', value: 'deduction', isNumeric: true, alignData: 'right'},
        { text: 'Net', value: 'net', isNumeric: true, alignData: 'right'}
    ]);

    const daysTotalHeaderSupFields = ref([
        {text: 'Calendar days', colspan: 3, alignHeader: 'center'},
        {text: '', colspan: 1, alignHeader: 'center'},
        {text: 'Work days split', colspan: 4, alignHeader: 'center'},

        {text: 'Employee reported', colspan: 4, alignHeader: 'center'},
    ]);

    const daysTotalHeaderFields = ref([
        { text: 'Days', value: 'total_days', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        { text: 'Day offs', value: 'total_day_offs', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        { text: 'Work days', value: 'total_working_days', isNumeric: true, alignData: 'right', alignHeader: 'right'},

        { text: 'WRD', value: 'total_working_rest_days', isNumeric: true, alignData: 'right', alignHeader: 'right'},

        { text: 'Regular', value: 'total_regular_work_days', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        { text: 'Legal', value: 'total_legal_holidays', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        { text: 'Double', value: 'total_double_holidays', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        { text: 'Special', value: 'total_special_holidays', isNumeric: true, alignData: 'right', alignHeader: 'right'},

        { text: 'Present', value: 'total_present', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        { text: 'LWP', value: 'total_leave_with_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        { text: 'LWOP', value: 'total_leave_without_pay', isNumeric: true, alignData: 'right', alignHeader: 'right'},
        { text: 'Absent', value: 'total_absent', isNumeric: true, alignData: 'right', alignHeader: 'right'},
    ]);

    const asDetailTotalsHeaderSupFields = ref([
        {text: 'Gross', colspan: 2,  alignHeader: 'center'},
        {text: 'Contribution', colspan: 2,  alignHeader: 'center'},
        {text: '', colspan: 2,  alignHeader: 'left'},
        {text: '', colspan: 3,  alignHeader: 'left'},
    ]);

    const asDetailTotalsHeaderFields = ref([
        { text: 'Basic', value: 'total_basic_gross', isNumeric: true, alignData: 'right'},
        { text: 'Other', value: 'total_other_gross', isNumeric: true, alignData: 'right'},

        { text: 'Employee', value: 'total_contribution', isNumeric: true, alignData: 'right'},
        { text: 'Employer', value: 'total_employer_contribution_share', isNumeric: true, alignData: 'right'},

        { text: 'Taxable', value: 'total_taxable', isNumeric: true, alignData: 'right'},
        { text: 'Nontaxable', value: 'total_nontaxable', isNumeric: true, alignData: 'right'},

        { text: 'Withholding Tax', value: 'total_withholding_tax', isNumeric: true, alignData: 'right'},
        { text: 'Deduction', value: 'total_deduction', isNumeric: true, alignData: 'right'},
        { text: 'Net', value: 'total_net', isNumeric: true, alignData: 'right'}
    ]);

    return {
        headerSupFields,
        headerFields,
        daysTotalHeaderSupFields,
        daysTotalHeaderFields,
        asDetailTotalsHeaderSupFields,
        asDetailTotalsHeaderFields,
    }
}