<template>
    <div class="w-full h-full">
        <svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" :fill="dark? '#fff' : '#1f1f1f'"
             viewBox="-59.625 -12.15 516.75 72.9">
            <path
                d="M36 29.8H9.4v-6.6h34.3c-.9-2.8-3.8-5.4-8.9-5.4H9.9c-5.7 0-9 2.1-9 6.7v4.9c0 4 3.4 6.3 8.4 6.3h26.9v7H0c.9 3.8 3.8 5.8 9 5.8h27.1c5.7 0 8.5-2.2 8.5-6.9v-4.9c0-4.3-3.3-6.6-8.6-6.9zm54.3-11.9H57.5v30.7h9.3V36.8H91c6.7 0 10.4-2.3 10.4-7.7v-3.4c-.1-5-4.3-7.8-11.1-7.8zm3 9.8c0 2.2-.4 3.4-4 3.4H66.8l.1-8h22c4 0 4.5 1.2 4.5 3.3v1.3zm39 8.9h-19.8l-4.9 5.2h28.6l4.9 6.8h11l-23.7-32-5.6 6.9zm37.6-13.4h34.8c-.9-3.6-4.4-5.4-9.4-5.4h-26c-4.5 0-8.8 1.8-8.8 6.7v17.2c0 4.9 4.3 6.7 8.8 6.7h26.3c6 0 8.1-1.7 9.1-5.8h-34.8zm75.6 10.2v-5.2h-28.1v20.4h41.5v-5.8h-32.1v-9.4zm-27.1-15.5h41.9v5.4h-41.9zm67.7 0h-14.6l17.2 12.6c2.5-1.7 5.4-3.5 8-5zm21.2 15.7c-2.5 1.7-5 3.6-7.4 5.4l13 9.5h14.7z"/>
            <path d="M397.5 0c-80 4.6-117 38.8-125.3 46.9l-1.7 1.6h14.8C325.3 8.4 382.8 1.3 397.5 0z"/>
        </svg>
    </div>
</template>
<script setup>
const props = defineProps({
    dark: {
        type: Boolean,
        default: false
    }
})
</script>
