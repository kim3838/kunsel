<template>
    <div class="tw-relative tw-w-full tw-h-full">
        <div class="clip"></div>
        <div class="clip-frame tw-z-30 neutral-border">
            <slot name="body"></slot>
        </div>
        <div class="clip-inner tint-background tw-z-20">
        </div>
    </div>
</template>

<script setup>
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    lining: liningColor,
} = storeToRefs($themeStore);
</script>

<style scoped lang="scss">
@keyframes animate-border {
    0%{background-position: 0% 50%;}
    50%{background-position: 100% 50%;}
    100%{background-position: 0% 50%;}
}
.clip{
    width: 100%;
    height: 100%;
    clip-path: polygon(calc(100% - 70px) 0px, 100% 70px, 100% 100%, 50px 100%, 0 calc(100% - 50px), 0 0);
    background-size: 150% 150%;
    background-image: linear-gradient(225deg, v-bind(liningColor), transparent, v-bind(liningColor), transparent);
    -webkit-animation: animate-border 3s infinite ease;
    -moz-animation: animate-border 3s infinite ease;
    animation: animate-border 4s infinite ease;
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