<template>
    <div>

        <div class="font-sans text-xl text-gray-500">
            <span v-text="sansParagraph"></span>
        </div>
        <div class="font-serif text-xl text-gray-500">
            <span v-text="serifParagraph"></span>
        </div>
        <div class="font-mono text-xl text-gray-500">
            <span v-text="monoParagraph"></span>
        </div>

        <div class="w-full bg-gradient-to-r from-transparent via-gray-300 from-transparent my-1"
             style="height: 2px;"></div>

        <div class="font-sans text-base text-gray-500">
            <span v-text="sansParagraph"></span>
        </div>
        <div class="font-serif text-base text-gray-500">
            <span v-text="serifParagraph"></span>
        </div>
        <div class="font-mono text-base text-gray-500">
            <span v-text="monoParagraph"></span>
        </div>

        <div class="w-full bg-gradient-to-r from-transparent via-gray-300 from-transparent my-1"
             style="height: 2px;"></div>

        <div class="text-sm text-gray-500" style="font-family: 'Gupter', 'sans-serif';">
            <span v-text="serifParagraph"></span>
        </div>

        <div class="text-sm text-gray-500" style="font-family: 'Kotta One', 'serif';">
            <span v-text="serifParagraph"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
let sansParagraph: string = "Sans : The quick brown fox jumps over the lazy dog.";
let serifParagraph: string = "Serif : The quick brown fox jumps over the lazy dog.";
let monoParagraph: string = "Mono :The quick brown fox jumps over the lazy dog.";
</script>