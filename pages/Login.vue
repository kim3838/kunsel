<template>
    <div>
        <NuxtLayout name="custom">
            <template #content>
                <div class="tw-m-2 tw-p-2 tw-border tw-border-light">
                    <div class="tw-flex tw-items-center tw-justify-center">
                        <div class="moody-card tw-p-6">
                            <div class="moody-card-frame"></div>
                            <div class="tw-relative">
                                <TextSample></TextSample>
                            </div>
                        </div>

                        <div class="tw-flex tw-h-full tw-items-center tw-border-neutral-200 tw-border">
                            <form @submit.prevent="login" class="tw-w-72">
                                <div class="tw-block">
                                    <FormInputLabel :size="'sm'" for="email" value="Email" />
                                    <FormInput :size="'sm'" id="email" type="email" class="tw-w-full" ref="emailInput" v-model="email" autofocus autocomplete="off" />
                                    <sup>{{email}}</sup>
                                </div>

                                <div class="tw-block tw-mt-4">
                                    <FormInputLabel :size="'md'" for="password" value="Password" />
                                    <FormInput :size="'md'" id="password" type="password" class="tw-w-full" v-model="password" required autocomplete="current-password" />
                                    <sup>{{password}}</sup>
                                </div>

                                <div class="tw-block tw-mt-4">
                                    <label class="tw-flex tw-items-center">
                                        <FormCheckbox name="remember" v-model="remember" :size="'md'" :label="'Remember me'" />
                                    </label>
                                    <label>
                                        <sup>{{remember}}</sup>
                                    </label>
                                </div>

                                <div class="tw-flex tw-items-center tw-justify-end tw-mt-4">
                                    <Button :size="'md'"><span class="tw-font-semibold">Authenticate</span></Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted, nextTick } from 'vue';

definePageMeta({
    layout: false,
});

let emailInput = ref(null);

onMounted(async () => {
    await nextTick();
    emailInput.value.$refs.input.focus();
})

const email = ref("berenice.jerde@example.com1");
const password = ref("password");
const remember = ref(true);

async function login() {
    await useApiFetch("/sanctum/csrf-cookie");

    const { data, pending, refresh, error, status } = await useApiFetch("/login", {
        method: 'POST',
        body: {
            email: email,
            password: password
        }
    });

    //console.log({email: email, password: password, remember: remember});

    console.log({
        data: data,
        pending: pending,
        error: error,
        status: status
    });

    if(status._value == 'success'){
        //Authenticated

        const { data, pending, refresh, error, status } = await useApiFetch("/api/user");

        console.log({
            data: data
        })
    }

    if(status._value == 'error'){
        console.log({
            error: error.value.data
        });
    }
}

</script>

<style scoped>
.container {
    @apply tw-flex tw-justify-center tw-items-center tw-text-center tw-mx-auto;
    /*border: 1px solid silver;*/
}

.moody-card{
    border: 1px solid silver;
    position: relative;
    margin: 24px;
}

.moody-card-frame{
    box-sizing: border-box;
    display: block;
    content: none;
}

.moody-card-frame:before{
    position: absolute;
    content: "";
    top: -8px;
    left: -9px;
    right: 7px;
    bottom: 7px;
    border: 1px solid silver;
    display: block;
}

.moody-card-frame:after{
    position: absolute;
    content: "";
    top: 7px;
    left: 7px;
    right: -9px;
    bottom: -8px;
    border: 1px solid silver;
    display: block;
}
</style>
