<template>
    <div>
        <h1 v-if="error.statusCode === 404">Page not found</h1>
        <h1 v-else>An error occurred</h1>
        <NuxtLink to="/">Back to Home page</NuxtLink>
        <pre>{{error}}</pre>
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
