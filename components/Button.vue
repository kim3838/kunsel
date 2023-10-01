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
            tw-ease-in-out
            tw-duration-300
            tw-relative">
        <div :class="[shadeClass]" class="shade"></div>
        <slot :fontClass="fontClass">
            <span class="tw-flex tw-items-center" :class="[fontClass]">
                <Icon v-if="icon?.trim()" :class="[iconClass, icon?.trim() ? 'tw-mr-0.5' : '']" :name="icon"></Icon><span>{{label}}</span>
            </span>
        </slot>
    </button>
</template>

<script setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    primary: primaryColor,
    accent: accentColor,
    lining: liningColor,
    thread: threadColor,
    tint: tintColor,
    text: textColor,
    textInvert: textInvertColor
} = storeToRefs($themeStore);

const primaryColor90 = computed(() => {
    return primaryColor.value + hexAlpha.value['90'];
});
const primaryColor70 = computed(() => {
    return primaryColor.value + hexAlpha.value['70'];
});
const accentColor80 = computed(() => {
    return accentColor.value + hexAlpha.value['80'];
});
const accentColor70 = computed(() => {
    return accentColor.value + hexAlpha.value['70'];
});
const threadColor50 = computed(() => {
    return threadColor.value + hexAlpha.value['50'];
});
const threadColor90 = computed(() => {
    return threadColor.value + hexAlpha.value['90'];
});

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
        'md': 'tw-text-base tw-font-semibold tw-tracking-tight',
        'lg': 'tw-text-2xl tw-font-black',
        'xl': 'tw-text-3xl tw-font-black',
    }[props.size]
});

const colorClass = computed(() => {
    return {
        'default': 'default-background',
        'outline': props.disabled ? '' : 'outlined',
        'flat': props.disabled ? '' : 'flat',
    }[props.variant]
});

const borderClass = computed(() => {
    return {
        'default': '',
        'outline': 'outlined-border',
        'flat': 'flat-border',
    }[props.variant]
});

const shadeClass = computed(() => {
    return {
        'default': 'default-shade',
        'outline': props.disabled ? '' : 'outline-shade',
        'flat': '',
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
    border-radius: 2px;
}

.default-background{
    background-color: v-bind(primaryColor) !important;
    color: v-bind(textInvertColor) !important;
}

.default-background:hover, .default-background:active{
    background-color: v-bind(primaryColor90) !important;
}

.default-shade{
    background: transparent;
    background: linear-gradient( to bottom right, v-bind(accentColor80) 0%, transparent 55%, v-bind(accentColor70) 100%) !important;
}

.outlined-border{
    border: 1px solid v-bind(liningColor);
}

.outlined{
    background-color: v-bind(tintColor) !important;
    color: v-bind(textColor) !important;
}

.outlined:hover{
    background-color: v-bind(primaryColor) !important;
    color: v-bind(textInvertColor) !important;
}

.outline-shade{
    background: transparent;
    background: linear-gradient( to bottom right, v-bind(threadColor90) 0%, transparent 25%, v-bind(threadColor50) 100%) !important;
}

.outline-shade:hover{
    background: linear-gradient( to bottom right, v-bind(accentColor80) 0%, transparent 55%, v-bind(accentColor70) 100%) !important;
}

.flat{
    background-color: v-bind(tintColor) !important;
    color: v-bind(textColor) !important;
}
.flat-border{
    border: 1px solid v-bind(threadColor);
}

</style>
