<template>
    <Modal
        :show="show"
        :max-width="maxWidth"
        :closeable="closeable"
        @close="close">
        <div class="p-3 modal-body">
            <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 sm:mx-0 sm:h-10 sm:w-10">
                    <slot name="icon"></slot>
                </div>

                <div class="mt-3 text-center sm:mt-0 sm:ml-2 sm:text-left">
                    <h3 class="text-xl font-medium font-header">
                        <slot name="title"></slot>
                    </h3>

                    <div class="mt-1 text-base">
                        <slot name="content"></slot>
                    </div>
                </div>
            </div>
        </div>

        <div class="px-3 py-2.5">
            <slot name="footer">
            </slot>
        </div>
    </Modal>
</template>

<script>
import {storeToRefs} from 'pinia';

export default {
    setup(){
        const {$themeStore} = useNuxtApp();

        const {
            neutral: neutralColor,
        } = storeToRefs($themeStore);

        return {
            neutralColor
        };
    },
    props: {
        show: {
            default: false
        },
        maxWidth: {
            default: '2xl'
        },
        closeable: {
            default: true
        },
    },

    methods: {
        close() {
            this.$emit('close')
        },
    }
}
</script>
<style scoped>

.modal-body{
    border-bottom:1px solid v-bind(neutralColor);
}
</style>