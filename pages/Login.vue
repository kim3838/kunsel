<template>
    <div>
        <LandingWrapper>
            <div class="mx-auto pt-4 max-w-screen-2xl">
                <div class="flex flex-col-reverse lg:flex-row lg:justify-center lg:px-10 gap-20">

                    <div class="w-[620px] h-[360px] mx-auto lg:mx-0">
                        <Glint :orientation="`portrait`" :color="threadColor">
                            <HexagonFrame
                                :content-background="tintColor"
                                :frame-border-primary-color="threadColor"
                                :direction="'ltr'"
                                :theme="'light'"
                                :head-percentage="20"
                                :top-right="65"
                                :bottom-left="45"
                                :opaque="true"
                                :header-fade="true"
                                :header-fade-color="'rgba(1,1,1,0.1)'">
                                <template #header>
                                    <div class="h-full w-[20%]">
                                        <div
                                            class="h-full w-full bg-cover bg-center bg-no-repeat grayscale opacity-50"
                                            :style="{'background':'url(/images/deco/fluid-gold-top.jpg)'}"
                                        />
                                    </div>
                                    <div class="h-full w-[80%]">
                                        <div
                                            class="h-full w-full bg-cover bg-center bg-no-repeat grayscale opacity-15"
                                            :style="{'background':'url(/images/deco/fluid-gold-top.jpg)'}"
                                        />
                                    </div>
                                </template>
                                <template v-slot:body="{frameBorderColor}">
                                    <div class="w-[80%] h-full relative py-4 px-2 overflow-hidden flex flex-col">
                                        <div class="text-lg font-medium font-header">Compensation tax (WTC) calculator</div>

                                        <form @submit.prevent="calculateTax" class="mt-4">
                                            <div class="block">
                                                <InputLabel :size="'sm'" value="Monthly salary"/>
                                                <Input v-model="monthlySalary" high-light-all-text-on-focus :size="'md'" :min="0" :type="'number'" type-strict />
                                            </div>

                                            <DataTable
                                                :landscape="true"
                                                :headers="contributionHeaders"
                                                :size="'md'"
                                                :show-no-data="false"
                                                :rows="contributionData">
                                            </DataTable>

                                            <DataTable
                                                :landscape="true"
                                                :headers="taxableHeaders"
                                                :size="'md'"
                                                :show-no-data="false"
                                                :rows="taxableData">
                                            </DataTable>

                                            <div class="flex mt-4 items-center justify-between">
                                                <div class="flex-grow-[0.2]">
                                                    <Button
                                                        :justify-content="'center'"
                                                        :disabled="calculateTaxPending"
                                                        :variant="'outline'"
                                                        :size="'md'"
                                                        :label="calculateTaxPending ? 'Please wait...' : 'Calculate Tax'"></Button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </template>
                            </HexagonFrame>
                        </Glint>
                    </div>

                    <AccentFrame class="h-[360px] max-w-min mx-auto lg:mx-0 ">
                        <template #content>
                            <div class="relative py-4">
                                <div class="text-lg font-medium font-header">Password login</div>
                                <form @submit.prevent="handleLogin" class="mt-4 w-80">
                                    <div class="block">
                                        <InputLabel :size="'md'" for="identifier" value="Username or Email" />
                                        <Input
                                            :disabled="authPending"
                                            :size="'lg'"
                                            id="identifier"
                                            class="w-full"
                                            ref="identifierInput"
                                            v-model="identifier" />
                                    </div>

                                    <div class="block mt-4">
                                        <InputLabel :size="'md'" for="password" value="Password" />
                                        <Input
                                            :disabled="authPending"
                                            :size="'lg'"
                                            id="password"
                                            :type="'password'"
                                            class="w-full tracking-widest"
                                            v-model="password"
                                            required />
                                    </div>

                                    <div class="block mt-4">
                                        <label class="flex items-center">
                                            <Checkbox
                                                :disabled="authPending"
                                                name="remember"
                                                v-model="remember"
                                                :size="'md'"
                                                :label="'Remember me'" />
                                        </label>
                                    </div>

                                    <div v-if="$coreStore.hasNonPromptableServicePayloadMessage" class="block">
                                        <Label invert :size="'sm'" :type="'danger'" :label="$coreStore.servicePayloadMessage" />
                                    </div>

                                    <div class="flex mt-4 items-center justify-between">
                                        <div class="block text-sm self-end">
                                            <NuxtLink class="hover:underline" :to="'forgot-password'">Forgot password.</NuxtLink>
                                        </div>
                                        <div class="flex-grow-[0.5]">
                                            <Button
                                                :justify-content="'center'"
                                                :disabled="authPending || isAuthenticated"
                                                :size="'md'"
                                                :override="{font_family_class: `font-serif`}"
                                                :icon="authPending ? 'eos-icons:loading' : 'ph:sign-in-bold'"
                                                :label="authPending ? 'Logging in...' : 'Login'"></Button>
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
import {storeToRefs} from "pinia";
import type {TableHeaderT} from "~/public/js/types/data";
const {$themeStore} = useNuxtApp();

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Login`}});
definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid');

const {
    hexAlpha,
    lining: liningColor,
    thread: threadColor,
    neutral: neutralColor,
    tint: tintColor,
} = storeToRefs($themeStore);

const clientReadyState = useClientReadyState();
const {$coreStore} = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const {isAuthenticated, login, authPending} = useAuth();
const presetUsername = process.env.NODE_ENV === 'development' ? runtimeConfig.public.devUsername : '';
const presetPassword = process.env.NODE_ENV === 'development' ? runtimeConfig.public.devUserPassword : '';
let identifierInput = ref(null);

//On navigate, focus on identifier input
if(clientReadyState.value){
    onMounted(async () => {
        await nextTick(()=>{
            if(identifierInput.value){
                //@ts-ignore
                identifierInput.value.$refs.input.focus();
            }
        });
    })
}

//On page load, focus on identifier input
watch(clientReadyState, async (clientReady) => {

    if(clientReady){
        await nextTick(() => {
            if(identifierInput.value){
                //@ts-ignore
                identifierInput.value.$refs.input.focus();
            }
        });
    }
});

const identifier = ref(presetUsername);
const password = ref(presetPassword);
const remember = ref(false);

function handleLogin(){
    login({
        identifier: identifier.value,
        password: password.value,
        remember: remember.value
    });
}

const monthlySalary = ref(0);

const contributionHeaders = reactive<TableHeaderT[]>([
    { text: 'SSS contribution', value: 'sss'},
    { text: 'Philhealth (PHIC)', value: 'philhealth'},
    { text: 'Pag-IBIG (HDMF)', value: 'pag_ibig'},
]);
const contributionData = ref([]);

const taxableHeaders = reactive<TableHeaderT[]>([
    { text: 'Taxable', value: 'taxable'},
    { text: 'Compensation tax (WTC)', value: 'withholding_tax'},
    { text: 'Net', value: 'net'},
]);
const taxableData = ref([]);


const calculateTaxPending = ref(false);
const calculateTax = async() =>{

    if(import.meta.server){
        return;
    }

    calculateTaxPending.value = true;

    await laraFetch(`/api/monthly-salary-calculate-tax`, {
        method: 'POST',
        body: {
            monthly_salary: monthlySalary.value
        }
    }, {
        onRequestError: () => {
            calculateTaxPending.value = false;
        },
        onResponse: () => {
            calculateTaxPending.value = false;
        },
        onSuccessResponse: async (request, options, response) => {

            let result = _get(response, '_data.values.result', {});

            //@ts-ignore
            contributionData.value = [result.contributions];
            //@ts-ignore
            taxableData.value = [result.taxable];
        }
    }, true);
}
</script>

<style scoped>
.container {
    @apply flex justify-center items-center text-center mx-auto;
}
</style>
