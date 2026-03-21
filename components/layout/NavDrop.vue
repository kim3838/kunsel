<template>
    <div
        ref="navDrop"
        tabindex="0"
        :class="[disabled ? 'pointer-events-none' : '']"
        class="cursor-pointer focus:outline-none">
        <slot :slot="{headerFontClass: headerFontClass, dropDownIconClass: dropDownIconClass, title: title, parentIcon: parentIcon}">
            <div
                :style="{'font-family': fontFamily}"
                :class="[classes, activeClass, parent ? 'rounded-[2px]' : '']"
                class="flex items-center h-full px-2 py-1 focus:outline-none">
                <Icon v-if="icon" :class="[iconClass]" :name="icon" class="mr-1" />
                <span :class="[headerFontClass]">{{title}}</span>
                <Icon :class="[dropDownIconClass]" :name="navDropIcon"/>
            </div>
        </slot>
        <div
            ref="navDropOptions"
            v-if="activeComputed"
            :style="[navDropOptionsStyleComputed]"
            class="box-border"
            :class="['nav-drop-options-parent', navDropOptionsClass]">
            <div class="relative w-max">
                <div v-if="true" class="absolute border-solid" :style="[optionsArrowSlotStyle]"></div>
                <div v-if="true" class="absolute border-solid" :style="[optionsArrowStyle]"></div>
                <div
                    v-for="(dropOption, dropOptionIndex) in dropOptions" :key="dropOption.title"
                    :class="[
                        dropOptionIndex == (dropOptions.length - 1) ? 'no-border-bottom' : `${divider ? 'scaffold' : 'transparent'}-border-bottom`,

                    ]"
                    class="cursor-pointer flex items-center"><!-- _includes(['anchor-link', 'action'], dropOption.type) ? 'nav-drop-link' : '' -->

                    <LinkWrapper
                        v-if="dropOption.type === 'link'"
                        :to="dropOption.to"
                        class="px-2 py-1 w-full inline-flex items-center focus:outline-none"
                        :class="[childNonDropFontClass]"
                        :active="isRouteActive(dropOption.route_active)"
                        :active-style="dropActiveStyle">
                        <Icon v-if="dropOption.icon" :class="[dropDownIconClass]" :name="dropOption.icon" class="mr-1" /><span>{{dropOption.title}}</span>
                    </LinkWrapper>

                    <a
                        v-if="dropOption.type == 'anchor-link'"
                       :href="dropOption.to"
                        class="w-full h-full flex">
                        <NuxtLink
                            class="px-2 py-1 w-full inline-flex items-center focus:outline-none"
                            :class="[childNonDropClasses, childNonDropFontClass]">
                            <Icon v-if="dropOption.icon" :class="[dropDownIconClass]" :name="dropOption.icon" class="mr-1" /><span>{{dropOption.title}}</span>
                        </NuxtLink>
                    </a>

                    <div v-if="dropOption.type === 'action'"
                         @click="typeof dropOption.callback == 'function' ? dropOption.callback() : false;"
                         class="relative px-2 py-1 w-full inline-flex items-center focus:outline-none"
                         :class="[childNonDropClasses, childNonDropFontClass]">
                        <Icon v-if="dropOption.icon" :name="dropOption.icon" :class="[dropDownIconClass]" class="mr-1" /><span>{{dropOption.title}}</span>
                    </div>

                    <NavDrop
                        class="w-full"
                        :data-path-active="dropOption.path_active"
                        v-if="_includes([ 'drop', 'sub-nav'], dropOption.type)"
                        :navigation-mode="navigationMode"
                        :parent="false"
                        :size="childDropSize"
                        :drop-shadow-size="dropShadowSize"
                        :drop-align="'top'"
                        :drop-justify="'right'"
                        :title="dropOption.title"
                        :icon="dropOption.icon"
                        :drop-options="dropOption.options"
                        :proxy-active="isRoutePathActive(dropOption.path_active)"
                        :active-style="activeStyle"
                        :drop-active-style="dropActiveStyle"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import {storeToRefs} from 'pinia';

