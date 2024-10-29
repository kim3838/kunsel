<template>
    <span class="tw-font-data tw-box-border tw-overflow-hidden tw-flex tw-items-start tw-justify-start tw-cursor-pointer">
        <div :style="{'height': checkBoxSlotHeight}" class="tw-flex tw-items-center">
            <input
                :disabled="disabled"
                :tabindex="tabable ? 0 : -1"
                type="checkbox"
                v-model="proxyModel"
                :class="[heightClass, inputClass]"
                class="tw-form-checkbox checkbox tw-outline-none focus:tw-ring-transparent focus:tw-ring">
        </div>
        <div v-if="label?.trim()" :class="[fontClass]" class="tw-ml-1 tw-whitespace-pre-line">{{label}}</div>
    </span>
</template>

<script setup>
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

const checkBoxSlotHeight = computed(()=>{
    return {
        'sm': '17.5px',
        'md': '21px',
        'lg': '24.5px',
    }[props.size];
})

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
    color: v-bind(checkBoxColor) !important;
    border-color: v-bind(liningColor) !important;
    outline: transparent none !important;
    box-shadow: none !important;
}

.checkbox-md{
    border-width: 1px;
}

.checkbox-lg{
    border-width: 2px;
}
</style>