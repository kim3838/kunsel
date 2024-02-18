<template>
    <div
        ref="navDrop"
        tabindex="0"
        :style="{'text-shadow': navigationTextShadow}"
        :class="[classes, headerFontClass]"
        class="nav-drop tw-px-4 tw-cursor-pointer focus:tw-outline-none focus:tw-ring-transparent focus:tw-ring-1">
        {{title}}
        <ClientOnly><Icon :name="navDropIcon"/></ClientOnly>
        <div
            v-if="activeComputed"
            :style="navDropOptionsStyleComputed"
            class="nav-drop-options-parent tw-transition-all tw-duration-700 tw-text-base tw-drop-shadow-2xl">
            <div v-for="dropOption in dropOptions" :key="dropOption.title" :style="{'text-shadow': navigationTextShadow}" class="nav-drop-link tw-cursor-pointer">

                <NuxtLink
                    v-if="dropOption.type === 'link'"
                    :to="dropOption.to"
                    class="tw-px-4 tw-py-1 tw-w-full tw-inline-flex tw-items-center">
                    <ClientOnly><Icon v-if="dropOption.icon" :name="dropOption.icon" class="tw-mr-1" /></ClientOnly><span>{{dropOption.title}}</span>
                </NuxtLink>

                <a v-if="dropOption.type == 'anchor-link'" :href="dropOption.to">
                    <NuxtLink
                        class="tw-px-4 tw-py-1 tw-w-full tw-inline-flex tw-items-center">
                        <ClientOnly><Icon v-if="dropOption.icon" :name="dropOption.icon" class="tw-mr-1" /></ClientOnly><span>{{dropOption.title}}</span>
                    </NuxtLink>
                </a>

                <div v-if="dropOption.type === 'action'"
                     @click="typeof dropOption.callback == 'function' ? dropOption.callback() : false;"
                     class="tw-px-4 tw-py-1 tw-w-full tw-inline-flex tw-items-center">
                    <ClientOnly><Icon v-if="dropOption.icon" :name="dropOption.icon" class="tw-mr-1" /></ClientOnly><span>{{dropOption.title}}</span>
                </div>

                <NavDrop
                    class="tw-w-full"
                    v-if="dropOption.type === 'drop'"
                    :parent="false"
                    :size="'sm'"
                    :drop-justify="'right'"
                    :title="dropOption.title"
                    :drop-options="dropOption.options"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import {computed, ref, watch} from "vue";
import {useFocus, onClickOutside} from '@vueuse/core'

const navDrop = ref(null);

const {
    navigationMode,
} = useLayout();

const navigationTextShadow = computed(()=>{
    if(navigationMode.value == 'clear'){
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
    }
})

const activeComputed = ref(false);
const navDropOptionsStyleComputed = computed(() => {

    let dropDirection = {
        'bottom': {
            'border-top-width': '1px',
            top: 'calc(100% + 1px)',
            [props.dropAlign]: 'calc(-1px)',
        },
        'right': {
            'border-top-width': '1px',
            top: '-1px',
            left: 'calc(100% + 1px)',
        },
        'left': {
            'border-top-width': '1px',
            top: '-1px',
            right: 'calc(100% + 1px)',
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
        'sm': 'tw-text-base tw-font-medium',
        'md': 'tw-text-lg tw-font-medium',
        'lg': 'tw-text-xl tw-font-medium',
    }[props.size]
});
</script>
<style scoped>

</style>