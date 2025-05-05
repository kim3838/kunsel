import type {Sequenceable} from "@/composables/settings/payroll/use-payroll-settings-company-compensation";

export default defineNuxtPlugin(nuxtApp => {
    const route = useRoute();

    nuxtApp.provide('debug', function (key: string, payload: any) {
        // @ts-ignore
        console.log({[`${useNuxtApp().$moment().format('YYYY-MM-DD H:m:s')} DEBUG: ${key}`]: payload})
    });

    nuxtApp.provide('ordinal', function (number) {
        let s = ["th", "st", "nd", "rd"];
        let v = number % 100;
        return number + (s[(v - 20) % 10] || s[v] || s[0]);
    });

    nuxtApp.provide('toRomanNumeral', function (num) {

        if(num == 0){
            return 'i';
        }

        const romanNumerals = [
            { value: 1000, symbol: "M" },
            { value: 900, symbol: "CM" },
            { value: 500, symbol: "D" },
            { value: 400, symbol: "CD" },
            { value: 100, symbol: "C" },
            { value: 90, symbol: "XC" },
            { value: 50, symbol: "L" },
            { value: 40, symbol: "XL" },
            { value: 10, symbol: "X" },
            { value: 9, symbol: "IX" },
            { value: 5, symbol: "V" },
            { value: 4, symbol: "IV" },
            { value: 1, symbol: "I" }
        ];

        let result = "";
        for (let i = 0; i < romanNumerals.length; i++) {
            const { value, symbol } = romanNumerals[i];
            while (num >= value) {
                result += symbol;
                num -= value;
            }
        }
        return result;
    });

    nuxtApp.provide('isRouteActive', function (routeSlug: string) {
        return [route.path, _toLower(route.name)].indexOf(_toLower(routeSlug)) >= 0;
    });

    nuxtApp.provide('orderSequenceable', function (data: Sequenceable[]) {

        let order = 0;

        data.forEach((sequenceable: Sequenceable) => {sequenceable.order = ++order;});
    })
});