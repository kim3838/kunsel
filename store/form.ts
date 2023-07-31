
import { defineStore } from 'pinia';
import moment from "moment";

export const useFormStore = defineStore('form', {
    state: () => ({
        filters: {
            date: moment().format('YYYY-MM-DD'),
            dateFrom: moment().format('YYYY-MM-DD'),
            dateTo: moment().format('YYYY-MM-DD'),
            dateTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            dateTimeFrom: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            dateTimeTo: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            monthValue: moment().format('YYYY-MM'),
            monthLabel: moment().format('YYYY MMMM'),
            monthFromValue: moment().format('YYYY-MM'),
            monthFromLabel: moment().format('YYYY MMMM'),
            monthToValue: moment().format('YYYY-MM'),
            monthToLabel: moment().format('YYYY MMMM'),
        }
    }),

    getters: {

    },

    actions: {
        setFormFilterValue(payload){
            this.filters[payload.key] = payload.value;
        },
    },
})
