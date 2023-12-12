<template>
    <div class="tw-relative">
        <!-- Primary Navigation Menu -->
        <nav ref="navigation" class="primary-navigation-parent tw-transition-all tw-duration-700 tw-z-40 tw-fixed" :class="{'lg:tw-ml-sidebar': false}">
            <div class="tw-max-w-screen-2xl tw-mx-auto tw-flex tw-justify-between tw-h-8 lg:tw-h-16">
                <div class="tw--my-px tw-flex tw-items-center">
                    <NavDrop
                        class="sm:tw-hidden tw-h-full"
                        :size="navigationHeaderSize"
                        :title="'Menu'"
                        :drop-options="menuOptions" />
                </div>
                <div class="tw-flex">
                    <!-- Navigation Links -->
                    <div class="tw--my-px tw-hidden sm:tw-flex">
                        <span class="tw-flex tw-items-center"  v-for="navigation in mainNavigation" :key="navigation.title">
                            <NavLink
                                class="tw-h-full "
                                v-if="navigation.type == 'link'"
                                :size="navigationHeaderSize"
                                :to="navigation.to"
                                :active="isRouteActive(navigation.route)">
                                {{navigation.title}}
                            </NavLink>

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
                        :drop-align="'right'"
                        :title="user?.name"
                        :drop-options="accountOptions"
                    />
                </div>
            </div>
        </nav>
        <!-- Main Content -->
        <main class="tw-relative tw-transition-all tw-duration-300 allocate-navigation">
            <slot name="content"/>
        </main>
        <!-- Action Modal -->
        <PromptModal />
        <!-- Footer -->
        <footer>
            <div class="tw-mx-auto tw-max-w-screen-2xl tw-px-4 tw-pb-6 tw-pt-16 sm:tw-px-6 lg:tw-px-8 lg:tw-pt-24">
                <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-4">
                    <div>
                        <div class="tw-flex tw-justify-center sm:tw-justify-start">
                            <SquareEnix :height="'calc(3.8rem - 1px)'"/>
                        </div>

                        <p class="tw-text-center tw-leading-relaxed sm:tw-max-w-md sm:tw-text-left">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt
                            consequuntur amet culpa cum itaque neque.
                        </p>

                        <ul class="tw-mt-2 tw-flex tw-justify-center tw-gap-6 sm:tw-justify-start md:gap-8">
                            <li>
                                <a href="/" rel="noreferrer" target="_blank">
                                    <ClientOnly><Icon class="tw-h-5 tw-w-5" name="mdi:facebook"></Icon></ClientOnly>
                                </a>
                            </li>
                            <li>
                                <a href="/" rel="noreferrer" target="_blank">
                                    <ClientOnly><Icon class="tw-h-5 tw-w-5" name="mdi:instagram"></Icon></ClientOnly>
                                </a>
                            </li>
                            <li>
                                <a href="/" rel="noreferrer" target="_blank">
                                    <ClientOnly><Icon class="tw-h-5 tw-w-5" name="mdi:youtube"></Icon></ClientOnly>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="tw-grid tw-grid-cols-1 tw-gap-8 tw-mt-8 lg:tw-mt-0 sm:tw-grid-cols-2 md:tw-grid-cols-5 lg:tw-col-span-3">
                        <div class="tw-text-center sm:tw-text-left md:tw-col-span-2 lg:tw-pl-14">
                            <p class="tw-text-lg tw-font-medium">Contact Us</p>

                            <ul class="tw-mt-8 tw-space-y-4 tw-text-sm">
                                <li>
                                    <span class="footer-link tw-flex tw-items-center tw-justify-center sm:tw-justify-start" href="/">
                                        <ClientOnly><Icon name="ic:round-mail-outline"></Icon></ClientOnly>
                                        <span class="tw-ml-1">mail@domain.com</span>
                                    </span>
                                </li>

                                <li>
                                    <span class="tw-flex tw-items-center tw-justify-center sm:tw-justify-start" href="/">
                                        <ClientOnly><Icon name="ic:sharp-phone"></Icon></ClientOnly>
                                        <span>+63 991 9991 991</span>
                                    </span>
                                </li>

                                <li class="tw-flex tw-items-start tw-justify-center sm:tw-justify-start">
                                    <ClientOnly><Icon name="ic:sharp-location-on"></Icon></ClientOnly>
                                    <address class="tw--mt-0.5 tw-not-italic">
                                        Manila, Philippines
                                    </address>
                                </li>
                            </ul>
                        </div>

                        <div class="tw-text-center sm:tw-text-left">
                            <p class="tw-text-lg tw-font-medium">Our Services</p>

                            <ul class="tw-mt-8 tw-space-y-4 tw-text-sm">
                                <li>
                                    <a class="footer-link tw-transition hover:tw-text-gray-700/75" href="/">Web Development</a>
                                </li>
                                <li>
                                    <a class="footer-link tw-transition hover:tw-text-gray-700/75" href="/">Web Design</a>
                                </li>
                            </ul>
                        </div>

                        <div class="tw-text-center sm:tw-text-left">
                            <p class="tw-text-lg tw-font-medium">Helpful Links</p>

                            <ul class="tw-mt-8 tw-space-y-4 tw-text-sm">
                                <li>
                                    <a class="footer-link tw-transition hover:tw-text-gray-700/75" href="/">FAQs</a>
                                </li>
                                <li>
                                    <a class="footer-link tw-transition hover:tw-text-gray-700/75" href="/">Support</a>
                                </li>

                                <li>
                                    <a class="footer-link tw-group tw-flex tw-justify-center tw-gap-1.5 sm:tw-justify-start" href="/">
                                        <span class="tw-transition group-hover:tw-text-gray-700/75">
                                            Live Chat
                                        </span>
                                        <span class="tw-relative tw-flex tw-h-2 tw-w-2">
                                            <span class="tw-absolute tw-inline-flex tw-h-full tw-w-full tw-animate-ping tw-rounded-full ping-highlight tw-opacity-75"></span>
                                            <span class="tw-relative tw-inline-flex tw-h-2 tw-w-2 tw-rounded-full ping"></span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div class="tw-text-center sm:tw-text-left">
                            <p class="tw-text-lg tw-font-medium">About Us</p>

                            <ul class="tw-mt-8 tw-space-y-4 tw-text-sm">
                                <li>
                                    <a class="footer-link tw-transition hover:tw-text-gray-700/75" href="/">Company History</a>
                                </li>

                                <li>
                                    <a class="footer-link tw-transition hover:tw-text-gray-700/75" href="/">Meet the Team</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="footer-rule tw-mt-2"></div>

                <div class="tw-pt-2 tw-mt-2">
                    <div class="tw-text-center sm:tw-flex sm:tw-justify-between sm:tw-text-left">
                        <p class="tw-text-sm">
                            <span class="tw-block sm:tw-inline">All rights reserved.</span>
                            <a class="tw-inline-block tw-underline" href="/">
                                Terms & Conditions
                            </a>
                            <span>&middot;</span>
                            <a class="tw-inline-block tw-underline" href="/">
                                Privacy Policy
                            </a>
                        </p>
                        <p class="tw-mt-4 tw-text-sm tw-flex tw-items-center tw-justify-center sm:tw-justify-start sm:tw-order-first sm:tw-mt-0">
                            <ClientOnly><Icon name="ic:sharp-copyright"></Icon></ClientOnly>2022 Lorem Ipsum
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import {useWindowScroll} from '@vueuse/core'
import {storeToRefs} from 'pinia';
import {computed, nextTick, onMounted, onUnmounted, ref} from "vue";

