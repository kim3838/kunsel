<template>
    <div
        v-if="clientReadyState"
        ref="layoutScroll"
        class="tw-h-screen tw-max-h-screen tw-overflow-y-hidden tw-overflow-x-hidden">
        <!-- Primary Navigation Menu -->
        <LandingNavigation v-model:navigation-height-in-pixels="topAllocation"/>
        <!-- Main Content -->
        <main class="tw-relative">
            <!-- Debug -->
            <div v-if="true" class="tw-fixed tw-z-50 tw-text-xs tw-font-mono">
                {{`SCREENDIMENSION: ${screenWidth} x ${screenHeight}`}}
            </div>

            <!-- Section Fragments -->
            <div class="tw-fixed tw-z-10 tw-top-0 tw-right-0 tw-bottom-0 tw-left-0 tw-h-screen">
                <!-- Todo: Add icon before section titles to overlap vertical rule -->
                <div class="tw-absolute vertical-nav-rule"></div>

                <div v-if="false" class="tw-absolute tw-text-xs tw-font-mono">
                    {{"INDEX: " + index}}<br>
                    <pre>{{features[index]}}</pre>
                </div>
            </div>

            <!-- Section Background -->
            <section v-for="(section, index) in features" :style="{'background': section?.background}">
                <div v-if="section?.media" class="tw-relative tw-w-full tw-h-screen tw-flex tw-justify-center tw-items-start tw-overflow-hidden">
                    <div v-if="section?.layer?.type == 'image' && section?.layer?.source" class="tw-w-full tw-h-full tw-absolute background-image" :style="{'background-image': 'url('+section.layer.source+')'}"></div>
                    <div v-if="section?.media?.type == 'image' && section?.media?.source" class="tw-w-full tw-h-full tw-absolute background-image" :style="{'background-image': 'url('+section.media.source+')'}"></div>

                    <video
                        v-if="section?.media?.type == 'video' && section?.media?.source"
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
            <div class="tw-fixed tw-z-20 tw-top-0 tw-right-0 tw-bottom-0 section-content-container allocate-navigation">
                <div class="tw-relative tw-w-full tw-h-full">

                    <!-- Header -->
                    <div
                        v-for="(featured, index) in features"
                        :id="`featured-${index}`"
                        :style="sectionStyle(index)"
                        class="tw-absolute tw-z-30 all-transition">
                        <div
                            :id="`featured-${index}-header`"
                            class="tw-pb-1">
                            <div
                                class="tw-font-stiff-wide section-header tw-w-min tw-px-1 tw-text-nowrap tw-cursor-pointer tw-text-white tw-rounded-sm tw-backdrop-blur-sm"
                                style="text-shadow: 1px 1px 2px #000000;">
                                <div class="tw-w-max">
                                    <UnorderedList
                                        :icon="sectionNavigationIcon(index)"
                                        :label="featured?.title"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Banner -->
                    <div
                        v-if="true"
                        v-for="(featured, index) in features"
                        :id="`featured-${index}-content-banner`"
                        :style="baseContentBannerStyle(featured, index)"
                        class="tw-absolute tw-z-20 all-transition">
                        <div class="tw-w-full tw-h-full tw-pb-1">
                            <div :style="contentBannerStyle(featured, index)">
                                <div
                                    v-if="featured?.banner?.type == 'image'"
                                    class="tw-w-full tw-h-full background-image"
                                    :style="bannerImageSourceSet(featured?.banner?.source_set)">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Carousel Content -->
                    <div
                        v-for="(featured, index) in features"
                        :id="`featured-${index}-content`"
                        :style="contentStyle(index)"
                        class="tw-absolute tw-z-30 all-transition">

                        <div class="tw-relative compensate-left-padding tw-w-screen">
                            <FeaturedCarouselRow
                                :inner-id="`featured-${index}-carousel-inner`"
                                :x-padding="paddingInPixels"
                                :gap="'0.5rem'"
                                :scroll-speed="scrollSpeedMs"
                                :items="featured.children"><!-- tw-bg-gray-600 tw-bg-opacity-50 -->
                                <template v-slot:items="{slot}">
                                    <div
                                        class="tw-flex-none tw-cursor-pointer tw-relative"
                                        v-for="child in slot.items" :key="child"
                                        :style="[featuredElementStyle(featured, child, 'card_dimension')]">
                                        <HexagonFrame
                                            :frame-border-gradient-enable="true"
                                            :frame-border-primary-color="child.frame_border"
                                            :opaque="child.content_opaque"
                                            :content-background="child.content_background"
                                            :direction="child.content_direction"
                                            :theme="featured.theme"
                                            :head-percentage="featuredElementStyle(featured, child, 'head_percentage')"
                                            :top-right="child.top_right_corner"
                                            :bottom-left="child.bottom_left_corner"
                                            :header-fade="child.header_fade"
                                            :header-fade-color="child.header_fade_color">
                                            <template #header>
                                                <div :style="[featuredElementStyle(featured, child, 'header_style')]" class="tw-bg-cover tw-bg-center tw-bg-no-repeat tw-box-border">
                                                    <div
                                                        class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                                                        :style="{'background': child?.image ? 'url('+child?.image+')' : 'none'}"/>
                                                </div>
                                                <div :style="[featuredElementStyle(featured, child, 'body_style')]" class="tw-box-border">
                                                    <div
                                                        class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat tw-grayscale"
                                                        :style="{'background': child?.body_background ? 'url('+child?.body_background+')' : 'none', 'opacity': child?.body_background_opacity ? child.body_background_opacity : 0.2}"/>
                                                </div>
                                            </template>
                                            <template v-slot:body="{frameBorderColor}">
                                                <div style="text-shadow: none;" :style="[featuredElementStyle(featured, child, 'body_style')]" class="tw-p-2 tw-overflow-hidden tw-flex tw-flex-col">
                                                    <div v-if="child.content_direction == `ttb`" class="tw-overflow-auto tw-space-y-0.5">
                                                        <div :class="[featuredElementClass(featured, child, 'title')]" class="tw-line-clamp-2" v-text="child.title"></div>

                                                        <div style="height: 1px;width: 100%;background: linear-gradient(to right, transparent 0%, #e3e3e3 30%, #e3e3e3 70%, transparent 100%);"></div>

                                                        <div v-if="child?.add_ons?.value?.length" class="tw-flex tw-flex-row tw-flex-wrap tw-gap-1">
                                                            <img :style="{'height': child.add_ons.height}" v-for="add_on in child.add_ons.value" :src="add_on.image" :alt="add_on.alt"/>
                                                        </div>

                                                    </div>

                                                    <div v-else-if="child.content_direction == `ltr`" class="tw-overflow-auto tw-space-y-1">
                                                        <div class="tw-font-stiff tw-h-max tw-flex-none">
                                                            <UnorderedList
                                                                class="tw-cursor-pointer hover:tw-underline"
                                                                :size="child?.title_size"
                                                                :icon="child?.title_icon"
                                                                :label="child?.title"/>
                                                        </div>

                                                        <div style="height: 1px;width: 100%;background: linear-gradient(to right, transparent 0%, #e3e3e3 30%, #e3e3e3 70%, transparent 100%);"></div>

                                                        <div v-if="child?.add_ons?.value?.length" :class="[child?.title_size === 'lg' ? 'tw-ml-6' : 'tw-ml-4']" class="tw-flex tw-flex-row tw-flex-wrap tw-gap-1">
                                                            <img :style="{'height': child.add_ons.height}" v-for="add_on in child.add_ons.value" :src="add_on.image" :alt="add_on.alt"/>
                                                        </div>

                                                        <div v-if="child?.bullets?.value?.length" class="tw-flex tw-flex-row tw-flex-nowrap">
                                                            <div class="tw-w-full" :style="{'columns': (child.bullets.column ? child.bullets.column : 1)}">
                                                                <UnorderedList
                                                                    v-for="bullet in child?.bullets?.value"
                                                                    :size="child?.description_size"
                                                                    :icon="'eos-icons:commit'"
                                                                    :label="bullet"/>
                                                            </div>
                                                        </div>

                                                        <div v-if="child?.sub_bullets?.value?.length" class="tw-flex tw-flex-row tw-flex-nowrap tw-pt-2">
                                                            <div class="tw-w-full tw-italic" :style="{'columns': (child.sub_bullets.column ? child.sub_bullets.column : 1)}">
                                                                <UnorderedList
                                                                    v-for="bullet in child?.sub_bullets?.value"
                                                                    :size="'sm'"
                                                                    :icon="'stash:asterisk-solid'"
                                                                    :label="bullet"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </HexagonFrame>
                                    </div>
                                </template>
                            </FeaturedCarouselRow>
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
import dataPayload from '@/public/data/payload.js';
useLayout().setNavigationMode('clear-none-background', 'index.vue');
const {$themeStore, $toRomanNumeral} = useNuxtApp();
const {screenHeightBreakpoint, screenWidthBreakpoint, height: screenHeight, width: screenWidth} = useScreen();
const clientReadyState = useClientReadyState();

