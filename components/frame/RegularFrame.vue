<template>
    <div>
        <slot name="header"></slot>

        <div class="frame-outer">
        </div>

        <div class="frame-inner">
        </div>

        <div class="frame-outer-sub">
            <span class="frame-outer-sub-border-top"></span>
        </div>

        <slot name="body"></slot>
    </div>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import {computed} from "vue";
const {$themeStore} = useNuxtApp();

const {
    hexAlpha,
    accent: accentColor,
    lining: liningColor,
    thread: threadColor,
    tint: tintColor,
    shade: shadeColor,
    text: textColor,
    textInvert: textInvertColor,
} = storeToRefs($themeStore);

const threadColor50 = computed(() => {
    return threadColor.value + hexAlpha.value['50'];
});

const liningColor50 = computed(() => {
    return liningColor.value + hexAlpha.value['50'];
});
</script>

<style scoped>
.frame-outer{
    position: absolute;
    top: 1rem;
    bottom: 0.5rem;
    left: 1rem;
    right: 1rem;
    box-sizing: border-box;
}

.frame-outer:before{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    content: "";
    border: 1px solid v-bind(threadColor);
    border-top: none;
}

.frame-outer:after{
    position: absolute;
    top: -0.5rem;
    bottom: 0.5rem;
    left: -0.5rem;
    right: -0.5rem;
    content: "";
    border: 1px solid v-bind(liningColor);
    border-top: none;
}

.frame-inner{
    content: "";
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    bottom: 0;
    box-sizing: border-box;
    overflow: hidden;
}
.frame-inner:before{
    content: "";
    position: absolute;
    left: 0;
    width: calc(100%);
    height: 1px;
    background: v-bind(threadColor);
}
.frame-inner:after{
    content: "";
    position: absolute;
    right: 0;
    width: calc(100%);
    height: 1px;
    background: v-bind(threadColor);
}

.frame-outer-sub{
    position: absolute;
    top: 0.5rem;
    bottom: 1rem;
    left: 0.5rem;
    right: 0.5rem;
    box-sizing: border-box;
    overflow: hidden;
}

.frame-outer-sub-border-top{
    content: "";
    position: absolute;
    left: -0.5rem;
    right: 0rem;
    height: 3rem;
}
.frame-outer-sub-border-top:before{
    position: absolute;
    left: 0;
    content: "";
    width: calc(75%);
    height: 1px;
    background: linear-gradient(
        to right,
        v-bind(liningColor) 0%,
        transparent 50%,
        transparent 100%
    );
}
.frame-outer-sub-border-top:after{
    position: absolute;
    right: 0;
    content: "";
    width: calc(75%);
    height: 1px;
    background: linear-gradient(
        to left,
        v-bind(liningColor) 0%,
        transparent 50%,
        transparent 100%
    );
}
</style>