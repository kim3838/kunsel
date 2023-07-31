<template>
    <div>
        <nav class="tw-border-b tw-border-neutral-200" :class="{'lg:tw-ml-sidebar': false}">
            <!-- Primary Navigation Menu -->
            <div class="tw-max-w-full tw-bg-white tw-mx-auto tw-px-2">
                <div class="tw-flex tw-justify-center tw-h-10">
                    <div class="tw-relative tw-flex">
                        <!-- Navigation Links -->
                        <div class="tw-hidden tw-space-x-4 lg:tw--my-px lg:tw-ml-10 lg:tw-flex">
                            <NavLink :to="'/'" :active="isRouteActive('index')">
                                Home
                            </NavLink>
                            <NavLink :to="'/prototype'" :active="isRouteActive('prototype')">
                                Prototype
                            </NavLink>
                            <NavLink :to="'/login'" :active="isRouteActive('login')">
                                Login
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <main class="tw-relative">
            <slot name="content"/>
        </main>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();

function isRouteActive(routeSlug: string){
    return [route.path, _toLower(route.name)].indexOf(_toLower(routeSlug)) >= 0;
}
</script>