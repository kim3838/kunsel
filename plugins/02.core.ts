
import type {Sequenceable} from "@/public/js/types/data";
import type {StringEnumInterface} from "@/public/js/common/type";

export default defineNuxtPlugin(nuxtApp => {
    const route = useRoute();

    nuxtApp.provide('debug', function (key: string, payload: any): void {
        console.log({[`${useNuxtApp().$moment().format('YYYY-MM-DD H:m:s')} DEBUG: ${key}`]: payload})
    });

    nuxtApp.provide('ordinal', function (num: number | string): string {

        if(num == 0){
            return '0';
        }

        const suffixes = ["th", "st", "nd", "rd"];
        const numValue = Number(num);
        const v = numValue % 100;

        // Handle special cases (11th, 12th, 13th)
        if (v >= 11 && v <= 13) {
            return num + "th";
        }

        // Get the last digit for suffix determination
        const lastDigit = v % 10;
        const suffix = suffixes[lastDigit] || "th";

        return num + suffix;


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
        for (const { value, symbol } of romanNumerals) {
            while (num >= value) {
                result += symbol;
                num -= value;
            }
        }
        return result;
    });

    nuxtApp.provide('isNumeric', function (value: any): boolean {

        return !isNaN(value) && !isNaN(parseFloat(value));
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

    nuxtApp.provide('timeDifference', function (start: string | null, end: string | null): string | null {

        if(!start || !end){
            return null;
        }

        const moment = useNuxtApp().$moment;

        // Parse times
        const startMoment = moment(start, "HH:mm");
        const endMoment = moment(end, "HH:mm");

        // Add 1 day if end is lesser or equal to start
        if (endMoment.isSameOrBefore(startMoment)) {
            endMoment.add(1, 'day');
        }

        // Get difference as duration
        const duration = moment.duration(endMoment.diff(startMoment));

        // Format as HH:MM
        const hours = String(Math.floor(duration.asHours())).padStart(2, '0');
        const minutes = String(duration.minutes()).padStart(2, '0');

        return `${hours}:${minutes}`;
    })

    nuxtApp.provide('stringEnumerableValue', function (
        enumerable: StringEnumInterface,
        value: number,
    ): string {

        return enumerable[value] as string;
    })

    nuxtApp.provide('enumerableOption', function (
        enumerable: StringEnumInterface,
        value: number|string,
    ): {
        text: string,
        value: number|string
    } {

        return {
            text: enumerable[value] as string,
            value: value
        };
    })

    nuxtApp.provide('wordClamp', function (text: string, length: number): string {

        if(!text){
            return text;
        }

        return text.length > length
            ? text.slice(0, length) + '…'
            : text;
    });

    nuxtApp.provide('waitUntil', function (condition: () => boolean, interval: number = 100, timeout: number = 5000, debug: boolean = false): Promise<void> {

        return new Promise<void>((resolve, reject) => {
            const start: number = Date.now();

            let iteration = 1;

            const timer: ReturnType<typeof setInterval> = setInterval(() => {

                if(debug){
                    console.log('Iteration: ' + iteration++ + ' | Condition: ' + condition() + ' | Time elapsed: ' + (Date.now() - start) + 'ms');
                }

                if (condition()) {
                    clearInterval(timer);
                    resolve();
                } else if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject(new Error('Timeout waiting for condition'));
                }
            }, interval);
        });
    });
});