<template>
    <ol class="min-h-8 flex flex-wrap items-center space-x-1">

        <li v-if="prefixArrow && breadcrumbs.length > 0" class="shrink-0 flex items-center">
            <Icon class="h-5 w-5" name="ic:sharp-keyboard-arrow-right"/>
        </li>

        <li v-for="(breadcrumb, index) in breadcrumbs" :key="index" class="shrink-0 flex items-center" :class="[fontClass]">
            <span>
                {{ breadcrumb.name }}
            </span>
            <span v-if="index < breadcrumbs.length - 1" class="flex items-center">
                <Icon class="h-5 w-5" name="ic:sharp-keyboard-arrow-right"/>
            </span>
        </li>
    </ol>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";

interface Breadcrumb {
    name: string;
    to?: string;
}

const route = useRoute();
const router = useRouter();

const nuxtApp = useNuxtApp();

const {
    selectedAssociatedCompany
} = storeToRefs(nuxtApp.$authStore);

const props = defineProps({
    prefixArrow: {
        type: Boolean,
        default: false,
    },
    prefixCompany: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: 'md',
    },
});

const fontClass = computed(() => {
    return {
        'sm': 'text-sm',
        'md': 'text-base',
        'lg': 'text-lg',
    }[props.size];
});

const breadcrumbs = computed((): Breadcrumb[] => {
    const pathSegments = route.path.split('/').filter(segment => segment !== '');
    const breadcrumbs: Breadcrumb[] = [];

    if(props.prefixCompany && selectedAssociatedCompany?.value){
        breadcrumbs.push({name: selectedAssociatedCompany.value.text});
    }

    // Add home breadcrumb breadcrumbs.push({name: 'Home', to: '/'});

    pathSegments.forEach((segment, index) => {

        // Skip if this segment looks like a parameter (you can customize this logic)
        // In your case, the ID "01K3DDQ4SJ382NZ12C4AHQSVTK" should be skipped
        const isParameter = /^[A-Z0-9]{26}$/.test(segment) || // ULID pattern
            /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(segment) || // UUID pattern
            /^\d+$/.test(segment) || // Numeric ID
            /^[a-f0-9]{64}$/.test(segment); // Hash token pattern (64 hex characters)

        if (!isParameter) {
            // Capitalize and format the segment name
            const name = segment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            breadcrumbs.push({
                name
            });
        }
    });

    return breadcrumbs;
});
</script>


<style scoped>

</style>