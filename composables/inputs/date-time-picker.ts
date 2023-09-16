import {nextTick, onMounted, onUnmounted} from 'vue';

export function dateTimePicker(options: any[] = []) {
    const {$moment} = useNuxtApp();

    onMounted(async () => {
        scaffold(options);
    });

    onUnmounted(() => {
        clearScaffold();
    });

    function clearScaffold(){
        //Clear datetimepicker elements on dom
        const elements = document.getElementsByClassName("daterangepicker ltr single opensright");

        while (elements.length > 0) {
            // @ts-ignore
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    async function scaffold(options){
        await nextTick();

        _forEach(options, option => {
            switch (option.type) {
                case 'datetime':
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
                        // @ts-ignore
                    }).on('apply.daterangepicker', function (event, picker) {
                        option.selectedCallback({
                            value: picker.startDate.format('YYYY-MM-DD HH:mm:ss')
                        });
                    });
                    break;
                case 'date':
                    $(`#${option.id}`).daterangepicker({
                        "singleDatePicker": true,
                        "showDropdowns": true,
                        "autoApply": true,
                        locale: {
                            format: 'YYYY-MM-DD'
                        }
                        // @ts-ignore
                    }, function (start, end, label) {
                        option.selectedCallback({
                            value: start.format('YYYY-MM-DD')
                        });
                    });
                    break;
                case 'month':
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
                        // @ts-ignore
                    }).on('apply.daterangepicker', function (event, picker) {

                        let picked = picker.selectedYear === undefined
                            ? picker.startDate.format('YYYY-MM')
                            : picker.selectedYear + '-' + (picker.selectedMonth + 1);

                        // @ts-ignore
                        let value = $moment(picked, 'YYYY-MM-DD').format('YYYY-MM');
                        // @ts-ignore
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

    async function render(options: any[] = []){
        clearScaffold();
        scaffold(options);
    }

    return {render};
}