const {$themeStore} = useNuxtApp();
const nuxtApp = useNuxtApp();
const isRouteActive = nuxtApp.$isRouteActive as (name: string | undefined) => boolean;
const isRoutePathActive = nuxtApp.$isRoutePathActive as (path: string | undefined) => boolean;
const {
    navigationMode: layoutNavigationMode,
} = useLayout();
const {
    hexAlpha,
    primary: primaryColor,
    accent: accentColor,
    lining: liningColor,
    neutral: neutralColor,
    textInvert: textInvertColor,
    tint: tintColor
} = storeToRefs($themeStore);

const primaryColor70 = computed(() => {
    return primaryColor.value + hexAlpha.value['70'];
});
const primaryColor50 = computed(() => {
    return primaryColor.value + hexAlpha.value['50'];
});
const primaryColor40 = computed(() => {
    return primaryColor.value + hexAlpha.value['40'];
});
const accentColor70 = computed(() => {
    return accentColor.value + hexAlpha.value['70'];
});
const primaryColor60 = computed(() => {
    return primaryColor.value + hexAlpha.value['60'];
});
const accentColor60 = computed(() => {
    return accentColor.value + hexAlpha.value['60'];
});
const accentColor40 = computed(() => {
    return accentColor.value + hexAlpha.value['40'];
});

const props = defineProps({
    dropOptions: {
        type: Array,
        default: []
    },
    title: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: null,
    },
    parentIcon: {
        type: String,
        default: null,
    },
    size: {
        default: 'md'
    },
    navigationMode: {
        type: Boolean,
        default: false
    },
    dropShadowSize: {
        default: 'none'
    },
    dropJustify: {
        default: 'bottom'
    },
    dropAlign: {
        default: 'left'
    },
    parent: {
        type: Boolean,
        default: true
    },
    activeStyle: {
        type: String,
        default: 'bg',
    },
    dropActiveStyle: {
        type: String,
        default: 'bg',
    },
    proxyActive: {
        type: Boolean,
        default: false
    },
    alwaysActive: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    inSubRow: {
        type: Boolean,
        default: false
    },
    fontFamily: {
        type: String,
        default: 'inherit'
    },
    inHorizontalScrollable: Boolean,
    scrollReference: {
        type: Object as PropType<HTMLElement | null>,
        default: null
    },
    checkboxCellReference: {
        type: Object as PropType<HTMLElement | null>,
        default: null
    },
    divider: {
        type: Boolean,
        default: false
    },
});

const navDrop = ref(null);
const navDropReference = useTemplateRef('navDrop');
const navDropOptionsReference = useTemplateRef('navDropOptions');

const navHeaderOffsetWidth = ref<number | null>(null);
const navHeaderOffsetHeight = ref<number | null>(null);
const navHeaderOffsetLeft = ref<number | null>(null);

const offsetLeft = ref<number | null>(null);

const navDropOptionsOffsetWidth = ref<number | null>(null);

onMounted(async () => {
    await nextTick();
    navHeaderOffsetWidth.value = navDropReference.value ? navDropReference.value.offsetWidth : null;
    navHeaderOffsetHeight.value = navDropReference.value ? navDropReference.value.offsetHeight : null;
    navHeaderOffsetLeft.value = navDropReference.value ? navDropReference.value.offsetLeft : null;

    if(props.alwaysActive){
        navDropOptionsOffsetWidth.value = navDropOptionsReference.value ? navDropOptionsReference.value.offsetWidth : null;
    }

    if(props.inHorizontalScrollable && !props.inSubRow){
        navHeaderOffsetLeft.value = navDropReference.value ? navDropReference.value.getBoundingClientRect().left : null;
    }

    offsetLeft.value = (navHeaderOffsetWidth.value ?? 0) + (navHeaderOffsetLeft.value ?? 0);

    if(props.inSubRow && props.checkboxCellReference){

        offsetLeft.value += props.checkboxCellReference.offsetWidth;
    }
});
const navigationTextShadow = computed(()=>{
    if(layoutNavigationMode.value == 'clear-with-background'){
        return '1px 1px 2px #000000';
    }

    return 'none';
});

