<template>
    <Modal
        :show="show"
        :max-width="maxWidth"
        :closeable="closeable"
        @close="close">
        <div class="tw-p-3 modal-body">
            <div class="sm:tw-flex sm:tw-items-start">
                <div class="tw-mx-auto tw-flex-shrink-0 tw-flex tw-items-center tw-justify-center tw-h-12 tw-w-12 sm:tw-mx-0 sm:tw-h-10 sm:tw-w-10">
                    <slot name="icon"></slot>
                </div>

                <div class="tw-mt-3 tw-text-center sm:tw-mt-0 sm:tw-ml-2 sm:tw-text-left">
                    <h3 class="tw-text-xl tw-font-medium tw-font-header">
                        <slot name="title"></slot>
                    </h3>

                    <div class="tw-mt-1 tw-text-base">
                        <slot name="content"></slot>
                    </div>
                </div>
            </div>
        </div>

        <div class="tw-px-3 tw-py-2.5">
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