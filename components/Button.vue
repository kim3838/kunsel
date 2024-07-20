<template>
    <button
        ref="button"
        :disabled="disabled"
        :style="{'border-radius': '2px', 'direction': 'ltr', 'border': borderStyle}"
        :class="[heightClass, colorClass]"
        :type="type"
        class="
            tw-font-medium
            tw-tracking-wide
            tw-box-border
            focus:tw-outline-none
            focus:tw-ring
            focus:tw-ring-transparent
            disabled:tw-cursor-not-allowed
            tw-transition
            tw-ease-in-out
            tw-duration-300
            tw-relative">
        <div :class="[shadeClass]" class="shade"></div>
        <slot :fontClass="fontClass">
            <div class="tw-w-full tw-h-full tw-flex" :class="[fontClass]">
                <div
                    :style="{'filter': variant === 'default' ? 'drop-shadow(rgba(0, 0, 0, 0.3) 0px 1px 1px)' : 'none'}"
                    v-if="icon?.trim()"
                    :class="[iconHolderClass, iconSpacingClass, label?.trim() ? 'tw-justify-end' : 'tw-justify-center']"
                    class="tw-flex-none tw-flex tw-items-center">
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
const primaryColor80 = computed(() => {
    return primaryColor.value + hexAlpha.value['80'];
});
const primaryColor70 = computed(() => {
    return primaryColor.value + hexAlpha.value['70'];
});
const primaryColor50 = computed(() => {
    return primaryColor.value + hexAlpha.value['50'];
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
    flatBorderColor: {
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
        '2xs': props.icon?.trim() ? 'tw-pl-[0.2rem] tw-pr-[0.5rem]' : 'tw-px-1',
        'xs': props.icon?.trim() ? 'tw-pl-[0.2rem] tw-pr-[0.5rem]' : 'tw-px-1',
        'sm': props.icon?.trim() ? 'tw-pl-[0.2rem] tw-pr-[0.5rem]' : 'tw-px-2',
        'md': props.icon?.trim() ? 'tw-pl-1 tw-pr-[0.5rem]' : 'tw-px-2',
        'lg': props.icon?.trim() ? 'tw-pl-1 tw-pr-[0.5rem]' : 'tw-px-2',
        'xl': props.icon?.trim() ? 'tw-pl-1 tw-pr-[0.5rem]' : 'tw-px-4',
        '2xl': props.icon?.trim() ? 'tw-pl-1 tw-pr-[0.5rem]' : 'tw-px-4'
    }[props.size]
});

const iconSpacingClass = computed(() => {
    return {
        '2xs': props.label?.trim() ? '' : 'tw-pl-[0.15rem] tw-mr-[0.1rem]',
        'xs': props.label?.trim() ? '' : 'tw-pl-[0.15rem] tw-mr-[0.2rem]',
        'sm': props.label?.trim() ? '' : (props.variant == 'default' ? 'tw-pl-[0.5rem] tw-mr-[0.45rem]' : 'tw-pl-[0.45rem] tw-mr-[0.35rem]'),
        'md': props.label?.trim() ? '' : (props.variant == 'default' ? 'tw-pl-[0.45rem] tw-mr-[0.4rem]' : 'tw-pl-[0.45rem] tw-mr-[0.35rem]'),
        'lg': props.label?.trim() ? '' : (props.variant == 'default' ? 'tw-pl-[0.575rem] tw-mr-[0.35rem]' : 'tw-pl-[0.575rem] tw-mr-[0.3rem]'),
        'xl': props.label?.trim() ? '' : (props.variant == 'default' ? 'tw-pl-[0.675rem] tw-mr-[0.55rem]' : 'tw-pl-[0.675rem] tw-mr-[0.5rem]'),
        '2xl': props.label?.trim() ? '' : (props.variant == 'default' ? 'tw-pl-[0.8rem] tw-mr-[0.75rem]' : 'tw-pl-[0.8rem] tw-mr-[0.7rem]')
    }[props.size]
});

const iconHolderClass = computed(() => {
    return {
        '2xs': props.variant == 'default' ? 'tw-w-[1.25rem]': 'tw-w-[1.2rem]',
        'xs': props.variant == 'default' ? 'tw-w-[1.5rem]': 'tw-w-[1.4rem]',
        'sm': props.variant == 'default' ? 'tw-w-[1.75rem]': 'tw-w-[1.7rem]',
        'md': props.variant == 'default' ? 'tw-w-[1.75rem]': 'tw-w-[1.7rem]',
        'lg': props.variant == 'default' ? 'tw-w-[2.85rem]' : 'tw-w-[2.75rem]',
        'xl': props.variant == 'default' ? 'tw-w-[3rem]' : 'tw-w-[2.9rem]',
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

const borderStyle = computed(() => {
    return {
        'default': 'auto',
        'outline': '1px solid ' + threadColor.value,
        'flat': '1px solid ' + ((props.flatBorderColor !== null) ? props.flatBorderColor : threadColor.value),
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
    background: linear-gradient(to right, v-bind(primaryColor80) 20%, v-bind(primaryColor) 50%, v-bind(primaryColor90) 100%);
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 0.5) 0 1px 2px;
}

.default-background:hover, .default-background:active{
    background: linear-gradient(to right, v-bind(primaryColor) 20%, v-bind(primaryColor80) 50%, v-bind(primaryColor) 100%);
}

.default-shade{
    background-image: url('/images/deco/ripple_texture.png'), linear-gradient(to right, transparent, v-bind(primaryColor));
    background-size: cover;
    opacity: 0.2;
}

.outlined{
    background-color: v-bind(tintColor) !important;
    color: v-bind(textColor) !important;
}

.outlined:hover{
    background: linear-gradient(to right, v-bind(primaryColor80) 20%, v-bind(primaryColor) 50%, v-bind(primaryColor90) 100%);
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 0.5) 0 1px 2px;
}

.outline-shade{

}

.outline-shade:hover{
    background-image: url('/images/deco/ripple_texture.png'), linear-gradient(to right, transparent, v-bind(primaryColor));
    background-size: cover;
    opacity: 0.2;
}

.flat{
    background-color: v-bind(tintColor) !important;
    color: v-bind(textColor) !important;
}

</style>
