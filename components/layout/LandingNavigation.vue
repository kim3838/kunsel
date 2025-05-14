<template>
    <nav
        ref="landingNavigation"
        class="primary-navigation-parent z-40 fixed">
        <div class="w-full font-business flex justify-center">
            <div class="max-w-screen-2xl w-full flex justify-start lg:justify-around h-10 lg:h-16">
                <div class="flex items-center">
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
                    <div class="hidden lg:flex">
                    <span class="flex items-center"  v-for="navigation in navigationLinks" :key="navigation.title">
                        <NavLink
                            class="h-full"
                            v-if="navigation.type == 'link'"
                            :size="navigationHeaderSize"
                            :to="navigation.to"
                            :icon="navigation.icon"
                            :active="isRouteActive(navigation.route)">
                            {{navigation.title}}
                        </NavLink>

                        <a
                            class="h-full"
                            v-if="navigation.type == 'anchor-link'"
                            :href="navigation.to">
                            <NavLink
                                class="h-full"
                                :icon="navigation.icon"
                                :size="navigationHeaderSize">
                                {{navigation.title}}
                            </NavLink>
                        </a>

                        <NavDrop
                            class="h-full"
                            v-if="navigation.type === 'drop'"
                            :size="navigationHeaderSize"
                            :title="navigation.title"
                            :icon="navigation.icon"
                            :drop-options="navigation.options"
                        />
                    </span>
                    </div>
                </div>
                <div class="flex items-center">
                    <component
                        :is="navDrop"
                        class="h-full"
                        v-if="isAuthenticated"
                        :size="navigationHeaderSize"
                        :drop-align="rightNavigationDropAlign"
                        :title="user?.name"
                        :drop-options="navigationAccountLinks"
                    />
                    <NavDrop
                        v-else
                        class="h-full"
                        :size="navigationHeaderSize"
                        :title="'Account'"
                        :drop-options="navigationAccountLinks"
                    />
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
const clientReadyState = useClientReadyState();
const nuxtApp = useNuxtApp();
const isRouteActive = nuxtApp.$isRouteActive as (routeSlug: string | undefined) => boolean;
const {isAuthenticated, user} = useAuth();
const {width: screenWidth} = useScreen();
const navDrop = resolveComponent('navDrop');
const navigationHeightInPixelsModel = defineModel('navigationHeightInPixels');
const landingNavigation = ref<HTMLElement | null>(null);
const {
    navigationLinks,
    navigationAccountLinks,
    navigationBackground,
    navigationHeaderSize,
    navigationHeightInPixels,
    navigationMode,
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
    if(landingNavigation.value){
        setNavigationHeight(landingNavigation.value.offsetHeight);
    }

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