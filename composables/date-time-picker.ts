
import { nextTick, onMounted, onUnmounted } from 'vue';

export function dateTimePicker(){
    onMounted(async () => {
        await nextTick();
        console.log("MOUNTED");
    });

    onUnmounted(async () => {
        await nextTick();
        console.log("UNMOUNTED");
    });
}