const {
    hexAlpha,
    thread: threadColor,
    accent: accentColor,
} = storeToRefs($themeStore);

const accentColor20 = computed(() => {
    return accentColor.value + hexAlpha.value['20'];
});

const topAllocation = ref('0px');
const features = ref(dataPayload['featured']);
const featuredVideos = useTemplateRef('featuredVideos');
const index = ref(0);
const featuredElementDimension = ref('lg');
const bannerSourceSet = ref('desktop');
const sections = ref([]);
const padding = ref(56);
const paddingInPixels = computed(()=>`${padding.value}px`);
const compensatePaddingInPixels = computed(()=>`-${padding.value}px`);
const marginRuleLeftSpace = computed(()=>padding.value - 6);
const marginRuleLeftSpaceInPixels = computed(()=>`${marginRuleLeftSpace.value}px`);

const scrolling = ref(false);
const proximityThreshold = ref(0);
const scrollSpeed = ref(300);
const scrollSpeedMs = computed(()=>`${scrollSpeed.value}ms`);
const layoutScroll = ref<HTMLElement | null>(null)
const { y: layoutScrollY } = useScroll(layoutScroll)

//Boot full page scroll on navigate
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(() => {
            bootPageScroll();
            autoPlayVideoSpotlights(featuredVideos);
        });
    })
}

