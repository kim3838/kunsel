<template>
    <div
        ref="navDrop"
        tabindex="0"
        :style="{'text-shadow': navigationTextShadow, 'font-family': fontFamily}"
        :class="[classes]"
        class="nav-drop px-2 py-1 cursor-pointer focus:outline-none focus:ring-transparent focus:ring-1">
        <span :class="[headerFontClass]">{{title}}</span>
        <Icon :name="navDropIcon"/>
        <div
            v-if="activeComputed"
            :style="navDropOptionsStyleComputed"
            class="nav-drop-options-parent drop-shadow-sm">
            <div v-for="dropOption in dropOptions" :key="dropOption.title" :style="{'text-shadow': navigationTextShadow}" class="nav-drop-link cursor-pointer">

                <NuxtLink
                    v-if="dropOption.type === 'link'"
                    :to="dropOption.to"
                    class="px-2 py-1 w-full inline-flex items-center"
                    :class="[childNonDropFontClass]">
                    <Icon v-if="dropOption.icon" :name="dropOption.icon" class="mr-1" /><span>{{dropOption.title}}</span>
                </NuxtLink>

                <a v-if="dropOption.type == 'anchor-link'" :href="dropOption.to">
                    <NuxtLink
                        class="px-2 py-1 w-full inline-flex items-center"
                        :class="[childNonDropFontClass]">
                        <Icon v-if="dropOption.icon" :name="dropOption.icon" class="mr-1" /><span>{{dropOption.title}}</span>
                    </NuxtLink>
                </a>

                <div v-if="dropOption.type === 'action'"
                     @click="typeof dropOption.callback == 'function' ? dropOption.callback() : false;"
                     class="px-2 py-1 w-full inline-flex items-center"
                    :class="[childNonDropFontClass]">
                    <Icon v-if="dropOption.icon" :name="dropOption.icon" class="mr-1" /><span>{{dropOption.title}}</span>
                </div>

                <NavDrop
                    class="w-full"
                    v-if="dropOption.type === 'drop'"
                    :parent="false"
                    :size="childDropSize"
                    :drop-justify="'right'"
                    :title="dropOption.title"
                    :drop-options="dropOption.options"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
const navDrop = ref(null);

const {
    navigationMode,
} = useLayout();

const navigationTextShadow = computed(()=>{
    if(navigationMode.value == 'clear-with-background'){
        return '1px 1px 2px #000000';
    }

    return 'none';
});

const navDropIcon = computed(()=>{
   return props.parent ? 'ic:baseline-arrow-drop-down' : 'ic:baseline-arrow-right';
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
    size: {
        default: 'md'
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
    fontFamily: {
        type: String,
        default: 'inherit'
    },
})

const activeComputed = ref(false);
const navDropOptionsStyleComputed = computed(() => {

    let dropDirection = {
        'bottom': {
            top: 'calc(100% + 0px)',
            [props.dropAlign]: 'calc(0px)',
        },
        'right': {
            top: '-1px',
            left: 'calc(100% + 0px)',
        },
        'left': {
            top: '-1px',
            right: 'calc(100% + 0px)',
        },
    };

    return dropDirection[props.dropJustify]
});

const { focused: navigationFocused } = useFocus(navDrop);

onClickOutside(navDrop, (event) => {
    activeComputed.value = false;
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
        'xs': 'text-sm font-normal',
        'sm': 'text-base font-normal',
        'md': 'text-lg font-normal',
        'lg': 'text-xl font-normal',
    }[props.size]
});
const childNonDropFontClass = computed(() => {
    return {
        'xs': 'text-sm font-normal',
        'sm': 'w-text-base font-normal',
        'md': 'text-lg font-normal',
        'lg': 'text-xl font-normal',
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
</script>
<style scoped>

</style>