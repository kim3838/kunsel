<template>
    <div class="tw-relative tw-w-full tw-h-full">
        <div class="clip"></div>
        <div class="clip-frame tw-z-30 tw-flex tw-justify-end">
            <slot name="body"></slot>
        </div>
        <div class="clip-inner tint-background tw-z-20">
            <slot name="head"></slot>
        </div>
    </div>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import {computed} from "vue";
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    primary: primaryColor,
    thread: threadColor,
    lining: liningColor,
} = storeToRefs($themeStore);

const props = defineProps({
    frameBorder: {
        type: String,
        default: ''
    },
    contentBorder: {
        type: String,
        default: ''
    },
});

const frameBorderColor = computed(() => {
    return props.frameBorder ? props.frameBorder : threadColor.value;
});
const contentBorderColor = computed(() => {
    return props.contentBorder ? props.contentBorder : liningColor.value;
});
</script>

<style scoped lang="scss">
@keyframes animate-border {
    0%{background-position: 0% 0%;}
    50%{background-position: 600% 0%;}
    100%{background-position: 0% 0%;}
}
.clip{
    width: 100%;
    height: 100%;
    clip-path: polygon(calc(100% - 75px) 0px, 100% 75px, 100% 100%, 55px 100%, 0 calc(100% - 55px), 0 0);
    background-size: 150% 100%;
    background-position: 0% 0;
    background-repeat: repeat;
    background-image: linear-gradient(
            112deg,
            v-bind(contentBorderColor) 40%,
            transparent 50%,
            transparent 55%,
            v-bind(contentBorderColor) 65%);
    -webkit-animation: animate-border 10s infinite ease;
    -moz-animation: animate-border 10s infinite ease;
    animation: animate-border 10s infinite ease;
}
.clip-frame{
    border:1px solid v-bind(frameBorderColor);
    position: absolute;
    content: "";
    top: 7px;
    left: 7px;
    right: 7px;
    bottom: 7px;
}
.clip-inner{
    clip-path: polygon(calc(100% - 75px) 1px, calc(100% - 1px) 75px, calc(100% - 1px) calc(100% - 1px), 55px calc(100% - 1px), 1px calc(100% - 55px), 1px 1px);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>