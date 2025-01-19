<template>
    <nav
        ref="landingNavigation"
        class="primary-navigation-parent tw-z-40 tw-fixed">
        <div class="tw-w-full tw-font-stiff tw-flex tw-justify-center">
            <div class="tw-max-w-screen-2xl tw-w-full tw-flex tw-justify-start lg:tw-justify-around tw-h-10 lg:tw-h-16">
                <div class="tw--my-px tw-flex tw-items-center">
                    <div class="tw-w-max tw-h-full tw-flex tw-items-center">
                        <GlobalFoundries :dark="navigationMode === 'clear-with-background'" />
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
        </div>
    </nav>
</template>

<script setup lang="ts">
const clientReadyState = useClientReadyState();
const {$isRouteActive} = useNuxtApp();
const {isAuthenticated, user} = useAuth();
const {width: screenWidth} = useScreen();
const navDrop = resolveComponent('navDrop');
const navigationHeightInPixelsModel = defineModel('navigationHeightInPixels');
const landingNavigation = ref(null);
const {
    navigationLinks,
    navigationAccountLinks,
    navigationBackground,
    navigationHeaderSize,
    navigationHeightInPixels,
    navigationMode,
    topAllocationInPixels,
    spotlightContentHeight,
    setNavigationHeight,
    rightNavigationDropAlign
} = useLayout();

onMounted(async () => {
    await nextTick(() => {
        let navigationHeight = landingNavigation.value?.offsetHeight;
        if(landingNavigation.value !== null &&  navigationHeight !== undefined){
            setNavigationHeight(navigationHeight);
            navigationHeightInPixelsModel.value = navigationHeightInPixels.value;
        }
    });
});

watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            let navigationHeight = landingNavigation.value?.offsetHeight;
            if(landingNavigation.value !== null &&  navigationHeight !== undefined){
                setNavigationHeight(navigationHeight);
                navigationHeightInPixelsModel.value = navigationHeightInPixels.value;
            }
        });
    }
})

watch(screenWidth, value => {
    setNavigationHeight(landingNavigation.value.offsetHeight);
    navigationHeightInPixelsModel.value = navigationHeightInPixels.value;
});
</script>

<style scoped>
.primary-navigation-parent {
    background-color: v-bind(navigationBackground) !important;
    left: 0;
    right: 5px;
    z-index: 30;
}
</style>