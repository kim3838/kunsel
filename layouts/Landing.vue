<template>
    <div class="tw-relative">
        <!-- Primary Navigation Menu -->
        <nav ref="navigation" class="primary-navigation-parent tw-fixed" :class="{'lg:tw-ml-sidebar': false}">
            <div class="tw-max-w-full tw-mx-auto">
                <div class="tw-flex tw-justify-center tw-h-7 lg:tw-h-14">
                    <div class="tw-flex">
                        <!-- Navigation Links -->
                        <div class="tw-hidden tw-space-x-8 tw--my-px lg:tw-flex">
                            <NavLink :to="'/'" :active="isRouteActive('index')">
                                Home
                            </NavLink>
                            <NavLink :to="'/prototype'" :active="isRouteActive('prototype')">
                                Prototype
                            </NavLink>
                            <NavLink :to="'/lab'" :active="isRouteActive('lab')">
                                Lab
                            </NavLink>
                            <NavLink :to="'/login'" :active="isRouteActive('login')">
                                Login
                            </NavLink>
                            <NavLink :to="'/profile'" :active="isRouteActive('profile')">
                                Profile
                            </NavLink>
                            <NavLink :to="'/users'" :active="isRouteActive('users')">
                                Users
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <main class="tw-relative allocate-navigation">
            <slot name="content"/>
        </main>
        <ServiceErrorModal></ServiceErrorModal>
        <footer>
            <div class="tw-mx-auto tw-max-w-screen-xl tw-px-4 tw-pb-6 tw-pt-16 sm:tw-px-6 lg:tw-px-8 lg:tw-pt-24">
                <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-4">
                    <div>
                        <div class="tw-flex tw-justify-center sm:tw-justify-start">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="3.8rem" viewBox="-5.969 -13 760 95" enable-background="new -5.969 -13 760 95">
                                <path d="M97,0c-6.648,0-12,5.352-12,12v45c0,6.648,5.352,12,12,12h16v9h15v-9h17c6.648,0,12-5.352,12-12V12
	c0-6.648-5.352-12-12-12H97z M100,12h41v44h-13v-7h-15v7h-13V12z"/>
                                <path d="M14,0C7.352,0,2,5.352,2,12v16c0,6.648,5.352,12,12,12h44h2v16h-2H31H19h-2H0v1c0,6.648,5.352,12,12,12h5h2
	h42c6.648,0,12-5.352,12-12V39c0-6.648-5.352-12-12-12h-3H15V12h43v6h14v-6c0-6.648-5.352-12-12-12H14z"/>
                                <path d="M169,0v12v45c0,6.648,5.352,12,12,12h8h9h1h8h17c6.648,0,12-5.352,12-12V12V0h-9h-5h-1v56h-14h-8h-1h-9h-5V0
	h-3H169z"/>
                                <path d="M273.5,1L239,69h15l7.625-15h38.75L308,69h15L288.5,1L288,0h-14
	L273.5,1z M281,15.781L294.313,42h-26.625L281,15.781z"/>
                                <path d="M330,0v12v19v38h15V43h9.5l25,26h20l-25-26h7.5c6.648,0,12-5.352,12-12V12c0-6.648-5.352-12-12-12h-37h-3H330
	z M345,12h30c2.216,0,4,1.784,4,4v11c0,2.216-1.784,4-4,4h-30V12z"/>
                                <path d="M407,0v69h58V56h-43V12h43V0H407z"/>
                                <rect x="435" y="27" fill="#E20A16" width="25" height="13"/>
                                <path d="M497,0v69h58V56h-43V12h43V0H497z"/>
                                <rect x="525" y="27" fill="#E20A16" width="25" height="13"/>
                                <path d="M567,0v3.5V69h14V20.188l36,42.938l1,1.188L621.938,69H625h6h1V0h-1h-14v46.438L581,3.5L578.063,0H567z"/>
                                <rect x="644" width="16" height="69"/>
                                <path d="M667.938,0l30.031,33.344L667.75,69h18l21.5-25.344L730.063,69h18l-32.094-35.656L744.25,0h-18
	l-19.563,23.063L685.938,0H667.938z"/>
                            </svg>
                        </div>

                        <p class="tw-text-center tw-leading-relaxed tw-text-gray-500 sm:tw-max-w-md sm:tw-text-left">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt
                            consequuntur amet culpa cum itaque neque.
                        </p>

                        <ul class="tw-mt-2 tw-flex tw-justify-center tw-gap-6 sm:tw-justify-start md:gap-8">
                            <li>
                                <a href="/" rel="noreferrer" target="_blank">
                                    <Icon class="tw-h-5 tw-w-5" name="mdi:facebook"></Icon>
                                </a>
                            </li>
                            <li>
                                <a href="/" rel="noreferrer" target="_blank">
                                    <Icon class="tw-h-5 tw-w-5" name="mdi:instagram"></Icon>
                                </a>
                            </li>
                            <li>
                                <a href="/" rel="noreferrer" target="_blank">
                                    <Icon class="tw-h-5 tw-w-5" name="mdi:youtube"></Icon>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="tw-grid tw-grid-cols-1 tw-gap-8 tw-mt-8 lg:tw-mt-0 sm:tw-grid-cols-2 md:tw-grid-cols-5 lg:tw-col-span-3">
                        <div class="tw-text-center sm:tw-text-left md:tw-col-span-2 lg:tw-pl-16">
                            <p class="tw-text-lg tw-font-medium">Contact Us</p>

                            <ul class="tw-mt-8 tw-space-y-4 tw-text-sm">
                                <li>
                                    <a class="tw-flex tw-items-center tw-justify-center sm:tw-justify-start" href="/">
                                        <Icon name="ic:round-mail-outline"></Icon>
                                        <span>mail@domain.com</span>
                                    </a>
                                </li>

                                <li>
                                    <a class="tw-flex tw-items-center tw-justify-center sm:tw-justify-start" href="/">
                                        <Icon name="ic:sharp-phone"></Icon>
                                        <span>+63 991 9991 991</span>
                                    </a>
                                </li>

                                <li class="tw-flex tw-items-start tw-justify-center sm:tw-justify-start">
                                    <Icon name="ic:sharp-location-on"></Icon>
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
                                    <a class="tw-transition hover:tw-text-gray-700/75" href="/">Web Development</a>
                                </li>
                                <li>
                                    <a class="tw-transition hover:tw-text-gray-700/75" href="/">Web Design</a>
                                </li>
                            </ul>
                        </div>

                        <div class="tw-text-center sm:tw-text-left">
                            <p class="tw-text-lg tw-font-medium">Helpful Links</p>

                            <ul class="tw-mt-8 tw-space-y-4 tw-text-sm">
                                <li>
                                    <a class="tw-transition hover:tw-text-gray-700/75" href="/">FAQs</a>
                                </li>
                                <li>
                                    <a class="tw-transition hover:tw-text-gray-700/75" href="/">Support</a>
                                </li>

                                <li>
                                    <a class="tw-group tw-flex tw-justify-center tw-gap-1.5 sm:tw-justify-start" href="/">
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
                                    <a class="tw-transition hover:tw-text-gray-700/75" href="/">Company History</a>
                                </li>

                                <li>
                                    <a class="tw-transition hover:tw-text-gray-700/75" href="/">Meet the Team</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="tw-mt-12 tw-pt-6">
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
                            <Icon name="ic:sharp-copyright"></Icon>2022 Lorem Ipsum
                        </p>
                    </div>
                </div>
            </div>
        </footer>

    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {nextTick, onMounted, onUnmounted, ref} from "vue";

