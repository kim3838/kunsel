<template>
    <div
        v-if="clientReadyState"
        id="layoutScroll"
        class="tw-relative tw-scroll-smooth tw-h-screen tw-max-h-screen tw-overflow-auto">
        <!-- Primary Navigation Menu -->
        <nav
            ref="navigation"
            class="primary-navigation-parent tw-z-40 tw-fixed tw-flex tw-justify-center">
            <div class="tw-max-w-screen-2xl tw-w-full tw-flex tw-justify-start lg:tw-justify-around tw-h-10">
                <div class="tw--my-px tw-flex tw-items-center">
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
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useScroll} from '@vueuse/core';
const clientReadyState = useClientReadyState();

const routeTo = useRouteTo();
const {$themeStore, $isRouteActive} = useNuxtApp();
const {isAuthenticated, user, logout} = useAuth();
const {screens, width: screenWidth, height: screenHeight } = useScreen();
const navDrop = resolveComponent('navDrop');

const {
    primary: primaryColor,
    body: bodyColor,
    neutral: neutralColor,
    tint: tintColor,
    thread: threadColor
} = storeToRefs($themeStore);
const {
    navigationLinks,
    navigationAccountLinks,
    topAllocationInPixels,
    setNavigationHeight,
    rightNavigationDropAlign
} = useLayout();

const navigation = ref(null);

onMounted(async () => {
    console.log({'DefaultWrapper.vue': 'Mounted'});
    await nextTick(() => {
        let navigationHeight = navigation.value?.offsetHeight;
        console.log({'Await NextTick Default navigationHeight':navigationHeight});
        if(navigation.value !== null &&  navigationHeight !== undefined){
            setNavigationHeight(navigationHeight);
        }
    });
});

watch(clientReadyState, async (clientReady) => {
    console.log({'DefaultWrapper.vue Watch clientReadyState':clientReady});
    if(clientReady){
        await nextTick(() => {
            let navigationHeight = navigation.value?.offsetHeight;
            console.log({'Await NextTick Default.vue navigationHeight':navigationHeight});
            if(navigation.value !== null &&  navigationHeight !== undefined){
                setNavigationHeight(navigationHeight);
            }
        });
    }
})

watch(screenWidth, value => {
    console.log({'setNavigationHeight':navigation.value.offsetHeight});

    setNavigationHeight(navigation.value.offsetHeight);
});

const navigationHeaderSize = computed(() => {
    return 'sm';
});
</script>
<style scoped>
.primary-navigation-parent {
    background-color: v-bind(bodyColor) !important;
    left: 0;
    right: 5px;
    z-index: 30;
}

.allocate-navigation {
    padding-top: v-bind(topAllocationInPixels);
}
</style>