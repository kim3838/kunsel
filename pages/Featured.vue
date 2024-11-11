<template>
    <div
        v-if="clientReadyState"
        ref="layoutScroll"
        class="tw-h-screen tw-max-h-screen tw-overflow-y-hidden tw-overflow-x-hidden">
        <!-- Primary Navigation Menu -->
        <LandingNavigation v-model:navigation-height-in-pixels="topAllocation"/>
        <!-- Main Content -->
        <main class="tw-relative">

            <!-- Section Navigation -->
            <div class="tw-fixed tw-z-10 tw-top-0 tw-right-0 tw-bottom-0 tw-left-0 tw-h-screen">
                <!-- Add icon before section titles to overlap vertical rule -->
                <div class="tw-absolute vertical-nav-rule tw-w-[1px] tw-top-0 tw-right-0 tw-bottom-0 tw-left-[14px]"></div>

                <!-- Debug -->
                <div v-if="false"  class="tw-absolute tw-text-xs tw-font-mono">
                    {{"INDEX: " + index}}<br>
                    <pre>{{featured[index]}}</pre>
                </div>

                <div class="tw-absolute tw-top-0 tw-right-0 tw-bottom-0 tw-left-[20px] allocate-navigation">
                    <div class="tw-relative tw-w-full tw-h-full">
                        <div
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
                                <div
                                    v-if="false"
                                    :id="`featured-${index}-content`"
                                    :style="contentStyle(index)"
                                    class="tw-absolute section-navigation">
                                    <div class="tw-w-full tw-h-[230px] tw-flex tw-flex-nowrap tw-gap-2 neutral-border tw-overflow-y-hidden">
                                        <div class="tw-w-[460px] tw-h-full tw-flex-none" v-for="item in leftToRightItems">
                                            <HexagonFrame
                                                :frame-border="item.frameBorder"
                                                :content-border="item.contentBorder"
                                                :direction="'ltr'"
                                                :head-percentage="50"
                                                :top-right="45"
                                                :bottom-left="55"
                                                :header-fade="true"
                                                :header-fade-color="'rgba(25,25,25,0.1)'">
                                                <template #header>
                                                    <div class="tw-h-full tw-w-[50%]">
                                                        <div
                                                            class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                                                            :style="{'background':'url('+item.image.path+')'}"
                                                        />
                                                    </div>
                                                    <div class="tw-h-full tw-w-[50%]">
                                                        <div
                                                            class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat tw-opacity-10"
                                                            :style="{'background':'url('+item.image.path+')'}"
                                                        />
                                                    </div>
                                                </template>
                                                <template v-slot:body="{frameBorderColor, contentBorderColor}">
                                                    <div class="tw-h-full tw-w-[50%] tw-p-4 tw-overflow-hidden tw-relative tw-flex tw-flex-col tw-text[#5A5A5A]">

                                                        <div class="tw-overflow-auto tw-space-y-0.5">
                                                            <div class="tw-font-semibold tw-h-max tw-flex-none">
                                                                <UnorderedList
                                                                    class="tw-cursor-pointer hover:tw-underline"
                                                                    :size="'md'"
                                                                    :icon="item.listIcon"
                                                                    :label="item.title"/>
                                                            </div>

                                                            <div style="height: 1px;width: 100%;background: linear-gradient(to right, transparent 0%, #e3e3e3 30%, #e3e3e3 70%, transparent 100%);"></div>

                                                            <div v-if="item?.bullets?.value?.length" class="tw-flex tw-flex-row tw-flex-nowrap">
                                                                <div class="tw-w-full" :style="{'columns': (item.bullets.column ? item.bullets.column : 1)}">
                                                                    <UnorderedList
                                                                        v-for="bullet in item.bullets.value"
                                                                        :size="'sm'"
                                                                        :icon="'eos-icons:commit'"
                                                                        :label="bullet"/>
                                                                </div>
                                                            </div>

                                                            <div
                                                                v-if="item.description"
                                                                v-html="item.description"
                                                                class="tw-text-base tw-leading-5 tw-line-clamp-3"
                                                                :style="{'font-family': 'Source Sans Pro'}"
                                                            ></div>

                                                            <UnorderedList
                                                                class="tw-cursor-pointer hover:tw-underline"
                                                                :font-family="'Source Sans Pro'"
                                                                :size="'sm'"
                                                                :label="'Read more'"/>
                                                        </div>
                                                    </div>
                                                </template>
                                            </HexagonFrame>
                                        </div>
                                    </div>
                                </div>
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

            <!-- Section Content -->
            <div class="tw-fixed tw-z-20 tw-top-0 tw-right-0 tw-bottom-0 tw-left-[20px] allocate-navigation">
                <div class="tw-relative tw-w-full tw-h-full">
                    <div
                        v-for="(featuredContent, index) in featured"
                        :id="`featured-${index}-content`"
                        :style="contentStyle(index)"
                        class="tw-absolute section-content">
                        <pre>{{featuredContent}}</pre>
                    </div>
                </div>
            </div>
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
import {validate} from "@babel/types";
useLayout().setNavigationMode('clear', 'index.vue');
const {$themeStore, $toRomanNumeral} = useNuxtApp();
const clientReadyState = useClientReadyState();
const {
    thread: threadColor
} = storeToRefs($themeStore);
const topAllocation = ref('0px');
const featured = ref(dataPayload['featured']);
const leftToRightItems = ref(dataPayload['leftToRightItems']);
const carouselTrendingItems = ref(dataPayload['carousel']['trendingItems']);
const featuredVideos = useTemplateRef('featuredVideos');
//Boot full page scroll on navigate
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(() => {
            bootPageScroll();
            //console.log({'onMounted feature_2': feature_2.value});
            //autoPlayVideoSpotlights(featuredVideos);
        });
    })
}

