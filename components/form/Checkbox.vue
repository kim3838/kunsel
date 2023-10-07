<template>
    <span class="tw-relative tw-overflow-hidden tw-flex tw-items-center tw-justify-start tw-cursor-pointer">
        <span class="tw-absolute tw-h-full tw-w-full"></span>
        <input
            :disabled="disabled"
            :tabindex="tabable ? 0 : -1"
            type="checkbox"
            v-model="proxyModel"
            :class="[heightClass, inputClass]"
            class="tw-form-checkbox checkbox tw-outline-none focus:tw-ring-transparent focus:tw-ring">
        <span v-if="label?.trim()" :class="[fontClass]" class="tw-ml-1 tw-text-accent" v-text="label"></span>
    </span>
</template>

<script setup>
import {ref, computed} from 'vue';
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    type: themeType,
    primary: primaryColor,
    lining: liningColor,
    textInvert: textInvertColor,
} = storeToRefs($themeStore);

const checkBoxColor = computed(() => {
    return themeType.value == 'light'
        ? (primaryColor.value + hexAlpha.value['70'])
        : (textInvertColor.value);
});

const props = defineProps({
    modelValue: [Number, Boolean, String],
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
    tabable: {
        type: Boolean,
        default: true,
    }
});

const emit = defineEmits(["update:modelValue"]);

const proxyModel = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emit("update:modelValue", newValue);
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
        'lg': 'tw-text-xl tw-font-semibold'
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
    color: v-bind(checkBoxColor) !important;
    border-color: v-bind(liningColor) !important;
    outline-color: transparent;
}

.checkbox-md{
    border-width: 1px;
}

.checkbox-lg{
    border-width: 2px;
}
</style>