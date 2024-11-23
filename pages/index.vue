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
                <div v-if="true" class="tw-absolute tw-text-white tw-text-xs tw-font-mono">
                    {{`SCREEN DIMENSION: ${screenWidth} x ${screenHeight}`}}
                </div>
                <div v-if="false" class="tw-absolute tw-text-xs tw-font-mono">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section Background -->
            <section v-for="(section, index) in featured" :style="{'background': section.background}">
                <div v-if="section?.media" class="tw-relative tw-w-full tw-h-screen tw-flex tw-justify-center tw-items-center tw-overflow-hidden">
                    <div v-if="section.media.type == 'image' && section.media.source" class="tw-w-full tw-h-full tw-absolute background-image" :style="{'background-image': 'url('+section.media.source+')'}"></div>

                    <video
                        v-if="section.media.type == 'video' && section.media.source"
                        class="tw-absolute tw-border-0 tw-object-cover tw-w-full tw-h-full"
                        preload="none"
                        ref="featuredVideos"
                        muted
                        loop>
                        <source :src="section.media.source" :type="section.media.source_type">
                    </video>

                    <div v-if="false" class="tw-z-40 thread-border tw-bg-white tw-font-mono tw-px-1.5">
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

                        <div class="tw-w-full tw-flex tw-flex-nowrap tw-gap-2 tw-overflow-y-hidden"><!-- tw-bg-gray-600 tw-bg-opacity-50 -->
                            <div
                                v-if="false"
                                class="tw-flex-none background-image"
                                :style="[featuredElementStyle(featuredContent, 'dimension'),{'background-image': 'url(/images/hero/prestige-13-ai-kv-bg.jpg'}]">
                            </div>
                            <div
                                :style="[featuredElementStyle(featuredContent, 'dimension')]"
                                class="tw-flex-none"
                                v-for="child in featuredContent.children" :key="child">
                                <Glint :orientation="child.glint_orientation" :enable="child.glint" :color="child.glint_color">
                                    <HexagonFrame
                                        :frame-border="child.frame_border"
                                        :opaque="child.content_opaque"
                                        :content-background="child.content_background"
                                        :direction="child.content_direction"
                                        :theme="featuredContent.theme"
                                        :head-percentage="child.head_percentage"
                                        :top-right="child.top_right_corner"
                                        :bottom-left="child.bottom_left_corner"
                                        :header-fade="child.header_fade"
                                        :header-fade-color="child.header_fade_color">
                                        <template #header>
                                            <div :class="[featuredElementClass(featuredContent, child, 'header_class')]" class="tw-box-border">
                                                <div
                                                    class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                                                    :style="{'background':'url('+child.image+')'}"
                                                />
                                            </div>
                                            <div :class="[featuredElementClass(featuredContent, child, 'body_class')]" class="tw-box-border">
                                                <div
                                                    class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat tw-grayscale tw-opacity-20"
                                                    :style="{'background':'url('+child.image+')'}"
                                                />
                                            </div>
                                        </template>
                                        <template v-slot:body="{frameBorderColor}">
                                            <div :class="[featuredElementClass(featuredContent, child, 'body_class')]" class="tw-p-2 tw-overflow-hidden tw-flex tw-flex-col">
                                                <div v-if="child.content_direction == `ttb`" class="tw-overflow-auto tw-space-y-4">
                                                    <div :class="[featuredElementClass(featuredContent, child, 'title')]" class="tw-line-clamp-2" v-text="child.title"></div>
                                                    <NuxtLink
                                                        v-if="child.link"
                                                        :to="child.link">
                                                        <UnorderedList
                                                            class="tw-cursor-pointer hover:tw-underline"
                                                            :size="'sm'"
                                                            :label="'Read more'"/>
                                                    </NuxtLink>
                                                </div>

                                                <div v-else-if="child.content_direction == `ltr`" class="tw-overflow-auto tw-space-y-0.5">
                                                    <div class="tw-font-data tw-font-semibold tw-h-max tw-flex-none">
                                                        <UnorderedList
                                                            class="tw-cursor-pointer hover:tw-underline"
                                                            :size="'md'"
                                                            :icon="child.title_icon"
                                                            :label="child.title"/>
                                                    </div>

                                                    <div style="height: 1px;width: 100%;background: linear-gradient(to right, transparent 0%, #e3e3e3 30%, #e3e3e3 70%, transparent 100%);"></div>

                                                    <div v-if="child?.bullets?.value?.length" class="tw-flex tw-flex-row tw-flex-nowrap">
                                                        <div class="tw-w-full" :style="{'columns': (child.bullets.column ? child.bullets.column : 1)}">
                                                            <UnorderedList
                                                                v-for="bullet in child.bullets.value"
                                                                :size="'sm'"
                                                                :icon="'eos-icons:commit'"
                                                                :label="bullet"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </HexagonFrame>
                                </Glint>
                            </div>
                        </div>
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
useLayout().setNavigationMode('clear', 'index.vue');
const {$themeStore, $toRomanNumeral} = useNuxtApp();
const {screenHeightBreakpoint, height: screenHeight, width: screenWidth} = useScreen();
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
const featuredElementDimension = ref('lg');
const sections = ref([]);

