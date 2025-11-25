
export const useDiagnostics = () => {

    const {$moment, $coreStore, $layoutStore} = useNuxtApp();
    const _debug = useNuxtApp().$debug as (key: string, payload: any) => void;
    const toRomanNumeral = useNuxtApp().$toRomanNumeral as (num: number) => string;
    const ordinal = useNuxtApp().$ordinal as (num: number | string) => string;
    const runtimeConfig = useRuntimeConfig();
    const appConfig = useAppConfig();

    const {isAuthenticated, userIsSuperAdmin} = useAuth();
    const userIsAdminInAnyCompany = userIsAdminInAnyCompanyState();
    const userIsAdminOfSelectedCompany = userIsAdminOfSelectedCompanyState();
    const userIsEmployeeOfSelectedCompany = userIsEmployeeOfSelectedCompanyState();
    const userFlags = {
        is_authenticated: isAuthenticated.value,
        user_is_super_admin: userIsSuperAdmin.value,
        user_is_admin_in_any_company: userIsAdminInAnyCompany.value,
        user_is_admin_of_selected_company: userIsAdminOfSelectedCompany.value,
        user_is_employee_of_selected_company: userIsEmployeeOfSelectedCompany.value
    }

    const debugCorePluginProvides = () => {
        Array.from({ length: 25 }, (_, i) => _debug(`${i} TO ROMAN NUMERAL: `,toRomanNumeral(i)));
        Array.from({ length: 25 }, (_, i) => _debug(`${i} ORDINAL: `,ordinal(i)));
    }

    const debugLibraries = async () => {
        _debug('moment', $moment().format('YYYY-MM-DD'));
        _debug('lodash', _upperCase('lodash uppercase'));
    }

    const debugConfigs = async () => {
        _debug('runtimeConfig',runtimeConfig);
        _debug('appConfig', appConfig);
        _debug('NODE_ENV', process.env.NODE_ENV);
    }

    return {
        userFlags,
        debugLibraries,
        debugCorePluginProvides,
        debugConfigs,
    };
}