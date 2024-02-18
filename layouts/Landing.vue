<template>
    <div id="layoutScroll" ref="snapScroll" class="tw-relative tw-scroll-smooth tw-h-screen tw-max-h-screen" :class="[enableScrollSnap ? 'tw-overflow-y-scroll tw-overflow-x-hidden tw-snap-y tw-snap-mandatory' : 'tw-overflow-auto tw-snap-none']">
        <!-- Primary Navigation Menu -->
        <nav
            ref="landingNavigation"
            :class="[enableScrollSnap ? 'tw-snap-start tw-snap-always' : '']"
            class="primary-navigation-parent tw-transition-all tw-duration-700 tw-z-40 tw-fixed tw-flex tw-justify-center">
            <div class="tw-max-w-screen-2xl tw-w-full tw-flex tw-justify-start lg:tw-justify-around tw-h-10 lg:tw-h-20">
                <div class="tw--my-px tw-flex tw-items-center">
                    <div v-if="['index'].includes(_toLower(route.name))" class="tw-w-max tw-block tw-h-full tw-w-full tw-flex tw-items-center">
                        <Colorful :dark="navigationMode === 'clear'" />
                    </div>
                    <NavDrop
                        class="lg:tw-hidden tw-h-full"
                        :size="navigationHeaderSize"
                        :title="'Menu'"
                        :drop-options="navigationLinks" />
                </div>
                <div class="tw-flex">
                    <!-- Navigation Links -->
                    <div class="tw--my-px tw-hidden lg:tw-flex">
                        <span class="tw-flex tw-items-center"  v-for="navigation in navigationLinks" :key="navigation.title">
                            <NavLink
                                class="tw-h-full"
                                v-if="navigation.type == 'link'"
                                :size="navigationHeaderSize"
                                :to="navigation.to"
                                :active="$isRouteActive(navigation.route)">
                                {{navigation.title}}
                            </NavLink>

                            <a
                                class="tw-h-full"
                                v-if="navigation.type == 'anchor-link'"
                                :href="navigation.to">
                                <NavLink
                                    class="tw-h-full"
                                    :size="navigationHeaderSize">
                                    {{navigation.title}}
                                </NavLink>
                            </a>

                            <NavDrop
                                class="tw-h-full"
                                v-if="navigation.type === 'drop'"
                                :size="navigationHeaderSize"
                                :title="navigation.title"
                                :drop-options="navigation.options"
                            />
                        </span>
                    </div>
                </div>
                <div class="tw--my-px tw-flex tw-items-center">
                    <component
                        :is="navDrop"
                        class="tw-h-full"
                        v-if="isAuthenticated"
                        :size="navigationHeaderSize"
                        :drop-align="rightNavigationDropAlign"
                        :title="user?.name"
                        :drop-options="navigationAccountLinks"
                    />
                </div>
            </div>
        </nav>
        <!-- Main Content -->
        <main class="tw-transition-all tw-duration-300 allocate-navigation">
            <slot name="content"/>
        </main>
        <!-- DateTime Picker -->
        <div id="datetimepicker-slot"></div>
        <!-- Action Modal -->
        <PromptModal />
        <!-- Footer -->
        <footer :class="[enableScrollSnap ? 'tw-snap-start tw-snap-always' : '']">
            <div class="tw-mx-auto tw-max-w-screen-xl tw-px-4 tw-pb-6 tw-pt-16 sm:tw-px-6 lg:tw-px-8">
                <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-4">
                    <div>
                        <div class="tw-flex tw-justify-center sm:tw-justify-start">
                            <Colorful class="tw-w-max tw-h-[62px]"/>
                        </div>

                        <p v-if="false" class="tw-mt-5 tw-text-center tw-leading-relaxed sm:tw-max-w-md sm:tw-text-left">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt
                            consequuntur amet culpa cum itaque neque.
                        </p>

                        <ul v-if="false" class="tw-mt-2 tw-flex tw-justify-center tw-gap-6 sm:tw-justify-start md:gap-8">
                            <li>
                                <a href="/" rel="noreferrer" target="_blank">
                                    <ClientOnly><Icon class="tw-h-5 tw-w-5" name="mdi:facebook"></Icon></ClientOnly>
                                </a>
                            </li>
                            <li>
                                <a href="/" rel="noreferrer" target="_blank">
                                    <ClientOnly><Icon class="tw-h-5 tw-w-5" name="mdi:instagram"></Icon></ClientOnly>
                                </a>
                            </li>
                            <li>
                                <a href="/" rel="noreferrer" target="_blank">
                                    <ClientOnly><Icon class="tw-h-5 tw-w-5" name="mdi:youtube"></Icon></ClientOnly>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="tw-grid tw-grid-cols-1 tw-gap-2 tw-mt-8 lg:tw-mt-0 sm:tw-grid-cols-2 md:tw-grid-cols-5 lg:tw-col-span-3">
                        <div class="tw-text-center sm:tw-text-left md:tw-col-span-2">
                            <p class="tw-text-lg tw-font-medium tw-font-['Roboto']">Contact Us</p>

                            <div class="tw-mt-8 tw-space-y-2">
                                <UnorderedList
                                    class="tw-flex sm:tw-justify-start tw-justify-center"
                                    :size="'md'"
                                    :icon="'ic:round-mail-outline'"
                                    :label="'info@colorful-technology.com'"/>

                                <UnorderedList
                                    class="tw-flex sm:tw-justify-start tw-justify-center"
                                    :size="'md'"
                                    :icon="'ic:sharp-phone'"
                                    :label="'+63 99-1999-1991'"/>

                                <UnorderedList
                                    class="tw-flex sm:tw-justify-start tw-justify-center"
                                    :size="'md'"
                                    :icon="'ic:sharp-location-on'"
                                    :label="'Quezon City, Metro Manila, Philippines'"/>
                            </div>
                        </div>

                        <div class="tw-text-center tw-mt-12 sm:tw-text-left sm:tw-mt-0">
                            <p class="tw-text-lg tw-font-medium tw-font-['Roboto']">Our Services</p>

                            <div class="tw-mt-8 tw-space-y-2">

                                <UnorderedList
                                    class="tw-flex sm:tw-justify-start tw-justify-center"
                                    :size="'md'"
                                    :label="'Custom Web Applications'"/>
                                <UnorderedList
                                    class="tw-flex sm:tw-justify-start tw-justify-center"
                                    :size="'md'"
                                    :label="'Mobile Applications'"/>
                                <UnorderedList
                                    class="tw-flex sm:tw-justify-start tw-justify-center"
                                    :size="'md'"
                                    :label="'Product Landing Page'"/>
                                <UnorderedList
                                    class="tw-flex sm:tw-justify-start tw-justify-center"
                                    :size="'md'"
                                    :label="'E-Commerce Site'"/>
                            </div>
                        </div>

                        <div class="tw-text-center tw-mt-12 sm:tw-text-left md:tw-mt-0">
                            <p class="tw-text-lg tw-font-medium tw-font-['Roboto']">Helpful Links</p>

                            <div class="tw-mt-8 tw-space-y-2">

                                <UnorderedList
                                    class="tw-flex sm:tw-justify-start tw-justify-center"
                                    :size="'md'"
                                    :icon="'ri:info-i'"
                                    :label="'FAQs'"/>
                                <UnorderedList
                                    class="tw-flex sm:tw-justify-start tw-justify-center"
                                    :size="'md'"
                                    :icon="'ri:info-i'"
                                    :label="'Support'"/>
                                <UnorderedList
                                    class="tw-flex sm:tw-justify-start tw-justify-center tw-overflow-visible"
                                    :icon="'ri:info-i'"
                                    :size="'md'">
                                    <div class="tw-flex">
                                        <span class="tw-transition group-hover:tw-text-gray-700/75">
                                            Live Chat
                                        </span>
                                        <span class="tw-ml-1 tw-relative tw-flex tw-h-2 tw-w-2">
                                            <span class="tw-absolute tw-inline-flex tw-h-full tw-w-full tw-animate-ping tw-rounded-full ping-highlight tw-opacity-75"></span>
                                            <span class="tw-relative tw-inline-flex tw-h-2 tw-w-2 tw-rounded-full ping"></span>
                                        </span>
                                    </div>
                                </UnorderedList>
                            </div>
                        </div>

                        <div class="tw-text-center tw-mt-12 sm:tw-text-left md:tw-mt-0">
                            <p class="tw-text-lg tw-font-medium tw-font-['Roboto']">About Us</p>

                            <div class="tw-mt-8 tw-space-y-2 tw-text-sm">

                                <UnorderedList
                                    class="tw-flex sm:tw-justify-start tw-justify-center"
                                    :size="'md'"
                                    :icon="'ri:info-i'"
                                    :label="'Company History'"/>
                                <UnorderedList
                                    class="tw-flex sm:tw-justify-start tw-justify-center"
                                    :size="'md'"
                                    :icon="'ri:info-i'"
                                    :label="'Meet the Team'"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer-rule tw-mt-2"></div>

                <div class="tw-pt-2 tw-mt-2">
                    <div class="tw-text-center sm:tw-flex sm:tw-justify-between sm:tw-text-left">
                        <p class="tw-text-sm">
                            <span class="tw-block sm:tw-inline">All rights reserved.</span>
                            <a class="tw-inline-block tw-underline" href="/">
                                Terms & Conditions
                            </a>
                            <span>&middot;</span>
                            <a class="tw-inline-block tw-underline" href="/">
                                Privacy Policy
                            </a>
                        </p>
                        <p class="tw-mt-4 tw-text-sm tw-flex tw-items-center tw-justify-center sm:tw-justify-start sm:tw-order-first sm:tw-mt-0">
                            <ClientOnly><Icon name="ic:sharp-copyright"></Icon></ClientOnly>2024
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useScroll} from '@vueuse/core';

