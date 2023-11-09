<template>
    <label :for="labelId">
        <ClientOnly>
            <Icon v-if="selected == value" :class="[heightClass, 'radio']" name="ic:sharp-radio-button-checked"></Icon>
            <Icon v-else :class="[heightClass]" class='radio' name="ic:sharp-radio-button-unchecked"></Icon>
        </ClientOnly>
        <input
            type="radio"
            :value="value"
            :checked="isChecked"
            :id="labelId"
            @change="$emit('update:modelValue', $event.target.value)"
            name="radio-input"/>
        <span :class="[fontClass]" class="tw-ml-[0.2rem]">{{label}}</span>
    </label>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    primary: primaryColor,
    text: textColor,
} = storeToRefs($themeStore);

const primaryColor70 = computed(() => {
    return primaryColor.value + hexAlpha.value['70'];
});

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: 0
    },
    value: {
        type: [String, Number],
        default: 0
    },
    label: {
        type: String,
        default: ''
    },
    selected: {
        type: [String, Number, null],
        default: 0
    },
    size: {
        default: 'md'
    }
});

const labelId = computed(() => props.modelValue + '-' +props.label);

const isChecked = computed(() => {
    return props.selected === props.value;
});

const heightClass = computed(() => {
    return {
        'sm': 'tw-h-3.5 tw-w-3.5',
        'md': 'tw-h-5 tw-w-5',
        'lg': 'tw-h-6 tw-w-6',
    }[props.size]
});

const fontClass = computed(() => {
    return {
        'sm': 'tw-text-sm',
        'md': 'tw-text-base tw-leading-6',
        'lg': 'tw-text-xl tw-font-semibold'
    }[props.size]
});

</script>

<style scoped>
input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.radio{
    color: v-bind(textColor) !important;
}
</style>
