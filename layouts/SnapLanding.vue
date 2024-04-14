<template>
    <div
        v-if="clientReadyState"
        id="layoutScroll"
        ref="snapScroll"
        class="tw-relative tw-scroll-smooth tw-h-screen tw-max-h-screen"
        :class="[enableScrollSnap ? 'tw-overflow-y-scroll tw-overflow-x-hidden tw-snap-y tw-snap-mandatory' : 'tw-overflow-auto tw-snap-none']">
        <!-- Primary Navigation Menu -->
        <nav
            ref="landingNavigation"
            :class="[enableScrollSnap ? 'tw-snap-start tw-snap-always' : '']"
            class="primary-navigation-parent tw-z-40 tw-fixed tw-flex tw-justify-center">
            <div class="tw-max-w-screen-2xl tw-w-full tw-flex tw-justify-start lg:tw-justify-around tw-h-10 lg:tw-h-20">
                <div class="tw--my-px tw-flex tw-items-center">
                    <div v-if="['index'].includes(routeTo.name)" class="tw-w-max tw-block tw-h-full tw-w-full tw-flex tw-items-center">
                        <KettleFoods :dark="navigationMode === 'clear'" />
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
            <slot></slot>
        </main>
        <!-- DateTime Picker -->
        <div id="datetimepicker-slot"></div>
        <!-- Action Modal -->
        <PromptModal />
        <!-- Footer -->
        <LandingFooter/>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useScroll} from '@vueuse/core';
const clientReadyState = useClientReadyState();

const routeTo = useRouteTo();
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
    console.log({'SnapLanding.vue': 'Mounted'});
    await nextTick(() => {
        let navigationHeight = landingNavigation.value?.offsetHeight;
        console.log({'Await NextTick SnapLanding navigationHeight':navigationHeight});
        if(landingNavigation.value !== null &&  navigationHeight !== undefined){
            setNavigationHeight(navigationHeight);
        }
    });
});

watch(clientReadyState, async (clientReady) => {
    console.log({'SnapLanding.vue Watch clientReadyState':clientReady});
    if(clientReady){
        await nextTick(() => {
            let navigationHeight = landingNavigation.value?.offsetHeight;
            console.log({'Await NextTick SnapLanding.vue navigationHeight':navigationHeight});
            if(landingNavigation.value !== null &&  navigationHeight !== undefined){
                setNavigationHeight(navigationHeight);
            }
        });
    }
})

watch(screenWidth, value => {
    setNavigationHeight(landingNavigation.value.offsetHeight);
});

const snapScroll = ref<HTMLElement | null>(null)
const {y: snapYScroll,arrivedState: snapScrollArrivedState } = useScroll(snapScroll)

watch(snapYScroll, (yScroll) => {
    //Todo: do setNavigationMode only once in 1 second
    if(!['index'].includes(routeTo.value.name)) return false;

    if(yScroll <= ((screenHeight.value * 2) - navigationHeight.value)){
        //console.log({yScroll:yScroll});
        setNavigationMode('clear');
    } else {
        //console.log({yScroll:yScroll});
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