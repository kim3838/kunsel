export default defineNuxtPlugin({
    enforce: 'pre',

    async setup(nuxtApp){

        if(import.meta.server){

            const {ssrFetchAssociatedCompanies, ssrFetchUserIsAdminInAnyCompany} = useAssociation();
            const {ssrFetchPayrollComponentPaySelections, ssrFetchTimezoneSelections, setStoredThemeType} = useCommon();
            const {isAuthenticated} = useAuth();

            if(isAuthenticated.value){
                await ssrFetchAssociatedCompanies();
                await ssrFetchUserIsAdminInAnyCompany();
                await ssrFetchPayrollComponentPaySelections();
                await ssrFetchTimezoneSelections();
                await setStoredThemeType();
            }
        }
    },
});