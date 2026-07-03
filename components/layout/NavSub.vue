<template>
    <div
        ref="navHeader"
        tabindex="0"
        :style="{'font-family': fontFamily}"
        :class="[classes]"
        class="relative inline-flex items-center h-full px-2 py-1 cursor-pointer focus:outline-none rounded-[2px]">
        <div class="bg-film"></div>
        <Icon v-if="icon" :name="icon" :class="[iconClass]" class="mr-1" />
        <span :class="[headerFontClass]">{{title}}</span>
        <Icon class="flex-none" :class="[dropDownIconClass]" :name="navHeaderIcon"/>
    </div>
</template>

<script setup lang="ts">
const {
    navigationMode,
} = useLayout();

const {
    liningColor,
    subtitleColor,
    textInvertColor,
    activeClearFluidBackground
} = useCosmetic();

const props = defineProps({
    dropAlign: {
        default: 'left'
    },
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
    active: {
        type: Boolean,
        default: false,
    },
    activeStyle: {
        type: String,
        default: 'dashed',
    },
    size: {
        default: 'md'
    },
    fontFamily: {
        type: String,
        default: 'inherit'
    },
});

const subtitleColorEnabled = ref(false);

const emit = defineEmits(['updateSubNavigationOptions']);

const navHeader = ref(null);

const navigationTextShadow = computed(()=>{
    if(navigationMode.value == 'clear-with-background'){
        return '1px 1px 2px #000000';
    }

    return 'none';
});

const navHeaderIcon = computed(()=>{
    return 'ic:baseline-arrow-drop-down';
});
const navigationLinkColor = computed(()=>{

    if(navigationMode.value == 'clear-with-background'){
        return '#ffffff';
    }

    if(subtitleColorEnabled.value && !props.active){
        return subtitleColor.value;
    }

    return 'auto';
});

const { focused: navigationFocused } = useFocus(navHeader);

watch(navigationFocused, focused => {
    emit('updateSubNavigationOptions', {
        drop_align: props.dropAlign,
        options: props.dropOptions,
    });
});

const classes = computed(() => {
    return props.active
        ? `nav-sub-active-${props.activeStyle}`
        : 'nav-sub-inactive'
});

const headerFontClass = computed(() => {
    return {
        'xs': 'text-xs',
        'sm': 'text-sm',
        'md': 'text-base',
        'lg': 'text-lg',
    }[props.size]
});

const iconClass = computed(() => {
    return {
        '2xs': 'h-4 w-4',
        'xs': 'h-5 w-5',
        'sm': 'h-5 w-5',
        'md': 'h-5 w-5',
        'lg': 'h-8 w-8'
    }[props.size];
});

const dropDownIconClass = computed(() => {
    return {
        '2xs': 'h-4 w-4',
        'xs': 'h-5 w-5',
        'sm': 'h-5 w-5',
        'md': 'h-5 w-5',
        'lg': 'h-6 w-6'
    }[props.size];
});
</script>
<style lang="scss" scoped>
.bg-film{@extend .bg-film;}

.nav-sub-inactive{
    position: relative;
    z-index: 1;
    color: v-bind(navigationLinkColor);
    overflow: hidden;
    @include fluid-gold-hover-before-effect($opacity: 0.4);
    @include ripple-hover-after-effect();
}
.nav-sub-inactive:hover{
    color: v-bind(textInvertColor) !important;
    @extend .text-shadow;
}
.nav-sub-inactive:hover .bg-film{
    background: v-bind(activeClearFluidBackground);
    animation: initialBackgroundKeyFrames 0ms linear 1 forwards;
}

.nav-sub-active-dashed{
    border: 1px dashed v-bind(liningColor);
}
.nav-sub-active-clear-fluid{
    position: relative;
    z-index: 1;
    color: v-bind(textInvertColor) !important;
    @extend .text-shadow;
    background: v-bind(activeClearFluidBackground);
    overflow: hidden;;
    @include fluid-gold-before();
    @include ripple($opacity: 0.2, $animate: true);
}
</style>