//Boot full page scroll on page load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            bootPageScroll();
            autoPlayVideoSpotlights(featuredVideos);
        });
    }
});

function autoPlayVideoSpotlights(videoSpotlights){

    videoSpotlights.value?.forEach(video => {

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

const topProximityIndex = computed(() => index.value - 1);
const middleProximityIndex = computed(() => index.value);
const bottomProximityIndex = computed(() => index.value + 1);
//last section span 100% to bottom
const bottomProximityTopPosition = computed(() => index.value == (features.value.length - 1) ? 100 : 93);

const withinProximity = (indexParam) => {
    return (middleProximityIndex.value == indexParam
        || topProximityIndex.value == indexParam
        || bottomProximityIndex.value == indexParam);
}

function sectionStyle(indexParam){

    let sectionHeaderHeight = document.getElementById('featured-'+indexParam)?.offsetHeight || 0;

    let topProximityHeaderElementHeight = document.getElementById('featured-' + topProximityIndex.value + '-header')?.offsetHeight || 0;

    let middleProximity = (features.value[middleProximityIndex.value]?.proximity) ? features.value[middleProximityIndex.value].proximity : 0 ;
    let middleProximityTopPosition = (middleProximity)
        ? `${middleProximity}%`
        : `${topProximityHeaderElementHeight}px`;

    if(withinProximity(indexParam)){
        if(topProximityIndex.value == indexParam){
            let topProximityBackground = features.value[topProximityIndex.value].bg;

            let topProximityTopPosition = features.value[topProximityIndex.value].type == 'row'
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
            let middleProximityBackground = features.value[middleProximityIndex.value].bg;

            return {
                'top': `${middleProximityTopPosition}`,
                'left': 0,
                'right': 0,
                'bottom': `${100 - bottomProximityTopPosition.value}%`,
                //'background-color' : middleProximityBackground
            };
        }

        if(bottomProximityIndex.value == indexParam){
            let bottomProximityBackground = features.value[bottomProximityIndex.value].bg;

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

function baseContentBannerStyle(featured, indexParam) {

    let middleProximityHeaderElementHeight = document.getElementById('featured-' + middleProximityIndex.value + '-header')?.offsetHeight || 0;
    let middleProximity = (features.value[middleProximityIndex.value]?.proximity) ? features.value[middleProximityIndex.value].proximity : 0 ;

    let middleProximityMargintop = indexParam > 0 ? middleProximityHeaderElementHeight : 0;

    if(middleProximityIndex.value == indexParam){
        return {
            'top': 0,
            'left': `${compensatePaddingInPixels.value}`,
            'right': 0,
            'bottom': `calc(100% - ${middleProximity}%)`,
            'margin-top': `${middleProximityMargintop}px`,
        };
    } else {
        let minHeight = featured.banner.min_height;
        let hiddenOffsetHeight = document.getElementById(`featured-${indexParam}-content-banner`)?.offsetHeight || 0;

        hiddenOffsetHeight = hiddenOffsetHeight < minHeight ? minHeight : hiddenOffsetHeight;

        //Hidden from top
        if(indexParam < index.value){
            return {
                'top': `calc(-${hiddenOffsetHeight}px - ${topAllocation.value})`,
                'left': `${compensatePaddingInPixels.value}`,
                'right': 0,
                'bottom': `calc(100% + ${topAllocation.value})`
            };
        }

        //Hidden from bottom
        if(indexParam > index.value){
            return {
                'top': `100%`,
                'left': `${compensatePaddingInPixels.value}`,
                'right': 0,
                'bottom': `calc(-${hiddenOffsetHeight}px - 0.25rem)`,
            };
        }
    }
}

function contentBannerStyle(featured, indexParam){

    let bannerEnabled = featured.banner.enabled;

    let bannerEnabledAndHasProximity = bannerEnabled && featured.proximity;

    let height = '100%';

    return {
        'display': bannerEnabledAndHasProximity ? 'block' : 'none',
        'height': bannerEnabledAndHasProximity ? height : '0px',
    }
}

function bannerImageSourceSet(sourceSet) {

    let source = Boolean(sourceSet) ? sourceSet[bannerSourceSet.value] : null;

    source = Boolean(source) ? `url(${source})` : 'none';

    return {
        'background-image': source
    };
}

function sectionNavigationIcon(indexParam){
    if(topProximityIndex.value == indexParam){
        return 'ic:baseline-arrow-upward';
    }

    if(middleProximityIndex.value == indexParam){
        return 'ic:baseline-arrow-forward';
    }

    if(bottomProximityIndex.value == indexParam){
        return 'ic:baseline-arrow-downward';

    }
}

function contentStyle(indexParam){

    let topProximityHeaderElementHeight = document.getElementById('featured-' + topProximityIndex.value + '-header')?.offsetHeight || 0;
    let middleProximityHeaderElementHeight = document.getElementById('featured-' + middleProximityIndex.value + '-header')?.offsetHeight || 0;
    let bottomProximityHeaderElementHeight = document.getElementById('featured-' + bottomProximityIndex.value + '-header')?.offsetHeight || 0;

    let middleProximity = (features.value[middleProximityIndex.value]?.proximity) ? features.value[middleProximityIndex.value].proximity : 0 ;
    let middleProximityTopPosition = (middleProximity)
        ? `${middleProximity}%`
        : `${topProximityHeaderElementHeight}px`;

    if(withinProximity(indexParam)){
        if(topProximityIndex.value == indexParam){

            let topProximityIsTypeRow = features.value[topProximityIndex.value].type == 'row';

            let topProximityBackground = features.value[topProximityIndex.value].debug.bg;

            let topProximityTopPosition = features.value[topProximityIndex.value].type == 'row'
                ? `${100 - middleProximity}%`
                : `calc(100% - ${topAllocation.value})`;

            if(topProximityIsTypeRow){
                return {
                    'top': `0%`,
                    'left': 0,
                    'right': 0,
                    'bottom': topProximityTopPosition,
                    'margin-top': `${topProximityHeaderElementHeight}px`,
                    //'background-color': topProximityBackground,
                };
            }

            if(!topProximityIsTypeRow){

                return {
                    'top': `-100%`,
                    'left': 0,
                    'right': 0,
                    'bottom': `calc(100% + ${topAllocation.value})`,
                    'margin-top': `${topProximityHeaderElementHeight}px`,
                    //'background-color': topProximityBackground,
                };
            }
        }

        if(middleProximityIndex.value == indexParam){
            let middleProximityBackground = features.value[middleProximityIndex.value].debug.bg;

            return {
                'top': `${middleProximityTopPosition}`,
                'left': 0,
                'right': 0,
                'bottom': `calc(${100 - bottomProximityTopPosition.value}% + 0.25rem)`,
                'margin-top': `${middleProximityHeaderElementHeight}px`,
                //'background-color': middleProximityBackground,
            };
        }

        if(bottomProximityIndex.value == indexParam){
            let bottomProximityBackground = features.value[bottomProximityIndex.value].debug.bg;
            let bottomContentOpacity = features.value[middleProximityIndex.value].theme == features.value[bottomProximityIndex.value].theme ? '1' : '0';

            return {
                'top': `${bottomProximityTopPosition.value}%`,
                'left': 0,
                'right': 0,
                'bottom': `auto`,
                'margin-top': `${bottomProximityHeaderElementHeight}px`,
                'opacity': bottomContentOpacity,
                //'background-color': bottomProximityBackground,
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
                'margin-top': `${topProximityHeaderElementHeight}px`,
            };
        }

        //Hidden from bottom
        if(indexParam > index.value){
            return {
                'top': `100%`,
                'left': 0,
                'right': 0,
                'margin-top': `${bottomProximityHeaderElementHeight}px`,
            };
        }
    }
}

watch(index, newIndex => {

    let currentFeaturedHasBackground = Boolean(features.value[newIndex]?.media?.source);

    if(currentFeaturedHasBackground){
        useLayout().setNavigationMode('clear-with-background', 'index.vue');
    } else {
        useLayout().setNavigationMode('clear-none-background', 'index.vue');
    }


}, { immediate: true });

watch(screenHeight, value => {

    let size = 'lg'

    if (value > screenHeightBreakpoint['xl']) {
        size = 'xl';
    } else if (value >= screenHeightBreakpoint['lg'] && value < screenHeightBreakpoint['xl']) {
        size = 'lg';
    } else if (value >= screenHeightBreakpoint['md'] && value < screenHeightBreakpoint['lg']) {
        size = 'lg';
    } else if (value >= screenHeightBreakpoint['sm'] && value < screenHeightBreakpoint['md']) {
        size = 'md';
    } else if (value >= screenHeightBreakpoint['xs'] && value < screenHeightBreakpoint['sm']) {
        size = 'sm';
    } else if(value < screenHeightBreakpoint['xs']){
        size = 'xs';
    }

    featuredElementDimension.value = size;

}, { immediate: true });

watch(screenWidth, value => {

    let sourceSet = 'desktop';
    let paddingTemp = 56;

    if (value > screenWidthBreakpoint['xl']) {
        sourceSet = 'desktop';
        paddingTemp = 66;
    } else if (value >= screenWidthBreakpoint['lg'] && value < screenWidthBreakpoint['xl']) {
        sourceSet = 'desktop';
        paddingTemp = 56;
    } else if (value >= screenWidthBreakpoint['md'] && value < screenWidthBreakpoint['lg']) {
        sourceSet = 'tablet';
        paddingTemp = 46;
    } else if (value < screenWidthBreakpoint['md']) {
        sourceSet = 'mobile';
        paddingTemp = 46;
    }

    bannerSourceSet.value = sourceSet;
    padding.value = paddingTemp;

}, { immediate: true });

function featuredElementStyle(featured, child, property){

    let card_dimension = child.card_dimension ? child.card_dimension : featured.card_dimension;

    let card_dimension_width = card_dimension[featuredElementDimension.value][0];
    let card_dimension_min_width = card_dimension.minimum[0];
    let card_dimension_max_width = card_dimension.maximum[0];
    let card_dimension_height = card_dimension[featuredElementDimension.value][1];
    let card_dimension_min_height = card_dimension.minimum[1];
    let card_dimension_max_height = card_dimension.maximum[1];

    let head_percentage = child.head_percentage[featuredElementDimension.value];
    let body_percentage = child.body_percentage[featuredElementDimension.value];

    let card_header_width = child.content_direction == 'ttb' ? '100%' : `${head_percentage}%`;
    let card_header_height = child.content_direction == 'ttb' ? `${head_percentage}%` : '100%';
    let card_header_background = child?.header_background ? `url(${child.header_background})` : 'none';

    let card_body_width = child.content_direction == 'ttb' ? '100%' : `${body_percentage}%`;
    let card_body_height = child.content_direction == 'ttb' ? `${body_percentage}%` : '100%';

    return {
        'card_dimension': {
            'width': card_dimension_width,
            'min-width': card_dimension_min_width,
            'max-width': card_dimension_max_width,
            'height': card_dimension_height,
            'min-height': card_dimension_min_height,
            'max-height': card_dimension_max_height,
        },
        'head_percentage': head_percentage,
        'header_style': {
            'width': card_header_width,
            'height': card_header_height,
            'padding': child.header_padding,
            'background-image': card_header_background
        },
        'body_style': {
            'width': card_body_width,
            'height': card_body_height,
            'text-shadow': featured.theme == 'light' ? 'none' : 'rgb(0, 0, 0) 1px 1px 2px'
        }
    }[property];
}

function featuredElementClass(featured, child, property){

    let titleClass =  ['xl','lg'].indexOf(featuredElementDimension.value) >= 0
        ? 'tw-text-lg tw-font-medium tw-font-stiff'
        : 'tw-text-sm tw-font-normal tw-font-stiff';

    return {
        'title': titleClass
    }[property];
}

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
    width: 1px;
    inset: 0 0 0 v-bind(marginRuleLeftSpaceInPixels);
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

.all-transition {
    transition: all v-bind(scrollSpeedMs) cubic-bezier(0.645, 0.045, 0.355, 1);
}

.section-content-container{
    left: v-bind(paddingInPixels)
}

.section-header{
    background-color: v-bind(accentColor20);
}

.compensate-left-padding {
    left: v-bind(compensatePaddingInPixels)
}
</style>