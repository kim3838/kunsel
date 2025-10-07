
export const useDiagnostics = () => {

    const {$moment, $coreStore, $layoutStore} = useNuxtApp();
    const _debug = useNuxtApp().$debug as (key: string, payload: any) => void;
    const toRomanNumeral = useNuxtApp().$toRomanNumeral as (num: number) => string;
    const ordinal = useNuxtApp().$ordinal as (num: number | string) => string;
    const runtimeConfig = useRuntimeConfig();
    const appConfig = useAppConfig();

    const performFundamentals = async () => {

        Array.from({ length: 25 }, (_, i) => _debug(`${i} TO ROMAN NUMERAL: `,toRomanNumeral(i)));
        Array.from({ length: 25 }, (_, i) => _debug(`${i} ORDINAL: `,ordinal(i)));
        _debug('runtimeConfig',runtimeConfig);
        _debug('appConfig', appConfig);
        _debug('NODE_ENV', process.env.NODE_ENV);
        _debug('moment', $moment().format('YYYY-MM-DD'));
        _debug('lodash', _upperCase('lodash uppercase'));
    }

    return {
        performFundamentals
    };
}