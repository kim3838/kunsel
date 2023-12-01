<template>
    <button
        ref="button"
        :disabled="disabled"
        :style="{'border-radius': '2px'}"
        :class="[heightClass, spacingClass, colorClass, borderClass]"
        :type="type"
        class="
            tw-inline-flex
            tw-items-center
            tw-font-medium
            tw-tracking-wide
            tw-box-border
            focus:tw-outline-none
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
                <ClientOnly><Icon v-if="icon?.trim()" :class="[iconClass]" :name="icon"></Icon></ClientOnly><span :class="[labelSpacing]">{{label}}</span>
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
        '2xl' : 'tw-h-16',
    }[props.size]
});

const spacingClass = computed(() => {
    return {
        '2xs': 'tw-pl-[0.15rem] tw-pr-[0.5rem]',
        'xs': 'tw-pl-[0.15rem] tw-pr-[0.5rem]',
        'sm': 'tw-pl-[0.6rem] tw-pr-[0.7rem]',
        'md': 'tw-pl-[0.6rem] tw-pr-[0.7rem]',
        'lg': 'tw-pl-[0.4rem] tw-pr-[0.7rem]',
        'xl': 'tw-pl-2 tw-pr-[1.5rem]',
        '2xl': 'tw-pl-2 tw-pr-[1.5rem]',
    }[props.size]
});

const iconClass = computed(() => {
    return {
        '2xs': 'tw-h-4 tw-w-4',
        'xs': 'tw-h-5 tw-w-5',
        'sm': 'tw-h-5 tw-w-5',
        'md': 'tw-h-5 tw-w-5',
        'lg': 'tw-h-8 tw-w-8',
        'xl': 'tw-h-9 tw-w-9',
        '2xl': 'tw-h-12 tw-w-12',
    }[props.size]
});

const labelSpacing = computed(() => {
    return {
        '2xs': props.icon?.trim() ? 'tw-ml-[0.2rem]' : '',
        'xs': props.icon?.trim() ? 'tw-ml-[0.15rem]' : '',
        'sm': props.icon?.trim() ? 'tw-ml-[0.25rem]' : '',
        'md': props.icon?.trim() ? 'tw-ml-[0.25rem]' : '',
        'lg': props.icon?.trim() ? 'tw-ml-[0.25rem]' : '',
        'xl': props.icon?.trim() ? 'tw-ml-[0.25rem]' : '',
        '2xl': props.icon?.trim() ? 'tw-ml-[0.25rem]' : '',
    }[props.size]
});

const fontClass = computed(() => {
    return {
        '2xs': "tw-font-['Barlow_Semi_Condensed'] tw-text-xs tw-font-medium",
        'xs': "tw-font-['Barlow_Semi_Condensed'] tw-text-sm tw-font-medium",
        'sm': "tw-font-['Barlow_Semi_Condensed'] tw-text-base tw-font-medium",
        'md': "tw-font-['Barlow_Semi_Condensed'] tw-text-base tw-font-medium",
        'lg': "tw-font-['Barlow'] tw-text-2xl tw-font-semibold",
        'xl': "tw-font-['Barlow'] tw-text-3xl tw-font-semibold",
        '2xl': "tw-font-['Barlow'] tw-text-4xl tw-font-semibold",
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
    border: 1px solid v-bind(threadColor);
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
