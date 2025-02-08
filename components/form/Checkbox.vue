<template>
    <span class="font-data box-border overflow-hidden flex items-start justify-start cursor-pointer" :class="[fontClass]">
        <div :style="{'height': checkBoxSlotHeight}" class="flex items-center">
            <input
                :disabled="disabled"
                :tabindex="tabable ? 0 : -1"
                type="checkbox"
                :data-theme="themeType"
                v-model="proxyModel"
                :class="[heightClass, inputClass]"
                class="checkbox">
        </div>
        <div v-if="label?.trim()" class="ml-1 whitespace-pre-line">{{label}}</div>
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
        ? (primaryColor.value + hexAlpha.value['100'])
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
        'sm': 'h-3 w-3',
        'md': 'h-3.5 w-3.5',
        'lg': 'h-5 w-5',
    }[props.size];
});

const fontClass = computed(() => {
    return {
        'sm': 'text-sm',
        'md': 'text-base',
        'lg': 'text-lg'
    }[props.size];
});

const inputClass = computed(() => {
    return {
        'sm': 'checkbox-md',
        'md': 'checkbox-md',
        'lg': 'checkbox-lg'
    }[props.size];
});

const checkMarkSize = computed(() => {
    return {
        'sm': '0.5rem',
        'md': '0.7rem',
        'lg': '1rem'
    }[props.size];
});
</script>

<style scoped>
.checkbox {
    appearance: none;
    color: v-bind(checkBoxColor) !important;
    border-color: v-bind(liningColor) !important;
    box-shadow: none !important;
    outline: none !important;
    cursor: pointer;
    border-radius: 1px;
    display: inline-block;
    position: relative;
    vertical-align: middle;
}

input[type="checkbox"]:checked {
    background-color: v-bind(checkBoxColor) !important;
    overflow: hidden;
}

input[data-theme="light"][type="checkbox"]:checked::after {
    content: '';
    position: absolute;
    left:-50%;
    height: 100%;
    width: 150%;
    background-image: url('/images/deco/ripple_texture.png');
    background-size: cover;
    opacity: 0.8;
    background-repeat: no-repeat;
}

input[type="checkbox"]::before {
    position: absolute;
    font-size: v-bind(checkMarkSize) !important;
    color: white;
    width: 100%;
    height: 120%;
    display: flex;
    align-items: center;
    justify-content: center;
}

input[type="checkbox"]:checked::before {
    content: "✔";
}

.checkbox-md{
    border-width: 0.1rem;
}

.checkbox-lg{
    border-width: 0.1rem;
}
</style>