const route = useRoute();
const {$themeStore, $isRouteActive} = useNuxtApp();
const {isAuthenticated, user, logout} = useAuth();
const {
    enableScrollSnap,
    navigationLinks,
    navigationAccountLinks,
    navigationMode,
    navigationHeight,
    navigationBackground,
    navigationHeaderSize,
    navigationHeightInPixels,
    topAllocationInPixels,
    spotlightContentHeight,
    setNavigationHeight,
    setNavigationMode,
    rightNavigationDropAlign
} = useLayout();
const {screens, width: screenWidth, height: screenHeight } = useScreen();
const navDrop = resolveComponent('navDrop');
const {
    primary: primaryColor,
    accent: accentColor,
    neutral: neutralColor,
    tint: tintColor,
    thread: threadColor
} = storeToRefs($themeStore);

const landingNavigation = ref(null);

onMounted(async () => {
    await nextTick(() => {
        setNavigationHeight(landingNavigation.value.offsetHeight);
    });
});

watch(screenWidth, value => {
    setNavigationHeight(landingNavigation.value.offsetHeight);
});

const snapScroll = ref<HTMLElement | null>(null)
const {y: snapYScroll,arrivedState: snapScrollArrivedState } = useScroll(snapScroll)
const {top: snapScrollTopReached} = toRefs(snapScrollArrivedState);

watch(snapYScroll, (yScroll) => {
    if(yScroll <= ((screenHeight.value * 1) - navigationHeight.value) && ['index'].includes(_toLower(route.name))){
        setNavigationMode('clear');
    } else {
        setNavigationMode('solid');
    }
});
</script>
<style scoped>
.primary-navigation-parent {
    background-color: v-bind(navigationBackground) !important;
    left: 0;
    right: 5px;
    z-index: 30;
}

.allocate-navigation {
    padding-top: v-bind(topAllocationInPixels);
}

.ping{
    background-color: v-bind(primaryColor);
}

.ping-highlight{
    background-color: v-bind(accentColor);
}

.footer-rule{
    height: 1px;
    width: 100%;
    background: linear-gradient(
        to right,
        transparent 0%,
        v-bind(threadColor) 10%,
        transparent 50%,
        v-bind(threadColor) 90%,
        transparent 100%
    );
}
</style>
<style>
/*Used by snap scroll: to allocate space on fixed top navigation*/
.navigation-height{
    height: v-bind(navigationHeightInPixels);
}
.spotlight-content-height{
    max-height: v-bind(spotlightContentHeight);
}
</style>