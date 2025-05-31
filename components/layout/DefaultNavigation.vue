<template>
    <nav
        ref="navigation"
        class="primary-navigation-parent z-40 fixed">
        <div class="relative z-[42] w-full flex justify-center font-[Inclusive_Sans]">
            <div class="max-w-screen-2xl w-full flex justify-end h-5 scaffold-border-left-right">
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
        <div class="relative z-[41] w-full flex justify-center" :class="mainNavigationFontClass">
            <div class="max-w-screen-2xl w-full flex justify-start lg:justify-between scaffold-border" :class="mainNavigationHeightClass">
                <div class="flex">
                    <!-- Navigation Links -->
                    <div class="flex">
                        <NavDrop
                            class="lg:hidden  h-full"
                            :size="navigationHeaderSize"
                            :title="'Menu'"
                            :drop-options="navigationLinks" />
                    </div>
                    <div class="hidden lg:flex">
                        <span class="flex" v-for="navigation in navigationLinks" :key="navigation.key">
                            <NavLink
                                class="h-full"
                                v-if="navigation.type == 'link'"
                                :size="navigationHeaderSize"
                                :to="navigation.to"
                                :icon="navigation.icon"
                                :active-style="`ripple`"
                                :active="isRouteActive(navigation.route_active)">
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
                            <NavSub
                                class="h-full"
                                v-if="navigation.type === 'sub-nav'"
                                :size="navigationHeaderSize"
                                :title="navigation.title"
                                :icon="navigation.icon"
                                :drop-options="navigation.options"
                                :active="isRoutePathActive(navigation.path_active)"
                                @update-sub-navigation-options="updateSubNavigationOptions"
                            />
                        </span>
                    </div>
                </div>
                <div class="flex">
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
        <!-- Sub Navigation -->
        <div v-show="subNavigationOptions.length" class="relative w-full flex justify-center" :class="subNavigationFontClass">
            <div ref="subNavigationRef" tabindex="0" class="max-w-screen-2xl w-full flex justify-start focus:outline-none" :class="[subNavigationOptions.length ? 'scaffold-border-left-bottom-right' : '']">
                <span class="flex" :class="subNavigationHeightClass" v-for="navigation in subNavigationOptions" :key="navigation.key">
                    <NavLink
                        class="h-full"
                        v-if="navigation.type == 'link'"
                        :size="subNavigationHeaderSize"
                        :to="navigation.to"
                        :icon="navigation.icon"
                        :active-style="`ripple`"
                        :active="isRouteActive(navigation.route_active)">
                        {{navigation.title}}
                    </NavLink>

                    <a
                        class="h-full"
                        v-if="navigation.type == 'anchor-link'"
                        :href="navigation.to">
                        <NavLink
                            class="h-full"
                            :icon="navigation.icon"
                            :size="subNavigationHeaderSize">
                            {{navigation.title}}
                        </NavLink>
                    </a>

                    <NavDrop
                        class="h-full"
                        v-if="navigation.type === 'drop'"
                        :size="subNavigationHeaderSize"
                        :title="navigation.title"
                        :icon="navigation.icon"
                        :drop-options="navigation.options"
                    />
                </span>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
import type {NavigationLinkInterface} from "@/public/js/types/layout";

const {updateStoredAssociatedCompany} = useAssociation();
const clientReadyState = useClientReadyState();
const nuxtApp = useNuxtApp();
const isRouteActive = nuxtApp.$isRouteActive as (name: string | undefined) => boolean;
const isRoutePathActive = nuxtApp.$isRoutePathActive as (path: string | undefined) => boolean;

const {isAuthenticated, user} = useAuth();
const {width: screenWidth} = useScreen();
const navDrop = resolveComponent('navDrop');
const navigationHeightInPixelsModel = defineModel('navigationHeightInPixels');
const navigation = useTemplateRef('navigation');
const subNavigationRef = useTemplateRef('subNavigationRef');
const { focused: subNavigationFocused } = useFocusWithin (subNavigationRef);
const { height: navigationHeight} = useElementSize(navigation);
const {$themeStore, $layoutStore} = useNuxtApp();
const {
    neutral: neutralColor,
} = storeToRefs($themeStore);
const {
    subNavigationOptions
} = storeToRefs($layoutStore);
const {
    navigationLinks,
    activeSubNavigationLink,
    navigationAccountLinks,
    navigationBackground,
    navigationHeightInPixels,
    setNavigationHeight,
    rightNavigationDropAlign
} = useLayout();

const updateSubNavigationOptions = (options: NavigationLinkInterface[]) => {
    $layoutStore.setSubNavigationOptions(options);

    subNavigationRef?.value?.focus();
}

watch(subNavigationFocused, (focused) => {

    const activeSubNavigationLinkOptions = _get(activeSubNavigationLink.value, 'options', []);

    if(!focused){
        $layoutStore.setSubNavigationOptions(activeSubNavigationLinkOptions);
    }
});

watch(navigationHeight, (newNavigationHeight) => {
    setNavigationHeight(navigationHeight.value);
    navigationHeightInPixelsModel.value = navigationHeightInPixels.value;
});

onMounted(async () => {
    setNavigationHeight(navigationHeight.value);
    navigationHeightInPixelsModel.value = navigationHeightInPixels.value;
});

watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        setNavigationHeight(navigationHeight.value);
        navigationHeightInPixelsModel.value = navigationHeightInPixels.value;
    }
})

watch(screenWidth, value => {
    setNavigationHeight(navigationHeight.value);
});

const navigationHeaderSize = computed(() => {
    return 'sm';
});
const subNavigationHeaderSize = computed(() => {
    return 'xs';
});

const mainNavigationHeightClass = computed(() => {
    return {
        '2xs': 'h-5',
        'xs': 'h-6',
        'sm': 'h-7',
        'md': 'h-8',
        'lg': 'h-11'
    }['md'];
});

const subNavigationHeightClass = computed(() => {
    return {
        '2xs': 'h-5',
        'xs': 'h-6',
        'sm': 'h-7',
        'md': 'h-8',
        'lg': 'h-11'
    }['xs'];
});

const mainNavigationFontClass = computed(() => {
    return 'font-business';
});
const subNavigationFontClass = computed(() => {
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