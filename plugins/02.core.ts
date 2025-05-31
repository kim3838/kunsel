
import type {Sequenceable} from "@/public/js/types/data";

export default defineNuxtPlugin(nuxtApp => {
    const route = useRoute();

    nuxtApp.provide('debug', function (key: string, payload: any): void {
        console.log({[`${useNuxtApp().$moment().format('YYYY-MM-DD H:m:s')} DEBUG: ${key}`]: payload})
    });

    nuxtApp.provide('ordinal', function (num: number | string): string {
        let s = ["th", "st", "nd", "rd"];
        // @ts-ignore
        let v = num % 100;
        return num + (s[(v - 20) % 10] || s[v] || s[0]);
    });

    nuxtApp.provide('toRomanNumeral', function (num: number): string {

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

    nuxtApp.provide('isRouteActive', function (name: string | undefined): boolean {
        // @ts-ignore
        return [route.path, _toLower(route.name)].indexOf(_toLower(name)) >= 0;
    });

    nuxtApp.provide('isRoutePathActive', function (path: string | undefined): boolean {
        // @ts-ignore
        return route.path.startsWith(path);
    });

    nuxtApp.provide('orderSequenceable', function (data: Sequenceable[]): void {

        let order = 0;

        data.forEach((sequenceable: Sequenceable) => {sequenceable.order = ++order;});
    })
});