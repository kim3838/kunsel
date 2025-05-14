
import type {
    DateRangePickerOptions,
    DateTimePickerOptionsT
} from "@/public/js/datetimepicker/type";

import moment from "moment";

export function dateTimePicker(options: DateTimePickerOptionsT[] = []) {
    const {$moment} = useNuxtApp();

    onMounted(async() => {
        await scaffold(options);
    });

    onUnmounted(() => {
        clearScaffold();
    });

    function clearScaffold(){
        //Clear datetimepicker elements on dom
        const elements = document.getElementsByClassName("daterangepicker ltr single opensright");

        while (elements.length > 0) {
            if (elements[0].parentNode) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        }
    }

    async function scaffold(options: DateTimePickerOptionsT[]){
        await nextTick();

        _forEach(options, (option: DateTimePickerOptionsT) => {
            switch (option.type) {
                case 'datetime':
                    //@ts-ignore
                    $(`#${option.id}`).daterangepicker({
                        "singleDatePicker": true,
                        "showDropdowns": true,
                        "timePicker": true,
                        "timePicker24Hour": true,
                        "timePickerSeconds": true,
                        "autoApply": false,
                        "autoUpdateInput": false,
                        locale: {
                            format: 'YYYY-MM-DD HH:mm:ss'
                        }

                    }).on('apply.daterangepicker', function (event: any, pickerOptions: DateRangePickerOptions) {

                        option.selectedCallback({
                            value: pickerOptions.startDate.format('YYYY-MM-DD HH:mm:ss')
                        });
                    });
                    break;
                case 'date':
                    //@ts-ignore
                    $(`#${option.id}`).daterangepicker({
                        "singleDatePicker": true,
                        "showDropdowns": true,
                        "autoApply": true,
                        locale: {
                            format: 'YYYY-MM-DD'
                        }

                    }, function (startDate: moment.Moment, endDate: moment.Moment, label: string) {
                        option.selectedCallback({
                            value: startDate.format('YYYY-MM-DD')
                        });
                    });
                    break;
                case 'month':
                    //@ts-ignore
                    $(`#${option.id}`).daterangepicker({
                        "monthPicker": true,
                        "singleDatePicker": true,
                        "showDropdowns": true,
                        "autoApply": false,
                        "autoUpdateInput": false,
                        "locale": {
                            "format": "YYYY MMMM",
                            "monthNames": [
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December"
                            ],
                            "firstDay": 1
                        }

                    }).on('apply.daterangepicker', function (event: any, pickerOptions: DateRangePickerOptions) {

                        let picked = pickerOptions.selectedYear === undefined
                            ? pickerOptions.startDate.format('YYYY-MM')
                            : pickerOptions.selectedYear + '-' + (pickerOptions.selectedMonth + 1);

                        let value = $moment(picked, 'YYYY-MM-DD').format('YYYY-MM');

                        let label = $moment(picked, 'YYYY-MM').format('YYYY MMMM');

                        option.selectedCallback({
                            value: value,
                            label: label
                        });
                    });
                    break;
            }
        })
    }

    async function render(options: DateTimePickerOptionsT[] = []){
        clearScaffold();
        await scaffold(options);
    }

    return {render};
}