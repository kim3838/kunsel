import {storeToRefs} from "pinia";

export const useAppBootstrap = () => {

    const {storeAssociatedCompanies} = useAssociation();
    const {$themeStore, $layoutStore} = useNuxtApp();

    const {
        activeSubNavigationLink,
    } = useLayout();

    const ssrBoot = async () => {

        if(process.client) return;

        const {ssrFetchAssociatedCompanies} = useAssociation();
        const {isAuthenticated} = useAuth();

        if(isAuthenticated.value){
            await ssrFetchAssociatedCompanies();
        }
    }

    const boot = async() => {

        await storeAssociatedCompanies();

        $layoutStore.setSubNavigationOptions(_get(activeSubNavigationLink.value, 'options', []));

        const {
            appTheme,
            body: bodyColor,
        } = storeToRefs($themeStore);

        document.body.style.backgroundColor = bodyColor.value;

        watch(appTheme, (newTheme) => {
            document.body.style.backgroundColor = bodyColor.value;
        });
    }

    return {
        ssrBoot,
        boot,
    }
}