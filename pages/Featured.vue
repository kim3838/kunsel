<template>
    <div
        v-if="clientReadyState"
        ref="layoutScroll"
        class="tw-h-screen tw-max-h-screen tw-overflow-y-scroll tw-overflow-x-hidden">
        <!-- Primary Navigation Menu -->
        <LandingNavigation />
        <!-- Main Content -->
        <main class="tw-text-white">
            <section>
                <div class="tw-relative tw-w-full tw-h-screen tw-flex tw-justify-center tw-items-center tw-overflow-hidden">
                    <div class="tw-w-full tw-h-full tw-absolute tw-z-30 spotlight-image" :style="{'background-image': `url(/images/carousel/c12d1eba-e8c2-4827-a0d2-5298c4b0f421.webp)`}"></div>

                    <div class="tw-z-40 tw-font-semibold tw-text-2xl">
                        {{layoutScrollY}}&nbsp;:&nbsp;1
                    </div>
                </div>
            </section>
            <section>
                <div class="tw-relative tw-w-full tw-h-screen tw-flex tw-justify-center tw-items-center tw-overflow-hidden">
                    <div class="tw-w-full tw-h-full tw-absolute tw-z-30 spotlight-image" :style="{'background-image': `url(/images/carousel/79e97448-7388-4f71-876e-d33c92091910.webp)`}"></div>
                    <div class="tw-z-40 tw-font-semibold tw-text-2xl">
                        {{layoutScrollY}}&nbsp;:&nbsp;2
                    </div>
                </div>
            </section>
            <section>
                <div class="tw-relative tw-w-full tw-h-screen tw-flex tw-justify-center tw-items-center tw-overflow-hidden">
                    <div class="tw-w-full tw-h-full tw-absolute tw-z-30 spotlight-image" :style="{'background-image': `url(/images/carousel/202ae924-b777-45a2-94c6-f78134b17020.webp)`}"></div>
                    <div class="tw-z-40 tw-font-semibold tw-text-2xl">
                        {{layoutScrollY}}&nbsp;:&nbsp;3
                    </div>
                </div>
            </section>
            <section>
                <div class="tw-relative tw-w-full tw-h-screen tw-flex tw-justify-center tw-items-center tw-overflow-hidden">
                    <div class="tw-w-full tw-h-full tw-absolute tw-z-30 spotlight-image" :style="{'background-image': `url(/images/carousel/2271fbba-86bf-4dc7-93cb-59eb0aab62d8.webp)`}"></div>
                    <div class="tw-z-40 tw-font-semibold tw-text-2xl">
                        {{layoutScrollY}}&nbsp;:&nbsp;4
                    </div>
                </div>
            </section>
        </main>
        <!-- DateTime Picker -->
        <div id="datetimepicker-slot"></div>
        <!-- Action Modal -->
        <PromptModal />
    </div>
</template>

<script setup lang="ts">
useLayout().setNavigationMode('clear', 'index.vue');

const clientReadyState = useClientReadyState();

//Boot full page scroll on navigate
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(()=>{
            bootFullPageScroll();
        });
    })
}

//Boot full page scroll on page load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            bootFullPageScroll();
        });
    }
});

let sections = null
let scrolling = false;
let proximityThreshold = 0;
let scrollSpeed = 200;
const layoutScroll = ref<HTMLElement | null>(null)
const { y: layoutScrollY } = useScroll(layoutScroll)
function bootFullPageScroll(){
    sections = document.querySelectorAll('section');
    proximityThreshold = layoutScroll.value.offsetHeight / 2;

    layoutScroll.value.removeEventListener('wheel', handleMouseWheel, { passive: false });
    layoutScroll.value.addEventListener('wheel', handleMouseWheel, { passive: false });
}

function handleMouseWheel(event){
    if(!isDesktop() || scrolling){
        return false;
    }

    scrolling = true;
    event.preventDefault();
    // Normalize wheel delta
    const delta = Math.max(-1, Math.min(1, event.deltaY));
    // Calculate scroll amount
    const scrollAmount = layoutScrollY.value + layoutScroll.value.offsetHeight * delta;
    // Scroll to the calculated amount with easing
    smoothScroll(scrollAmount, scrollSpeed, easeInOutCubic);
}

function easeInOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
}

function snapToSection() {
    for (const section of sections) {
        const sectionTop = section.offsetTop;
        const distance = Math.abs(layoutScrollY.value - sectionTop);

        if (distance < proximityThreshold) {
            smoothScroll(sectionTop, scrollSpeed * 0.25, easeInOutCubic, true);
            scrolling = false;
            break;
        }
    }
}

function smoothScroll(target, duration, easingFunction, snap = false) {
    const start = layoutScrollY.value;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    function scroll(timestamp) {
        const currentTime = 'now' in window.performance ? performance.now() : new Date().getTime();
        const timeElapsed = currentTime - startTime;
        const scrollAmount = easingFunction(timeElapsed, start, target - start, duration);

        layoutScrollY.value = scrollAmount;

        if (timeElapsed < duration) {
            requestAnimationFrame(scroll);
        } else {

            if(!snap){
                snapToSection();
            }
        }
    }

    requestAnimationFrame(scroll);
}
</script>
<style scoped>
section {
    height: 100vh;
}

.spotlight-image{
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
}
</style>