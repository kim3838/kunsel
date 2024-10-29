<template>
    <div
        v-if="clientReadyState"
        ref="layoutScroll"
        class="tw-h-screen tw-max-h-screen tw-overflow-y-hidden tw-overflow-x-hidden">
        <!-- Primary Navigation Menu -->
        <LandingNavigation v-model:navigation-height-in-pixels="topAllocation"/>
        <!-- Main Content -->
        <main class="tw-relative">

            <!-- Section Breadcrumbs -->
            <div class="tw-fixed tw-z-10 tw-top-0 tw-right-0 tw-bottom-0 tw-left-0 tw-h-screen">
                <!-- Add icon before section titles to overlap vertical rule -->
                <div class="tw-absolute vertical-nav-rule tw-w-[1px] tw-top-0 tw-right-0 tw-bottom-0 tw-left-[50px]"></div>

                <div v-if="false"  class="tw-absolute">
                    {{"INDEX: " + index}}<br>
                    {{"PREVIOUS: " + sectionNavigation.previous.label}}<br>
                    {{"CURRENT: " + sectionNavigation.current.label}}<br>
                    {{"NEXT: " + sectionNavigation.next.label}}
                </div>

                <div class="tw-absolute tw-space-y-1 tw-top-0 tw-right-0 tw-bottom-0 tw-left-[56px] allocate-navigation">
                    <div class="tw-relative tw-w-full tw-h-full">
                        <div
                            v-if="false"
                            :style="sectionNavigation.previous.style"
                            class="tw-absolute tw-text-lg thread-border">
                            Previous
                        </div>
                        <div
                            v-if="false"
                            :style="sectionNavigation.current.style"
                            class="tw-absolute tw-text-lg thread-border">
                            Current
                        </div>
                        <div
                            v-if="false"
                            class="tw-absolute tw-text-lg thread-border">
                            Next
                        </div>

                        <div
                            v-if="true"
                            v-for="(featuredSection, index) in featured"
                            :id="`featured-${index}`"
                            style="text-shadow: 1px 1px 2px #000000;"
                            :style="sectionNavigationStyle(index)"
                            class="tw-absolute tw-font-data tw-px-1 tw-text-lg section-navigation tw-text-slate-300 tw-bg-opacity-25 tw-bg-slate-500">
                            {{$toRomanNumeral(index) + " " + featuredSection.title}}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section Background -->
            <section v-for="(section, index) in featured">
                <div class="tw-relative tw-w-full tw-h-screen tw-flex tw-justify-center tw-items-center tw-overflow-hidden">
                    <div v-if="section.media.type == 'image' && section.media.source" class="tw-w-full tw-h-full tw-absolute spotlight-image" :style="{'background-image': 'url('+section.media.source+')'}"></div>

                    <video
                        v-if="section.media.type == 'video' && section.media.source"
                        class="tw-absolute tw-border-0 tw-object-cover tw-w-full tw-h-full"
                        preload="none"
                        ref="featuredVideos"
                        muted
                        loop>
                        <source :src="section.media.source" :type="section.media.source_type">
                    </video>

                    <div class="tw-z-40 thread-border tw-bg-white tw-font-mono tw-px-1.5">
                        {{layoutScrollY}}&nbsp;:&nbsp;{{index}}
                    </div>
                </div>
            </section>
        </main>
        <!-- DateTime Picker -->
        <div id="datetimepicker-slot" class="tw-font-data"></div>
        <!-- Action Modal -->
        <PromptModal />
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTransition} from '@vueuse/core';
import dataPayload from '@/public/data/payload.js';
import {forEach} from "lodash-es";
useLayout().setNavigationMode('clear', 'index.vue');
const {$themeStore, $toRomanNumeral} = useNuxtApp();
const clientReadyState = useClientReadyState();
const {
    thread: threadColor
} = storeToRefs($themeStore);
const topAllocation = ref('0px');
const featured = ref(dataPayload['featured']);
const featuredVideos = useTemplateRef('featuredVideos');
//Boot full page scroll on navigate
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(() => {
            bootPageScroll();
            //console.log({'onMounted feature_2': feature_2.value});
            autoPlayVideoSpotlights(featuredVideos);
        });
    })
}

//Boot full page scroll on page load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            bootPageScroll();
            //console.log({'clientReady feature_2': feature_2.value});
            autoPlayVideoSpotlights(featuredVideos);
        });
    }
});

