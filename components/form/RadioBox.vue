<template>
    <label :for="labelId">
        <Icon v-if="selected == value" :class="[heightClass, 'radio']" name="ic:sharp-radio-button-checked"></Icon>
        <Icon v-else :class="[heightClass]" class='radio' name="ic:sharp-radio-button-unchecked"></Icon>
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
import { ref, computed } from 'vue';
const { $themeStore } = useNuxtApp();

let text = ref($themeStore.text);
let primary = ref($themeStore.primary);
let primary70 = ref($themeStore.primary + 'B2');
let lining = ref($themeStore.lining);

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
        default: null
    }
});

const labelId = computed(() => props.modelValue + '-' +props.label);

const isChecked = computed(() => {
    return props.selected === props.value;
});

const heightClass = computed(() => {
    return {
        [null]: 'tw-h-3.5 tw-w-3.5',
        'sm': 'tw-h-3.5 tw-w-3.5',
        'md': 'tw-h-5 tw-w-5',
        'lg': 'tw-h-6 tw-w-6',
    }[props.size]
});

const fontClass = computed(() => {
    return {
        [null]: 'tw-text-base',
        'sm': 'tw-text-sm',
        'md': 'tw-text-lg tw-leading-6',
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
    color: v-bind(primary70) !important;
}
</style>
