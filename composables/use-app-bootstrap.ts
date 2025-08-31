import {storeToRefs} from "pinia";

export const useAppBootstrap = () => {

    const {storeAssociatedCompanies} = useAssociation();
    const {fetchOrganizationSelections} = useCommon();
    const {$themeStore, $layoutStore} = useNuxtApp();
    const {isAuthenticated} = useAuth();

    const {
        activeSubNavigationLink,
    } = useLayout();

    const boot = async() => {

        await storeAssociatedCompanies();

        if(isAuthenticated.value){
            await fetchOrganizationSelections();
        }

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
        boot,
    }
}