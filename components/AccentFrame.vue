<template>
    <div class="frame-base">
        <div class="frame-outer">
            <div class="slot-content"></div>
            <div class="frame-thread-1">
                <div class="frame-thread-1-top"></div>
                <div class="frame-thread-1-top-v">
                    <div class="frame-thread-1-top-element"></div>
                </div>
                <div class="frame-thread-1-right"></div>
                <div class="frame-thread-1-bottom"></div>
                <div class="frame-thread-1-left"></div>
            </div>
            <div class="frame-thread-2">
                <div class="frame-thread-2-top"></div>
                <div class="frame-thread-2-top-v">
                    <div class="frame-thread-2-top-element"></div>
                </div>
                <div class="frame-thread-2-right"></div>
                <div class="frame-thread-2-bottom"></div>
                <div class="frame-thread-2-left"></div>
            </div>
            <div class="frame-thread-3">
                <div class="frame-thread-3-top"></div>
                <div class="frame-thread-3-top-v">
                    <div class="frame-thread-3-top-element"></div>
                </div>
            </div>
        </div>

        <div class="tw-relative">
            <slot name="content"></slot>
        </div>
    </div>
</template>
<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {storeToRefs} from 'pinia';
const {$themeStore} = useNuxtApp();

const {
    lining: liningColor,
    thread: threadColor,
    neutral: neutralColor,
    tint: tintColor,
    text: textColor,
} = storeToRefs($themeStore);

const props = defineProps({

});
</script>
<style scoped>
.frame-base{
    position: relative;
    padding-top: 2rem;
    padding-right: 1.5rem;
    padding-bottom: 2rem;
    padding-left: 1.5rem;
}

.frame-outer{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    box-sizing: border-box;
    /*border: 1px solid red;*/
}

/*Slot Content: -1rem for top/bottom frame-base spacings*/
.slot-content{
    position: absolute;
    content: "";
    top: 1rem;
    right: 0rem;
    bottom: 1rem;
    left: 0rem;
    background-color: v-bind(tintColor);
}

.frame-thread-1{
    content: "";
    position: absolute;
    top: 0rem;
    right: 0.5rem;
    bottom: 0.5rem;
    left: 0.5rem;
    border-top: none;
    overflow: hidden;
}
.frame-thread-1-top{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    overflow: hidden;
}
.frame-thread-1-top:before{
    content: "";
    position: absolute;
    left: 0;
    width: calc(50% - 4.2rem);
    height: 1px;
    background: v-bind(liningColor);
}
.frame-thread-1-top:after{
    content: "";
    position: absolute;
    right: 0;
    width: calc(50% - 4.2rem);
    height: 1px;
    background: v-bind(liningColor);
}
.frame-thread-1-top-v{
    position: absolute;
    width: 6rem;
    height: 6rem;
    display: block;
    top: -3rem;
    left: 50%;
    transform: translateX(-50%);
}
.frame-thread-1-top-element{
    position: absolute;
    content: "";
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: rotate(45deg);
}
.frame-thread-1-top-element:before{
    position: absolute;
    content: "";
    right: 0;
    bottom: 0;
    height: 100%;
    width: 1px;
    background: linear-gradient(
        to bottom,
        v-bind(liningColor) 0%,
        transparent 50%,
        transparent 100%
    );
}
.frame-thread-1-top-element:after{
    position: absolute;
    content: "";
    left: 0;
    bottom: 0;
    height: 1px;
    width: 100%;
    background: linear-gradient(
        to right,
        v-bind(liningColor) 0%,
        transparent 50%,
        transparent 100%
    );
}

.frame-thread-1-right{
    position: absolute;
    content: "";
    right: 0;
    bottom: 0;
    height: 100%;
    width: 1px;
    background: linear-gradient(
        to bottom,
        v-bind(liningColor) 0%,
        transparent 50%,
        v-bind(liningColor) 100%
    );
}
.frame-thread-1-left{
    position: absolute;
    content: "";
    left: 0;
    bottom: 0;
    height: 100%;
    width: 1px;
    background: linear-gradient(
        to bottom,
        v-bind(liningColor) 0%,
        transparent 50%,
        v-bind(liningColor) 100%
    );
}
.frame-thread-1-bottom{
    position: absolute;
    content: "";
    right: 0;
    bottom: 0;
    height: 1px;
    width: 100%;
    background: v-bind(liningColor);
}

.frame-thread-2{
    content: "";
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    bottom: 0rem;
    left: 1rem;
    border-top: none;
    overflow: hidden;
}
.frame-thread-2-top{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
}
.frame-thread-2-top:before{
    content: "";
    position: absolute;
    left: 0;
    width: calc(50% - 3rem);
    height: 1px;
    background: v-bind(threadColor);
}
.frame-thread-2-top:after{
    content: "";
    position: absolute;
    right: 0;
    width: calc(50% - 3rem);
    height: 1px;
    background: v-bind(threadColor);
}
.frame-thread-2-top-v{
    position: absolute;
    width: 4.4rem;
    height: 4.4rem;
    display: block;
    top: -2.2rem;
    left: 50%;
    transform: translateX(-50%);
}
.frame-thread-2-top-element{
    position: absolute;
    content: "";
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: rotate(45deg);
}
.frame-thread-2-top-element:before{
    position: absolute;
    content: "";
    right: 0;
    bottom: 0;
    height: 100%;
    width: 1px;
    background: linear-gradient(
        to bottom,
        v-bind(threadColor) 0%,
        transparent 60%
    );
}
.frame-thread-2-top-element:after{
    position: absolute;
    content: "";
    left: 0;
    bottom: 0;
    height: 1px;
    width: 100%;
    background: linear-gradient(
        to right,
        v-bind(threadColor) 0%,
        transparent 60%
    );
}

.frame-thread-2-right{
    position: absolute;
    content: "";
    right: 0;
    bottom: 0;
    height: 100%;
    width: 1px;
    background: linear-gradient(
        to bottom,
        v-bind(threadColor) 0%,
        transparent 50%,
        v-bind(threadColor) 100%
    );
}
.frame-thread-2-left{
    position: absolute;
    content: "";
    left: 0;
    bottom: 0;
    height: 100%;
    width: 1px;
    background: linear-gradient(
        to bottom,
        v-bind(threadColor) 0%,
        transparent 50%,
        v-bind(threadColor) 100%
    );
}
.frame-thread-2-bottom{
    position: absolute;
    content: "";
    right: 0;
    bottom: 0;
    height: 1px;
    width: 100%;
    background: v-bind(threadColor);
}
</style>