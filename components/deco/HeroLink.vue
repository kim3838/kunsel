<template>
    <a class="link" href="">
        <span>
            <slot></slot>
        </span>
    </a>
</template>

<script setup lang="ts">

</script>

<style scoped>
.link{
    display: block;
    padding: 12px 30px;
    text-decoration: none;
    border: 2px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(45deg, #7d7d7f 20%, #fefdfd, #3d3d3e 70%, #fefdfd, #7d7d7f 100%);
    transition: all 1s cubic-bezier(0.645, 0.045, 0.355, 1);
    -webkit-transition: all 1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.link span{
    font-weight: 500;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
}
</style>