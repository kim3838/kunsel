<template>
    <div>
        <LandingWrapper>
            <div class="tw-mx-auto tw-p-4 thread-border">
                <div v-if="false" class="tw-flex tw-mb-4">
                    <SampleEmitter
                        v-model:[dynamicFoo].capitalizeEveryWord ="fooComputed"
                        v-model:[dynamicBarCaller].capitalize="barComputed"
                        class="tw-w-[250px]"
                    />
                </div>

                <div v-if="false" class="tw-mb-4 tw-relative tw-w-[370px] tw-h-[530px] tw-mx-auto">
                    <Glint>
                        <InformationCard
                            :image="'/images/spotlight/1697501586302.jpg'"
                            :title="'FORGE YOUR FUTURE'"
                            :sub-title="'New Z790 motherboards from ROG pave the way for 14th Gen Intel Core CPUs'"
                            :body-color="''"
                            :fade-color="''"
                            :inner-border="'silver'"
                            :outer-border="'gray'"
                        />
                    </Glint>
                </div>

                <a
                    v-if="false"
                    class="hub-card tw-mt-40 tw-mx-auto thread-border"
                    href="https://www.callofduty.com/blackcell"
                    style="width: 200px; height: 400px; background-color: #ececec;">
                    <span class="glint"></span>
                    <span class="glint"></span>
                    <span class="glint"></span>
                    <span class="glint"></span>
                </a>

                <a
                    v-if="false"
                    class="tw-relative tw-block tw-mt-2 tw-mx-auto thread-border"
                    style="width: 400px; height: 200px; border-radius: 2px; background-color: #ececec;">
                    <Glint :orientation="'landscape'">
                        Hello
                    </Glint>
                </a>
                <a
                    v-if="false"
                    class="tw-relative tw-block tw-mt-2 tw-mx-auto thread-border"
                    style="width: 200px; height: 400px; border-radius: 2px; background-color: #ececec;">
                    <Glint :orientation="'portrait'">
                        Hello
                    </Glint>
                </a>

                <div v-if="false" class="tw-w-[170px] tw-h-[230px] tw-mb-4 tw-mx-auto">
                    <HexagonFrame>
                        <template #body>
                            <div class="tw-relative tw-h-full tw-flex tw-items-center tw-px-4 tw-text-center tw-text-xl tw-font-semibold">
                                Hexagon Frame Without Corner
                            </div>
                        </template>
                    </HexagonFrame>
                </div>

                <div v-if="false" class="tw-grid tw-gap-4 tw-grid-cols-1 lg:tw-grid-cols-3 xl:tw-grid-cols-4">
                    <div
                        v-for="item in leftToRightItems"
                        class="tw-h-[230px]">
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

                <div v-if="false" class="tw-w-[270px] tw-h-[350px] tw-mx-auto">
                    <Glint>
                        <HexagonFrame
                            :frame-border="'#dedede'"
                            :content-border="'#b7b7b7'"
                            :direction="'ttb'"
                            :head-percentage="70"
                            :top-right="45"
                            :bottom-left="45"
                            :header-fade="true"
                            :header-fade-color="'rgba(5,5,5,0.1)'">
                            <template #header>
                                <div class="tw-h-[70%] tw-w-full tw-p-[6px] tw-box-border">
                                    <div
                                        class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                                        :style="{'background':'url('+carouselTrendingItems[0].image+')'}"
                                    />
                                </div>
                                <div class="tw-h-[30%] tw-w-full tw-box-border">
                                    <div
                                        class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat tw-grayscale tw-opacity-20"
                                        :style="{'background':'url('+carouselTrendingItems[0].image+')'}"
                                    />
                                </div>
                            </template>
                            <template v-slot:body="{frameBorderColor, contentBorderColor}">
                                <div class="tw-h-[30%] tw-w-full tw-pt-2 tw-pl-4 tw-overflow-hidden tw-flex tw-flex-col">

                                    <div class="tw-overflow-auto tw-space-y-2">

                                        <div class="tw-font-semibold tw-h-max tw-flex-none" style="text-align: left;">
                                            <div class="tw-text-lg tw-font-semibold tw-font-data" v-text="carouselTrendingItems[0].subTitle"></div>

                                            <NuxtLink
                                                v-if="carouselTrendingItems[0].link"
                                                :to="carouselTrendingItems[0].link">
                                                <UnorderedList
                                                    class="tw-cursor-pointer hover:tw-underline tw-font-data"
                                                    :size="'md'"
                                                    :label="'Read more'"/>
                                            </NuxtLink>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </HexagonFrame>
                    </Glint>
                </div>

                <div v-if="false">
                    <div class="navigation-height tw-w-full tw-snap-start tw-snap-always"></div>
                    <div class="tw-pl-2 tw-mx-auto tw-max-w-screen-2xl tw-flex tw-flex-col">
                        <article class="tw-mt-4 tw-relative">
                            <CarouselModuleCarousel
                                v-model="carouselTrendingItem"
                                v-bind="carouselSettings"
                                :breakpoints="carouselBreakpoints"
                                :mouse-drag="true"
                                class="tw-w-full lg:tw-w-full">
                                <CarouselModuleSlide class="tw-w-[170px]">

                                    <HexagonFrame :top-right="45" :bottom-left="45">
                                        <template #body>
                                            <div class="tw-h-full tw-flex tw-items-center tw-text-center tw-font-['Google_Sans_Text'] tw-text-xl tw-font-semibold tw-px-8">
                                                Trending
                                            </div>
                                        </template>
                                    </HexagonFrame>
                                </CarouselModuleSlide>
                                <CarouselModuleSlide class="tw-w-[270px]" v-for="featuredItem in carouselTrendingItems" :key="featuredItem">
                                    <div class="tw-w-full tw-h-[350px] tw-mx-2">
                                        <HexagonFrame
                                            :frame-border="'#dedede'"
                                            :content-border="'#b7b7b7'"
                                            :direction="'ttb'"
                                            :head-percentage="70"
                                            :top-right="45"
                                            :bottom-left="45"
                                            :header-fade="true"
                                            :header-fade-color="'rgba(5,5,5,0.1)'">
                                            <template #header>
                                                <div class="tw-h-[70%] tw-w-full tw-p-[6px] tw-box-border">
                                                    <div
                                                        class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                                                        :style="{'background':'url('+featuredItem.image+')'}"
                                                    />
                                                </div>
                                                <div class="tw-h-[30%] tw-w-full tw-box-border">
                                                    <div
                                                        class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat tw-grayscale tw-opacity-20"
                                                        :style="{'background':'url('+featuredItem.image+')'}"
                                                    />
                                                </div>
                                            </template>
                                            <template #body>
                                                <div class="tw-h-[30%] tw-w-full tw-pt-2 tw-pl-8 tw-overflow-hidden tw-flex tw-flex-col">

                                                    <div class="tw-overflow-auto tw-space-y-2">

                                                        <div class="tw-font-semibold tw-h-max tw-flex-none" style="text-align: left;">
                                                            <div class="tw-text-lg tw-font-semibold" v-text="featuredItem.subTitle"></div>

                                                            <NuxtLink
                                                                v-if="featuredItem.link"
                                                                :to="featuredItem.link">
                                                                <UnorderedList
                                                                    class="tw-cursor-pointer hover:tw-underline"
                                                                    :size="'md'"
                                                                    :label="'Read more'"/>
                                                            </NuxtLink>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </HexagonFrame>
                                    </div>
                                </CarouselModuleSlide>
                                <template #addons>
                                    <CarouselModuleNavigation />
                                </template>
                            </CarouselModuleCarousel>
                        </article>
                    </div>
                </div>

                <div v-if="false" class="tw-mt-6 tw-mx-auto tw-w-11/12">
                    <div class="tw-grid tw-gap-[1rem] tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4">
                        <div
                            v-for="item in topToBottomItems" class="tw-h-[430px]">
                            <HexagonFrame
                                :frame-border="item.frameBorder"
                                :content-border="item.contentBorder"
                                :direction="'ttb'"
                                :head-percentage="50"
                                :top-right="50"
                                :bottom-left="50"
                                :header-fade="false">
                                <template #header>
                                    <div class="tw-h-[50%] tw-w-full">
                                        <div
                                            class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat"
                                            :style="{'background':'url('+item.image.path+')'}"
                                        />
                                    </div>
                                    <div class="tw-h-[50%] tw-w-full tw-bg-black">
                                        <div
                                            class="tw-h-full tw-w-full tw-bg-cover tw-bg-center tw-bg-no-repeat tw-opacity-90 tw-blur-2xl"
                                            :style="{'background':'url('+item.image.path+')'}"
                                        />
                                    </div>
                                </template>
                                <template #body>
                                    <div class="tw-h-[50%] tw-w-full tw-p-4 tw-overflow-hidden tw-relative tw-flex tw-flex-col tw-text-[#e3e3e3]">

                                        <div class="tw-overflow-auto tw-space-y-2">

                                            <div class="tw-font-semibold tw-h-max tw-flex-none">
                                                <UnorderedList
                                                    class="tw-cursor-pointer hover:tw-underline"
                                                    :size="'lg'"
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

                <div v-if="false" class="tw-ml-20 tw-rounded-md hover:tw-cursor-pointer tw-w-[244px] tw-h-[48px]"
                     style="background: linear-gradient(to right, rgb(156, 112, 164), rgb(40, 39, 82));position: relative;">
                    <div style="width: 100%;height: 100%;position: absolute;background-size: cover;opacity: 0.2;background-image: url('/images/deco/ripple_texture.png');"></div>
                    <div class="tw-flex tw-gap-2 tw-items-center tw-rounded-md" style="text-shadow: rgba(0, 0, 0, 0.5) 0px 2px 8px;">
                        <div
                            class="tw-flex tw-w-[48px] tw-h-[48px] tw-items-center tw-justify-center tw-rounded-l-md"
                            style="background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));">
                            <img
                                src="https://dota2protracker.com/static/facet_icons/mana.png"
                                class="tw-w-6 tw-h-6"
                                style="filter: drop-shadow(rgba(0, 0, 0, 0.3) 0px 3px 2px);">
                        </div>
                        <div class="tw-flex tw-pr-2 tw-font-medium tw-justify-center tw-text-xl tw-text-white tw-uppercase tw-whitespace-nowrap">
                            Satyr Convert
                        </div>
                    </div>
                </div>

                <span :style="boxStyle" ref="animateMe" class="section-navigation thread-border tw-absolute">ANIMATE</span>

                <br>

                <div v-if="true" class="tw-space-x-2 tw-flex tw-gap-2">
                    <Glint :orientation="'landscape'" class="tw-max-w-min">
                        <Button :label="'Show from Top'" @click="topPosition = 50"></Button>
                    </Glint>
                    <Glint :orientation="'landscape'" class="tw-max-w-min">
                        <Button :label="'Hide to Top'" @click="topPosition = 0"></Button>
                    </Glint>
                </div>


                <!-- Static Single, MultiSelect and DateTime, Date, and Month Picker -->
                <div v-if="true" class="tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-6 2xl:tw-grid-cols-6">
                    <div class="tw-block neutral-border">
                        <InputLabel :size="'lg'" value="Static Multi Select" />
                        <MultiSelect :glint="true" drop-shadow :selection-max-viewable-line="5" :size="'lg'" :options="category" :icon="'ic:sharp-qr-code'"/>
                    </div>
                    <div class="tw-block neutral-border">
                        <InputLabel :size="'lg'" value="Static Single Select" />
                        <SingleSelect :glint="true" drop-shadow :selection-max-viewable-line="4" :always-active="false" :size="'lg'" :icon="'emojione-monotone:japanese-no-vacancy-button'" :options="plan"/>
                    </div>
                    <div class="tw-block neutral-border">
                        <InputLabel :size="'lg'" for="date" value="Date" />
                        <InputWithIcon
                            :icon="'simple-icons:googlecalendar'"
                            :size="'lg'"
                            :id="'date'"
                            v-model="formStore.filters.date"
                            autocomplete="off"
                            readonly
                            :disabled="false"
                            :glint="true" />
                    </div>
                    <div class="tw-block neutral-border">
                        <InputLabel :size="'lg'" for="datetime" value="DateTime" />
                        <InputWithIcon
                            :icon="'simple-icons:googlecalendar'"
                            :size="'lg'"
                            :id="'datetime'"
                            v-model="formStore.filters.dateTime"
                            autocomplete="off"
                            readonly
                            :disabled="false"
                            :glint="true" />
                    </div>
                    <div class="tw-block neutral-border">
                        <InputLabel :size="'lg'" value="Number" />
                        <InputWithIcon
                            @focusStateChanged="handleFocusStateChanged"
                            :placeholder="'Enter value'"
                            :icon="'ion:ios-circle-outline'"
                            :size="'lg'"
                            :type="'text'"
                            :disabled="false"
                            :glint="true" />
                    </div>
                    <div class="tw-block neutral-border">
                        <InputLabel :size="'lg'" value="Input" />
                        <Input
                            @focusStateChanged="handleFocusStateChanged"
                            :placeholder="'Enter value'"
                            :size="'lg'"
                            type="text"
                            autocomplete="off"
                            :glint="true" />
                    </div>
                </div>

                <!-- Paginated Single and MultiSelect -->
                <div v-if="true" class="tw-mt-6 tw-grid tw-gap-2 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 2xl:tw-grid-cols-5">
                    <div class="tw-block neutral-border">
                        <InputLabel :size="'lg'" value="Paginated Multi Select" />

                        <MultiSelectPaginated
                            :drop-shadow="true"
                            :selection-max-content="true"
                            :selected-max-viewable-line="6"
                            :selection-max-viewable-line="10"
                            :searchable="true"
                            :glint="true"
                            :selection-float="true"
                            :always-active="false"
                            :label="'Select Prototypes'"
                            :size="'lg'"
                            :payload="multiSelectPrototypePayload"
                            :icon="'ic:sharp-qr-code'"/>

                    </div>
                    <div class="tw-block neutral-border">
                        <InputLabel :size="'lg'" value="Paginated Single Select" />
                        <SingleSelectPaginated
                            :value-persist="true"
                            :drop-shadow="true"
                            :selection-max-content="false"
                            :selection-max-viewable-line="10"
                            :searchable="true"
                            :glint="true"
                            :selection-float="true"
                            :always-active="false"
                            :label="'Select Prototype'"
                            :size="'lg'"
                            :payload="singleSelectPrototypePayload"
                            :icon="'emojione-monotone:japanese-no-vacancy-button'"/>
                    </div>
                </div>

            </div>
        </LandingWrapper>
    </div>
