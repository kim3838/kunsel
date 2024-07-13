<template>
    <div>
        <LandingWrapper>
            <div class="tw-mx-auto tw-max-w-screen-2xl tw-pt-4">
                <div v-if="false" class="tw-flex tw-mb-4">
                    <SampleEmitter
                        v-model:[dynamicFoo].capitalizeEveryWord ="fooComputed"
                        v-model:[dynamicBarCaller].capitalize="barComputed"
                        class="tw-w-[250px]"
                    />
                </div>

                <div v-if="false" class="tw-mb-4 tw-relative tw-w-[370px] tw-h-[530px]">
                    <InformationCard
                        :image="'/images/spotlight/1697501586302.jpg'"
                        :title="'FORGE YOUR FUTURE'"
                        :sub-title="'New Z790 motherboards from ROG pave the way for 14th Gen Intel Core CPUs'"
                        :body-color="''"
                        :fade-color="''"
                        :inner-border="'silver'"
                        :outer-border="'gray'"
                    />
                </div>

                <a v-if="false" class="hub-card" href="https://www.callofduty.com/blackcell" style="width: 400px; height: 200px; background-color: #ececec;">
                    <span class="glint"></span>
                    <span class="glint"></span>
                    <span class="glint"></span>
                    <span class="glint"></span>
                </a>

                <div v-if="false" class="tw-w-[170px] tw-h-[230px] tw-mb-4">
                    <!-- Todo: make hexagon frame individual lines -->
                    <HexagonFrame>
                        <template #body>
                            <div class="tw-relative tw-h-full tw-flex tw-items-center tw-px-4 tw-text-center tw-font-['Google_Sans_Text'] tw-text-xl tw-font-semibold tw-px-8">
                                Hexagon Frame Without Corner
                            </div>
                        </template>
                    </HexagonFrame>
                </div>

                <div v-if="true" class="tw-grid tw-gap-4 tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-3">
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

                <div v-if="true" class="tw-mt-6 tw-mx-auto tw-w-11/12">
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

            </div>
        </LandingWrapper>
    </div>
</template>

<script setup lang="ts">
import dataPayload from '@/public/data/payload.js';
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid', 'Lab.vue');

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

</script>

<style scoped lang="scss">

</style>