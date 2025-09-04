<template>
    <nav
        ref="navigation"
        class="primary-navigation-parent z-40 fixed">
        <div class="relative z-[42] w-full flex justify-center font-[Inclusive_Sans]">
            <div class="max-w-screen-2xl w-full flex justify-end h-5">
                <NavLink
                    class="h-full cursor-pointer hover:underline"
                    :size="`xs`">
                    News
                </NavLink>
                <NavLink
                    class="h-full cursor-pointer hover:underline"
                    :size="`xs`">
                    FAQ
                </NavLink>
                <NavLink
                    class="h-full cursor-pointer hover:underline"
                    :size="`xs`">
                    Support
                </NavLink>
                <div v-if="user?.timezone" class=" text-sm h-full flex items-center gap-1 cursor-pointer accent-hover">
                    <Icon size="0.75rem" :name="'file-icons:moment-timezone'"/>
                    <div>{{user?.timezone}}</div>
                </div>
                <NavDrop
                    v-if="true"
                    :size="`xs`"
                    :title="'Language'"
                    :icon="'material-symbols:language-chinese-array'"
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
            <div class="max-w-screen-2xl w-full flex justify-start lg:justify-between" :class="mainNavigationHeightClass">
                <div class="flex">
                    <!-- Navigation Links -->
                    <div class="flex">
                        <NavDrop
                            class="lg:hidden"
                            :size="navigationHeaderSize"
                            :title="'Menu'"
                            :drop-options="navigationLinks" />
                    </div>
                    <div class="hidden lg:flex">
                        <span class="flex" v-for="navigation in navigationLinks" :key="navigation.key">
                            <NavLink
                                v-if="navigation.type == 'link'"
                                :size="navigationHeaderSize"
                                :to="navigation.to"
                                :icon="navigation.icon"
                                :active-style="`ripple`"
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
                            <NavSub
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
        <!-- Sub Navigation -->
        <div v-show="subNavigationOptions.length" class="mt-2 relative w-full flex justify-center" :class="subNavigationFontClass">
            <div ref="subNavigationRef" tabindex="0" class="max-w-screen-2xl w-full flex flex-wrap gap-y-2 justify-start focus:outline-none" :class="[subNavigationOptions.length ? '' : '']">
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
                        v-if="navigation.type == 'anchor-link'"
                        :href="navigation.to"
                        class="w-full h-full flex">
                        <NavLink
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
                        :drop-active-style="`ripple`"
                    />
                </span>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
import type {NavigationLinkInterface} from "@/public/js/types/layout";

const clientReadyState = useClientReadyState();
const nuxtApp = useNuxtApp();
const isRouteActive = nuxtApp.$isRouteActive as (name: string | undefined) => boolean;
const isRoutePathActive = nuxtApp.$isRoutePathActive as (path: string | undefined) => boolean;

const {isAuthenticated, user} = useAuth();
const {width: screenWidth} = useScreen();
const navDrop = resolveComponent('navDrop');
const navigationHeightModel = defineModel('navigationHeight');
const navigation = useTemplateRef('navigation');
const subNavigationRef = useTemplateRef('subNavigationRef');
const { focused: subNavigationFocused } = useFocusWithin (subNavigationRef);
const { height: navigationReferenceHeight} = useElementSize(navigation);
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
    navigationHeight,
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

watch(navigationReferenceHeight, (newNavigationHeight) => {
    setNavigationHeight(navigationReferenceHeight.value);
    navigationHeightModel.value = navigationHeight.value;
});

onMounted(async () => {
    setNavigationHeight(navigationReferenceHeight.value);
    navigationHeightModel.value = navigationHeight.value;
});

watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        setNavigationHeight(navigationReferenceHeight.value);
        navigationHeightModel.value = navigationHeight.value;
    }
})

watch(screenWidth, value => {
    setNavigationHeight(navigationReferenceHeight.value);
});

const navigationHeaderSize = computed(() => {
    return 'md';
});
const subNavigationHeaderSize = computed(() => {
    return 'sm';
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
</script>

<style lang="scss" scoped>
.primary-navigation-parent {
    background-color: v-bind(navigationBackground) !important;
    left: 0;
    right: $scrollBarWidth;
}
</style>