</template>

<script setup lang="ts">
import dataPayload from '@/public/data/payload.js';
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid', 'Lab.vue');
const {screens, width: screenWidth, } = useScreen();
const {$formStore} = useNuxtApp();
const topPosition = ref(0);
const clientReadyState = useClientReadyState();
const boxStyle = computed(() => ({
    position: 'relative',
    top: `${topPosition.value}%`,
}))
const formStore = $formStore;
const dynamicFoo = ref('foo');
const dynamicBarCaller = ref('bar');
const fooProp = ref('');
const barProp = ref('');
const barComputed = computed({
    get () {
        return barProp.value;
    },

    set (value) {
        barProp.value = value;
    }
})
const fooComputed = computed({
    get () {
        return fooProp.value;
    },

    set (value) {
        fooProp.value = value;
    }
})
watch(fooProp, value => {
    console.log({'FOO UPDATED' : value});
});
watch(barProp, value => {
    console.log({'BAR UPDATED' : value});
});

const leftToRightItems = ref(dataPayload['leftToRightItems']);
const topToBottomItems = ref(dataPayload['topToBottomItems']);

const carouselSettings = ref({
    itemsToShow: 2,
    snapAlign: 'start',
});
const carouselBreakpoints = ref({
    [screens['sm']]: {
        itemsToShow: 2,
        snapAlign: 'start',
    },

    [screens['md']]: {
        itemsToShow: 2.5,
        snapAlign: 'start',
    },

    [screens['lg']]: {
        itemsToShow: 4.5,
        snapAlign: 'start',
    },
});
const carouselTrendingItem = ref(0);
const carouselTrendingItems = ref(dataPayload['carousel']['trendingItems']);

