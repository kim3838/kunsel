<template>
    <button
        ref="button"
        :disabled="disabled"
        :style="{'border-radius': '2px'}"
        :class="[heightClass, spacingClass, colorClass, borderClass]"
        :type="type"
        class="
            tw-font-[Barlow]
            tw-inline-flex
            tw-items-center
            tw-font-medium
            tw-tracking-wide
            tw-box-border
            focus:tw-outline-none
            focus:tw-border-light
            focus:tw-ring
            focus:tw-ring-transparent
            disabled:tw-opacity-60
            tw-transition
            tw-relative">
        <div :class="[shadeClass]" class="shade tw-rounded-sm"></div>
        <slot :fontClass="fontClass">
            <span class="tw-flex tw-items-center" :class="[fontClass]">
                <Icon v-if="icon?.trim()" :class="[iconClass, icon?.trim() ? 'tw-mr-0.5' : '']" :name="icon"></Icon><span>{{label}}</span>
            </span>
        </slot>
    </button>
</template>

<script setup>
import { ref, computed } from 'vue';

const { $themeStore } = useNuxtApp();

let primary = ref($themeStore.primary);
let primary90 = ref($themeStore.primary + 'E6');
let secondary = ref($themeStore.secondary);
let secondary90 = ref($themeStore.secondary + 'E6');
let accent = ref($themeStore.accent);
let accent80 = ref($themeStore.accent + 'CC');
let accent70 = ref($themeStore.accent + 'B2');
let shade = ref($themeStore.shade);
let shade50 = ref($themeStore.shade + '7F');
let neutral = ref($themeStore.neutral);
let tint = ref($themeStore.tint);
let text = ref($themeStore.text);
let textInvert = ref($themeStore.textInvert);
let textSecondary = ref($themeStore.textSecondary);

const props = defineProps({
    type: {
        type: String,
        default: 'submit',
    },
    variant: {
        type: String,
        default: 'default',
    },
    size: {
        default: 'md'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    icon: {
        type: String,
        default: null,
    },
    label: {
        type: String,
        default: '',
    },
});

const heightClass = computed(() => {
    return {
        '2xs': 'tw-h-5',
        'xs': 'tw-h-6',
        'sm': 'tw-h-7',
        'md': 'tw-h-8',
        'lg': 'tw-h-11',
        'xl': 'tw-h-14',
    }[props.size]
});

const spacingClass = computed(() => {
    return {
        '2xs': 'tw-px-1',
        'xs': 'tw-px-1.5',
        'sm': 'tw-px-1.5',
        'md': 'tw-px-2',
        'lg': 'tw-px-3',
        'xl': 'tw-px-7',
    }[props.size]
});

const iconClass = computed(() => {
    return {
        '2xs': 'tw-h-[0.875rem] tw-w-[0.875rem]',
        'xs': 'tw-h-[1rem] tw-w-[1rem]',
        'sm': 'tw-h-[1rem] tw-w-[1rem]',
        'md': 'tw-h-[1.2rem] tw-w-[1.2rem] tw-mt-[0.2rem]',
        'lg': 'tw-h-[1.875rem] tw-w-[1.875rem] tw-mt-[0.1rem]',
        'xl': 'tw-h-[2.25rem] tw-w-[2.25rem] tw-mt-[0.1rem]',
    }[props.size]
});

const fontClass = computed(() => {
    return {
        '2xs': 'tw-text-xs tw-font-semibold',
        'xs': 'tw-text-xs tw-font-semibold',
        'sm': 'tw-text-sm tw-font-semibold',
        'md': 'tw-text-base tw-font-semibold tw-tracking-normal',
        'lg': 'tw-text-2xl tw-font-black',
        'xl': 'tw-text-3xl tw-font-black',
    }[props.size]
});

const colorClass = computed(() => {
    return {
        'default': 'default-background',
        'outline': props.disabled ? '' : 'outlined',
    }[props.variant]
});

const borderClass = computed(() => {
    return {
        'default': '',
        'outline': 'outlined-border',
    }[props.variant]
});

const shadeClass = computed(() => {
    return {
        'default': 'default-shade',
        'outline': props.disabled ? '' : 'outline-shade',
    }[props.variant]
});

</script>

<style scoped>
.shade{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.default-background{
    background-color: v-bind(primary);
    color: v-bind(textInvert);
}

.default-background:hover, .default-background:active{
    background-color: v-bind(primary90);
}

.default-shade{
    background: transparent;
    background: linear-gradient( to bottom right, v-bind(accent80) 0%, transparent 55%, v-bind(accent70) 100%);
}

.outlined-border{
    border: 1px solid v-bind(shade);
}

.outlined{
    color: v-bind(text);
}

.outlined:hover{
    background-color: v-bind(primary);
    color: v-bind(textInvert);
}

.outline-shade:hover{
    background: transparent;
    background: linear-gradient( to bottom right, v-bind(accent80) 0%, transparent 55%, v-bind(accent70) 100%);
}
</style>
