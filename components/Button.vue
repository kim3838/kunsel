<template>
    <button
        ref="button"
        :disabled="disabled"
        :style="{'border-radius': '2px'}"
        :class="[heightClass, colorClass, borderClass]"
        :type="type"
        class="
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
            <div class="tw-w-full tw-h-full tw-flex" :class="[fontClass]">
                <div
                    v-if="icon?.trim()"
                    :class="[iconHolderClass, label?.trim() ? 'tw-justify-end' : 'tw-justify-center']"
                    class="tw-flex tw-items-center">
                    <ClientOnly><Icon v-if="icon?.trim()" :class="[iconClass]" :name="icon"></Icon></ClientOnly>
                </div>

                <div v-if="label?.trim()" :class="['tw-w-full tw-flex tw-items-center tw-truncate', labelSpacingClass]">{{label}}</div>
            </div>
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

const labelSpacingClass = computed(() => {
    return {
        '2xs': props.icon?.trim() ? 'tw-px-[0.2rem]' : 'tw-px-1',
        'xs': props.icon?.trim() ? 'tw-px-[0.2rem]' : 'tw-px-1',
        'sm': props.icon?.trim() ? 'tw-px-[0.2rem]' : 'tw-px-2',
        'md': props.icon?.trim() ? 'tw-px-1' : 'tw-px-2',
        'lg': props.icon?.trim() ? 'tw-px-1' : 'tw-px-2',
        'xl': props.icon?.trim() ? 'tw-px-1' : 'tw-px-4',
        '2xl': props.icon?.trim() ? 'tw-px-1' : 'tw-px-4'
    }[props.size]
});

const iconHolderClass = computed(() => {
    return {
        '2xs': props.variant == 'default' ? 'tw-w-[1.3rem]': 'tw-w-[1.25rem]',
        'xs': props.variant == 'default' ? 'tw-w-[1.575rem]': 'tw-w-[1.475rem]',
        'sm': props.variant == 'default' ? 'tw-w-[2.05rem]': 'tw-w-[1.95rem]',
        'md': props.variant == 'default' ? 'tw-w-[2.05rem]': 'tw-w-[1.95rem]',
        'lg': props.variant == 'default' ? 'tw-w-[2.85rem]' : 'tw-w-[2.75rem]',
        'xl': props.variant == 'default' ? 'tw-w-[3.55rem]' : 'tw-w-[3.5rem]',
        '2xl': props.variant == 'default' ? 'tw-w-[4rem]' : 'tw-w-[3.95rem]',
    }[props.size];
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
