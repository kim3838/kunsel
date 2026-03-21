<template>
    <div class="relative box-border">
        <Glint :height-style="glintHeightStyle" :enable="glint" :orientation="'landscape'" :color="activeBorderComputed">
            <button
                @pointerdown="pointerDownEvent()"
                ref="button"
                :disabled="disabled"
                :style="{'border-radius': '2px', 'direction': 'ltr', 'border': borderStyle}"
                :class="[
                    focusRing ? 'focus-ring-enable' : 'focus-ring-disable',
                    heightClass,
                    backgroundClass]"
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
                    <div class="w-full h-full flex" :class="contentFontClass" :style="[contentStyle]">
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
    appTheme,
    hexAlpha,
    primary: primaryColor,
    accent: accentColor,
    lining: liningColor,
    thread: threadColor,
    tint: tintColor,
    text: textColor,
    textInvert: textInvertColor
} = storeToRefs($themeStore);

const textInvertColor90 = computed(() => {
    return textInvertColor.value + hexAlpha.value['90'];
});
const textInvertComputed = computed(() => {
    return textInvertColor90.value;
})
const primaryColor90 = computed(() => {
    return primaryColor.value + hexAlpha.value['90'];
});
const primaryColor80 = computed(() => {
    return primaryColor.value + hexAlpha.value['80'];
});
const accentColor80 = computed(() => {
    return accentColor.value + hexAlpha.value['80'];
});
const accentColor70 = computed(() => {
    return accentColor.value + hexAlpha.value['70'];
});

const props = defineProps({
    type: {
        type: String,
        default: 'submit',
    },
    sound: {
        type: String,
        default: '/sounds/mouse-click-sfx-0.mp3'
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
    withBorder: {
        type: Boolean,
        default: true
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
    override: {
        type: Object,
        default: function () {
            return {}
        }
    },
});

const emit = defineEmits(['focusStateChanged']);

const pointerDownEvent = () => {

    if(!props.disabled){

    }
}

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
        '2xs': `text-xs font-normal`,
        'xs': `text-sm font-normal`,
        'sm': `text-base font-normal`,
        'md': `text-base font-normal`,
        'lg': `text-2xl font-medium`,
        'xl': `text-3xl font-medium`,
        '2xl': `text-4xl font-medium`,
    }[props.size]
});

const backgroundClass = computed(() => {

    let className = {
        'default': 'default-background',
        'outline': 'outlined',
        'flat': 'flat',
    }[props.variant];

    if(
        ['dark-silver'].indexOf(appTheme.value) >= 0 &&
        className === 'default-background'
    ){
        return `dark-clear-fluid-background`;
    }

    return className;
});

const borderStyle = computed(() => {
    const borderWidth = (props.withBorder && props.variant !== 'default') ? 1 : 0 ;

    return {
        'default': `${borderWidth}px solid transparent`,
        'outline': `${borderWidth}px solid ` + threadColor.value,
        'flat': '1px solid ' + ((props.flatBorderColor !== null) ? props.flatBorderColor : threadColor.value),
    }[props.variant]
});

const contentStyle = computed(() => {

    return {
        'justify-content': props.justifyContent,
    }
});

const contentFontClass = computed(() => {

    if(props.override.font_family_class){
        return props.override.font_family_class;
    }

    return {
        '2xs': 'condensed_font',
        'xs': 'condensed_font',
        'sm': 'condensed_font',
        'md': 'condensed_font',
        'lg': 'bold_font',
        'xl': 'bold_font',
        '2xl': 'bold_font',
    }[props.size];
});

const activeBorderComputed = computed(() => {
    return props.activeBorder ? props.activeBorder : liningColor.value;
});

watch(buttonFocused, (focused) => {
    emit('focusStateChanged', focused);
});

</script>

<style scoped>

.condensed_font {
    font-family: 'Reddit Sans Condensed';
}

.bold_font{
    font-family: 'Reddit Sans Condensed';
}

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
    position: relative;
    z-index: 1;
    color: v-bind(textInvertComputed) !important;
    text-shadow: rgba(0, 0, 0, 1) 0 1px 2px;
    background: linear-gradient(to right, v-bind(primaryColor) 20%, v-bind(primaryColor) 40%, v-bind(primaryColor80) 75%, v-bind(primaryColor90) 100%);
    overflow: hidden;
}
.default-background::before{
    z-index: -1;
    content: '';
    position: absolute;
    top:0;
    bottom: 0;
    left:-10%;
    right:0;
    width: 230%;
    background-image: url('/images/deco/fluid-gold-top.webp');
    filter: grayscale(100%);
    background-size: cover;
    opacity: 0.3;
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
    left: -45%;
}
.default-background:hover::after, .default-background:active::after{
    animation: slideTransition 6s linear infinite;
    opacity: 0.2;
}

.dark-clear-fluid-background{
    position: relative;
    z-index: 1;
    color: v-bind(textColor) !important;
    text-shadow: rgba(0, 0, 0, 1) 0 1px 2px;
    background: linear-gradient(to right, v-bind(accentColor70) 20%, v-bind(accentColor70) 60%, v-bind(accentColor) 75%, v-bind(accentColor80) 100%);
    overflow: hidden;
}
.dark-clear-fluid-background::before{
    z-index: -1;
    content: '';
    position: absolute;
    top:0;
    bottom: 0;
    left:-35%;
    right:0;
    width: 230%;
    background-image: url('/images/deco/fluid-gold-top.webp');
    filter: grayscale(100%);
    background-size: cover;
    opacity: 0.2;
    transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
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
    position: relative;
    z-index: 1;
    color: v-bind(textColor) !important;
    overflow: hidden;
}
.outlined::before{
    z-index: -1;
    content: '';
    position: absolute;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    width: 230%;
    background-image: url('/images/deco/fluid-gold-top.webp');
    filter: grayscale(100%);
    background-size: cover;
    opacity: 0.1;
    transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
.outlined:hover::before{
    left:-45%;
    opacity: 0.4;
}
.outlined::after{
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
.outlined:hover::after{
    animation: slideTransition 6s linear infinite;
    opacity: 0.3;
}
.flat{
    position: relative;
    z-index: 1;
    background-color: v-bind(tintColor) !important;
    color: v-bind(textColor) !important;
    overflow: hidden;
}
.flat::before{
    z-index: -1;
    content: '';
    position: absolute;
    top:0;
    bottom: 0;
    left:-10%;
    right:0;
    width: 230%;
    background-image: url('/images/deco/fluid-gold-top.webp');
    filter: grayscale(100%);
    background-size: cover;
    opacity: 0.2;
    transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
.flat::after{
    z-index: -1;
    content: '';
    position: absolute;
    top: -25%;
    bottom: -25%;
    left:0;
    right:0;
    width: 140%;
    background-image: url('/images/deco/ripple_texture.png'), linear-gradient(to right, transparent, v-bind(primaryColor));
    background-size: cover;
    opacity: 0.2;
    transition: all 200ms linear;
}
.flat:hover::before{
    left:-45%;
    opacity: 0.4;
}
.flat:hover::after{
    animation: slideTransition 6s linear infinite;
    opacity: 0.4;
}
</style>
