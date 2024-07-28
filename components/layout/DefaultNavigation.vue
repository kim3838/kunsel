<template>
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
</template>

<script setup lang="ts">
const clientReadyState = useClientReadyState();
const {$isRouteActive} = useNuxtApp();
const {isAuthenticated, user} = useAuth();
const {width: screenWidth} = useScreen();
const navDrop = resolveComponent('navDrop');
const navigationHeightInPixelsModel = defineModel('navigationHeightInPixels');
const navigation = ref(null);
const {
    navigationLinks,
    navigationAccountLinks,
    navigationBackground,
    navigationHeightInPixels,
    topAllocationInPixels,
    spotlightContentHeight,
    setNavigationHeight,
    rightNavigationDropAlign
} = useLayout();

onMounted(async () => {
    //console.log({'DefaultNavigation.vue': 'Mounted'});
    await nextTick(() => {
        let navigationHeight = navigation.value?.offsetHeight;
        //console.log({'Await NextTick DefaultNavigation.vue navigationHeight':navigationHeight});
        if(navigation.value !== null &&  navigationHeight !== undefined){
            setNavigationHeight(navigationHeight);
            navigationHeightInPixelsModel.value = navigationHeightInPixels.value;
        }
    });
});

watch(clientReadyState, async (clientReady) => {
    //console.log({'DefaultNavigation.vue Watch clientReadyState':clientReady});
    if(clientReady){
        await nextTick(() => {
            let navigationHeight = navigation.value?.offsetHeight;
            //console.log({'Await NextTick DefaultNavigation.vue navigationHeight':navigationHeight});
            if(navigation.value !== null &&  navigationHeight !== undefined){
                setNavigationHeight(navigationHeight);
                navigationHeightInPixelsModel.value = navigationHeightInPixels.value;
            }
        });
    }
})

watch(screenWidth, value => {
    setNavigationHeight(navigation.value.offsetHeight);
});

const navigationHeaderSize = computed(() => {
    return 'sm';
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