const navDropIcon = computed(()=>{
    if(props.parentIcon){
        return props.parentIcon;
    } else {
        return props.parent ? 'ic:baseline-arrow-drop-down' : 'ic:baseline-arrow-right';
    }
});

const navigationLinkColor = computed(()=>{
    if(layoutNavigationMode.value == 'clear-with-background'){
        return '#ffffff';
    }

    return 'auto';
});
const navDropOptionsParentBackgroundColor = computed(()=>{
    if(
        layoutNavigationMode.value == 'clear-with-background'
    ){
        return accentColor70.value;
    }

    return tintColor.value;
});
const navDropOptionsParentBorderColor = computed(()=>{
    if(
        layoutNavigationMode.value == 'clear-with-background'
    ){
        return accentColor70.value;
    }

    return liningColor.value;
});

const activeComputed = ref(props.alwaysActive);

watch(activeComputed, async (newValue) => {
    await nextTick();

    if(newValue){
        navHeaderOffsetWidth.value = navDropReference.value ? navDropReference.value.offsetWidth : null;
        navHeaderOffsetHeight.value = navDropReference.value ? navDropReference.value.offsetHeight : null;
        navHeaderOffsetLeft.value = navDropReference.value ? navDropReference.value.offsetLeft : null;

        navDropOptionsOffsetWidth.value = navDropOptionsReference.value ? navDropOptionsReference.value.offsetWidth : null;

        if(props.inHorizontalScrollable && !props.inSubRow){
            navHeaderOffsetLeft.value = navDropReference.value ? navDropReference.value.getBoundingClientRect().left : null;
        }

        offsetLeft.value = (navHeaderOffsetWidth.value ?? 0) + (navHeaderOffsetLeft.value ?? 0);

        if(props.inSubRow && props.checkboxCellReference){

            offsetLeft.value += props.checkboxCellReference.offsetWidth;
        }
    }
});

const navDropOptionsStyleComputed = computed(() => {
    let styleTemp = {};

    if(_includes(['left', 'right'], props.dropJustify)){
        let originMargin = props.dropJustify === 'left' ? 'right' : 'left';

        if(props.dropAlign == 'top'){
            styleTemp = {
                [`margin-${props.dropAlign}`]: `calc(-${navHeaderOffsetHeight.value}px - 1px)`,
            }
        } else if (props.dropAlign == 'bottom'){
            styleTemp = {
                [`bottom`]: `0`,
            }
        }

        if(props.dropJustify == 'right'){
            styleTemp = {
                ...styleTemp,
                [`margin-${originMargin}`]: '7px',
                left: `${offsetLeft.value}px`
            };
        } else if(props.dropJustify == 'left'){
            styleTemp = {
                ...styleTemp,
                [`margin-left`]: `-${navDropOptionsOffsetWidth.value + 7}px`
            };
        }


    } else if (_includes(['bottom'], props.dropJustify)){
        styleTemp = {
            'margin-top': '7px',
        }

        if(props.dropAlign == 'left'){
            styleTemp = {
                ...styleTemp,
                left: `${navHeaderOffsetLeft.value}px`
            }
        } else if (props.dropAlign == 'right'){
            styleTemp = {
                ...styleTemp,
                left: `${offsetLeft.value - navDropOptionsOffsetWidth.value}px`
            }
        }
    }

    return styleTemp
});

const { focused: navigationFocused } = useFocus(navDropReference);

const handleClickOutside = (event) => {
    if(props.alwaysActive){
        return;
    }

    if (navDropReference.value && !navDropReference.value.contains(event.target)) {
        activeComputed.value = false;
    }
};

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});

watch(navigationFocused, value => {

    if(props.disabled){
        return;
    }

    if(value && props.dropOptions.length){
        activeComputed.value = true;
    }
});

const classes = computed(() => {

    return props.navigationMode ? `navigation-mode-nav-drop` : `nav-drop`;
});

const activeClass = computed(() => {

    let classes = ``;

    if(props.navigationMode){

        if(props.proxyActive){
            return `navigation-mode-nav-drop-active-${props.activeStyle}`;
        }

        if(activeComputed.value){
            return `navigation-mode-nav-drop-active-${props.activeStyle}`;
        }

    } else {

        if(props.proxyActive){
            return `nav-drop-active-dashed`;
        }

        if(activeComputed.value){
            return `nav-drop-active-${props.activeStyle}`;
        }
    }

    return classes;
});

