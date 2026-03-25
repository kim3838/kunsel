
import {defineStore} from 'pinia';
import moment from "moment";

export const useFormStore = defineStore('form',() => {

    const filters = reactive({
        date: moment().format('YYYY-MM-DD'),
        dateTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        monthValue: moment().format('YYYY-MM'),
        monthLabel: moment().format('YYYY MMMM'),

        attendanceDateFrom: moment().startOf('month').startOf('day').format('YYYY-MM-DD'),
        attendanceDateTo: moment().endOf('month').endOf('day').format('YYYY-MM-DD'),

        fromMonthValue: moment().startOf('year').format('YYYY-MM'),
        fromMonthLabel: moment().startOf('year').format('YYYY MMMM'),
        toMonthValue: moment().endOf('year').format('YYYY-MM'),
        toMonthLabel: moment().endOf('year').format('YYYY MMMM'),
    });

    filters.fromMonthValue = moment().startOf('month').format('YYYY-MM');
    filters.fromMonthLabel = moment().startOf('month').format('YYYY MMMM');
    filters.toMonthValue = moment().endOf('month').format('YYYY-MM');
    filters.toMonthLabel = moment().endOf('month').format('YYYY MMMM');

    const fromMonthValueComputed = computed(() => {
        return filters.fromMonthValue;
    });
    const toMonthValueComputed = computed(() => {
        return filters.toMonthValue;
    })

    const setFormFilterValue = (payload: {key: string, value: string}) => {
        //@ts-ignore
        filters[payload.key] = payload.value;
    }

    return {
        filters,
        fromMonthValueComputed,
        toMonthValueComputed,
        setFormFilterValue,
    }
});
