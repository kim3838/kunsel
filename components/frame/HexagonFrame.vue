<template>
    <div class="tw-relative tw-w-full tw-h-full">
        <div class="clip"></div>
        <div class="clip-frame tw-z-30 neutral-border">
            <slot name="body"></slot>
        </div>
        <div class="clip-inner tint-background tw-z-20"><!--tint-background-->
        </div>
    </div>
</template>

<script setup>
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    primary: primaryColor,
    lining: liningColor,
} = storeToRefs($themeStore);
</script>

<style scoped lang="scss">
@keyframes animate-border {
    0%{background-position: 0% 0%;}
    //25%{background-position: 25% 0%;}
    50%{background-position: 100% 0%;}
    //75%{background-position: 75% 0%;}
    100%{background-position: 0% 0%;}
}
.clip{
    width: 100%;
    height: 100%;
    clip-path: polygon(calc(100% - 73px) 0px, 100% 73px, 100% 100%, 53px 100%, 0 calc(100% - 53px), 0 0);
    background-size: 200% 100%;
    background-position: 0% 0;
    background-repeat: no-repeat;
    background-image: linear-gradient(
            135deg,
            v-bind(liningColor) 20%,
            transparent 30%,
            transparent 40%,
            v-bind(liningColor) 50%,
            v-bind(liningColor) 60%,
            transparent 70%,
            transparent 80%,
            v-bind(liningColor) 90%);
    -webkit-animation: animate-border 10s infinite ease;
    -moz-animation: animate-border 10s infinite ease;
    animation: animate-border 10s infinite ease;
}
.clip-frame{
    position: absolute;
    content: "";
    top: 7px;
    left: 7px;
    right: 7px;
    bottom: 7px;
}
.clip-inner{
    clip-path: polygon(calc(100% - 75px) 2px, calc(100% - 2px) 75px, calc(100% - 2px) calc(100% - 2px), 55px calc(100% - 2px), 2px calc(100% - 55px), 2px 2px);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>