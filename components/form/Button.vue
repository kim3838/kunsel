<template>
    <div class="relative box-border">
        <Glint :height-style="glintHeightStyle" :enable="glint" :orientation="'landscape'" :color="activeBorderComputed">
            <button
                ref="button"
                :disabled="disabled"
                :style="{'border-radius': '2px', 'direction': 'ltr', 'border': borderStyle}"
                :class="[
                    focusRing ? 'focus-ring-enable' : 'focus-ring-disable',
                    heightClass,
                    colorClass]"
                :type="type"
                class="
                    w-full
                    font-medium
                    tracking-wide
                    box-border
                    cursor-pointer
                    disabled:cursor-not-allowed
                    relative">
                <slot :fontClass="fontClass">
                    <div class="w-full h-full flex" :style="[contentStyle]">
                        <div
                            :style="{'filter': variant === 'default' ? 'drop-shadow(rgba(0, 0, 0, 0.3) 0px 1px 1px)' : 'none'}"
                            v-if="icon?.trim()"
                            :class="[iconHolderClass, iconSpacingClass, label?.trim() ? 'justify-end' : 'justify-center']"
                            class="flex-none flex items-center z-10">
                            <Icon v-if="icon?.trim()" :class="[iconClass]" :name="icon"></Icon>
                        </div>

                        <div v-if="label?.trim()" :class="['flex items-center truncate z-10', fontClass, labelSpacingClass]">{{label}}</div>
                    </div>
                </slot>
            </button>
        </Glint>
    </div>
</template>

<script setup>
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();
const button = ref(null);
const {focused: buttonFocused} = useFocus(button);
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
    focusRing: {
        type: Boolean,
        default: true
    },
    icon: {
        type: String,
        default: null,
    },
    flatBorderColor: {
        type: String,
        default: null,
    },
    activeBorder: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: '',
    },
    glint: {
        type: Boolean,
        default: false
    },
    justifyContent: {
        type: String,
        default: 'start',
    },
});

const emit = defineEmits(['focusStateChanged']);

const heightClass = computed(() => {
    return {
        '2xs': 'h-5',
        'xs': 'h-6',
        'sm': 'h-7',
        'md': 'h-8',
        'lg': 'h-11',
        'xl': 'h-14',
        '2xl' : 'h-16',
    }[props.size]
});

const glintHeightStyle = computed(() => {
    return {
        '2xs': '1.25rem',
        'xs': '1.5rem',
        'sm': '1.75rem',
        'md': '2rem',
        'lg': '2.75rem',
        'xl': '3.5rem',
        '2xl' : '4rem',
        '3xl' : '5rem',
    }[props.size]
});

const labelSpacingClass = computed(() => {
    return {
        '2xs': props.icon?.trim() ? 'pl-[0.2rem] pr-[0.5rem]' : 'px-[0.3rem]',
        'xs': props.icon?.trim() ? 'pl-[0.2rem] pr-[0.5rem]' : 'px-[0.3rem]',
        'sm': props.icon?.trim() ? 'pl-[0.2rem] pr-[0.5rem]' : 'px-[0.6rem]',
        'md': props.icon?.trim() ? 'pl-[0.2rem] pr-[0.5rem]' : 'px-[0.6rem]',
        'lg': props.icon?.trim() ? 'pl-1 pr-[0.5rem]' : 'px-[0.85rem]',
        'xl': props.icon?.trim() ? 'pl-1 pr-[0.5rem]' : 'px-[0.85rem]',
        '2xl': props.icon?.trim() ? 'pl-1 pr-[0.5rem]' : 'px-[1.25rem]'
    }[props.size]
});

const iconSpacingClass = computed(() => {
    return {
        '2xs': props.label?.trim() ? '' : 'pl-[0.15rem] mr-[0.1rem]',
        'xs': props.label?.trim() ? '' : 'pl-[0.15rem] mr-[0.2rem]',
        'sm': props.label?.trim() ? '' : (props.variant == 'default' ? 'pl-[0.5rem] mr-[0.4rem]' : 'pl-[0.45rem] mr-[0.45rem]'),
        'md': props.label?.trim() ? '' : (props.variant == 'default' ? 'pl-[0.45rem] mr-[0.4rem]' : 'pl-[0.45rem] mr-[0.4rem]'),
        'lg': props.label?.trim() ? '' : (props.variant == 'default' ? 'pl-[0.7rem] mr-[0.65rem]' : 'pl-[0.7rem] mr-[0.7rem]'),
        'xl': props.label?.trim() ? '' : (props.variant == 'default' ? 'pl-[0.65rem] mr-[0.6rem]' : 'pl-[0.65rem] mr-[0.65rem]'),
        '2xl': props.label?.trim() ? '' : (props.variant == 'default' ? 'pl-[1rem] mr-[0.85rem]' : 'pl-[1rem] mr-[0.9rem]')
    }[props.size]
});

