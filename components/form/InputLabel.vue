<template>
    <label :class="[fontClass]" class="flex align-start">
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
                    '2xs': 'text-xs leading-3',
                    'xs': 'text-xs leading-3',
                    'sm': 'text-sm leading-4',
                    'md': 'text-base leading-5',
                    'lg': 'text-lg leading-5',
                    'xl': 'text-xl leading-5',
                }[this.size]
            },
        }
    }
</script>