function autoPlayVideoSpotlights(videoSpotlights){

    videoSpotlights.value.forEach(video => {

        console.log({'featuredVideo': video});

        if(video){
            let playPromise = video.play();

            if(playPromise != undefined){
                playPromise.then(()=>{
                    let observer = new IntersectionObserver(
                        (entries) => {
                            entries.forEach((entry) => {
                                if (entry.intersectionRatio !== 1 && !video.paused) {
                                    video.pause();
                                } else if (video.paused) {
                                    video.play();
                                }
                            });
                        },
                        {threshold: 1}
                    );

                    observer.observe(video);
                }).catch((error: any) => {

                });
            }
        }
    })
}

const index = ref(0);
const sections = ref([]);
const sectionNavigation = reactive({
    previous_fade: {
        index: null,
        label: ''
    }, previous: {
        index: null,
        label: '',
        style: {'top': '0%'}
    }, current: {
        index: null,
        label: '',
        style: {'top': '60%'}
    }, next: {
        index: null,
        label: '',
        style: {'top': '90%'}
    }, next_fade: {
        index: null,
        label: ''
    }
});
watch(index, function(newIndex){

    if(newIndex == 0){
        //First
        sectionNavigation.previous_fade.label = null;
        sectionNavigation.previous_fade.index = null;
        sectionNavigation.previous.label = null;
        sectionNavigation.previous.index = null;
        sectionNavigation.current.label = featured.value[newIndex]?.title;
        sectionNavigation.current.index = newIndex;
        sectionNavigation.next.label = featured.value[newIndex + 1]?.title;
        sectionNavigation.next.index = newIndex;
        sectionNavigation.next_fade.label = null;
        sectionNavigation.next_fade.index = null;
    }else if(newIndex == (featured.value.length - 1)){
        //Last
        sectionNavigation.previous_fade.label = null;
        sectionNavigation.previous_fade.index = null;
        sectionNavigation.previous.label = featured.value[newIndex - 1]?.title;
        sectionNavigation.previous.index = newIndex;
        sectionNavigation.current.label = featured.value[newIndex]?.title;
        sectionNavigation.current.index = newIndex;
        sectionNavigation.next.label = null;
        sectionNavigation.next.index = null;
        sectionNavigation.next_fade.label = null;
        sectionNavigation.next_fade.index = null;
    }else {
        sectionNavigation.previous_fade.label = null;
        sectionNavigation.previous_fade.index = null;
        sectionNavigation.previous.label = featured.value[newIndex - 1]?.title;
        sectionNavigation.previous.index = newIndex;
        sectionNavigation.current.label = featured.value[newIndex]?.title;
        sectionNavigation.current.index = newIndex;
        sectionNavigation.next.label = featured.value[newIndex + 1]?.title;
        sectionNavigation.next.index = newIndex;
        sectionNavigation.next_fade.label = null;
        sectionNavigation.next_fade.index = null;
    }
}, { immediate: true });
const transitionOptions = ref({
    duration: 700,
    transition: [0.645, 0.045, 0.355, 1.000],
});

// const previousFadeTopPosition = ref(0);
// const previousTopPosition = ref(0);
// const currentTopPosition = ref(60);
// const nextTopPosition = ref(90);
// const nextFadeTopPosition = ref(0);
//
// const previousFadeTopPositionTransition = useTransition(previousFadeTopPosition, transitionOptions.value);
// const previousTopPositionTransition = useTransition(previousTopPosition, transitionOptions.value);
// const currentTopPositionTransition = useTransition(currentTopPosition, transitionOptions.value);
// const nextTopPositionTransition = useTransition(nextTopPosition, transitionOptions.value);
// const nextFadeTopPositionTransition = useTransition(nextFadeTopPosition, transitionOptions.value);

