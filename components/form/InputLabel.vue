<template>
    <label :class="[fontClass]" class="tw-flex tw-align-start">
        <span v-if="value">{{ value }}</span>
        <span v-else><slot></slot></span>
    </label>
</template>

<script>
    export default {
        props: {
            value: {
                type: String,
                default: null
            },
            size: {
                default: null
            },
        },

        computed: {
            fontClass(){
                return {
                    [null]: 'tw-text-base tw-font-medium tw-leading-4',
                    'xs': 'tw-text-xs tw-font-medium tw-leading-3',
                    'sm': 'tw-text-sm tw-font-medium tw-leading-3',
                    'md': 'tw-text-base tw-font-medium tw-leading-4',
                    'lg': 'tw-text-lg tw-font-medium tw-leading-5',
                    'xl': 'tw-text-xl tw-font-semibold tw-leading-5',
                }[this.size]
            },
        }
    }
</script>
