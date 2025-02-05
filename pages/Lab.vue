<template>
    <div>
        <LandingWrapper>
            <div class="mx-auto space-y-2">

                <ClientOnly>
                    <div class="text-xs font-mono">
                        {{`SCREEN DIMENSION: ${screenWidth} x ${screenHeight}`}}
                    </div>
                </ClientOnly>

                <a v-if="true" class="link" href="">
                    <span>
                        Shop Now
                    </span>
                </a>

                <div v-if="false" class="absolute left-[56px] w-screen">
                    <div class="relative w-full h-full">

                        <div class="relative left-[-56px] w-screen neutral-border ">
                            FeaturedCarouselRow
                            <FeaturedCarouselRow :inner-id="'unique-id-001'" :x-padding="'56px'" :gap="'0.5rem'" :items="[
                                { id: 1, name: 'Product 1', width: '550px', height:'200px', image: '/images/product/02/h732.png' },
                                { id: 2, name: 'Product 2', width: '550px', height:'200px', image: '/images/product/04/h732.png' },
                                { id: 3, name: 'Product 3', width: 'calc(33.3% - 0.5rem)', height:'200px', image: '/images/product/03/h732.png' },
                                { id: 4, name: 'Product 4', width: '200px', height:'200px', image: '/images/product/08/h732.png' },
                                ]">
                                <template v-slot:items="{slot}">
                                    <div
                                        v-for="(item, index) in slot.items"
                                        :key="index"
                                        class="flex-none neutral-border"
                                        :style="{width: item.width}"
                                    >
                                        <div>
                                            <img style="width: 100%; height: 150px; object-fit: cover;" :src="item.image" :alt="item.name" />
                                            <h3>{{ item.name }}</h3>
                                        </div>
                                    </div>
                                </template>

                            </FeaturedCarouselRow>
                        </div>
                    </div>
                </div>

                <StarRating v-if="false" :rating="1.5" />

                <div v-if="false" class="flex mb-4">
                    <SampleEmitter
                        v-model:[dynamicFoo].capitalizeEveryWord ="fooComputed"
                        v-model:[dynamicBarCaller].capitalize="barComputed"
                        class="w-[250px]"
                    />
                </div>

                <div v-if="false" class="mb-4 relative w-[370px] h-[530px] mx-auto">
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
                    class="hub-card mt-40 mx-auto thread-border"
                    href="https://www.callofduty.com/blackcell"
                    style="width: 200px; height: 400px; background-color: #ececec;">
                    <span class="glint"></span>
                    <span class="glint"></span>
                    <span class="glint"></span>
                    <span class="glint"></span>
                </a>

                <a
                    v-if="false"
                    class="relative block mt-2 mx-auto thread-border"
                    style="width: 400px; height: 200px; border-radius: 2px; background-color: #ececec;">
                    <Glint :orientation="'landscape'">
                        Hello
                    </Glint>
                </a>
                <a
                    v-if="false"
                    class="relative block mt-2 mx-auto thread-border"
                    style="width: 200px; height: 400px; border-radius: 2px; background-color: #ececec;">
                    <Glint :orientation="'portrait'">
                        Hello
                    </Glint>
                </a>

                <div v-if="false"  class="bg-cover bg-no-repeat bg-center p-4 bg-slate-800" :style="{'background-image': 'url(/images/cod-bg-hero.png'}">
                    <div class="w-[330px] h-[420px] mx-auto">
                        <Glint :orientation="`portrait`" :color="`#a98313`">
                            <HexagonFrame
                                :frame-border-primary-color="'#524007'"
                                :content-background="`#1b1b1b`"
                                :direction="'ttb'"
                                :theme="'dark'"
                                :head-percentage="70"
                                :top-right="45"
                                :bottom-left="45"
                                :opaque="true"
                                :header-fade="true"
                                :header-fade-color="'rgba(5,5,5,0.5)'">
                                <template #header>
                                    <div class="h-[70%] w-full p-[20px] box-border">
                                        <div
                                            class="h-full w-full bg-cover bg-center bg-no-repeat"
                                            :style="{'background':'url('+carouselTrendingItems[0].image+')'}"
                                        />
                                    </div>
                                    <div class="h-[30%] w-full box-border">
                                        <div
                                            class="h-full w-full bg-cover bg-center bg-no-repeat grayscale opacity-20"
                                            :style="{'background':'url('+carouselTrendingItems[0].image+')'}"
                                        />
                                    </div>
                                </template>
                                <template v-slot:body="{frameBorderColor}">
                                    <div class="h-[30%] w-full p-2 overflow-hidden flex flex-col">
                                        <div class="overflow-auto space-y-4">
                                            <div class="text-lg font-medium font-header" v-text="carouselTrendingItems[0].subTitle"></div>
                                            <NuxtLink
                                                v-if="carouselTrendingItems[0].link"
                                                :to="carouselTrendingItems[0].link">
                                                <UnorderedList
                                                    class="cursor-pointer hover:underline"
                                                    :size="'sm'"
                                                    :label="'Read more'"/>
                                            </NuxtLink>
                                        </div>
                                    </div>
                                </template>
                            </HexagonFrame>
                        </Glint>
                    </div>
                </div>

                <div v-if="false" class="bg-cover bg-no-repeat bg-center p-4" :style="{'background-image': 'url(/images/carousel/f415740d-5951-4b5d-af98-1404e9c65df5.jpg'}">
                    <div class="w-full h-[230px] flex flex-nowrap gap-2 overflow-y-hidden">
                        <div class="w-[460px] h-full flex-none" v-for="item in leftToRightItems">
                            <HexagonFrame
                                :frame-border-gradient-enable="true"
                                :frame-border-primary-color="item.frameBorder"
                                :content-background="`#ffffff`"
                                :direction="'ltr'"
                                :theme="'light'"
                                :head-percentage="50"
                                :top-right="45"
                                :bottom-left="45"
                                :opaque="true"
                                :header-fade="false">
                                <template #header>
                                    <div class="h-full w-[50%]">
                                        <div
                                            class="h-full w-full bg-cover bg-center bg-no-repeat"
                                            :style="{'background':'url('+item.image.path+')'}"
                                        />
                                    </div>
                                    <div class="h-full w-[50%]">
                                        <div
                                            class="h-full w-full bg-cover bg-center bg-no-repeat opacity-10"
                                            :style="{'background':'url('+item.image.path+')'}"
                                        />
                                    </div>
                                </template>
                                <template v-slot:body="{frameBorderColor}">
                                    <div class="h-full w-[50%] p-4 overflow-hidden relative flex flex-col text[#5A5A5A]">

                                        <div class="overflow-auto space-y-0.5">
                                            <div class="font-data font-semibold h-max flex-none">
                                                <UnorderedList
                                                    class="cursor-pointer hover:underline"
                                                    :size="'md'"
                                                    :icon="item.listIcon"
                                                    :label="item.title"/>
                                            </div>

                                            <div style="height: 1px;width: 100%;background: linear-gradient(to right, transparent 0%, #e3e3e3 30%, #e3e3e3 70%, transparent 100%);"></div>

                                            <div v-if="item?.bullets?.value?.length" class="flex flex-row flex-nowrap">
                                                <div class="w-full" :style="{'columns': (item.bullets.column ? item.bullets.column : 1)}">
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
                                                class="text-base leading-5 line-clamp-3"
                                                :style="{'font-family': 'Source Sans Pro'}"
                                            ></div>

                                            <UnorderedList
                                                class="cursor-pointer hover:underline"
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

                <div v-if="false"  class="bg-cover bg-no-repeat bg-center p-4 bg-slate-400" :style="{'background-image': 'url(/images/deco/ripple_texture.png'}">
                    <div class="w-full h-[350px] flex flex-nowrap gap-2 overflow-y-hidden">
                        <div class="w-[250px] h-full flex-none" v-for="featuredItem in carouselTrendingItems" :key="featuredItem">
                            <HexagonFrame
                                :frame-border-gradient-enable="true"
                                :frame-border-primary-color="'#d3dae7'"
                                :content-background="`#ffffff`"
                                :direction="'ttb'"
                                :theme="'light'"
                                :head-percentage="70"
                                :top-right="45"
                                :bottom-left="45"
                                :opaque="true"
                                :header-fade="true"
                                :header-fade-color="'rgba(5,5,5,0.1)'">
                                <template #header>
                                    <div class="h-[70%] w-full p-[6px] box-border">
                                        <div
                                            class="h-full w-full bg-cover bg-center bg-no-repeat"
                                            :style="{'background':'url('+featuredItem.image+')'}"
                                        />
                                    </div>
                                    <div class="h-[30%] w-full box-border">
                                        <div
                                            class="h-full w-full bg-cover bg-center bg-no-repeat grayscale opacity-20"
                                            :style="{'background':'url('+featuredItem.image+')'}"
                                        />
                                    </div>
                                </template>
                                <template #body>
                                    <div class="h-[30%] w-full p-2 overflow-hidden flex flex-col">

                                        <div class="overflow-auto space-y-2">

                                            <div class="font-semibold h-max flex-none" style="text-align: left;">
                                                <div class="text-lg font-medium font-header" v-text="featuredItem.subTitle"></div>

                                                <NuxtLink
                                                    v-if="featuredItem.link"
                                                    :to="featuredItem.link">
                                                    <UnorderedList
                                                        class="cursor-pointer hover:underline font-data"
                                                        :size="'md'"
                                                        :label="'Read more'"/>
                                                </NuxtLink>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </HexagonFrame>
                        </div>
                    </div>
                </div>

                <div v-if="false" class="mt-6 mx-auto">
                    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <div
                            v-for="item in topToBottomItems" class="h-[520px]">
                            <HexagonFrame
                                :frame-border-gradient-enable="true"
                                :frame-border-primary-color="item.frameBorderPrimary"
                                :frame-border-secondary-color="item.frameBorderSecondary"
                                :frame-border-width="`2px`"
                                :theme="item.theme"
                                :direction="'ttb'"
                                :head-percentage="70"
                                :top-right="65"
                                :bottom-left="50"
                                :header-fade="false">
                                <template #header>
                                    <div class="h-[60%] w-full">
                                        <div
                                            class="h-full w-full bg-cover bg-center bg-no-repeat"
                                            :style="{'background':'url('+item.image.path+')'}"
                                        />
                                    </div>
                                    <div class="h-[40%] w-full bg-black">
                                        <div
                                            class="h-full w-full bg-cover bg-center bg-no-repeat opacity-90 blur-2xl"
                                            :style="{'background':'url('+item.image.path+')'}"
                                        />
                                    </div>
                                </template>
                                <template #body>
                                    <div style="text-shadow: rgb(0, 0, 0) 1px 1px 2px;" class="h-[40%] w-full p-4 overflow-hidden relative flex flex-col">

                                        <div class="overflow-auto space-y-2 font-standard">

                                            <div class="h-max flex-none">
                                                <UnorderedList
                                                    class="font-medium font-header cursor-pointer hover:underline"
                                                    :size="'lg'"
                                                    :icon="item.listIcon"
                                                    :label="item.title"/>
                                            </div>

                                            <div style="height: 1px;width: 100%;background: linear-gradient(to right, transparent 0%, #e3e3e3 30%, #e3e3e3 70%, transparent 100%);"></div>

                                            <div v-if="item?.bullets?.value?.length" class="flex flex-row flex-nowrap">
                                                <div class="w-full" :style="{'columns': (item.bullets.column ? item.bullets.column : 1)}">
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
                                                class="text-sm leading-5 line-clamp-4"
                                            ></div>

                                            <UnorderedList
                                                class="cursor-pointer hover:underline"
                                                :size="'sm'"
                                                :label="'Read more'"/>
                                        </div>
                                    </div>
                                </template>
                            </HexagonFrame>
                        </div>
                    </div>
                </div>

                <div v-if="false" class="ml-20 rounded-md hover:cursor-pointer w-[244px] h-[48px]"
                     style="background: linear-gradient(to right, rgb(156, 112, 164), rgb(40, 39, 82));position: relative;">
                    <div style="width: 100%;height: 100%;position: absolute;background-size: cover;opacity: 0.2;background-image: url('/images/deco/ripple_texture.png');"></div>
                    <div class="flex gap-2 items-center rounded-md" style="text-shadow: rgba(0, 0, 0, 0.5) 0px 2px 8px;">
                        <div
                            class="flex w-[48px] h-[48px] items-center justify-center rounded-l-md"
                            style="background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));">
                            <img
                                src="https://dota2protracker.com/static/facet_icons/mana.png"
                                class="w-6 h-6"
                                style="filter: drop-shadow(rgba(0, 0, 0, 0.3) 0px 3px 2px);">
                        </div>
                        <div class="flex pr-2 font-medium justify-center text-xl text-white uppercase whitespace-nowrap">
                            Satyr Convert
                        </div>
                    </div>
                </div>

                <span :style="boxStyle" ref="animateMe" class="section-navigation thread-border absolute">ANIMATE</span>

                <br>

                <div v-if="false" class="space-x-2 mb-2 gap-2">
                    <div class="inline-block">
                        <Button class="" :justify-content="'start'" :label="'Toggle Icon Grid'" :variant="'outline'" :size="'md'" :glint="true" @click="tabGroup.show_icon_grid = !tabGroup.show_icon_grid"></Button>
                    </div>

                    <div class="inline-block">
                        <Button class="" :justify-content="'center'" :active-border="'red'" :label="'Show from Top'" :variant="'flat'" :size="'md'" :glint="true" @click="topPosition = 50"></Button>
                    </div>

                    <div class="inline-block">
                        <Button class="" :justify-content="'end'" :label="'Hide to Top'" :size="'md'" :glint="true" @click="topPosition = 0"></Button>
                    </div>
                </div>

                <div v-if="false" class="grid gap-2 grid-cols-3">
                    <div></div>
                    <div class="space-y-1 relative border">
                        <div v-if="tabGroup.show_icon_grid" class="absolute w-[0.2px] top-0 bottom-0 bg-slate-400 z-50" :class="[tabGroupIconGrid.left]"></div>
                        <div v-if="tabGroup.show_icon_grid" class="absolute w-[0.2px] top-[-0.25rem] bottom-0 bg-slate-400 z-50" :class="[tabGroupIconGrid.right]"></div>

                        <!-- Selects -->
                        <MultiSelect :glint="true" always-active :selection-float="false" :drop-shadow="false" :selection-max-viewable-line="5" :size="tabGroup.size" :options="category" :icon="tabGroup.icon"/>
                        <SingleSelect :glint="true" drop-shadow :selection-max-viewable-line="4" :always-active="false" :size="tabGroup.size" :icon="tabGroup.icon" :options="plan"/>
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
                            :size="tabGroup.size"
                            :payload="multiSelectPrototypePayload"
                            :icon="tabGroup.icon"/>
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
                            :size="tabGroup.size"
                            :payload="singleSelectPrototypePayload"
                            :icon="tabGroup.icon"/>

                        <!-- Input -->
                        <Input :glint="tabGroup.glint" :placeholder="'Enter value'" :size="tabGroup.size" type="text" autocomplete="off" />

                        <!-- Input with icon -->
                        <InputWithIcon
                            :glint="tabGroup.glint"
                            ref="inputValue"
                            :size="tabGroup.size"
                            :icon="tabGroup.icon"
                            :placeholder="'Enter value'"
                            autocomplete="off" />
                        <InputWithIcon
                            :glint="tabGroup.glint"
                            :icon="tabGroup.icon"
                            :size="tabGroup.size"
                            autocomplete="off"
                            readonly
                            :disabled="false" />

                        <!-- Button with icon, label -->
                        <Button :glint="true" class="w-full" :size="tabGroup.size" :icon="tabGroup.icon" :variant="'default'" :label="'Button'" />
                        <Button :glint="true" class="w-3/4"  :size="tabGroup.size" :icon="tabGroup.icon" :variant="'flat'" :label="'Button'" />
                        <Button :glint="true" class="w-1/2"  :size="tabGroup.size" :icon="tabGroup.icon" :variant="'outline'" :label="'Button'" />

                        <!-- Button with icon, no label -->
                        <Button :glint="true" class="w-full" :size="tabGroup.size" :icon="tabGroup.icon" :variant="'default'" :label="''" />
                        <Button :glint="true" class="w-3/4"  :size="tabGroup.size" :icon="tabGroup.icon" :variant="'flat'" :label="''" />
                        <Button :glint="true" class="w-1/2"  :size="tabGroup.size" :icon="tabGroup.icon" :variant="'outline'" :label="''" />

                        <!-- Button with icon, no label, minimum width -->
                        <div class="w-min"><Button :glint="true" :size="tabGroup.size" :icon="tabGroup.icon" :variant="'default'" :label="''" /></div>
                        <div class="w-min"><Button :glint="true" :size="tabGroup.size" :icon="tabGroup.icon" :variant="'outline'" :label="''" /></div>
                        <div class="w-min"><Button :glint="true" :size="tabGroup.size" :icon="tabGroup.icon" :variant="'flat'" :label="''" /></div>
                    </div>
                    <div></div>
                </div>

                <!-- Static Single, MultiSelect and DateTime, Date, and Month Picker -->
                <div v-if="false" class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6">
                    <div class="block neutral-border">
                        <InputLabel :size="'lg'" value="Static Multi Select" />
                        <MultiSelect :glint="true" drop-shadow :selection-max-viewable-line="5" :size="'lg'" :options="category" :icon="'ic:sharp-qr-code'"/>
                    </div>
                    <div class="block neutral-border">
                        <InputLabel :size="'lg'" value="Static Single Select" />
                        <SingleSelect :glint="true" drop-shadow :selection-max-viewable-line="4" :always-active="false" :size="'lg'" :icon="'emojione-monotone:japanese-no-vacancy-button'" :options="plan"/>
                    </div>
                    <div class="block neutral-border">
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
                    <div class="block neutral-border">
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
                    <div class="block neutral-border">
                        <InputLabel :size="'lg'" value="Number" />
                        <InputWithIcon
                            @focusStateChanged="handleFocusStateChanged"
                            :placeholder="'Enter value'"
                            ref="searchInputWithIcon"
                            :icon="'ion:ios-circle-outline'"
                            :size="'lg'"
                            :type="'text'"
                            :disabled="false"
                            :glint="true" />
                    </div>
                    <div class="block neutral-border">
                        <InputLabel :size="'lg'" value="Input" />
                        <Input
                            @focusStateChanged="handleFocusStateChanged"
                            :placeholder="'Enter value'"
                            ref="searchInput"
                            :size="'lg'"
                            type="text"
                            autocomplete="off"
                            :glint="true" />
                    </div>
                </div>

                <!-- Paginated Single and MultiSelect -->
                <div v-if="false" class="mt-6 grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    <div class="block neutral-border">
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
                    <div class="block neutral-border">
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
// definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid', 'Lab.vue');
// const {screenWidthBreakpoint, width: screenWidth, height: screenHeight} = useScreen();
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
    [screenWidthBreakpoint['sm']]: {
        itemsToShow: 2,
        snapAlign: 'start',
    },

    [screenWidthBreakpoint['md']]: {
        itemsToShow: 2.5,
        snapAlign: 'start',
    },

    [screenWidthBreakpoint['lg']]: {
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
const featured = ref(dataPayload['featured'])[2];

function handleFocusStateChanged(event){
    console.log({"handleFocusStateChanged": event})
}

let searchInput = ref(null);
let searchInputWithIcon = ref(null);

let tabGroup = reactive({
    'icon' : 'ic:sharp-check-box-outline-blank',
    'size' : 'lg',
    'show_icon_grid': false,
    'glint': false,
});
const tabGroupIconGrid = computed(() => {
    return {
        '2xs': {'left': 'ml-[0.35rem]', 'right' : 'ml-[1.1rem]'},
        'xs': {'left': 'ml-[0.40rem]', 'right' : 'ml-[1.35rem]'},
        'sm': {'left': 'ml-[0.65rem]', 'right' : 'ml-[1.6rem]'},
        'md': {'left': 'ml-[0.65rem]', 'right' : 'ml-[1.6rem]'},
        'lg': {'left': 'ml-[0.95rem]', 'right' : 'ml-[2.59rem]'},
        'xl': {'left': 'ml-[0.95rem]', 'right' : 'ml-[2.72rem]'},
        '2xl': {'left': 'ml-[1.3rem]', 'right' : 'ml-[3.7rem]'},
    }[tabGroup.size];
});

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
        //searchInputWithIcon.value?.$refs.input.focus();
    });
});

//Render date time pickers on load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            render(dateTimePickers.value);
            //searchInputWithIcon?.value.$refs.input.focus();
        });
    }
})
</script>

<style scoped lang="scss">
.section-navigation {
    transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: top 200ms;
}

.link{
    display: block;
    width: 200px;
    padding: 12px 30px;
    text-decoration: none;
    border: 2px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(45deg, #7d7d7f 20%, #fefdfd, #3d3d3e 70%, #fefdfd, #7d7d7f 100%);
    transition: all 1s cubic-bezier(0.645, 0.045, 0.355, 1);
    -webkit-transition: all 1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.link span{
    font-weight: 600;
    text-transform: uppercase;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
}
</style>