function sectionNavigationStyle(indexParam){

    //Track indexParam if it is close to current index
    if(
        (index.value) == indexParam
        || (index.value - 1) == indexParam
        || (index.value + 1) == indexParam
    ){
        // if(index.value == 0){
        //     //First
        //
        // }else if(index.value == (featured.value.length - 1)){
        //     //Last
        //
        // }else {
        //
        // }

        if((index.value - 1) == indexParam){
            return {'top': `0%`};
        }

        if((index.value) == indexParam){
            return {'top': `60%`};
        }

        if((index.value + 1) == indexParam){
            return {'top': `90%`};
        }

        // if(indexParam < index.value){
        //
        // }
        //
        // if(indexParam > index.value){
        //
        // }


    } else {
        if(indexParam < index.value){

            let elementHeight = document.getElementById('featured-'+indexParam)?.offsetHeight || 0;
            // previousFadeTopPosition.value = 0;
            // return {'top': `calc(${previousFadeTopPosition.value}% - ${topAllocation.value} - ${elementHeight}px)`};
            return {'top': `calc(0% - ${topAllocation.value} - ${elementHeight}px)`};
        }

        if(indexParam > index.value){
            //nextFadeTopPosition.value = 100;
            //return {'top': `${nextFadeTopPosition.value}%`};

            return {'top': `100%`};
        }
    }

    //return {'top': `${index.value}%`};

    //Hidden from top
    //let elementHeight = document.getElementById('featured-'+indexParam)?.offsetHeight || 0;
    //return {'top': `calc(0% - ${topAllocation.value} - ${elementHeight}px)`};

    //Hidden from bottom
    //return {'top': `100%`};
}

const scrolling = ref(false);
const proximityThreshold = ref(0);
const scrollSpeed = ref(200);
const scrollSpeedMs = computed(()=>`${scrollSpeed.value}ms`);
const layoutScroll = ref<HTMLElement | null>(null)
const { y: layoutScrollY } = useScroll(layoutScroll)
function bootPageScroll(){
    sections.value = document.querySelectorAll('section');
    proximityThreshold.value = layoutScroll.value.offsetHeight / 2;

    layoutScroll.value.removeEventListener('wheel', handleMouseWheel, { passive: false });
    layoutScroll.value.addEventListener('wheel', handleMouseWheel, { passive: false });
}

function handleMouseWheel(event){
    if(!isDesktop() || scrolling.value){
        return false;
    }

    scrolling.value = true;
    event.preventDefault();
    // Normalize wheel delta
    const delta = Math.max(-1, Math.min(1, event.deltaY));
    console.log({'handleMouseWheel delta': delta});

    if(delta > 0 && index.value < (sections.value.length - 1)){
        index.value += 1;
    }

    if(delta < 0 && index.value > 0){
        index.value -= 1;
    }

    console.log({'index': index.value});

    let sectionAttr = [];

    for (const section of sections.value) {
        sectionAttr.push({
            clientHeight: section.clientHeight,
            clientTop: section.clientTop,
            offsetHeight: section.offsetHeight,
            offsetTop: section.offsetTop,
        });
    }
    //console.log({'handleMouseWheel sections': sectionAttr});

    // Calculate scroll amount
    //const scrollAmount = layoutScrollY.value + layoutScroll.value.offsetHeight * delta;
    const scrollAmount = sections.value[index.value].offsetTop;

    // Scroll to the calculated amount with easing
    console.log({'scrollTo': scrollAmount});
    smoothScroll(scrollAmount, scrollSpeed.value, easeInOutCubic, true);

    //scrolling.value = false;
}

function easeInOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
}

function snapToSection() {
    for (const section of sections.value) {
        const sectionTop = section.offsetTop;
        const distance = Math.abs(layoutScrollY.value - sectionTop);

        if (distance < proximityThreshold.value) {
            smoothScroll(sectionTop, scrollSpeed.value * 0.25, easeInOutCubic);
            scrolling.value = false;
            break;
        }
    }
}

function smoothScroll(target, duration, easingFunction, snap = false) {
    const start = layoutScrollY.value;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    function scroll(timestamp) {
        const currentTime = 'now' in window.performance ? performance.now() : new Date().getTime();
        const timeElapsed = currentTime - startTime;
        const scrollAmount = easingFunction(timeElapsed, start, target - start, duration);

        layoutScrollY.value = scrollAmount;

        if (timeElapsed < duration) {
            requestAnimationFrame(scroll);
        } else {
            if(snap){
                snapToSection();
            } else {
                scrolling.value = false;
            }
        }
    }

    requestAnimationFrame(scroll);
}
</script>
<style scoped>
section {
    height: 100vh;
}

.spotlight-image{
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
}
.vertical-nav-rule{
    background: linear-gradient(
        to bottom,
        transparent 0%,
        #9d9d9d 10%,
        #9d9d9d 90%,
        transparent 100%
    );
}
.allocate-navigation {
    padding-top: v-bind(topAllocation);
}

.section-navigation {
    transition: top v-bind(scrollSpeedMs) cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>