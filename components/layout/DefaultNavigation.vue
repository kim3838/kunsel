<template>
    <nav
        ref="navigation"
        class="primary-navigation-parent z-40 fixed">
        <div class="relative z-[42] w-full flex justify-center"  :class="mainNavigationFontClass">
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
        <div class="relative z-[41] w-full flex justify-center neutral-border-top-bottom" :class="mainNavigationFontClass">
            <div class="max-w-screen-2xl w-full flex justify-start px-[20px] lg:px-0 lg:justify-around" :class="mainNavigationHeightClass">
                <div class="flex items-center">
                    <NavDrop
                        class="xl:hidden  h-full"
                        :size="navigationHeaderSize"
                        :title="'Menu'"
                        :drop-options="navigationLinks" />
                </div>
                <div class="flex">
                    <!-- Navigation Links -->
                    <div class="hidden xl:flex">
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
                    <SingleSelect
                        v-if="isAuthenticated"
                        drop-shadow
                        :searchable="false"
                        :always-active="false"
                        value-persist
                        disable-header-border
                        navigation-mode
                        :size="navigationHeaderSize"
                        :label="'Select Associated Company'"
                        :options="$authStore.associatedCompanies.singleSelectPayload"
                        :drop-align="rightNavigationDropAlign"
                        :override="associatedCompaniesSelectOverrides"
                        @valueChange = "updateStoredAssociatedCompany"
                    />
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

const {updateStoredAssociatedCompany} = useAssociation();
const clientReadyState = useClientReadyState();
const nuxtApp = useNuxtApp();
const isRouteActive = nuxtApp.$isRouteActive as (routeSlug: string | undefined) => boolean;

const {isAuthenticated, user} = useAuth();
const {width: screenWidth} = useScreen();
const navDrop = resolveComponent('navDrop');
const navigationHeightInPixelsModel = defineModel('navigationHeightInPixels');
const navigation = ref<HTMLElement | null>(null);
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
    if (navigation.value) {
        setNavigationHeight(navigation.value.offsetHeight);
    }
});

const navigationHeaderSize = computed(() => {
    return 'sm';
});

const mainNavigationHeightClass = computed(() => {
    return {
        '2xs': 'h-5',
        'xs': 'h-6',
        'sm': 'h-7',
        'md': 'h-8',
        'lg': 'h-11'
    }['lg'];
});

const mainNavigationFontClass = computed(() => {
    return 'font-business';
});

const associatedCompaniesSelectOverrides = computed(() => {
    return {
        'height': mainNavigationHeightClass.value,
        'font_family': mainNavigationFontClass.value
    };
})

</script>

<style lang="scss" scoped>
.primary-navigation-parent {
    background-color: v-bind(navigationBackground) !important;
    left: 0;
    right: $scrollBarWidth;
}
</style>