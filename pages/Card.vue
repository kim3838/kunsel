<template>
    <div>
        <NuxtLayout :name="$coreStore.layout">
            <template #content>
                <div class="tw-flex tw-justify-center tw-mx-auto">
                    <div class="carousel-card">
                        <figure class="carousel-figure">
                            <img :src="`/images/S01_U_P14_Eager-Apprentice.jpg`" />
                        </figure>

                        <div class="carousel-frame-outer">
                            <span class="carousel-frame-pin"></span>
                            <span class="carousel-frame-round"></span>
                        </div>

                        <div class="carousel-frame-inner">
                        </div>

                        <div class="carousel-frame-outer-sub">
                            <span class="carousel-frame-outer-sub-border-top"></span>
                            <span class="carousel-frame-outer-sub-v-cut"></span>
                            <span class="carousel-frame-round-sub"></span>
                        </div>

                        <div class="carousel-card-content">
                            <div class="carousel-card-title tw-font-serif tw-tracking-tight">ALWAYS A NEW WAY TO PLAY</div>
                            <div class="h-div"></div>
                            <div class="carousel-card-sub-title tw-text-xl tw-font-serif">
                                Explore how different champions and regions work together to give you unique advantages in an always-evolving meta.
                            </div>
                        </div>
                    </div>
                    <div class="carousel-card">
                        <figure class="carousel-figure">
                            <img :src="`/images/S01_U_F06_Poro.jpg`" />
                        </figure>

                        <div class="carousel-frame-outer">
                            <span class="carousel-frame-pin"></span>
                            <span class="carousel-frame-round"></span>
                        </div>

                        <div class="carousel-frame-inner">
                        </div>

                        <div class="carousel-frame-outer-sub">
                            <span class="carousel-frame-outer-sub-border-top"></span>
                            <span class="carousel-frame-outer-sub-v-cut"></span>
                            <span class="carousel-frame-round-sub"></span>
                        </div>

                        <div class="carousel-card-content">
                            <div class="carousel-card-title tw-font-serif tw-tracking-tight">PLAY TO WIN, NOT PAY TO WIN</div>
                            <div class="h-div"></div>
                            <div class="carousel-card-sub-title tw-text-xl tw-font-serif">
                                Earn cards for free as you play or buy exactly what you want in the store— you’re in control of your collection.
                            </div>
                        </div>
                    </div>
                    <div class="carousel-card">
                        <figure class="carousel-figure">
                            <img :src="`images/smv-bacon-s001-dem-selfless-shieldguard.jpg`" />
                        </figure>

                        <div class="carousel-frame-outer">
                            <span class="carousel-frame-pin"></span>
                            <span class="carousel-frame-round"></span>
                        </div>

                        <div class="carousel-frame-inner">
                        </div>

                        <div class="carousel-frame-outer-sub">
                            <span class="carousel-frame-outer-sub-border-top"></span>
                            <span class="carousel-frame-outer-sub-v-cut"></span>
                            <span class="carousel-frame-round-sub"></span>
                        </div>

                        <div class="carousel-card-content">
                            <div class="carousel-card-title tw-font-serif tw-tracking-tight">master every moment</div>
                            <div class="h-div"></div>
                            <div class="carousel-card-sub-title tw-text-xl tw-font-serif">
                                Dynamic, alternating gameplay means you can always react and counter, but so can your opponent.
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup>
definePageMeta({
    layout: false,
    middleware: 'guest'
});

const {$coreStore} = useNuxtApp();
</script>

<style scoped>
.h-div{
    position: relative;
    margin: 0 auto;
    width: 60%;
    border-top: 1px solid #99664d;
    padding-top:0.5rem;
    box-sizing: border-box;
    overflow: hidden;
}

.h-div:before{
    display: block;
    position: absolute;
    content: "";
    background: #99664d;
    height: 0.5rem;
    width: 0.7rem;
    left: 0;
    bottom: 90%;
    transform: rotate(20deg);
    transform-origin: left bottom;
}

.h-div:after{
    display:block;
    position:absolute;
    content:"";
    background:#99664d;
    height: 0.5rem;
    width: 0.7rem;
    right:0;
    bottom:90%;
    transform: rotate(-20deg);
    transform-origin:right bottom;
}

.carousel-card{
    width: 352px;
    /*height: 509px;*/
    /*border: 1px solid silver;*/
    position: relative;
    transition: opacity .6s linear 0s,transform .6s cubic-bezier(.165,.84,.44,1) 0s;
}

.carousel-figure{
    width: 100%;
    /*height: 300px;*/
    position: relative;
    overflow: hidden;
    /*border: 1px solid silver;*/
}

.carousel-figure:before{
    content: "";
    display: block;
    padding-top: 80%;
    box-sizing: border-box;
}

