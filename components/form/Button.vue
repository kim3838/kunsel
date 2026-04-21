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
                    textClass,
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
const button = ref(null);
const {focused: buttonFocused} = useFocus(button);
const {
    appTheme,

    primaryColor,

    liningColor,
    threadColor,

    tintColor,

    textColor,
    textInvertColor90,

    buttonDefaultBackground,
    buttonDarkBackground,
    activeClearFluidBackground
} = useCosmetic();

const textInvertComputed = computed(() => {
    return textInvertColor90.value;
})

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

const variantClass = computed(() => {
    let variant = {
        'default': 'default-background',
        'outline': 'outlined',
        'flat': 'flat',
    }[props.variant];

    if(['dark-silver', 'dark-emerald'].indexOf(appTheme.value) >= 0){
        return 'dark-flat';
    }

    return variant;
})

const backgroundClass = computed(() => {

    let className = variantClass.value;

    if(['dark-silver'].indexOf(appTheme.value) >= 0 && className === 'default-background'){
        return `dark-clear-fluid-background`;
    }

    return className;
});

const textClass = computed(() => {

    let className = variantClass.value;

    if(['dark-silver', 'dark-emerald'].indexOf(appTheme.value) >= 0){
        return `text-shadow`;
    }

    if(['light-slate', 'light-blue'].indexOf(appTheme.value) >= 0 && className === 'default-background'){
        return `text-shadow`;
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

<style lang="scss" scoped>
@keyframes slideTransition {
    0% {left: 0;}
    50% {left: -40%;}
    100% {left: 0;}
}

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
    background: v-bind(buttonDefaultBackground);
    overflow: hidden;
    @include fluid-gold-hover-before-effect($left: -45%, $opacity: 0.3, $fluidGoldBeforeLeft: -10%, $fluidGoldBeforeOpacity: 0.3);
    @include ripple-hover-after-effect();
}

.dark-clear-fluid-background{
    position: relative;
    z-index: 1;
    color: v-bind(textColor) !important;
    background: v-bind(buttonDarkBackground);
    overflow: hidden;
    @include fluid-gold-before();
}

.outlined{
    position: relative;
    z-index: 1;
    background-color: v-bind(tintColor) !important;
    color: v-bind(textColor) !important;
    overflow: hidden;
    @include fluid-gold-hover-before-effect($left: -45%, $opacity: 0.4, $fluidGoldBeforeLeft: -10%, $fluidGoldBeforeOpacity: 0.2)
}

.dark-flat{
    position: relative;
    z-index: 1;
    background-color: v-bind(tintColor) !important;
    color: v-bind(textColor) !important;
    overflow: hidden;
    @include fluid-gold-hover-before-effect($left: -45%, $opacity: 0.4, $fluidGoldBeforeLeft: -10%, $fluidGoldBeforeOpacity: 0.2)
}

.flat{
    position: relative;
    z-index: 1;
    background-color: v-bind(tintColor) !important;
    color: v-bind(textColor) !important;
    overflow: hidden;
    @include fluid-gold-hover-before-effect($left: -45%, $opacity: 0.2, $fluidGoldBeforeLeft: -10%, $fluidGoldBeforeOpacity: 0.2)
}

.flat:hover{
    @extend .text-shadow;
    color: v-bind(textInvertComputed) !important;
    background: v-bind(buttonDefaultBackground);
    @include ripple-hover-after-effect();
}
</style>
