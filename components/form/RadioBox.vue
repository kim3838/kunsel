<template>
    <label :for="labelId" class="font-data ">
        <div class="flex items-start justify-start">
            <ClientOnly>
                <div :style="{'height': radioBoxSlotHeight}" class="flex items-center">
                    <Icon v-if="selected == value" :class="[radioSize, 'radio']" name="ic:sharp-radio-button-checked"></Icon>
                    <Icon v-else :class="[radioSize]" class='radio' name="ic:sharp-radio-button-unchecked"></Icon>
                </div>
            </ClientOnly>

            <div v-if="label?.trim()" :class="[fontClass]" class="ml-1 whitespace-pre-line">{{label}}</div>
            <input
                type="radio"
                :value="value"
                :checked="isChecked"
                :id="labelId"
                @change="$emit('update:modelValue', $event.target.value)"
                name="radio-input"/>
        </div>
    </label>
</template>

<script setup lang="ts">
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

const radioBoxSlotHeight = computed(()=>{
    return {
        'sm': '20px',
        'md': '24px',
        'lg': '28px',
    }[props.size];
});

const radioSize = computed(() => {
    return {
        'sm': 'h-3.5 w-3.5',
        'md': 'h-5 w-5',
        'lg': 'h-6 w-6',
    }[props.size]
});

const fontClass = computed(() => {
    return {
        'sm': 'text-sm',
        'md': 'text-base',
        'lg': 'text-lg'
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
