
import {defineStore} from 'pinia';
import moment from "moment";
import type {StoreFormT} from "@/public/js/common/type";

export const useFormStore = defineStore('form', {
    state: (): StoreFormT => {
        return {
            filters: {
                date: moment().format('YYYY-MM-DD'),
                dateTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                monthValue: moment().format('YYYY-MM'),
                monthLabel: moment().format('YYYY MMMM'),
            }
        }
    },

    getters: {

    },

    actions: {
        setFormFilterValue(payload: {key: 'date' | 'dateTime' | 'monthValue' | 'monthLabel', value: any}){
            this.filters[payload.key] = payload.value;
        },
    },
})