//Boot full page scroll on page load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            bootPageScroll();
            //console.log({'clientReady feature_2': feature_2.value});
            //autoPlayVideoSpotlights(featuredVideos);
        });
    }
});

function autoPlayVideoSpotlights(videoSpotlights){

    videoSpotlights.value?.forEach(video => {

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
const scrolledUp = ref(false);
const sections = ref([]);

watch(index, function(newIndex, oldIndex){
    scrolledUp.value = newIndex < oldIndex;
}, { immediate: true });

const topProximityIndex = computed(() => index.value - 1);
const middleProximityIndex = computed(() => index.value);
const bottomProximityIndex = computed(() => index.value + 1);
//last section span 100% to bottom
const bottomProximityTopPosition = computed(() => index.value == (featured.value.length - 1) ? 100 : 90);

const withinProximity = (index) => {
    return (middleProximityIndex.value == index
        || topProximityIndex.value == index
        || bottomProximityIndex.value == index);
}

function sectionStyle(indexParam){

    let sectionHeaderHeight = document.getElementById('featured-'+indexParam)?.offsetHeight || 0;

    let topProximityHeaderElementHeight = document.getElementById('featured-' + topProximityIndex.value + '-header')?.offsetHeight || 0;

    let middleProximity = (featured.value[middleProximityIndex.value]?.proximity) ? featured.value[middleProximityIndex.value].proximity : 0 ;
    let middleProximityTopPosition = (middleProximity)
        ? `${middleProximity}%`
        : `${topProximityHeaderElementHeight}px`;

    if(withinProximity(indexParam)){
        if(topProximityIndex.value == indexParam){
            let topProximityBackground = featured.value[topProximityIndex.value].bg;

            let topProximityTopPosition = featured.value[topProximityIndex.value].type == 'row'
                ? `${100 - middleProximity}%`
                : `calc(100% - ${topAllocation.value})`;

            return {
                'top': `0%`,
                'left': 0,
                'right': 0,
                 'bottom': topProximityTopPosition,
                // 'background-color' : topProximityBackground
            };
        }

        if(middleProximityIndex.value == indexParam){
            let middleProximityBackground = featured.value[middleProximityIndex.value].bg;

            return {
                'top': `${middleProximityTopPosition}`,
                'left': 0,
                'right': 0,
                'bottom': `${100 - bottomProximityTopPosition.value}%`,
                // 'background-color' : middleProximityBackground
            };
        }

        if(bottomProximityIndex.value == indexParam){
            let bottomProximityBackground = featured.value[bottomProximityIndex.value].bg;

            return {
                'top': `${bottomProximityTopPosition.value}%`,
                'left': 0,
                'right': 0,
                'bottom': 0,
                // 'background-color' : bottomProximityBackground
            };
        }
    }

    //Hide element if it's out of proximity
    if(!withinProximity(indexParam)){
        //Hidden from top
        if(indexParam < index.value){
            return {
                'top': `calc(0% - ${topAllocation.value} - ${sectionHeaderHeight}px)`,
                'left': 0,
                'right': 0,
            };
        }

        //Hidden from bottom
        if(indexParam > index.value){
            return {
                'top': `100%`,
                'left': 0,
                'right': 0,
            };
        }
    }
}

function contentStyle(indexParam){

    let topProximityHeaderElementHeight = document.getElementById('featured-' + topProximityIndex.value + '-header')?.offsetHeight || 0;
    let middleProximityHeaderElementHeight = document.getElementById('featured-' + middleProximityIndex.value + '-header')?.offsetHeight || 0;
    let bottomProximityHeaderElementHeight = document.getElementById('featured-' + bottomProximityIndex.value + '-header')?.offsetHeight || 0;

    let middleProximity = (featured.value[middleProximityIndex.value]?.proximity) ? featured.value[middleProximityIndex.value].proximity : 0 ;
    let middleProximityTopPosition = (middleProximity)
        ? `${middleProximity}%`
        : `${topProximityHeaderElementHeight}px`;

    if(withinProximity(indexParam)){
        if(topProximityIndex.value == indexParam){

            let topProximityIsTypeRow = featured.value[topProximityIndex.value].type == 'row';

            let topProximityBackground = featured.value[topProximityIndex.value].bg;

            let topProximityTopPosition = featured.value[topProximityIndex.value].type == 'row'
                ? `${100 - middleProximity}%`
                : `calc(100% - ${topAllocation.value})`;

            if(topProximityIsTypeRow){
                return {
                    'top': `0%`,
                    'left': 0,
                    'right': 0,
                    'bottom': topProximityTopPosition,
                    'padding-top': `${topProximityHeaderElementHeight}px`,
                    // 'background-color': topProximityBackground
                };
            }

            if(!topProximityIsTypeRow){

                return {
                    'top': `-100%`,
                    'left': 0,
                    'right': 0,
                    'bottom': `calc(100% + ${topAllocation.value})`,
                    'padding-top': `${topProximityHeaderElementHeight}px`,
                    // 'background-color': topProximityBackground
                };
            }
        }

        if(middleProximityIndex.value == indexParam){
            let middleProximityBackground = featured.value[middleProximityIndex.value].bg;

            return {
                'top': `${middleProximityTopPosition}`,
                'left': 0,
                'right': 0,
                'bottom': `${100 - bottomProximityTopPosition.value}%`,
                'padding-top': `${middleProximityHeaderElementHeight}px`,
                // 'background-color': middleProximityBackground
            };
        }

        if(bottomProximityIndex.value == indexParam){
            let bottomProximityBackground = featured.value[bottomProximityIndex.value].bg;

            return {
                'top': `${bottomProximityTopPosition.value}%`,
                'left': 0,
                'right': 0,
                'bottom': 0,
                'padding-top': `${bottomProximityHeaderElementHeight}px`,
                // 'background-color': bottomProximityBackground
            };

        }
    }

    //Hide content if it's out of proximity
    if(!withinProximity(indexParam)){
        //Hidden from top
        if(indexParam < index.value){
            return {
                'top': `-100%`,
                'left': 0,
                'right': 0,
                'bottom': `calc(100% + ${topAllocation.value})`,
                'padding-top': `${topProximityHeaderElementHeight}px`,
            };
        }

        //Hidden from bottom
        if(indexParam > index.value){
            return {
                'top': `100%`,
                'left': 0,
                'right': 0,
                'padding-top': `${bottomProximityHeaderElementHeight}px`,
            };
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
.section-content {
    transition: top v-bind(scrollSpeedMs) cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>