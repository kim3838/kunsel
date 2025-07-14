<template>
    <div>
        <div v-for="setting in settings" :key="setting.id" class="flex">
            <div v-if="setting.type == 'array'">
                <div v-if="true" class="font-semibold">{{setting.label}}</div>
                <div>
                    <table>
                        <thead class="font-normal">
                            <tr>
                                <td class="p-[3px]" v-for="(setting, index) in setting.value" :key="setting.label">
                                    {{ setting.label }}
                                </td>
                            </tr>
                        </thead>
                        <tbody class="text-sm">
                            <tr>
                                <td class="p-[3px]" v-for="(setting, index) in setting.value" :key="setting.readable">
                                    {{ setting.readable }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else>
                <div class="font-semibold">{{setting.label}}</div>
                <div class="text-sm">{{setting.readable}}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    lining: liningColor,
} = storeToRefs($themeStore);

const liningColor70 = computed(() => {
    return liningColor.value + hexAlpha.value['70'];
});

const props = defineProps({
    settings: {
        type: Array,
        default: () => [],
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

</script>

<style scoped>
table{
    white-space: nowrap;
    border: 0;
}

table thead tr td,tbody tr td {
    border: 1px dashed v-bind(liningColor70);
}

</style>