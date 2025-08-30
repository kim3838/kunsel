<template>
    <div
        ref="navDrop"
        tabindex="0"
        class="cursor-pointer">
        <slot :slot="{headerFontClass: headerFontClass, dropDownIconClass: dropDownIconClass, title: title, parentIcon: parentIcon}">
            <div
                :style="{'text-shadow': navigationTextShadow, 'font-family': fontFamily}"
                :class="[classes]"
                class="nav-drop flex items-center h-full px-2 py-1 focus:outline-none">
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
                <div v-for="dropOption in dropOptions" :key="dropOption.title" :style="{'text-shadow': navigationTextShadow}" class="nav-drop-link cursor-pointer">

                    <NuxtLink
                        v-if="dropOption.type === 'link'"
                        :to="dropOption.to"
                        class="px-2 py-1 w-full inline-flex items-center"
                        :class="[childNonDropFontClass]">
                        <Icon v-if="dropOption.icon" :class="[dropDownIconClass]" :name="dropOption.icon" class="mr-1" /><span>{{dropOption.title}}</span>
                    </NuxtLink>

                    <a v-if="dropOption.type == 'anchor-link'" :href="dropOption.to">
                        <NuxtLink
                            class="px-2 py-1 w-full inline-flex items-center"
                            :class="[childNonDropFontClass]">
                            <Icon v-if="dropOption.icon" :class="[dropDownIconClass]" :name="dropOption.icon" class="mr-1" /><span>{{dropOption.title}}</span>
                        </NuxtLink>
                    </a>

                    <div v-if="dropOption.type === 'action'"
                         @click="typeof dropOption.callback == 'function' ? dropOption.callback() : false;"
                         class="px-2 py-1 w-full inline-flex items-center"
                         :class="[childNonDropFontClass]">
                        <Icon v-if="dropOption.icon" :name="dropOption.icon" :class="[dropDownIconClass]" class="mr-1" /><span>{{dropOption.title}}</span>
                    </div>

                    <NavDrop
                        class="w-full"
                        v-if="_includes([ 'drop', 'sub-nav'], dropOption.type)"
                        :parent="false"
                        :size="childDropSize"
                        :drop-shadow-size="dropShadowSize"
                        :drop-align="'top'"
                        :drop-justify="'right'"
                        :title="dropOption.title"
                        :icon="dropOption.icon"
                        :drop-options="dropOption.options"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import {storeToRefs} from 'pinia';

const {$themeStore} = useNuxtApp();
const {
    navigationMode,
} = useLayout();
const {
    hexAlpha,
    accent: accentColor,
    lining: liningColor,
    neutral: neutralColor,
    tint: tintColor
} = storeToRefs($themeStore);

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
    alwaysActive: {
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
});

const navDrop = ref(null);
const navDropReference = useTemplateRef('navDrop');
const navDropOptionsReference = useTemplateRef('navDropOptions');

const navHeaderOffsetWidth = ref<number | null>(null);
const navHeaderOffsetHeight = ref<number | null>(null);
const navHeaderOffsetLeft = ref<number | null>(null);

const navDropOptionsOffsetWidth = ref<number | null>(null);

const offsetLeftAndWidth = computed(() => {
    return (navHeaderOffsetWidth.value ?? 0) + (navHeaderOffsetLeft.value ?? 0);
});

onMounted(async () => {
    await nextTick();
    navHeaderOffsetWidth.value = navDropReference.value ? navDropReference.value.offsetWidth : null;
    navHeaderOffsetHeight.value = navDropReference.value ? navDropReference.value.offsetHeight : null;
    navHeaderOffsetLeft.value = navDropReference.value ? navDropReference.value.offsetLeft : null;

    if(props.alwaysActive){
        navDropOptionsOffsetWidth.value = navDropOptionsReference.value ? navDropOptionsReference.value.offsetWidth : null;
    }

    if(props.inHorizontalScrollable){
        navHeaderOffsetLeft.value = navDropReference.value ? navDropReference.value.getBoundingClientRect().left : null;
    }
});
const navigationTextShadow = computed(()=>{
    if(navigationMode.value == 'clear-with-background'){
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
const accentColor70 = computed(() => {
    return accentColor.value + hexAlpha.value['70'];
});
const navigationLinkColor = computed(()=>{
    if(navigationMode.value == 'clear-with-background'){
        return '#ffffff';
    }

    return 'auto';
});
const navDropOptionsParentBackgroundColor = computed(()=>{
    if(
        navigationMode.value == 'clear-with-background'
    ){
        return accentColor70.value;
    }

    return tintColor.value;
});
const navDropOptionsParentBorderColor = computed(()=>{
    if(
        navigationMode.value == 'clear-with-background'
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

        if(props.inHorizontalScrollable){
            navHeaderOffsetLeft.value = navDropReference.value ? navDropReference.value.getBoundingClientRect().left : null;
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
                left: `${offsetLeftAndWidth.value}px`
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
                left: `${offsetLeftAndWidth.value - navDropOptionsOffsetWidth.value}px`
            }
        }
    }

    return styleTemp
});

const { focused: navigationFocused } = useFocus(navDrop);

const handleClickOutside = (event) => {
    if(props.alwaysActive){
        return;
    }

    if (navDrop.value && !navDrop.value.contains(event.target)) {
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
    if(value && props.dropOptions.length){
        activeComputed.value = true;
    }
});

const classes = computed(() => {
    return activeComputed.value
        ? 'nav-drop-active'
        : ''
});

const headerFontClass = computed(() => {
    return {
        'xs': 'text-sm',
        'sm': 'text-base',
        'md': 'text-lg',
        'lg': 'text-xl',
    }[props.size]
});
const childNonDropFontClass = computed(() => {
    return {
        'xs': 'text-sm',
        'sm': 'text-base',
        'md': 'text-lg',
        'lg': 'text-xl',
    }[props.size]
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
.nav-drop-active{
    background-color: v-bind(accentColor70);
}

.nav-drop{
    color: v-bind(navigationLinkColor);
}
.nav-drop:hover{
    background-color: v-bind(accentColor70);
}

.nav-drop-options-parent{
    position: absolute;
    border: 1px solid v-bind(navDropOptionsParentBorderColor);


    background-color: v-bind(navDropOptionsParentBackgroundColor);
}

.nav-drop-link{
    color: v-bind(navigationLinkColor);
}

.nav-drop-link:hover{
    background-color: v-bind(accentColor70);
}
</style>