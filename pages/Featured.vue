<template>
    <div
        v-if="clientReadyState"
        id="layoutScroll"
        ref="layoutScroll"
        class="tw-h-screen tw-max-h-screen tw-overflow-y-scroll tw-overflow-x-hidden">
        <!-- Primary Navigation Menu -->
        <nav
            ref="landingNavigation"
            class="primary-navigation-parent tw-z-40 tw-fixed tw-flex tw-justify-center tw-font-['IBM_Plex_Sans_Condensed']">
            <div class="tw-max-w-screen-2xl tw-w-full tw-flex tw-justify-start lg:tw-justify-around tw-h-10 lg:tw-h-20">
                <div class="tw--my-px tw-flex tw-items-center">
                    <div class="tw-w-max tw-block tw-h-full tw-w-full tw-flex tw-items-center">
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
        <main class="tw-transition-all tw-duration-300">
            <section id="section1">
                {{layoutScrollY}}&nbsp;:&nbsp;1
            </section>
            <section id="section2">
                {{layoutScrollY}}&nbsp;:&nbsp;2
            </section>
            <section id="section3">
                {{layoutScrollY}}&nbsp;:&nbsp;3
            </section>
            <section id="section4">
                {{layoutScrollY}}&nbsp;:&nbsp;4
            </section>
        </main>
        <!-- DateTime Picker -->
        <div id="datetimepicker-slot"></div>
        <!-- Action Modal -->
        <PromptModal />
    </div>
</template>

<script setup lang="ts">
useLayout().setNavigationMode('clear', 'index.vue');
const clientReadyState = useClientReadyState();

import {storeToRefs} from 'pinia';
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
    //console.log({'SnapLandingWrapper.vue': 'Mounted'});
    await nextTick(() => {
        let navigationHeight = landingNavigation.value?.offsetHeight;
        //console.log({'Await NextTick SnapLandingWrapper navigationHeight':navigationHeight});
        if(landingNavigation.value !== null &&  navigationHeight !== undefined){
            setNavigationHeight(navigationHeight);
        }
    });
});

watch(clientReadyState, async (clientReady) => {
    //console.log({'SnapLandingWrapper.vue Watch clientReadyState':clientReady});
    if(clientReady){
        await nextTick(() => {
            let navigationHeight = landingNavigation.value?.offsetHeight;
            //console.log({'Await NextTick SnapLandingWrapper.vue navigationHeight':navigationHeight});
            if(landingNavigation.value !== null &&  navigationHeight !== undefined){
                setNavigationHeight(navigationHeight);
            }
        });
    }
})

//On navigate
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(()=>{
            bootFullPageScroll("ON NAVIGATE");
        });
    })
}

//On page load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            bootFullPageScroll("ON PAGE LOAD");
        });
    }
});

let sections = null
let scrolling = false;
let proximityThreshold = 0;
let scrollSpeed = 200;
const layoutScroll = ref<HTMLElement | null>(null)
const { y: layoutScrollY } = useScroll(layoutScroll)
function bootFullPageScroll(caller){
    sections = document.querySelectorAll('section');
    proximityThreshold = layoutScroll.value.offsetHeight / 2;

    layoutScroll.value.removeEventListener('wheel', handleMouseWheel, { passive: false });
    layoutScroll.value.addEventListener('wheel', handleMouseWheel, { passive: false });
}

function handleMouseWheel(event){
    if(!isDesktop() || scrolling){
        return false;
    }

    scrolling = true;
    event.preventDefault();
    // Normalize wheel delta
    const delta = Math.max(-1, Math.min(1, event.deltaY));
    // Calculate scroll amount
    const scrollAmount = layoutScrollY.value + layoutScroll.value.offsetHeight * delta;
    // Scroll to the calculated amount with easing
    smoothScroll(scrollAmount, scrollSpeed, easeInOutCubic);
}

function easeInOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
}

function snapToSection() {
    for (const section of sections) {
        const sectionTop = section.offsetTop;
        const distance = Math.abs(layoutScrollY.value - sectionTop);

        if (distance < proximityThreshold) {
            smoothScroll(sectionTop, scrollSpeed * 0.25, easeInOutCubic, true);
            scrolling = false;
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

            if(!snap){
                snapToSection();
            }
        }
    }

    requestAnimationFrame(scroll);
}

watch(screenWidth, value => {
    setNavigationHeight(landingNavigation.value.offsetHeight);
});
</script>
<style scoped>
.primary-navigation-parent {
    background-color: v-bind(navigationBackground) !important;
    left: 0;
    right: 5px;
    z-index: 30;
}
section {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
}
</style>