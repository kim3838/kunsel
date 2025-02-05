<template>
    <nav
        ref="landingNavigation"
        class="primary-navigation-parent z-40 fixed">
        <div class="w-full font-stiff flex justify-center">
            <div class="max-w-screen-2xl w-full flex justify-start lg:justify-around h-10 lg:h-16">
                <div class="-my-px flex items-center">
                    <div class="w-max h-full flex items-center">
                        <GlobalFoundries :dark="navigationMode === 'clear-with-background'" />
                    </div>
                    <NavDrop
                        class="lg:hidden h-full"
                        :size="navigationHeaderSize"
                        :title="'Menu'"
                        :drop-options="navigationLinks" />
                </div>

                <div class="flex">
                    <!-- Navigation Links -->
                    <div class="-my-px hidden lg:flex">
                    <span class="flex items-center"  v-for="navigation in navigationLinks" :key="navigation.title">
                        <NavLink
                            class="h-full"
                            v-if="navigation.type == 'link'"
                            :size="navigationHeaderSize"
                            :to="navigation.to"
                            :active="$isRouteActive(navigation.route)">
                            {{navigation.title}}
                        </NavLink>

                        <a
                            class="h-full"
                            v-if="navigation.type == 'anchor-link'"
                            :href="navigation.to">
                            <NavLink
                                class="h-full"
                                :size="navigationHeaderSize">
                                {{navigation.title}}
                            </NavLink>
                        </a>

                        <NavDrop
                            class="h-full"
                            v-if="navigation.type === 'drop'"
                            :size="navigationHeaderSize"
                            :title="navigation.title"
                            :drop-options="navigation.options"
                        />
                    </span>
                    </div>
                </div>
                <div class="-my-px flex items-center">
                    <component
                        :is="navDrop"
                        class="h-full"
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