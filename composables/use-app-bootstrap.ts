import {storeToRefs} from "pinia";

export const useAppBootstrap = () => {

    const {storeAssociatedCompanies} = useAssociation();
    const {$themeStore} = useNuxtApp();

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