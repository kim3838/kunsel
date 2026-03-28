<template>
    <div>
        <LandingWrapper>
            <div class="mx-auto pt-4 max-w-screen-2xl">
                <div class="min-h-120 flex flex-row items-center justify-center lg:px-10 gap-20">

                    <AccentFrame class="max-w-min mx-auto lg:mx-0 ">
                        <template #content>
                            <div class="relative py-4">
                                <ThemeHeader class="text-xl">Forgot password</ThemeHeader>

                                <form @submit.prevent="handleForgotPassword" class="mt-4 w-80">
                                    <div class="block">
                                        <InputLabel :size="'sm'" for="identifier" value="Enter account email" />
                                        <InputWithIcon
                                            :icon="'ic:round-mail-outline'"
                                            :disabled="pending"
                                            :size="'md'"
                                            :placeholder="`Enter your email address`"
                                            id="email"
                                            :type="'email'"
                                            class="w-full"
                                            ref="emailInput"
                                            v-model="email"
                                            autofocus />
                                    </div>

                                    <div class="flex mt-4 items-center justify-between">
                                        <div class="block text-sm self-end">
                                            <NuxtLink class="hover:underline" :to="'login'">Password login</NuxtLink>
                                        </div>
                                        <div>
                                            <Button
                                                :disabled="pending"
                                                :size="'md'"
                                                :variant="'default'"
                                                :icon="pending ? 'eos-icons:installing' : 'ic:round-mail-outline'"
                                                :label="pending ? 'Requesting...' : 'Email password reset link'"></Button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </template>
                    </AccentFrame>
                </div>
            </div>
        </LandingWrapper>
    </div>
</template>

<script setup lang="ts">
useHead({titleTemplate: (titleChunk) => {return `Forgot Password`}});
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid');
const clientReadyState = useClientReadyState();
const {$promptStore} = useNuxtApp();

let emailInput = ref(null);
let pending = ref(false);
let email = ref("");

//On navigate, focus on email input
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(()=>{
            if(emailInput.value){
                //@ts-ignore
                emailInput.value.$refs.input.focus();
            }
        });
    })
}

//On page load, focus on email input
watch(clientReadyState, async (clientReady) => {
    if(clientReady){
        await nextTick(() => {
            if(emailInput.value){
                //@ts-ignore
                emailInput.value.$refs.input.focus();
            }
        });
    }
});

let bodyComputed = computed(() => {
    return {
        email: email.value
    };
});

async function handleForgotPassword(){
    pending.value = true;
    await executeForgotPassword();
}

const executeForgotPassword = async () => {
    pending.value = true;

    await laraFetch("/forgot-password", {
        method: 'POST',
        body: bodyComputed.value
    }, {
        onRequestError: () => {
            pending.value = false;
        },
        onResponse: () => {
            pending.value = false;
        },
        onSuccessResponse: (request, options, response) => {
            $promptStore.setPrompt({
                icon: 'ic:outline-mark-email-read',
                title: 'Password Reset',
                message: _get(response, '_data.message', ''),
                action: {
                    callback: () => {
                        navigateTo({
                            path: '/login',
                            replace: true
                        });
                    },
                    label: 'Close'
                }
            });
        }
    });
}
</script>