let multiSelectPrototypePayload = reactive(dataPayload['prototype']['multiSelectPrototypePayload']);
let singleSelectPrototypePayload = reactive(dataPayload['prototype']['singleSelectPrototypePayload']);
let category = reactive(dataPayload['prototype']['category']);
let plan = reactive(dataPayload['prototype']['plan']);

function handleFocusStateChanged(event){
    console.log({"handleFocusStateChanged": event})
}

const {render} = dateTimePicker();

//Render sample datetime pickers
let dateTimePickers = ref([
    {
        id: 'datetime',
        type: 'datetime',
        selectedCallback: (payload) => {
            formStore.setFormFilterValue({
                key: 'dateTime',
                value: payload.value
            });
        }
    }, {
        id: 'date',
        type: 'date',
        selectedCallback: (payload) => {
            formStore.setFormFilterValue({
                key: 'date',
                value: payload.value
            });
        }
    }, {
        id: 'month',
        type: 'month',
        selectedCallback: (payload) => {
            formStore.setFormFilterValue({
                key: 'monthValue',
                value: payload.value
            });

            formStore.setFormFilterValue({
                key: 'monthLabel',
                value: payload.label
            });
        }
    }
]);

//Render date time pickers on navigate
onMounted(async () => {
    await nextTick(() => {
        render(dateTimePickers.value);
    });
});

//Render date time pickers on load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            render(dateTimePickers.value);
        });
    }
})
</script>

<style scoped lang="scss">
.section-navigation {
    transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: top 200ms;
}
</style>