<template>
    <label :class="[fontClass]" class="font-data flex align-start">
        <span class="line-clamp-1" v-if="value">{{ value }}</span>
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
                default: 'md'
            },
        },

        computed: {
            fontClass(){
                return {
                    '2xs': 'text-xs font-medium leading-3',
                    'xs': 'text-xs font-medium leading-3',
                    'sm': 'text-sm font-medium leading-4',
                    'md': 'text-base font-medium leading-5',
                    'lg': 'text-lg font-medium leading-5',
                    'xl': 'text-xl font-semibold leading-5',
                }[this.size]
            },
        }
    }
</script>
