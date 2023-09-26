<template>
    <NuxtLink
        :to="to"
        class="tw-inline-flex tw-items-center tw-px-1 tw-border-b-2 tw-text-xl tw-font-serif tw-transition tw-duration-150 tw-ease-in-out focus:tw-outline-none"
        :class="classes">
        <slot></slot>
    </NuxtLink>
</template>

<script setup>
import {computed} from "vue";
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    primary: primaryColor,
} = storeToRefs($themeStore);

const primaryColor50 = computed(() => {
    return primaryColor.value + hexAlpha.value['50'];
});

const props = defineProps({
    to: {
        type: String,
        default: null,
    },
    active: {
        type: Boolean,
        default: false,
    },
});

const classes = computed(() => {
    return props.active
        ? 'nav-active'
        : 'tw-border-transparent'
});
</script>
<style scoped>
.nav-active{
    border-color: v-bind(primaryColor50);
}
</style>