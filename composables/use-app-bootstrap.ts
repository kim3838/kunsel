
import {storeToRefs} from "pinia";
import type {PaletteName} from "@/public/js/types/theme";

export const useAppBootstrap = () => {

    const {sessionDomain} = useRuntimeConfig().public;
    const {storeAssociatedCompanies} = useAssociation();
    const {fetchOrganizationSelections} = useCommon();
    const {$themeStore, $layoutStore} = useNuxtApp();

    const {
        activeSubNavigationLink,
    } = useLayout();

    const boot = async() => {

        await storeAssociatedCompanies();
        await fetchOrganizationSelections();

        $layoutStore.setSubNavigationOptions(_get(activeSubNavigationLink.value, 'options', []));

        const {
            appTheme,
            body: bodyColor,
        } = storeToRefs($themeStore);

        const storedTheme = useCookie<PaletteName>($themeStore.SELECTED_THEME_STORAGE_KEY,{
            domain: sessionDomain,
            sameSite: 'lax',
        });

        if(storedTheme.value == undefined){
            storedTheme.value = 'default-blue';
        }

        $themeStore.setTheme(storedTheme.value);

        document.body.style.backgroundColor = bodyColor.value;

        watch(appTheme, (newTheme) => {
            document.body.style.backgroundColor = bodyColor.value;
        });
    }

    return {
        boot,
    }
}