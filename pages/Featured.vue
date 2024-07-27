<template>
    <div
        v-if="clientReadyState"
        ref="layoutScroll"
        class="tw-h-screen tw-max-h-screen tw-overflow-y-scroll tw-overflow-x-hidden">
        <!-- Primary Navigation Menu -->
        <LandingNavigation />
        <!-- Main Content -->
        <main>
            <section id="section1">
                {{layoutScrollY}}&nbsp;:&nbsp;1
            </section>
            <section id="section2">
                {{layoutScrollY}}&nbsp;:&nbsp;2
            </section>
            <section id="section3">
                {{layoutScrollY}}&nbsp;:&nbsp;3
            </section>
            <section id="section4">
                {{layoutScrollY}}&nbsp;:&nbsp;4
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

//On navigate
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(()=>{
            bootFullPageScroll("ON NAVIGATE");
        });
    })
}

//On page load
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            bootFullPageScroll("ON PAGE LOAD");
        });
    }
});

let sections = null
let scrolling = false;
let proximityThreshold = 0;
let scrollSpeed = 200;
const layoutScroll = ref<HTMLElement | null>(null)
const { y: layoutScrollY } = useScroll(layoutScroll)
function bootFullPageScroll(caller){
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
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
}
</style>