const headerFontClass = computed(() => {

    if(props.navigationMode){
        return {
            'xs': 'text-xs',
            'sm': 'text-sm',
            'md': 'text-base',
            'lg': 'text-lg',
        }[props.size];
    } else {
        return {
            'xs': 'text-sm',
            'sm': 'text-base',
            'md': 'text-lg',
            'lg': 'text-lg',
        }[props.size];
    }
});

const childNonDropClasses = computed(() => {
    let classes = '';

    classes = classes + {
        'bg': 'child-non-drop-bg',
        'clear-fluid': 'child-non-drop-clear-fluid',
    }[props.activeStyle];

    return classes
})
const childNonDropFontClass = computed(() => {
    if(props.navigationMode){
        return {
            'xs': 'text-xs',
            'sm': 'text-sm',
            'md': 'text-base',
            'lg': 'text-lg',
        }[props.size];
    } else {
        return {
            'xs': 'text-sm',
            'sm': 'text-base',
            'md': 'text-lg',
            'lg': 'text-lg',
        }[props.size];
    }
});
const childDropSize = computed(() => {
    return {
        'xs': 'xs',
        'sm': 'sm',
        'md': 'md',
        'lg': 'lg',
    }[props.size]
});

const navDropOptionsClass = computed(() => {
    return {
        'none': 'shadow-none',
        'xs': 'shadow-lg',
        'sm': 'shadow-lg',
        'md': 'shadow-lg',
        'lg': 'shadow-lg',
        'xl': 'shadow-xl',
    }[props.dropShadowSize]
});

const verticalAlignedArrowSpacingComputed = computed(() => {
    let spacing = 0;

    if(_includes(['left', 'right'], props.dropJustify)){

        spacing = {
            'xs': 7,
            'sm': 9,
            'md': 11,
            'lg': 11,
        }[props.size] ?? 7;
    }

    return spacing;
})
const optionsArrowSlotStyle = computed(() => {
    let styleTemp = {};

    if(_includes(['left', 'right'], props.dropJustify)){
        let originMargin = props.dropJustify === 'left' ? 'right' : 'left';
        let originSpacing = verticalAlignedArrowSpacingComputed.value;

        styleTemp = {
            [props.dropAlign]: `${originSpacing}px`,
            [originMargin]: `-7px`,
            'border-top': '7px solid transparent',
            'border-bottom': '7px solid transparent',
            [`border-${props.dropJustify}`]: '7px',
            [`border-${props.dropJustify}-color`]: navDropOptionsParentBorderColor.value
        };
    } else if (_includes(['bottom'], props.dropJustify)){

        styleTemp = {
            [props.dropAlign]:'9px',
            'top': '-7px',
            'border-right': '7px solid transparent',
            'border-left': '7px solid transparent',
            'border-bottom': '7px',
            'border-bottom-color': navDropOptionsParentBorderColor.value
        };
    }

    return styleTemp;
});

const optionsArrowStyle = computed(() => {
    let styleTemp = {};

    if(_includes(['left', 'right'], props.dropJustify)){
        let originMargin = props.dropJustify === 'left' ? 'right' : 'left';
        let originSpacing = verticalAlignedArrowSpacingComputed.value;

        styleTemp = {
            [props.dropAlign]: `${originSpacing + 1}px`,
            [originMargin]: `-6px`,
            'border-top': '6px solid transparent',
            'border-bottom': '6px solid transparent',
            [`border-${props.dropJustify}`]: '7px',
            [`border-${props.dropJustify}-color`]: tintColor.value
        };
    } else if (_includes(['bottom'], props.dropJustify)){
        styleTemp = {
            [props.dropAlign]:'10px',
            'top': '-6px',
            'border-right': '6px solid transparent',
            'border-left': '6px solid transparent',
            'border-bottom': '6px',
            'border-bottom-color': tintColor.value
        };
    }

    return styleTemp;
});

