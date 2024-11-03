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

                <div v-if="false"  class="tw-absolute tw-text-xs tw-font-mono">
                    {{"INDEX: " + index}}<br>
                    <pre>{{featured[index]}}</pre><br>
                    {{"PREVIOUS: " + sectionNavigation.previous.label}}<br>
                    {{"CURRENT: " + sectionNavigation.current.label}}<br>
                    {{"NEXT: " + sectionNavigation.next.label}}
                </div>

                <div class="tw-absolute tw-top-0 tw-right-0 tw-bottom-0 tw-left-[56px] allocate-navigation">
                    <div class="tw-relative tw-w-full tw-h-full thread-border">
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
                            :style="sectionStyle(index)"
                            class="tw-absolute section-navigation">
                            <div
                                :id="`featured-${index}-header`"
                                class="tw-pb-1">
                                <div
                                    class="tw-font-data tw-w-min tw-pr-1 tw-text-nowrap tw-text-lg tw-text-white tw-rounded-sm tw-bg-opacity-25 tw-bg-slate-500"
                                    style="text-shadow: 1px 1px 2px #000000;">
                                    {{featuredSection.title}}
                                </div>
                            </div>
                            <div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section Background -->
            <section v-for="(section, index) in featured">
                <div v-if="section?.media" class="tw-relative tw-w-full tw-h-screen tw-flex tw-justify-center tw-items-center tw-overflow-hidden">
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

function sectionStyle(indexParam){

    let topProximityIndex = (index.value - 1);
    let middleProximityIndex = (index.value);
    let bottomProximityIndex = (index.value + 1);

    //Track indexParam if it is within proximity
    let withinProximity = (middleProximityIndex == indexParam
        || topProximityIndex == indexParam
        || bottomProximityIndex == indexParam);

    //last section span 100% to bottom
    let bottomProximityTopPosition = index.value == (featured.value.length - 1) ? 100 : 90;

    let topProximityIndexElementHeight = document.getElementById('featured-' + topProximityIndex + '-header')?.offsetHeight || 0;
    let middleProximity = (featured.value[middleProximityIndex]?.proximity) ? featured.value[middleProximityIndex].proximity : 0 ;
    let middleProximityTopPosition = (middleProximity)
        ? `${middleProximity}%`
        : `${topProximityIndexElementHeight}px`;

    if(withinProximity){
        if(topProximityIndex == indexParam){
            let topProximityBackground = featured.value[topProximityIndex].type == 'row'
                ? featured.value[topProximityIndex].bg
                : `transparent`;

            let topProximityTopPosition = featured.value[topProximityIndex].type == 'row'
                ? `${100 - middleProximity}%`
                : `calc(100% - ${topAllocation.value})`;

            return {
                'top': `0%`,
                'left': 0,
                'right': 0,
                 'bottom': topProximityTopPosition,
                'background-color' : topProximityBackground
            };
        }

        if(middleProximityIndex == indexParam){
            let middleProximityBackground = featured.value[middleProximityIndex].bg;

            return {
                'top': `${middleProximityTopPosition}`,
                'left': 0,
                'right': 0,
                'bottom': `${100 - bottomProximityTopPosition}%`,
                'background-color' : middleProximityBackground
            };
        }

        if(bottomProximityIndex == indexParam){
            let bottomProximityBackground = featured.value[bottomProximityIndex].bg;

            return {
                'top': `${bottomProximityTopPosition}%`,
                'left': 0,
                'right': 0,
                'bottom': 0,
                'background-color' : bottomProximityBackground
            };
        }
    }

    //Hide element if it's out of proximity
    if(!withinProximity){

        //Hidden from top
        if(indexParam < index.value){
            let elementHeight = document.getElementById('featured-'+indexParam)?.offsetHeight || 0;
            return {'top': `calc(0% - ${topAllocation.value} - ${elementHeight}px)`};
        }

        //Hidden from bottom
        if(indexParam > index.value){
            return {'top': `100%`};
        }
    }
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
        rgba(192, 192, 192, 0.5) 10%,
        rgba(192, 192, 192, 0.5) 90%,
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