<template>
    <div class="space-y-4">
        <div v-for="setting in settings" :key="setting.id">

            <div v-if="setting.type == 'array'">

                <div class="font-semibold">{{setting.label}}</div>

                <div>
                    <table>
                        <thead>
                            <tr>
                                <td class="p-[3px]" v-for="(setting, index) in setting.value" :key="setting.label">
                                    {{ setting.label }}
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="p-[3px]" v-for="(setting, index) in setting.value" :key="setting.readable">
                                    {{ setting.readable }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-else-if="setting.key == 'description' && setting.type == 'text'">
                <div class="font-semibold">{{setting.label}}</div>
                <p class="text-base" :class="'whitespace-' + descriptionWhitespace">{{setting.readable}}</p>
            </div>

            <div v-else>
                <div class="font-semibold">{{setting.label}}</div>
                <div class="text-base">{{setting.readable}}</div>
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
        type: [Array, null],
        default: () => {
            return null
        },
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    descriptionWhitespace: {
        type: String,
        default: 'pre',
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