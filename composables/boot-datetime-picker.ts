
import { nextTick, onMounted, onUnmounted } from 'vue';

export default function () {
    const { $moment, $formStore } = useNuxtApp();
    let formStore = $formStore;

    onMounted(() => {
        nextTick(function(){
            console.log("DateTimePicker bootstrap");

            // @ts-ignore
            $('#bootstrapDatePicker').daterangepicker({
                "singleDatePicker": true,
                "showDropdowns": true,
                "autoApply": true,
                locale: {
                    format: 'YYYY-MM-DD'
                }
                // @ts-ignore
            }, function (start, end, label) {
                formStore.setFormFilterValue({
                    key: 'date',
                    value: start.format('YYYY-MM-DD')
                });
            });

            // @ts-ignore
            $('#bootstrapDateTimePicker').daterangepicker({
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
                formStore.setFormFilterValue({
                    key: 'dateTime',
                    value: picker.startDate.format('YYYY-MM-DD HH:mm:ss')
                });
            });

            // @ts-ignore
            $('#bootstrapMonthPicker').daterangepicker({
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

                formStore.setFormFilterValue({
                    key: 'monthValue',
                    value: value
                });

                formStore.setFormFilterValue({
                    key: 'monthLabel',
                    value: label
                });

            });
        });
        console.log("DateTimePicker mounted");
    });

    onUnmounted(() => {
        //Clear datetimepicker elements on dom
        const elements = document.getElementsByClassName("daterangepicker ltr single opensright");

        while (elements.length > 0) {
            // @ts-ignore
            elements[0].parentNode.removeChild(elements[0]);
        }
    })
}