const navDrop = resolveComponent('navDrop');
const { y: windowYScroll } = useWindowScroll();

const {$coreStore, $themeStore} = useNuxtApp();
const {isAuthenticated, user, logout} = useAuth();
const route = useRoute();
const {screens, width: screenWidth, height: screenHeight } = useScreen();
const {
    primary: primaryColor,
    accent: accentColor,
    neutral: neutralColor,
    tint: tintColor,
    body: bodyColor,
    thread: threadColor
} = storeToRefs($themeStore);

const {
    navigationMode
} = storeToRefs($coreStore);

let navigation = ref(null);
let navigationHeight = ref(0);
onMounted(async () => {
    await nextTick(() => {
        navigationHeight.value = navigation.value.offsetHeight;
    });
});

watch(windowYScroll, value => {
    if(['index'].indexOf(_toLower(route.name)) >= 0){
        if(value > (screenHeight.value - navigationHeight.value)){
            $coreStore.setNavigationMode('solid');
        } else {
            $coreStore.setNavigationMode('clear');
        }
    }
});

let navigationHeaderSize = computed(() => {
    let size = 'lg'

    if (screenWidth.value >= screens['2xl']) {//3xl
        size = 'lg';
    } else if (screenWidth.value >= screens['xl'] && screenWidth.value < screens['2xl']) {//2xl
        size = 'lg';
    } else if (screenWidth.value >= screens['lg'] && screenWidth.value < screens['xl']) {//xl
        size = 'lg';
    } else if (screenWidth.value >= screens['md'] && screenWidth.value < screens['lg']) {//lg
        size = 'md';
    } else if (screenWidth.value >= screens['sm'] && screenWidth.value < screens['md']) {//md
        size = 'md';
    } else if (screenWidth.value < screens['sm']) {//sm
        size = 'md';
    }

    return size;
});
let mainNavigation = computed(()=>{
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
            title: 'Prototype',
            to: '/prototype',
            route: 'prototype'
        },
        {
            type: 'link',
            title: 'Lab',
            to: '/lab',
            route: 'lab'
        },
        {
            type: 'link',
            title: 'Login',
            to: '/login',
            route: 'login'
        },
        {
            type: 'link',
            title: 'Profile',
            to: '/profile',
            route: 'profile'
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
                    type: 'link',
                    title: 'FAQ',
                    icon: 'ic:baseline-arrow-right',
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
let accountOptions = computed(() => {
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
let menuOptions = computed(() => {
    let options: object[] = [];

    options = options.concat(mainNavigation.value);

    options = options.concat([]);

    return options;
});
let navigationBackground = computed(()=>{
    if(navigationMode.value === 'clear'){
        return 'transparent';
    }

    return bodyColor.value;
});
let topAllocation = computed(()=>{
    if(navigationMode.value === 'clear'){
        return '0px';
    }

    if(['index'].indexOf(_toLower(route.name)) >= 0){
        return '0px';
    }

    return (navigationHeight.value + 'px');
});

function isRouteActive(routeSlug: string) {
    return [route.path, _toLower(route.name)].indexOf(_toLower(routeSlug)) >= 0;
}

</script>
<style scoped>
a.footer-link:hover{
    text-decoration: underline;
}

.primary-navigation-parent {
    background-color: v-bind(navigationBackground) !important;
    border-top: none;
    border-left: none;
    border-right: none;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 30;
}

.allocate-navigation {
    margin-top: v-bind(topAllocation);
}

.ping{
    background-color: v-bind(primaryColor);
}

.ping-highlight{
    background-color: v-bind(accentColor);
}

.footer-rule{
    height: 1px;
    width: 100%;
    background: linear-gradient(
        to right,
        transparent 0%,
        v-bind(threadColor) 10%,
        transparent 50%,
        v-bind(threadColor) 90%,
        transparent 100%
    );
}
</style>