<template>
    <nav
        ref="landingNavigation"
        class="primary-navigation-parent z-40 fixed">
        <div class="w-full font-business flex justify-center">
            <div class="max-w-screen-2xl w-full flex justify-start lg:justify-around h-10 lg:h-16">
                <div class="flex">
                    <NavDrop
                        class="lg:hidden"
                        :size="navigationHeaderSize"
                        :title="'Menu'"
                        :drop-options="navigationLinks" />
                </div>

                <div class="flex">
                    <!-- Navigation Links -->
                    <div class="hidden lg:flex">
                        <span class="flex"  v-for="navigation in navigationLinks" :key="navigation.key">
                            <NavLink
                                v-if="navigation.type == 'link'"
                                :size="navigationHeaderSize"
                                :to="navigation.to"
                                :icon="navigation.icon"
                                :active="isRouteActive(navigation.route_active)">
                                {{navigation.title}}
                            </NavLink>

                            <a
                                v-if="navigation.type == 'anchor-link'"
                                :href="navigation.to"
                                class="w-full h-full flex">
                                <NavLink
                                    :icon="navigation.icon"
                                    :size="navigationHeaderSize">
                                    {{navigation.title}}
                                </NavLink>
                            </a>

                            <NavDrop
                                v-if="navigation.type === 'drop'"
                                :size="navigationHeaderSize"
                                :title="navigation.title"
                                :icon="navigation.icon"
                                :drop-options="navigation.options"
                            />
                        </span>
                    </div>
                </div>
                <div class="flex">
                    <component
                        :is="navDrop"
                        v-if="isAuthenticated"
                        :size="navigationHeaderSize"
                        :drop-align="rightNavigationDropAlign"
                        :title="user?.name"
                        :drop-options="navigationAccountLinks"
                    />
                    <NavDrop
                        v-else
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
const isRouteActive = nuxtApp.$isRouteActive as (name: string | undefined) => boolean;
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
    right: var(--scrollbar-width);
    z-index: 30;
}
</style>