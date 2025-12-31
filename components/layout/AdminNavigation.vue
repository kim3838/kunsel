<template>
    <nav
        ref="navigation"
        class="primary-navigation-parent z-40 fixed">
        <div class="relative z-[42] w-full flex justify-center font-[Inclusive_Sans]">
            <div class="max-w-screen-2xl w-full flex gap-1 justify-end h-5">
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
                <div v-if="false && user?.timezone" class=" text-sm h-full flex items-center gap-1 cursor-pointer accent-hover">
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
            <div class="max-w-screen-2xl w-full flex justify-start md:justify-between" :class="mainNavigationHeightClass">
                <div class="flex">
                    <!-- Navigation Links -->
                    <div class="flex">
                        <!-- Subscribed module selection -->
                        <SingleSelect
                            v-if="isAuthenticated"
                            drop-shadow
                            :searchable="false"
                            :always-active="false"
                            value-persist
                            disable-header-border
                            navigation-mode
                            :icon="'ic:sharp-double-arrow'"
                            :size="navigationHeaderSize"
                            :label="'Select Module'"
                            :none-selected-label="'No Associated Subscription'"
                            :key="$associationStore.associatedAccountSubscriptionSelectionKey"
                            :options="$authStore.accountSubscriptions.singleSelectPayload"
                            :override="associatedSubscriptionSelectOverrides"
                            @valueChange="selectedAssociatedAccountSubscriptionChanged"
                        />
                    </div>
                    <div class="mx-1 flex justify-center items-center">
                        <div class="horizontal-divider"></div>
                    </div>
                    <div class="flex">
                        <NavDrop
                            v-if="!isMainNavigationLastItemVisible"
                            :size="navigationHeaderSize"
                            :title="'Menu'"
                            :drop-options="navigationLinks" />
                    </div>
                    <div class="hidden sm:flex flex-wrap overflow-hidden" ref="mainNavigation">
                        <div
                            class="flex"
                            :class="[mainNavigationHeightClass]"
                            v-for="(navigation, index) in navigationLinks"
                            :key="navigation.key">

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
                                :drop-align="navigation.drop_align"
                                :active="isRoutePathActive(navigation.path_active)"
                                @update-sub-navigation-options="updateSubNavigationOptions"
                            />
                        </div>
                    </div>
                </div>
                <div class="flex">
                    <div class="flex" v-for="navigation in adminNavigationLinks" :key="navigation.key">
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
                            :drop-align="navigation.drop_align"
                            :active="isRoutePathActive(navigation.path_active)"
                            @update-sub-navigation-options="updateSubNavigationOptions"
                        />
                    </div>
                    <component
                        :is="navDrop"
                        v-if="isAuthenticated"
                        :size="navigationHeaderSize"
                        :drop-align="rightNavigationDropAlign"
                        :title="username"
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
        <div
            v-show="subNavigationOptions.length"
            class="mt-2 relative w-full flex justify-center"
            :class="subNavigationFontClass">
            <div
                ref="subNavigationRef"
                tabindex="0"
                class="max-w-screen-2xl w-full flex flex-wrap gap-y-2 justify-start focus:outline-none"
                :class="[subNavigationOptions.length ? '' : '', subNavigationDropAlignComputed]">
                <span
                    class="flex"
                    :class="[subNavigationHeightClass]"
                    v-for="navigation in subNavigationOptions"
                    :key="navigation.key">
                    <NavLink
                        class="h-full"
                        v-if="navigation.type == 'link'"
                        :size="subNavigationHeaderSize"
                        :to="navigation.to"
                        :icon="navigation.icon"
                        :active-style="`ripple`"
                        :active="isRouteActive(navigation.route_active) || isRoutePathActive(navigation.path_active)">
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

const {selectedAssociatedAccountSubscriptionChanged} = useAssociation();
const clientReadyState = useClientReadyState();
const nuxtApp = useNuxtApp();
const isRouteActive = nuxtApp.$isRouteActive as (name: string | undefined) => boolean;
const isRoutePathActive = nuxtApp.$isRoutePathActive as (path: string | undefined) => boolean;
const wordClamp = nuxtApp.$wordClamp as (text: string, length: number) => string;

const {isAuthenticated, user} = useAuth();
const username = computed(() => {
    return screenWidth.value > screenWidthBreakpoint['md']
        ? user.value?.name
        : wordClamp(user.value?.name as string, 6);
});
const {width: screenWidth, screenWidthBreakpoint} = useScreen();
const navDrop = resolveComponent('navDrop');
const navigationHeightModel = defineModel('navigationHeight');
const navigation = useTemplateRef('navigation');
const mainNavigation = useTemplateRef('mainNavigation');
const mainNavigationLastItem = ref<HTMLElement | null>(null)
const isMainNavigationLastItemVisible = useElementVisibility(mainNavigationLastItem, {
    threshold: 0.1
});
const subNavigationRef = useTemplateRef('subNavigationRef');
const { focused: subNavigationFocused } = useFocusWithin (subNavigationRef);
const { height: navigationReferenceHeight} = useElementSize(navigation);
const {$themeStore, $layoutStore} = useNuxtApp();
const {
    neutral: neutralColor,
} = storeToRefs($themeStore);
const {
    subNavigationDropAlign,
    subNavigationOptions,
} = storeToRefs($layoutStore);
const {
    navigationLinks,
    adminNavigationLinks,
    activeSubNavigationLink,
    navigationAccountLinks,
    navigationBackground,
    navigationHeight,
    setNavigationHeight,
    rightNavigationDropAlign
} = useLayout();

const updateSubNavigationOptions = (subNavigationPayload: {
    drop_align: string,
    options: NavigationLinkInterface[]
}) => {
    $layoutStore.setSubNavigationDropAlign(subNavigationPayload.drop_align);
    $layoutStore.setSubNavigationOptions(subNavigationPayload.options);

    subNavigationRef?.value?.focus();
}

const subNavigationDropAlignComputed = computed(() => {

    let rightDropAligned = subNavigationDropAlign.value == 'right';
    let screenWidthLteMedium = screenWidth.value >= screenWidthBreakpoint['md'];

    return rightDropAligned && screenWidthLteMedium ? 'flex-row-reverse' : 'flex-row'
});

watch(subNavigationFocused, (focused) => {

    const activeSubNavigationDropAlign = _get(activeSubNavigationLink.value, 'drop_align', 'left');
    const activeSubNavigationLinkOptions = _get(activeSubNavigationLink.value, 'options', []);

    if(focused){

    } else {
        $layoutStore.setSubNavigationDropAlign(activeSubNavigationDropAlign);
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

    const mainNavigationReference = mainNavigation.value

    mainNavigationLastItem.value = (!mainNavigationReference) ? null : mainNavigationReference.lastElementChild as HTMLElement
});

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

const associatedSubscriptionSelectOverrides = computed(() => {
    return {
        'height': 'h-full',
        'font_family_class': mainNavigationFontClass.value
    };
})
</script>

<style lang="scss" scoped>
.primary-navigation-parent {
    background-color: v-bind(navigationBackground) !important;
    left: 0;
    right: var(--scrollbar-width);
}
</style>