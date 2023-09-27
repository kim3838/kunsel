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
                            <NavLink :to="'/card'" :active="isRouteActive('card')">
                                Card
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
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {nextTick, onMounted, onUnmounted, ref} from "vue";
const {$themeStore} = useNuxtApp();
const route = useRoute();

const {
    neutral: neutralColor,
    tint: tintColor,
    lining: liningColor,
    thread: threadColor
} = storeToRefs($themeStore);

let navigation = ref(null);
let navigationHeight = ref('0px');
let windowWidth = ref(0);

function isRouteActive(routeSlug: string){
    return [route.path, _toLower(route.name)].indexOf(_toLower(routeSlug)) >= 0;
}

async function handleWindowWidth(){
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
.primary-navigation-parent{
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

.allocate-navigation{
    margin-top: v-bind(navigationHeight);
}
</style>