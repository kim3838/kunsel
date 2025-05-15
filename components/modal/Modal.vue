<template>
    <div v-show="show" class="fixed inset-0 overflow-y-auto px-0 z-50">
        <div v-show="show" class="fixed inset-0" @click="close">
            <div class="absolute inset-0 modal-layer opacity-75"></div>
        </div>

        <div v-show="show" class="h-full flex items-center relative z-[60] w-full px-2">
            <div class="modal-body rounded-sm overflow-hidden mx-auto w-full" :style="[widthStyle]">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia';

export default {
    setup(){
        const {$themeStore} = useNuxtApp();

        const {
            primary: primaryColor,
            secondary: secondaryColor,
            neutral: neutralColor,
            body: bodyColor,
            thread: threadColor,
        } = storeToRefs($themeStore);

        return {
            primaryColor,
            secondaryColor,
            neutralColor,
            bodyColor,
            threadColor
        };
    },
    props: {
        loading: {
            default: false
        },
        show: {
            default: false
        },
        maxWidth: {
            default: null
        },
        closeable: {
            default: true
        },
    },

    methods: {
        close() {
            if (this.closeable) {
                this.$emit('close')
            }
        }
    },

    created() {

    },

    computed: {
        widthStyle() {
            return {
                'max-width': this.maxWidth ? this.maxWidth : 'max-content'
            }
        },
    }
}
</script>
<style scoped>
.modal-layer{
    background-color: v-bind(secondaryColor);
}

.modal-body{
    background-color: v-bind(bodyColor);
}
</style>