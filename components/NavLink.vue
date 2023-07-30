<template>
    <NuxtLink :to="to" :class="classes">
        <slot></slot>
    </NuxtLink>
</template>

<script>
    export default {
        props: ['to', 'active'],

        computed: {
            classes() {
                return this.active
                    ? 'tw-inline-flex tw-items-center tw-px-1 tw-pt-1 tw-border-b-2 tw-text-xl tw-font-base tw-font-serif tw-border-light tw-leading-4 focus:tw-outline-none tw-focus:border-gray-700 tw-transition tw-duration-150 tw-ease-in-out'
                    : 'tw-inline-flex tw-items-center tw-px-1 tw-pt-1 tw-border-b-2 tw-text-xl tw-font-base tw-font-serif tw-border-transparent tw-leading-4 focus:tw-outline-none focus:tw-text-gray-700 focus:tw-border-gray-300 tw-transition tw-duration-150 tw-ease-in-out'
            }
        }
    }
</script>
