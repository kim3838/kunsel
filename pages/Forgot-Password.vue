<template>
    <div>
        <LandingWrapper>
            <div class="mx-auto px-4 flex justify-center max-w-screen-2xl scaffold-border-left-bottom-right">
                <AccentFrame class="my-4">
                    <template #content>
                        <div class="relative py-4">
                            <form @submit.prevent="handleForgotPassword" class="w-80">
                                <div class="block mt-4">
                                    <InputLabel :size="'md'" for="identifier" value="Enter account email" />
                                    <InputWithIcon
                                        :icon="'ic:round-mail-outline'"
                                        :disabled="pending"
                                        :size="'lg'"
                                        id="email"
                                        :type="'email'"
                                        class="w-full"
                                        ref="emailInput"
                                        v-model="email"
                                        autofocus
                                        autocomplete="off" />
                                </div>

                                <div class="flex mt-4 items-center justify-end">
                                    <Button
                                        :disabled="pending"
                                        :size="'md'"
                                        :variant="'default'"
                                        :icon="pending ? 'eos-icons:installing' : 'ic:round-mail-outline'"
                                        :label="pending ? 'Requesting...' : 'Email Password Reset Link'"></Button>
                                </div>
                            </form>
                        </div>
                    </template>
                </AccentFrame>
            </div>
        </LandingWrapper>
    </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid', 'Forgot-Password.vue');
const clientReadyState = useClientReadyState();
const {$promptStore} = useNuxtApp();

let emailInput = ref(null);
let pending = ref(false);
let email = ref("luxere20@gmail.com");

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