const iconHolderClass = computed(() => {
    return {
        '2xs': props.variant == 'default' ? 'w-[1.2rem]': 'w-[1.2rem]',
        'xs': props.variant == 'default' ? 'w-[1.45rem]': 'w-[1.45rem]',
        'sm': props.variant == 'default' ? 'w-[1.7rem]': 'w-[1.7rem]',
        'md': props.variant == 'default' ? 'w-[1.7rem]': 'w-[1.7rem]',
        'lg': props.variant == 'default' ? 'w-[2.75rem]' : 'w-[2.75rem]',
        'xl': props.variant == 'default' ? 'w-[2.95rem]' : 'w-[2.95rem]',
        '2xl': props.variant == 'default' ? 'w-[3.95rem]' : 'w-[3.95rem]',
    }[props.size];
});

const iconClass = computed(() => {
    return {
        '2xs': 'h-4 w-4',
        'xs': 'h-5 w-5',
        'sm': 'h-5 w-5',
        'md': 'h-5 w-5',
        'lg': 'h-8 w-8',
        'xl': 'h-9 w-9',
        '2xl': 'h-12 w-12',
    }[props.size]
});

const fontClass = computed(() => {
    return {
        '2xs': "font-['Barlow_Semi_Condensed'] text-xs font-medium",
        'xs': "font-['Barlow_Semi_Condensed'] text-sm font-medium",
        'sm': "font-['Barlow_Semi_Condensed'] text-base font-medium",
        'md': "font-['Barlow_Semi_Condensed'] text-base font-medium",
        'lg': "font-['Barlow'] text-2xl font-semibold",
        'xl': "font-['Barlow'] text-3xl font-semibold",
        '2xl': "font-['Barlow'] text-4xl font-semibold",
    }[props.size]
});

const colorClass = computed(() => {
    return {
        'default': 'default-background',
        'outline': 'outlined',
        'flat': 'flat',
    }[props.variant]
});

const borderStyle = computed(() => {
    return {
        'default': '1px solid transparent',
        'outline': '1px solid ' + threadColor.value,
        'flat': '1px solid ' + ((props.flatBorderColor !== null) ? props.flatBorderColor : threadColor.value),
    }[props.variant]
});

const contentStyle = computed(() => {
    return {
        'justify-content': props.justifyContent
    }
});

const activeBorderComputed = computed(() => {
    return props.activeBorder ? props.activeBorder : liningColor.value;
});

watch(buttonFocused, (focused) => {
    emit('focusStateChanged', focused);
});

</script>

<style scoped>

.focus-ring-enable:focus{
    border-color: v-bind(activeBorderComputed) !important;
    outline: 2px solid transparent !important;
    outline-offset: 2px !important;
}

.focus-ring-disable:focus{
    outline: 2px solid transparent !important;
    outline-offset: 2px !important;
}

.shade{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 2px;
}

.default-background{
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 0.5) 0 1px 2px;
    background: linear-gradient(to right, v-bind(primaryColor80) 20%, v-bind(primaryColor) 50%, v-bind(primaryColor90) 100%);
    overflow: hidden;
}

.default-background::before{
    content: '';
    position: absolute;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    width: 120%;
    background-image: url('/images/deco/ripple_texture.png'), linear-gradient(to right, transparent, v-bind(primaryColor));
    background-size: cover;
    opacity: 0.2;
    transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
.default-background::after{
    content: '';
    position: absolute;
    top: -25%;
    bottom: -25%;
    left:0;
    right:0;
    width: 140%;
    background-image: url('/images/deco/ripple_texture.png'), linear-gradient(to right, transparent, v-bind(primaryColor));
    background-size: cover;
    opacity: 0;
    transition: all 200ms linear;
}
.default-background:hover::before, .default-background:active::before{
    left: -20%;
    opacity: 0.1;

}
.default-background:hover::after, .default-background:active::after{
    animation: slideTransition 6s linear infinite;
    opacity: 0.2;
}

@keyframes slideTransition {
    0% {left: 0;}
    50% {left: -40%;}
    100% {left: 0;}
}

.outlined{
    background-color: v-bind(tintColor) !important;
    color: v-bind(textColor) !important;
    overflow: hidden;
}
.outlined:hover{
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 0.5) 0 1px 2px;
}
.outlined::before{
    content: '';
    position: absolute;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    background: linear-gradient(to right, v-bind(primaryColor80) 20%, v-bind(primaryColor) 50%, v-bind(primaryColor90) 100%);
    opacity: 0;
    transition: all 100ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
.outlined::after{
    content: '';
    position: absolute;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    background-image: url('/images/deco/ripple_texture.png'), linear-gradient(to right, transparent, v-bind(primaryColor));
    background-size: cover;
    opacity: 0;
    transition: all 100ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
.outlined:hover::before{
    opacity: 1;
}
.outlined:hover::after{
    opacity: 0.2;
}
.flat{
    background-color: v-bind(tintColor) !important;
    color: v-bind(textColor) !important;
}

</style>