const iconClass = computed(() => {
    return {
        'xs': 'h-5 w-5',
        'sm': 'h-5 w-5',
        'md': 'h-5 w-5',
        'lg': 'h-8 w-8'
    }[props.size];
});

const dropDownIconClass = computed(() => {
    return {
        'xs': 'h-5 w-5',
        'sm': 'h-5 w-5',
        'md': 'h-5 w-5',
        'lg': 'h-6 w-6'
    }[props.size];
});
</script>
<style scoped>
.nav-drop{
    color: v-bind(navigationLinkColor);
}

.nav-drop-active-bg{
    background-color: v-bind(accentColor70);
}

.nav-drop-active-dashed::before{
    content: '';
    position: absolute;
    top:-1px;
    bottom: 0;
    left:0;
    right:0;
    border-top: 1px dashed v-bind(liningColor);
}
.nav-drop-active-dashed{
    position: relative;
}
.nav-drop-active-dashed::after{
    content: '';
    position: absolute;
    top:0;
    bottom: -1px;
    left:0;
    right:0;
    border-bottom: 1px dashed v-bind(liningColor);
}

.nav-drop-active-clear-fluid{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(10, 10, 10, 0.9) 0 1px 2px;
    background: linear-gradient(to right, v-bind(primaryColor70) 20%, v-bind(accentColor) 60%, v-bind(accentColor) 75%, v-bind(primaryColor60) 100%);
    overflow: hidden;
}
.nav-drop-active-clear-fluid::before{
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



.navigation-mode-nav-drop{
    position: relative;
    z-index: 1;
    color: v-bind(navigationLinkColor);
    overflow: hidden;
}
.navigation-mode-nav-drop::before{
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
    opacity: 0;
    transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
.navigation-mode-nav-drop:hover{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(10, 10, 10, 0.9) 0 1px 2px;
    background: linear-gradient(to right, v-bind(primaryColor70) 20%, v-bind(accentColor) 60%, v-bind(accentColor) 75%, v-bind(primaryColor60) 100%);
    overflow: hidden;
}
.navigation-mode-nav-drop:hover::before{
    left:-35%;
    opacity: 0.2;
}

.navigation-mode-nav-drop-active-clear-fluid{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(10, 10, 10, 0.9) 0 1px 2px;
    background: linear-gradient(to right, v-bind(primaryColor70) 20%, v-bind(accentColor) 60%, v-bind(accentColor) 75%, v-bind(primaryColor60) 100%);
    overflow: hidden;
}
.navigation-mode-nav-drop-active-clear-fluid::before{
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

.nav-drop-options-parent{
    position: absolute;
    border: 1px solid v-bind(navDropOptionsParentBorderColor);

    background-color: v-bind(navDropOptionsParentBackgroundColor);
}

.nav-drop-active-clear-fluid{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 1) 0 1px 2px;
    background: linear-gradient(to right, v-bind(primaryColor70) 20%, v-bind(accentColor) 60%, v-bind(accentColor) 75%, v-bind(primaryColor60) 100%);
    overflow: hidden;
}
.nav-drop-active-clear-fluid::before{
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

.nav-drop-link{
    color: v-bind(navigationLinkColor);
}

.child-non-drop-bg{
    color: v-bind(navigationLinkColor);
}
.child-non-drop-bg:hover{
    background-color: v-bind(accentColor70);
}

.child-non-drop-clear-fluid{
    position: relative;
    z-index: 1;
    color: v-bind(navigationLinkColor);
    overflow: hidden;
}
.child-non-drop-clear-fluid::before{
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
    opacity: 0;
    transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
.child-non-drop-clear-fluid:hover{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    text-shadow: rgba(0, 0, 0, 1) 0 1px 2px;
    background: linear-gradient(to right, v-bind(primaryColor70) 20%, v-bind(accentColor) 60%, v-bind(accentColor) 75%, v-bind(primaryColor60) 100%);
    overflow: hidden;
}
.child-non-drop-clear-fluid:hover::before{
    left:-35%;
    opacity: 0.2;
}

.transparent-border-bottom{
    border-bottom: 1px solid transparent;
}
.no-border-bottom{
    border-bottom: none;
}
</style>