<template>
    <span class="tw-relative tw-overflow-hidden tw-flex tw-items-center tw-justify-start tw-cursor-pointer">
        <span class="tw-absolute tw-h-full tw-w-full"></span>
        <input
            :disabled="disabled"
            :tabindex="tabable ? 0 : -1"
            type="checkbox"
            :checked="proxyChecked"
            :class="[heightClass, inputClass]"
            class="tw-form-checkbox checkbox focus:tw-ring-transparent focus:tw-border-lighter focus:tw-ring">
        <span v-if="label?.trim()" :class="[fontClass]" class="tw-ml-1 tw-text-accent" v-text="label"></span>
    </span>
</template>

<script setup>
import { ref, computed } from 'vue';
const { $themeStore } = useNuxtApp();

let text = ref($themeStore.text);
let primary = ref($themeStore.primary);
let primary70 = ref($themeStore.primary + 'B2');
let lining = ref($themeStore.lining);

const props = defineProps({
    value: {
        type: [Number, String, Object],
        default: null
    },
    selected: {
        type: Array,
        default: null,
    },
    disabled: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: null,
    },
    size: {
        type: String,
        default: 'md'
    },
    checked: {
        type: Boolean,
        default: false,
    },
    tabable: {
        type: Boolean,
        default: true,
    }
});

const proxyChecked = computed(() => {

    if(Array.isArray(props.selected)){
        return props.selected.indexOf(props.value) >= 0;
    } else {
        return props.checked;
    }
});

const heightClass = computed(() => {
    return {
        'sm': 'tw-h-3 tw-w-3',
        'md': 'tw-h-3.5 tw-w-3.5',
        'lg': 'tw-h-5 tw-w-5',
    }[props.size];
});

const fontClass = computed(() => {
    return {
        'sm': 'tw-text-sm',
        'md': 'tw-text-base',
        'lg': 'tw-text-lg'
    }[props.size];
});

const inputClass = computed(() => {
    return {
        'sm': 'checkbox-md',
        'md': 'checkbox-md',
        'lg': 'checkbox-lg'
    }[props.size];
});
</script>

<style scoped>
.checkbox {
    color: v-bind(primary70) !important;
    border-color: v-bind(lining) !important;
}

.checkbox-md{
    border-width: 1px;
}

.checkbox-lg{
    border-width: 2px;
}
</style>