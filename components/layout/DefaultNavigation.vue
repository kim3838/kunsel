<template>
    <nav
        ref="navigation"
        class="primary-navigation-parent z-40 fixed">
        <div class="w-full font-sans flex justify-center">
            <div class="max-w-screen-2xl w-full flex justify-end">
                <NavLink
                    class="h-full"
                    :size="`xs`">
                    News
                </NavLink>
                <NavLink
                    class="h-full"
                    :size="`xs`">
                    FAQ
                </NavLink>
                <NavLink
                    class="h-full"
                    :size="`xs`">
                    Support
                </NavLink>
                <NavDrop
                    v-if="true"
                    :size="`xs`"
                    :title="'Language'"
                    :drop-options="[
                        {
                            type: 'action',
                            title: 'en',
                            callback: () => {},
                        },
                    ]" />
            </div>
        </div>
        <div class="w-full font-data flex justify-center neutral-border-top">
            <div class="max-w-screen-2xl w-full flex justify-start lg:justify-around h-10">
                <div class="-my-px flex items-center">
                    <NavDrop
                        class="xl:hidden  h-full"
                        :size="navigationHeaderSize"
                        :title="'Menu'"
                        :drop-options="navigationLinks" />
                </div>
                <div class="flex">
                    <!-- Navigation Links -->
                    <div class="-my-px hidden xl:flex">
                        <span class="flex items-center"  v-for="navigation in navigationLinks" :key="navigation.title">
                            <NavLink
                                class="h-full"
                                v-if="navigation.type == 'link'"
                                :size="navigationHeaderSize"
                                :to="navigation.to"
                                :icon="navigation.icon"
                                :active="$isRouteActive(navigation.route)">
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
import {storeToRefs} from 'pinia';
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
    setNavigationHeight,
    rightNavigationDropAlign
} = useLayout();

const {$themeStore} = useNuxtApp();

const {
    neutral: neutralColor,
} = storeToRefs($themeStore);

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

.neutral-border-top{
    border-top: 1px solid v-bind(neutralColor);
}
</style>