.carousel-figure img{
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
    object-position: 50% 0;
}

.carousel-figure:after{
    content: "";
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(180deg,rgba(207,198,191,0) 10%,#cfc6bf 90%);
}

.carousel-card-content{
    /*position: relative;*/
    height: 229px;
    text-align: center;
    border-top: 0px solid silver;
    border-bottom: 0px solid silver;
    /*padding-bottom: 2rem;*/
    background: linear-gradient(0deg,#c6b7a0,#cfc6bf 100%);
}

.carousel-card-title{
    position: relative;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.5rem;
    margin-bottom: 0.1rem;
    color: #68482c;
}

.carousel-card-sub-title{
    position: relative;
    margin: 2rem 2rem 0 2rem;
    color: #543a0a;
}

.carousel-frame-outer{
    position: absolute;
    top: 1rem;
    bottom: 0.5rem;
    left: 1rem;
    right: 1rem;
    box-sizing: border-box;
}

.carousel-frame-outer:before{
    position: absolute;
    top: 2rem;
    bottom: 0;
    left: 0;
    right: 0;
    content: "";
    border: 1px solid #68482c;
    border-top: none;
}

.carousel-frame-outer:after{
    position: absolute;
    top: 2.5rem;
    bottom: 0.5rem;
    left: -0.5rem;
    right: -0.5rem;
    content: "";
    border: 1px solid #99664d;
    border-top: none;
}

.carousel-frame-pin{
    position: absolute;
    height: 2rem;
    left:0;
    top:0;
    right:0;
    display: block;
    color: #99664d;
    box-sizing: border-box;
}
.carousel-frame-pin:before{
    content: "";
    position: absolute;
    top: .2rem;
    left: .2rem;
    height: .5rem;
    width: .5rem;
    border-radius: 50%;
    border: 1px solid #99664d;
    box-sizing: border-box;
}
.carousel-frame-pin:after{
    content: "";
    position: absolute;
    top: .2rem;
    right: .2rem;
    height: .5rem;
    width: .5rem;
    border-radius: 50%;
    border:1px solid #99664d;
    box-sizing: border-box;
}

.carousel-frame-round{
    position: relative;
    display: block;
    height: 2rem;
    overflow: hidden;
}
.carousel-frame-round:before{
    content: "";
    position: absolute;
    left: -2rem;
    top: -2rem;
    width: 4rem;
    height: 4rem;
    border: 1px solid #68482c;
    border-radius: 50%;
    box-sizing: border-box;
}
.carousel-frame-round:after{
    content: "";
    position: absolute;
    right: -2rem;
    top: -2rem;
    width: 4rem;
    height: 4rem;
    border: 1px solid #68482c;
    border-radius: 50%;
    box-sizing: border-box;
}

.carousel-frame-inner{
    content: "";
    position: absolute;
    border-top: 1px solid #68482c;
    top: 1rem;
    left: 3rem;
    right: 3rem;
    bottom: 0;
    box-sizing: border-box;
}

.carousel-frame-outer-sub{
    position: absolute;
    color: silver;
    top: 0.5rem;
    bottom: 1rem;
    left: 0.5rem;
    right: 0.5rem;
    box-sizing: border-box;
    overflow: hidden;
}

.carousel-frame-outer-sub-border-top{
    content: "";
    position: absolute;
    left: 3rem;
    right: 3rem;
    height: 3rem;
}
.carousel-frame-outer-sub-border-top:before{
    position: absolute;
    left: 0;
    content: "";
    width: calc(50% - 1.2rem);
    height: 1px;
    background: #99664d;
}
.carousel-frame-outer-sub-border-top:after{
    position: absolute;
    right: 0;
    content: "";
    width: calc(50% - 1.2rem);
    height: 1px;
    background: #99664d;
}

.carousel-frame-outer-sub-v-cut{
    position: absolute;
    width: 1.8rem;
    height: 1.8rem;
    display: block;
    top: -0.9rem;
    left: 50%;
    transform: translateX(-50%);
}

.carousel-frame-outer-sub-v-cut:before{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border: 1px solid #99664d;
    transform: rotate(45deg);
    content: "";
}

.carousel-frame-round-sub{
    position: relative;
    display: block;
    height: 3.5rem;
    overflow: hidden;
    box-sizing: border-box;
}
.carousel-frame-round-sub:before{
    content: "";
    position: absolute;
    left: -3rem;
    top: -3rem;
    width: 6rem;
    height: 6rem;
    border: 1px solid #99664d;
    border-radius: 45%;
    box-sizing: border-box;
}
.carousel-frame-round-sub:after{
    content: "";
    position: absolute;
    right: -3rem;
    top: -3rem;
    width: 6rem;
    height: 6rem;
    border: 1px solid #99664d;
    border-radius: 45%;
    box-sizing: border-box;
}
</style>