watch(index, function(newIndex, oldIndex){}, { immediate: true });

const topProximityIndex = computed(() => index.value - 1);
const middleProximityIndex = computed(() => index.value);
const bottomProximityIndex = computed(() => index.value + 1);
//last section span 100% to bottom
const bottomProximityTopPosition = computed(() => index.value == (featured.value.length - 1) ? 100 : 93);

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
                'display': `auto`,
                'flex-direction': 'auto',
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
                    // 'background-color': topProximityBackground,
                };
            }

            if(!topProximityIsTypeRow){

                return {
                    'top': `-100%`,
                    'left': 0,
                    'right': 0,
                    'bottom': `calc(100% + ${topAllocation.value})`,
                    'padding-top': `${topProximityHeaderElementHeight}px`,
                    // 'background-color': topProximityBackground,
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
                // 'background-color': middleProximityBackground,
            };
        }

        if(bottomProximityIndex.value == indexParam){
            let bottomProximityBackground = featured.value[bottomProximityIndex.value].bg;
            let bottomContentOpacity = featured.value[middleProximityIndex.value].theme == featured.value[bottomProximityIndex.value].theme ? '1' : '0';

            return {
                'top': `${bottomProximityTopPosition.value}%`,
                'left': 0,
                'right': 0,
                'bottom': `auto`,
                'padding-top': `${bottomProximityHeaderElementHeight}px`,
                // 'background-color': bottomProximityBackground,
                'opacity': bottomContentOpacity
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

watch(screenHeight, value => {

    let size = 'md'

    if (value >= screenHeightBreakpoint['lg']) {
        size = 'xl';
    } else if (value >= screenHeightBreakpoint['md'] && value < screenHeightBreakpoint['lg']) {
        size = 'lg';
    } else if (value >= screenHeightBreakpoint['sm'] && value < screenHeightBreakpoint['md']) {
        size = 'md';
    } else if (value < screenHeightBreakpoint['sm']) {
        size = 'sm';
    }

    featuredElementDimension.value = size;

}, { immediate: true });

function featuredElementStyle(featured, property){

    let width = featured.dimension[featuredElementDimension.value][0];
    let height = featured.dimension[featuredElementDimension.value][1];

    return {
        'dimension': {
            'width': width,
            'height': height,
        }
    }[property];
}

function featuredElementClass(featured, child, property){

    let titleClass =  ['xl','lg'].indexOf(featuredElementDimension.value) >= 0
        ? 'tw-text-lg tw-font-medium tw-font-header'
        : 'tw-text-sm tw-font-normal tw-font-sans';

    let headerClass = child.content_direction == 'ttb'
        ? `tw-w-full tw-h-[${child.head_percentage}%] tw-p-[${child.header_padding}]`
        : `tw-w-[${child.head_percentage}%] tw-h-full`;

    let bodyClass = child.content_direction == 'ttb'
        ? `tw-w-full tw-h-[${child.body_percentage}%]`
        : `tw-w-[${child.body_percentage}%] tw-h-full`;

    return {
        'header_class': headerClass,
        'body_class' : bodyClass,
        'title': titleClass
    }[property];
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

.background-image{
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
    transition: all v-bind(scrollSpeedMs) cubic-bezier(0.645, 0.045, 0.355, 1);
}
.section-content {
    transition: all v-bind(scrollSpeedMs) cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>