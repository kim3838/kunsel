<template>
    <div id="layoutScroll" ref="layoutScroll" class="tw-relative tw-scroll-smooth tw-h-screen tw-max-h-screen tw-overflow-auto">
        <!-- Primary Navigation Menu -->
        <nav
            ref="navigation"
            class="primary-navigation-parent tw-transition-all tw-duration-700 tw-z-40 tw-fixed tw-flex tw-justify-center">
            <div class="tw-max-w-screen-2xl tw-w-full tw-flex tw-justify-start lg:tw-justify-around tw-h-10">
                <div class="tw--my-px tw-flex tw-items-center">
                    <div v-if="['index'].includes(_toLower(route.name))" class="tw-w-max tw-block tw-h-full tw-w-full tw-flex tw-items-center">
                        <Colorful :dark="navigationMode === 'clear'" />
                    </div>
                    <NavDrop
                        class="lg:tw-hidden tw-h-full"
                        :size="navigationHeaderSize"
                        :title="'Menu'"
                        :drop-options="menuOptions" />
                </div>
                <div class="tw-flex">
                    <!-- Navigation Links -->
                    <div class="tw--my-px tw-hidden lg:tw-flex">
                        <span class="tw-flex tw-items-center"  v-for="navigation in mainNavigation" :key="navigation.title">
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
                        :drop-options="accountOptions"
                    />
                </div>
            </div>
        </nav>
        <!-- Main Content -->
        <main class="tw-transition-all tw-duration-300 allocate-navigation">
            <slot/>
        </main>
        <!-- DateTime Picker -->
        <div id="datetimepicker-slot"></div>
        <!-- Action Modal -->
        <PromptModal />
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useScroll} from '@vueuse/core';

const route = useRoute();
const {$themeStore, $isRouteActive} = useNuxtApp();
const {isAuthenticated, user, logout} = useAuth();
const {screens, width: screenWidth, height: screenHeight } = useScreen();
const navDrop = resolveComponent('navDrop');

const {
    primary: primaryColor,
    neutral: neutralColor,
    tint: tintColor,
    thread: threadColor
} = storeToRefs($themeStore);
const {
    navigationMode,
    navigationBackground,
    topAllocationInPixels,
    setNavigationHeight,
    rightNavigationDropAlign
} = useLayout();

const navigation = ref(null);

onMounted(async () => {
    await nextTick(() => {
        setNavigationHeight(navigation.value.offsetHeight);
    });
});

watch(screenWidth, value => {
    setNavigationHeight(navigation.value.offsetHeight);
});

const layoutScroll = ref<HTMLElement | null>(null)
const {x: layoutXScroll,y: layoutYScroll,arrivedState: layoutScrollArrivedState } = useScroll(layoutScroll)
const {top: layoutScrollTopReached} = toRefs(layoutScrollArrivedState);

const navigationHeaderSize = computed(() => {
    let size = 'sm'

    return size;
});
const mainNavigation = computed(()=>{
    let options: object[] = [];

    options = options.concat([
        {
            type: 'link',
            title: 'Home',
            to: '/',
            route: 'index'
        },
        {
            type: 'link',
            title: 'Lab',
            to: '/lab',
            route: 'lab'
        },
        {
            type: 'link',
            title: 'Prototype',
            to: '/prototype',
            route: 'prototype'
        },
        {
            type: 'link',
            title: 'Prototypes',
            to: '/prototypes',
            route: 'prototypes'
        },
        {
            type: 'drop',
            title: 'Help',
            icon: 'ic:baseline-arrow-right',
            options: [
                {
                    type: 'anchor-link',
                    title: 'FAQ',
                    icon: 'ic:baseline-arrow-right',
                    to: '/#faq'
                },
                {
                    type: 'link',
                    title: 'Support',
                    icon: 'ic:baseline-arrow-right',
                },
                {
                    type: 'link',
                    title: 'Live Chat',
                    icon: 'ic:baseline-arrow-right',
                },
            ]
        }
    ]);

    if(!isAuthenticated.value){
        options = options.concat([{
            type: 'drop',
            title: 'Account',
            options: accountOptions.value
        },]);
    }

    return options;
});
const accountOptions = computed(() => {
    let options: object[] = [];

    if(isAuthenticated.value){
        options = options.concat([
            {
                type: 'link',
                title: 'Account Settings',
                icon: 'eos-icons:rotating-gear',
                to: '/profile',
            },
            {
                type: 'action',
                title: 'Logout',
                callback: () => {
                    logout();
                },
            },
            {
                type: 'action',
                title: 'Test Post',
                icon: 'material-symbols:request-quote-sharp',
                callback: async () => {
                    await csrFetch("/api/test-post", {
                        method: 'POST',
                    }, {
                        onResponse: (request, response, options) => {
                            console.log({'CSR POST RESPONSE' : response._data.code});
                        }
                    });
                },
            }
        ]);
    } else {
        options.unshift({
            type: 'link',
            title: 'Login',
            to: '/login',
        });
    }

    options.push({
        type: 'link',
        title: 'Shop',
        icon: 'ic:sharp-shop',
        to: '',
    });

    return options;
});
const menuOptions = computed(() => {
    let options: object[] = [];

    options = options.concat(mainNavigation.value);

    options = options.concat([]);

    return options;
});

</script>
<style scoped>
.primary-navigation-parent {
    background-color: v-bind(navigationBackground) !important;
    left: 0;
    right: 5px;
    z-index: 30;
}

.allocate-navigation {
    padding-top: v-bind(topAllocationInPixels);
}
</style>