<template>
    <div class="tw-mx-auto tw-max-w-screen-2xl">
        <div class="tw-my-4">
            <div class="tw-w-max tw-mx-auto tw-p-16 tw-text-center tw-border tw-border-neutral-200">
                <div v-if="error.statusCode === 404">Page not found</div>
                <div v-else>An error occurred</div>
                <NuxtLink class="tw-underline tw-text-sm" to="/">
                    <Button :variant="'flat'" :label="'Back to Home page'"/>
                </NuxtLink>
            </div>
        </div>
        <div class="tw-my-4">
            <pre class="tw-w-full">{{ error }}</pre>
        </div>
    </div>
</template>

<script>
export default {
    props: ['error'],
    layout: 'blank' // you can set a custom layout for the error page
}
</script>

<style>
html {
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
}
</style>