const {$themeStore} = useNuxtApp();
const route = useRoute();

const {
    primary: primaryColor,
    accent: accentColor,
    neutral: neutralColor,
    tint: tintColor,
    lining: liningColor,
    thread: threadColor
} = storeToRefs($themeStore);

let navigation = ref(null);
let navigationHeight = ref('0px');
let windowWidth = ref(0);

function isRouteActive(routeSlug: string) {
    return [route.path, _toLower(route.name)].indexOf(_toLower(routeSlug)) >= 0;
}

async function handleWindowWidth() {
    windowWidth.value = window.innerWidth;
    await nextTick(() => {
        navigationHeight.value = `${navigation.value.offsetHeight}px`;
    });
}

onMounted(async () => {
    await nextTick(() => {
        navigationHeight.value = `${navigation.value.offsetHeight}px`;
    });
    window.addEventListener('resize', handleWindowWidth);
});

onUnmounted(async () => {
    window.removeEventListener('resize', handleWindowWidth);
});

</script>
<style scoped>
.primary-navigation-parent {
    background-color: v-bind(tintColor) !important;
    border-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: v-bind(neutralColor);
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 30;
}

.allocate-navigation {
    margin-top: v-bind(navigationHeight);
}

.ping{
    background-color: v-bind(primaryColor);
}

.ping-highlight{
    background-color: v-bind(accentColor);
}
</style>